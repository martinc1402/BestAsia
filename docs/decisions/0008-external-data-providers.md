# ADR 0008: External data providers for cross-platform signal

**Status:** Accepted · April 2026
**Deciders:** Martin Casey, Yahnee Ortiz

## Context

The scoring algorithm uses cross-platform triangulation (15% weight) as a defense against single-platform review manipulation. An earlier draft named four providers — Google Places, TripAdvisor, Zomato, and Yelp — without fully checking whether each was viable in the Philippine market in 2026.

Verification surfaced two problems:

1. **Zomato's international public API was sunset.** The company pulled back to UAE-only operations. It is not a viable data source for Philippine venues.
2. **Yelp coverage of the Philippines is weak.** Yelp's user base is heavily concentrated in the US, with minimal penetration in Southeast Asian markets. Including it would introduce thin, unrepresentative data that would hurt triangulation quality more than it helps.

## Decision

**Phase 1 cross-platform signal providers:**

- **Google Places API** — primary source. The 35% weight on Google rating in ADR 0005 draws from this.
- **TripAdvisor Content API** — secondary source for the cross-platform signal. Strong Philippines coverage, especially for restaurants tourists visit.
- **Foursquare Places API** *(optional, evaluate at implementation)* — tertiary signal, particularly useful for bars and nightlife where TripAdvisor coverage is thinner.
- **Facebook Places ratings** *(optional, evaluate at implementation)* — tertiary signal with strong Philippine market penetration. May require scraping or partnership depending on current API terms.

**Excluded from Phase 1:**

- **Zomato** — no viable API for Philippine venues.
- **Yelp** — insufficient Philippine coverage to contribute useful signal.

## Consequences

- The 15% cross-platform weight is split across available providers at ingestion time, weighted by data availability per venue. A venue with TripAdvisor + Foursquare data gets a fuller triangulation than a venue with TripAdvisor only.
- Venues with only Google data (no cross-platform signal available) are flagged internally but still scored — the cross-platform weight redistributes to Google rating and review volume with a documented adjustment.
- Provider list is stored in config, not hard-coded, so additions and removals don't require code changes.
- Every venue score row records which providers contributed, enabling audit and back-testing.
- The `/about/scoring` public page lists current providers. When providers change, the public page updates in the same PR.

## Rejected alternatives

- **Keep Zomato and Yelp in the list "in case they come back."** Rejected. If providers return, a new ADR documents the addition.
- **Scrape review platforms that don't offer APIs.** Rejected in Phase 1. Scraping violates ToS on most platforms and creates legal and reliability risk. Revisit if genuinely needed.
- **Launch with Google-only.** Rejected because single-source scoring is exactly the vulnerability cross-platform triangulation is meant to defend against.

## Open questions

- Foursquare and Facebook Places need implementation-time evaluation — confirm API access, terms of use, and Philippine venue coverage before committing.
- If Foursquare coverage is thin in Manila, is there a Philippines-specific platform (e.g., local food apps, Booky, Munchpunch historical data) worth incorporating? Flag for review during pipeline build.
