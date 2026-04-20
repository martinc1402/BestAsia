import Image from "next/image";
import Link from "next/link";
import {
  getCuratedListsWithCounts,
  getDiscoverVenues,
  getTopVenues,
} from "@/lib/queries";
import type { VenueWithTags } from "@/lib/types";
import TonightTicker from "@/components/TonightTicker";

// Unsplash License (free for commercial use, attribution optional).
// Shot: Makati/BGC skyline at dusk — the recognizable high-rise spine
// that reads as Manila at a glance (the prior bar/bottles shots were
// location-agnostic). Iterate toward a licensed street-level Poblacion
// or jeepney shot when the photo library is ready.
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1800&q=85&auto=format&fit=crop";
const HERO_ALT =
  "Makati skyline at dusk — the financial capital, Metro Manila, Philippines";

// Masthead — bumps monthly, published the first Thursday.
// TODO: move to a CMS / DB field once editorial workflow is wired.
const ISSUE_NUMBER = "016";
const ISSUE_DATE = "Apr 20, 2026";

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

      {/* HERO — min-h + padding-top (NOT fixed height + flex-end) so headline
          overflow can never push content UP past the section top into the ticker. */}
      <section className="relative min-h-[580px] sm:min-h-[660px] lg:min-h-[760px] overflow-hidden">
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
        {/* Issue number — editorial corner detail */}
        <div className="absolute top-5 right-6 sm:right-10 z-10 hidden sm:block">
          <div className="font-mono text-[10px] sm:text-[11px] tracking-[0.18em] uppercase text-white/70 text-right">
            <div>
              Issue <span className="text-saffron font-semibold">{ISSUE_NUMBER}</span>
            </div>
            <div className="text-white/50 mt-0.5">{ISSUE_DATE}</div>
          </div>
        </div>

        <div className="relative z-10 max-w-screen-2xl mx-auto px-6 sm:px-10 pt-44 sm:pt-56 lg:pt-72 pb-16 sm:pb-20 lg:pb-24">
          <div className="max-w-[680px] lg:max-w-[62%]">
            <div className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.22em] uppercase text-saffron">
              The Philippines · we argue about every place
            </div>
            <h1 className="mt-4 font-[family-name:var(--font-noto-serif)] text-white font-black tracking-[-0.045em] leading-[0.9] text-[44px] sm:text-[80px] lg:text-[112px]">
              Where the Philippines{" "}
              <span className="italic text-saffron">drinks</span>
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              and stays out late.
            </h1>
            <p className="mt-5 sm:mt-6 text-white/80 text-[14px] sm:text-[15px] leading-[1.5] max-w-[540px]">
              <span className="text-white font-semibold">Manila, live today.</span>{" "}
              <span className="text-white/65">
                <span className="text-teal-soft font-semibold">Cebu</span>,{" "}
                <span className="text-teal-soft font-semibold">Boracay</span>,{" "}
                <span className="text-teal-soft font-semibold">Siargao</span> —
                coming 2026.
              </span>
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
                className="inline-flex items-center gap-1.5 text-coral text-[13.5px] sm:text-[14px] font-extrabold tracking-[0.02em] hover:text-saffron transition-colors underline-offset-[6px] decoration-2 hover:underline"
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
          <TallHeroCard venue={tonight[0]} pickLabel="Tonight's pick" />
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
        eyebrowTone="teal"
        title="The editors picked these."
        pullquote="Three places worth leaving the house for. Tonight, tomorrow, Saturday. No filler, no favors."
        action={{ href: "/discover", label: "Every pick, fully argued →" }}
      >
        <FeaturedGrid>
          <TallHeroCard venue={editorPicks[0]} pickLabel="Editor's pick" />
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
        <div className="paper-grain max-w-screen-2xl mx-auto rounded-[12px] bg-volcanic text-white p-8 sm:p-12 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div className="max-w-[540px] relative z-[1]">
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
          <form className="flex gap-2 flex-1 lg:max-w-[440px] relative z-[1]">
            <input
              type="email"
              required
              placeholder="you@company.com"
              className="flex-1 px-5 py-[18px] rounded-[8px] border border-white/20 bg-white/10 text-white placeholder:text-white/45 text-[14.5px] outline-none focus:border-saffron transition-colors"
            />
            <button
              type="submit"
              className="px-6 rounded-[8px] bg-saffron text-volcanic text-[13.5px] font-extrabold tracking-[0.02em] hover:bg-coral hover:text-white transition-colors duration-200"
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
  eyebrowTone = "terra",
  title,
  pullquote,
  action,
  children,
}: {
  id?: string;
  numeral: string;
  eyebrow: React.ReactNode;
  eyebrowTone?: "terra" | "teal" | "coral";
  title: string;
  pullquote?: string;
  action?: { href: string; label: string };
  children: React.ReactNode;
}) {
  const eyebrowColor =
    eyebrowTone === "teal"
      ? "text-teal"
      : eyebrowTone === "coral"
        ? "text-coral"
        : "text-terra";
  const actionColor =
    eyebrowTone === "teal"
      ? "text-teal hover:text-coral"
      : "text-terra hover:text-coral";
  return (
    <section
      id={id}
      className="paper-grain relative scroll-mt-16 py-[72px] sm:py-[88px] overflow-hidden border-t border-teal/35"
    >
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="relative">
          {/* Numeral — layered behind, bleeds off the left edge on desktop
              so content can genuinely overlap its right-hand curves */}
          <div
            aria-hidden
            className="numeral absolute select-none pointer-events-none"
            style={{
              top: "-0.14em",
              left: "clamp(-72px, -4.5vw, -20px)",
              zIndex: 0,
            }}
          >
            {numeral}
          </div>

          {/* Content — overlaps the numeral's right edge on desktop */}
          <div className="relative z-10 pt-[108px] sm:pt-[152px] lg:pt-6 lg:pl-[160px] xl:pl-[200px]">
            <div className={`text-[11px] font-extrabold tracking-[0.22em] uppercase ${eyebrowColor}`}>
              {eyebrow}
            </div>
            <h2 className="mt-3 font-[family-name:var(--font-noto-serif)] text-ink font-black tracking-[-0.035em] leading-[0.92] text-[38px] sm:text-[52px] lg:text-[60px]">
              {title}
            </h2>
            {pullquote && (
              <p className="mt-5 sm:mt-6 font-[family-name:var(--font-noto-serif)] italic font-medium text-ink text-[17px] sm:text-[20px] lg:text-[22px] leading-[1.32] max-w-[680px] pl-4 border-l-2 border-teal">
                {pullquote}
              </p>
            )}
            <div className="mt-7 sm:mt-8">{children}</div>
            {action && (
              <div className="mt-7 sm:mt-8">
                <Link
                  href={action.href}
                  className={`inline-flex items-center gap-1.5 font-extrabold text-[13.5px] tracking-[0.02em] transition-colors underline-offset-[6px] decoration-2 hover:underline ${actionColor}`}
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

function TallHeroCard({
  venue,
  pickLabel = "Editor's pick",
}: {
  venue?: VenueWithTags;
  pickLabel?: string;
}) {
  if (!venue) return null;
  const score = venue.best_score != null ? Math.round(venue.best_score) : null;
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

      {/* Editor's pick — top-left */}
      <span className="absolute top-5 left-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-saffron text-volcanic text-[10px] font-black tracking-[0.22em] uppercase shadow-sm">
        <Sparkle /> {pickLabel}
      </span>

      {/* Best Score — top-right, large, treated like the product it is */}
      {score != null && (
        <div className="absolute top-3 right-4 sm:top-4 sm:right-6 flex flex-col items-end select-none">
          <span
            className="font-[family-name:var(--font-noto-serif)] font-black text-saffron leading-[0.8] tracking-[-0.045em] text-[72px] sm:text-[96px] lg:text-[112px]"
            style={{
              textShadow: "0 4px 18px rgba(0,0,0,0.45)",
            }}
          >
            {score}
          </span>
          <span className="text-[9px] sm:text-[10px] font-extrabold tracking-[0.3em] uppercase text-white/80 -mt-1">
            Best Score · 100
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

function Sparkle() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 2l2.2 7.4L22 12l-7.8 2.6L12 22l-2.2-7.4L2 12l7.8-2.6L12 2z"
        fill="currentColor"
      />
    </svg>
  );
}

function WideCard({ venue }: { venue: VenueWithTags }) {
  const score = venue.best_score != null ? Math.round(venue.best_score) : null;
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
          {/* Larger, more prominent score in the corner */}
          {score != null && (
            <div className="absolute top-2 left-2 flex flex-col items-start leading-none">
              <span className="font-[family-name:var(--font-noto-serif)] text-saffron font-black text-[34px] leading-[0.78] tracking-[-0.04em] drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]">
                {score}
              </span>
              <span className="text-[7.5px] font-extrabold tracking-[0.22em] uppercase text-white/85 mt-0.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
                Best Score
              </span>
            </div>
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
                <PriceDots level={venue.price_level} />
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function PriceDots({ level }: { level: number }) {
  const tier: Record<number, string> = {
    1: "Budget",
    2: "Moderate",
    3: "Upscale",
    4: "Splurge",
  };
  const range: Record<number, string> = {
    1: "under ₱500 per head",
    2: "₱500–₱1,500 per head",
    3: "₱1,500–₱3,000 per head",
    4: "₱3,000+ per head",
  };
  const tooltip = `${tier[level]}: ${range[level]}`;
  // Force a font stack that guarantees the peso glyph (U+20B1) renders
  // as the peso sign rather than being substituted by a font that maps
  // the codepoint oddly. Plus Jakarta Sans supports it, but we fall
  // back to system fonts that also support it reliably.
  const pesoFont =
    "'Plus Jakarta Sans', 'SF Pro Text', 'Helvetica Neue', system-ui, sans-serif";
  return (
    <span
      className="inline-flex items-baseline gap-1.5 font-semibold"
      title={tooltip}
      aria-label={tooltip}
    >
      <span
        className="inline-flex"
        style={{
          letterSpacing: "0.04em",
          fontFamily: pesoFont,
          fontFeatureSettings: '"tnum"',
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={i <= level ? "text-ink" : "text-outline-variant"}
          >
            ₱
          </span>
        ))}
      </span>
      <span className="text-[9.5px] font-extrabold tracking-[0.22em] uppercase text-outline">
        {tier[level]}
      </span>
    </span>
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

      <span className="absolute top-5 left-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-saffron text-volcanic text-[10px] font-black tracking-[0.22em] uppercase shadow-sm">
        <Sparkle /> This month&apos;s argument
      </span>

      {/* Editorial metadata — no ambiguous big numeral. A big saffron "N"
          borrowed from the venue-card score treatment read as a rank when
          the list's title claimed "Top 10". Replaced with a dateline. */}
      <div className="absolute top-5 right-5 flex flex-col items-end select-none text-right font-mono">
        <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.18em] uppercase text-saffron">
          This month
        </span>
        <span className="mt-0.5 text-[10px] sm:text-[11px] tracking-[0.12em] uppercase text-white/70">
          {list.venue_count} {list.venue_count === 1 ? "place" : "places"}
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10">
        <h3 className="font-[family-name:var(--font-noto-serif)] text-white font-black tracking-[-0.03em] leading-[0.92] text-[34px] sm:text-[48px] lg:text-[60px]">
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
