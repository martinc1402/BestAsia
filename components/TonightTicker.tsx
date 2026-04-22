"use client";

import { useEffect, useState } from "react";

const ITEMS = [
  "Manila · Helm — Thursday tasting menu, seatings from 7",
  "Manila · The Curator — new amaro on the back bar",
  "Manila · Poblacion — ramen pop-up till 1 AM",
  "Manila · Yardstick — Kenyan AA on the filter bar all week",
  "Manila · Toyo Eatery — chef's counter just opened bookings",
  "Manila · Oto — fresh vinyl drop, first pour on the house",
  "Cebu · Boracay · Siargao — coming 2026",
];

// Stub values — replace with a weather API + last-updated timestamp on the venue feed.
const TEMP_C = 29;
const UPDATED_MINUTES_AGO = 8;

export default function TonightTicker() {
  const [clock, setClock] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const h = now.getHours();
      const m = String(now.getMinutes()).padStart(2, "0");
      const ampm = h >= 12 ? "PM" : "AM";
      const hh = h % 12 || 12;
      setClock(`${hh}:${m} ${ampm}`);
    };
    tick();
    const t = setInterval(tick, 30_000);
    return () => clearInterval(t);
  }, []);

  const line = ITEMS.join("  ·  ");

  return (
    <div
      className="relative z-[5] bg-volcanic border-b border-stone/10"
      style={{ isolation: "isolate" }}
    >
      <div className="max-w-screen-2xl mx-auto h-10 flex items-center gap-3 sm:gap-4 px-4 sm:px-8 lg:px-10 font-mono text-micro overflow-hidden">
        {/* Live status strip — JetBrains Mono per design-system §Live strip. */}
        <span className="shrink-0 flex items-center gap-2">
          <span
            aria-hidden
            className="w-1.5 h-1.5 rounded-full bg-coral animate-pulse-live"
          />
          <span className="text-paper uppercase font-semibold">Manila</span>
          {clock && <span className="text-paper/60">· {clock}</span>}
          <span className="hidden sm:inline text-paper/55">· {TEMP_C}°C</span>
          <span className="hidden md:inline text-paper/45">
            · updated {UPDATED_MINUTES_AGO} min ago
          </span>
        </span>
        <span aria-hidden className="hidden sm:block shrink-0 w-px h-4 bg-paper/15" />
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="whitespace-nowrap animate-ticker text-paper/80 font-semibold">
            <span>{line}</span>
            <span className="ml-12">{line}</span>
          </div>
        </div>
        <span aria-hidden className="hidden sm:block shrink-0 w-px h-4 bg-paper/15" />
        <a
          href="#tonight"
          className="shrink-0 text-calamansi font-bold hover:text-coral transition-colors"
        >
          Tonight →
        </a>
      </div>
    </div>
  );
}
