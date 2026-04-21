# ADR 0005: Scoring algorithm weights and inputs

**Status:** Accepted · April 2026
**Deciders:** Martin Casey, Yahnee Ortiz

## Context

The BestPhilippines score is a weighted composite of public review data and editorial judgment. The weights must be:

- Published (transparency is the moat)
- Bounded (no single input can dominate)
- Defensible (every weight has a rationale)
- Tunable (v1.0 weights will change as we learn)

## Decision

The algorithm combines five inputs at the following weights (restaurants; see variants below for other categories):

| Input | Weight | Method |
|---|---|---|
| Google rating (normalized) | 35% | Avg star × 2 → 10-point scale |
| Review volume (log-scaled) | 20% | log(review_count), caps at ~1,000-review equivalent |
| Recency (time-decayed) | 20% | Last 12 months weighted heavily; >3 years minimal |
| Cross-platform signal | 15% | TripAdvisor Content API + optional Foursquare/Facebook Places triangulation |
| Editorial boost | ±10% | Bounded ±1.0 adjustment, editor-applied |

See `0008-external-data-providers.md` for why these specific providers were chosen and why Zomato and Yelp are excluded.

Category variants:

- **Bars / cocktail venues:** recency 25%, volume 15% (programs change faster)
- **Nightclubs:** star rating 25%, recency 30% (polarized reviews; trend > average)
- **Cafés:** standard weights + consistency penalty for high review variance

## Consequences

- A `scoring_config` table or versioned JSON stores the weights, enabling tuning without code deploys.
- Every score row records which `config_version` produced it, for historical integrity.
- Changes to weights require an ADR update, a new config version, and a full recompute of the database.
- The `/about/scoring` page is rebuilt whenever weights change, including a changelog.
- Minimum data threshold: 50 reviews, 3+ months open. Below this, the algorithm does not score.
- Anomaly flag: score change >0.3 in a single recompute triggers human review before going live.
- Recompute cadence: nightly refresh of 1/7 of DB on rolling basis; full recompute weekly.

## Rejected alternatives

- **Flat equal weights.** Rejected because not all inputs carry equal signal value.
- **Hidden weights.** Rejected because the algorithm's credibility is a function of its transparency.
- **Larger editorial boost (±2.0).** Rejected because bounded editorial power is the credibility line; a 2-point swing reads as rigged.

## Open questions

- Should we adjust Google rating normalization for category baseline inflation? (Ice cream shops rate higher than fine dining; is 4.5 stars at an ice cream shop equivalent to 4.5 at a tasting menu?) — Flagged for v1.1.
