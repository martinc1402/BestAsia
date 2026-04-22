// Source of truth: /docs/editorial/about.md
// If you change this page, update the doc. If you change the doc, update this page.

import type { Metadata } from "next";
import Link from "next/link";
import Prose from "@/components/editorial/Prose";

export const metadata: Metadata = {
  title: "About — BestPhilippines",
  description:
    "Filipino dining deserves better criticism than it's getting. We built a scored, ranked, living guide for people who take dinner seriously.",
};

export default function AboutPage() {
  return (
    <div className="bg-paper font-sans text-ink">
      <Prose>
        <header>
          <div className="text-micro font-bold tracking-[0.22em] uppercase text-rust mb-3">
            About · Est. 2026
          </div>
          <h1 className="font-display text-h1 sm:text-display font-bold text-ink tracking-[-0.03em] leading-[1.02]">
            About BestPhilippines
          </h1>
        </header>

        <p className="mt-8 text-body-lg text-stone-deep leading-[1.7]">
          Filipino dining deserves better criticism than it&apos;s getting.
        </p>

        <p>
          Not because the food isn&apos;t good — it&apos;s some of the most interesting food being cooked in Asia right now. Because the media covering it is polite to the point of uselessness. Every new opening is a &ldquo;hidden gem.&rdquo; Every tasting menu is &ldquo;transcendent.&rdquo; Every celebrity chef is a &ldquo;visionary.&rdquo; If everything is excellent, nothing is.
        </p>
        <p>
          We started BestPhilippines because we wanted a guide we could actually use. One that scores specifically, argues openly, and tells you when something isn&apos;t worth the reservation. One built for people who take dinner seriously and want to spend their pesos well.
        </p>

        <hr />

        <h2>Who we are</h2>

        <h3>Martin Casey</h3>
        <p>
          Martin is the kind of foodie his friends have learned not to plan trips with unless they&apos;re ready to eat their way through forty countries of research. He&apos;s done exactly that — forty and counting — on what he calls food tourism and what everyone else calls an expensive habit. He offsets the obsession at the gym, which is the only sustainable way to keep doing this for the long haul. Manila is home, and the case for Filipino food on the world stage is the argument he keeps coming back to.
        </p>

        <h3>Yahnee Ortiz</h3>
        <p>
          Yahnee was born in Cebu. Growing up there means she has strong opinions about lechon, and she is not shy about them. She ran a successful cake business before this, which means she knows how a kitchen actually works, how brutal consistency is to maintain, and why most &ldquo;great&rdquo; restaurants aren&apos;t great twice in a row. Her food politics are Filipino first — sisig, kinilaw, regional rice dishes most food media still hasn&apos;t caught up with. She&apos;s the reason the scoring rubric takes karinderya as seriously as it takes tasting menus.
        </p>

        <h3>Together</h3>
        <p>
          We live in Manila. We eat out more than is probably reasonable. We&apos;ve been arguing about dinner for years, and at some point decided to do it in public.
        </p>

        <hr />

        <h2>What BestPhilippines is</h2>
        <p>
          A scored, ranked, living guide to where the Philippines eats, drinks, and stays out late.
        </p>
        <p>
          Every venue on the site has a number next to it — from 0.0 to 10.0, one decimal place. The number comes from a published algorithm combining public review data and our editorial judgment. You can read exactly how the score is built at <Link href="/about/scoring">/about/scoring</Link>. Nothing about the math is secret.
        </p>
        <p>We cover:</p>
        <ul>
          <li>
            <strong>Restaurants</strong> — from karinderya to tasting menus, scored on the same scale
          </li>
          <li>
            <strong>Bars</strong> — cocktail programs, beer halls, wine bars, dive bars
          </li>
          <li>
            <strong>Cafés</strong> — specialty coffee and third-wave roasters, plus the everyday ones worth knowing
          </li>
          <li>
            <strong>Nightclubs</strong> — the places worth queuing for, and occasionally the ones that aren&apos;t
          </li>
        </ul>
        <p>
          We&apos;re starting in Manila, expanding to Cebu, and then to the rest of Southeast Asia through our parent project, BestAsia.
        </p>

        <hr />

        <h2>What BestPhilippines isn&apos;t</h2>
        <ul>
          <li>
            <strong>A review aggregator.</strong> We&apos;re not averaging TripAdvisor. We use public data as one input among several, and we apply editorial judgment on top.
          </li>
          <li>
            <strong>A pay-to-play directory.</strong> No venue on BestPhilippines has paid to be listed, scored higher, or included in a ranked list. Nothing we accept as revenue — now or ever — will change a score.
          </li>
          <li>
            <strong>A &ldquo;hidden gem&rdquo; blog.</strong> We don&apos;t think the best restaurant in Makati should score the same as a forgettable one because we don&apos;t want to hurt feelings. Scores exist to separate great from good from skip.
          </li>
          <li>
            <strong>Anonymous.</strong> This is us. Our faces are on this page. Our names are on every decision. If you want to argue, you know where to find us.
          </li>
        </ul>

        <hr />

        <h2>How we work</h2>
        <p>
          <strong>Scoring is algorithmic, with bounded editorial judgment.</strong> Five inputs: Google rating, review volume, recency, cross-platform signal, and an editorial boost we cap at ±1.0. Full methodology at <Link href="/about/scoring">/about/scoring</Link>.
        </p>
        <p>
          <strong>We publish the rubric, the weights, and every change to them.</strong> If we move a score, you can see why. If we change the algorithm, we publish a changelog.
        </p>
        <p>
          <strong>We don&apos;t negotiate scores with venues.</strong> Ever. The full rules for venues, including right of reply, are at <Link href="/about/policies">/about/policies</Link>.
        </p>
        <p>
          <strong>We refresh every score, every week.</strong> No venue is graded once and left alone. The Philippine dining scene moves; our scores move with it.
        </p>
        <p>
          <strong>We list 5.0 and above.</strong> If a place doesn&apos;t appear on BestPhilippines, it&apos;s either unscored, below our data threshold, or below our floor. We&apos;d rather cover fewer venues well than rank everyone.
        </p>

        <hr />

        <h2>What&apos;s coming</h2>
        <p>
          BestPhilippines launches with the scoring system, the canon lists, weekly editor picks, and a Monday newsletter. That&apos;s the foundation.
        </p>
        <p>Over the next 18 months, we&apos;ll layer in:</p>
        <ul>
          <li>
            <strong>Long-form reviews</strong> from named critics with specific beats — regional Filipino, natural wine, karinderya, high-end Japanese, cocktail bars. Critics with points of view, not anonymous verdicts.
          </li>
          <li>
            <strong>Best New Table</strong> — a standing designation for new openings scoring 8.5 and above. Our stamp of attention.
          </li>
          <li>
            <strong>The Sunday Review</strong> — one retrospective essay per week on a restaurant, chef, dish, or question that matters.
          </li>
          <li>
            <strong>Cross-border coverage</strong> through BestAsia, as we expand into Thailand, Vietnam, and beyond.
          </li>
        </ul>
        <p>
          The site gets more editorial over time. The scores stay algorithmically grounded the whole way.
        </p>

        <hr />

        <h2>Why this matters</h2>
        <p>
          Good criticism makes the scene better. It tells diners where to spend their money. It tells restaurants what they&apos;re getting away with. It creates a public record of what was actually excellent and what was just hyped. The cities that have serious dining criticism — New York, Paris, Tokyo, London — have it because critics showed up, took the work seriously, and wrote things that were sometimes unwelcome.
        </p>
        <p>
          The Philippines has the food. It doesn&apos;t yet have the criticism. We&apos;re trying to help fix that.
        </p>
        <p>
          This is a long project. Scores mean nothing on day one. They mean everything in year three. We&apos;re building for the long version.
        </p>

        <hr />

        <h2>Get in touch</h2>
        <ul>
          <li>
            <strong>Everything</strong> — tips, corrections, re-review requests, right of reply, press, pitches:{" "}
            <a href="mailto:hello@bestphilippines.co">hello@bestphilippines.co</a>
          </li>
          <li>
            <strong>Legal matters only:</strong>{" "}
            <a href="mailto:legal@bestphilippines.co">legal@bestphilippines.co</a>
          </li>
          <li>
            <strong>Pitch us a place:</strong> <Link href="/pitch">/pitch</Link>
          </li>
        </ul>
        <p>We read everything.</p>

        <hr />

        <p className="text-body-sm italic text-stone-deep">
          Martin Casey &amp; Yahnee Ortiz
          <br />
          Manila, April 2026
        </p>
      </Prose>
    </div>
  );
}
