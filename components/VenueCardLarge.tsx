import Image from "next/image";
import Link from "next/link";
import type { VenueWithTags } from "@/lib/types";
import BestScoreBadge from "./BestScoreBadge";
import TagBadge from "./TagBadge";
import VenueTypographicCard from "./VenueTypographicCard";
import { getPriceSymbol, getCategorySingular } from "@/lib/utils";

interface VenueCardLargeProps {
  venue: VenueWithTags;
  position: number;
  editorialNote?: string | null;
}

export default function VenueCardLarge({ venue, position, editorialNote }: VenueCardLargeProps) {
  if (!venue.featured_photo_url) {
    return (
      <div className="flex gap-4 sm:gap-6">
        <div className="flex-shrink-0 w-8 pt-1">
          <span className="text-h3 font-display font-semibold text-stone">{position}</span>
        </div>
        <div className="flex-1">
          <VenueTypographicCard venue={venue} variant="featured" />
        </div>
      </div>
    );
  }

  const topTags = (venue.tags ?? [])
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3);

  return (
    <div className="flex gap-4 sm:gap-6">
      <div className="flex-shrink-0 w-8 pt-1">
        <span className="text-h3 font-display font-semibold text-border">{position}</span>
      </div>
      <Link
        href={`/venue/${venue.slug}`}
        className="group flex-1 bg-paper rounded-xl overflow-hidden hover: transition-all duration-200 flex flex-col sm:flex-row"
      >
        <div className="relative sm:w-56 aspect-[16/10] sm:aspect-auto bg-paper flex-shrink-0 overflow-hidden">
          <Image
            src={venue.featured_photo_url}
            alt={venue.name}
            fill
            className="object-cover group- transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, 224px"
          />
          <div className="absolute top-2 left-2">
            <BestScoreBadge score={venue.final_score} />
          </div>
        </div>
        <div className="p-4 flex-1">
          <h3 className="font-semibold text-ink group-hover:text-rust transition-colors">
            {venue.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1 text-body-sm text-stone-deep">
            {venue.neighborhood_name && <span>{venue.neighborhood_name}</span>}
            <span className="text-border">·</span>
            <span>{getCategorySingular(venue.category)}</span>
            {venue.price_level && (
              <>
                <span className="text-border">·</span>
                <span>{getPriceSymbol(venue.price_level)}</span>
              </>
            )}
          </div>
          {editorialNote && (
            <p className="mt-2 text-body-sm text-stone-deep italic line-clamp-2">{editorialNote}</p>
          )}
          {topTags.length > 0 && (
            <div className="flex gap-1.5 mt-3 flex-wrap">
              {topTags.map((tag) => (
                <TagBadge key={tag.tag_id} name={tag.display_name} dimension={tag.dimension} />
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
