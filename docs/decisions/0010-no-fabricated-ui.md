# ADR 0010: No fabricated UI — ship real features or don't render them

**Status:** Accepted · April 2026
**Deciders:** Martin Casey, Yahnee Ortiz

## Context

An audit of the current codebase surfaced multiple UI surfaces rendering features that do not exist:

- A **reserve-a-table** form on every venue entry page (`app/venue/[slug]/page.tsx`) with Date, Time, and Party Size fields and a "Reserve →" button that does not post to any backend. "Reservations: Recommended" is hardcoded on every venue regardless of policy.
- An **"offline map + every pick, one tap away"** CTA (`app/best/[slug]/page.tsx`) promising a product feature that has not been built.
- A **fabricated "min read"** stat on list pages, computed from list length rather than real content metrics.
- **Decorative SVG illustrations** masquerading as maps (`MiniMapCard` on venue pages, `DiscoverMap` on discovery). Fake streets, fake buildings, fake markers. Not a map. Not labeled as decorative.
- A **fabricated "Avg per person" peso calculation** derived from price level × 900 + 600, displayed prominently as if it were real data.

The hard rules in CLAUDE.md cover fake scores, fake critics, and fake editorial content. They did not previously cover fake *features* — UI elements that imply product capabilities we haven't built.

This is a distinct category of drift. Fake UI passes every other check — it doesn't violate the voice guide, it doesn't break the score floor, it doesn't use banned words. But it violates the positioning more directly than any of those. BestPhilippines stakes its reputation on transparency. A reader who clicks "Reserve" and nothing happens is a reader who concludes the site is unfinished at best, dishonest at worst.

## Decision

**No UI ships that implies a feature we haven't built.**

Specifically:

1. **Form elements must submit somewhere.** If there's no backend, the form does not render.
2. **CTAs must link to functional destinations.** No "coming soon" buttons. No feature teasers dressed as product surfaces.
3. **Maps must be real maps.** No decorative SVGs of imaginary geography. If we don't have a Mapbox/Google Maps integration for a view, that view doesn't render a map — it renders an address, a neighborhood name, or nothing.
4. **Stats must be derived from real data.** "Avg per person," "min read," "typical wait" are all reasonable things to surface, but only once they're computed from actual sources. Placeholder math that looks like data is worse than no data.
5. **Static strings presented as venue-specific facts must actually be venue-specific.** "Reservations: Recommended" on every venue is not venue data, it's decoration pretending to be data. Remove it, or wire it to a real field.

## Consequences

- The reserve-a-table form in `app/venue/[slug]/page.tsx` is removed. Replaced with a link to the venue's own reservation page (Google, TableCheck, Chope, direct website) where available.
- The offline map CTA is removed from `app/best/[slug]/page.tsx`.
- The fabricated "min read" stat is removed. Replace with number of venues in the list, which is real.
- `MiniMapCard` is removed from venue entry pages. Replaced with address + neighborhood, and optionally a static Mapbox/Google Static Maps image if we budget for one.
- `DiscoverMap` is removed from the discovery page. Replaced either with a real Mapbox integration or a grid view until the map is built.
- The `avgPrice()` calculation and its rendering are removed. The peso range on price tier (already implemented) is the real price data; no need to invent per-person averages.
- The hardcoded "Reservations: Recommended" string is removed. If we want to surface reservation policy, it lives in a venue field and reflects reality per venue.

## Related rule

This decision is elevated to a hard rule in CLAUDE.md as **Hard Rule 10**:

> **No fabricated UI.** Do not ship UI that implies a feature that doesn't exist. Forms must submit; CTAs must navigate; maps must be real; stats must derive from real data. Placeholder that looks like product is worse than absence.

## Rejected alternatives

- **Keep fabricated UI with "Coming soon" labels.** Rejected. Even labeled, they signal roadmap-by-UI rather than delivered product. Users do not read "Coming soon" before clicking. And the positioning cost (the site looks unfinished) outweighs the messaging benefit (we're building things).
- **Keep decorative maps as clear illustrations.** Rejected. Decorative illustrations are banned elsewhere in the design system (see `/docs/design/design-system.md` §What we don't do). Consistency matters more than the specific case.
- **Ship features quickly instead of removing the UI.** Rejected as a general rule — we are not going to build a reservation system, a mapping integration, and real per-person price analysis in a week. Removing the fake UI is the cheap, honest move. Building the real thing can happen later.

## Open questions

- **Real mapping integration.** Mapbox, Google Maps Embed, or Google Static Maps are all viable. Decision deferred to a future ADR when the product is ready to commit. Until then, address + neighborhood suffice.
- **Reservation integrations.** TableCheck, Chope, and direct links are the three realistic paths. Some venues accept reservations by phone only. Defer the integration decision; for now, link to the venue's own site or Google listing.
- **Per-person price reporting.** If we want this stat, it needs real data — either from editor-logged visits or from aggregating menu price data. Deferred until the admin flow supports it.
