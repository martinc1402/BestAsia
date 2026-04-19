import Image from "next/image";
import Link from "next/link";
import {
  getCuratedListsWithCounts,
  getDiscoverVenues,
  getTopVenues,
} from "@/lib/queries";
import { getPriceSymbol } from "@/lib/utils";
import type { VenueWithTags } from "@/lib/types";
import TonightTicker from "@/components/TonightTicker";

// Unsplash License (free for commercial use, attribution optional).
// Shot: nighttime Poblacion / Makati bar scene — matches "stays out late".
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1525268323446-0505b6fe7778?w=1800&q=85&auto=format&fit=crop";
const HERO_ALT = "Poblacion at night — the Makati nightlife spine, Metro Manila";

const COLLECTION_COVER: Record<string, string> = {
  "rooftop-bars-manila":
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1400&q=80",
  "best-nightclubs-manila":
    "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1400&q=80",
  "best-filipino-restaurants-manila":
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&q=80",
  "top-bars-bgc":
    "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=1400&q=80",
  "best-date-night-makati":
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1400&q=80",
  "best-cafes-remote-work-manila":
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1400&q=80",
  "top-bars-poblacion":
    "https://images.unsplash.com/photo-1525268323446-0505b6fe7778?w=1400&q=80",
  "top-restaurants-manila":
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&q=80",
};

const CUISINE_LABEL: Record<string, string> = {
  filipino: "Filipino",
  japanese: "Japanese",
  korean: "Korean",
  italian: "Italian",
  spanish: "Spanish",
  "craft-cocktails": "Craft Cocktails",
  "specialty-coffee": "Specialty Coffee",
  "fine-dining": "Fine Dining",
};
const CATEGORY_LABEL: Record<string, string> = {
  restaurant: "Restaurant",
  bar: "Bar",
  cafe: "Café",
  nightclub: "Nightclub",
};

function cuisine(v: VenueWithTags): string {
  const c = (v.tags ?? []).find((t) => t.dimension === "cuisine");
  if (c) return CUISINE_LABEL[c.name] ?? c.display_name;
  return CATEGORY_LABEL[v.category] ?? v.category;
}

function coverFor(slug: string): string {
  return (
    COLLECTION_COVER[slug] ||
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1400&q=80"
  );
}

export default async function HomePage() {
  const [tonightPicks, editorPicks, lists] = await Promise.all([
    getDiscoverVenues({
      city: "manila",
      openNow: true,
      sort: "best",
      limit: 3,
    }),
    getTopVenues("manila", 3),
    getCuratedListsWithCounts(),
  ]);

  const tonight =
    tonightPicks.length >= 3
      ? tonightPicks
      : (await getTopVenues("manila", 6))
          .filter(
            (v) =>
              v.category === "bar" ||
              v.category === "restaurant" ||
              v.category === "nightclub",
          )
          .slice(0, 3);

  return (
    <div className="bg-bone font-[family-name:var(--font-plus-jakarta)] text-ink">
      <TonightTicker />

      {/* HERO */}
      <section className="relative h-[540px] sm:h-[620px] lg:h-[720px]">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={HERO_IMAGE}
            alt={HERO_ALT}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.18) 30%, rgba(27,28,28,0.94) 100%)",
            }}
          />
        </div>
        <div className="relative z-10 h-full max-w-screen-2xl mx-auto px-6 sm:px-10 pb-16 sm:pb-20 lg:pb-24 flex flex-col justify-end">
          <div className="max-w-[680px] lg:max-w-[62%]">
            <div className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.22em] uppercase text-saffron">
              The Philippines · we argued about every one
            </div>
            <h1 className="mt-4 font-[family-name:var(--font-noto-serif)] text-white font-black tracking-[-0.045em] leading-[0.9] text-[44px] sm:text-[76px] lg:text-[104px]">
              Where the Philippines{" "}
              <span className="italic text-saffron">eats, drinks</span>,
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              and stays out late.
            </h1>
            <p className="mt-5 sm:mt-6 text-white/80 text-[14px] sm:text-[15px] leading-[1.5] max-w-[540px]">
              <span className="text-white font-semibold">Manila, live today.</span>{" "}
              <span className="text-white/65">Cebu, Boracay, Siargao — coming 2026.</span>
            </p>
            <div className="mt-7 sm:mt-9 flex flex-wrap items-center gap-4 sm:gap-5">
              <Link
                href="/cities"
                className="inline-flex items-center gap-3 pl-7 pr-8 py-[18px] sm:py-5 rounded-[10px] bg-white/95 text-ink text-[15px] sm:text-[16px] font-extrabold tracking-[0.01em] hover:bg-saffron transition-colors shadow-[0_14px_36px_rgba(0,0,0,0.32),0_4px_10px_rgba(0,0,0,0.18)]"
                style={{ backdropFilter: "blur(8px)" }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 20 }}
                >
                  explore
                </span>
                Explore the Philippines
                <span className="ml-1 text-[18px] leading-none">→</span>
              </Link>
              <Link
                href="/manila"
                className="inline-flex items-center gap-1.5 text-white/85 text-[13.5px] sm:text-[14px] font-extrabold tracking-[0.02em] hover:text-saffron transition-colors underline-offset-[6px] decoration-2 hover:underline"
              >
                or start in Manila
                <span className="text-[16px] leading-none">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 01 · TONIGHT */}
      <NumberedSection
        id="tonight"
        numeral="01"
        eyebrow={<TonightEyebrow />}
        title="Tonight."
        pullquote="Thursday is the real Friday. Here's where to prove it."
        action={{ href: "/discover?open=1", label: "Every place open now →" }}
      >
        <FeaturedGrid>
          <TallHeroCard venue={tonight[0]} />
          <StackedSupporting>
            {tonight[1] && <WideCard venue={tonight[1]} />}
            {tonight[2] && <WideCard venue={tonight[2]} />}
          </StackedSupporting>
        </FeaturedGrid>
      </NumberedSection>

      {/* 02 · EDITORS' PICKS */}
      <NumberedSection
        numeral="02"
        eyebrow="This week"
        title="The editors picked these."
        pullquote="Three spots we'd send our best friend to — tonight, tomorrow, Saturday."
        action={{ href: "/discover", label: "Read every pick →" }}
      >
        <FeaturedGrid>
          <TallHeroCard venue={editorPicks[0]} />
          <StackedSupporting>
            {editorPicks[1] && <WideCard venue={editorPicks[1]} />}
            {editorPicks[2] && <WideCard venue={editorPicks[2]} />}
          </StackedSupporting>
        </FeaturedGrid>
      </NumberedSection>

      {/* 03 · THE CANON */}
      <NumberedSection
        numeral="03"
        eyebrow="The canon"
        title="Ranked lists, argued over."
        pullquote="Ranked by the algorithm. Argued over by the editors. No one paid to be here."
        action={{ href: "/best", label: "All eight lists →" }}
      >
        <FeaturedGrid>
          <ListHeroCard list={lists[0]} />
          <StackedSupporting>
            {lists[1] && <ListWideCard list={lists[1]} />}
            {lists[2] && <ListWideCard list={lists[2]} />}
          </StackedSupporting>
        </FeaturedGrid>
      </NumberedSection>

      {/* NEWSLETTER */}
      <section className="px-4 sm:px-8 lg:px-10 pb-[88px] sm:pb-[104px] pt-6 sm:pt-10">
        <div className="max-w-screen-2xl mx-auto rounded-[12px] bg-ink text-white p-8 sm:p-12 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div className="max-w-[540px]">
            <div className="text-[10px] font-extrabold tracking-[0.22em] uppercase text-saffron mb-3">
              Monday briefing
            </div>
            <h3 className="font-[family-name:var(--font-noto-serif)] text-[34px] sm:text-[44px] lg:text-[48px] font-black tracking-[-0.03em] leading-[0.95]">
              Three places.<br />
              <span className="italic text-saffron">Every Monday.</span>
            </h3>
            <p className="mt-4 text-white/70 text-[14px] sm:text-[15px] leading-[1.5] max-w-[440px]">
              Monday morning, over your first coffee. No filler. Unsubscribe anytime.
            </p>
          </div>
          <form className="flex gap-2 flex-1 lg:max-w-[440px]">
            <input
              type="email"
              required
              placeholder="you@company.com"
              className="flex-1 px-5 py-[18px] rounded-[8px] border border-white/20 bg-white/10 text-white placeholder:text-white/45 text-[14.5px] outline-none focus:border-saffron/70 transition-colors"
            />
            <button
              type="submit"
              className="px-6 rounded-[8px] bg-saffron text-ink text-[13.5px] font-extrabold tracking-[0.02em] hover:brightness-95 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

// ─── Numbered section template ───────────────────────────────────────

function NumberedSection({
  id,
  numeral,
  eyebrow,
  title,
  pullquote,
  action,
  children,
}: {
  id?: string;
  numeral: string;
  eyebrow: React.ReactNode;
  title: string;
  pullquote?: string;
  action?: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="relative scroll-mt-16 py-[72px] sm:py-[88px]">
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="relative">
          {/* Numeral — layered behind, slightly off-axis for intentional imperfection */}
          <div
            aria-hidden
            className="numeral absolute select-none pointer-events-none"
            style={{
              top: "-0.12em",
              left: "-0.045em",
              zIndex: 0,
            }}
          >
            {numeral}
          </div>

          {/* Content — overlaps the numeral's right edge on desktop */}
          <div className="relative z-10 pt-[88px] sm:pt-[120px] lg:pt-4 lg:pl-[172px] xl:pl-[200px]">
            <div className="text-[11px] font-extrabold tracking-[0.22em] uppercase text-terra">
              {eyebrow}
            </div>
            <h2 className="mt-3 font-[family-name:var(--font-noto-serif)] text-ink font-black tracking-[-0.035em] leading-[0.92] text-[38px] sm:text-[52px] lg:text-[60px]">
              {title}
            </h2>
            {pullquote && (
              <p className="mt-5 sm:mt-6 font-[family-name:var(--font-noto-serif)] italic font-medium text-ink text-[17px] sm:text-[20px] lg:text-[22px] leading-[1.32] max-w-[680px]">
                &ldquo;{pullquote}&rdquo;
              </p>
            )}
            <div className="mt-7 sm:mt-8">{children}</div>
            {action && (
              <div className="mt-7 sm:mt-8">
                <Link
                  href={action.href}
                  className="inline-flex items-center gap-1.5 text-terra font-extrabold text-[13.5px] tracking-[0.02em] hover:underline underline-offset-[6px] decoration-2"
                >
                  {action.label}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function TonightEyebrow() {
  const d = new Date();
  const day = d
    .toLocaleString("en-US", { weekday: "long" })
    .toUpperCase();
  const month = d
    .toLocaleString("en-US", { month: "short" })
    .toUpperCase();
  return (
    <>
      Tonight · {day}, {month} {d.getDate()}
    </>
  );
}

// ─── Layout shells ───────────────────────────────────────────────────

function FeaturedGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-4 sm:gap-5 lg:gap-5">
      {children}
    </div>
  );
}

function StackedSupporting({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-3 lg:gap-4">{children}</div>;
}

// ─── Venue cards ─────────────────────────────────────────────────────

function TallHeroCard({ venue }: { venue?: VenueWithTags }) {
  if (!venue) return null;
  return (
    <Link
      href={`/venue/${venue.slug}`}
      className="group relative block rounded-[12px] overflow-hidden aspect-[4/5] lg:aspect-auto lg:h-[620px] shadow-[0_10px_28px_rgba(0,0,0,0.14)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.22)] transition-shadow duration-200"
    >
      {venue.featured_photo_url ? (
        <Image
          src={venue.featured_photo_url}
          alt={venue.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          sizes="(max-width: 1024px) 100vw, 65vw"
        />
      ) : (
        <div className="absolute inset-0 bg-surface-high" />
      )}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.92) 100%)",
        }}
      />
      {venue.best_score != null && (
        <div className="absolute top-5 left-5 px-2.5 py-1.5 rounded-[8px] bg-white/95 backdrop-blur-sm inline-flex items-center gap-2">
          <span className="font-[family-name:var(--font-noto-serif)] text-[22px] font-black text-terra leading-none">
            {Math.round(venue.best_score)}
          </span>
          <span className="text-[8.5px] font-extrabold tracking-[0.18em] uppercase text-outline leading-tight">
            Best
            <br />
            Score
          </span>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10">
        <div className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.22em] uppercase text-white/80">
          {cuisine(venue)}
          {venue.neighborhood_name ? ` · ${venue.neighborhood_name}` : ""}
        </div>
        <h3 className="mt-2.5 font-[family-name:var(--font-noto-serif)] text-white font-black tracking-[-0.03em] leading-[0.92] text-[34px] sm:text-[48px] lg:text-[60px]">
          {venue.name}
        </h3>
        {venue.short_description && (
          <p className="mt-4 max-w-[540px] font-[family-name:var(--font-noto-serif)] italic font-medium text-white/90 text-[15px] sm:text-[18px] leading-[1.42] line-clamp-3">
            &ldquo;{venue.short_description}&rdquo;
          </p>
        )}
      </div>
    </Link>
  );
}

function WideCard({ venue }: { venue: VenueWithTags }) {
  return (
    <Link
      href={`/venue/${venue.slug}`}
      className="group relative block rounded-[10px] overflow-hidden bg-white shadow-[0_4px_14px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_26px_rgba(0,0,0,0.14)] transition-shadow duration-200"
    >
      <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] lg:grid-cols-1 lg:grid-rows-[180px_auto]">
        <div className="relative overflow-hidden bg-surface-high h-full lg:h-[180px]">
          {venue.featured_photo_url && (
            <Image
              src={venue.featured_photo_url}
              alt={venue.name}
              fill
              className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
              sizes="(max-width: 1024px) 180px, 360px"
            />
          )}
          {venue.best_score != null && (
            <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-[5px] bg-terra text-white text-[11px] font-black shadow-sm">
              {Math.round(venue.best_score)}
            </span>
          )}
        </div>
        <div className="p-4 lg:p-4 flex flex-col justify-center">
          <div className="text-[9.5px] font-extrabold tracking-[0.2em] uppercase text-outline">
            {cuisine(venue)}
            {venue.neighborhood_name ? ` · ${venue.neighborhood_name}` : ""}
          </div>
          <h4 className="mt-1.5 font-[family-name:var(--font-noto-serif)] text-ink font-extrabold tracking-[-0.015em] leading-[1.08] text-[17px] sm:text-[19px] line-clamp-2">
            {venue.name}
          </h4>
          <div className="mt-1.5 flex items-center gap-2 text-[11.5px] text-secondary">
            {venue.google_rating != null && (
              <span className="flex items-center gap-1 text-ink font-extrabold">
                <StarIcon /> {venue.google_rating.toFixed(1)}
              </span>
            )}
            {venue.price_level && (
              <>
                <span className="text-outline-variant">·</span>
                <span className="font-semibold">
                  {getPriceSymbol(venue.price_level)}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── List cards ──────────────────────────────────────────────────────

function ListHeroCard({
  list,
}: {
  list?: { slug: string; title: string; venue_count: number; description: string | null };
}) {
  if (!list) return null;
  return (
    <Link
      href={`/best/${list.slug}`}
      className="group relative block rounded-[12px] overflow-hidden aspect-[4/5] lg:aspect-auto lg:h-[620px] shadow-[0_10px_28px_rgba(0,0,0,0.14)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.22)] transition-shadow duration-200"
    >
      <Image
        src={coverFor(list.slug)}
        alt={list.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        sizes="(max-width: 1024px) 100vw, 65vw"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 38%, rgba(0,0,0,0.94) 100%)",
        }}
      />
      <span className="absolute top-5 right-5 px-3 py-1.5 rounded-full bg-saffron text-ink text-[10.5px] font-black tracking-[0.2em] uppercase">
        Top {list.venue_count}
      </span>
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10">
        <div className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.22em] uppercase text-white/80">
          This month&apos;s argument
        </div>
        <h3 className="mt-2.5 font-[family-name:var(--font-noto-serif)] text-white font-black tracking-[-0.03em] leading-[0.92] text-[34px] sm:text-[48px] lg:text-[60px]">
          {list.title}
        </h3>
        {list.description && (
          <p className="mt-4 max-w-[540px] font-[family-name:var(--font-noto-serif)] italic font-medium text-white/88 text-[15px] sm:text-[18px] leading-[1.42] line-clamp-3">
            &ldquo;{list.description}&rdquo;
          </p>
        )}
      </div>
    </Link>
  );
}

function ListWideCard({
  list,
}: {
  list: { slug: string; title: string; venue_count: number };
}) {
  return (
    <Link
      href={`/best/${list.slug}`}
      className="group relative block rounded-[10px] overflow-hidden bg-white shadow-[0_4px_14px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_26px_rgba(0,0,0,0.14)] transition-shadow duration-200"
    >
      <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] lg:grid-cols-1 lg:grid-rows-[180px_auto]">
        <div className="relative overflow-hidden bg-surface-high h-full lg:h-[180px]">
          <Image
            src={coverFor(list.slug)}
            alt={list.title}
            fill
            className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
            sizes="(max-width: 1024px) 180px, 360px"
          />
          <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-[5px] bg-white/95 text-terra text-[10px] font-black tracking-[0.06em]">
            TOP {list.venue_count}
          </span>
        </div>
        <div className="p-4 flex flex-col justify-center">
          <div className="text-[9.5px] font-extrabold tracking-[0.2em] uppercase text-outline">
            The Manila canon
          </div>
          <h4 className="mt-1.5 font-[family-name:var(--font-noto-serif)] text-ink font-extrabold tracking-[-0.015em] leading-[1.08] text-[17px] sm:text-[19px] line-clamp-2">
            {list.title}
          </h4>
        </div>
      </div>
    </Link>
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
