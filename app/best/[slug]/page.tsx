// TODO: split, exceeds 300-line limit (currently      514 lines) — scheduled for follow-up PR
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Star } from "lucide-react";
import { getCuratedListBySlugEnriched, type EnrichedListItem } from "@/lib/queries";
import { getPriceSymbol } from "@/lib/utils";
import type { CuratedList, VenueWithTags } from "@/lib/types";

interface Props {
  params: Promise<{ slug: string }>;
}

const LIST_IMAGES: Record<string, string> = {
  "rooftop-bars-manila":
    // TODO: replace with commissioned/editorial photography
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1800&q=85",
  "best-nightclubs-manila":
    // TODO: replace with commissioned/editorial photography
    "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1800&q=85",
  "best-filipino-restaurants-manila":
    // TODO: replace with commissioned/editorial photography
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1800&q=85",
  "top-bars-bgc":
    // TODO: replace with commissioned/editorial photography
    "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=1800&q=85",
  "best-date-night-makati":
    // TODO: replace with commissioned/editorial photography
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1800&q=85",
  "best-cafes-remote-work-manila":
    // TODO: replace with commissioned/editorial photography
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1800&q=85",
  "top-bars-poblacion":
    // TODO: replace with commissioned/editorial photography
    "https://images.unsplash.com/photo-1525268323446-0505b6fe7778?w=1800&q=85",
  "top-restaurants-manila":
    // TODO: replace with commissioned/editorial photography
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1800&q=85",
};
const FALLBACK_COVER =
  // TODO: replace with commissioned/editorial photography
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1800&q=85";

const EDITORIAL_BYLINE = "BestPhilippines editors";

function updatedLabel(list: CuratedList): string {
  const d = list.published_at ? new Date(list.published_at) : new Date();
  return d.toLocaleString("en-US", { month: "long", year: "numeric" });
}

function categoryLabel(v: VenueWithTags): string {
  const map: Record<string, string> = {
    restaurant: "Restaurant",
    bar: "Bar",
    cafe: "Café",
    nightclub: "Nightclub",
  };
  return v.subcategory || map[v.category] || v.category;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getCuratedListBySlugEnriched(slug);
  if (!result) return { title: "List Not Found" };
  return {
    title: result.list.meta_title || result.list.title,
    description:
      result.list.meta_description ||
      result.list.description ||
      `${result.list.title} — curated by BestPhilippines`,
  };
}

export default async function CuratedListPage({ params }: Props) {
  const { slug } = await params;
  const result = await getCuratedListBySlugEnriched(slug);
  if (!result) notFound();

  const { list, items } = result;
  const cover = LIST_IMAGES[list.slug] || FALLBACK_COVER;
  const count = items.length;

  return (
    <div className="bg-paper font-sans text-ink">
      {/* HERO */}
      <section className="relative h-[480px] sm:h-[540px] lg:h-[600px] text-white">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={cover}
            alt={list.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 35%, rgba(27,28,28,1) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 h-full max-w-screen-2xl mx-auto px-6 sm:px-10 pb-10 sm:pb-14 lg:pb-16 flex flex-col justify-end">
          <span className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-calamansi text-ink text-micro sm:text-micro font-bold tracking-[0.2em] uppercase">
            <Sparkles className="w-3 h-3" />
            The List · {count} Picks
          </span>
          <h1 className="mt-5 sm:mt-6 font-display text-white font-bold tracking-[-0.04em] leading-[0.95] text-h1 sm:text-display lg:text-display max-w-[900px]">
            {list.title}
          </h1>
          {list.description && (
            <p className="mt-4 sm:mt-5 font-display italic text-white/85 leading-[1.4] text-body-sm sm:text-body-lg lg:text-body-lg max-w-[640px]">
              &ldquo;{list.description}&rdquo;
            </p>
          )}
          <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-white/70 text-micro sm:text-body-sm">
            <span>
              By <span className="text-white font-bold">{EDITORIAL_BYLINE}</span>
            </span>
            <span className="opacity-50">·</span>
            <span>Updated {updatedLabel(list)}</span>
            <span className="opacity-50">·</span>
            <span>{Math.max(4, Math.ceil(count * 0.8))} min read</span>
          </div>
        </div>
      </section>

      {/* JUMP NAV (mobile) */}
      {items.length > 0 && (
        <nav className="lg:hidden px-4 sm:px-6 py-3.5 flex gap-1.5 overflow-x-auto border-b border-stone bg-white scrollbar-hide">
          {items.map((item, i) => (
            <a
              key={item.id}
              href={`#rank-${i + 1}`}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-micro font-semibold no-underline border ${
                i === 0
                  ? "bg-ink border-ink text-white"
                  : "bg-white border-stone text-ink"
              }`}
            >
              <span className="font-display font-bold text-micro">
                #{i + 1}
              </span>
              <span className="truncate max-w-[120px]">
                {item.venue?.name ?? "—"}
              </span>
            </a>
          ))}
        </nav>
      )}

      {/* BODY */}
      {items.length === 0 ? (
        <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 py-20 text-center">
          <p className="text-stone-deep">No picks yet on this list.</p>
        </div>
      ) : (
        <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 py-12 lg:py-14">
          <div className="grid lg:grid-cols-[240px_1fr] gap-8 lg:gap-[60px]">
            {/* Sticky TOC (desktop) */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <div className="text-micro font-bold tracking-[0.22em] uppercase text-stone-deep mb-3.5">
                  The Picks
                </div>
                {items.map((item, i) => (
                  <a
                    key={item.id}
                    href={`#rank-${i + 1}`}
                    className={`flex gap-2.5 py-2 no-underline ${
                      i === 0 ? "" : "border-t border-stone/60"
                    }`}
                  >
                    <div
                      className={`font-display text-body-lg font-bold tracking-[-0.02em] w-7 shrink-0 ${
                        i < 3 ? "text-rust" : "text-stone-deep"
                      }`}
                    >
                      #{i + 1}
                    </div>
                    <div className="flex-1 text-body-sm text-ink font-semibold leading-[1.3]">
                      {item.venue?.name ?? "—"}
                    </div>
                  </a>
                ))}
                <button
                  type="button"
                  className="mt-5 w-full px-3 py-2.5 rounded-[10px] border border-ink bg-white text-ink text-body-sm font-bold hover:bg-ink hover:text-white transition-colors"
                >
                  Save all {count} →
                </button>
              </div>
            </aside>

            {/* Ranked list */}
            <div>
              {items.map((item, i) => {
                const rank = i + 1;
                const isLast = i === items.length - 1;
                return (
                  <article
                    key={item.id}
                    id={`rank-${rank}`}
                    className={`pb-10 lg:pb-12 mb-10 lg:mb-12 ${
                      isLast ? "" : "border-b border-stone/60"
                    }`}
                  >
                    {rank === 1 ? (
                      <RankOne item={item} />
                    ) : (
                      <RankRow item={item} rank={rank} flip={rank % 2 === 1} />
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* FOOTER CTA */}
      <section className="px-4 sm:px-6 lg:px-10 pb-16 lg:pb-24">
        <div className="max-w-screen-2xl mx-auto">
          <div className="rounded-2xl bg-ink text-white text-center p-8 sm:p-10 lg:p-12">
            <div className="text-micro font-bold tracking-[0.22em] uppercase text-calamansi">
              Save this list
            </div>
            <h3 className="mt-2 font-display text-h3 sm:text-h2 lg:text-h1 font-bold tracking-[-0.025em] leading-[1.05]">
              Take Manila with you.
            </h3>
            <p className="mt-2.5 text-white/60 text-body-sm sm:text-body-sm">
              Offline map + every pick, one tap away.
            </p>
            <button
              type="button"
              className="mt-5 px-5 py-3 rounded-[10px] bg-calamansi text-ink text-body-sm font-bold hover:brightness-95 transition"
            >
              Save {count} picks →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function RankOne({ item }: { item: EnrichedListItem }) {
  const v = item.venue;
  if (!v) return null;
  const topTags = (v.tags ?? [])
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5);

  return (
    <div>
      <div className="flex items-start gap-4 lg:gap-6 mb-5 lg:mb-6">
        <div className="font-display text-rust font-bold tracking-[-0.055em] leading-[0.75] text-display sm:text-display lg:text-display">
          01
        </div>
        <div className="pt-1 sm:pt-3 lg:pt-[18px]">
          <div className="text-micro sm:text-micro font-bold tracking-[0.22em] uppercase text-stone-deep">
            {categoryLabel(v)}
            {v.neighborhood_name ? ` · ${v.neighborhood_name}` : ""}
          </div>
          <h3 className="mt-2 font-display text-ink font-bold tracking-[-0.03em] leading-[0.95] text-h3 sm:text-h2 lg:text-h1">
            {v.name}
          </h3>
          {v.final_score != null && (
            <div className="mt-3.5">
              <BigBestScore score={v.final_score} />
            </div>
          )}
        </div>
      </div>

      <Link
        href={`/venue/${v.slug}`}
        className="relative block rounded-2xl overflow-hidden group mb-5 lg:mb-6 aspect-[16/10] lg:aspect-auto lg:h-[380px]"
      >
        {v.featured_photo_url ? (
          <Image
            src={v.featured_photo_url}
            alt={v.name}
            fill
            className="object-cover group- transition-transform duration-500"
            sizes="(max-width: 1024px) 100vw, 960px"
          />
        ) : (
          <div className="absolute inset-0 bg-paper" />
        )}
      </Link>

      {v.short_description && (
        <p className="font-display text-ink italic font-semibold tracking-[-0.005em] leading-[1.4] text-body sm:text-verdict lg:text-verdict max-w-[760px]">
          &ldquo;{v.short_description}&rdquo;
        </p>
      )}

      {item.editorial_note && (
        <div className="mt-5 p-4 sm:p-5 rounded-[12px] bg-rust/20 max-w-[760px]">
          <span className="font-bold tracking-[0.1em] text-micro uppercase text-rust">
            Editor&apos;s note ·{" "}
          </span>
          <span className="text-body-sm sm:text-body-sm text-rust leading-[1.55]">
            {item.editorial_note}
          </span>
        </div>
      )}

      {topTags.length > 0 && (
        <div className="mt-5 flex gap-1.5 flex-wrap">
          {topTags.map((t) => (
            <span
              key={t.tag_id}
              className="px-2.5 py-1 rounded-full bg-stone text-stone-deep text-micro font-semibold"
            >
              {t.display_name}
            </span>
          ))}
        </div>
      )}

      <Link
        href={`/venue/${v.slug}`}
        className="inline-flex items-center mt-6 px-5 py-3 rounded-[11px] border border-ink bg-white text-ink text-body-sm font-bold hover:bg-ink hover:text-white transition-colors"
      >
        Open {v.name} →
      </Link>
    </div>
  );
}

function RankRow({
  item,
  rank,
  flip,
}: {
  item: EnrichedListItem;
  rank: number;
  flip: boolean;
}) {
  const v = item.venue;
  if (!v) return null;
  const numColor = rank <= 3 ? "text-rust" : "text-stone-deep";

  return (
    <>
      {/* Mobile: compact row */}
      <div className="flex gap-3 lg:hidden">
        <div
          className={`font-display font-bold tracking-[-0.04em] leading-[0.85] w-12 shrink-0 text-h1 ${numColor}`}
        >
          {String(rank).padStart(2, "0")}
        </div>
        <Link
          href={`/venue/${v.slug}`}
          className="relative w-[100px] h-[100px] rounded-[12px] overflow-hidden shrink-0"
        >
          {v.featured_photo_url && (
            <Image
              src={v.featured_photo_url}
              alt={v.name}
              fill
              className="object-cover"
              sizes="100px"
            />
          )}
          {v.final_score != null && (
            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-[5px] bg-rust text-white text-micro font-bold ">
              {v.final_score.toFixed(1)}
            </span>
          )}
        </Link>
        <div className="flex-1 min-w-0">
          <div className="text-micro font-bold tracking-[0.18em] uppercase text-stone-deep">
            {categoryLabel(v)}
            {v.neighborhood_name ? ` · ${v.neighborhood_name}` : ""}
          </div>
          <Link
            href={`/venue/${v.slug}`}
            className="mt-0.5 block font-display text-ink font-bold text-body-lg tracking-[-0.015em] leading-[1.1] hover:text-rust transition-colors"
          >
            {v.name}
          </Link>
          {item.editorial_note ? (
            <p className="mt-1 text-body-sm text-stone-deep line-clamp-2 leading-[1.4]">
              {item.editorial_note}
            </p>
          ) : v.short_description ? (
            <p className="mt-1 text-body-sm text-stone-deep line-clamp-2 leading-[1.4]">
              {v.short_description}
            </p>
          ) : null}
          <div className="flex items-center gap-1.5 mt-1.5 text-micro">
            {v.google_rating != null && (
              <span className="flex items-center gap-0.5 text-calamansi font-bold">
                <Star className="w-3 h-3 fill-calamansi stroke-calamansi" aria-hidden />
                {v.google_rating.toFixed(1)}
              </span>
            )}
            {v.price_level && (
              <>
                <span className="text-stone-deep">·</span>
                <span className="text-stone-deep font-semibold">
                  {getPriceSymbol(v.price_level)}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Desktop: alternating 2-col */}
      <div
        className={`hidden lg:grid gap-8 items-center ${
          flip ? "grid-cols-[1fr_1.3fr]" : "grid-cols-[1.3fr_1fr]"
        }`}
      >
        <Link
          href={`/venue/${v.slug}`}
          className={`relative h-[320px] rounded-[14px] overflow-hidden group ${
            flip ? "order-2" : "order-1"
          }`}
        >
          {v.featured_photo_url && (
            <Image
              src={v.featured_photo_url}
              alt={v.name}
              fill
              className="object-cover group- transition-transform duration-500"
              sizes="(max-width: 1024px) 50vw, 600px"
            />
          )}
          {v.final_score != null && (
            <div className="absolute top-3.5 left-3.5">
              <BigBestScore score={v.final_score} size="md" />
            </div>
          )}
        </Link>
        <div className={flip ? "order-1" : "order-2"}>
          <div
            className={`font-display font-bold tracking-[-0.05em] leading-[0.8] text-display mb-2.5 ${numColor}`}
          >
            {String(rank).padStart(2, "0")}
          </div>
          <div className="text-micro font-bold tracking-[0.22em] uppercase text-stone-deep">
            {categoryLabel(v)}
            {v.neighborhood_name ? ` · ${v.neighborhood_name}` : ""}
          </div>
          <h3 className="mt-1.5 mb-3 font-display text-h2 font-bold text-ink tracking-[-0.025em] leading-none">
            {v.name}
          </h3>
          {(item.editorial_note || v.short_description) && (
            <p className="mb-3.5 text-body-sm text-ink leading-[1.55]">
              {item.editorial_note || v.short_description}
            </p>
          )}
          <div className="flex items-center gap-2.5 mb-3.5 text-body-sm">
            {v.google_rating != null && (
              <span className="flex items-center gap-1 font-bold text-ink">
                <Star className="w-3.5 h-3.5 fill-calamansi stroke-calamansi" aria-hidden />
                {v.google_rating.toFixed(1)}
              </span>
            )}
            {v.price_level && (
              <>
                <span className="text-stone-deep">·</span>
                <span className="text-ink font-semibold">
                  {getPriceSymbol(v.price_level)}
                </span>
              </>
            )}
            {v.google_review_count != null && (
              <>
                <span className="text-stone-deep">·</span>
                <span className="text-stone-deep">
                  {v.google_review_count.toLocaleString()} reviews
                </span>
              </>
            )}
          </div>
          <Link
            href={`/venue/${v.slug}`}
            className="inline-flex items-center px-4 py-2.5 rounded-[10px] border border-ink bg-white text-ink text-body-sm font-bold hover:bg-ink hover:text-white transition-colors"
          >
            Open {v.name} →
          </Link>
        </div>
      </div>
    </>
  );
}

function BigBestScore({ score, size = "xl" }: { score: number; size?: "md" | "xl" }) {
  const scale = size === "xl" ? "text-h3" : "text-verdict";
  const pad = size === "xl" ? "px-3 py-2" : "px-2.5 py-1.5";
  return (
    <div className={`inline-flex items-center gap-2 rounded-[12px] bg-white/95   ${pad}`}>
      <span
        className={`font-display font-bold text-rust leading-none ${scale}`}
      >
        {score.toFixed(1)}
      </span>
      <div className="text-micro font-bold tracking-[0.18em] uppercase text-stone-deep leading-tight">
        Best
        <br />
        Score
      </div>
    </div>
  );
}

