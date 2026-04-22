import Image from "next/image";
import Link from "next/link";
import type { VenueWithTags } from "@/lib/types";
import BestScoreBadge from "./BestScoreBadge";
import TagBadge from "./TagBadge";
import { getPriceSymbol, getCategorySingular } from "@/lib/utils";

interface VenueCardLargeProps {
  venue: VenueWithTags;
  position: number;
  editorialNote?: string | null;
}

export default function VenueCardLarge({ venue, position, editorialNote }: VenueCardLargeProps) {
  const topTags = (venue.tags ?? [])
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3);

  return (
    <div className="flex gap-4 sm:gap-6">
      <div className="flex-shrink-0 w-8 pt-1">
        <span className="text-2xl font-serif font-medium text-border">{position}</span>
      </div>
      <Link
        href={`/venue/${venue.slug}`}
        className="group flex-1 bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row"
      >
        <div className="relative sm:w-56 aspect-[16/10] sm:aspect-auto bg-page flex-shrink-0 overflow-hidden">
          {venue.featured_photo_url ? (
            <Image
              src={venue.featured_photo_url}
              alt={venue.name}
              fill
              className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, 224px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-page text-border">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
            </div>
          )}
          <div className="absolute top-2 left-2">
            <BestScoreBadge score={venue.final_score} />
          </div>
        </div>
        <div className="p-4 flex-1">
          <h3 className="font-medium text-body group-hover:text-terra transition-colors">
            {venue.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1 text-sm text-secondary">
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
            <p className="mt-2 text-sm text-secondary italic line-clamp-2">{editorialNote}</p>
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
