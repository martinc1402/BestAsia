"use client";

import Link from "next/link";

const TABS = [
  { slug: "restaurants", label: "Restaurants" },
  { slug: "bars", label: "Bars" },
  { slug: "cafes", label: "Cafes" },
  { slug: "nightclubs", label: "Nightclubs" },
];

interface CategoryFilterProps {
  city: string;
  active: string;
}

export default function CategoryFilter({ city, active }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {TABS.map((tab) => (
        <Link
          key={tab.slug}
          href={`/${city}/${tab.slug}`}
          className={`shrink-0 px-4 py-2 rounded-full text-body-sm font-semibold transition-all duration-200 ${
            active === tab.slug
              ? "bg-rust text-white"
              : "bg-paper text-stone-deep hover:bg-border/50"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
