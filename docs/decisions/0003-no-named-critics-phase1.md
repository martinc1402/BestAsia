# ADR 0003: No named critics in Phase 1

**Status:** Accepted · April 2026
**Deciders:** Martin Casey, Yahnee Ortiz

## Context

Pitchfork's editorial power comes partly from named critics with distinct voices. BestPhilippines will eventually follow the same pattern. The question is when.

Phase 1 is utility-first: algorithmic scoring, monthly canon lists, weekly picks, the Monday Briefing. The product thesis is that people pick dinner fast and need useful data before they need named opinion.

Earlier prototype work introduced fictional critic names ("Kara Lim," "Mika Reyes," "JP Cuizon") as placeholders. These must not ship.

## Decision

**Phase 1 ships with no named critics.** The publication itself is the rater. Attribution on algorithmic content is:

- "BestPhilippines editors" (generic)
- "Martin Casey" or "Yahnee Ortiz" (specific, when one editor drove the call)

An `/about` page names Martin and Yahnee as the editorial humans behind the algorithm — so the editorial team is not anonymous, but the publication is the voice.

Phase 2 (month 12+) introduces named critics with real faces, beats, and running stats. Phase 2 is when long-form reviews launch. The two milestones move together.

## Consequences

- No `critics` table in the Phase 1 schema. `editors` table contains two rows.
- No critic profile pages, critic bylines on venue entries, or "more from this critic" UI.
- Any legacy seed data referencing invented critic names is replaced or removed.
- List bylines use Martin, Yahnee, or the generic editors credit. Never fictional names.
- Footer copy says "Two editors, arguing" (or similar) — not "Three editors."
- The `/about` page is the primary credibility surface in Phase 1.

## Rejected alternatives

- **Launch with fictional named critics to seed personality.** Rejected as dishonest and as premature spend of a Phase 2 feature's impact.
- **Launch as fully anonymous / algorithmic only.** Rejected because a pure algorithm with no named human guardians reads as a scraper.
