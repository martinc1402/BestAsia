import Link from "next/link";
import type { VenueWithTags } from "@/lib/types";
import { getPriceSymbol, getCategorySingular } from "@/lib/utils";
import { scoreColor } from "@/lib/utils";

interface Props {
  venue: VenueWithTags;
  variant?: "featured" | "standard" | "compact";
}

export default function VenueTypographicCard({ venue, variant = "standard" }: Props) {
  const score = venue.final_score != null ? venue.final_score.toFixed(1) : null;
  const scoreCls = scoreColor(venue.final_score);
  const category = venue.subcategory ?? getCategorySingular(venue.category);
  const neighborhood = venue.neighborhood_name;
  const price = venue.price_level != null ? getPriceSymbol(venue.price_level) : null;

  if (variant === "compact") {
    return (
      <Link
        href={`/venue/${venue.slug}`}
        className="group flex items-center gap-3 p-3 rounded-lg border border-stone bg-paper hover:border-ink transition-colors"
      >
        {score && (
          <span className={`shrink-0 font-display text-score-chip ${scoreCls}`}>
            {score}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <div className="font-display text-body-sm font-semibold text-ink truncate">
            {venue.name}
          </div>
          <div className="text-micro text-stone-deep truncate">
            {category}
            {neighborhood ? ` · ${neighborhood}` : ""}
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link
        href={`/venue/${venue.slug}`}
        className="group relative block aspect-[4/3] rounded-xl border border-stone bg-paper p-6 hover:border-ink hover:-translate-y-1 transition-all duration-150"
      >
        {score && (
          <span className={`absolute top-5 right-5 font-display text-score-card ${scoreCls}`}>
            {score}
          </span>
        )}
        <div className="absolute top-5 left-5 text-micro font-bold tracking-[0.18em] uppercase text-stone-deep">
          {category}
          {neighborhood ? ` · ${neighborhood}` : ""}
        </div>
        <div className="absolute bottom-5 left-5 right-5">
          <h3 className="font-display text-h2 font-semibold text-ink leading-[1.05] tracking-tight line-clamp-2">
            {venue.name}
          </h3>
          {price && (
            <div className="mt-2 text-body-sm text-stone-deep font-semibold">
              {price}
            </div>
          )}
        </div>
      </Link>
    );
  }

  // standard
  return (
    <Link
      href={`/venue/${venue.slug}`}
      className="group relative block aspect-[4/3] rounded-lg border border-stone bg-paper p-4 hover:border-ink hover:-translate-y-1 transition-all duration-150"
    >
      {score && (
        <span className={`absolute top-3 right-3 font-display text-score-chip ${scoreCls}`}>
          {score}
        </span>
      )}
      <div className="text-micro font-bold tracking-[0.15em] uppercase text-stone-deep">
        {category}
        {neighborhood ? ` · ${neighborhood}` : ""}
      </div>
      <div className="absolute bottom-4 left-4 right-4">
        <h4 className="font-display text-h4 font-semibold text-ink leading-tight tracking-tight line-clamp-2">
          {venue.name}
        </h4>
        {price && (
          <div className="mt-1 text-micro text-stone-deep font-semibold">{price}</div>
        )}
      </div>
    </Link>
  );
}
