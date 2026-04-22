import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { VenueWithTags } from "@/lib/types";
import { getPriceSymbol, getCategorySingular } from "@/lib/utils";
import BestScoreBadge from "@/components/BestScoreBadge";
import VenueTypographicCard from "@/components/VenueTypographicCard";

interface Props {
  venue: VenueWithTags;
}

export default function DiscoverVenueCard({ venue }: Props) {
  if (!venue.featured_photo_url) {
    return <VenueTypographicCard venue={venue} variant="standard" />;
  }

  const eyebrowParts = [
    venue.subcategory ?? getCategorySingular(venue.category),
    venue.neighborhood_name,
  ].filter(Boolean);
  const isOpen = venue.is_open_late || venue.is_24_hours;
  const ratingLabel = venue.google_rating?.toFixed(1) ?? "—";

  return (
    <Link
      href={`/venue/${venue.slug}`}
      className="group block bg-white rounded-[14px] overflow-hidden hover: hover:-translate-y-1 transition-all duration-200 ease-out"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-stone">
        <Image
          src={venue.featured_photo_url}
          alt={venue.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 40vw, 28vw"
          className="object-cover transition-transform duration-500 group-"
        />
        <div className="absolute top-2.5 left-2.5">
          <BestScoreBadge score={venue.final_score} />
        </div>
      </div>

      <div className="px-3.5 pt-3 pb-3.5">
        <div className="flex items-baseline justify-between gap-2">
          <div className="text-micro font-bold tracking-[0.18em] uppercase text-stone-deep truncate">
            {eyebrowParts.join(" · ")}
          </div>
          <div className="shrink-0 flex items-center gap-1 text-micro font-bold text-ink">
            <Star className="w-2.5 h-2.5 fill-calamansi stroke-calamansi" aria-hidden />
            {ratingLabel}
          </div>
        </div>
        <h4 className="mt-1 font-display text-body-lg font-bold text-ink leading-[1.15] tracking-[-0.015em] line-clamp-2">
          {venue.name}
        </h4>
        {venue.short_description && (
          <p className="mt-1.5 text-micro text-stone-deep leading-[1.4] line-clamp-2">
            {venue.short_description}
          </p>
        )}
        <div className="mt-2 flex items-center justify-between">
          <span className="text-micro font-semibold text-stone-deep">
            {venue.price_level ? (
              <>
                <span className="text-ink">
                  {getPriceSymbol(venue.price_level)}
                </span>
                <span className="text-stone-deep">
                  {"₱".repeat(4 - venue.price_level)}
                </span>
              </>
            ) : (
              <span className="text-stone-deep">₱₱₱₱</span>
            )}
          </span>
          <span
            className={
              isOpen
                ? "flex items-center gap-1.5 text-micro font-bold text-live"
                : "flex items-center gap-1.5 text-micro font-bold text-stone-deep"
            }
          >
            <span
              className={
                isOpen
                  ? "w-1.5 h-1.5 rounded-full bg-live"
                  : "w-1.5 h-1.5 rounded-full bg-stone-deep"
              }
            />
            {isOpen ? "Open late" : "Standard hours"}
          </span>
        </div>
      </div>
    </Link>
  );
}

