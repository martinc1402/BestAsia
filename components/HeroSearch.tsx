import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Heart, Laptop, Moon, Search, Sun, UtensilsCrossed } from "lucide-react";

interface HeroPill {
  label: string;
  Icon: LucideIcon;
  href: string;
}

const HERO_PILLS: HeroPill[] = [
  { label: "Date Night", Icon: Heart, href: "/manila/restaurants?mood=date-night" },
  { label: "Rooftop", Icon: Sun, href: "/manila/bars?mood=rooftop" },
  { label: "Late Night", Icon: Moon, href: "/manila/bars?mood=late-night" },
  { label: "Laptop Cafe", Icon: Laptop, href: "/manila/cafes?mood=laptop" },
  { label: "Filipino Food", Icon: UtensilsCrossed, href: "/manila/restaurants?cuisine=filipino" },
];

export default function HeroSearch() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <form
        action="/discover"
        method="GET"
        className="flex items-center gap-2 bg-paper rounded-2xl p-2"
      >
        <div className="flex items-center flex-1 gap-3 pl-4">
          <Search className="w-5 h-5 text-stone-deep shrink-0" aria-hidden />
          <input
            type="text"
            name="q"
            placeholder="Search for a restaurant, cuisine, or location"
            className="font-sans w-full h-12 bg-transparent text-body text-ink focus:outline-none placeholder:text-stone-deep"
          />
        </div>
        <button
          type="submit"
          className="bg-rust hover:bg-ember font-sans shrink-0 rounded-xl px-6 py-3.5 text-body font-bold text-paper transition-colors disabled:opacity-60 sm:px-8 sm:py-4"
        >
          Explore
        </button>
      </form>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {HERO_PILLS.map((pill) => (
          <Link
            key={pill.label}
            href={pill.href}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-paper/10 text-paper text-body-sm font-semibold border border-paper/25 hover:bg-paper/20 transition-colors"
          >
            <pill.Icon className="w-4 h-4" />
            {pill.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
