# BestPhilippines — Project Brief

> This document captures all product decisions, architecture, and context for BestPhilippines.co.
> It should be read by any AI assistant or developer working on this project.

---

## 1. Product Overview

**BestPhilippines.co** is a curated directory and decision engine for the best bars, restaurants, cafes, and nightclubs in the Philippines. It differentiates from competitors (Booky.ph, Google Maps, TripAdvisor) through smarter curation via a proprietary **Best Score** algorithm, a **quiz-based recommendation engine**, and **AI-powered tagging** from review analysis.

**Tagline concept:** "Fewer venues. Better curation. Smarter recommendations."

**Domain:** bestphilippines.co
**Umbrella brand:** bestasia.co (secured for future SEA expansion — BestThailand, BestVietnam, etc.)

---

## 2. Target Audience

| Segment | Priority | Language | What they want |
|---------|----------|----------|----------------|
| Tourists visiting Philippines | Primary | English | "Best of" lists, location-based discovery, trustworthy picks |
| Expats & digital nomads | Primary | English | Cafe WiFi, hidden gems, neighbourhood guides, repeat use |
| Local Filipinos | Secondary | English with Taglish tone | Date night, barkada dinners, budget picks |

**Language strategy:** English-first with casual Taglish tone. Professional enough for tourists, relatable for locals.

---

## 3. Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | **Next.js** (App Router, SSR for SEO) |
| Styling | **Tailwind CSS** |
| Database | **Supabase** (PostgreSQL + PostGIS) |
| Auth | Supabase Auth (future — not in MVP) |
| Hosting | **Vercel** |
| Data ingestion | Outscraper (initial seed) + Google Places API (ongoing refresh) |
| AI tagging | **Claude API** (Anthropic) |
| Future mobile | React Native / Expo (shared business logic) |

---

## 4. Database Schema

The database is hosted on Supabase (PostgreSQL with PostGIS enabled). All tables have RLS enabled with public read access for active/published content.

### Tables

#### `cities`
```
id              UUID PRIMARY KEY
name            TEXT UNIQUE          -- 'Manila'
slug            TEXT UNIQUE          -- 'manila'
country         TEXT DEFAULT 'Philippines'
latitude        DOUBLE PRECISION
longitude       DOUBLE PRECISION
is_active       BOOLEAN DEFAULT false
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
```
**Seeded with:** Manila (active), Cebu, Boracay, Siargao, Palawan, Davao (inactive — future expansion)

#### `neighborhoods`
```
id              UUID PRIMARY KEY
city_id         UUID → cities(id)
name            TEXT               -- 'Poblacion'
slug            TEXT               -- 'poblacion'
description     TEXT               -- editorial blurb
latitude        DOUBLE PRECISION   -- center point
longitude       DOUBLE PRECISION
radius_meters   INTEGER DEFAULT 1500
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
UNIQUE(city_id, slug)
```
**Seeded with 18 Manila neighborhoods:** Poblacion, BGC, Makati CBD, Salcedo Village, Legazpi Village, Quezon City, Kapitolyo, Intramuros, Alabang, Eastwood, Ermita/Malate, San Juan, Binondo, Mandaluyong, Pasay, Tomas Morato, Maginhawa, Ortigas

#### `venues` (core table — 2,372 rows)
```
id                  UUID PRIMARY KEY
name                TEXT NOT NULL
slug                TEXT UNIQUE          -- 'the-curator-makati'
category            TEXT NOT NULL        -- 'bar' | 'restaurant' | 'cafe' | 'nightclub'
subcategory         TEXT                 -- 'speakeasy', 'ramen', 'specialty-coffee'
city_id             UUID → cities(id)
neighborhood_id     UUID → neighborhoods(id)
address             TEXT
latitude            DOUBLE PRECISION
longitude           DOUBLE PRECISION
phone               TEXT
website             TEXT
instagram           TEXT                 -- handle without @
facebook_url        TEXT
opening_hours       JSONB
price_level         SMALLINT (1-4)       -- 1=₱ under ₱500, 2=₱₱ ₱500-1500, 3=₱₱₱ ₱1500-3000, 4=₱₱₱₱ ₱3000+
is_open_late        BOOLEAN
is_24_hours         BOOLEAN
google_rating       NUMERIC(2,1)
google_review_count INTEGER
google_place_id     TEXT UNIQUE
foursquare_rating   NUMERIC(3,1)
foursquare_id       TEXT
best_score          NUMERIC(4,1)         -- 0-100 composite score
best_score_rank     INTEGER              -- rank within category+city
score_quality       NUMERIC(4,1)         -- max 35
score_popularity    NUMERIC(4,1)         -- max 25
score_recency       NUMERIC(4,1)         -- max 15
score_trending      NUMERIC(4,1)         -- max 10
score_editorial     NUMERIC(4,1)         -- max 15 (manual boost)
editorial_notes     TEXT
short_description   TEXT
featured_photo_url  TEXT
status              TEXT                 -- 'active' | 'unverified' | 'closed' | 'flagged'
is_featured         BOOLEAN DEFAULT false -- paid featured listing
last_google_sync    TIMESTAMPTZ
last_foursquare_sync TIMESTAMPTZ
last_score_calc     TIMESTAMPTZ
created_at          TIMESTAMPTZ
updated_at          TIMESTAMPTZ
```

**Current state:** 2,372 total venues, 500 set to status='active'
**Category breakdown:** 1,145 restaurants, 518 bars, 515 cafes, 194 nightclubs

#### `tags` (66 rows)
```
id              UUID PRIMARY KEY
dimension       ENUM('occasion','vibe','cuisine','practical','budget','highlight')
name            TEXT               -- 'date-night'
display_name    TEXT               -- 'Date night'
description     TEXT
icon            TEXT
sort_order      SMALLINT
UNIQUE(dimension, name)
```

#### `venue_tags` (7,371 rows — junction table)
```
id              UUID PRIMARY KEY
venue_id        UUID → venues(id)
tag_id          UUID → tags(id)
source          TEXT               -- 'api' | 'ai_inferred' | 'manual'
confidence      NUMERIC(3,2)       -- 0.00-1.00
is_verified     BOOLEAN
is_rejected     BOOLEAN
UNIQUE(venue_id, tag_id)
```

#### `venue_photos`
```
id              UUID PRIMARY KEY
venue_id        UUID → venues(id)
google_photo_ref TEXT
photo_url       TEXT
width           INTEGER
height          INTEGER
attribution     TEXT
sort_order      SMALLINT           -- 0 = featured/hero
```

#### `curated_lists` (8 published)
```
id              UUID PRIMARY KEY
title           TEXT
slug            TEXT UNIQUE        -- 'rooftop-bars-manila'
description     TEXT
city_id         UUID → cities(id)
neighborhood_id UUID → neighborhoods(id)
category        TEXT
meta_title      TEXT
meta_description TEXT
is_published    BOOLEAN
is_sponsored    BOOLEAN
sponsor_name    TEXT
published_at    TIMESTAMPTZ
```

#### `curated_list_items`
```
id              UUID PRIMARY KEY
list_id         UUID → curated_lists(id)
venue_id        UUID → venues(id)
position        SMALLINT           -- rank (1, 2, 3...)
editorial_note  TEXT               -- "Why we love it"
UNIQUE(list_id, venue_id)
UNIQUE(list_id, position)
```

#### `quiz_questions` (5 questions)
```
id              UUID PRIMARY KEY
tag_dimension   ENUM               -- which dimension this question maps to
question_text   TEXT               -- "What's the vibe you're looking for?"
subtitle        TEXT
sort_order      SMALLINT           -- question sequence
category_filter TEXT               -- show only for specific category, or NULL for all
is_active       BOOLEAN
```

#### `quiz_options` (20 options)
```
id              UUID PRIMARY KEY
question_id     UUID → quiz_questions(id)
tag_id          UUID → tags(id)
label           TEXT               -- "Chill and laid-back"
description     TEXT               -- "Relaxed atmosphere, soft music"
sort_order      SMALLINT
UNIQUE(question_id, tag_id)
```

#### `sync_log`
```
id              UUID PRIMARY KEY
source          TEXT               -- 'google_places' | 'foursquare' | 'ai_tagger' | 'outscraper'
operation       TEXT               -- 'full_seed' | 'refresh_ratings' | 'tag_batch'
status          TEXT               -- 'started' | 'completed' | 'failed'
venues_processed INTEGER
venues_added    INTEGER
venues_updated  INTEGER
tags_assigned   INTEGER
error_message   TEXT
metadata        JSONB
started_at      TIMESTAMPTZ
completed_at    TIMESTAMPTZ
```

### Useful Views

**`venue_with_tags`** — Venues joined with their tags as a JSONB array. Use for frontend queries.

**`venue_leaderboard`** — Venues ranked within their category per city. Includes `category_rank`.

### Database Functions

**`compute_best_score(rating, review_count, max_reviews, recency, trending, editorial)`** — Returns NUMERIC score 0-100.

**`generate_slug(input_text, suffix)`** — Returns URL-safe slug.

---

## 5. Best Score Algorithm

The proprietary scoring formula (0-100):

```
Best Score =
  (google_rating / 5 × 35)                              ← quality (max 35)
+ (log(review_count) / log(max_reviews) × 25)            ← popularity (max 25)
+ (recency_factor × 15)                                  ← fresh reviews (max 15)
+ (foursquare_trending × 10)                             ← momentum (max 10)
+ (editorial_boost × 15)                                 ← manual curation (max 15)
```

- Logarithmic review count prevents chains from dominating purely on volume
- Recency factor (0-1) decays for venues without recent reviews
- Editorial boost is the human curation layer — the moat
- All 5 components are stored individually for transparency

**Current issue:** Top venues are dominated by chains (Gerry's Grill, Tong Yang) because editorial boosts haven't been applied yet. This is expected and will be fixed during manual curation.

---

## 6. Tag Taxonomy (66 tags across 6 dimensions)

### Occasion (12 tags)
date-night, group-dinner, solo-dining, business-meal, family-kids, celebration, late-night-eats, remote-work, pre-game-drinks, impress-visitors, chill-hangout, bar-hopping

### Vibe (12 tags)
chill, lively, romantic, trendy, rooftop, speakeasy, heritage, cozy, wild, quiet, live-music, outdoor

### Cuisine (16 tags)
filipino, japanese, korean, chinese, italian, spanish, craft-cocktails, specialty-coffee, buffet, steakhouse, street-food, fine-dining, wine-whisky, craft-beer, sea-fusion, brunch

### Practical (14 tags)
free-wifi, power-outlets, pet-friendly, kid-friendly, reservations, walk-in-only, parking, open-late, 24-hours, private-rooms, no-cover, wheelchair-access, halal, vegan-friendly

### Budget (4 tags)
budget (under ₱500), moderate (₱500-₱1,500), upscale (₱1,500-₱3,000), splurge (₱3,000+)

### Highlight (8 tags)
michelin, hidden-gem, iconic, newly-opened, great-view, local-favourite, tourist-must-try, laptop-friendly

### Tag Sources
- **`api`** (5,861 tags): Extracted from Google Places structured data (price level, hours, cuisine type, accessibility, atmosphere, amenities)
- **`ai_inferred`** (1,510 tags): Generated by Claude API from analysis of Google Reviews text. Each has a confidence score (0-1). Tags ≥0.8 confidence are auto-verified.
- **`manual`**: Human-curated (editorial team adds these)

---

## 7. Content Types / Page Templates (9 total)

### Core Discovery (SEO workhorses)
1. **Homepage** — `/` — Hero + 3 decision engine entry points + trending venues + curated list previews
2. **Venue page** — `/venue/[slug]` — Single venue detail with photos, tags, score, map, similar venues
3. **City page** — `/[city]` — Location hub with category breakdown + top venues + neighborhood guide
4. **Category page** — `/[city]/[category]` — Filtered listing (e.g., `/manila/bars`)

### Decision Engine (conversion drivers)
5. **Quiz flow** — `/quiz` — 5-step questionnaire mapping to tags, outputs ranked recommendations
6. **AI chat** — `/ask` — Conversational recommendations (post-MVP)
7. **Curated list** — `/best/[slug]` — Ranked editorial lists (e.g., `/best/rooftop-bars-manila`)

### Supporting Content
8. **Blog / guide** — `/guide/[slug]` — Long-form articles (post-MVP)
9. **User profile** — `/profile` — Saved venues, reviews, lists (post-MVP)

### MVP Pages (launch with these)
Homepage, venue pages, quiz flow, curated lists, category pages, city page (Manila only)

### URL Structure
```
bestphilippines.co/                           → Homepage
bestphilippines.co/manila                     → City page
bestphilippines.co/manila/bars                → Category page
bestphilippines.co/manila/restaurants         → Category page
bestphilippines.co/venue/the-curator-makati   → Venue detail
bestphilippines.co/best/rooftop-bars-manila   → Curated list
bestphilippines.co/quiz                       → Quiz flow
```

---

## 8. Current Curated Lists (8 published)

1. Top 10 restaurants in Manila
2. Top 10 bars in Poblacion
3. Best cafes for remote work in Manila (6 venues — needs more)
4. Best date night restaurants in Makati
5. Top 10 bars in BGC
6. Best Filipino restaurants in Manila
7. Best nightclubs in Manila
8. Top 10 rooftop bars in Manila (4 venues — needs more)

---

## 9. Quiz Engine Logic

The quiz has 5 questions, each mapping to one tag dimension:

| # | Question | Dimension | Options |
|---|----------|-----------|---------|
| 1 | What's the occasion? | occasion | Date night, Group dinner, Casual hangout, Celebration |
| 2 | What vibe are you after? | vibe | Chill, Lively, Romantic, Trendy |
| 3 | What's your budget per person? | budget | ₱, ₱₱, ₱₱₱, ₱₱₱₱ |
| 4 | Any cuisine preference? | cuisine | Filipino, Japanese, Korean, Italian |
| 5 | Anything else you need? | practical | WiFi, Pet friendly, Kid friendly, Reservations |

**Recommendation algorithm:** User selections map to tag_ids. Query `venue_tags` to find venues matching the most selected tags, weighted by confidence score, then rank by Best Score. Return top 3-5 matches with match percentage.

---

## 10. Supabase Connection

```
URL: https://cctpodjczobljpdvvhlh.supabase.co
```

Use legacy API keys (Settings → API → "Legacy anon, service_role API" tab):
- **anon key** (starts with `eyJhbG...`) — for frontend/client-side queries
- **service_role key** (starts with `eyJhbG...`) — for server-side/admin operations

Environment variables needed:
```
NEXT_PUBLIC_SUPABASE_URL=https://cctpodjczobljpdvvhlh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...your_anon_key
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...your_service_role_key
```

---

## 11. Competitors & Positioning

| Competitor | Their strength | Our advantage |
|-----------|---------------|---------------|
| Booky.ph | 31K+ restaurants, deals/BOGO | Their filtering is terrible (users complain). We have Best Score + quiz + AI tags |
| Spot.ph | Editorial authority, "50 Great Restaurants" | They're editorial-only with no decision engine |
| The Infatuation | High-quality editorial, "Perfect For" tags | No quiz, no AI, no scoring algorithm |
| bestinmanila.com | Blog-style guides, similar concept | Blog not platform — no filtering, scoring, or interactivity |
| TripAdvisor | Massive review volume | Generic, not Philippines-specific. No curation layer |

**Our moat:** Best Score algorithm + quiz decision engine + AI-tagged taxonomy. No competitor has all three.

---

## 12. Design Direction

- **Mobile-first** — Philippines is 80%+ mobile traffic
- **Fast loading** — many users on slow mobile data
- **Clean, modern** — not cluttered like TripAdvisor
- **Brand colors:** Green (#1D9E75) as primary accent (from the "Best" in BestPhilippines)
- **Tone:** Warm, opinionated, trustworthy. Not corporate. Think The Infatuation meets a local friend's recommendations
- **No user accounts for MVP** — browse freely, no friction

---

## 13. Monetization (future)

1. **Featured listings** — venues pay $50-$150/month to appear higher (clearly labeled)
2. **Affiliate bookings** — link to Klook, Resy, Eatigo for commission
3. **Sponsored curated lists** — brands sponsor lists (e.g., San Miguel sponsors "Best bars")
4. **Premium subscription** — $5/month for advanced AI recommendations (post-MVP)

---

## 14. SEO Strategy

- Every curated list = SEO landing page targeting long-tail keywords
- URL structure matches search intent: `bestphilippines.co/best/rooftop-bars-manila`
- Venue pages build deep internal link structure
- Server-side rendering via Next.js for crawlability
- Meta titles and descriptions set on curated lists

---

## 15. Data Pipeline

### Initial Seed (completed)
```
Outscraper Google Maps Scraper → 4 XLSX files (restaurants, bars, cafes, nightclubs)
    ↓
seed_venues.py → clean, dedup, score, assign neighborhoods → Supabase venues table
    ↓
Outscraper Reviews Scraper → 30,000 reviews for top 300 venues
    ↓
seed_ai_tags.py → Claude API analyzes reviews → Supabase venue_tags table
    ↓
seed_curated.py → activate top 500, create quiz options, generate 8 curated lists
```

### Ongoing Refresh (to be built)
- Weekly: Google Places API refresh of ratings + hours for active venues
- Monthly: Recalculate Best Scores
- Quarterly: Full Outscraper re-scrape to catch new venues

---

## 16. Key Queries for the Frontend

### Get active venues with tags (for listing pages)
```sql
SELECT * FROM venue_with_tags
WHERE city_slug = 'manila'
AND category = 'bar'
ORDER BY best_score DESC
LIMIT 20;
```

### Get a single venue with tags (for venue detail page)
```sql
SELECT * FROM venue_with_tags WHERE slug = 'the-curator-makati';
```

### Get curated list with venues (for list pages)
```sql
SELECT cl.*, cli.position, cli.editorial_note, v.*
FROM curated_lists cl
JOIN curated_list_items cli ON cl.id = cli.list_id
JOIN venues v ON cli.venue_id = v.id
WHERE cl.slug = 'rooftop-bars-manila'
ORDER BY cli.position;
```

### Quiz recommendation query
```sql
-- Given selected tag_ids from quiz answers, find best matching venues
SELECT v.*, COUNT(vt.tag_id) AS match_count,
       AVG(vt.confidence) AS avg_confidence
FROM venues v
JOIN venue_tags vt ON v.id = vt.venue_id
WHERE vt.tag_id IN ('tag-uuid-1', 'tag-uuid-2', 'tag-uuid-3')
AND v.status = 'active'
AND vt.is_rejected = false
GROUP BY v.id
ORDER BY match_count DESC, v.best_score DESC
LIMIT 5;
```

### Get venues by neighborhood
```sql
SELECT v.* FROM venues v
JOIN neighborhoods n ON v.neighborhood_id = n.id
WHERE n.slug = 'poblacion' AND v.status = 'active'
ORDER BY v.best_score DESC;
```

### Get quiz questions with options
```sql
SELECT q.*, json_agg(
  json_build_object('id', o.id, 'label', o.label, 'description', o.description, 'tag_id', o.tag_id)
  ORDER BY o.sort_order
) AS options
FROM quiz_questions q
JOIN quiz_options o ON q.id = o.question_id
WHERE q.is_active = true
GROUP BY q.id
ORDER BY q.sort_order;
```

---

## 17. What's Built vs What's Next

### ✅ Completed
- Database schema with all tables, indexes, RLS policies, views
- 2,372 venues seeded from Outscraper (500 active)
- 7,371 tags assigned (API + AI)
- 8 curated lists created and published
- Quiz questions and options populated
- Best Score algorithm implemented and ranked
- 18 Manila neighborhoods mapped with coordinates

### 🔜 Next (Frontend MVP)
- Homepage with decision engine entry points
- Venue detail pages (SSR for SEO)
- Curated list pages
- Category listing pages with filters
- Quiz flow with recommendation results
- City page (Manila)
- Mobile-responsive design
- Deploy to Vercel + connect domain

### 📋 Later
- Google Places API refresh script
- AI chat recommendations
- User accounts + saved venues
- Blog/guide content
- Additional cities (Cebu, Boracay)
- Featured listings monetization
- Mobile app (React Native)

---

## 18. File Structure (suggested for Next.js)

```
bestphilippines/
├── app/
│   ├── layout.tsx                    # Root layout with nav + footer
│   ├── page.tsx                      # Homepage
│   ├── quiz/
│   │   └── page.tsx                  # Quiz flow
│   ├── best/
│   │   └── [slug]/
│   │       └── page.tsx              # Curated list pages
│   ├── venue/
│   │   └── [slug]/
│   │       └── page.tsx              # Venue detail pages
│   ├── [city]/
│   │   ├── page.tsx                  # City page
│   │   └── [category]/
│   │       └── page.tsx              # Category listing
│   └── api/
│       └── quiz/
│           └── recommend/
│               └── route.ts          # Quiz recommendation API
├── components/
│   ├── VenueCard.tsx
│   ├── VenueGrid.tsx
│   ├── TagBadge.tsx
│   ├── BestScoreBadge.tsx
│   ├── QuizStep.tsx
│   ├── QuizResults.tsx
│   ├── CuratedListCard.tsx
│   ├── NeighborhoodMap.tsx
│   ├── SearchBar.tsx
│   ├── FilterSidebar.tsx
│   ├── Navbar.tsx
│   └── Footer.tsx
├── lib/
│   ├── supabase.ts                   # Supabase client setup
│   ├── queries.ts                    # Reusable database queries
│   └── types.ts                      # TypeScript types matching DB schema
├── public/
├── bestphilippines-seeder/           # Data pipeline scripts
└── .env.local                        # Environment variables
```
