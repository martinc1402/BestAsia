import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  getActiveVenueCount,
  getNeighborhoodsWithCounts,
  getCuratedListsWithCounts,
} from "@/lib/queries";

export const metadata: Metadata = {
  title: "City Guides — BestPhilippines",
  description:
    "The Philippines, curated. Manila today. Cebu, Boracay, and Siargao coming 2026.",
};

interface CityCard {
  slug: string;
  name: string;
  tagline: string;
  blurb: string;
  img: string;
  href: string | null;
  status: "live" | "soon";
  eta?: string;
}

const UPCOMING: CityCard[] = [
  {
    slug: "cebu",
    name: "Cebu",
    tagline: "Queen City of the South",
    blurb:
      "Lechon, heritage, and a dining scene quietly outpacing its size. Coming first after Manila.",
    img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80&auto=format&fit=crop",
    href: null,
    status: "soon",
    eta: "Q2 2026",
  },
  {
    slug: "boracay",
    name: "Boracay",
    tagline: "Island, reworked",
    blurb:
      "Beach-bar icons, Station 2 new-school openings, and the rare sunset spot worth the cover.",
    img: "https://images.unsplash.com/photo-1518509562904-e7ef99cddc85?w=1200&q=80&auto=format&fit=crop",
    href: null,
    status: "soon",
    eta: "Q3 2026",
  },
  {
    slug: "siargao",
    name: "Siargao",
    tagline: "Barefoot dining",
    blurb:
      "General Luna's dinner table — from fire-pit seafood to the laptop cafés that keep the island fed.",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80&auto=format&fit=crop",
    href: null,
    status: "soon",
    eta: "Q4 2026",
  },
];

export default async function CitiesPage() {
  const [venueCount, hoods, lists] = await Promise.all([
    getActiveVenueCount("manila"),
    getNeighborhoodsWithCounts("manila"),
    getCuratedListsWithCounts(),
  ]);

  const manila: CityCard = {
    slug: "manila",
    name: "Manila",
    tagline: "The capital, served hot",
    blurb:
      "500 places vetted across 18 neighborhoods. Speakeasies behind unmarked doors, Michelin kitchens, and the 2 AM tapsilog you'll talk about for years.",
    img: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=1800&q=85&auto=format&fit=crop",
    href: "/manila",
    status: "live",
  };

  const cities: CityCard[] = [manila, ...UPCOMING];
  const manilaStats = [
    { n: String(venueCount || 500), l: "venues" },
    { n: String(hoods.length || 18), l: "neighborhoods" },
    { n: String(lists.length || 8), l: "lists" },
  ];

  return (
    <div className="bg-bone font-[family-name:var(--font-plus-jakarta)] text-ink">
      {/* HERO */}
      <section className="max-w-screen-2xl mx-auto px-6 sm:px-10 pt-16 sm:pt-20 lg:pt-24 pb-10 sm:pb-14">
        <div className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.22em] uppercase text-terra">
          City Guides · Est. 2026
        </div>
        <h1 className="mt-3 font-[family-name:var(--font-noto-serif)] text-ink font-black tracking-[-0.045em] leading-[0.92] text-[56px] sm:text-[88px] lg:text-[112px] max-w-[920px]">
          The Philippines,
          <br />
          <span className="italic text-terra">curated.</span>
        </h1>
        <p className="mt-6 text-secondary text-[15px] sm:text-[17px] leading-[1.5] max-w-[640px]">
          One city fully mapped. Three more on the way. Each guide ranked by
          algorithm, argued over by humans, refreshed every month.
        </p>
      </section>

      {/* FEATURED: Manila full-width */}
      <section className="max-w-screen-2xl mx-auto px-6 sm:px-10 pb-10 sm:pb-14">
        <Link
          href="/manila"
          className="group relative grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] lg:h-[440px] rounded-[20px] overflow-hidden shadow-[0_14px_28px_rgba(0,0,0,0.12)] hover:shadow-[0_22px_44px_rgba(0,0,0,0.18)] transition-shadow"
        >
          {/* Image side */}
          <div className="relative h-60 sm:h-[340px] lg:h-auto overflow-hidden">
            <Image
              src={manila.img}
              alt="Intramuros cobblestones at dusk — the walled heart of Old Manila"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(27,28,28,0.15) 0%, rgba(27,28,28,0.7) 100%)",
              }}
            />
            <span className="absolute top-5 left-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-saffron text-ink text-[10px] font-black tracking-[0.2em] uppercase">
              Live guide
            </span>
          </div>

          {/* Ink panel */}
          <div className="bg-ink text-white p-8 sm:p-10 lg:p-11 flex flex-col justify-between gap-8">
            <div>
              <div className="text-[10px] font-extrabold tracking-[0.22em] uppercase text-saffron">
                {manila.tagline}
              </div>
              <h2 className="mt-3 font-[family-name:var(--font-noto-serif)] text-[44px] sm:text-[56px] lg:text-[72px] font-black tracking-[-0.035em] leading-[0.95]">
                Manila.
              </h2>
              <p className="mt-4 text-[13.5px] sm:text-[14.5px] text-white/75 leading-[1.55] max-w-[460px]">
                {manila.blurb}
              </p>
            </div>
            <div>
              <div className="flex gap-8 mb-6">
                {manilaStats.map((s) => (
                  <div key={s.l}>
                    <div className="font-[family-name:var(--font-noto-serif)] text-[28px] sm:text-[32px] font-black text-saffron tracking-[-0.02em] leading-none">
                      {s.n}
                    </div>
                    <div className="mt-1 text-[10px] font-bold tracking-[0.2em] uppercase text-white/60">
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
              <span className="inline-flex items-center gap-1.5 px-5 py-3 rounded-[11px] bg-saffron text-ink text-[13px] font-extrabold">
                Open guide
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* COMING SOON GRID */}
      <section className="max-w-screen-2xl mx-auto px-6 sm:px-10 pb-20 sm:pb-24">
        <div className="mb-7 sm:mb-9 flex items-end justify-between gap-6">
          <div>
            <div className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.22em] uppercase text-terra">
              On the roadmap
            </div>
            <h2 className="mt-2 font-[family-name:var(--font-noto-serif)] text-[28px] sm:text-[40px] lg:text-[48px] font-black tracking-[-0.03em] leading-[1.02]">
              Next up, on the islands.
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {UPCOMING.map((c) => (
            <div
              key={c.slug}
              className="relative aspect-[4/5] sm:aspect-[3/4] rounded-[16px] overflow-hidden bg-ink"
            >
              <Image
                src={c.img}
                alt={c.name}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover opacity-70"
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.92) 100%)",
                }}
              />
              <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-saffron/40 bg-saffron/15 backdrop-blur-sm text-saffron text-[9.5px] font-extrabold tracking-[0.22em] uppercase">
                Coming {c.eta}
              </span>
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                <div className="text-[10px] font-extrabold tracking-[0.22em] uppercase text-white/70">
                  {c.tagline}
                </div>
                <h3 className="mt-2 font-[family-name:var(--font-noto-serif)] text-white text-[32px] sm:text-[36px] font-black tracking-[-0.03em] leading-[0.95]">
                  {c.name}.
                </h3>
                <p className="mt-2.5 text-white/75 text-[12.5px] sm:text-[13px] leading-[1.5] line-clamp-3">
                  {c.blurb}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter-style footer nudge */}
        <div className="mt-14 sm:mt-20 rounded-[16px] border border-outline-variant bg-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-extrabold tracking-[0.22em] uppercase text-terra">
              Be first
            </div>
            <div className="mt-1 font-[family-name:var(--font-noto-serif)] text-[20px] sm:text-[22px] font-black text-ink tracking-[-0.02em]">
              Get the next city in your inbox.
            </div>
          </div>
          <Link
            href="/quiz"
            className="shrink-0 inline-flex items-center gap-1.5 px-5 py-3 rounded-[11px] bg-ink text-white text-[13px] font-extrabold hover:bg-ink-soft transition-colors"
          >
            Tell us where you&apos;re headed →
          </Link>
        </div>
      </section>
    </div>
  );
}
