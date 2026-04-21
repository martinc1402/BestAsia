# How BestPhilippines Scores

Every place on this site has a number next to it. This page explains what the number means, how we calculate it, and why we'd rather show you our math than ask you to trust us.

We take this seriously. We also take merienda seriously, so don't worry, we'll keep it readable.

---

## The scale

**0.0 to 10.0, one decimal place.**

We don't round. The difference between a 7.4 and a 7.6 is real, and we'd rather argue about it than pretend it doesn't exist. The comments section of any Manila food group will tell you Filipinos are already arguing about these things. We're just bringing a scoreboard.

| Score | What it means |
|---|---|
| **9.0 – 10.0** | The canon. Among the best in Asia, not just the Philippines. Fly here for it. |
| **8.5 – 8.9** | Excellent. Among the best in its category in the country. Plan around it. |
| **8.0 – 8.4** | Very good. Cross the city for it. Confident rec to a visiting friend. |
| **7.0 – 7.9** | Good. Worth a visit if you're nearby, or if the category is what you're after. |
| **6.0 – 6.9** | Decent. One reason to go, one reason not to. Listed, but not on a best-of. |
| **5.0 – 5.9** | Mixed. Has problems you should know before going. Listed honestly, never promoted. |
| **Below 5.0** | Not listed. Silence is the verdict. |

We don't list venues below 5.0. If a place doesn't appear on BestPhilippines, it either hasn't been scored yet, doesn't meet our data threshold, or scored below our floor. We'd rather cover fewer places well than rank everything badly.

---

## How we calculate the score

Every BestPhilippines score is a weighted composite of five inputs. Every input is bounded. Every weight is published. None of it is secret. Even your titas can audit us.

### 1. Google rating — 35%

The average star rating on Google Reviews, normalized to our 10-point scale (a 4.5-star place starts at 9.0 before other factors pull it around).

**Why 35%:** Google is the largest and most culturally neutral review corpus in the Philippines. Most people who eat out leave Google reviews; most restaurants take Google ratings seriously. It's the closest thing to a shared public record we have. But it's also gameable, inflated by category (sundae joints rate higher than serious restaurants), and biased toward recency and outliers — so we cap its influence at 35%.

### 2. Review volume — 20%

How many reviews a place has, on a logarithmic scale. A place with 2,000 reviews doesn't score twenty times higher than a place with 100. We use log scaling so volume adds confidence without drowning smaller venues. Past around 1,000 reviews, adding more stops meaningfully moving the score.

**Why 20%:** A 4.8-star rating from 30 people means something very different from a 4.8-star rating from 3,000 people. Volume is the confidence interval on the average. Without it, new or small venues get over-rated and established ones get under-credited.

### 3. Recency — 20%

We weight reviews from the last 12 months heavily. Reviews from 1–3 years ago count for about half. Reviews older than 3 years count for very little. A restaurant that was great in 2022 and has been coasting since isn't the same restaurant.

**Why 20%:** The Philippine dining scene moves fast. Chefs leave. Ownership changes. A place that deserved a 9.0 two years ago may be a 7.5 today. We'd rather be responsive than authoritative-but-stale.

### 4. Cross-platform signal — 15%

We triangulate against TripAdvisor, and where available, Foursquare and Facebook Places. Consistency across platforms raises confidence. Wide disagreement between platforms (9.2 on Google, 6.4 on TripAdvisor) triggers a human review flag — often a sign of gaming on one platform, or a very polarized crowd.

We don't currently use Zomato (no active API for the Philippines) or Yelp (thin coverage in the Philippine market). If that changes, we'll add them and note it here.

**Why 15%:** Cross-platform agreement is our best defense against review manipulation. A venue can buy 200 fake Google reviews. Buying coordinated fakes across multiple platforms is harder, rarer, and usually sloppy enough for us to notice.

### 5. Editorial boost — ±10%, bounded at ±1.0

The BestPhilippines editorial team can adjust a score up or down by a maximum of 1.0 point on the 10-point scale. We use this sparingly, and when we do, we log it publicly on the venue's entry page.

**Why ±1.0 maximum:** Editorial judgment matters. We've visited places the data under-rates and over-rates. But we refuse to build a site where editorial opinion can override public sentiment — that's the Yelp problem, the Michelin problem, the problem we're trying to solve. A place Google hates cannot become a 9.0 because we say so. The algorithm keeps us honest. We keep the algorithm honest. Neither one gets the last word.

**When we apply the boost:**
- We've visited and the data contradicts the experience
- Seasonal consistency (we've visited multiple times across a year)
- A chef change or ownership change has shifted the data lag
- Service or room quality the review text describes but star ratings don't capture

Every boost is labeled on the entry page: *Algorithmic score 7.4 · Editorial adjustment +0.6 · BestPhilippines score 8.0.*

---

## What we don't score on

Things that shouldn't affect your score and therefore don't affect ours:

- **How photogenic the space is.** Instagram looks are not quality. A neon sign and a good angle do not beat a proper sinigang.
- **Whether the place is "hidden."** A hole-in-the-wall and a fine-dining room are scored on the same scale. A 7.8 karinderya and a 7.8 tasting menu are, by our lights, equivalent recommendations for different occasions and different wallets.
- **Celebrity chef status.** Famous names get no bump. They also get no penalty. The food shows up to the table; the reputation doesn't.
- **Press coverage.** Michelin mentions, 50 Best rankings, magazine features — irrelevant to the score.
- **Whether we personally like it.** Individual taste shows up in the editorial boost, bounded at ±1.0. It cannot make or break a score. Even Martin's feelings about a proper kare-kare cannot move a number by more than one point.

We score **food, drink, and experience quality** — not scene, not fashion, not fame.

---

## Different scoring by category

Restaurants, bars, and nightclubs use slightly different weightings. The inputs are the same; the weights differ.

**Restaurants:** the table above.

**Bars and cocktail venues:** recency weighted higher (25%), volume slightly lower (15%). A cocktail program changes with the bar manager; old reviews go stale faster than a cut orange peel.

**Nightclubs:** absolute star rating weighted lower (25%), recency weighted higher (30%). Nightclub reviews are polarized by door policy, music taste, and one bad night — we weight the trend over the average.

**Cafés:** standard restaurant weighting, with an additional "consistency penalty" — a café with wide variance across reviews scores lower than a café with a tight distribution at the same average. Your flat white should taste the same on Tuesday as it does on Saturday.

The exact sub-weights per category live in the `/about/methodology` technical appendix for readers who want to go deeper.

---

## Minimum data threshold

A venue needs at least:
- **50 Google reviews**
- **Open for 3 or more months**

Below this threshold, we don't score the venue. Not enough signal.

**Exception:** candidates for our Best New Table designation can be listed before meeting the threshold, via editorial visit. These are clearly labeled as editorial entries and disclosed as such.

---

## How often scores change

- **Nightly:** we refresh data for roughly one-seventh of the database on a rolling basis. Every venue updates at least weekly.
- **Weekly:** full algorithm recompute. New scores written to the venue's permanent score history.
- **On-demand:** when an editor logs a visit or applies a boost, the score recomputes immediately.

If a venue's score changes by more than 0.3 points in a single recompute, we flag it for human review before it goes live. This is our main defense against coordinated review-bombing — a thing that happens more often than anyone admits.

---

## Score history

Every venue has a visible score history on its entry page. A sparkline showing the last 12 months of scores. If a place was an 8.4 in January, a 7.9 in March, and an 8.1 in April — you see that. We don't hide score movement. The trajectory is part of the story. A restaurant climbing from 7.4 to 8.2 over six months is a different recommendation than one sliding from 8.2 to 7.4.

---

## What the score can't tell you

This is the honest part.

A score is a summary. It compresses thousands of opinions and our own editorial read into a single number. It is useful for ranking, comparing, and deciding where to go tonight. It is not a substitute for a real review.

A 7.8 doesn't tell you whether the sisig is the best in Manila, whether the room is romantic, or whether you can get a table at 8 PM on a Friday. We're building toward long-form reviews from named critics in Phase 2. Those will tell you the things the number can't. For now, we lean on the one-line verdicts under each entry — short, specific, opinionated. That's the editorial voice until the full reviews land.

---

## What to do if you disagree

We welcome disagreement. That's the whole point of putting a number on things. Filipinos are born to argue about food — we're just giving everyone a common starting line.

- **Think a place is over-scored?** Tell us why at hello@bestphilippines.co. If we visit and agree, the score moves.
- **Think a place is under-scored?** Same address. Same process.
- **Think our methodology is wrong?** We're listening. The weights in this document are version 1.0, and we'll publish every revision with a changelog.
- **Are you the venue?** Read our [response policy](/about/policies). You have rights. You don't have the right to a higher score.

We'd rather be argued with than ignored. A rating system that nobody fights about isn't doing its job.

---

## The version history of this rubric

- **v1.0 — April 2026.** Initial publication at launch.
- **v1.1 — April 2026.** Updated cross-platform signal providers — removed Zomato (no active API for the Philippines) and Yelp (thin local coverage); added Foursquare and Facebook Places where available.

This page will change. Every time it does, we'll note what moved and why, right here. We will never change weights quietly.

---

*Martin Casey & Yahnee Ortiz*
*Editors, BestPhilippines*
