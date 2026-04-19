import Link from "next/link";
import type { Neighborhood } from "@/lib/types";
import {
  activeFilterCount,
  activeTags,
  buildHref,
  toggleTagsParam,
  type DiscoverSP,
} from "./url";

type Section = {
  title: string;
  options: { id: string; label: string; href: string; on: boolean }[];
};

interface Props {
  sp: DiscoverSP;
  neighborhoods: (Neighborhood & { venue_count?: number })[];
}

export default function FiltersSidebar({ sp, neighborhoods }: Props) {
  const tags = new Set(activeTags(sp));
  const tagHref = (name: string) =>
    buildHref(sp, { tags: toggleTagsParam(sp, name) });

  const sections: Section[] = [
    {
      title: "Quick",
      options: [
        {
          id: "open",
          label: "Open late or 24h",
          href: buildHref(sp, { open: sp.open === "1" ? undefined : "1" }),
          on: sp.open === "1",
        },
        {
          id: "top",
          label: "Top rated (90+)",
          href: buildHref(sp, { top: sp.top === "1" ? undefined : "1" }),
          on: sp.top === "1",
        },
        {
          id: "reservations",
          label: "Takes reservations",
          href: tagHref("reservations"),
          on: tags.has("reservations"),
        },
        {
          id: "walk-in-only",
          label: "Walk-in OK",
          href: tagHref("walk-in-only"),
          on: tags.has("walk-in-only"),
        },
      ],
    },
    {
      title: "Vibe",
      options: [
        ["romantic", "Romantic"],
        ["trendy", "Trendy"],
        ["cozy", "Cozy"],
        ["lively", "Lively"],
        ["chill", "Chill"],
      ].map(([id, label]) => ({
        id,
        label,
        href: tagHref(id),
        on: tags.has(id),
      })),
    },
    {
      title: "Occasion",
      options: [
        ["date-night", "Date night"],
        ["group-dinner", "Group dinner"],
        ["business-meal", "Business meal"],
        ["solo-dining", "Solo dining"],
      ].map(([id, label]) => ({
        id,
        label,
        href: tagHref(id),
        on: tags.has(id),
      })),
    },
    {
      title: "Neighborhood",
      options: neighborhoods.slice(0, 8).map((n) => ({
        id: n.slug,
        label:
          n.venue_count !== undefined ? `${n.name} (${n.venue_count})` : n.name,
        href: buildHref(sp, {
          neighborhood: sp.neighborhood === n.slug ? undefined : n.slug,
        }),
        on: sp.neighborhood === n.slug,
      })),
    },
  ];

  const total = activeFilterCount(sp);

  return (
    <aside className="px-5 py-6 border-r border-outline-variant bg-bone min-h-full">
      <div className="font-[family-name:var(--font-noto-serif)] text-xl font-black text-ink leading-tight tracking-[-0.02em]">
        Filters
      </div>
      {total > 0 ? (
        <Link
          href="/discover"
          className="mt-1.5 inline-block text-[11px] font-bold text-terra hover:underline"
        >
          Clear all ({total})
        </Link>
      ) : (
        <div className="mt-1.5 text-[11px] text-outline">No filters active</div>
      )}

      {sections.map((sec) => (
        <section
          key={sec.title}
          className="mt-5 mb-5 pb-5 border-b border-outline-variant/50 last:border-0"
        >
          <div className="text-[10px] font-extrabold tracking-[0.18em] uppercase text-outline mb-2.5">
            {sec.title}
          </div>
          <div className="space-y-1.5">
            {sec.options.map((o) => (
              <Link
                key={o.id}
                href={o.href}
                className="flex items-center gap-2 py-1 text-[12.5px] text-ink hover:text-terra transition-colors group"
              >
                <span
                  className={
                    o.on
                      ? "shrink-0 w-4 h-4 rounded bg-ink flex items-center justify-center"
                      : "shrink-0 w-4 h-4 rounded border-[1.5px] border-outline-variant bg-white group-hover:border-ink transition-colors"
                  }
                >
                  {o.on && <CheckIcon />}
                </span>
                {o.label}
              </Link>
            ))}
          </div>
        </section>
      ))}

      <div>
        <div className="text-[10px] font-extrabold tracking-[0.18em] uppercase text-outline mb-2.5">
          Price
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4].map((p) => {
            const on = Number(sp.price) === p;
            const symbols = "₱".repeat(p);
            return (
              <Link
                key={p}
                href={buildHref(sp, {
                  price: on ? undefined : String(p),
                })}
                className={
                  on
                    ? "flex-1 text-center py-2 border border-ink bg-ink text-white rounded-lg text-xs font-bold"
                    : "flex-1 text-center py-2 border border-outline-variant bg-white text-ink rounded-lg text-xs font-bold hover:border-ink transition-colors"
                }
              >
                {symbols}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12l5 5 9-11"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
