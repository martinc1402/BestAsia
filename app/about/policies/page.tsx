// Source of truth: /docs/editorial/about-policies.md
// If you change this page, update the doc. If you change the doc, update this page.

import type { Metadata } from "next";
import Link from "next/link";
import Prose from "@/components/editorial/Prose";

export const metadata: Metadata = {
  title: "Policies — BestPhilippines",
  description:
    "How BestPhilippines operates — what we will do, what we won't, and what rights you have if you're a restaurant, a reader, or a future critic.",
};

export default function PoliciesPage() {
  return (
    <div className="bg-paper font-sans text-ink">
      <Prose>
        <header>
          <div className="text-micro font-bold tracking-[0.22em] uppercase text-rust mb-3">
            Policies · v1.0
          </div>
          <h1 className="font-display text-h1 sm:text-display font-bold text-ink tracking-[-0.03em] leading-[1.02]">
            Policies
          </h1>
        </header>

        <p className="mt-8 text-body-lg text-stone-deep leading-[1.7]">
          This page explains how BestPhilippines operates — what we will do, what we won&apos;t, and what rights you have if you&apos;re a restaurant, a reader, or a future critic.
        </p>
        <p>
          We publish our policies because we think you deserve to see them. A rating site that won&apos;t tell you its rules is a rating site you shouldn&apos;t trust.
        </p>

        <hr />

        <h2>1. For restaurants, bars, and venues</h2>

        <h3>1.1 How you get scored</h3>
        <p>
          You don&apos;t apply. You don&apos;t pay. You don&apos;t opt in. If you meet our data threshold (50+ Google reviews, open 3+ months), our algorithm scores you automatically. If our editors believe you&apos;re worth covering before the data threshold, we may list you via editorial visit — clearly labeled.
        </p>

        <h3>1.2 How the score is calculated</h3>
        <p>
          Our full scoring methodology is published at <Link href="/about/scoring">/about/scoring</Link>. The weights, the inputs, the editorial boost limits — all public.
        </p>

        <h3>1.3 Requesting a re-review</h3>
        <p>
          You can request a re-review at any time by emailing{" "}
          <a href="mailto:hello@bestphilippines.co">hello@bestphilippines.co</a> with the subject line &ldquo;Re-review request.&rdquo; Use it when:
        </p>
        <ul>
          <li>A chef or ownership change has happened</li>
          <li>You&apos;ve substantially renovated the room</li>
          <li>You believe old negative reviews no longer reflect the current experience</li>
          <li>You have a specific factual concern about our score</li>
        </ul>
        <p>
          Re-reviews are conducted at editorial discretion, not on demand. If we agree a re-visit is warranted, we&apos;ll schedule one. If we don&apos;t, we&apos;ll tell you why.
        </p>

        <h3>1.4 Factual corrections</h3>
        <p>
          If we&apos;ve got a fact wrong — wrong address, wrong hours, wrong chef name, wrong cuisine, wrong photo — we&apos;ll correct it within seven days of being notified. Email{" "}
          <a href="mailto:hello@bestphilippines.co">hello@bestphilippines.co</a> with the subject line &ldquo;Correction.&rdquo;
        </p>
        <p>
          Factual corrections are not score negotiations. Fixing your address doesn&apos;t move your score.
        </p>

        <h3>1.5 Score disagreements</h3>
        <p>
          <strong>We don&apos;t negotiate scores.</strong> Full stop.
        </p>
        <p>If you think your score is wrong, the channels are:</p>
        <ol>
          <li>Request a re-review (above)</li>
          <li>Submit a right-of-reply paragraph (below)</li>
          <li>Email us directly — we read every email, and occasionally they convince us to re-visit</li>
        </ol>
        <p>
          What won&apos;t work: threatening legal action, withholding press access, asking mutual contacts to intervene, buying ads, or offering comped meals to editors. We will disclose all of the above publicly when they happen.
        </p>

        <h3>1.6 Right of reply</h3>
        <p>
          Every venue on BestPhilippines has the right to publish a response paragraph on their own entry page.
        </p>
        <ul>
          <li>
            <strong>Length:</strong> one paragraph, maximum 150 words
          </li>
          <li>
            <strong>Content:</strong> your response to our score, our verdict, or our coverage
          </li>
          <li>
            <strong>Editing:</strong> we will not edit your response for content. We may edit for factual accuracy (if you claim something that isn&apos;t true) or length.
          </li>
          <li>
            <strong>Placement:</strong> clearly labeled &ldquo;Response from [Venue Name]&rdquo; and visible on your entry page alongside our verdict
          </li>
          <li>
            <strong>How to submit:</strong> email{" "}
            <a href="mailto:hello@bestphilippines.co">hello@bestphilippines.co</a> from a verifiable venue email address with the subject line &ldquo;Right of reply&rdquo;
          </li>
        </ul>
        <p>This is your microphone. Use it however you want.</p>

        <h3>1.7 Requesting removal</h3>
        <p>
          You cannot request to be removed from BestPhilippines because you don&apos;t like your score. A ranking site where venues can opt out of bad scores isn&apos;t a ranking site — it&apos;s a marketing platform.
        </p>
        <p>We will remove a venue from the site if:</p>
        <ul>
          <li>The venue has permanently closed</li>
          <li>There is a credible food safety concern we can verify</li>
          <li>Active litigation against the venue makes continued coverage inappropriate</li>
          <li>The venue was listed in error (wrong business at the address, duplicate entry)</li>
        </ul>
        <p>All other removal requests are declined.</p>

        <h3>1.8 Paid boosts (from Phase 2)</h3>
        <p>When we introduce paid promotional placements, they will be:</p>
        <ul>
          <li>
            <strong>Clearly labeled</strong> as &ldquo;Promoted&rdquo; or &ldquo;Featured&rdquo; everywhere they appear
          </li>
          <li>
            <strong>Limited to visibility</strong> — homepage placement, list appearance, newsletter inclusion
          </li>
          <li>
            <strong>Never tied to score</strong> — a paid boost cannot move your number up by 0.1
          </li>
          <li>
            <strong>Never tied to ranking within a list</strong> — our Top 10 Rooftop Bars stays editorial, always
          </li>
          <li>
            <strong>Never tied to Best New Table eligibility</strong> — BNT is earned, not bought
          </li>
        </ul>
        <p>
          If you ever see a score or a ranking that appears to have been influenced by payment, email{" "}
          <a href="mailto:hello@bestphilippines.co">hello@bestphilippines.co</a> and we will investigate and publicly correct.
        </p>

        <h3>1.9 The hard line</h3>
        <p>
          <strong>Nothing affects the score except the algorithm and the bounded editorial boost.</strong>
        </p>
        <p>
          Not advertising. Not partnerships. Not personal relationships. Not threats. Not comped meals. Not press trips. Not pressure from anyone, including our own investors.
        </p>
        <p>This is the project. If we ever break this rule, we lose our reason to exist.</p>

        <hr />

        <h2>2. For readers</h2>

        <h3>2.1 How we make money</h3>
        <p>Transparency about revenue keeps us honest.</p>
        <p>At launch, we make money through:</p>
        <ul>
          <li>
            <strong>Newsletter advertising</strong> — sponsored segments in our Monday Briefing, clearly labeled
          </li>
          <li>
            <strong>Display advertising</strong> — tastefully placed, never inside score displays or list rankings
          </li>
          <li>
            <strong>Affiliate bookings</strong> — reservation partnerships (TableCheck, Chope, direct). When you book through our links, we may earn a commission. Affiliate status never affects whether a venue appears or how it scores.
          </li>
          <li>
            <strong>Paid subscriptions</strong> (planned) — a paid tier for the newsletter with early BNT access and expanded content
          </li>
        </ul>
        <p>
          We do not and will never take payment to score a venue higher, include it in a ranked list, or award it Best New Table.
        </p>

        <h3>2.2 Your data</h3>
        <p>
          We collect the minimum necessary to operate the site: email for newsletter subscribers, basic analytics for traffic patterns, submission data for Pitch a Place and re-review forms. We do not sell reader data. Full privacy policy at <Link href="/privacy">/privacy</Link>.
        </p>

        <h3>2.3 Reader contributions</h3>
        <p>
          Anyone can suggest a venue via <Link href="/pitch">Pitch a Place</Link>. We review every submission. We don&apos;t publish submissions as reviews — they&apos;re leads for our editorial process.
        </p>
        <p>Submitting a venue does not guarantee we&apos;ll score it. It means we&apos;ll consider it.</p>

        <h3>2.4 Comments and community</h3>
        <p>
          We do not currently accept public comments on venue pages. This may change in Phase 2. When it does, we&apos;ll publish community guidelines here.
        </p>

        <h3>2.5 Corrections</h3>
        <p>
          If you spot a factual error on the site — wrong info about a venue, broken link, mislabeled photo — email{" "}
          <a href="mailto:hello@bestphilippines.co">hello@bestphilippines.co</a>. We fix fast.
        </p>

        <hr />

        <h2>3. Editorial conduct</h2>

        <h3>3.1 Who can apply the editorial boost</h3>
        <p>
          At launch, only the two editors-in-chief — Martin Casey and Yahnee Ortiz — can apply the editorial boost to any venue&apos;s score. As the team grows, boost authority will expand to named senior editors, and every boost will continue to be logged.
        </p>

        <h3>3.2 How the boost is logged</h3>
        <p>Every editorial boost is logged internally with:</p>
        <ul>
          <li>Date applied</li>
          <li>Venue</li>
          <li>Algorithmic score before boost</li>
          <li>Boost applied</li>
          <li>Final score</li>
          <li>Editor who applied it</li>
          <li>Written reason</li>
        </ul>
        <p>
          This log is available on request for press inquiries and will be made publicly auditable as the project matures.
        </p>

        <h3>3.3 Conflicts of interest</h3>
        <p>Editors do not score venues where they have:</p>
        <ul>
          <li>A financial interest (ownership, investment, paid consulting)</li>
          <li>A personal relationship with the owner, chef, or management that would compromise judgment</li>
          <li>Accepted a hosted meal, press dinner, or comp in the last 12 months from the venue</li>
        </ul>
        <p>
          Conflicts are declared to the rest of the editorial team and logged. A conflicted editor recuses from scoring decisions on that venue.
        </p>

        <h3>3.4 No gifts, no hosted meals, no press trips (Phase 2)</h3>
        <p>When we launch named-critic reviews in Phase 2, our critics will operate under strict rules:</p>
        <ul>
          <li>
            <strong>Visits are anonymous.</strong> Critics book under pseudonyms or using general reservation names.
          </li>
          <li>
            <strong>Meals are paid.</strong> BestPhilippines reimburses every meal. No comps, no hosted dinners, no press openings count as review basis.
          </li>
          <li>
            <strong>No press trips.</strong> Hosted travel does not produce reviews.
          </li>
          <li>
            <strong>Gifts are declined or donated.</strong> Bottles, gift cards, products are returned or donated to charity with receipt.
          </li>
          <li>
            <strong>Disclosure at publication.</strong> Any prior personal or professional relationship with the venue is disclosed in the review itself.
          </li>
        </ul>
        <p>
          Phase 1 note: editorial visits for Best New Table nominations follow the same rules. Visits are anonymous. Meals are paid. Boost adjustments based on visits disclose the visit date on the venue entry page.
        </p>

        <h3>3.5 Multiple visits for significant scores</h3>
        <p>
          From Phase 2, reviews that result in a score <strong>above 8.5 or below 6.0</strong> require at minimum two independent visits by the critic before publication. High scores and low scores are both consequential — we want the confidence of a second look.
        </p>

        <h3>3.6 The algorithm is the ceiling and the floor (mostly)</h3>
        <p>
          Editors can move a score by ±1.0 via the boost. Below 5.0 is not a boost target — we do not weaponize the score to delist a venue. If a venue should not appear on the site (food safety, legal issue, closed), we delist editorially, not by forcing the number down.
        </p>

        <h3>3.7 Sub-5.0 scores (Phase 2 only)</h3>
        <p>
          Our algorithmic scoring does not publish venues below 5.0. Our Phase 2 named-critic long-form reviews <em>can</em> publish below 5.0, when the target is a venue with sufficient public profile (major celebrity-chef opening, Michelin-adjacent, significant media attention) that warning readers away is a public service.
        </p>
        <p>
          These reviews are clearly labeled &ldquo;The Review.&rdquo; They are fact-checked before publication, reviewed by our retained libel counsel, and subject to higher editorial scrutiny than algorithmic scores.
        </p>
        <p>
          We are not in the business of punching down. Low scores are reserved for venues whose public profile makes criticism a service, not a cruelty.
        </p>

        <hr />

        <h2>4. Legal and compliance</h2>

        <h3>4.1 Accuracy</h3>
        <p>
          We make every reasonable effort to ensure the accuracy of information on the site. We source data from public review platforms and verify via editorial visits. We are not infallible. When we&apos;re wrong, we correct fast and publicly.
        </p>

        <h3>4.2 Opinions are opinions</h3>
        <p>
          Our scores and verdicts are editorial opinions, based on data we consider reliable and our own judgment. They are not statements of fact about the quality, safety, or business practices of any venue.
        </p>

        <h3>4.3 Libel and defamation</h3>
        <p>
          We publish under Philippine law and retain legal counsel to review high-risk editorial content (Phase 2 forward). If you believe we have published something defamatory, contact{" "}
          <a href="mailto:legal@bestphilippines.co">legal@bestphilippines.co</a>. We respond to credible legal concerns within five business days.
        </p>

        <h3>4.4 Intellectual property</h3>
        <p>
          Venue photos on BestPhilippines are sourced from public domains, venue-provided media, or original photography by our editorial team. If you are a rights holder and believe we&apos;ve used your image without authorization, email{" "}
          <a href="mailto:legal@bestphilippines.co">legal@bestphilippines.co</a> and we will remove or credit appropriately.
        </p>

        <h3>4.5 Jurisdiction</h3>
        <p>
          BestPhilippines operates from the Philippines. Disputes are governed by Philippine law.
        </p>

        <hr />

        <h2>5. Changes to these policies</h2>
        <p>
          These policies will change as the site matures. When they do, we&apos;ll publish the update with a changelog and a date.
        </p>
        <p>We will not change policies quietly. Transparency is the whole premise.</p>

        <hr />

        <h2>Version history</h2>
        <p>
          <strong>v1.0 — April 2026.</strong> Initial publication at launch.
        </p>

        <hr />

        <p className="text-body-sm italic text-stone-deep">
          Questions about this page? Email{" "}
          <a href="mailto:hello@bestphilippines.co">hello@bestphilippines.co</a>. We read everything.
        </p>
        <p className="text-body-sm italic text-stone-deep">
          Martin Casey &amp; Yahnee Ortiz
          <br />
          Editors, BestPhilippines
        </p>
      </Prose>
    </div>
  );
}
