import Image from "next/image";
import Link from "next/link";
import type { VenueWithTags } from "@/lib/types";
import BestScoreBadge from "./BestScoreBadge";
import TagBadge from "./TagBadge";
import VenueTypographicCard from "./VenueTypographicCard";
import { getPriceSymbol, getCategorySingular } from "@/lib/utils";

interface VenueCardProps {
  venue: VenueWithTags;
}

export default function VenueCard({ venue }: VenueCardProps) {
  if (!venue.featured_photo_url) {
    return <VenueTypographicCard venue={venue} variant="standard" />;
  }

  const topTags = (venue.tags ?? [])
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 2);

  return (
    <Link
      href={`/venue/${venue.slug}`}
      className="group block bg-paper rounded-xl overflow-hidden hover: transition-all duration-200"
    >
      <div className="relative aspect-video bg-paper overflow-hidden">
        <Image
          src={venue.featured_photo_url}
          alt={venue.name}
          fill
          className="object-cover group- transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute top-2.5 left-2.5">
          <BestScoreBadge score={venue.final_score} />
        </div>
        {venue.neighborhood_name && (
          <span className="absolute bottom-2 right-2.5 px-2 py-0.5 rounded-md bg-black/50 text-white text-micro font-semibold ">
            {venue.neighborhood_name}
          </span>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-body-sm text-ink truncate">{venue.name}</h3>
        <div className="flex items-center gap-1.5 mt-0.5 text-micro text-stone-deep">
          <span>{getCategorySingular(venue.category)}</span>
          {venue.price_level && (
            <>
              <span className="text-border">·</span>
              <span className="text-stone-deep">{getPriceSymbol(venue.price_level)}</span>
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
