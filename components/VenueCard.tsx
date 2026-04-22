import Image from "next/image";
import Link from "next/link";
import type { VenueWithTags } from "@/lib/types";
import BestScoreBadge from "./BestScoreBadge";
import TagBadge from "./TagBadge";
import { getPriceSymbol, getCategorySingular } from "@/lib/utils";

interface VenueCardProps {
  venue: VenueWithTags;
}

export default function VenueCard({ venue }: VenueCardProps) {
  const topTags = (venue.tags ?? [])
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 2);

  return (
    <Link
      href={`/venue/${venue.slug}`}
      className="group block bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="relative aspect-video bg-page overflow-hidden">
        {venue.featured_photo_url ? (
          <Image
            src={venue.featured_photo_url}
            alt={venue.name}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-page text-border">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-2.5 left-2.5">
          <BestScoreBadge score={venue.final_score} />
        </div>
        {venue.neighborhood_name && (
          <span className="absolute bottom-2 right-2.5 px-2 py-0.5 rounded-md bg-black/50 text-white text-[11px] font-medium backdrop-blur-sm">
            {venue.neighborhood_name}
          </span>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-medium text-sm text-body truncate">{venue.name}</h3>
        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-secondary">
          <span>{getCategorySingular(venue.category)}</span>
          {venue.price_level && (
            <>
              <span className="text-border">·</span>
              <span className="text-secondary">{getPriceSymbol(venue.price_level)}</span>
            </>
          )}
        </div>
        {topTags.length > 0 && (
          <div className="flex gap-1.5 mt-2 overflow-hidden">
            {topTags.map((tag) => (
              <TagBadge key={tag.tag_id} name={tag.display_name} dimension={tag.dimension} />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
