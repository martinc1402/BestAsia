import Image from "next/image";
import Link from "next/link";
import type { CuratedList } from "@/lib/types";

interface CuratedListCardProps {
  list: CuratedList;
  venueCount?: number;
  imageUrl?: string;
}

const LIST_IMAGES: Record<string, string> = {
  "rooftop-bars-manila":
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&q=75",
  "best-nightclubs-manila":
    "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=600&q=75",
  "best-filipino-restaurants-manila":
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=75",
  "top-bars-bgc":
    "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&q=75",
  "best-date-night-makati":
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=75",
  "best-cafes-remote-work-manila":
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=75",
  "top-bars-poblacion":
    "https://images.unsplash.com/photo-1525268323446-0505b6fe7778?w=600&q=75",
  "top-restaurants-manila":
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=75",
};

export default function CuratedListCard({ list, venueCount, imageUrl }: CuratedListCardProps) {
  const bgImage = imageUrl || LIST_IMAGES[list.slug];

  return (
    <Link
      href={`/best/${list.slug}`}
      className="group relative block rounded-xl overflow-hidden h-32 shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.01]"
    >
      {bgImage ? (
        <Image
          src={bgImage}
          alt={list.title}
          fill
          className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, 50vw"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#2C2C2A] to-[#4A4A46]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
      <div className="relative h-full flex items-end p-4">
        <div className="flex items-center justify-between w-full">
          <div>
            <h3 className="font-medium text-white text-[15px] leading-snug">{list.title}</h3>
            {venueCount !== undefined && (
              <p className="text-xs text-white/60 mt-0.5">{venueCount} venues</p>
            )}
          </div>
          <svg
            className="w-4 h-4 text-white/40 group-hover:translate-x-1 group-hover:text-white/80 transition-all duration-200 shrink-0 ml-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
