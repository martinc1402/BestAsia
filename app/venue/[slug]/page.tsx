import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getVenueBySlug, getSimilarVenues } from "@/lib/queries";
import { getPriceSymbol, getCategorySingular } from "@/lib/utils";
import type { VenueTag, VenueWithTags } from "@/lib/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const venue = await getVenueBySlug(slug);
  if (!venue) return { title: "Venue Not Found" };
  return {
    title: `${venue.name} — ${getCategorySingular(venue.category)} in ${
      venue.neighborhood_name || "Manila"
    }`,
    description:
      venue.short_description ||
      `${venue.name} is a ${venue.category} in ${
        venue.neighborhood_name || "Manila"
      }. BestPhilippines score: ${(venue.final_score ?? 0).toFixed(1)}.`,
  };
}

const CATEGORY_PLURAL: Record<string, string> = {
  restaurant: "Restaurants",
  bar: "Bars",
  cafe: "Cafés",
  nightclub: "Nightclubs",
};

function subcategoryLabel(v: VenueWithTags): string {
  return v.subcategory || getCategorySingular(v.category);
}

function openStatus(v: VenueWithTags): { open: boolean; label: string } {
  if (v.is_24_hours) return { open: true, label: "Open 24 hours" };
  if (v.is_open_late) return { open: true, label: "Open late" };
  return { open: false, label: "Standard hours" };
}

function avgPrice(priceLevel: number | null): number {
  if (!priceLevel) return 1200;
  return priceLevel * 900 + 600;
}

export default async function VenuePage({ params }: Props) {
  const { slug } = await params;
  const venue = await getVenueBySlug(slug);
  if (!venue) notFound();

  const similar = await getSimilarVenues(venue, 4);
  const categoryPlural = CATEGORY_PLURAL[venue.category] || "Venues";
  const status = openStatus(venue);
  const price = venue.price_level ?? null;
  const rank = venue.best_score_rank ?? null;
  const perPerson = avgPrice(price);

  const topTags = (venue.tags ?? [])
    .filter((t) => t.dimension !== "budget")
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 8);

  const loveRows = [
    {
      icon: "military_tech",
      label: "BestPhilippines Score",
      value: venue.final_score != null ? venue.final_score.toFixed(1) : "—",
    },
    {
      icon: "location_on",
      label: "Neighborhood",
      value: venue.neighborhood_name ?? "Manila",
    },
    {
      icon: "schedule",
      label: "Hours",
      value: status.label,
    },
    {
      icon: "local_offer",
      label: "Avg per person",
      value: price ? `~₱${perPerson.toLocaleString()}` : "Varies",
    },
  ];

  const infoRows: [string, string | null | undefined][] = [
    ["Address", venue.address],
    ["Phone", venue.phone],
    ["Hours", status.label],
    ["Reservations", "Recommended"],
    ["Website", venue.website?.replace(/^https?:\/\//, "").replace(/\/$/, "") ?? null],
    ["Instagram", venue.instagram ? `@${venue.instagram}` : null],
  ];

  return (
    <div className="bg-bone font-[family-name:var(--font-plus-jakarta)] text-ink">
      {/* Breadcrumb (desktop) */}
      <nav className="hidden lg:block max-w-screen-2xl mx-auto px-10 pt-5 text-[11.5px] text-secondary">
        <Link href="/manila" className="hover:text-ink transition-colors">
          Manila
        </Link>
        <span className="text-outline-variant mx-2">›</span>
        <Link
          href={`/manila/${venue.category}s`}
          className="hover:text-ink transition-colors"
        >
          {categoryPlural}
        </Link>
        {venue.neighborhood_name && (
          <>
            <span className="text-outline-variant mx-2">›</span>
            <span>{venue.neighborhood_name}</span>
          </>
        )}
        <span className="text-outline-variant mx-2">›</span>
        <span className="text-ink font-bold">{venue.name}</span>
      </nav>

      {/* Title row */}
      <section className="max-w-screen-2xl mx-auto px-5 sm:px-8 lg:px-10 pt-5 sm:pt-6 lg:pt-3 pb-4 sm:pb-5">
        <div className="flex items-end justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.22em] uppercase text-terra">
              {rank ? `#${rank} · ` : ""}
              {subcategoryLabel(venue)}
              {venue.neighborhood_name ? ` in ${venue.neighborhood_name}` : ""}
            </div>
            <h1 className="mt-2 font-[family-name:var(--font-noto-serif)] font-black text-ink tracking-[-0.035em] leading-[0.95] text-[32px] sm:text-[44px] lg:text-[58px]">
              {venue.name}
            </h1>
            <div className="mt-3 flex items-center flex-wrap gap-x-3 gap-y-2 text-[12.5px] sm:text-[13.5px] font-semibold text-ink">
              {venue.final_score != null && (
                <BestScoreBadge score={venue.final_score} />
              )}
              {venue.google_rating != null && (
                <span className="flex items-center gap-1">
                  <StarIcon />
                  <span className="font-extrabold">
                    {venue.google_rating.toFixed(1)}
                  </span>
                  {venue.google_review_count != null && (
                    <span className="text-outline font-medium">
                      ({venue.google_review_count.toLocaleString()})
                    </span>
                  )}
                </span>
              )}
              {price && (
                <>
                  <span className="text-outline-variant">·</span>
                  <PriceDots level={price} />
                </>
              )}
              <span className="text-outline-variant">·</span>
              <span
                className={`flex items-center gap-1.5 font-bold text-[12px] ${
                  status.open ? "text-[#2A7F2A]" : "text-secondary"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    status.open ? "bg-[#2A7F2A]" : "bg-outline"
                  }`}
                />
                {status.label}
              </span>
            </div>
          </div>
          <div className="hidden sm:flex gap-2 shrink-0">
            <button
              type="button"
              className="px-3.5 py-2.5 rounded-[10px] border border-outline-variant bg-white text-ink text-[12.5px] font-bold flex items-center gap-1.5 hover:border-ink transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                share
              </span>
              Share
            </button>
            <button
              type="button"
              className="px-3.5 py-2.5 rounded-[10px] border border-outline-variant bg-white text-ink text-[12.5px] font-bold flex items-center gap-1.5 hover:border-ink transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                favorite
              </span>
              Save
            </button>
          </div>
        </div>
      </section>

      {/* Photo hero */}
      <section className="max-w-screen-2xl mx-auto px-0 sm:px-8 lg:px-10">
        <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-[16/6] sm:rounded-2xl overflow-hidden bg-surface-low">
          {venue.featured_photo_url ? (
            <Image
              src={venue.featured_photo_url}
              alt={venue.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1536px) 92vw, 1440px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-outline-variant">
              <span className="material-symbols-outlined" style={{ fontSize: 56 }}>
                image
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Sticky tabs */}
      <nav className="sticky top-0 z-30 bg-bone/95 backdrop-blur border-b border-outline-variant mt-5 sm:mt-7 lg:mt-8">
        <div className="max-w-screen-2xl mx-auto px-5 sm:px-8 lg:px-10 flex gap-5 sm:gap-7 overflow-x-auto scrollbar-hide">
          {[
            { id: "overview", label: "Overview" },
            { id: "details", label: "Details" },
            { id: "reviews", label: `Reviews${venue.google_review_count ? ` · ${venue.google_review_count.toLocaleString()}` : ""}` },
            { id: "info", label: "Info" },
            ...(similar.length > 0 ? [{ id: "similar", label: "Similar" }] : []),
          ].map((t, i) => (
            <a
              key={t.id}
              href={`#${t.id}`}
              className={`shrink-0 py-3.5 border-b-2 text-[13px] sm:text-[14px] font-semibold transition-colors ${
                i === 0
                  ? "border-terra text-ink font-extrabold"
                  : "border-transparent text-secondary hover:text-ink"
              }`}
            >
              {t.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Body: 2-col on desktop */}
      <section className="max-w-screen-2xl mx-auto px-5 sm:px-8 lg:px-10 py-8 sm:py-10 lg:py-[36px] pb-28 lg:pb-20">
        <div className="grid lg:grid-cols-[1fr_380px] gap-10 lg:gap-12">
          {/* Left column */}
          <div className="min-w-0">
            {/* Overview */}
            <div id="overview">
              {(venue.short_description || venue.editorial_notes) && (
                <p className="font-[family-name:var(--font-noto-serif)] text-ink font-medium tracking-[-0.005em] leading-[1.45] text-[17px] sm:text-[20px] lg:text-[22px]">
                  {venue.editorial_notes || venue.short_description}
                </p>
              )}

              {venue.editorial_notes && venue.short_description && (
                <div className="relative mt-6 sm:mt-7 p-5 sm:p-[20px_22px] rounded-[14px] bg-terra-light">
                  <span className="absolute -top-[10px] left-[18px] px-2 sm:px-2.5 py-[3px] rounded bg-terra text-white text-[9.5px] sm:text-[10px] font-black tracking-[0.2em]">
                    EDITOR&apos;S NOTE
                  </span>
                  <p className="text-[13px] sm:text-[14px] text-terra-text leading-[1.55]">
                    {venue.short_description}
                  </p>
                </div>
              )}

              {topTags.length > 0 && (
                <div className="mt-6 sm:mt-7 flex flex-wrap gap-1.5">
                  {topTags.map((t) => (
                    <TagPill key={t.tag_id} tag={t} />
                  ))}
                </div>
              )}
            </div>

            {/* Details grid */}
            <div id="details" className="mt-10 sm:mt-11 scroll-mt-20">
              <h3 className="font-[family-name:var(--font-noto-serif)] text-[24px] sm:text-[28px] font-black text-ink tracking-[-0.02em] mb-5">
                What you&apos;ll love
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {loveRows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center gap-3 p-4 rounded-[12px] border border-outline-variant bg-white"
                  >
                    <div className="w-[38px] h-[38px] rounded-[10px] bg-terra-light text-terra flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#A83900" }}>
                        {row.icon}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-outline">
                        {row.label}
                      </div>
                      <div className="mt-0.5 text-[13.5px] font-bold text-ink truncate">
                        {row.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div id="reviews" className="mt-10 sm:mt-11 scroll-mt-20">
              <h3 className="font-[family-name:var(--font-noto-serif)] text-[24px] sm:text-[28px] font-black text-ink tracking-[-0.02em] mb-5">
                What guests say
              </h3>
              {venue.google_rating != null ? (
                <div className="p-5 sm:p-6 rounded-[14px] border border-outline-variant bg-white flex flex-col sm:flex-row gap-6 sm:gap-8">
                  <div className="text-center sm:border-r sm:border-outline-variant/60 sm:pr-8 shrink-0">
                    <div className="font-[family-name:var(--font-noto-serif)] text-[48px] sm:text-[64px] font-black text-ink tracking-[-0.04em] leading-none">
                      {venue.google_rating.toFixed(1)}
                    </div>
                    <div className="mt-1.5 flex justify-center gap-[2px]">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <StarIcon
                          key={i}
                          size={13}
                          muted={i > Math.round(venue.google_rating ?? 0)}
                        />
                      ))}
                    </div>
                    {venue.google_review_count != null && (
                      <div className="mt-1.5 text-[11px] text-secondary">
                        {venue.google_review_count.toLocaleString()} Google reviews
                      </div>
                    )}
                  </div>
                  <ScoreTransparencyBlock finalScore={venue.final_score} />
                </div>
              ) : (
                <div className="p-5 rounded-[14px] bg-surface-low text-secondary text-[13px]">
                  No reviews yet — be the first.
                </div>
              )}
            </div>

            {/* Info */}
            <div id="info" className="mt-10 sm:mt-11 scroll-mt-20">
              <h3 className="font-[family-name:var(--font-noto-serif)] text-[24px] sm:text-[28px] font-black text-ink tracking-[-0.02em] mb-5">
                The details
              </h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                {infoRows
                  .filter(([, v]) => v)
                  .map(([label, value], i, arr) => (
                    <div
                      key={label}
                      className={`py-4 ${
                        i < arr.length - (arr.length % 2 === 0 ? 2 : 1)
                          ? "border-b border-outline-variant/60"
                          : "sm:border-b sm:border-outline-variant/60"
                      }`}
                    >
                      <dt className="text-[10px] font-extrabold tracking-[0.18em] uppercase text-outline">
                        {label}
                      </dt>
                      <dd className="mt-1 text-[13.5px] text-ink font-semibold leading-[1.4]">
                        {label === "Website" && value ? (
                          <a
                            href={venue.website ?? "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-terra hover:underline break-all"
                          >
                            {value}
                          </a>
                        ) : label === "Phone" && value ? (
                          <a
                            href={`tel:${value}`}
                            className="text-terra hover:underline"
                          >
                            {value}
                          </a>
                        ) : label === "Instagram" && value ? (
                          <a
                            href={`https://instagram.com/${venue.instagram}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-terra hover:underline"
                          >
                            {value}
                          </a>
                        ) : (
                          value
                        )}
                      </dd>
                    </div>
                  ))}
              </dl>
            </div>

            {/* Similar */}
            {similar.length > 0 && (
              <div id="similar" className="mt-10 sm:mt-11 scroll-mt-20">
                <h3 className="font-[family-name:var(--font-noto-serif)] text-[24px] sm:text-[28px] font-black text-ink tracking-[-0.02em] mb-5">
                  Similar spots
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
                  {similar.map((v) => (
                    <SimilarCard key={v.id} venue={v} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-[14px] border border-outline-variant bg-white p-6 shadow-[0_6px_16px_rgba(0,0,0,0.05)]">
                <div className="font-[family-name:var(--font-noto-serif)] text-[22px] font-black text-ink tracking-[-0.02em]">
                  Reserve a table
                </div>
                <div className="mt-1 text-[12px] text-secondary">
                  {price ? `~₱${perPerson.toLocaleString()}/person · ` : ""}
                  {status.label}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {[
                    ["Date", "Tonight"],
                    ["Time", "8:00 PM"],
                  ].map(([l, v]) => (
                    <div
                      key={l}
                      className="p-2.5 rounded-[9px] border border-outline-variant"
                    >
                      <div className="text-[9.5px] font-extrabold tracking-[0.15em] uppercase text-outline">
                        {l}
                      </div>
                      <div className="mt-0.5 text-[13px] font-bold text-ink">
                        {v}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 p-2.5 rounded-[9px] border border-outline-variant">
                  <div className="text-[9.5px] font-extrabold tracking-[0.15em] uppercase text-outline">
                    Party size
                  </div>
                  <div className="mt-0.5 text-[13px] font-bold text-ink">
                    2 guests
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-4 w-full py-3.5 rounded-[11px] bg-terra text-white text-[14px] font-extrabold shadow-[0_6px_14px_rgba(168,57,0,0.3)] hover:brightness-95 transition"
                >
                  Reserve →
                </button>
                {venue.phone ? (
                  <a
                    href={`tel:${venue.phone}`}
                    className="block mt-2 text-center py-3 rounded-[11px] border border-ink bg-white text-ink text-[13px] font-extrabold hover:bg-ink hover:text-white transition-colors"
                  >
                    Call {venue.name}
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="mt-2 w-full py-3 rounded-[11px] border border-outline-variant bg-white text-outline text-[13px] font-extrabold"
                  >
                    No phone on file
                  </button>
                )}
              </div>

              {/* Mini map */}
              <MiniMapCard venue={venue} />
            </div>
          </aside>
        </div>
      </section>

      {/* Sticky mobile reserve bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-outline-variant px-4 py-3 flex items-center gap-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <div className="flex-1 min-w-0">
          <div className="font-[family-name:var(--font-noto-serif)] text-[15px] font-extrabold text-ink tracking-[-0.01em] truncate">
            {price ? `${getPriceSymbol(price)} · ` : ""}
            {subcategoryLabel(venue)}
          </div>
          <div className="text-[11px] text-secondary mt-0.5 truncate">
            {status.label}
            {venue.neighborhood_name ? ` · ${venue.neighborhood_name}` : ""}
          </div>
        </div>
        {venue.phone && (
          <a
            href={`tel:${venue.phone}`}
            className="shrink-0 px-4 py-2.5 rounded-[10px] border border-ink bg-white text-ink text-[12.5px] font-extrabold"
          >
            Call
          </a>
        )}
        <button
          type="button"
          className="shrink-0 px-4 py-2.5 rounded-[10px] bg-terra text-white text-[13px] font-extrabold shadow-[0_3px_10px_rgba(168,57,0,0.3)]"
        >
          Reserve →
        </button>
      </div>
    </div>
  );
}

function BestScoreBadge({ score }: { score: number | null }) {
  if (score == null) return null;
  return (
    <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-[10px] bg-white border border-outline-variant">
      <span className="font-[family-name:var(--font-noto-serif)] text-[18px] font-black text-terra leading-none">
        {score.toFixed(1)}
      </span>
      <span className="text-[8.5px] font-extrabold tracking-[0.18em] uppercase text-outline leading-tight">
        Best
        <br />
        Score
      </span>
    </div>
  );
}

function formatBoost(n: number): string {
  return `${n >= 0 ? "+" : ""}${n.toFixed(1)}`;
}

function ScoreTransparencyBlock({
  finalScore,
}: {
  finalScore: number | null;
}) {
  if (finalScore == null) {
    return (
      <div className="flex-1 flex items-center text-[12.5px] text-secondary">
        Not yet scored.
      </div>
    );
  }

  const algorithmic = finalScore;
  const boost = 0.0;

  return (
    <div className="flex-1 flex flex-col justify-center">
      <div className="text-[10px] font-extrabold tracking-[0.22em] uppercase text-outline mb-3">
        BestPhilippines Score
      </div>
      <div className="space-y-2 text-[13px]">
        <div className="flex items-center justify-between">
          <span className="text-secondary">Algorithmic</span>
          <span className="font-extrabold text-ink tabular-nums">
            {algorithmic.toFixed(1)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-secondary">Editorial adjustment</span>
          <span className="font-extrabold text-ink tabular-nums">
            {formatBoost(boost)}
          </span>
        </div>
        <div className="flex items-center justify-between pt-2.5 border-t border-outline-variant/60">
          <span className="font-bold text-ink">BestPhilippines</span>
          <span className="font-[family-name:var(--font-noto-serif)] font-black text-terra text-[22px] leading-none tabular-nums">
            {finalScore.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}

function PriceDots({ level }: { level: number }) {
  return (
    <span className="inline-flex items-baseline gap-[1px] font-semibold">
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={i <= level ? "text-ink" : "text-outline-variant"}
        >
          ₱
        </span>
      ))}
    </span>
  );
}

function StarIcon({ size = 12, muted = false }: { size?: number; muted?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"
        fill={muted ? "#E4BEB1" : "#FABD00"}
      />
    </svg>
  );
}

const TAG_COLORS: Record<string, string> = {
  occasion: "bg-tag-occasion-bg text-tag-occasion-text",
  vibe: "bg-tag-vibe-bg text-tag-vibe-text",
  cuisine: "bg-tag-cuisine-bg text-tag-cuisine-text",
  practical: "bg-tag-practical-bg text-tag-practical-text",
  budget: "bg-tag-budget-bg text-tag-budget-text",
  highlight: "bg-tag-highlight-bg text-tag-highlight-text",
};

function TagPill({ tag }: { tag: VenueTag }) {
  const cls = TAG_COLORS[tag.dimension] ?? "bg-surface-low text-secondary";
  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${cls}`}>
      {tag.display_name}
    </span>
  );
}

function SimilarCard({ venue }: { venue: VenueWithTags }) {
  return (
    <Link
      href={`/venue/${venue.slug}`}
      className="group block rounded-[14px] overflow-hidden bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)] transition-shadow"
    >
      <div className="relative aspect-[4/3] bg-surface-low overflow-hidden">
        {venue.featured_photo_url && (
          <Image
            src={venue.featured_photo_url}
            alt={venue.name}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
            sizes="(max-width: 1024px) 50vw, 25vw"
          />
        )}
        {venue.final_score != null && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-[6px] bg-terra text-white text-[11px] font-black">
            {venue.final_score.toFixed(1)}
          </span>
        )}
      </div>
      <div className="p-3">
        <div className="text-[9.5px] font-extrabold tracking-[0.18em] uppercase text-outline truncate">
          {venue.subcategory || getCategorySingular(venue.category)}
          {venue.neighborhood_name ? ` · ${venue.neighborhood_name}` : ""}
        </div>
        <div className="mt-1 font-[family-name:var(--font-noto-serif)] text-[15px] font-extrabold text-ink leading-[1.15] tracking-[-0.01em] line-clamp-2">
          {venue.name}
        </div>
      </div>
    </Link>
  );
}

function MiniMapCard({ venue }: { venue: VenueWithTags }) {
  return (
    <div className="rounded-[14px] border border-outline-variant bg-white overflow-hidden">
      <div className="relative h-[140px] bg-[#E8EDE2]">
        <svg viewBox="0 0 380 140" className="absolute inset-0 w-full h-full">
          <defs>
            <pattern id="miniGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="380" height="140" fill="#E8EDE2" />
          <rect width="380" height="140" fill="url(#miniGrid)" />
          <path d="M 0 70 Q 190 50 380 80" fill="none" stroke="#fff" strokeWidth="5" />
          <path d="M 170 0 L 190 140" fill="none" stroke="#fff" strokeWidth="4" />
        </svg>
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full px-3 py-1.5 rounded-full bg-terra text-white text-[11px] font-extrabold shadow-[0_6px_14px_rgba(0,0,0,0.25)] flex items-center gap-1.5 whitespace-nowrap"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 12 }}>
            location_on
          </span>
          {venue.name}
        </div>
      </div>
      <div className="p-4">
        <div className="text-[13px] font-bold text-ink">
          {venue.address || `${venue.neighborhood_name ?? ""} — Manila`}
        </div>
        {venue.latitude != null && venue.longitude != null && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${venue.latitude},${venue.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-1.5 text-[11.5px] text-terra font-bold"
          >
            Get directions →
          </a>
        )}
      </div>
    </div>
  );
}
