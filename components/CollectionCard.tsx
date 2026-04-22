import Image from "next/image";
import Link from "next/link";
import { Store } from "lucide-react";
import type { CuratedList } from "@/lib/types";

interface CollectionCardProps {
  list: CuratedList;
  venueCount?: number;
  imageUrl?: string;
}

const LIST_IMAGES: Record<string, string> = {
  "rooftop-bars-manila":
    // TODO: replace with commissioned/editorial photography
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&q=80",
  "best-nightclubs-manila":
    // TODO: replace with commissioned/editorial photography
    "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=900&q=80",
  "best-filipino-restaurants-manila":
    // TODO: replace with commissioned/editorial photography
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&q=80",
  "top-bars-bgc":
    // TODO: replace with commissioned/editorial photography
    "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=900&q=80",
  "best-date-night-makati":
    // TODO: replace with commissioned/editorial photography
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=900&q=80",
  "best-cafes-remote-work-manila":
    // TODO: replace with commissioned/editorial photography
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=900&q=80",
  "top-bars-poblacion":
    // TODO: replace with commissioned/editorial photography
    "https://images.unsplash.com/photo-1525268323446-0505b6fe7778?w=900&q=80",
  "top-restaurants-manila":
    // TODO: replace with commissioned/editorial photography
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80",
};

export default function CollectionCard({ list, venueCount, imageUrl }: CollectionCardProps) {
  const bgImage = imageUrl || LIST_IMAGES[list.slug];

  return (
    <Link
      href={`/best/${list.slug}`}
      className="group relative block rounded-2xl overflow-hidden aspect-[4/5] hover: transition-shadow duration-300"
    >
      {bgImage ? (
        <Image
          src={bgImage}
          alt={list.title}
          fill
          className="object-cover group- transition-transform duration-500"
          sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 320px"
        />
      ) : (
        <div className="absolute inset-0 bg-stone" />
      )}

      <div className="relative h-full flex flex-col justify-end p-5">
        {venueCount !== undefined && (
          <span className="inline-flex items-center gap-1 self-start mb-2 px-2.5 py-1 rounded-full bg-paper/15 text-paper/90 text-micro font-semibold">
            <Store className="w-3.5 h-3.5" />
            {venueCount} venues
          </span>
        )}
        <h3 className="font-display font-semibold text-white text-verdict leading-tight">
          {list.title}
        </h3>
        {list.description && (
          <p className="mt-1.5 text-body-sm text-white/70 leading-snug line-clamp-2">
            {list.description}
          </p>
        )}
      </div>
    </Link>
  );
}
