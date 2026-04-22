// Grid fallback while Mapbox integration is pending (ADR 0010, no fabricated UI).
// Renders a scrollable list of venues with score, category, and neighborhood.
// TODO: replace with a real Mapbox-powered map surface.
import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import type { VenueWithTags } from "@/lib/types";
import { getPriceSymbol } from "@/lib/utils";

interface Props {
  venues: VenueWithTags[];
}

export default function DiscoverMap({ venues }: Props) {
  return (
    <aside className="sticky top-0 h-[calc(100vh-68px)] min-h-[820px] border-l border-stone bg-paper flex flex-col">
      <div className="px-5 py-4 border-b border-stone">
        <div className="text-micro font-bold tracking-[0.18em] uppercase text-stone-deep">
          Map view
        </div>
        <div className="mt-1 text-body-sm text-stone-deep">
          Showing {venues.length} of {venues.length} venues nearby. Map coming soon.
        </div>
      </div>
      <ul className="flex-1 overflow-y-auto divide-y divide-stone">
        {venues.map((v) => (
          <li key={v.id}>
            <Link
              href={`/venue/${v.slug}`}
              className="flex gap-3 p-4 hover:bg-stone/40 transition-colors"
            >
              <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-stone">
                {v.featured_photo_url ? (
                  <Image
                    src={v.featured_photo_url}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-stone-deep">
                    <MapPin className="w-5 h-5" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-micro font-bold tracking-[0.15em] uppercase text-stone-deep truncate">
                  {v.subcategory ?? v.category}
                  {v.neighborhood_name ? ` · ${v.neighborhood_name}` : ""}
                </div>
                <div className="font-display text-body-sm font-bold text-ink leading-tight line-clamp-1 mt-0.5">
                  {v.name}
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-micro">
                  {v.final_score != null && (
                    <span className="font-bold text-rust">
                      {v.final_score.toFixed(1)}
                    </span>
                  )}
                  {v.price_level != null && (
                    <>
                      <span className="text-stone-deep">·</span>
                      <span className="text-stone-deep font-semibold">
                        {getPriceSymbol(v.price_level)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
