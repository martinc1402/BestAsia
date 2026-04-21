# ADR 0004: List titles reflect actual qualifying venue count

**Status:** Accepted · April 2026
**Deciders:** Martin Casey, Yahnee Ortiz

## Context

Monthly canon lists are algorithmically populated based on score, category, and filters. When fewer than 10 venues meet the qualifying threshold, an aspirational "Top 10" title misrepresents the list and undermines credibility.

The earlier prototype shipped lists titled "Top 10 rooftop bars in Manila" while actually containing 4 venues, and "Best cafes for remote work in Manila" with 6 venues. This reads as half-baked.

## Decision

**List titles are generated from the actual qualifying venue count, not from an aspirational target.**

Title patterns (house conventions):

- 10 venues: "The 10 [category] worth your time in [location]"
- 6–9 venues: "The [N] [category] worth your time in [location]"
- 4–5 venues: "The [N] [category] worth arguing about in [location]"
- 2–3 venues: List is not published; threshold not met
- 1 venue: Never a list; surfaced as a single-venue feature if warranted

The word "top" is avoided in favor of editorial framing ("worth your time," "worth arguing about," "worth the trip"). See voice guide for tone.

## Consequences

- List title generation is a function of the qualifying venue array length, run at list build time.
- If a list's qualifying count drops from 8 to 7 during a weekly refresh, the title auto-updates from "The 8 X worth your time in Y" to "The 7 X worth your time in Y."
- Lists that drop below 4 qualifying venues are unpublished, not renamed. A "list" with 2 items is not a list.
- The canon page UI respects the actual count in both title and badge (the TOP N chip).
- No fallback titles mentioning "Top 10" anywhere in templates, seed data, or default copy.

## Rejected alternatives

- **Lower the qualifying threshold until 10 venues appear.** Rejected because diluting the quality bar to hit an arbitrary number is exactly the failure mode we're avoiding.
- **Keep aspirational "Top 10" titles and display the actual count separately.** Rejected because the title lies and the inconsistency looks unfinished.
