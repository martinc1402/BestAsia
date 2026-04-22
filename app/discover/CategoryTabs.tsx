import Link from "next/link";
import { buildHref, type DiscoverSP } from "./url";
import SortSelect from "./SortSelect";

const TABS: { id: string; label: string; dbCat?: string }[] = [
  { id: "all", label: "All" },
  { id: "restaurants", label: "Restaurants", dbCat: "restaurant" },
  { id: "bars", label: "Bars", dbCat: "bar" },
  { id: "cafes", label: "Cafés", dbCat: "cafe" },
  { id: "nightclubs", label: "Nightclubs", dbCat: "nightclub" },
];

interface Props {
  sp: DiscoverSP;
  counts: Record<string, number>;
}

export default function CategoryTabs({ sp, counts }: Props) {
  const active = sp.category ?? "all";
  return (
    <div className="bg-white border-b border-stone px-6 sm:px-10 py-5 flex items-center gap-7 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {TABS.map((tab) => {
        const on = tab.id === active;
        const count = counts[tab.id] ?? 0;
        return (
          <Link
            key={tab.id}
            href={buildHref(sp, {
              category: tab.id === "all" ? undefined : tab.id,
            })}
            className={
              on
                ? "shrink-0 flex items-baseline gap-1.5 pb-1.5 text-body-sm font-bold text-ink border-b-2 border-rust"
                : "shrink-0 flex items-baseline gap-1.5 pb-1.5 text-body-sm font-semibold text-stone-deep hover:text-ink border-b-2 border-transparent transition-colors"
            }
          >
            {tab.label}
            <span className="text-micro font-semibold text-stone-deep">
              ({count})
            </span>
          </Link>
        );
      })}
      <div className="flex-1" />
      <div className="shrink-0 hidden sm:flex items-center gap-2 text-micro text-stone-deep">
        Sort by
        <SortSelect sp={sp} />
      </div>
    </div>
  );
}
