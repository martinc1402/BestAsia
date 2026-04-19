"use client";

import { useRouter } from "next/navigation";
import { buildHref, type DiscoverSP } from "./url";

const OPTIONS = [
  { value: "best", label: "Best Score" },
  { value: "rating", label: "Rating" },
  { value: "price-low", label: "Price: low" },
  { value: "price-high", label: "Price: high" },
  { value: "name", label: "Name A–Z" },
];

export default function SortSelect({ sp }: { sp: DiscoverSP }) {
  const router = useRouter();
  const current = sp.sort && OPTIONS.find((o) => o.value === sp.sort) ? sp.sort : "best";
  return (
    <select
      value={current}
      onChange={(e) =>
        router.push(
          buildHref(sp, {
            sort: e.target.value === "best" ? undefined : e.target.value,
          })
        )
      }
      className="px-2.5 py-1.5 border border-outline-variant rounded-lg text-xs font-bold text-ink bg-white hover:border-ink transition-colors cursor-pointer"
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
