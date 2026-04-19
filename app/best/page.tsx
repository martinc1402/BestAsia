import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  getCuratedListsWithCounts,
  getListPreviewVenues,
  type ListPreviewVenue,
} from "@/lib/queries";
import type { CuratedList } from "@/lib/types";

export const metadata: Metadata = {
  title: "The Lists — BestPhilippines",
  description:
    "Ranked, argued over, and refreshed each month. The Manila canon — the bars, restaurants, and cafés we'd send our best friend to.",
};

type ListWithCount = CuratedList & { venue_count: number };

const LIST_IMAGES: Record<string, string> = {
  "rooftop-bars-manila":
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1800&q=85",
  "best-nightclubs-manila":
    "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1800&q=85",
  "best-filipino-restaurants-manila":
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1800&q=85",
  "top-bars-bgc":
    "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=1800&q=85",
  "best-date-night-makati":
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1800&q=85",
  "best-cafes-remote-work-manila":
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1800&q=85",
  "top-bars-poblacion":
    "https://images.unsplash.com/photo-1525268323446-0505b6fe7778?w=1800&q=85",
  "top-restaurants-manila":
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1800&q=85",
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1800&q=85";

const FILTERS = [
  { id: "all", label: "All lists" },
  { id: "bar", label: "Bars" },
  { id: "restaurant", label: "Restaurants" },
  { id: "cafe", label: "Cafés" },
  { id: "nightclub", label: "Nightclubs" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

const AUTHORS = ["Mika Reyes", "Kara Lim", "JP Cuizon"];

function imageFor(slug: string): string {
  return LIST_IMAGES[slug] ?? FALLBACK_IMAGE;
}

function authorFor(slug: string): string {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return AUTHORS[h % AUTHORS.length];
}

function updatedLabel(list: CuratedList): string {
  const d = list.published_at ? new Date(list.published_at) : new Date();
  return `Updated ${d.toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  })}`;
}

function categoryOf(list: CuratedList): Exclude<FilterId, "all"> {
  const cat = (list.category ?? "").toLowerCase();
  const slug = list.slug.toLowerCase();
  if (cat === "nightclub" || slug.includes("nightclub")) return "nightclub";
  if (cat === "bar" || slug.includes("bar")) return "bar";
  if (cat === "cafe" || slug.includes("cafe")) return "cafe";
  return "restaurant";
}

function applyFilter(
  lists: ListWithCount[],
  filter: FilterId
): ListWithCount[] {
  if (filter === "all") return lists;
  return lists.filter((l) => categoryOf(l) === filter);
}

export default async function BestListsIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const active: FilterId =
    (FILTERS.find((f) => f.id === category)?.id as FilterId | undefined) ??
    "all";

  const all = await getCuratedListsWithCounts();
  const lists = applyFilter(all, active);

  return (
    <div className="bg-bone min-h-screen font-[family-name:var(--font-plus-jakarta)] text-ink">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="bg-white border-b border-outline-variant px-6 sm:px-10 pt-16 sm:pt-20 pb-10 sm:pb-12">
        <div className="max-w-[820px]">
          <div className="text-[11px] font-extrabold tracking-[0.22em] uppercase text-terra mb-3">
            {all.length} lists &middot; Updated monthly
          </div>
          <h1 className="font-[family-name:var(--font-noto-serif)] text-[64px] sm:text-[88px] lg:text-[96px] font-black text-ink leading-[0.92] tracking-[-0.045em]">
            The Manila
            <br />
            <span className="italic text-terra">canon.</span>
          </h1>
          <p className="mt-6 text-[17px] text-secondary leading-[1.5] max-w-[640px]">
            Ranked, argued over, and refreshed each month. No pay-to-play, no
            affiliate padding. If it&apos;s here, we&apos;d send our best
            friend.
          </p>
        </div>
      </section>

      {/* ── Filter pills ─────────────────────────────────── */}
      <nav className="bg-white border-b border-outline-variant px-6 sm:px-10 py-5">
        <div className="flex gap-2 overflow-x-auto -mx-6 px-6 sm:-mx-10 sm:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTERS.map((f) => {
            const on = f.id === active;
            return (
              <Link
                key={f.id}
                href={f.id === "all" ? "/best" : `/best?category=${f.id}`}
                className={
                  on
                    ? "shrink-0 px-4 py-2 rounded-full bg-ink text-white text-[13px] font-extrabold border border-ink"
                    : "shrink-0 px-4 py-2 rounded-full bg-white text-ink text-[13px] font-semibold border border-outline-variant hover:border-ink transition-colors"
                }
              >
                {f.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ── Featured + grid ──────────────────────────────── */}
      <div className="px-6 sm:px-10 pt-10 pb-20">
        {lists.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <FeaturedCollection list={lists[0]} />
            {lists.slice(1).length > 0 && (
              <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {lists.slice(1).map((l) => (
                  <CollectionCard key={l.id} list={l} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

async function FeaturedCollection({ list }: { list: ListWithCount }) {
  const previewVenues = await getListPreviewVenues(list.id, 5);
  const more = Math.max(0, list.venue_count - previewVenues.length);

  return (
    <Link
      href={`/best/${list.slug}`}
      className="group relative grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] lg:h-[440px] rounded-[20px] overflow-hidden shadow-[0_14px_28px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.18)] transition-shadow duration-300"
    >
      {/* Image side */}
      <div className="relative h-60 sm:h-80 lg:h-auto overflow-hidden">
        <Image
          src={imageFor(list.slug)}
          alt={list.title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(27,28,28,0.2) 0%, rgba(27,28,28,0.9) 100%)",
          }}
        />
        <span className="absolute top-5 left-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-saffron/20 backdrop-blur-md border border-saffron/50 text-saffron text-[10px] font-extrabold tracking-[0.2em] uppercase">
          <SparkleIcon size={11} />
          Featured
        </span>
      </div>

      {/* Ink panel */}
      <div className="bg-ink text-white p-8 sm:p-9 lg:p-10 flex flex-col justify-between gap-6">
        <div>
          <div className="text-[11px] font-extrabold tracking-[0.22em] uppercase text-saffron mb-3.5">
            Top {list.venue_count}
          </div>
          <h2 className="font-[family-name:var(--font-noto-serif)] text-3xl sm:text-4xl lg:text-[46px] font-black text-white leading-[0.95] tracking-[-0.035em]">
            {list.title}
          </h2>
          {list.description && (
            <p className="mt-4 text-sm text-white/70 leading-[1.5] line-clamp-3">
              {list.description}
            </p>
          )}
        </div>

        <div>
          {previewVenues.length > 0 && (
            <div className="flex items-center mb-4">
              {previewVenues.map((v, i) => (
                <AvatarChip key={v.slug} venue={v} first={i === 0} />
              ))}
              {more > 0 && (
                <div className="ml-3 self-center text-[11.5px] text-white/65">
                  +{more} more
                </div>
              )}
            </div>
          )}
          <div className="flex items-center justify-between gap-4">
            <div className="text-[11.5px] text-white/55">
              {updatedLabel(list)} &middot; by {authorFor(list.slug)}
            </div>
            <span className="shrink-0 inline-flex items-center gap-1 px-4 py-2.5 rounded-full bg-saffron text-ink text-[12.5px] font-extrabold whitespace-nowrap">
              Read the list
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function AvatarChip({
  venue,
  first,
}: {
  venue: ListPreviewVenue;
  first: boolean;
}) {
  return (
    <div
      className={`w-[38px] h-[38px] rounded-full border-2 border-ink overflow-hidden bg-surface-high ${
        first ? "ml-0" : "-ml-3"
      }`}
      title={venue.name}
    >
      {venue.featured_photo_url && (
        <Image
          src={venue.featured_photo_url}
          alt={venue.name}
          width={38}
          height={38}
          className="object-cover w-full h-full"
        />
      )}
    </div>
  );
}

function CollectionCard({ list }: { list: ListWithCount }) {
  return (
    <Link
      href={`/best/${list.slug}`}
      className="group relative block aspect-[3/4] rounded-[14px] overflow-hidden shadow-[0_3px_10px_rgba(0,0,0,0.08)] hover:shadow-[0_14px_28px_rgba(0,0,0,0.18)] transition-all duration-200 will-change-transform hover:-translate-y-[3px]"
    >
      <Image
        src={imageFor(list.slug)}
        alt={list.title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.9) 100%)",
        }}
      />
      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/95 text-[10px] font-extrabold text-terra tracking-[0.1em]">
        TOP {list.venue_count}
      </span>
      <div className="absolute bottom-0 left-0 right-0 px-4 pt-4 pb-[18px]">
        <h4 className="font-[family-name:var(--font-noto-serif)] text-[22px] font-black text-white leading-[1.05] tracking-[-0.02em]">
          {list.title}
        </h4>
        <div className="mt-1.5 text-[11px] text-white/70">
          {updatedLabel(list)} &middot; {authorFor(list.slug)}
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <div className="font-[family-name:var(--font-noto-serif)] text-3xl font-black text-ink mb-2">
        Nothing in this column yet.
      </div>
      <p className="text-secondary text-sm">
        Try another filter &mdash; or{" "}
        <Link href="/best" className="text-terra font-bold hover:underline">
          see every list
        </Link>
        .
      </p>
    </div>
  );
}

function SparkleIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2l2.2 7.4L22 12l-7.8 2.6L12 22l-2.2-7.4L2 12l7.8-2.6L12 2z"
        fill="currentColor"
      />
    </svg>
  );
}
