# ADR 0002: Minimum listing score is 5.0

**Status:** Accepted · April 2026
**Deciders:** Martin Casey, Yahnee Ortiz

## Context

A ranking site must decide whether to list venues that score badly. Two philosophies:

- **List everything, score honestly.** Pitchfork publishes 1.6s. Maximum coverage, maximum credibility via inclusion of failures.
- **List only what's worth covering.** Silence as the verdict for the bottom of the distribution.

The project operates under Philippine law (plaintiff-friendly libel environment) and covers venues that did not consent to being reviewed.

## Decision

**Algorithmic scoring does not publish venues below 5.0.** If a venue scores below the floor, it is absent from the site entirely — not hidden, not greyed out, not shown with a warning. Absent.

Phase 2 exception: named-critic long-form reviews ("The Review") may publish below 5.0 when the target has sufficient public profile that the criticism is a service rather than cruelty.

## Consequences

- Database query: `WHERE final_score >= 5.0` on every public listing query. Enforced at the query helper level.
- Admin panel can see venues below 5.0 (for monitoring and BNT editorial review); public UI cannot.
- If a boosted score drops a venue below 5.0, the venue becomes unlisted. The boost cannot weaponize the score to force delisting — delisting for cause uses a separate editorial flag.
- Search results, lists, category pages, newsletter content, and all other surfaces respect the 5.0 floor.
- Score 5.0–5.9 venues are listed but excluded from any "best of" or canon list.

## Rejected alternatives

- **No floor, list everything.** Rejected because punching down at small venues that never asked to be rated exposes the publication to defamation risk with zero upside.
- **Hide sub-5.0 with a "below floor" label.** Rejected because it creates a "wall of shame" effect while still exposing the venues. Silence is cleaner.
