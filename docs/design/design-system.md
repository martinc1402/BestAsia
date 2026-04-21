# BestPhilippines Design System

**Version 1.0 · April 2026**
*Tropical editorial. The trust of Pitchfork. The browsability of Airbnb.*

---

## The design philosophy in one paragraph

BestPhilippines is a publication that happens to be a tool. Editorial gravity signals trust; photographic browsability signals usefulness; Philippine palette and texture signal place. Every design decision answers one question: *does this help someone trust the score, and decide where to eat tonight?* If yes, it ships. If it's decorative, it cuts.

---

## The three references, resolved

We're pulling from three influences. They want different things. This is how the system holds them together.

**Pitchfork gives us typographic gravity.** Serif headlines, generous whitespace around scores, editorial restraint. The score is the loudest element on any card — larger than the venue name, larger than the photo caption. Like Pitchfork's decimal ratings, the number carries the weight of a verdict. What we take from Pitchfork: hierarchy, seriousness, numerical typography, the refusal to visually soften criticism.

**Airbnb gives us browsability.** Card grids with photo-led information density. Filter chips. Predictable tap targets. Fast horizontal scans. Mobile-first layouts that assume the user is deciding in the next four hours, not bookmarking for next week. What we take from Airbnb: grid discipline, card consistency, filter affordances, list/map toggle patterns.

**Tropical editorial is the rooted identity.** The color palette is Philippine — calamansi yellow, sunset coral, deep teal, volcanic black, paper cream. Subtle grain on section backgrounds. Photography that is specifically Filipino, not generic Asia. A visual register that is warm, humid, slightly sun-bleached, and unmistakably from here.

The tension: Pitchfork wants monochrome restraint. Airbnb wants photo-forward color. Tropical wants warm palette and texture. Our resolution: **restrained structure, warm surface, photo-led content.** The grid is disciplined (Airbnb). The type system is editorial (Pitchfork). The palette and textures are tropical. All three live together.

---

## Color

### Primary palette

| Token | Hex | Use |
|---|---|---|
| `--color-paper` | `#FBF7F0` | Page background, card background |
| `--color-ink` | `#1A1A1A` | Primary text, headlines, score numerals |
| `--color-volcanic` | `#0F0F0F` | Newsletter slab, hero overlays, footer |
| `--color-rust` | `#B85C3C` | Issue numerals, section numbers, accent display |
| `--color-calamansi` | `#F5B800` | Primary CTA, key accent, "featured" badge |
| `--color-coral` | `#E85A4F` | Active states, hover highlights, secondary accent |
| `--color-teal` | `#0A4D5C` | Links, metadata accents, live-time elements |

### Supporting palette

| Token | Hex | Use |
|---|---|---|
| `--color-stone` | `#E8E2D5` | Dividers, subtle borders, disabled states |
| `--color-stone-deep` | `#A39988` | Secondary text, captions, inactive |
| `--color-seafoam` | `#C8D9D7` | Informational backgrounds, tags |
| `--color-ember` | `#8B3A2E` | Score warnings, low-score muted display |

### Score-specific palette

Scores get their own color semantics. The number communicates the verdict visually before the reader even parses it.

| Score range | Token | Hex | Notes |
|---|---|---|---|
| 9.0–10.0 | `--score-canon` | `#B85C3C` (rust) | Canon tier; warm authority |
| 8.0–8.9 | `--score-high` | `#1A1A1A` (ink) | Default; the quiet confidence of a high score |
| 7.0–7.9 | `--score-good` | `#1A1A1A` (ink) | Same tone as high; no visual distinction from 8.x |
| 6.0–6.9 | `--score-mid` | `#A39988` (stone-deep) | Muted; signals "mixed" visually |
| 5.0–5.9 | `--score-low` | `#8B3A2E` (ember) | Warning register; rare |

Rationale: the jump from 7.9 to 8.0 isn't worth a color change — both are confident recommendations. The jumps that matter are *into the canon* (9.0+, warm) and *into the muted band* (below 7.0). Keep the gradations tonal, not noisy.

### Dark mode

Inverted, not invented. Paper becomes volcanic. Ink becomes paper. The accent palette (calamansi, coral, teal, rust) keeps its values — they're designed to work on both grounds. Stone tones shift to their dark-mode equivalents.

```
--color-paper-dark: #0F0F0F
--color-ink-dark: #FBF7F0
--color-stone-dark: #2A2925
--color-stone-deep-dark: #6B6256
```

### Accessibility

Every text/background pairing tested against WCAG AA (4.5:1 for body, 3:1 for large). Rust on paper is 5.1:1. Teal on paper is 7.8:1. Coral on paper is 3.9:1 — **do not use coral for body text**, only for accents and interactive states where the 3:1 large-text minimum applies.

---

## Typography

The type system is where editorial identity lives. Two faces carrying the weight, with strict rules about when each shows up.

### The two typefaces

**Serif display: Fraunces** (Google Fonts, variable)

Used for: headlines, section headers ("01 · Tonight"), verdicts, article titles, and all score numerals. This is the editorial voice made visual. Use the variable axis for weight (400–800) and optical size. For large display at the top of the canon hero, use optical size 144 at weight 700.

Why Fraunces: warm, slightly eccentric, high-contrast enough to command a hero but readable at body-adjacent sizes. The optical size axis lets the same font work at 12px and 120px without compromise. It has Filipino language support (Tagalog uses Latin script so this is table stakes, but worth confirming).

**Sans-serif utility: Inter** (Google Fonts, variable)

Used for: body text, card microcopy, metadata, UI elements, filters, nav, timestamps, all admin interfaces. Inter is invisible — that's the point. It carries information without announcing itself, which lets Fraunces do the announcing.

Why Inter: proven, accessible, has Filipino support, renders well at all sizes, familiar to every developer. If we need to swap it for performance reasons later, it has drop-in replacements (Geist, Manrope). Fraunces is harder to swap out — it's doing work nothing else does.

### Type scale

All sizes in `rem`. Base is 16px.

| Token | Size | Weight | Face | Use |
|---|---|---|---|---|
| `--type-display` | 5.5rem (88px) | 700 | Fraunces | Hero headlines ("Where the Philippines drinks...") |
| `--type-h1` | 3rem (48px) | 700 | Fraunces | Canon hero, venue name on entry page |
| `--type-h2` | 2.25rem (36px) | 700 | Fraunces | Section headers, list titles |
| `--type-h3` | 1.5rem (24px) | 600 | Fraunces | Card venue names, sub-sections |
| `--type-h4` | 1.125rem (18px) | 600 | Fraunces | Small venue names in compact cards |
| `--type-verdict` | 1.25rem (20px) | 400 italic | Fraunces | One-line verdicts ("The only ramyun...") |
| `--type-body-lg` | 1.125rem (18px) | 400 | Inter | Long-form body (about, scoring, policies) |
| `--type-body` | 1rem (16px) | 400 | Inter | Default body |
| `--type-body-sm` | 0.875rem (14px) | 400 | Inter | Metadata, captions, secondary info |
| `--type-micro` | 0.75rem (12px) | 500 | Inter | UPPERCASE labels, badges, tags |
| `--type-score-display` | 8rem (128px) | 700 | Fraunces | Score on venue entry page |
| `--type-score-card` | 4.5rem (72px) | 700 | Fraunces | Score on featured cards |
| `--type-score-chip` | 1.5rem (24px) | 700 | Fraunces | Score on compact cards |

### The verdict line

The one-line verdict is the single most-read writing on the site. It deserves its own treatment.

```
--type-verdict: 1.25rem / 1.4 Fraunces italic weight 400
color: --color-ink
max-width: 32ch (enforces one line at common breakpoints; wraps gracefully below)
```

Italic Fraunces at this size reads as editorial speech — the publication speaking directly. Not quoted (we own the opinion). Not set in display (it's not a headline). Set apart from card microcopy by typeface and tone.

### Editorial numerals

Section numbers ("01", "02", "03") on the homepage use Fraunces at `--type-display` in rust, positioned to bleed slightly off the left edge on desktop. These are identity, not decoration. Match the weight and face of the hero headline; differentiate by color and placement.

### Filipino typography

Filipino dish names and place names are not italicized (per the voice guide). Taglish headlines are set in the same face as English — no stylistic othering of local language. If a Taglish headline uses ng or mga, they render in Fraunces the same as any English headline would.

---

## Spacing

Base unit: `0.25rem` (4px). All spacing is a multiple.

| Token | Value | Use |
|---|---|---|
| `--space-1` | 0.25rem | Tight inline spacing |
| `--space-2` | 0.5rem | Chip internal padding |
| `--space-3` | 0.75rem | Card internal tight |
| `--space-4` | 1rem | Default inline, card padding |
| `--space-6` | 1.5rem | Between related elements |
| `--space-8` | 2rem | Section internal |
| `--space-12` | 3rem | Between sections (mobile) |
| `--space-16` | 4rem | Between sections (desktop) |
| `--space-24` | 6rem | Major section breaks |
| `--space-32` | 8rem | Hero padding top (desktop) |

### Container widths

```
--width-narrow: 640px    (reading content: about, policies, scoring)
--width-medium: 960px    (venue entry pages, list pages)
--width-wide: 1280px     (homepage, canon grid, admin)
--width-full: 100%       (hero, full-bleed photography)
```

### Grid

12-column grid on desktop, 4-column on mobile, fluid between. Gutters: `--space-6` on mobile, `--space-8` on desktop. No gimmicks — Airbnb's grid discipline is what makes scanning fast.

---

## Texture

The difference between "clean SaaS" and "tropical editorial" lives in surface. A flat cream background reads as generic. Cream + subtle grain reads as paper, as humidity, as somewhere.

**Grain overlay**: a film-grain texture applied to major surfaces at **5% opacity**. Not 10% (noisy). Not 2% (invisible). 5% is the edge of perceptibility and does the work. Applied to:

- Section backgrounds where cards sit
- The newsletter slab (grain visible against volcanic black)
- Canon page hero

Not applied to:
- Photography (the photos carry their own texture)
- Card faces (keeps cards crisp for readability)
- Admin interfaces (utility, not identity)

Implementation: a single 400×400px PNG grain texture, repeated, at `opacity: 0.05` on a pseudo-element. Easy to adjust site-wide if the level ends up wrong.

**Paper warmth**: the paper color (`#FBF7F0`) is warmer than pure white. That's deliberate. At a glance it reads as cream; on second look it reads as aged paper. The warmth is the tropical register working at the background level.

---

## Imagery

The image rules are where the design system meets the content strategy. Photos carry more identity than any other element.

### Photography requirements

**Every venue photo must be specifically Filipino and specifically the venue.** No stock imagery of "Asian food." No generic cocktail photos. If we can't get a real photo of the venue, the venue doesn't ship with imagery — we use a typographic card instead (Fraunces venue name on cream with score, no photo).

**Hero photography** (venue entry, homepage pick, canon hero): 16:9 aspect ratio, minimum 2000px wide. Dim edit (Exposure −0.3, Contrast +0.2 in Lightroom terms) so the image reads as mood rather than advertisement. Photographs should feel like they were taken at the venue by someone who was there to eat, not by a stylist.

**Card photography** (grid cards, list entries): 4:3 aspect ratio, minimum 1200px wide. Centered subject. The photo needs to work small — a plate of food at 400px wide should still be legible.

**Thumbnails** (compact cards, related venues): 1:1 aspect ratio, 400px wide. Tightly cropped; if the original is a room shot, thumbnail is a detail.

### Image sources, in order of preference

1. **Editorial photography** — taken by Martin, Yahnee, or a commissioned photographer during a visit. Preferred. Carries authenticity and licensing is clean.
2. **Venue-provided** — licensed from the venue, with written permission logged in `venue_images.license`. Second best. Watch for obvious PR photography (glossy, over-styled); these undercut the editorial tone.
3. **Public domain / Creative Commons** — only if the first two aren't available. Attribution logged per `venue_images.credit`.
4. **Commissioned original** — worth the cost for canon entries (8.5+).

Do not use: Google Places photos (licensing unclear), Unsplash stock (too generic), AI-generated imagery (ever).

### Overlays and treatment

Hero images get a gradient overlay from `--color-volcanic` at 70% at the bottom fading to 0% at 40% height. This ensures white text on the hero (headline, tagline, score) always has legibility without darkening the whole image.

Card images: no overlay. The card microcopy lives below the photo, on the cream card surface. Don't compete with the photography.

### Alt text

Required on every image. Per-venue alt text describes the specific shot, not generic: `"The sisig platter at Kim's Ramyun, Poblacion"` not `"Filipino food"`. Enforced at the database level (see `venue_images.alt_text NOT NULL` in `data-pipeline.md`).

---

## Components

### The venue card

This is the most-reused component on the site. Multiple variants but one design language.

**Featured card** (homepage "Tonight" hero, canon featured list):
- 4:3 hero image at top
- Score displayed at 4.5rem Fraunces on top-right corner of image, rust or ink depending on tier
- Category + neighborhood in micro type, uppercase, calamansi color
- Venue name in 1.5rem Fraunces, two-line max, ink
- Verdict line in italic Fraunces, 1.25rem, stone-deep
- Card background: paper. No shadow; separated from page by spacing alone.

**Standard card** (canon lists, list pages, related venues):
- 4:3 image at top
- Small score chip (1.5rem Fraunces) in top-right of image in paper-colored pill
- Category · neighborhood in micro type
- Venue name in 1.125rem Fraunces, single line with ellipsis
- Verdict on hover only (keeps scan fast on mobile)

**Compact card** (admin lists, sidebar suggestions):
- No image; typographic only
- Score on left in Fraunces at 1.5rem, colored by tier
- Venue name + neighborhood in Inter, single line
- Minimal chrome

### Score display (entry page)

The hero of every venue entry page. The score is the biggest element on the page, larger than the venue name.

```
┌────────────────────────────┐
│                            │
│           8.2              │  ← --type-score-display, Fraunces 700
│                            │
│   Algorithmic: 7.6         │  ← sub-scores, --type-body-sm, stone-deep
│   Editorial:   +0.6        │
│   ─────────────            │
│   BestPhilippines          │  ← label, --type-micro, uppercase
│                            │
└────────────────────────────┘
```

The sub-scores (algorithmic, editorial adjustment, final) are always visible. They are the transparency promise rendered. Do not hide them behind a tooltip. The math is the feature.

### Filter chips

Airbnb-style. Pill-shaped, `--type-micro`, ink on paper when inactive, paper on ink when active. Horizontal scroll on mobile; inline wrap on desktop.

### The score sparkline

The 12-month score history visualization on every entry page.

- 80px tall, full card width
- Line in ink, 2px
- Fill under line in teal at 15% opacity
- Dots at each monthly sample, rust if the score moved >0.3, stone if stable
- Labels: start, peak, trough, current — only four. No grid.

### Badges

Three badges. Each means something specific; none are decorative.

- **BNT (Best New Table)** — calamansi background, ink text, "BNT" in Fraunces. Shown on venue cards when the venue has an active BNT award. One size, one color, no variations.
- **Editor's Pick** — paper background, rust text, "EDITOR'S PICK" in micro uppercase. Used on homepage and weekly picks.
- **This Month's Argument** — teal background, paper text. Used only on the featured canon list each month.

Nothing else gets a badge. If we add more, they devalue.

### Live strip

The thin monospace strip under the nav showing Manila time, temperature, and update timestamp.

```
● MANILA · 10:14 AM · 29°C · UPDATED 8 MIN AGO
```

Font: JetBrains Mono or similar, 0.75rem, stone-deep on paper. The dot is a 6px coral circle with subtle pulse animation (3s cycle, opacity 0.6 to 1.0, no size change). This sells "live" without being gimmicky.

---

## Interaction

### Motion

Keep it restrained. Editorial sites that over-animate feel insecure about their content. Allowed motion:

- **Fade** (200ms, ease-out): page transitions, modal entry
- **Slide up** (300ms, ease-out): card hover lift, 4px translation
- **Subtle pulse** (3s, linear infinite): the live strip dot only
- **Score count-up** (400ms, ease-out): on the venue entry page hero, the score counts from 0 to its value on first load. Once only. Skipped if user has `prefers-reduced-motion`.

Not allowed: parallax, spring animations, scroll-triggered reveals, anything that would make Pitchfork uncomfortable.

### Hover and focus

Hover on cards: 4px lift, 150ms. Focus rings use `--color-coral` at 2px, 2px offset. Never remove focus rings — keyboard users read the site too.

### Touch targets

44×44px minimum on mobile (iOS HIG and WCAG). Applies to filter chips, nav items, card tap areas, the entire venue-card surface (not just the name).

---

## Mobile-first

More than half of traffic will be mobile — decisions made between leaving work and arriving at dinner. Design decisions optimize for thumb navigation, small screens, and one-handed use.

- Primary navigation collapses to bottom tab bar on mobile (Discover / The Lists / City Guides / Quiz)
- Cards stack single-column below 768px
- Hero text drops from 88px to 48px below 640px
- Filter chips scroll horizontally on mobile; inline on desktop
- The score stays at its full size ratio — it's the most important element regardless of viewport

Test every new component at 375px width (iPhone SE territory). If it doesn't work there, it doesn't ship.

---

## Tailwind implementation

Tailwind config lives in the app. Custom tokens extend the default theme — they don't replace it.

```typescript
// tailwind.config.ts (excerpted)
export default {
  theme: {
    extend: {
      colors: {
        paper: '#FBF7F0',
        ink: '#1A1A1A',
        volcanic: '#0F0F0F',
        rust: '#B85C3C',
        calamansi: '#F5B800',
        coral: '#E85A4F',
        teal: '#0A4D5C',
        stone: '#E8E2D5',
        'stone-deep': '#A39988',
        seafoam: '#C8D9D7',
        ember: '#8B3A2E',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        display: ['5.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        verdict: ['1.25rem', { lineHeight: '1.4', fontStyle: 'italic' }],
        'score-display': ['8rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
        'score-card': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'score-chip': ['1.5rem', { lineHeight: '1', letterSpacing: '-0.01em' }],
      },
    },
  },
}
```

### The banned classes

Some Tailwind defaults work against the system. Banned from the codebase:

- `font-black`, `font-thin` — stick to 400 / 600 / 700 weights
- `text-3xl`, `text-4xl`, etc. — use the named size tokens (`text-display`, `text-verdict`, etc.)
- `shadow-lg`, `shadow-xl`, etc. — we don't use dropshadows; cards separate via spacing
- `rounded-full` on anything that isn't a filter chip, avatar, or badge
- Any arbitrary color value — if a color isn't in the palette, it doesn't render

A lint rule should enforce this list. Until it exists, Claude Code should self-check against the palette before shipping.

---

## What we don't do

Decisions made by subtraction matter as much as the additions. BestPhilippines does not:

- **Use shadows to separate content.** Cards sit on a colored background and are defined by spacing. No dropshadows, no elevation system, no Material-style depth metaphor.
- **Use gradients except on hero overlays.** Gradients are the visual language of SaaS landing pages. The hero gradient (volcanic to transparent) is the only allowed use.
- **Use illustration.** No custom spot illustrations, no mascot, no emoji-driven UI. Photography and typography carry the identity. If we can't photograph it or write it, we don't render it.
- **Use a loading spinner.** Skeleton states in paper tone with subtle pulse. Spinners feel transactional; BestPhilippines is editorial.
- **Animate on scroll.** Content should be stable. Scroll-triggered reveals are theater.
- **Use glassmorphism, neumorphism, or any current UI trend.** These age badly. The target aesthetic is "paper publication that happens to be on the internet."

---

## Naming and tokenization in code

Every value in this document exists as a CSS custom property and a Tailwind token. When building components, Claude Code should:

1. Reference the token (`bg-paper`, `text-ink`, `font-display`)
2. Never hardcode hex values or raw rem values in components
3. If a new token is needed, add it to the Tailwind config AND this document in the same PR
4. Flag to editorial if the design system seems to be missing a capability

---

## Version history

- **v1.0 — April 2026.** Initial design system.

---

## What's deliberately not in this doc

Things that will need their own documents once the product is further along:

- **Component library implementation** — React components for each pattern above. Lives in `/components`, documented in Storybook or similar. Deferred to implementation.
- **Illustration / icon set** — we're not using illustration in v1, but we'll need a small icon set (nav, filter, share). Use Lucide (already in the stack) with no customization until we have reason to customize.
- **Print / editorial layout** — if we do a print BestAsia Annual in Phase 3, it'll need its own design system extension.
- **Email design** — the Monday Briefing needs its own design spec. Related but separate.
- **Motion system beyond the basics** — if the site needs more motion (unlikely), document it.

For any visual decision not covered here, fall back on the three references (Pitchfork, Airbnb, tropical editorial) and the core question: *does this help someone trust the score, and decide where to eat tonight?*

---

*Martin Casey & Yahnee Ortiz*
*Manila, April 2026*
