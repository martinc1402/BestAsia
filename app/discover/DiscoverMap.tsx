"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { VenueWithTags } from "@/lib/types";
import { getPriceSymbol } from "@/lib/utils";

const BBOX = {
  minLat: 14.4,
  maxLat: 14.72,
  minLng: 120.95,
  maxLng: 121.1,
};

function project(lat: number, lng: number): { x: number; y: number } {
  const x =
    ((lng - BBOX.minLng) / (BBOX.maxLng - BBOX.minLng)) * 100;
  const y =
    (1 - (lat - BBOX.minLat) / (BBOX.maxLat - BBOX.minLat)) * 100;
  return {
    x: Math.max(6, Math.min(94, x)),
    y: Math.max(6, Math.min(94, y)),
  };
}

interface Props {
  venues: VenueWithTags[];
}

export default function DiscoverMap({ venues }: Props) {
  const [hover, setHover] = useState<string | null>(null);
  const placeable = venues.filter(
    (v): v is VenueWithTags & { latitude: number; longitude: number } =>
      v.latitude != null && v.longitude != null
  );
  const hovered = placeable.find((v) => v.id === hover);

  return (
    <div className="sticky top-0 h-[calc(100vh-68px)] min-h-[820px] border-l border-outline-variant bg-[#E8EDE2] overflow-hidden">
      <div className="relative w-full h-full">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 420 820"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          <defs>
            <pattern
              id="dt-map-grid"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 24 0 L 0 0 0 24"
                fill="none"
                stroke="rgba(0,0,0,0.04)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="420" height="820" fill="#E8EDE2" />
          <rect width="420" height="820" fill="url(#dt-map-grid)" />
          <path
            d="M 0 340 Q 150 320 420 360"
            fill="none"
            stroke="#fff"
            strokeWidth="7"
          />
          <path
            d="M 0 520 Q 200 500 420 540"
            fill="none"
            stroke="#fff"
            strokeWidth="5"
          />
          <path
            d="M 140 0 L 160 820"
            fill="none"
            stroke="#fff"
            strokeWidth="5"
          />
          <path
            d="M 290 0 L 310 820"
            fill="none"
            stroke="#fff"
            strokeWidth="3"
          />
          <rect
            x="200"
            y="440"
            width="80"
            height="60"
            rx="10"
            fill="#C5D9B4"
          />
          <circle cx="80" cy="200" r="40" fill="#C5D9B4" />
        </svg>

        {placeable.map((v) => {
          const { x, y } = project(v.latitude, v.longitude);
          const on = hover === v.id;
          return (
            <Link
              key={v.id}
              href={`/venue/${v.slug}`}
              onMouseEnter={() => setHover(v.id)}
              onMouseLeave={() => setHover(null)}
              className="absolute -translate-x-1/2 -translate-y-full"
              style={{ left: `${x}%`, top: `${y}%`, zIndex: on ? 20 : 10 }}
            >
              <div
                className={
                  on
                    ? "px-2.5 py-1 rounded-full bg-ink text-white text-xs font-extrabold flex items-center gap-1.5 shadow-[0_8px_18px_rgba(0,0,0,0.3)] whitespace-nowrap transition-all duration-200"
                    : "px-2.5 py-1 rounded-full bg-white text-ink text-[11px] font-extrabold flex items-center gap-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.2)] whitespace-nowrap transition-all duration-200"
                }
              >
                <span
                  className={
                    on
                      ? "w-[18px] h-[18px] rounded-full bg-saffron text-ink text-[9px] font-black flex items-center justify-center"
                      : "w-[18px] h-[18px] rounded-full bg-terra text-white text-[9px] font-black flex items-center justify-center"
                  }
                >
                  ₱{v.price_level ?? "?"}
                </span>
                {v.final_score != null ? v.final_score.toFixed(1) : "—"}
              </div>
            </Link>
          );
        })}

        {hovered && (
          <Link
            href={`/venue/${hovered.slug}`}
            className="absolute bottom-4 left-4 right-4 bg-white rounded-xl p-2.5 flex gap-2.5 shadow-[0_14px_30px_rgba(0,0,0,0.18)] z-30"
          >
            {hovered.featured_photo_url && (
              <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-surface-low">
                <Image
                  src={hovered.featured_photo_url}
                  alt={hovered.name}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-[9.5px] font-extrabold tracking-[0.15em] uppercase text-outline truncate">
                {hovered.subcategory ?? hovered.category}
              </div>
              <div className="font-[family-name:var(--font-noto-serif)] text-base font-extrabold text-ink leading-tight tracking-[-0.01em] mt-0.5 line-clamp-1">
                {hovered.name}
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-[11.5px]">
                <span className="font-extrabold flex items-center gap-1">
                  <StarIcon />{" "}
                  {hovered.google_rating?.toFixed(1) ?? "—"}
                </span>
                <span className="text-outline-variant">·</span>
                <span className="text-secondary font-semibold">
                  {getPriceSymbol(hovered.price_level)}
                </span>
              </div>
            </div>
            {hovered.final_score != null && (
              <div className="shrink-0 self-center text-[11px] font-extrabold text-terra bg-terra/10 px-2 py-1 rounded-md">
                {hovered.final_score.toFixed(1)}
              </div>
            )}
          </Link>
        )}
      </div>
    </div>
  );
}

function StarIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"
        fill="#FABD00"
      />
    </svg>
  );
}
