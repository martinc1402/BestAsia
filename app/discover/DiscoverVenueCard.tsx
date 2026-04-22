import Image from "next/image";
import Link from "next/link";
import type { VenueWithTags } from "@/lib/types";
import { getPriceSymbol, getCategorySingular } from "@/lib/utils";
import BestScoreBadge from "@/components/BestScoreBadge";

interface Props {
  venue: VenueWithTags;
}

export default function DiscoverVenueCard({ venue }: Props) {
  const eyebrowParts = [
    venue.subcategory ?? getCategorySingular(venue.category),
    venue.neighborhood_name,
  ].filter(Boolean);
  const isOpen = venue.is_open_late || venue.is_24_hours;
  const ratingLabel = venue.google_rating?.toFixed(1) ?? "—";

  return (
    <Link
      href={`/venue/${venue.slug}`}
      className="group block bg-white rounded-[14px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_14px_32px_rgba(0,0,0,0.14)] hover:-translate-y-[3px] transition-all duration-200 ease-out"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-low">
        {venue.featured_photo_url ? (
          <Image
            src={venue.featured_photo_url}
            alt={venue.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 40vw, 28vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-outline">
            <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                stroke="currentColor"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
              />
            </svg>
          </div>
        )}
        <div className="absolute top-2.5 left-2.5">
          <BestScoreBadge score={venue.final_score} />
        </div>
      </div>

      <div className="px-3.5 pt-3 pb-3.5">
        <div className="flex items-baseline justify-between gap-2">
          <div className="text-[9.5px] font-extrabold tracking-[0.18em] uppercase text-outline truncate">
            {eyebrowParts.join(" · ")}
          </div>
          <div className="shrink-0 flex items-center gap-1 text-[11.5px] font-extrabold text-ink">
            <StarIcon />
            {ratingLabel}
          </div>
        </div>
        <h4 className="mt-1 font-[family-name:var(--font-noto-serif)] text-[17px] font-extrabold text-ink leading-[1.15] tracking-[-0.015em] line-clamp-2">
          {venue.name}
        </h4>
        {venue.short_description && (
          <p className="mt-1.5 text-[11.5px] text-secondary leading-[1.4] line-clamp-2">
            {venue.short_description}
          </p>
        )}
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-secondary">
            {venue.price_level ? (
              <>
                <span className="text-ink">
                  {getPriceSymbol(venue.price_level)}
                </span>
                <span className="text-outline-variant">
                  {"₱".repeat(4 - venue.price_level)}
                </span>
              </>
            ) : (
              <span className="text-outline-variant">₱₱₱₱</span>
            )}
          </span>
          <span
            className={
              isOpen
                ? "flex items-center gap-1.5 text-[10.5px] font-bold text-[#2A7F2A]"
                : "flex items-center gap-1.5 text-[10.5px] font-bold text-outline"
            }
          >
            <span
              className={
                isOpen
                  ? "w-1.5 h-1.5 rounded-full bg-[#2A7F2A]"
                  : "w-1.5 h-1.5 rounded-full bg-outline"
              }
            />
            {isOpen ? "Open late" : "Standard hours"}
          </span>
        </div>
      </div>
    </Link>
  );
}

function StarIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"
        fill="#FABD00"
      />
    </svg>
  );
}
