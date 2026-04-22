import type { Metadata } from "next";
import Link from "next/link";
import {
  getActiveVenueCount,
  getCategoryCount,
  getDiscoverVenues,
  getNeighborhoodsWithCounts,
  type DiscoverSort,
} from "@/lib/queries";
import CategoryTabs from "./CategoryTabs";
import FiltersSidebar from "./FiltersSidebar";
import ActiveChips from "./ActiveChips";
import DiscoverVenueCard from "./DiscoverVenueCard";
import DiscoverMap from "./DiscoverMap";
import {
  activeFilterCount,
  activeTags,
  type DiscoverSP,
} from "./url";

export const metadata: Metadata = {
  title: "Discover Manila — BestPhilippines",
  description:
    "Filter Manila's best bars, restaurants, cafés, and clubs by category, neighborhood, vibe, and price. Map view, live filters.",
};

const CATEGORY_MAP: Record<string, "restaurant" | "bar" | "cafe" | "nightclub"> =
  {
    restaurants: "restaurant",
    bars: "bar",
    cafes: "cafe",
    nightclubs: "nightclub",
  };

const SORTS: DiscoverSort[] = [
  "best",
  "rating",
  "price-low",
  "price-high",
  "name",
];

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<DiscoverSP>;
}) {
  const sp = await searchParams;
  const dbCategory = sp.category ? CATEGORY_MAP[sp.category] : undefined;
  const priceLevel =
    sp.price && /^[1-4]$/.test(sp.price) ? Number(sp.price) : undefined;
  const tags = activeTags(sp);
  const sort: DiscoverSort = SORTS.includes(sp.sort as DiscoverSort)
    ? (sp.sort as DiscoverSort)
    : "best";

  const [venues, neighborhoods, allCount, restCount, barCount, cafeCount, clubCount] =
    await Promise.all([
      getDiscoverVenues({
        city: "manila",
        category: dbCategory,
        neighborhood: sp.neighborhood || undefined,
        priceLevel,
        tags: tags.length > 0 ? tags : undefined,
        openNow: sp.open === "1",
        topRated: sp.top === "1",
        sort,
        limit: 30,
      }),
      getNeighborhoodsWithCounts("manila"),
      getActiveVenueCount("manila"),
      getCategoryCount("manila", "restaurant"),
      getCategoryCount("manila", "bar"),
      getCategoryCount("manila", "cafe"),
      getCategoryCount("manila", "nightclub"),
    ]);

  const counts: Record<string, number> = {
    all: allCount,
    restaurants: restCount,
    bars: barCount,
    cafes: cafeCount,
    nightclubs: clubCount,
  };

  return (
    <div className="bg-paper min-h-screen font-sans text-ink">
      <CategoryTabs sp={sp} counts={counts} />

      <div className="grid grid-cols-1 md:grid-cols-[248px_1fr] lg:grid-cols-[248px_1fr_420px]">
        <FiltersSidebar sp={sp} neighborhoods={neighborhoods} />

        <div className="px-5 sm:px-6 py-5">
          <ActiveChips sp={sp} neighborhoods={neighborhoods} />

          <div className="text-body-sm text-stone-deep mb-3.5 flex items-baseline gap-1">
            <strong className="text-ink font-bold">{venues.length}</strong>
            place{venues.length === 1 ? "" : "s"} in Manila
            {activeFilterCount(sp) > 0 && (
              <Link
                href="/discover"
                className="ml-3 text-rust font-bold hover:underline text-micro"
              >
                Reset
              </Link>
            )}
          </div>

          {venues.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {venues.map((v) => (
                <DiscoverVenueCard key={v.id} venue={v} />
              ))}
            </div>
          )}
        </div>

        <div className="hidden lg:block">
          <DiscoverMap venues={venues.slice(0, 12)} />
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20 px-6 bg-white rounded-xl border border-stone">
      <div className="font-display text-h3 font-bold text-ink mb-2">
        Nothing matches all of those.
      </div>
      <p className="text-stone-deep text-body-sm mb-4">
        Try removing a filter or two &mdash; the most useful results are usually
        one constraint looser.
      </p>
      <Link
        href="/discover"
        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-ink text-white text-body-sm font-bold hover:bg-stone-deep transition-colors"
      >
        Reset all filters
      </Link>
    </div>
  );
}
