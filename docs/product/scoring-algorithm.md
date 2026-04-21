# Scoring Algorithm — Technical Specification

**Version 1.0 · April 2026**
**Companion to:** `/docs/editorial/about-scoring.md` (public-facing rubric), `/docs/decisions/0005-algorithm-weights.md`, `/docs/decisions/0008-external-data-providers.md`

---

## Purpose

This document specifies the implementation of the BestPhilippines scoring algorithm. It's written for engineers (human or AI) building or modifying the scoring pipeline. The public-facing rubric at `/about/scoring` describes *what* we score and *why*; this document describes *how*.

If any content in this document contradicts the public rubric or an ADR, the ADR wins. Update this document, not the ADR.

---

## The core equation

```
final_score = clamp(
  algorithmic_score + editorial_boost,
  5.0,  // floor for public listing
  10.0  // ceiling
)

where:

algorithmic_score =
    (w_google        * google_normalized)
  + (w_volume        * volume_score)
  + (w_recency       * recency_score)
  + (w_cross_platform * cross_platform_score)

editorial_boost ∈ [-1.0, +1.0]  // bounded
```

Every sub-score returns a value on the 0.0–10.0 scale. Weights sum to 0.90 (the remaining 10% is the editorial boost envelope; the boost itself is applied additively, not as a weighted component).

---

## Weights by category

Stored as versioned config, not hard-coded. See schema section below.

### Restaurants (default)

| Component | Weight | Symbol |
|---|---|---|
| Google rating (normalized) | 0.35 | `w_google` |
| Review volume (log-scaled) | 0.20 | `w_volume` |
| Recency (time-decayed) | 0.20 | `w_recency` |
| Cross-platform signal | 0.15 | `w_cross_platform` |
| Editorial boost envelope | ±0.10 (±1.0 absolute) | `boost_max` |

### Bars and cocktail venues

| Component | Weight |
|---|---|
| Google rating | 0.35 |
| Review volume | 0.15 |
| Recency | 0.25 |
| Cross-platform | 0.15 |
| Editorial boost | ±0.10 |

### Nightclubs

| Component | Weight |
|---|---|
| Google rating | 0.25 |
| Review volume | 0.15 |
| Recency | 0.30 |
| Cross-platform | 0.20 |
| Editorial boost | ±0.10 |

### Cafés

Restaurant weights, plus a **consistency penalty**: if the standard deviation of Google review ratings exceeds 1.2 stars, subtract 0.3 from the final algorithmic score. Rationale: a café should taste the same on Tuesday as on Saturday.

---

## Sub-score definitions

### 1. Google rating (normalized)

```
google_normalized = google_avg_rating * 2
```

Google returns an average on the 1.0–5.0 scale. Double it to map to the 0.0–10.0 scale. A 4.5-star place contributes 9.0 to this component; a 3.2 contributes 6.4.

**Edge cases:**
- `google_avg_rating === null` → venue is not scored. Cannot compute without primary source.
- `google_avg_rating < 1.0` → treat as 1.0. Google's minimum.
- `google_avg_rating > 5.0` → impossible, but if returned, log an error and treat as 5.0.

### 2. Review volume (log-scaled)

```
const VOLUME_CAP = 1000

volume_score = min(
  log10(review_count + 1) / log10(VOLUME_CAP + 1),
  1.0
) * 10
```

Logarithmic because a venue with 2,000 reviews should not score twice as high as one with 1,000. The `+ 1` inside the log prevents `log10(0)` when a venue meets the threshold but has few reviews. Cap at `VOLUME_CAP = 1000` — beyond this, additional reviews stop meaningfully moving the score.

**Worked examples:**
- 50 reviews (minimum threshold): `log10(51) / log10(1001) ≈ 0.587` → `5.87`
- 100 reviews: `6.66`
- 500 reviews: `8.98`
- 1,000 reviews: `10.00`
- 10,000 reviews: capped at `10.00`

### 3. Recency (time-decayed)

```
recency_score = weighted_average(
  reviews,
  weight_fn: (review) => recency_weight(review.date)
)

recency_weight(date) =
  months_old <= 12  → 1.0
  months_old <= 24  → 0.7
  months_old <= 36  → 0.4
  months_old > 36   → 0.1
```

The recency score is the weighted average of the venue's review ratings, where each review's weight is determined by age. Then map to 0–10 scale via `* 2` (same as Google).

**Alternative implementation note:** if we cannot access individual review dates from the Google Places API response (the Places API exposes the `review.time` field, so this should work, but verify at implementation), we fall back to using Google's `reviews_age_distribution` or approximate from review count velocity. Flag as open question.

### 4. Cross-platform signal

```
cross_platform_score = weighted_average(
  available_platforms,
  weight_by: data_availability
)
```

For each platform we have data on (TripAdvisor, optionally Foursquare, optionally Facebook Places), compute a normalized score using the same star-doubling method as Google. Take a weighted average across available platforms.

**Platform availability logic:**

- If TripAdvisor + Foursquare + Facebook all available → weight equally (0.33 each)
- If TripAdvisor + one other → 0.6 / 0.4 (TripAdvisor primary)
- If only TripAdvisor → `cross_platform_score = tripadvisor_normalized`
- If none available → redistribute the 0.15 weight proportionally across Google (35%) and volume (20%) per ADR 0008. Flag venue internally as "single-source scored."

**Disagreement detection:**

```
disagreement = max(platform_scores) - min(platform_scores)

if disagreement > 2.5 {
  flag_for_human_review(venue_id, reason: "cross_platform_disagreement")
  // Score still computes; human review runs async
}
```

### 5. Editorial boost

```
editorial_boost ∈ [-1.0, +1.0]
```

Applied additively after the weighted composite. Stored separately from the algorithmic score so both can be displayed on entry pages.

```
Algorithmic score: 7.4 · Editorial adjustment: +0.6 · BestPhilippines score: 8.0
```

Database constraint: `CHECK (editorial_boost >= -1.0 AND editorial_boost <= 1.0)`.

---

## Eligibility gate

Before any of the above runs, a venue must pass the eligibility gate:

```typescript
function isEligibleForScoring(venue: Venue): boolean {
  return (
    venue.google_review_count >= 50 &&
    venue.months_since_opening >= 3 &&
    venue.google_avg_rating !== null &&
    !venue.is_editorial_delisted
  )
}
```

Venues that fail this check are **not scored** — they're stored in the database but excluded from all public queries and the recompute cron.

**Exceptions:**
- **Best New Table candidates** can be editorially listed before meeting the threshold. See `/docs/decisions/0006-bnt-threshold.md`. BNT entries store an `editorial_score_at_award` separately; they do not bypass the algorithmic pipeline — they run in parallel until the venue meets the threshold, at which point the algorithm takes over.

---

## The 5.0 floor

Per ADR 0002, venues scoring below 5.0 are not published.

**Implementation:** every public-facing query must include `WHERE final_score >= 5.0`. Enforced at the query helper level:

```typescript
// lib/queries/venues.ts
export function publicVenueQuery() {
  return supabase
    .from('venues')
    .select('*')
    .gte('final_score', 5.0)  // non-negotiable
    .eq('is_published', true)
}
```

Admin queries use a different helper (`adminVenueQuery`) that can see sub-5.0 venues for monitoring.

---

## Database schema

### `scoring_config` — versioned weights and constants

```sql
CREATE TABLE scoring_config (
  id BIGSERIAL PRIMARY KEY,
  version TEXT NOT NULL UNIQUE,             -- e.g., "1.0", "1.1"
  category TEXT NOT NULL,                   -- 'restaurant', 'bar', 'nightclub', 'cafe'
  w_google NUMERIC(3,2) NOT NULL,
  w_volume NUMERIC(3,2) NOT NULL,
  w_recency NUMERIC(3,2) NOT NULL,
  w_cross_platform NUMERIC(3,2) NOT NULL,
  boost_max NUMERIC(3,1) NOT NULL DEFAULT 1.0,
  volume_cap INTEGER NOT NULL DEFAULT 1000,
  consistency_penalty_threshold NUMERIC(3,2),  -- for cafes; NULL for others
  consistency_penalty_amount NUMERIC(3,1),     -- for cafes; NULL for others
  is_active BOOLEAN NOT NULL DEFAULT false,
  activated_at TIMESTAMPTZ,
  deactivated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

-- Only one version active per category at a time
CREATE UNIQUE INDEX idx_scoring_config_active_per_category
  ON scoring_config(category)
  WHERE is_active = true;

-- Weights (excluding boost) must sum to 0.90
ALTER TABLE scoring_config ADD CONSTRAINT weights_sum_check
  CHECK (abs((w_google + w_volume + w_recency + w_cross_platform) - 0.90) < 0.001);
```

### `venue_scores` — current score for each venue

```sql
CREATE TABLE venue_scores (
  venue_id BIGINT PRIMARY KEY REFERENCES venues(id) ON DELETE CASCADE,
  algorithmic_score NUMERIC(3,1) NOT NULL,
  editorial_boost NUMERIC(3,1) NOT NULL DEFAULT 0.0,
  final_score NUMERIC(3,1) NOT NULL,
  config_version TEXT NOT NULL REFERENCES scoring_config(version),
  last_computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  data_providers JSONB NOT NULL,   -- which sources contributed
  sub_scores JSONB NOT NULL,        -- each component's raw output, for audit

  CONSTRAINT algorithmic_score_range CHECK (algorithmic_score >= 0.0 AND algorithmic_score <= 10.0),
  CONSTRAINT editorial_boost_range   CHECK (editorial_boost >= -1.0 AND editorial_boost <= 1.0),
  CONSTRAINT final_score_range       CHECK (final_score >= 0.0 AND final_score <= 10.0)
);
```

### `score_history` — append-only log of every recompute

```sql
CREATE TABLE score_history (
  id BIGSERIAL PRIMARY KEY,
  venue_id BIGINT NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  algorithmic_score NUMERIC(3,1) NOT NULL,
  editorial_boost NUMERIC(3,1) NOT NULL,
  final_score NUMERIC(3,1) NOT NULL,
  config_version TEXT NOT NULL,
  computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  trigger TEXT NOT NULL,            -- 'weekly_cron', 'nightly_refresh', 'editor_visit', 'boost_applied', 'manual'
  data_snapshot JSONB                -- raw inputs at time of compute, for reproducibility
);

CREATE INDEX idx_score_history_venue_time
  ON score_history(venue_id, computed_at DESC);
```

This is the table powering the sparkline on each venue page. Never truncated. The storage cost is trivial.

### `editorial_boost_log` — audit of every boost adjustment

```sql
CREATE TABLE editorial_boost_log (
  id BIGSERIAL PRIMARY KEY,
  venue_id BIGINT NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  editor_id BIGINT NOT NULL REFERENCES editors(id),
  boost_before NUMERIC(3,1) NOT NULL,
  boost_after NUMERIC(3,1) NOT NULL,
  algorithmic_score_at_time NUMERIC(3,1) NOT NULL,
  reason_category TEXT NOT NULL,      -- 'visit_contradicts_data', 'seasonal_consistency', 'chef_change', 'ownership_change', 'service_pattern', 'other'
  reason_text TEXT NOT NULL,          -- written justification
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT boost_values_valid CHECK (
    boost_before >= -1.0 AND boost_before <= 1.0 AND
    boost_after >= -1.0 AND boost_after <= 1.0
  ),
  CONSTRAINT reason_text_not_empty CHECK (length(trim(reason_text)) > 0)
);
```

Per CLAUDE.md rule 4: every boost writes a row here. No silent adjustments.

### `anomaly_flags` — venues flagged for human review

```sql
CREATE TABLE anomaly_flags (
  id BIGSERIAL PRIMARY KEY,
  venue_id BIGINT NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  flag_type TEXT NOT NULL,           -- 'large_score_change', 'cross_platform_disagreement', 'review_velocity_spike'
  flag_data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolved_by BIGINT REFERENCES editors(id),
  resolution_notes TEXT,

  CONSTRAINT resolution_complete CHECK (
    (resolved_at IS NULL AND resolved_by IS NULL) OR
    (resolved_at IS NOT NULL AND resolved_by IS NOT NULL)
  )
);

CREATE INDEX idx_anomaly_flags_unresolved
  ON anomaly_flags(created_at DESC)
  WHERE resolved_at IS NULL;
```

Pending rows surface in the admin dashboard. Venues with unresolved flags can still be queried, but large-score-change flags **hold the score update in staging** until resolved — see "Anomaly review" below.

---

## The recompute pipeline

### Nightly refresh (1/7 of database)

Runs at 02:00 Asia/Manila (18:00 UTC). Picks venues in a rolling 7-day cycle so every venue refreshes at least weekly.

```typescript
// app/api/cron/nightly-refresh/route.ts

export async function GET(request: Request) {
  verifyVercelCronAuth(request)

  const dayOfWeek = new Date().getUTCDay() // 0..6
  const venuesToRefresh = await supabase
    .from('venues')
    .select('id')
    .eq('is_eligible', true)
    .filter('id', 'gte', dayOfWeek * SHARD_SIZE)
    .filter('id', 'lt', (dayOfWeek + 1) * SHARD_SIZE)

  // Dispatch to chunks to stay under Vercel 60s timeout
  for (const chunk of chunked(venuesToRefresh, CHUNK_SIZE)) {
    await fetch(`${origin}/api/cron/refresh-chunk`, {
      method: 'POST',
      body: JSON.stringify({ venue_ids: chunk.map(v => v.id) }),
    })
  }
}
```

Per venue in the chunk:

1. Fetch latest Google Places data
2. Fetch TripAdvisor / Foursquare / Facebook where configured
3. Store raw data in `venue_data_snapshots` (for audit and replay)
4. Recompute all sub-scores
5. Compare new `algorithmic_score` to previous
6. If delta > 0.3 → write anomaly flag, hold update in staging
7. Else → update `venue_scores`, write `score_history` row

### Weekly full recompute

Runs Sunday 03:00 Asia/Manila. Same logic as nightly but runs over the entire eligible venue set, not just one shard. Used as a consistency check and to apply config changes that haven't been applied yet.

### On-demand recompute

Triggered by:
- Editor applies or modifies an editorial boost
- Editor logs a visit (may or may not change the boost)
- Manual recompute request from admin dashboard

On-demand recomputes **skip the nightly data fetch** — they use whatever data is in the latest `venue_data_snapshots` row. They only run the math.

### Anomaly review

When a recompute produces a delta > 0.3 on `algorithmic_score`:

1. New score is written to a `staging_score` column on `venue_scores`, not the live column
2. An `anomaly_flags` row is created with `flag_type = 'large_score_change'`
3. The venue's public score (`final_score`) does not change until an editor resolves the flag
4. Resolution options: accept (promote staging to live), reject (discard staging, keep live), override (set a custom value with written reason — logged separately as an editorial boost)

This is the primary defense against coordinated review-bombing. The flag must exist as schema, the staging hold must be enforced in code, and the resolution UI must exist in the admin dashboard.

---

## External data fetching

### Google Places API

- Use the `places.getPlace` and `places.searchText` endpoints
- Store the full response in `venue_data_snapshots` for audit
- Fields required: `displayName`, `rating`, `userRatingCount`, `reviews[]`, `priceLevel`, `regularOpeningHours`, `editorialSummary`, `types`, `businessStatus`
- Respect Google's quota: single-field masks, batch requests where possible

**Caching policy:** Google Places data is cached per venue for 24 hours minimum. The nightly refresh is the primary cache-buster. Do not re-fetch on every page view.

### TripAdvisor Content API

- Requires application approval for commercial use
- Endpoint: `location/{locationId}/details` and `location/{locationId}/reviews`
- Cross-reference with Google Place ID via TripAdvisor's location search

**If TripAdvisor API access is pending or denied**, run the algorithm with `cross_platform_score = null` and redistribute the 0.15 weight per ADR 0008. Do not scrape.

### Foursquare Places API (optional)

Evaluate at implementation. If Philippine venue coverage is thin, skip this provider for Phase 1 and revisit in Phase 2.

### Facebook Places (optional)

Facebook Graph API access for place ratings has been restricted over multiple policy cycles. Verify current API terms before implementing. If the path is via scraping or third-party aggregators, do not ship in Phase 1 — flag for separate ADR.

### FX rates (for price tier display, not scoring)

- Use `exchangerate.host` free tier
- Cache rates for 1 hour minimum
- Fallback on stale rates if the API is down — never block page render on FX

---

## Implementation notes for Claude Code

### Do test the math

Unit tests on the scoring pipeline are non-negotiable (per CLAUDE.md). Required test cases at minimum:

- Each sub-score with edge inputs (0 reviews, null rating, review count at exactly 50, at 1000, at 10000)
- Weight configuration with each category variant
- Editorial boost at +1.0, -1.0, 0, and values outside bounds (should reject)
- Final score clamping (algorithmic 6.0 + boost -1.5 should be rejected at insert, not silently clamped)
- Anomaly threshold (delta of 0.29, 0.30, 0.31 — verify boundary handling)
- Cross-platform with 0, 1, 2, 3 platforms available

### Don't bypass the constraints

Database CHECK constraints on `editorial_boost` (±1.0) and `final_score` (0.0–10.0) exist for a reason. Do not disable them to "handle" bad input. Bad input should fail loudly.

### Don't invent sub-scores

The algorithm's inputs are specified in ADR 0005. Adding a new input (e.g., "Instagram follower count," "menu price signal," "chef pedigree") requires a new ADR. Don't slip them into the composite.

### Don't round intermediate values

Compute at full floating-point precision throughout. Round only at display time, with `toFixed(1)`. Rounding intermediate values introduces compounding error.

### Don't read the final score from cache without a version check

If `config_version` in `venue_scores` doesn't match the currently active config, the score is stale. Either recompute on read or show a "stale" indicator. Do not silently serve outdated scores against a new config.

---

## Observability

Every scoring operation emits structured logs:

```typescript
logger.info('score_computed', {
  venue_id,
  algorithmic_score,
  editorial_boost,
  final_score,
  config_version,
  sub_scores: { google, volume, recency, cross_platform },
  data_providers: ['google', 'tripadvisor'],
  duration_ms,
  trigger,
})
```

These feed into:
- **Admin dashboard score-health view** — anomaly rate, average delta per recompute, stale config count
- **Weekly editorial report** — auto-generated, emails Martin and Yahnee every Monday with top 10 score movers, unresolved anomaly count, boost log summary
- **Error alerting** — Sentry or equivalent. Score pipeline failures are high-severity.

---

## Open questions and v1.1 candidates

- **Category baseline adjustment.** Currently a 4.5-star ice cream shop contributes the same 9.0 to Google score as a 4.5-star fine-dining room. Should we adjust Google rating normalization for category baseline inflation? Requires research into category distributions across our venue set. Flagged in ADR 0005.
- **Review quality weighting.** A 5-star review with 200 words of detail is more signal than a 5-star review with "Good!". The Google Places API does return review text — do we weight long-form reviews higher? Complex, worth considering for v1.1.
- **Language weighting.** Reviews in Tagalog/Bisaya from local reviewers may carry different signal than reviews in English from tourists. Worth investigating once we have real data.
- **Editorial visit recency.** Should an editorial boost decay if the editorial visit was 18+ months ago? Currently boosts persist until an editor changes them. Consider a quarterly boost review process.
- **Seasonal venues.** Rooftop bars score differently in rainy vs dry season in Manila. Does the algorithm need seasonal awareness, or is that better left to editorial judgment? Default to the latter in v1.0; revisit if data shows seasonal review bias.

---

## Version history

- **v1.0 — April 2026.** Initial technical specification.

---

*For algorithm questions or proposed changes, open a PR against this document and the relevant ADR. Algorithm changes must be discussed before implementation.*
