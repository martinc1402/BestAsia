# ADR 0006: Best New Table threshold is 8.5+, editorial pathway overrides data minimum

**Status:** Accepted · April 2026
**Deciders:** Martin Casey, Yahnee Ortiz

## Context

Best New Table (BNT) is the standing editorial stamp for new openings. It functions as a canonizing designation that sits above the numeric score. One stamp, rarely given, is the design.

BNT is for new openings (first 12 months), but new openings rarely meet the algorithmic data threshold (50 reviews, 3+ months open) when they're most worth highlighting. Requiring algorithmic qualification would make BNT useless for its primary purpose.

## Decision

**BNT threshold is 8.5+.** BNT candidates are qualified via an editorial pathway that overrides the algorithmic data minimum.

Editorial pathway:
- Editors (Martin and Yahnee in Phase 1) identify candidates from the new-openings pipeline
- An editorial visit is conducted (anonymous, paid, documented)
- The visit produces an editorial score
- If the editorial score is 8.5+, the venue is listed with the BNT badge, even without algorithmic qualification
- The editorial score is displayed alongside a clear "editorial entry" label until algorithmic data catches up
- Once the venue meets the 50-review / 3-month threshold, the algorithm takes over, and BNT eligibility is re-evaluated

BNT visits may be contracted to local editorial partners when Martin or Yahnee cannot visit personally. Contract visits are disclosed on the venue entry.

## Consequences

- `bnt_awards` table stores: venue_id, awarded_date, awarding_editor_id, editorial_visit_date, editorial_score_at_award, rationale
- BNT badge renders on the venue card, in lists, on the entry page, and in the weekly newsletter
- A dedicated `/canon/best-new-table` page lists every BNT ever awarded, newest first
- BNT is never retracted on score movement (a venue that wins BNT at 8.5 and later drops to 7.9 keeps the "Best New Table — [year]" historical designation)
- A venue can only win BNT once. Second openings by the same chef or group are eligible for BNT at their new location.
- No paid pathway to BNT. Ever. This is enforced at the code level: BNT awards cannot be created from any API path other than the admin editorial flow.

## Rejected alternatives

- **Lower the BNT threshold (e.g., 8.0).** Rejected because rarity is the point. A stamp that's common is not a stamp.
- **Algorithmic BNT (auto-award venues scoring 8.5+ in first 12 months).** Rejected because BNT is explicitly an editorial stamp; automating it empties the gesture.
- **Multiple BNT tiers (Gold BNT, Regular BNT).** Rejected for the same reason — one stamp, applied rarely.
