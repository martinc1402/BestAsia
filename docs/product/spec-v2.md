# BestAsia — Editorial Positioning & Roadmap

**Version 2.0 · April 2026**
*The Pitchfork of Asian dining, drinking, and clubbing*

---

## The positioning in one line

**BestAsia is a living, scored, ranked, and argued guide to where Asia eats, drinks, and stays out late — starting with algorithmic rigor, earning the right to have opinions, and eventually becoming the publication people fight with.**

Three things that distinguish it from every competitor:

1. **It scores.** 0.0 to 10.0, one decimal place, with a published algorithm. No "hidden gems," no participation trophies. A 6.2 is a real verdict.
2. **It's alive.** Scores recompute weekly. Score history is visible. Open-now data. Live local time. Editor activity. Pitchfork was an archive; BestAsia is a newsroom.
3. **It's regional-first, not country-siloed.** Philippines launches, Cebu follows, Thailand in 6–12 months, then a true pan-Asian meta-layer.

---

## The founding editorial team

**Martin Casey** and **Yahnee Ortiz** — co-founders, editors-in-chief, the named humans behind the algorithm.

Phase 1 posture: *BestAsia itself is the rater.* No individual critic bylines on algorithmic entries. But the editorial team is not anonymous — an `/about` page names Martin and Yahnee, explains the algorithm transparently, and owns the rubric. The algorithm has named guardians, not anonymity.

This is the minimum viable credibility for Phase 1. Named critics on reviews come in Phase 2.

---

## Phasing — the sequence matters

Utility → audience → editorial authority. Each phase earns the right to the next.

### Phase 1 — Utility-first (launch → month 12)

**Goal: become the default "where should we eat / drink / go tonight" tool for Manila, then Cebu.**

Ship:
- Scoring system: 0.0–10.0, one decimal place, algorithm-driven with editorial boost
- Published rubric and methodology at `/about/scoring`
- Ranked lists ("The Canon") updated monthly
- Weekly editor picks ("Tonight," "This Week")
- Realtime layer (open now, live local time, editor activity strip)
- Card-format entries: photo, score, neighborhood, price tier, one-line verdict
- Newsletter (Monday Briefing — three places, every week)
- Reader submissions via "Pitch a place" form
- Restaurant response mechanism (see Policies)
- Live currency conversion (default PHP, toggleable to USD/EUR/GBP/AUD/SGD/JPY)

Don't ship yet:
- Long-form reviews with named critic bylines
- Essays, industry commentary, takedowns
- The regional pan-Asian meta-layer

The one-line verdict on each entry *is* the editorial voice in Phase 1. One sentence, specific, opinionated.

### Phase 2 — Editorial layer (month 12 → month 24)

**Goal: make the scores mean something by making the critics mean something.**

Add:
- Named critics with faces, beats, running stats
- Full long-form review template ("The Review")
- Takedowns — sub-5.0 scores permitted on named-critic long-form only
- Sunday Review — one retrospective long-form essay per week
- Industry/opinion section
- Libel lawyer on retainer in the Philippines before the first sub-5.0 review ships

### Phase 3 — Pan-Asian meta-layer (month 24+)

**Goal: become the definitional regional authority.**

Add:
- Cross-border lists (Best Dim Sum in Asia, Best Bars in Asia, Best New Openings quarterly)
- Critic exchanges across markets
- The BestAsia Annual — one print-quality digital issue per year
- Regional editor-in-chief above country editors
- Physical events, potential awards dinner

Country launch order: Philippines (Manila → Cebu) → Thailand (6–12 months after PH) → Vietnam → Japan (entered with omakase + cocktail focus first, not mass market) → Indonesia / Singapore / Hong Kong / Korea / Taiwan.

---

## The scoring system

**Scale: 0.0 to 10.0, one decimal place. Floor for listing: 5.0.**

### The algorithm (published, transparent)

Weighted composite. Every input is bounded, defensible, and visible on the entry page:

| Input | Weight | Method |
|---|---|---|
| Google rating (normalized) | 35% | Average star rating × 2 to map to 10-point scale |
| Review volume (log-scaled) | 20% | log(review_count), caps at ~1,000-review equivalent |
| Recency (time-decayed) | 20% | Last 12 months heavily weighted; >3 years minimal |
| Cross-platform signal | 15% | TripAdvisor / Zomato / Yelp triangulation |
| Editorial boost | ±10% | Bounded adjustment, max ±1.0 on the 10-point scale |

Weights differentiated by category: restaurants, bars, and nightclubs use different formulas. Nightclub reviews are lower volume, more polarized, more influenced by door policy and music taste — the algorithm weights recency higher and absolute star rating lower for this category.

### Display on every entry page

**Algorithmic score: 7.4 · Editorial adjustment: +0.6 · BestAsia score: 8.0**

Radical transparency is the moat. Every score shows its components. The editorial adjustment is always labeled and bounded. A venue Google hates cannot be pushed to 8.5 by editorial fiat.

### Score dynamics

- **Nightly:** pull fresh Google data for ~1/7th of the database on rolling basis; every venue refreshes weekly
- **Weekly:** full algorithm recompute, score history row written to DB
- **On-demand:** recompute triggered when editor logs a visit or edits the boost
- **Anomaly alert:** when a score changes by >0.3 in one recompute, flag for human review — prevents review-bombing from tanking a canon entry overnight

### Score history

Visible as a sparkline on every entry page. "7.8 → 7.9 → 8.1 → 8.0 (last 4 months)." Changes over time are part of the story.

### Minimum data threshold

A venue must have at minimum:
- 50 Google reviews
- Open for 3+ months

Below this threshold, the algorithm does not score the venue. Exception: Best New Table candidates can be listed via editorial pathway before meeting the data threshold (see below).

### The 5.0 floor

- **Score <5.0** → venue does not appear on the site at all. Silence is the verdict.
- **Score 5.0–5.9** → venue appears, scored honestly, but does not appear on any "best of" list or canon.
- **Score 6.0+** → venue is eligible for list inclusion.
- **Editorial boost cannot push a venue below 5.0** to force-delist it. To delist, editors must decline to publish (e.g., food safety, ownership disputes) — not weaponize the score.

**Phase 2 exception:** Named-critic long-form "The Review" pieces may score below 5.0 when the target is powerful enough to warrant the punch (hyped celebrity-chef opening, Michelin-adjacent coaster). Algorithmic entries never go below 5.0. Takedowns are an earned editorial posture, not a default.

### Editorial boost governance

- Only the admin team can apply boosts. Phase 1: Martin and Yahnee only.
- Every boost is logged: date, venue, algorithmic score, boost applied, final score, reason.
- Internal audit page shows the full log. Phase 2: public audit log under consideration.
- Boost is bounded ±1.0. Hard-coded, not overridable.
- Boost reasons must be one of: *editorial visit confirms/contradicts data · seasonal consistency · chef change · room change · service pattern · other (with written justification)*.

---

## The 200-venue launch

**Target at launch: 200–300 venues covering Manila with depth.**

Neighborhoods at launch:
- BGC
- Makati (including Poblacion, Salcedo, Legazpi)
- Quezon City
- Alabang
- Intramuros / Binondo (for specific cuisines)

Expansion to 500 venues within 60 days of launch as the pipeline stabilizes. Cebu launches as venue count stabilizes and the algorithm is battle-tested on Manila data.

### Data pipeline

- Google Places API is the primary source. Budget ~$200–500/month at launch scale.
- No direct scraping of Google reviews beyond what the API exposes — against ToS, will get IPs blocked.
- TripAdvisor / Zomato data via their official APIs where available.
- Manual entry by admin team for BNT candidates and new openings below the 50-review threshold.
- Weekly refresh via cron job.

---

## Best New Table — the stamp

One standing designation that sits *above* the numeric score.

**Threshold: 8.5+**

Eligibility:
- New openings, first 12 months
- Editorial pathway overrides the 50-review / 3-months-open data minimum — a 4-month-old restaurant with 30 reviews can earn BNT if the editorial team (or a commissioned local visit) confirms the score
- In Phase 1, BNT visits may be conducted by hired local contractors when Martin and Yahnee can't visit personally — logged and disclosed

Why one stamp:
- Restaurants chase it (marketing value)
- Readers trust it (curated, never algorithmic-only)
- Creates an archive (every BNT ever is browsable)
- Scales regionally (BNT: Manila · Cebu · Bangkok)

Resist proliferating stamps. One stamp, applied rarely, means something.

---

## Pricing tiers

**Methodology: average main course cost in PHP.**

Display: tier glyphs on cards, full range on hover.

- **₱** — Mains under ₱300
- **₱₱** — Mains ₱300–800
- **₱₱₱** — Mains ₱800–1,800
- **₱₱₱₱** — Mains above ₱1,800

Live currency conversion: toggle in header for USD, EUR, GBP, AUD, SGD, JPY. FX rates cached hourly via exchangerate.host or equivalent. Displayed range updates but tier stays anchored to PHP (tier is culturally stable, price displays are traveler-friendly).

Methodology published at `/about/pricing`.

---

## Reader contributions — "Pitch a place"

Public form captures: venue name, location, why-it-matters, submitter email.

Admin dashboard with three states: *New · Under Review · Decision*. Decisions: *approved-with-algorithmic-score · approved-for-BNT-consideration · rejected-with-reason · insufficient-data-waiting*.

Phase 1 implementation: Notion database or Airtable view wired to the submission form. Real admin panel in Phase 2.

---

## Restaurant response policy

Published at `/about/policies`:

1. Scores are based on public review data plus editorial judgment. The methodology is public.
2. Restaurants may request a re-review at any time via a public form. Re-reviews are conducted at editorial discretion, not on demand.
3. Factual corrections (wrong address, wrong hours, wrong chef) will be made within 7 days of notification.
4. Score disagreements are not factual corrections. BestAsia does not negotiate scores.
5. **Right of reply:** restaurants may submit a one-paragraph response that appears on their entry page, clearly marked as "Restaurant response." Unedited except for factual accuracy and length.
6. Paid boosts (Phase 2+) are clearly labeled and never affect the numerical score, ranking within lists, or BNT eligibility.

Points 4 and 5 together are the credibility play: the score doesn't move, but the restaurant can speak. Michelin refuses this. 50 Best mangles it. BestAsia does it properly.

---

## Editorial policies — Phase 2 preparation

Publish these before the first named-critic review ships:

- Critics book under pseudonyms
- Critics pay their own checks
- Visits declared only after publication
- No hosted meals, press dinners, or comped meals as review basis
- Anonymous visits at least once per review; second visit may be revealed
- Minimum two visits for scores above 8.5 or below 6.0
- Libel lawyer on retainer in the Philippines before first sub-5.0 review ships
- Fact-checker reviews all reviews scoring below 6.0

These are table stakes for credibility. Draft now, publish when Phase 2 launches.

---

## Monetization (Phase 1 → Phase 2)

- **Newsletter subscription** — free tier and paid tier (paid tier gets early access to BNT announcements, weekly canon changes, curated city-specific drops)
- **Display advertising** — tastefully integrated, not within score displays or list rankings
- **Affiliate bookings** — reservation partnerships (TableCheck, Chope, direct) with clear disclosure
- **Paid boosts** — visibility only. Homepage placement, list appearance, "featured" tags. Clearly labeled. Never affect score, ranking, or BNT eligibility.
- **Events** (Phase 3) — annual awards dinner, city tours, partnerships

Hard rule, non-negotiable: **nothing affects the score except the algorithm and the bounded editorial boost.** This is the project.

---

## Realtime layer — your unfair advantage

Pitchfork reviewed things that didn't change. Restaurants change constantly.

Invest in the realtime layer every sprint:
- **Open Now** filter on every list
- **Live local time** in the header (shipped)
- **Editor activity** — "3 editors in Poblacion tonight," "Martin is at Toyo Eatery right now"
- **Waitlist estimates** — "Typical wait at Mamou right now: 40 min"
- **Last updated** timestamps on every entry
- **Closing alerts** — sober in-memoriam posts when canon entries permanently close
- **Score movement alerts** — weekly email digest of venues that moved >0.2 in either direction

The realtime layer is what keeps readers opening BestAsia at 7 PM on a Thursday. Never let it degrade.

---

## Risks and honest trade-offs

**The politeness trap.** Asian dining media is culturally polite. Phase 2 takedowns will generate backlash, lost access, reputation risk. Decide early whether you have the stomach for the 3.8 review of the celebrity chef's new opening. No takedowns means no Pitchfork.

**The access problem.** Once the scoring is real, restaurants will try to manage critics. The pseudonym / paid-meals / disclosure policies must ship with Phase 2.

**The timeline problem.** Scores mean nothing on day one. They mean everything in year three. This positioning requires patience most startups don't have. Budget for 24 months of editorial investment before the scores carry cultural weight.

**The algorithm legitimacy problem.** The algorithm is only as credible as its transparency. Every weight, every boost, every recompute cadence must be publishable. The moment readers suspect the score is rigged, the project is done. Radical transparency is the only defense.

**The data quality problem.** Google review gaming is rampant. Cross-platform triangulation helps but doesn't eliminate it. The weekly human-review flag on >0.3 changes is critical — treat it seriously.

**The legal exposure problem.** Philippines libel law is plaintiff-friendly. Phase 2 takedowns require a libel lawyer on retainer, editorial fact-checking protocol, and a paper trail on every sub-5.0 review. Don't ship Phase 2 without this.

**The regional expansion problem.** Thailand 6–12 months post-launch is aggressive. Each new country requires local data sources, local editorial boost authority, local language considerations (Thailand will test whether English-only scales). Validate Manila → Cebu before committing to Bangkok.

---

## What to decide this week

1. **The rubric document** — write `/about/scoring` publicly, with exact weights and methodology. Publish before first user sees a score.
2. **The policies document** — write `/about/policies` with restaurant response rules and Phase 2 editorial policies drafted.
3. **The `/about` page** — Martin and Yahnee, faces and bios, the editorial humans behind the algorithm.
4. **The vendor stack** — Google Places API account, TripAdvisor/Zomato API access, FX rate provider, hosting, database (Postgres recommended for score history).
5. **The admin dashboard MVP** — Notion/Airtable is fine for Phase 1. Must support: venue entry, editorial boost application + log, BNT nominations, pitch-a-place queue.

---

## What success looks like

- **Month 6:** Newsletter above 10,000 subscribers. A canon list screenshot goes viral in Manila food Twitter.
- **Month 12:** A restaurateur complains publicly about a score. Readers take BestAsia's side. Cebu launches.
- **Month 18:** "BestAsia 8.4" starts appearing on restaurant windows and Instagram bios. Thailand launches.
- **Month 24:** First Phase 2 takedown generates mainstream-press coverage. Named critics established.
- **Month 36:** BestAsia Annual is the most-anticipated Asian dining publication of the year. Michelin notices.

---

## Decisions locked in v2

- Scale: 0.0–10.0, one decimal place
- Floor: 5.0 for algorithmic listing
- Phase 2 exception: named-critic reviews can go sub-5.0
- Algorithm: Google (35%) + volume log (20%) + recency (20%) + cross-platform (15%) + editorial boost (±10%, max ±1.0)
- Minimum data: 50 reviews, 3+ months open
- BNT threshold: 8.5, editorial pathway overrides data minimum
- Recompute: weekly, with score history visible
- Launch: 200 venues in Manila, expand to 500 in 60 days
- Country two: Cebu
- Country three: Thailand, 6–12 months post-PH launch
- Pricing: ₱ tiers based on mains, PHP default, live FX toggle
- Response policy: factual corrections only; right of reply paragraph; no score negotiation
- Paid boosts: visibility only, never score
- Editorial team: Martin Casey, Yahnee Ortiz
- Boost authority: admin team only, logged internally
- Libel counsel: retained before first Phase 2 sub-5.0 review

---

*Draft v2. Revise quarterly. The goal is not to predict the future accurately — it's to decide the future deliberately.*
