// TODO: split, exceeds 300-line limit (currently      410 lines) — scheduled for follow-up PR
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Star } from "lucide-react";
import {
  getActiveVenueCount,
  getCuratedListsWithCounts,
  getDiscoverVenues,
  getNeighborhoodsWithCounts,
} from "@/lib/queries";
import { getPriceSymbol, getCategorySingular } from "@/lib/utils";
import type { Neighborhood, VenueWithTags } from "@/lib/types";

const VALID_CITIES = ["manila"];

// Unsplash License (free for commercial use). Shot: Makati skyline at dusk.
const HERO_IMAGE =
  // TODO: replace with commissioned/editorial photography
  "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1800&q=85&auto=format&fit=crop";

const NEIGHBORHOOD_THEME: Record<string, { tag: string; blurb: string }> = {
  poblacion: {
    tag: "Nightlife",
    blurb:
      "Speakeasies behind unmarked doors, listening bars, and smoke drifting from grill stalls at 2 AM. Dressed-down, loud, and always late.",
  },
  "poblacion-makati": {
    tag: "Nightlife",
    blurb:
      "Speakeasies behind unmarked doors, listening bars, and smoke drifting from grill stalls at 2 AM. Dressed-down, loud, and always late.",
  },
  bgc: {
    tag: "Modern",
    blurb:
      "New buildings, glossy restaurants, rooftop bars with views that justify the surcharge. Where expense accounts come to stretch.",
  },
  "makati-cbd": {
    tag: "Dining",
    blurb:
      "Dense with serious kitchens — Michelin hopefuls, corporate lunches, and the quiet Japanese spot your favorite chef won't name.",
  },
  salcedo: {
    tag: "Cafés",
    blurb:
      "Saturday-morning Manila. Specialty roasters, brunch patios, the kind of place you sit at for three hours with the newspaper.",
  },
  intramuros: {
    tag: "Heritage",
    blurb:
      "Spanish walls, cobblestone alleys, and a quiet kind of dinner — heritage kitchens serving the food the city was built on.",
  },
  binondo: {
    tag: "Chinatown",
    blurb:
      "The oldest Chinatown in the world. Dumplings at 7 AM, hawker carts, generations of recipe-keepers.",
  },
  "quezon-city": {
    tag: "Quezon City",
    blurb:
      "Sprawling, college-town energy, late-night tapsilog and the weirdest menus in Manila. Worth the Uber.",
  },
  alabang: {
    tag: "South",
    blurb:
      "The quiet south. Leafy, residential, Japanese-heavy — the kitchen where Makati takes the weekend off.",
  },
};

const NEIGHBORHOOD_IMG: Record<string, string> = {
  poblacion:
    // TODO: replace with commissioned/editorial photography
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&q=80&auto=format&fit=crop",
  "poblacion-makati":
    // TODO: replace with commissioned/editorial photography
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&q=80&auto=format&fit=crop",
  // TODO: replace with commissioned/editorial photography
  bgc: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1200&q=80&auto=format&fit=crop",
  "makati-cbd":
    // TODO: replace with commissioned/editorial photography
    "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1200&q=80&auto=format&fit=crop",
  salcedo:
    // TODO: replace with commissioned/editorial photography
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80&auto=format&fit=crop",
  intramuros:
    // TODO: replace with commissioned/editorial photography
    "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=1200&q=80&auto=format&fit=crop",
  binondo:
    // TODO: replace with commissioned/editorial photography
    "https://images.unsplash.com/photo-1552611052-d2bdb5ad76a3?w=1200&q=80&auto=format&fit=crop",
  "quezon-city":
    // TODO: replace with commissioned/editorial photography
    "https://images.unsplash.com/photo-1508697014387-db70aad34f4d?w=1200&q=80&auto=format&fit=crop",
  alabang:
    // TODO: replace with commissioned/editorial photography
    "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=1200&q=80&auto=format&fit=crop",
};

interface Props {
  params: Promise<{ city: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  if (!VALID_CITIES.includes(city)) return { title: "Not Found" };
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);
  return {
    title: `${cityName} — The City Guide | BestPhilippines`,
    description: `${cityName} — 500 places vetted across 18 neighborhoods. Where to eat, drink, and stay out late.`,
  };
}

type HoodWithVenues = Neighborhood & {
  venue_count: number;
  venues: VenueWithTags[];
};

function neighborhoodTag(slug: string, name: string): string {
  return NEIGHBORHOOD_THEME[slug]?.tag ?? name;
}
function neighborhoodBlurb(slug: string, description: string | null): string {
  return NEIGHBORHOOD_THEME[slug]?.blurb ?? description ??
    "A Manila neighborhood worth your night — picked venues curated by Best Score.";
}
function neighborhoodImg(slug: string): string {
  return (
    NEIGHBORHOOD_IMG[slug] ??
    // TODO: replace with commissioned/editorial photography
    "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1200&q=80&auto=format&fit=crop"
  );
}

export default async function CityPage({ params }: Props) {
  const { city } = await params;
  if (!VALID_CITIES.includes(city)) notFound();
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);

  const [neighborhoods, lists, venueCount] = await Promise.all([
    getNeighborhoodsWithCounts(city),
    getCuratedListsWithCounts(),
    getActiveVenueCount(city),
  ]);

  const topHoods = neighborhoods.slice(0, 8);

  const withVenues: HoodWithVenues[] = await Promise.all(
    topHoods.map(async (n) => {
      const venues = await getDiscoverVenues({
        city,
        neighborhood: n.slug,
        limit: 6,
      });
      return { ...n, venues };
    }),
  );

  const populated = withVenues.filter((n) => n.venues.length > 0);

  return (
    <div className="bg-paper font-sans text-ink">
      {/* HERO */}
      <section className="relative h-[460px] sm:h-[540px] lg:h-[620px]">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={HERO_IMAGE}
            alt={`${cityName} skyline at dusk — Makati CBD, Metro Manila, Philippines`}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 45%, rgba(252,249,248,1) 100%)",
            }}
          />
        </div>
        <div className="relative z-10 h-full max-w-screen-2xl mx-auto px-6 sm:px-10 pt-20 sm:pt-24 lg:pt-28 pb-16 sm:pb-20 lg:pb-24 flex flex-col justify-end">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-12">
            <div className="max-w-[760px]">
              <div className="text-micro sm:text-micro font-bold tracking-[0.22em] uppercase text-calamansi">
                The City Guide {` · Est. 2026`}
              </div>
              <h1 className="mt-3 font-display text-white font-bold tracking-[-0.05em] leading-[0.85] text-display sm:text-display lg:text-display">
                {cityName}.
              </h1>
              <p className="mt-5 sm:mt-6 text-white/80 text-body-sm sm:text-body lg:text-body-lg leading-[1.5] max-w-[560px]">
                {venueCount || 500} places vetted. {neighborhoods.length || 18}{" "}
                neighborhoods. One algorithm that doesn&apos;t play favorites —
                plus a few humans who do.
              </p>
            </div>
            <div className="hidden sm:flex lg:flex-col lg:items-end gap-6 lg:gap-2 pb-1">
              {[
                { n: String(venueCount || 500), l: "venues" },
                { n: String(neighborhoods.length || 18), l: "neighborhoods" },
                { n: String(lists.length || 8), l: "lists" },
              ].map((s) => (
                <div key={s.l} className="text-right">
                  <div className="font-display text-white font-bold tracking-[-0.03em] leading-[0.9] text-h2 lg:text-h1">
                    {s.n}
                  </div>
                  <div className="mt-0.5 text-micro lg:text-micro font-bold tracking-[0.2em] uppercase text-white/70">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STAT STRIP (mobile card over-hanging hero) */}
      <div className="relative z-20 -mt-5 sm:hidden px-4">
        <div className="max-w-screen-2xl mx-auto bg-white rounded-[14px] px-2 py-3 flex ">
          {[
            { n: String(venueCount || 500), l: "venues" },
            { n: String(neighborhoods.length || 18), l: "hoods" },
            { n: String(lists.length || 8), l: "lists" },
            { n: "2,372", l: "reviewed" },
          ].map((s, i) => (
            <div
              key={s.l}
              className={`flex-1 text-center ${
                i < 3 ? "border-r border-stone/60" : ""
              }`}
            >
              <div className="font-display text-body-lg font-bold text-ink tracking-[-0.02em]">
                {s.n}
              </div>
              <div className="mt-0.5 text-micro font-bold tracking-[0.1em] uppercase text-stone-deep">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* INTERACTIVE MAP */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-10 pt-8 sm:pt-10 lg:pt-14">
        <div className="mb-5 sm:mb-7 flex items-end justify-between gap-4">
          <div>
            <div className="text-micro sm:text-micro font-bold tracking-[0.22em] uppercase text-rust">
              Interactive map
            </div>
            <h2 className="mt-2 font-display text-h3 sm:text-h2 lg:text-h1 font-bold tracking-[-0.03em] leading-[1.02]">
              Pick a neighborhood.
            </h2>
          </div>
        </div>
        <FauxMap hoods={populated} />
      </section>

      {/* STICKY PILL STRIP */}
      <nav className="sticky top-0 z-30 bg-paper/95 border-b border-stone mt-8 sm:mt-10">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-10 py-3 flex gap-1.5 overflow-x-auto scrollbar-hide">
          {populated.map((n) => (
            <a
              key={n.slug}
              href={`#hood-${n.slug}`}
              className="shrink-0 px-3.5 py-2 rounded-full border border-stone bg-white text-ink text-body-sm sm:text-body-sm font-semibold whitespace-nowrap hover:border-ink transition-colors"
            >
              {n.name}
              <span className="ml-1 text-stone-deep font-semibold">· {n.venue_count}</span>
            </a>
          ))}
        </div>
      </nav>

      {/* NEIGHBORHOOD SECTIONS */}
      <div className="pb-16 sm:pb-20">
        {populated.map((n) => (
          <NeighborhoodSection key={n.slug} hood={n} />
        ))}
      </div>

      {/* FOOTER LINE */}
      <section className="px-4 sm:px-8 lg:px-10 pb-14 sm:pb-20 text-center">
        <div className="font-display text-verdict sm:text-h3 font-bold text-ink tracking-[-0.02em]">
          That&apos;s {cityName}, for now.
        </div>
        <div className="mt-1.5 text-body-sm sm:text-body-sm text-stone-deep">
          Cebu, Boracay, Siargao — coming 2026.
        </div>
      </section>
    </div>
  );
}

function NeighborhoodSection({ hood }: { hood: HoodWithVenues }) {
  const tag = neighborhoodTag(hood.slug, hood.name);
  const blurb = neighborhoodBlurb(hood.slug, hood.description);

  return (
    <section
      id={`hood-${hood.slug}`}
      className="scroll-mt-[72px] pt-10 sm:pt-14 lg:pt-16"
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-10">
        <div className="flex items-end justify-between gap-4 mb-5 sm:mb-6">
          <div className="max-w-3xl">
            <div className="text-micro sm:text-micro font-bold tracking-[0.22em] uppercase text-rust">
              {tag} · {hood.venue_count} spots
            </div>
            <h2 className="mt-2 font-display text-ink font-bold tracking-[-0.035em] leading-[0.95] text-h3 sm:text-h1 lg:text-h1">
              {hood.name}
            </h2>
            <p className="mt-3 sm:mt-4 font-display italic text-stone-deep text-body-sm sm:text-body lg:text-body-lg leading-[1.5] max-w-[620px]">
              {blurb}
            </p>
          </div>
          <Link
            href={`/discover?neighborhood=${hood.slug}`}
            className="shrink-0 text-rust font-bold text-body-sm sm:text-body-sm flex items-center gap-1 pb-1.5"
          >
            See all →
          </Link>
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="lg:hidden -mx-4 sm:-mx-8 px-4 sm:px-8 flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2">
          {hood.venues.map((v) => (
            <div key={v.id} className="w-[220px] shrink-0 snap-start">
              <HoodVenueCard venue={v} />
            </div>
          ))}
        </div>

        {/* Desktop: grid */}
        <div className="hidden lg:grid grid-cols-3 gap-4">
          {hood.venues.slice(0, 6).map((v) => (
            <HoodVenueCard key={v.id} venue={v} />
          ))}
        </div>
      </div>
    </section>
  );
}

function HoodVenueCard({ venue }: { venue: VenueWithTags }) {
  const rating = venue.google_rating?.toFixed(1);
  return (
    <Link
      href={`/venue/${venue.slug}`}
      className="group block bg-white rounded-[14px] overflow-hidden hover: transition-shadow"
    >
      <div className="relative aspect-[4/3] bg-stone overflow-hidden">
        {venue.featured_photo_url && (
          <Image
            src={venue.featured_photo_url}
            alt={venue.name}
            fill
            className="object-cover group- transition-transform duration-500"
            sizes="(max-width: 1024px) 220px, 33vw"
          />
        )}
        {venue.final_score != null && (
          <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-rust text-white text-micro font-bold ">
            {venue.final_score.toFixed(1)}
          </span>
        )}
        {venue.price_level && (
          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-white/95 text-rust text-micro font-bold tracking-[0.05em]">
            {getPriceSymbol(venue.price_level)}
          </span>
        )}
      </div>
      <div className="p-3 sm:p-3.5">
        <div className="text-micro font-bold tracking-[0.18em] uppercase text-stone-deep truncate">
          {venue.subcategory || getCategorySingular(venue.category)}
        </div>
        <div className="mt-1 font-display text-body-sm sm:text-body font-bold text-ink leading-[1.15] tracking-[-0.015em] line-clamp-2">
          {venue.name}
        </div>
        {rating && (
          <div className="mt-1.5 text-micro text-stone-deep flex items-center gap-1">
            <Star className="w-3 h-3 fill-calamansi stroke-calamansi" aria-hidden />
            <span className="font-bold text-ink">{rating}</span>
          </div>
        )}
      </div>
    </Link>
  );
}

function FauxMap({ hoods }: { hoods: HoodWithVenues[] }) {
  return (
    <div className="rounded-[16px] border border-stone bg-paper p-5 sm:p-6">
      <div className="text-micro font-bold tracking-[0.18em] uppercase text-stone-deep">
        Neighborhoods
      </div>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {hoods.map((n) => (
          <a
            key={n.slug}
            href={`#hood-${n.slug}`}
            className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border border-stone bg-paper hover:border-ink transition-colors"
          >
            <span className="text-body-sm font-semibold text-ink">{n.name}</span>
            <span className="shrink-0 w-6 h-6 rounded-full bg-rust text-paper text-micro font-bold flex items-center justify-center">
              {n.venue_count}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
