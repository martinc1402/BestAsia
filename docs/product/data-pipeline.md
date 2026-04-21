# Data Pipeline — Technical Specification

**Version 1.0 · April 2026**
**Companion to:** `/docs/product/scoring-algorithm.md`, `/docs/decisions/0005-algorithm-weights.md`, `/docs/decisions/0008-external-data-providers.md`

---

## Purpose

This document specifies the full data architecture for BestPhilippines — the schema, the external data ingestion, the cron jobs, the admin workflows, and the operational patterns that keep it running. The scoring algorithm spec covers the math; this document covers everything else the math depends on.

If any content here contradicts an ADR, the ADR wins. Update this document, not the ADR.

---

## System overview

```
┌─────────────────────────────────────────────────────────────┐
│                    External data sources                     │
│  Google Places · TripAdvisor · Foursquare · Facebook Places │
└────────────────────────────┬────────────────────────────────┘
                             │ fetch
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              Ingestion layer (Vercel Cron)                   │
│        Nightly refresh (1/7 shard) · Weekly full             │
└────────────────────────────┬────────────────────────────────┘
                             │ persist raw
                             ▼
┌─────────────────────────────────────────────────────────────┐
│               Supabase (Postgres + RLS)                      │
│                                                               │
│  venues · venue_data_snapshots · venue_scores · score_history│
│  editorial_boost_log · anomaly_flags · bnt_awards            │
│  lists · pitch_submissions · editors · scoring_config        │
└────────────────────────────┬────────────────────────────────┘
                             │ read
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                 Next.js app (Vercel)                         │
│       Public site · Admin dashboard · API routes             │
└─────────────────────────────────────────────────────────────┘
```

---

## Full database schema

All tables live in Supabase Postgres. Row-level security (RLS) policies enforce the public/admin boundary — `WHERE final_score >= 5.0` on public reads, unrestricted on admin reads.

### Core entities

#### `venues`

The master record. One row per place. Every other table references this.

```sql
CREATE TABLE venues (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,                    -- kebab-case, URL-safe
  name TEXT NOT NULL,
  category TEXT NOT NULL,                       -- 'restaurant' | 'bar' | 'nightclub' | 'cafe'
  cuisine TEXT[],                               -- e.g., ['filipino', 'regional_cebuano']
  neighborhood TEXT NOT NULL,                   -- e.g., 'Poblacion', 'BGC'
  city TEXT NOT NULL,                           -- 'Manila' | 'Cebu' (Phase 1: Manila only)
  address TEXT NOT NULL,
  coordinates GEOGRAPHY(POINT, 4326),           -- PostGIS; lat/lng
  google_place_id TEXT UNIQUE,                  -- canonical external ID
  tripadvisor_location_id TEXT,
  foursquare_fsq_id TEXT,
  facebook_page_id TEXT,
  opened_at DATE NOT NULL,                      -- used for 3+ months eligibility
  price_tier INTEGER NOT NULL,                  -- 1..4 mapped to ₱/₱₱/₱₱₱/₱₱₱₱
  price_tier_range_php INT4RANGE,               -- e.g., '[400, 800]'
  hero_image_url TEXT,
  gallery_image_urls TEXT[],
  website_url TEXT,
  phone TEXT,
  is_eligible BOOLEAN NOT NULL DEFAULT false,   -- passes eligibility gate
  is_published BOOLEAN NOT NULL DEFAULT false,  -- editor-controlled publish state
  is_editorial_delisted BOOLEAN NOT NULL DEFAULT false,  -- food safety, legal, closed
  editorial_delisted_reason TEXT,
  permanently_closed_at DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT valid_category CHECK (category IN ('restaurant', 'bar', 'nightclub', 'cafe')),
  CONSTRAINT valid_price_tier CHECK (price_tier BETWEEN 1 AND 4),
  CONSTRAINT delisted_needs_reason CHECK (
    (is_editorial_delisted = false) OR
    (is_editorial_delisted = true AND editorial_delisted_reason IS NOT NULL)
  )
);

CREATE INDEX idx_venues_eligible_published ON venues(is_eligible, is_published);
CREATE INDEX idx_venues_category_city ON venues(category, city);
CREATE INDEX idx_venues_neighborhood ON venues(neighborhood);
CREATE INDEX idx_venues_slug ON venues(slug);
```

Notes:
- `is_eligible` is computed by the ingestion pipeline based on review count and opened_at. Not manually set.
- `is_published` is the editor's control. A venue can be eligible but unpublished (e.g., pending editorial review).
- `is_editorial_delisted` is the escape hatch for situations where a venue must not appear regardless of score. Documented reason required.

#### `venue_data_snapshots`

Raw ingestion data. Append-only. Used for audit, reproducibility, and the nightly scoring recompute.

```sql
CREATE TABLE venue_data_snapshots (
  id BIGSERIAL PRIMARY KEY,
  venue_id BIGINT NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,                       -- 'google' | 'tripadvisor' | 'foursquare' | 'facebook'
  raw_response JSONB NOT NULL,                  -- full provider response
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fetch_duration_ms INTEGER,
  fetch_cost_usd NUMERIC(7,4),                  -- for Google Places billing tracking

  CONSTRAINT valid_provider CHECK (provider IN ('google', 'tripadvisor', 'foursquare', 'facebook'))
);

CREATE INDEX idx_snapshots_venue_provider_time
  ON venue_data_snapshots(venue_id, provider, fetched_at DESC);
```

Retention: keep the last 90 days of snapshots per venue. Older snapshots archived to Supabase Storage as compressed JSON, queryable on demand but not in the hot DB.

#### `scoring_config`, `venue_scores`, `score_history`, `editorial_boost_log`, `anomaly_flags`

Defined in `/docs/product/scoring-algorithm.md`. See that document for full schemas.

### Canon and stamps

#### `lists`

Canon lists. Dynamically generated from scores + filters, not manually curated.

```sql
CREATE TABLE lists (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,                    -- e.g., 'best-filipino-restaurants-manila'
  title TEXT NOT NULL,                          -- generated; see ADR 0004
  subtitle TEXT,                                -- editorial hook line
  category TEXT,                                -- 'restaurant' | 'bar' | 'nightclub' | 'cafe' | null (mixed)
  city TEXT NOT NULL,
  neighborhood TEXT,
  filter_criteria JSONB NOT NULL,               -- the query that generates list membership
  min_score NUMERIC(3,1) NOT NULL DEFAULT 7.0,  -- list-specific quality bar
  max_length INTEGER NOT NULL DEFAULT 10,
  is_featured BOOLEAN NOT NULL DEFAULT false,   -- hero placement on /canon
  is_published BOOLEAN NOT NULL DEFAULT false,
  last_regenerated_at TIMESTAMPTZ,
  byline TEXT NOT NULL DEFAULT 'BestPhilippines editors',  -- see ADR 0003
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### `list_entries`

Membership in a list. Rebuilt every list regeneration; not manually edited.

```sql
CREATE TABLE list_entries (
  id BIGSERIAL PRIMARY KEY,
  list_id BIGINT NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
  venue_id BIGINT NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL,                        -- 1-based position
  score_at_generation NUMERIC(3,1) NOT NULL,    -- for historical accuracy
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (list_id, venue_id),
  UNIQUE (list_id, rank)
);

CREATE INDEX idx_list_entries_list_rank ON list_entries(list_id, rank);
```

#### `bnt_awards`

Best New Table stamps. Editorial-only. See ADR 0006.

```sql
CREATE TABLE bnt_awards (
  id BIGSERIAL PRIMARY KEY,
  venue_id BIGINT NOT NULL UNIQUE REFERENCES venues(id) ON DELETE CASCADE,
  awarded_at DATE NOT NULL,
  awarding_editor_id BIGINT NOT NULL REFERENCES editors(id),
  editorial_visit_date DATE NOT NULL,
  editorial_score_at_award NUMERIC(3,1) NOT NULL,
  rationale TEXT NOT NULL,                      -- why this venue, why now
  visit_conducted_by TEXT NOT NULL,             -- editor name or 'contract_visit'
  visit_conductor_name TEXT,                    -- if contract visit, who
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT bnt_threshold_check CHECK (editorial_score_at_award >= 8.5),
  CONSTRAINT rationale_not_empty CHECK (length(trim(rationale)) > 0)
);

CREATE INDEX idx_bnt_awards_awarded_at ON bnt_awards(awarded_at DESC);
```

The `CHECK (editorial_score_at_award >= 8.5)` is load-bearing — it enforces the BNT threshold at the database level. Per CLAUDE.md rule 8, BNT cannot be created via any path that bypasses this constraint.

### Editorial and operational

#### `editors`

The editorial team. Phase 1: two rows.

```sql
CREATE TABLE editors (
  id BIGSERIAL PRIMARY KEY,
  auth_user_id UUID UNIQUE REFERENCES auth.users(id),  -- Supabase Auth
  name TEXT NOT NULL,
  role TEXT NOT NULL,                           -- 'editor_in_chief' | 'senior_editor' | 'contributing'
  is_active BOOLEAN NOT NULL DEFAULT true,
  can_apply_boost BOOLEAN NOT NULL DEFAULT false,
  can_award_bnt BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT valid_role CHECK (role IN ('editor_in_chief', 'senior_editor', 'contributing'))
);

-- Phase 1 seed
INSERT INTO editors (name, role, is_active, can_apply_boost, can_award_bnt)
VALUES
  ('Martin Casey', 'editor_in_chief', true, true, true),
  ('Yahnee Ortiz', 'editor_in_chief', true, true, true);
```

#### `pitch_submissions`

Reader-submitted venues via "Pitch a Place." Queue for editorial review.

```sql
CREATE TABLE pitch_submissions (
  id BIGSERIAL PRIMARY KEY,
  venue_name TEXT NOT NULL,
  location_hint TEXT NOT NULL,                  -- address, neighborhood, landmark
  why_it_matters TEXT NOT NULL,
  submitter_email TEXT NOT NULL,
  submitter_name TEXT,
  status TEXT NOT NULL DEFAULT 'new',           -- 'new' | 'under_review' | 'approved' | 'approved_for_bnt' | 'rejected' | 'insufficient_data'
  reviewed_by BIGINT REFERENCES editors(id),
  reviewed_at TIMESTAMPTZ,
  decision_notes TEXT,
  resulting_venue_id BIGINT REFERENCES venues(id),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT valid_status CHECK (status IN ('new', 'under_review', 'approved', 'approved_for_bnt', 'rejected', 'insufficient_data'))
);

CREATE INDEX idx_pitch_status_submitted ON pitch_submissions(status, submitted_at DESC);
```

#### `rereview_requests`

Venue-submitted re-review requests per the policy page.

```sql
CREATE TABLE rereview_requests (
  id BIGSERIAL PRIMARY KEY,
  venue_id BIGINT NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  reason_category TEXT NOT NULL,                -- 'chef_change' | 'ownership_change' | 'renovation' | 'dated_reviews' | 'factual_dispute'
  reason_text TEXT NOT NULL,
  submitter_email TEXT NOT NULL,
  submitter_role TEXT,                          -- 'owner', 'manager', etc.
  status TEXT NOT NULL DEFAULT 'pending',
  reviewed_by BIGINT REFERENCES editors(id),
  decision TEXT,                                -- 'revisit_scheduled' | 'declined' | 'already_scheduled'
  decision_notes TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);
```

#### `venue_responses`

Right-of-reply paragraphs submitted by venues.

```sql
CREATE TABLE venue_responses (
  id BIGSERIAL PRIMARY KEY,
  venue_id BIGINT NOT NULL UNIQUE REFERENCES venues(id) ON DELETE CASCADE,
  response_text TEXT NOT NULL,
  submitter_email TEXT NOT NULL,
  verified_at TIMESTAMPTZ,                      -- email verification from venue domain
  is_published BOOLEAN NOT NULL DEFAULT false,
  edited_for_accuracy BOOLEAN NOT NULL DEFAULT false,
  edit_notes TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ,

  CONSTRAINT response_length CHECK (length(response_text) <= 1200)  -- ~150 words
);
```

One response per venue (the latest replaces the previous). Always labeled "Response from [Venue Name]" on the entry page.

---

## External data ingestion

### Google Places API

**Primary data source.** Every venue in the database has a `google_place_id`.

#### Fields we fetch

Using the New Places API (`places.getPlace`):

```
fieldMask: [
  'id',
  'displayName',
  'formattedAddress',
  'location',
  'rating',
  'userRatingCount',
  'reviews.rating',
  'reviews.publishTime',
  'reviews.text',
  'priceLevel',
  'priceRange',
  'regularOpeningHours',
  'businessStatus',
  'editorialSummary',
  'types',
  'websiteUri',
  'nationalPhoneNumber',
]
```

Only fields we need. Field masks control billing — unused fields cost money.

#### Rate limits and quota

- Free tier: 200 USD credit/month (enough for ~5,000 "Place Details Advanced" calls)
- Expected usage at 200-venue launch: ~6,000 calls/month (200 venues × 30 refreshes)
- Budget assumption: within free tier at Phase 1 scale; monitor with `fetch_cost_usd` tracking

#### Caching policy

- Store full response in `venue_data_snapshots` on every fetch
- Do not re-fetch on page view — always read from snapshots
- Nightly refresh is the cache-buster

#### Failure handling

- Request failure → log error, skip venue this cycle, retry on next nightly shard
- 3 consecutive failures → flag venue internally, notify editors
- Quota exhaustion → halt ingestion, alert immediately, continue serving from last known data

### TripAdvisor Content API

**Secondary source for cross-platform signal.**

- Requires commercial API key (free tier: 5,000 requests/month)
- Endpoints: `location/search`, `location/{id}/details`, `location/{id}/reviews`
- Match TripAdvisor `location_id` to our venues via one-time reconciliation job at venue ingestion

#### Handling mismatches

A small percentage of venues will have no TripAdvisor presence (often true for karinderya and neighborhood spots). For these:
- `tripadvisor_location_id = null` on the venue record
- Cross-platform weight redistributes per ADR 0008
- Venue is internally flagged "single-source scored" but not de-ranked

### Foursquare and Facebook Places

Evaluate at implementation. Both are optional in Phase 1. If their Philippine coverage is thin or API terms are unworkable, skip them and note the decision in an ADR update.

---

## Cron jobs and schedules

All cron jobs run via Vercel Scheduled Functions. All times stored as UTC; quoted Manila times for clarity (UTC+8).

### Nightly data refresh — `02:00 Manila (18:00 UTC)`

Refreshes 1/7 of eligible venues per day, rotating shard by `day_of_week`.

```typescript
// vercel.json
{
  "crons": [
    { "path": "/api/cron/nightly-refresh", "schedule": "0 18 * * *" }
  ]
}
```

Pipeline:
1. Select venues where `id % 7 === day_of_week` AND `is_eligible = true`
2. Dispatch to chunked sub-functions (stay under 60s Vercel Pro timeout)
3. Each chunk: fetch providers, write `venue_data_snapshots`, recompute scores
4. Anomaly check: any venue with `delta > 0.3` goes to staging hold
5. Emit `score_computed` logs for every venue processed

If the cron fails, it does not retry automatically. Manual trigger available via admin dashboard. Missing a single night's shard is recoverable — the next weekly full recompute covers it.

### Weekly full recompute — `Sunday 03:00 Manila (19:00 UTC Saturday)`

```typescript
// vercel.json
{ "path": "/api/cron/weekly-recompute", "schedule": "0 19 * * 6" }
```

Same logic as nightly but over the full venue set. Primary purposes:
- Consistency check (catch any venue the nightly shard missed)
- Apply new `scoring_config` version if one was activated mid-week
- Write canonical weekly score_history rows (separate from nightly rolling updates)

Expected duration at 500 venues: ~8 minutes, chunked across ~15 function invocations.

### List regeneration — `Sunday 04:00 Manila (20:00 UTC Saturday)`

Runs after weekly recompute completes. Regenerates all published lists by re-running their `filter_criteria` queries against the updated `venue_scores`.

```typescript
{ "path": "/api/cron/regenerate-lists", "schedule": "0 20 * * 6" }
```

Per list:
1. Execute the stored `filter_criteria` JSONB against `venue_scores + venues`
2. Sort by `final_score DESC`, take top `max_length`
3. Write new rows to `list_entries`, delete old entries for the list
4. Regenerate `title` per ADR 0004 (based on actual count)
5. Update `last_regenerated_at`

### Monday Briefing email — `Monday 07:00 Manila (23:00 UTC Sunday)`

Auto-generates and sends the weekly newsletter to subscribers. Content: three editor picks + any significant score movements from the prior week's recompute.

Separate doc needed: newsletter generation is its own spec. For this document, it's just a cron slot.

### FX rate refresh — hourly

```typescript
{ "path": "/api/cron/refresh-fx", "schedule": "0 * * * *" }
```

Fetches latest rates from `exchangerate.host` and caches in Supabase. Public pages read from cache; the hourly job is the only fetch.

### Anomaly flag monitor — every 6 hours

```typescript
{ "path": "/api/cron/anomaly-monitor", "schedule": "0 */6 * * *" }
```

Sends a digest email to editors for any unresolved `anomaly_flags` older than 24 hours. Prevents staging holds from sitting indefinitely.

---

## File structure

Recommended Next.js App Router layout for the ingestion and admin code. This is convention; Claude Code should follow it unless deviating for a specific reason.

```
app/
├── (public)/
│   ├── page.tsx                          # Homepage
│   ├── venues/
│   │   └── [slug]/page.tsx               # Venue entry page
│   ├── canon/
│   │   ├── page.tsx                      # List index
│   │   └── [slug]/page.tsx               # Individual list
│   ├── about/
│   │   ├── page.tsx                      # /about
│   │   ├── scoring/page.tsx
│   │   └── policies/page.tsx
│   └── pitch/page.tsx
├── (admin)/
│   ├── dashboard/page.tsx
│   ├── venues/
│   │   ├── page.tsx                      # Venue list + filters
│   │   └── [id]/page.tsx                 # Boost, visit log, manual actions
│   ├── pitches/page.tsx                  # Pitch queue
│   ├── anomalies/page.tsx                # Unresolved flags
│   └── bnt/page.tsx                      # BNT award workflow
└── api/
    ├── cron/
    │   ├── nightly-refresh/route.ts
    │   ├── weekly-recompute/route.ts
    │   ├── regenerate-lists/route.ts
    │   ├── refresh-fx/route.ts
    │   └── anomaly-monitor/route.ts
    ├── ingest/
    │   ├── google/route.ts               # Called by cron, not publicly exposed
    │   ├── tripadvisor/route.ts
    │   └── foursquare/route.ts
    └── admin/
        └── [various server actions]

lib/
├── scoring/
│   ├── compute.ts                        # The algorithm
│   ├── anomaly.ts                        # Delta detection and staging
│   ├── config.ts                         # Load active scoring_config
│   └── __tests__/                        # Non-negotiable per CLAUDE.md
├── ingestion/
│   ├── google.ts
│   ├── tripadvisor.ts
│   ├── foursquare.ts
│   └── normalize.ts                      # Turn provider responses into comparable shapes
├── db/
│   ├── queries.ts                        # publicVenueQuery, adminVenueQuery, etc.
│   └── schemas/                          # Zod schemas for runtime validation
├── lists/
│   └── regenerate.ts
└── auth/
    └── editors.ts                        # Role checks

supabase/
├── migrations/
│   ├── 0001_initial_schema.sql
│   ├── 0002_scoring_tables.sql
│   ├── 0003_editorial_tables.sql
│   └── ...
└── seed.sql                              # Editors, initial scoring_config
```

---

## Environment variables

The canonical list. Claude Code should never invent new env vars without adding to this list and documenting purpose.

### Required at every deploy

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=                # Server-only; never exposed client-side

# External data providers
GOOGLE_PLACES_API_KEY=
TRIPADVISOR_API_KEY=
FOURSQUARE_API_KEY=                       # Optional; Phase 1 may defer
FACEBOOK_GRAPH_TOKEN=                     # Optional; Phase 1 may defer

# FX rates
EXCHANGERATE_API_KEY=                     # Optional; exchangerate.host free tier works without

# Vercel Cron auth
CRON_SECRET=                              # Shared secret; all cron routes verify

# Observability
SENTRY_DSN=                               # Optional but strongly recommended
```

### Preview-only overrides

```
NEXT_PUBLIC_SITE_URL=https://preview-...   # Distinct per PR
DATABASE_READ_ONLY=true                    # Safety: preview deploys cannot mutate production data
```

Preview deploys point at a separate Supabase project (staging environment), not production. This is enforced via Vercel environment variable scoping.

---

## Row-level security (RLS)

Every table has RLS enabled. Policies enforce the public/admin boundary.

### Example: `venues` table

```sql
-- Anyone can read published, eligible, non-delisted venues with final_score >= 5.0
CREATE POLICY "public_read_eligible_venues" ON venues
  FOR SELECT
  USING (
    is_published = true
    AND is_eligible = true
    AND is_editorial_delisted = false
    AND EXISTS (
      SELECT 1 FROM venue_scores
      WHERE venue_scores.venue_id = venues.id
      AND venue_scores.final_score >= 5.0
    )
  );

-- Editors can read everything
CREATE POLICY "editor_read_all_venues" ON venues
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM editors
      WHERE editors.auth_user_id = auth.uid()
      AND editors.is_active = true
    )
  );

-- Only editors can modify venues
CREATE POLICY "editor_modify_venues" ON venues
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM editors
      WHERE editors.auth_user_id = auth.uid()
      AND editors.is_active = true
    )
  );
```

### Principle: defense in depth

RLS is the last line of defense. Code should still use the `publicVenueQuery` / `adminVenueQuery` helpers at the application layer. Both layers must agree on what's public. RLS exists to catch the case where an application-layer helper is bypassed.

---

## Image handling

### Storage

Venue photography stored in Supabase Storage under the `venue-images/` bucket. Public read access; write restricted to editors.

Naming convention: `venue-images/{venue_id}/{purpose}-{timestamp}.{ext}`

Examples:
- `venue-images/42/hero-1714147200.jpg`
- `venue-images/42/gallery-1714147310.jpg`

### Rendering

Use Next.js `<Image>` component with Supabase Storage as the source. Configure `next.config.ts`:

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '*.supabase.co',
      pathname: '/storage/v1/object/public/venue-images/**',
    },
  ],
}
```

### Licensing

Every image stored must have a recorded source in the database:

```sql
CREATE TABLE venue_images (
  id BIGSERIAL PRIMARY KEY,
  venue_id BIGINT NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  purpose TEXT NOT NULL,                        -- 'hero' | 'gallery' | 'thumbnail'
  source TEXT NOT NULL,                         -- 'editorial' | 'venue_provided' | 'licensed' | 'public_domain'
  credit TEXT,                                  -- attribution if required
  license TEXT,                                 -- 'cc-by', 'used_with_permission', 'owned', etc.
  alt_text TEXT NOT NULL,                       -- per CLAUDE.md accessibility
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  uploaded_by BIGINT REFERENCES editors(id)
);
```

Images without recorded licensing do not render on the public site. Enforced at the query layer.

---

## Observability

### Structured logging

Every cron run, every ingestion call, every score compute emits a structured log event. Use a consistent envelope:

```typescript
logger.info('event_name', {
  venue_id?: number,
  duration_ms: number,
  trigger: string,
  // event-specific fields
})
```

Required event names:
- `score_computed` (per venue, per compute)
- `data_fetched` (per provider fetch)
- `anomaly_flagged`
- `boost_applied`
- `bnt_awarded`
- `list_regenerated`
- `cron_started` / `cron_completed` / `cron_failed`

### Sentry

Error tracking via Sentry (or equivalent). All cron failures are high-severity. API route errors at P1. Application errors at P2.

### Admin dashboard health view

A `/admin/health` page that shows:
- Last nightly refresh timestamp and success status
- Count of eligible venues (should be stable or growing)
- Unresolved anomaly flag count (should trend toward zero)
- Average score compute duration (watch for creep)
- Monthly Google Places API spend (watch for quota risk)
- Last FX refresh timestamp
- Count of venues with `config_version` mismatching active config (should be zero)

If any of these go red, the dashboard makes it obvious before a user would notice.

---

## Failure modes and responses

The system must degrade gracefully. Some common failure modes:

**Google Places API is down.**
- Ingestion skips the cycle, retries next night
- Public site continues serving from last-known `venue_scores`
- Editors notified if down > 24 hours

**TripAdvisor API quota exhausted.**
- Cross-platform weight redistributes per ADR 0008
- Venues flagged "single-source scored" this cycle
- Quota resets next period; catches up automatically

**Supabase is down.**
- Public site returns 503 with graceful fallback page
- Vercel edge cache serves stale content where possible
- Admin dashboard unavailable
- Cron jobs fail; alerts fire

**Anomaly flags piling up (editors on vacation).**
- Staged score updates do not auto-apply
- The 6-hour monitor sends escalating emails
- After 7 days, a flag can be auto-resolved to "accept" only if the venue's algorithmic score remained within 0.3 across multiple subsequent recomputes — this is the only auto-resolution rule, and even it requires a distinct log entry. Editors can override at any time.

**An editor accidentally boosts a venue by -5.0.**
- Database CHECK constraint rejects the insert (`boost >= -1.0`)
- The API returns a validation error
- No silent clamping

**Config version mismatch after a tuning session.**
- Venues score with their recorded `config_version` until the next recompute
- Weekly recompute applies new config to all venues simultaneously
- No mid-week partial rollout of new weights

---

## Migration and versioning

### Database migrations

All schema changes go through Supabase migrations in `supabase/migrations/`. No manual schema edits on the production database. Migrations are idempotent where possible and always reversible.

### Scoring config versions

Creating a new version:
1. Insert a new row into `scoring_config` with `is_active = false`
2. Test against staging
3. Flip `is_active = true` atomically (the partial unique index ensures only one active per category)
4. Next weekly recompute picks up the new version
5. Update `/about/scoring` to document the change
6. Update ADR 0005 or write a new ADR

Rolling back: flip `is_active` on the old version back to `true`. Scores recompute on the old weights next cycle.

---

## What Claude Code should ask about

Before implementing sections of this pipeline, flag and confirm:

- **Foursquare and Facebook Places inclusion.** Are we committing to these in Phase 1 or deferring? Affects ingestion code and env var requirements.
- **Supabase Storage vs Cloudinary for images.** Supabase works; Cloudinary has better transformation tooling. Tradeoff depends on image volume expectations.
- **Notion/Airtable vs custom admin dashboard for Phase 1.** The spec assumes custom dashboard. If you'd prefer to start in Notion/Airtable for pitch queue and anomaly review, say so — the schema still holds but the UI is deferred.
- **Sentry specifically.** If you'd prefer a different error tracker (Logflare, Axiom, Betterstack), flag before implementing.
- **The 90-day snapshot retention.** Conservative default. If storage costs are a concern, shorten to 30 days. If audit requirements demand more, extend.

---

## Open questions for v1.1

- **Multi-city coordination.** Cebu is country-two per the spec. When does the schema need a `cities` table, and how do neighborhoods relate to cities? Probably fine as a text column until Cebu launches, but flag.
- **Venue merging.** Two entries for the same venue (common when a restaurant rebrands or a chain is inconsistently listed). Need a deduplication process.
- **Seasonal venues.** Pop-ups, holiday-only venues, weekend markets. The eligibility gate (open 3+ months) assumes permanence; seasonal coverage needs a separate path.
- **Multiple locations of the same venue.** Toyo Eatery, for example, if it opens a second location. Are they scored independently? Linked? TBD.
- **Chef/group attribution.** A chef's name is not currently a first-class entity. If the Phase 2 critic layer wants to ask "show me every Margarita Forés venue," we need a `chefs` or `groups` table.

---

## Version history

- **v1.0 — April 2026.** Initial technical specification.

---

*For schema or pipeline changes, open a PR against this document and any affected ADRs. Schema changes also require a corresponding Supabase migration.*
