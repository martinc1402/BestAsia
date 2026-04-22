// Source of truth: /docs/editorial/about-scoring.md
// If you change this page, update the doc. If you change the doc, update this page.

import type { Metadata } from "next";
import Link from "next/link";
import Prose from "@/components/editorial/Prose";

export const metadata: Metadata = {
  title: "How BestPhilippines scores — BestPhilippines",
  description:
    "Every place on this site has a number next to it. This page explains what the number means, how we calculate it, and why we'd rather show you our math than ask you to trust us.",
};

export default function ScoringPage() {
  return (
    <div className="bg-paper font-sans text-ink">
      <Prose>
        <header>
          <div className="text-micro font-bold tracking-[0.22em] uppercase text-rust mb-3">
            Methodology · v1.1
          </div>
          <h1 className="font-display text-h1 sm:text-display font-bold text-ink tracking-[-0.03em] leading-[1.02]">
            How BestPhilippines scores
          </h1>
        </header>

        <p className="mt-8 text-body-lg text-stone-deep leading-[1.7]">
          Every place on this site has a number next to it. This page explains what the number means, how we calculate it, and why we&apos;d rather show you our math than ask you to trust us.
        </p>
        <p>
          We take this seriously. We also take merienda seriously, so don&apos;t worry, we&apos;ll keep it readable.
        </p>

        <hr />

        <h2>The scale</h2>
        <p>
          <strong>0.0 to 10.0, one decimal place.</strong>
        </p>
        <p>
          We don&apos;t round. The difference between a 7.4 and a 7.6 is real, and we&apos;d rather argue about it than pretend it doesn&apos;t exist. The comments section of any Manila food group will tell you Filipinos are already arguing about these things. We&apos;re just bringing a scoreboard.
        </p>

        <table>
          <thead>
            <tr>
              <th>Score</th>
              <th>What it means</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="font-bold">9.0 – 10.0</td>
              <td>The canon. Among the best in Asia, not just the Philippines. Fly here for it.</td>
            </tr>
            <tr>
              <td className="font-bold">8.5 – 8.9</td>
              <td>Excellent. Among the best in its category in the country. Plan around it.</td>
            </tr>
            <tr>
              <td className="font-bold">8.0 – 8.4</td>
              <td>Very good. Cross the city for it. Confident rec to a visiting friend.</td>
            </tr>
            <tr>
              <td className="font-bold">7.0 – 7.9</td>
              <td>Good. Worth a visit if you&apos;re nearby, or if the category is what you&apos;re after.</td>
            </tr>
            <tr>
              <td className="font-bold">6.0 – 6.9</td>
              <td>Decent. One reason to go, one reason not to. Listed, but not on a best-of.</td>
            </tr>
            <tr>
              <td className="font-bold">5.0 – 5.9</td>
              <td>Mixed. Has problems you should know before going. Listed honestly, never promoted.</td>
            </tr>
            <tr>
              <td className="font-bold">Below 5.0</td>
              <td>Not listed. Silence is the verdict.</td>
            </tr>
          </tbody>
        </table>

        <p>
          We don&apos;t list venues below 5.0. If a place doesn&apos;t appear on BestPhilippines, it either hasn&apos;t been scored yet, doesn&apos;t meet our data threshold, or scored below our floor. We&apos;d rather cover fewer places well than rank everything badly.
        </p>

        <hr />

        <h2>How we calculate the score</h2>
        <p>
          Every BestPhilippines score is a weighted composite of five inputs. Every input is bounded. Every weight is published. None of it is secret. Even your titas can audit us.
        </p>

        <h3>1. Google rating — 35%</h3>
        <p>
          The average star rating on Google Reviews, normalized to our 10-point scale (a 4.5-star place starts at 9.0 before other factors pull it around).
        </p>
        <p>
          <strong>Why 35%:</strong> Google is the largest and most culturally neutral review corpus in the Philippines. Most people who eat out leave Google reviews; most restaurants take Google ratings seriously. It&apos;s the closest thing to a shared public record we have. But it&apos;s also gameable, inflated by category (sundae joints rate higher than serious restaurants), and biased toward recency and outliers — so we cap its influence at 35%.
        </p>

        <h3>2. Review volume — 20%</h3>
        <p>
          How many reviews a place has, on a logarithmic scale. A place with 2,000 reviews doesn&apos;t score twenty times higher than a place with 100. We use log scaling so volume adds confidence without drowning smaller venues. Past around 1,000 reviews, adding more stops meaningfully moving the score.
        </p>
        <p>
          <strong>Why 20%:</strong> A 4.8-star rating from 30 people means something very different from a 4.8-star rating from 3,000 people. Volume is the confidence interval on the average. Without it, new or small venues get over-rated and established ones get under-credited.
        </p>

        <h3>3. Recency — 20%</h3>
        <p>
          We weight reviews from the last 12 months heavily. Reviews from 1–3 years ago count for about half. Reviews older than 3 years count for very little. A restaurant that was great in 2022 and has been coasting since isn&apos;t the same restaurant.
        </p>
        <p>
          <strong>Why 20%:</strong> The Philippine dining scene moves fast. Chefs leave. Ownership changes. A place that deserved a 9.0 two years ago may be a 7.5 today. We&apos;d rather be responsive than authoritative-but-stale.
        </p>

        <h3>4. Cross-platform signal — 15%</h3>
        <p>
          We triangulate against TripAdvisor, and where available, Foursquare and Facebook Places. Consistency across platforms raises confidence. Wide disagreement between platforms (9.2 on Google, 6.4 on TripAdvisor) triggers a human review flag — often a sign of gaming on one platform, or a very polarized crowd.
        </p>
        <p>
          We don&apos;t currently use Zomato (no active API for the Philippines) or Yelp (thin coverage in the Philippine market). If that changes, we&apos;ll add them and note it here.
        </p>
        <p>
          <strong>Why 15%:</strong> Cross-platform agreement is our best defense against review manipulation. A venue can buy 200 fake Google reviews. Buying coordinated fakes across multiple platforms is harder, rarer, and usually sloppy enough for us to notice.
        </p>

        <h3>5. Editorial boost — ±10%, bounded at ±1.0</h3>
        <p>
          The BestPhilippines editorial team can adjust a score up or down by a maximum of 1.0 point on the 10-point scale. We use this sparingly, and when we do, we log it publicly on the venue&apos;s entry page.
        </p>
        <p>
          <strong>Why ±1.0 maximum:</strong> Editorial judgment matters. We&apos;ve visited places the data under-rates and over-rates. But we refuse to build a site where editorial opinion can override public sentiment — that&apos;s the Yelp problem, the Michelin problem, the problem we&apos;re trying to solve. A place Google hates cannot become a 9.0 because we say so. The algorithm keeps us honest. We keep the algorithm honest. Neither one gets the last word.
        </p>
        <p>
          <strong>When we apply the boost:</strong>
        </p>
        <ul>
          <li>We&apos;ve visited and the data contradicts the experience</li>
          <li>Seasonal consistency (we&apos;ve visited multiple times across a year)</li>
          <li>A chef change or ownership change has shifted the data lag</li>
          <li>Service or room quality the review text describes but star ratings don&apos;t capture</li>
        </ul>
        <p>
          Every boost is labeled on the entry page:{" "}
          <em>
            Algorithmic score 7.4 · Editorial adjustment +0.6 · BestPhilippines score 8.0.
          </em>
        </p>

        <hr />

        <h2>What we don&apos;t score on</h2>
        <p>Things that shouldn&apos;t affect your score and therefore don&apos;t affect ours:</p>
        <ul>
          <li>
            <strong>How photogenic the space is.</strong> Instagram looks are not quality. A neon sign and a good angle do not beat a proper sinigang.
          </li>
          <li>
            <strong>Whether the place is &ldquo;hidden.&rdquo;</strong> A hole-in-the-wall and a fine-dining room are scored on the same scale. A 7.8 karinderya and a 7.8 tasting menu are, by our lights, equivalent recommendations for different occasions and different wallets.
          </li>
          <li>
            <strong>Celebrity chef status.</strong> Famous names get no bump. They also get no penalty. The food shows up to the table; the reputation doesn&apos;t.
          </li>
          <li>
            <strong>Press coverage.</strong> Michelin mentions, 50 Best rankings, magazine features — irrelevant to the score.
          </li>
          <li>
            <strong>Whether we personally like it.</strong> Individual taste shows up in the editorial boost, bounded at ±1.0. It cannot make or break a score. Even Martin&apos;s feelings about a proper kare-kare cannot move a number by more than one point.
          </li>
        </ul>
        <p>
          We score <strong>food, drink, and experience quality</strong> — not scene, not fashion, not fame.
        </p>

        <hr />

        <h2>Different scoring by category</h2>
        <p>
          Restaurants, bars, and nightclubs use slightly different weightings. The inputs are the same; the weights differ.
        </p>
        <p>
          <strong>Restaurants:</strong> the table above.
        </p>
        <p>
          <strong>Bars and cocktail venues:</strong> recency weighted higher (25%), volume slightly lower (15%). A cocktail program changes with the bar manager; old reviews go stale faster than a cut orange peel.
        </p>
        <p>
          <strong>Nightclubs:</strong> absolute star rating weighted lower (25%), recency weighted higher (30%). Nightclub reviews are polarized by door policy, music taste, and one bad night — we weight the trend over the average.
        </p>
        <p>
          <strong>Cafés:</strong> standard restaurant weighting, with an additional &ldquo;consistency penalty&rdquo; — a café with wide variance across reviews scores lower than a café with a tight distribution at the same average. Your flat white should taste the same on Tuesday as it does on Saturday.
        </p>
        <p>
          The exact sub-weights per category live in the <code className="font-mono text-body-sm text-stone-deep">/about/methodology</code> technical appendix for readers who want to go deeper.
        </p>

        <hr />

        <h2>Minimum data threshold</h2>
        <p>A venue needs at least:</p>
        <ul>
          <li>
            <strong>50 Google reviews</strong>
          </li>
          <li>
            <strong>Open for 3 or more months</strong>
          </li>
        </ul>
        <p>Below this threshold, we don&apos;t score the venue. Not enough signal.</p>
        <p>
          <strong>Exception:</strong> candidates for our Best New Table designation can be listed before meeting the threshold, via editorial visit. These are clearly labeled as editorial entries and disclosed as such.
        </p>

        <hr />

        <h2>How often scores change</h2>
        <ul>
          <li>
            <strong>Nightly:</strong> we refresh data for roughly one-seventh of the database on a rolling basis. Every venue updates at least weekly.
          </li>
          <li>
            <strong>Weekly:</strong> full algorithm recompute. New scores written to the venue&apos;s permanent score history.
          </li>
          <li>
            <strong>On-demand:</strong> when an editor logs a visit or applies a boost, the score recomputes immediately.
          </li>
        </ul>
        <p>
          If a venue&apos;s score changes by more than 0.3 points in a single recompute, we flag it for human review before it goes live. This is our main defense against coordinated review-bombing — a thing that happens more often than anyone admits.
        </p>

        <hr />

        <h2>Score history</h2>
        <p>
          Every venue has a visible score history on its entry page. A sparkline showing the last 12 months of scores. If a place was an 8.4 in January, a 7.9 in March, and an 8.1 in April — you see that. We don&apos;t hide score movement. The trajectory is part of the story. A restaurant climbing from 7.4 to 8.2 over six months is a different recommendation than one sliding from 8.2 to 7.4.
        </p>

        <hr />

        <h2>What the score can&apos;t tell you</h2>
        <p>This is the honest part.</p>
        <p>
          A score is a summary. It compresses thousands of opinions and our own editorial read into a single number. It is useful for ranking, comparing, and deciding where to go tonight. It is not a substitute for a real review.
        </p>
        <p>
          A 7.8 doesn&apos;t tell you whether the sisig is the best in Manila, whether the room is romantic, or whether you can get a table at 8 PM on a Friday. We&apos;re building toward long-form reviews from named critics in Phase 2. Those will tell you the things the number can&apos;t. For now, we lean on the one-line verdicts under each entry — short, specific, opinionated. That&apos;s the editorial voice until the full reviews land.
        </p>

        <hr />

        <h2>What to do if you disagree</h2>
        <p>
          We welcome disagreement. That&apos;s the whole point of putting a number on things. Filipinos are born to argue about food — we&apos;re just giving everyone a common starting line.
        </p>
        <ul>
          <li>
            <strong>Think a place is over-scored?</strong> Tell us why at{" "}
            <a href="mailto:hello@bestphilippines.co">hello@bestphilippines.co</a>. If we visit and agree, the score moves.
          </li>
          <li>
            <strong>Think a place is under-scored?</strong> Same address. Same process.
          </li>
          <li>
            <strong>Think our methodology is wrong?</strong> We&apos;re listening. The weights in this document are version 1.0, and we&apos;ll publish every revision with a changelog.
          </li>
          <li>
            <strong>Are you the venue?</strong> Read our <Link href="/about/policies">response policy</Link>. You have rights. You don&apos;t have the right to a higher score.
          </li>
        </ul>
        <p>
          We&apos;d rather be argued with than ignored. A rating system that nobody fights about isn&apos;t doing its job.
        </p>

        <hr />

        <h2>The version history of this rubric</h2>
        <ul>
          <li>
            <strong>v1.0 — April 2026.</strong> Initial publication at launch.
          </li>
          <li>
            <strong>v1.1 — April 2026.</strong> Updated cross-platform signal providers — removed Zomato (no active API for the Philippines) and Yelp (thin local coverage); added Foursquare and Facebook Places where available.
          </li>
        </ul>
        <p>
          This page will change. Every time it does, we&apos;ll note what moved and why, right here. We will never change weights quietly.
        </p>

        <hr />

        <p className="text-body-sm italic text-stone-deep">
          Martin Casey &amp; Yahnee Ortiz
          <br />
          Editors, BestPhilippines
        </p>
      </Prose>
    </div>
  );
}
