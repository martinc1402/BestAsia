import Link from "next/link";

const HERO_PILLS = [
  { label: "Date Night", icon: "favorite", href: "/manila/restaurants?mood=date-night" },
  { label: "Rooftop", icon: "deck", href: "/manila/bars?mood=rooftop" },
  { label: "Late Night", icon: "nightlife", href: "/manila/bars?mood=late-night" },
  { label: "Laptop Cafe", icon: "laptop_mac", href: "/manila/cafes?mood=laptop" },
  { label: "Filipino Food", icon: "ramen_dining", href: "/manila/restaurants?cuisine=filipino" },
];

export default function HeroSearch() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <form
        action="/discover"
        method="GET"
        className="flex items-center gap-2 bg-white rounded-2xl p-2 shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
      >
        <div className="flex items-center flex-1 gap-3 pl-4">
          <span
            className="material-symbols-outlined shrink-0"
            style={{ fontSize: 22, color: "#907065" }}
          >
            search
          </span>
          <input
            type="text"
            name="q"
            placeholder="Search for a restaurant, cuisine, or location"
            className="font-[family-name:var(--font-plus-jakarta)] w-full h-12 bg-transparent text-base focus:outline-none placeholder:text-[#907065]"
            style={{ color: "#907065" }}
          />
        </div>
        <button
          type="submit"
          className="btn-primary-gradient font-[family-name:var(--font-plus-jakarta)] shrink-0 rounded-xl px-6 py-3.5 text-base font-bold text-on-primary transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 sm:px-8 sm:py-4"
        >
          Explore
        </button>
      </form>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {HERO_PILLS.map((pill) => (
          <Link
            key={pill.label}
            href={pill.href}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/15 text-white text-[13px] font-medium backdrop-blur-sm border border-white/25 hover:bg-white/25 transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
              {pill.icon}
            </span>
            {pill.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
