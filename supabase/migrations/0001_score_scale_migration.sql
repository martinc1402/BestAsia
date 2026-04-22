-- 0001_score_scale_migration.sql
--
-- Migrates the score scale from the legacy 0-100 shape to the canonical 0.0-10.0 shape
-- specified by ADR 0001. Adds `venues.final_score` alongside the legacy `venues.best_score`
-- column, backfills from `best_score / 10.0`, and updates the `venue_with_tags` view to
-- expose the new column. Enforces the range constraint per ADR 0001 and indexes the
-- column to support the 5.0 floor filter (ADR 0002) applied at the query layer.
--
-- Legacy `best_score` is intentionally retained for the rollback window. Drop it in a
-- follow-up migration once the app has been verified on the new scale.
--
-- Pre-conditions verified before writing this migration:
--   - `venues.best_score` is numeric(4,1) holding legacy 0-100 values (data range 0.0 to 74.8)
--   - 2,372 rows in `venues`; 500 active; zero active rows map below 5.0 after backfill
--   - `venue_scores`, `score_history`, `editorial_boost_log`, `scoring_config`, `anomaly_flags`
--     do not exist — they are out of scope for this PR and will be introduced by the
--     future scoring-pipeline PR that ships the tables together with the code that reads
--     and writes them (ADR 0010: no fabricated UI over empty schema).

BEGIN;

-- 1. Add the new column. numeric(3,1) per ADR 0001 — max 99.9, scale 1 decimal.
ALTER TABLE venues
  ADD COLUMN final_score numeric(3,1);

-- 2. Range constraint per ADR 0001. NULL is allowed (venues below the eligibility gate
--    or newly ingested rows pending a compute). The 5.0 floor is enforced at the query
--    layer, not here, so admin reads can still see sub-5.0 rows for monitoring.
ALTER TABLE venues
  ADD CONSTRAINT final_score_range
    CHECK (final_score IS NULL OR (final_score >= 0.0 AND final_score <= 10.0));

-- 3. Backfill from the legacy column. The column's numeric(3,1) scale auto-rounds
--    to one decimal place on insert; no explicit ROUND() is needed, but the division
--    is written as `/ 10.0` (not `/ 10`) to force numeric arithmetic.
UPDATE venues
SET final_score = best_score / 10.0
WHERE best_score IS NOT NULL;

-- 4. Index to support the `.gte('final_score', 5.0)` floor filter applied on every
--    public query in lib/queries.ts.
CREATE INDEX IF NOT EXISTS idx_venues_final_score
  ON venues (final_score);

-- 5. Update the `venue_with_tags` view to expose `final_score`.
--    Postgres CREATE OR REPLACE VIEW requires existing columns to remain at the same
--    position with the same types; new columns can only be appended to the end.
--    `final_score` therefore lands after `tags`, which is cosmetic — `SELECT *`
--    consumers don't care about column order, and the app uses `.select("*")`.
CREATE OR REPLACE VIEW venue_with_tags AS
SELECT v.id,
    v.name,
    v.slug,
    v.category,
    v.subcategory,
    v.city_id,
    v.neighborhood_id,
    v.address,
    v.latitude,
    v.longitude,
    v.phone,
    v.website,
    v.instagram,
    v.facebook_url,
    v.opening_hours,
    v.price_level,
    v.is_open_late,
    v.is_24_hours,
    v.google_rating,
    v.google_review_count,
    v.google_place_id,
    v.foursquare_rating,
    v.foursquare_id,
    v.best_score,
    v.best_score_rank,
    v.score_quality,
    v.score_popularity,
    v.score_recency,
    v.score_trending,
    v.score_editorial,
    v.editorial_notes,
    v.short_description,
    v.featured_photo_url,
    v.status,
    v.is_featured,
    v.last_google_sync,
    v.last_foursquare_sync,
    v.last_score_calc,
    v.created_at,
    v.updated_at,
    c.name AS city_name,
    c.slug AS city_slug,
    n.name AS neighborhood_name,
    n.slug AS neighborhood_slug,
    COALESCE(
      jsonb_agg(
        DISTINCT jsonb_build_object(
          'tag_id', t.id,
          'dimension', t.dimension,
          'name', t.name,
          'display_name', t.display_name,
          'confidence', vt.confidence,
          'source', vt.source
        )
      ) FILTER (WHERE t.id IS NOT NULL AND NOT vt.is_rejected),
      '[]'::jsonb
    ) AS tags,
    v.final_score
  FROM venues v
    LEFT JOIN cities c ON v.city_id = c.id
    LEFT JOIN neighborhoods n ON v.neighborhood_id = n.id
    LEFT JOIN venue_tags vt ON v.id = vt.venue_id AND NOT vt.is_rejected
    LEFT JOIN tags t ON vt.tag_id = t.id
  WHERE v.status = 'active'::text
  GROUP BY v.id, c.name, c.slug, n.name, n.slug;

COMMIT;

-- Rollback sketch (for reference; not executed here).
-- If this migration needs to be reverted before the follow-up drop migration lands:
--   BEGIN;
--   CREATE OR REPLACE VIEW venue_with_tags AS <pre-migration definition>;
--   DROP INDEX IF EXISTS idx_venues_final_score;
--   ALTER TABLE venues DROP CONSTRAINT IF EXISTS final_score_range;
--   ALTER TABLE venues DROP COLUMN IF EXISTS final_score;
--   COMMIT;
-- The app continues reading `best_score` until that path is removed, so reverting
-- only the migration leaves the app in a working state.
