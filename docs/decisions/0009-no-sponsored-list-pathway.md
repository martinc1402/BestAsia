# ADR 0009: No sponsored-list pathway in the data model

**Status:** Accepted · April 2026
**Deciders:** Martin Casey, Yahnee Ortiz

## Context

An audit of the current codebase surfaced `is_sponsored: boolean` and `sponsor_name: string | null` fields on the `CuratedList` interface in `lib/types.ts`. These fields were carried forward from an earlier prototype. No code currently reads them, and no backend path writes them.

The fields' mere presence is drift. Type definitions communicate *intent* — a developer or AI reading `is_sponsored` on a list type reasonably concludes that sponsored lists are a supported product concept that simply hasn't been wired up yet. That contradicts:

- **Hard rule 1 (CLAUDE.md):** nothing affects the score except the algorithm and the bounded editorial boost
- **ADR 0006 (BNT):** BNT eligibility cannot be bought
- **The policies page (`/about/policies` §1.8):** paid boosts are visibility-only, never tied to score, ranking, or BNT
- **The public positioning:** "no pay-to-play" is stated on the homepage and in the about page

Canon lists in particular are the editorial surface most vulnerable to commercial pressure. A sponsored-list pathway would be the first place credibility leaks.

## Decision

**The data model does not support sponsored lists.** The `is_sponsored` and `sponsor_name` fields are removed from `CuratedList` and any related schema. Any future paid-promotion feature (per Phase 2 paid boosts) operates on visibility surfaces — homepage placement, newsletter inclusion, "featured" chips — and never on list content, list ordering, or list attribution.

If a paid-promotion feature needs a new data-model representation, it goes on its own entity (`promotions`, `featured_placements`, or similar) with clear labeling requirements at the schema level. It does not share a table or type with editorial lists.

## Consequences

- `is_sponsored` and `sponsor_name` removed from `lib/types.ts` `CuratedList` interface
- Corresponding columns removed from the Supabase `lists` table (if present) via migration
- Seed data checked for references; removed
- No "sponsored" flag, field, or conditional rendering anywhere in the list pipeline
- When Phase 2 introduces paid boosts per ADR TBD, a separate schema and UI surface is designed from scratch — not by reactivating these fields

## Rejected alternatives

- **Keep the fields but enforce `is_sponsored = false` at the policy layer.** Rejected because the presence of the field tells future readers the concept is supported. Deletion is cleaner.
- **Rename the fields to `is_featured` / `featured_by` for editorial featured placements.** Rejected because editorial featured placements are already handled by the `is_featured` field on `lists` and do not involve payment. Conflating commercial sponsorship terminology with editorial featuring is exactly the kind of drift that erodes credibility over time.

## Open questions

- If and when paid promotion ships in Phase 2, a new ADR specifies the schema, the labeling rules, and the enforcement boundaries. It does not reopen this decision.
