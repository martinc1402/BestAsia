# ADR 0001: Scoring scale is 0.0–10.0, one decimal

**Status:** Accepted · April 2026
**Deciders:** Martin Casey, Yahnee Ortiz

## Context

BestPhilippines needed a scoring scale that is culturally legible, editorially expressive, and differentiable across hundreds of venues. Two credible options were considered:

- **0.0–10.0, one decimal (Pitchfork model).** Culturally sticky, argumentative, memorable.
- **0–100 integer (Wine Spectator / Parker model).** Food-criticism lineage, instantly legible.

## Decision

We use **0.0 to 10.0 with one decimal place.**

## Consequences

- The difference between a 7.4 and a 7.6 is meaningful and displayable. The decimal is the posture.
- Database column: `numeric(3,1)` with a check constraint `>= 0.0 AND <= 10.0`.
- UI displays scores with exactly one decimal. A `toFixed(1)` helper is mandatory; no raw score rendering.
- Best New Table threshold is 8.5+ (see `0006-bnt-threshold.md`).
- Listing floor is 5.0 (see `0002-score-floor.md`).
- All internal rubric documentation, admin dashboards, and public display use the same scale. No alternate scales ever shown to users.

## Rejected alternatives

- **100-point integer scale.** Rejected because decimals carry more editorial weight and the Pitchfork lineage better fits the publication's positioning.
- **5-star scale.** Rejected as insufficient granularity for a ranking site. Stars are what we're triangulating against, not emulating.
