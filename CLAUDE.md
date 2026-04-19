# BestPhilippines.co

Curated directory + decision engine for bars, restaurants, cafes, and nightclubs in the Philippines. See `docs/PROJECT_BRIEF.md` for full product context, competitor analysis, and monetization strategy.

## Stack

Next.js (App Router) + Tailwind CSS v4 + Supabase (PostgreSQL/PostGIS). Deploy to Vercel.

## Supabase

```
NEXT_PUBLIC_SUPABASE_URL=https://cctpodjczobljpdvvhlh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Legacy anon key (eyJhbG...)
SUPABASE_SERVICE_ROLE_KEY=        # Legacy service_role key (server only)
```

Use `@supabase/supabase-js`. Legacy API keys (Settings → API → "Legacy anon, service_role API"). Anon key client-side, service_role in server components / route handlers via `lib/supabase.ts::createServerClient()`.

## Database (snapshot — may drift, verify before asserting)

- ~2,372 venues (500 active), 7,371 tags, 8 curated lists, 5 quiz questions / 20 options
- Categories: restaurant (1,145), bar (518), cafe (515), nightclub (194)
- 18 Manila neighborhoods

### Key tables & view

- `venues` — core. Filter `status = 'active'`, sort by `best_score DESC`. Has `slug`.
- `venue_tags` — junction. Fields: `source` (api/ai_inferred/manual), `confidence` (0–1), `is_rejected`.
- `tags` — 66 tags across 6 dimensions.
- `curated_lists` + `curated_list_items` — editorial lists. `is_published` flag.
- `quiz_questions` + `quiz_options` — each option maps to a `tag_id`.
- `neighborhoods`, `cities` — Manila is the only active city.
- `venue_with_tags` — view with tags as JSONB array. Use for listing pages.

### Reusable queries

Everything lives in `lib/queries.ts` (`getTopVenues`, `getVenueBySlug`, `getSimilarVenues`, `getCuratedLists`, `getCuratedListsWithCounts`, `getDiscoverVenues`, `getCuratedListBySlug`, `getNeighborhoods`, `getNeighborhoodsWithCounts`, `getQuizQuestions`, `getQuizResults`, `getSpotlightVenue`, `getHotListVenues`, `searchVenues`, `getActiveVenueCount`, `getCategoryCount`). Extend that file rather than inlining Supabase calls in pages.

## URLs

```
/                              Homepage
/manila                        City page
/manila/[category]             Category listing (restaurants|bars|cafes|nightclubs)
/discover                      Filterable browse
/venue/[slug]                  Venue detail (SSR)
/best                          All curated lists
/best/[slug]                   Single curated list
/quiz                          5-step quiz
/api/search?q=                 Autosuggest JSON
/api/quiz/recommend            Quiz results JSON (POST)
```

## Best Score

Composite 0–100: quality (35%) + popularity (25%) + recency (15%) + trending (10%) + editorial (15%). Shown as a terracotta pill badge.

## Price Levels

1 = ₱ (under ₱500/head) · 2 = ₱₱ (₱500–₱1,500) · 3 = ₱₱₱ (₱1,500–₱3,000) · 4 = ₱₱₱₱ (₱3,000+). Render as ₱ symbols.

## Tag Dimensions

- **Occasion:** date-night, group-dinner, solo-dining, business-meal, family-kids, celebration, late-night-eats, remote-work, pre-game-drinks, impress-visitors, chill-hangout, bar-hopping
- **Vibe:** chill, lively, romantic, trendy, rooftop, speakeasy, heritage, cozy, wild, quiet, live-music, outdoor
- **Cuisine:** filipino, japanese, korean, chinese, italian, spanish, craft-cocktails, specialty-coffee, buffet, steakhouse, street-food, fine-dining, wine-whisky, craft-beer, sea-fusion, brunch
- **Practical:** free-wifi, power-outlets, pet-friendly, kid-friendly, reservations, walk-in-only, parking, open-late, 24-hours, private-rooms, no-cover, wheelchair-access, halal, vegan-friendly
- **Budget:** budget, moderate, upscale, splurge
- **Highlight:** michelin, hidden-gem, iconic, newly-opened, great-view, local-favourite, tourist-must-try, laptop-friendly

## Design philosophy

Aim for **editorial, not SaaS**. Think *Infatuation × Kinfolk × Filipino heritage* — opinionated, warm, confident, image-led. Generic rounded-card uniformity is the failure mode. Prefer one striking moment per page over five safe ones.

**Permissions (use when they serve the page):**

- **Break the grid.** Asymmetric bento, offset crops, overlapping elements, text bleeding into photography.
- **Mix type weights and sizes aggressively.** Oversize serif display (64–96px+) next to small caps tracked labels. Italic for emotion, not ornament.
- **Use texture and ornament.** SVG grain, subtle paper noise, Filipino-pattern accents (ikat, capiz lattice) at low opacity, occasional hairline rules, drop-caps.
- **Motion, sparingly.** One signature interaction per surface — tilt, parallax, fade-in — never gratuitous.
- **Photography is the star.** Trust crops. Let an image be 80% of a section. Don't always caption.
- **Copy has a voice.** Direct, warm, a little cheeky, locally specific. Write like a food editor, not a product manager. "Manila, served hot" beats "The Manila hot list."

### Brand system (starting point — evolve it)

- **Terracotta** `#C45A3C` — primary accent, CTAs, Best Score, active states.
- **Ink** `#1A1A18` — deep backgrounds (hero, spotlight sections), reverse-out blocks.
- **Cream** `#FAF8F5` — warm page surfaces.
- **Paper** `#FFFFFF` — cards.
- **Saffron** `#F2A438` — reserve for 1–2 accents per page (badges, pull quotes) to punch the palette.
- **Neutrals:** body `#2C2C2A`, secondary `#6B6B68`, border `#E8E5E0`.

Tag dimension pastels (`app/globals.css`) are a baseline — override when the composition needs it.

### Typography

- **Noto Serif** (black / 900) for display. Play with size, not just weight.
- **Plus Jakarta Sans** for labels, buttons, meta, and hero search.
- **Inter** as the body default; rarely seen once a page is designed well.

### Components

Patterns live in `components/` — adapt and extend freely. Don't force a new page into the existing card grammar if a bespoke layout serves it better; create a one-off component instead.

## Commands

```bash
npm run dev     # Dev server
npm run build   # Production build
npm run lint    # ESLint
npx tsc --noEmit # Type check
```
