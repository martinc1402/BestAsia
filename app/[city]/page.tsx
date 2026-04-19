import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
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
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&q=80&auto=format&fit=crop",
  "poblacion-makati":
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&q=80&auto=format&fit=crop",
  bgc: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1200&q=80&auto=format&fit=crop",
  "makati-cbd":
    "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1200&q=80&auto=format&fit=crop",
  salcedo:
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80&auto=format&fit=crop",
  intramuros:
    "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=1200&q=80&auto=format&fit=crop",
  binondo:
    "https://images.unsplash.com/photo-1552611052-d2bdb5ad76a3?w=1200&q=80&auto=format&fit=crop",
  "quezon-city":
    "https://images.unsplash.com/photo-1508697014387-db70aad34f4d?w=1200&q=80&auto=format&fit=crop",
  alabang:
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
    <div className="bg-bone font-[family-name:var(--font-plus-jakarta)] text-ink">
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
              <div className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.22em] uppercase text-saffron">
                The City Guide {` · Est. 2026`}
              </div>
              <h1 className="mt-3 font-[family-name:var(--font-noto-serif)] text-white font-black tracking-[-0.05em] leading-[0.85] text-[80px] sm:text-[120px] lg:text-[160px]">
                {cityName}.
              </h1>
              <p className="mt-5 sm:mt-6 text-white/80 text-[14px] sm:text-[16px] lg:text-[17px] leading-[1.5] max-w-[560px]">
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
                  <div className="font-[family-name:var(--font-noto-serif)] text-white font-black tracking-[-0.03em] leading-[0.9] text-[32px] lg:text-[40px]">
                    {s.n}
                  </div>
                  <div className="mt-0.5 text-[9.5px] lg:text-[10px] font-bold tracking-[0.2em] uppercase text-white/70">
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
        <div className="max-w-screen-2xl mx-auto bg-white rounded-[14px] px-2 py-3 flex shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          {[
            { n: String(venueCount || 500), l: "venues" },
            { n: String(neighborhoods.length || 18), l: "hoods" },
            { n: String(lists.length || 8), l: "lists" },
            { n: "2,372", l: "reviewed" },
          ].map((s, i) => (
            <div
              key={s.l}
              className={`flex-1 text-center ${
                i < 3 ? "border-r border-outline-variant/60" : ""
              }`}
            >
              <div className="font-[family-name:var(--font-noto-serif)] text-[18px] font-black text-ink tracking-[-0.02em]">
                {s.n}
              </div>
              <div className="mt-0.5 text-[9.5px] font-bold tracking-[0.1em] uppercase text-secondary">
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
            <div className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.22em] uppercase text-terra">
              Interactive map
            </div>
            <h2 className="mt-2 font-[family-name:var(--font-noto-serif)] text-[26px] sm:text-[36px] lg:text-[44px] font-black tracking-[-0.03em] leading-[1.02]">
              Pick a neighborhood.
            </h2>
          </div>
        </div>
        <FauxMap hoods={populated} />
      </section>

      {/* STICKY PILL STRIP */}
      <nav className="sticky top-0 z-30 bg-bone/95 backdrop-blur border-b border-outline-variant mt-8 sm:mt-10">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-10 py-3 flex gap-1.5 overflow-x-auto scrollbar-hide">
          {populated.map((n) => (
            <a
              key={n.slug}
              href={`#hood-${n.slug}`}
              className="shrink-0 px-3.5 py-2 rounded-full border border-outline-variant bg-white text-ink text-[12px] sm:text-[13px] font-semibold whitespace-nowrap hover:border-ink transition-colors"
            >
              {n.name}
              <span className="ml-1 text-outline font-medium">· {n.venue_count}</span>
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
        <div className="font-[family-name:var(--font-noto-serif)] text-[22px] sm:text-[26px] font-black text-ink tracking-[-0.02em]">
          That&apos;s {cityName}, for now.
        </div>
        <div className="mt-1.5 text-[12px] sm:text-[13px] text-secondary">
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
            <div className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.22em] uppercase text-terra">
              {tag} · {hood.venue_count} spots
            </div>
            <h2 className="mt-2 font-[family-name:var(--font-noto-serif)] text-ink font-black tracking-[-0.035em] leading-[0.95] text-[30px] sm:text-[44px] lg:text-[56px]">
              {hood.name}
            </h2>
            <p className="mt-3 sm:mt-4 font-[family-name:var(--font-noto-serif)] italic text-secondary text-[13.5px] sm:text-[16px] lg:text-[18px] leading-[1.5] max-w-[620px]">
              {blurb}
            </p>
          </div>
          <Link
            href={`/discover?neighborhood=${hood.slug}`}
            className="shrink-0 text-terra font-extrabold text-[12px] sm:text-[13px] flex items-center gap-1 pb-1.5"
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
      className="group block bg-white rounded-[14px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_14px_28px_rgba(0,0,0,0.14)] transition-shadow"
    >
      <div className="relative aspect-[4/3] bg-surface-low overflow-hidden">
        {venue.featured_photo_url && (
          <Image
            src={venue.featured_photo_url}
            alt={venue.name}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
            sizes="(max-width: 1024px) 220px, 33vw"
          />
        )}
        {venue.best_score != null && (
          <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-terra text-white text-[11px] font-black shadow-sm">
            {Math.round(venue.best_score)}
          </span>
        )}
        {venue.price_level && (
          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-white/95 text-terra text-[10.5px] font-black tracking-[0.05em]">
            {getPriceSymbol(venue.price_level)}
          </span>
        )}
      </div>
      <div className="p-3 sm:p-3.5">
        <div className="text-[9.5px] font-extrabold tracking-[0.18em] uppercase text-outline truncate">
          {venue.subcategory || getCategorySingular(venue.category)}
        </div>
        <div className="mt-1 font-[family-name:var(--font-noto-serif)] text-[15px] sm:text-[16px] font-extrabold text-ink leading-[1.15] tracking-[-0.015em] line-clamp-2">
          {venue.name}
        </div>
        {rating && (
          <div className="mt-1.5 text-[11.5px] text-secondary flex items-center gap-1">
            <StarIcon />
            <span className="font-extrabold text-ink">{rating}</span>
          </div>
        )}
      </div>
    </Link>
  );
}

function FauxMap({ hoods }: { hoods: HoodWithVenues[] }) {
  // Predefined positions — distributed across the map area.
  const positions: [number, number][] = [
    [30, 55],
    [58, 62],
    [44, 72],
    [50, 48],
    [22, 34],
    [78, 28],
    [66, 82],
    [38, 22],
  ];

  return (
    <div className="relative h-[240px] sm:h-[320px] lg:h-[440px] rounded-[16px] overflow-hidden border border-outline-variant bg-[#E8EDE2]">
      <svg
        viewBox="0 0 400 300"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <pattern id="mapgrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="400" height="300" fill="#E8EDE2" />
        <rect width="400" height="300" fill="url(#mapgrid)" />
        <path d="M 0 140 Q 100 130 200 150 T 400 160" fill="none" stroke="#fff" strokeWidth="4" />
        <path d="M 0 200 Q 150 180 300 210 T 400 220" fill="none" stroke="#fff" strokeWidth="3" />
        <path d="M 120 0 L 130 300" fill="none" stroke="#fff" strokeWidth="3" />
        <path d="M 250 0 L 260 300" fill="none" stroke="#fff" strokeWidth="2" />
        <path d="M 0 0 L 0 100 Q 80 110 100 80 L 80 0 Z" fill="#B7D1E3" />
        <circle cx="180" cy="180" r="28" fill="#C5D9B4" />
        <rect x="280" y="70" width="40" height="30" rx="6" fill="#C5D9B4" />
      </svg>

      {hoods.map((n, i) => {
        const [l, t] = positions[i] ?? [50 + ((i * 7) % 40), 40 + ((i * 11) % 40)];
        return (
          <a
            key={n.slug}
            href={`#hood-${n.slug}`}
            className="absolute -translate-x-1/2 -translate-y-full group"
            style={{ left: `${l}%`, top: `${t}%` }}
          >
            <div className="px-2.5 py-1 pl-[7px] rounded-full bg-white text-ink text-[10.5px] sm:text-[11.5px] font-extrabold shadow-[0_3px_8px_rgba(0,0,0,0.2)] flex items-center gap-1.5 whitespace-nowrap group-hover:bg-ink group-hover:text-white transition-colors">
              <span className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] rounded-full bg-terra text-white text-[9px] sm:text-[10px] font-black flex items-center justify-center group-hover:bg-saffron group-hover:text-ink transition-colors">
                {n.venue_count}
              </span>
              {n.name}
            </div>
          </a>
        );
      })}

      <div className="absolute bottom-3 left-3 px-3 py-2 rounded-[10px] bg-white text-[10.5px] sm:text-[11px] text-secondary shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
        <div className="font-extrabold text-ink">Manila, laid out.</div>
        Tap any pin to jump to the neighborhood.
      </div>
    </div>
  );
}

function StarIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"
        fill="#FABD00"
      />
    </svg>
  );
}
