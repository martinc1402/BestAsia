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

export default function TonightTicker() {
  const [clock, setClock] = useState<string | null>(null);
  const [weekday, setWeekday] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const h = now.getHours();
      const m = String(now.getMinutes()).padStart(2, "0");
      const ampm = h >= 12 ? "PM" : "AM";
      const hh = h % 12 || 12;
      setClock(`${hh}:${m} ${ampm}`);
      setWeekday(
        now
          .toLocaleString("en-US", { weekday: "long" })
          .toUpperCase(),
      );
    };
    tick();
    const t = setInterval(tick, 30_000);
    return () => clearInterval(t);
  }, []);

  const line = ITEMS.join("  ·  ");

  return (
    <div
      className="relative z-[5] bg-ink text-white border-b border-white/10"
      style={{ isolation: "isolate" }}
    >
      <div className="max-w-screen-2xl mx-auto h-10 flex items-center gap-4 px-4 sm:px-8 lg:px-10 text-[11.5px] font-semibold overflow-hidden">
        <span className="shrink-0 flex items-center gap-2">
          <span
            aria-hidden
            className="w-1.5 h-1.5 rounded-full bg-saffron animate-pulse"
          />
          <span className="uppercase tracking-[0.22em] text-saffron">Live</span>
          {weekday && clock && (
            <span className="hidden sm:inline text-white/60 tracking-[0.08em]">
              · {weekday} · {clock}
            </span>
          )}
        </span>
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="whitespace-nowrap animate-ticker text-white/85 tracking-[0.02em]">
            <span>{line}</span>
            <span className="ml-12">{line}</span>
          </div>
        </div>
        <a
          href="#tonight"
          className="shrink-0 text-saffron font-extrabold tracking-[0.08em] hover:opacity-80 transition"
        >
          Tonight →
        </a>
      </div>
    </div>
  );
}
