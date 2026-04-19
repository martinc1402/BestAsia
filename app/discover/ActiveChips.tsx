import Link from "next/link";
import type { Neighborhood } from "@/lib/types";
import {
  activeTags,
  buildHref,
  toggleTagsParam,
  type DiscoverSP,
} from "./url";

const TAG_LABELS: Record<string, string> = {
  reservations: "Takes reservations",
  "walk-in-only": "Walk-in OK",
  romantic: "Romantic",
  trendy: "Trendy",
  cozy: "Cozy",
  lively: "Lively",
  chill: "Chill",
  "date-night": "Date night",
  "group-dinner": "Group dinner",
  "business-meal": "Business meal",
  "solo-dining": "Solo dining",
};

interface Chip {
  label: string;
  href: string;
}

interface Props {
  sp: DiscoverSP;
  neighborhoods: Neighborhood[];
}

export default function ActiveChips({ sp, neighborhoods }: Props) {
  const chips: Chip[] = [];

  if (sp.open === "1") {
    chips.push({ label: "Open late", href: buildHref(sp, { open: undefined }) });
  }
  if (sp.top === "1") {
    chips.push({
      label: "Top rated 90+",
      href: buildHref(sp, { top: undefined }),
    });
  }
  if (sp.price) {
    chips.push({
      label: "₱".repeat(Number(sp.price)),
      href: buildHref(sp, { price: undefined }),
    });
  }
  if (sp.neighborhood) {
    const hood = neighborhoods.find((n) => n.slug === sp.neighborhood);
    chips.push({
      label: hood?.name ?? sp.neighborhood,
      href: buildHref(sp, { neighborhood: undefined }),
    });
  }
  for (const t of activeTags(sp)) {
    chips.push({
      label: TAG_LABELS[t] ?? t,
      href: buildHref(sp, { tags: toggleTagsParam(sp, t) }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mb-4">
      {chips.map((c) => (
        <Link
          key={c.label}
          href={c.href}
          className="inline-flex items-center gap-1.5 pl-3 pr-2.5 py-1.5 rounded-full bg-ink text-white text-[11.5px] font-bold hover:bg-ink-soft transition-colors"
          aria-label={`Remove ${c.label}`}
        >
          {c.label}
          <span aria-hidden>
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </Link>
      ))}
    </div>
  );
}
