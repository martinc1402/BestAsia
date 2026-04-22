// TODO: split, exceeds 300-line limit (currently      661 lines) — scheduled for follow-up PR
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import { Award, Clock, Heart, Image as ImageIcon, MapPin, Share2, Star, Tag } from "lucide-react";
import { getVenueBySlug, getSimilarVenues } from "@/lib/queries";
import { getPriceSymbol, getCategorySingular, scoreColor } from "@/lib/utils";
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

  const loveRows: { Icon: LucideIcon; label: string; value: string }[] = [
    {
      Icon: Award,
      label: "BestPhilippines Score",
      value: venue.final_score != null ? venue.final_score.toFixed(1) : "—",
    },
    {
      Icon: MapPin,
      label: "Neighborhood",
      value: venue.neighborhood_name ?? "Manila",
    },
    {
      Icon: Clock,
      label: "Hours",
      value: status.label,
    },
    {
      Icon: Tag,
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
    <div className="bg-paper font-sans text-ink">
      {/* Breadcrumb (desktop) */}
      <nav className="hidden lg:block max-w-screen-2xl mx-auto px-10 pt-5 text-micro text-stone-deep">
        <Link href="/manila" className="hover:text-ink transition-colors">
          Manila
        </Link>
        <span className="text-stone-deep mx-2">›</span>
        <Link
          href={`/manila/${venue.category}s`}
          className="hover:text-ink transition-colors"
        >
          {categoryPlural}
        </Link>
        {venue.neighborhood_name && (
          <>
            <span className="text-stone-deep mx-2">›</span>
            <span>{venue.neighborhood_name}</span>
          </>
        )}
        <span className="text-stone-deep mx-2">›</span>
        <span className="text-ink font-bold">{venue.name}</span>
      </nav>

      {/* Title row */}
      <section className="max-w-screen-2xl mx-auto px-5 sm:px-8 lg:px-10 pt-5 sm:pt-6 lg:pt-3 pb-4 sm:pb-5">
        <div className="flex items-end justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="text-micro sm:text-micro font-bold tracking-[0.22em] uppercase text-rust">
              {rank ? `#${rank} · ` : ""}
              {subcategoryLabel(venue)}
              {venue.neighborhood_name ? ` in ${venue.neighborhood_name}` : ""}
            </div>
            <h1 className="mt-2 font-display font-bold text-ink tracking-[-0.035em] leading-[0.95] text-h2 sm:text-h1 lg:text-h1">
              {venue.name}
            </h1>
            <div className="mt-3 flex items-center flex-wrap gap-x-3 gap-y-2 text-body-sm sm:text-body-sm font-semibold text-ink">
              {venue.final_score != null && (
                <BestScoreBadge score={venue.final_score} />
              )}
              {venue.google_rating != null && (
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-calamansi stroke-calamansi" aria-hidden />
                  <span className="font-bold">
                    {venue.google_rating.toFixed(1)}
                  </span>
                  {venue.google_review_count != null && (
                    <span className="text-stone-deep font-semibold">
                      ({venue.google_review_count.toLocaleString()})
                    </span>
                  )}
                </span>
              )}
              {price && (
                <>
                  <span className="text-stone-deep">·</span>
                  <PriceDots level={price} />
                </>
              )}
              <span className="text-stone-deep">·</span>
              <span
                className={`flex items-center gap-1.5 font-bold text-body-sm ${
                  status.open ? "text-live" : "text-stone-deep"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    status.open ? "bg-live" : "bg-stone-deep"
                  }`}
                />
                {status.label}
              </span>
            </div>
          </div>
          <div className="hidden sm:flex gap-2 shrink-0">
            <button
              type="button"
              className="px-3.5 py-2.5 rounded-[10px] border border-stone bg-white text-ink text-body-sm font-bold flex items-center gap-1.5 hover:border-ink transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button
              type="button"
              className="px-3.5 py-2.5 rounded-[10px] border border-stone bg-white text-ink text-body-sm font-bold flex items-center gap-1.5 hover:border-ink transition-colors"
            >
              <Heart className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>
      </section>

      {/* Photo hero */}
      <section className="max-w-screen-2xl mx-auto px-0 sm:px-8 lg:px-10">
        <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-[16/6] sm:rounded-2xl overflow-hidden bg-stone">
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
            <div className="absolute inset-0 flex items-center justify-center text-stone-deep">
              <ImageIcon className="w-14 h-14" />
            </div>
          )}
        </div>
      </section>

      {/* Sticky tabs */}
      <nav className="sticky top-0 z-30 bg-paper/95 border-b border-stone mt-5 sm:mt-7 lg:mt-8">
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
              className={`shrink-0 py-3.5 border-b-2 text-body-sm sm:text-body-sm font-semibold transition-colors ${
                i === 0
                  ? "border-rust text-ink font-bold"
                  : "border-transparent text-stone-deep hover:text-ink"
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
                <p className="font-display text-ink font-semibold tracking-[-0.005em] leading-[1.45] text-body-lg sm:text-verdict lg:text-verdict">
                  {venue.editorial_notes || venue.short_description}
                </p>
              )}

              {venue.editorial_notes && venue.short_description && (
                <div className="relative mt-6 sm:mt-7 p-5 sm:p-[20px_22px] rounded-[14px] bg-rust/20">
                  <span className="absolute -top-[10px] left-[18px] px-2 sm:px-2.5 py-[3px] rounded bg-rust text-white text-micro sm:text-micro font-bold tracking-[0.2em]">
                    EDITOR&apos;S NOTE
                  </span>
                  <p className="text-body-sm sm:text-body-sm text-rust leading-[1.55]">
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
              <h3 className="font-display text-h3 sm:text-h3 font-bold text-ink tracking-[-0.02em] mb-5">
                What you&apos;ll love
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {loveRows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center gap-3 p-4 rounded-[12px] border border-stone bg-white"
                  >
                    <div className="w-[38px] h-[38px] rounded-[10px] bg-rust/20 text-rust flex items-center justify-center shrink-0">
                      <row.Icon className="w-[18px] h-[18px]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-micro font-bold tracking-[0.15em] uppercase text-stone-deep">
                        {row.label}
                      </div>
                      <div className="mt-0.5 text-body-sm font-bold text-ink truncate">
                        {row.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div id="reviews" className="mt-10 sm:mt-11 scroll-mt-20">
              <h3 className="font-display text-h3 sm:text-h3 font-bold text-ink tracking-[-0.02em] mb-5">
                What guests say
              </h3>
              {venue.google_rating != null ? (
                <div className="p-5 sm:p-6 rounded-[14px] border border-stone bg-white flex flex-col sm:flex-row gap-6 sm:gap-8">
                  <div className="text-center sm:border-r sm:border-stone/60 sm:pr-8 shrink-0">
                    <div className="font-display text-h1 sm:text-display font-bold text-ink tracking-[-0.04em] leading-none">
                      {venue.google_rating.toFixed(1)}
                    </div>
                    <div className="mt-1.5 flex justify-center gap-[2px]">
                      {[1, 2, 3, 4, 5].map((i) => {
                        const muted = i > Math.round(venue.google_rating ?? 0);
                        return (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${muted ? "fill-stone stroke-stone" : "fill-calamansi stroke-calamansi"}`}
                            aria-hidden
                          />
                        );
                      })}
                    </div>
                    {venue.google_review_count != null && (
                      <div className="mt-1.5 text-micro text-stone-deep">
                        {venue.google_review_count.toLocaleString()} Google reviews
                      </div>
                    )}
                  </div>
                  <ScoreTransparencyBlock finalScore={venue.final_score} />
                </div>
              ) : (
                <div className="p-5 rounded-[14px] bg-stone text-stone-deep text-body-sm">
                  No reviews yet — be the first.
                </div>
              )}
            </div>

            {/* Info */}
            <div id="info" className="mt-10 sm:mt-11 scroll-mt-20">
              <h3 className="font-display text-h3 sm:text-h3 font-bold text-ink tracking-[-0.02em] mb-5">
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
                          ? "border-b border-stone/60"
                          : "sm:border-b sm:border-stone/60"
                      }`}
                    >
                      <dt className="text-micro font-bold tracking-[0.18em] uppercase text-stone-deep">
                        {label}
                      </dt>
                      <dd className="mt-1 text-body-sm text-ink font-semibold leading-[1.4]">
                        {label === "Website" && value ? (
                          <a
                            href={venue.website ?? "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-rust hover:underline break-all"
                          >
                            {value}
                          </a>
                        ) : label === "Phone" && value ? (
                          <a
                            href={`tel:${value}`}
                            className="text-rust hover:underline"
                          >
                            {value}
                          </a>
                        ) : label === "Instagram" && value ? (
                          <a
                            href={`https://instagram.com/${venue.instagram}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-rust hover:underline"
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
                <h3 className="font-display text-h3 sm:text-h3 font-bold text-ink tracking-[-0.02em] mb-5">
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
              <div className="rounded-[14px] border border-stone bg-white p-6 ">
                <div className="font-display text-verdict font-bold text-ink tracking-[-0.02em]">
                  Reserve a table
                </div>
                <div className="mt-1 text-body-sm text-stone-deep">
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
                      className="p-2.5 rounded-[9px] border border-stone"
                    >
                      <div className="text-micro font-bold tracking-[0.15em] uppercase text-stone-deep">
                        {l}
                      </div>
                      <div className="mt-0.5 text-body-sm font-bold text-ink">
                        {v}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 p-2.5 rounded-[9px] border border-stone">
                  <div className="text-micro font-bold tracking-[0.15em] uppercase text-stone-deep">
                    Party size
                  </div>
                  <div className="mt-0.5 text-body-sm font-bold text-ink">
                    2 guests
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-4 w-full py-3.5 rounded-[11px] bg-rust text-white text-body-sm font-bold hover:brightness-95 transition"
                >
                  Reserve →
                </button>
                {venue.phone ? (
                  <a
                    href={`tel:${venue.phone}`}
                    className="block mt-2 text-center py-3 rounded-[11px] border border-ink bg-white text-ink text-body-sm font-bold hover:bg-ink hover:text-white transition-colors"
                  >
                    Call {venue.name}
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="mt-2 w-full py-3 rounded-[11px] border border-stone bg-white text-stone-deep text-body-sm font-bold"
                  >
                    No phone on file
                  </button>
                )}
              </div>

              {/* Address + directions (Mapbox integration: TODO) */}
              <div className="rounded-[14px] border border-stone bg-paper overflow-hidden">
                <div className="p-4">
                  <div className="text-micro font-bold tracking-[0.15em] uppercase text-stone-deep">
                    Address
                  </div>
                  <div className="mt-1 text-body-sm font-bold text-ink">
                    {venue.address || `${venue.neighborhood_name ?? ""} — Manila`}
                  </div>
                  {venue.latitude != null && venue.longitude != null && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${venue.latitude},${venue.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-2 text-micro text-rust font-bold"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      Get directions
                    </a>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Sticky mobile reserve bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone px-4 py-3 flex items-center gap-2.5 ">
        <div className="flex-1 min-w-0">
          <div className="font-display text-body-sm font-bold text-ink tracking-[-0.01em] truncate">
            {price ? `${getPriceSymbol(price)} · ` : ""}
            {subcategoryLabel(venue)}
          </div>
          <div className="text-micro text-stone-deep mt-0.5 truncate">
            {status.label}
            {venue.neighborhood_name ? ` · ${venue.neighborhood_name}` : ""}
          </div>
        </div>
        {venue.phone && (
          <a
            href={`tel:${venue.phone}`}
            className="shrink-0 px-4 py-2.5 rounded-[10px] border border-ink bg-white text-ink text-body-sm font-bold"
          >
            Call
          </a>
        )}
        <button
          type="button"
          className="shrink-0 px-4 py-2.5 rounded-[10px] bg-rust text-white text-body-sm font-bold "
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
    <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-[10px] bg-white border border-stone">
      <span className="font-display text-body-lg font-bold text-rust leading-none">
        {score.toFixed(1)}
      </span>
      <span className="text-micro font-bold tracking-[0.18em] uppercase text-stone-deep leading-tight">
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
      <div className="flex-1 flex items-center text-body-sm text-stone-deep">
        Not yet scored.
      </div>
    );
  }

  const algorithmic = finalScore;
  const boost = 0.0;
  const tierColor = scoreColor(finalScore);

  return (
    <div className="flex-1 flex flex-col items-center lg:items-start justify-center gap-4">
      <span
        className={`font-display font-bold leading-none tabular-nums text-score-display ${tierColor}`}
      >
        {finalScore.toFixed(1)}
      </span>
      <div className="w-full max-w-[240px] space-y-1.5 text-body-sm">
        <div className="flex items-center justify-between">
          <span className="text-stone-deep">Algorithmic</span>
          <span className="font-semibold text-ink tabular-nums">
            {algorithmic.toFixed(1)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-stone-deep">Editorial adjustment</span>
          <span className="font-semibold text-ink tabular-nums">
            {formatBoost(boost)}
          </span>
        </div>
        <div className="pt-2 border-t border-stone/60">
          <span className="text-micro font-bold tracking-[0.18em] uppercase text-stone-deep">
            BestPhilippines
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
          className={i <= level ? "text-ink" : "text-stone-deep"}
        >
          ₱
        </span>
      ))}
    </span>
  );
}

const TAG_COLORS: Record<string, string> = {
  occasion: "bg-seafoam text-teal",
  vibe: "bg-stone text-ink",
  cuisine: "bg-stone text-rust",
  practical: "bg-stone text-stone-deep",
  budget: "bg-stone text-stone-deep",
  highlight: "bg-rust/10 text-rust",
};

function TagPill({ tag }: { tag: VenueTag }) {
  const cls = TAG_COLORS[tag.dimension] ?? "bg-stone text-stone-deep";
  return (
    <span className={`px-2.5 py-1 rounded-full text-micro font-semibold ${cls}`}>
      {tag.display_name}
    </span>
  );
}

function SimilarCard({ venue }: { venue: VenueWithTags }) {
  return (
    <Link
      href={`/venue/${venue.slug}`}
      className="group block rounded-[14px] overflow-hidden bg-white hover: transition-shadow"
    >
      <div className="relative aspect-[4/3] bg-stone overflow-hidden">
        {venue.featured_photo_url && (
          <Image
            src={venue.featured_photo_url}
            alt={venue.name}
            fill
            className="object-cover group- transition-transform duration-500"
            sizes="(max-width: 1024px) 50vw, 25vw"
          />
        )}
        {venue.final_score != null && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-[6px] bg-rust text-white text-micro font-bold">
            {venue.final_score.toFixed(1)}
          </span>
        )}
      </div>
      <div className="p-3">
        <div className="text-micro font-bold tracking-[0.18em] uppercase text-stone-deep truncate">
          {venue.subcategory || getCategorySingular(venue.category)}
          {venue.neighborhood_name ? ` · ${venue.neighborhood_name}` : ""}
        </div>
        <div className="mt-1 font-display text-body-sm font-bold text-ink leading-[1.15] tracking-[-0.01em] line-clamp-2">
          {venue.name}
        </div>
      </div>
    </Link>
  );
}

