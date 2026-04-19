"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface PreviewVenue {
  name: string;
  slug: string;
  featured_photo_url: string | null;
}

interface CollectionCardHeroProps {
  slug: string;
  title: string;
  cover: string;
  count: number;
  author?: string;
  updated?: string;
  previews: PreviewVenue[];
}

export default function CollectionCardHero({
  slug,
  title,
  cover,
  count,
  author,
  updated,
  previews,
}: CollectionCardHeroProps) {
  const [hover, setHover] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!hover) return;
    const cycleable = previews.slice(0, 4).filter((p) => p.featured_photo_url);
    if (cycleable.length === 0) return;
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % cycleable.length);
    }, 900);
    return () => clearInterval(t);
  }, [hover, previews]);

  const cycleable = previews.slice(0, 4).filter((p) => p.featured_photo_url);
  const activeImg =
    hover && cycleable[idx]?.featured_photo_url
      ? cycleable[idx].featured_photo_url!
      : cover;
  const activeLabel =
    hover && cycleable[idx] ? `#${idx + 1} · ${cycleable[idx].name}` : `${updated ?? ""}${author ? ` · ${author}` : ""}`;

  return (
    <Link
      href={`/best/${slug}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group relative block aspect-[3/4] rounded-[14px] overflow-hidden shadow-[0_3px_10px_rgba(0,0,0,0.08)] hover:shadow-[0_14px_28px_rgba(0,0,0,0.18)] hover:-translate-y-[3px] transition-all duration-[220ms]"
    >
      <Image
        src={activeImg}
        alt={title}
        fill
        className="object-cover transition-opacity duration-300"
        sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 25vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" style={{ backgroundImage: "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.9) 100%)" }} />
      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/95 text-terra text-[10px] font-black tracking-[0.1em]">
        TOP {count}
      </span>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h4 className="font-[family-name:var(--font-noto-serif)] text-[22px] font-black text-white leading-[1.05] tracking-[-0.02em]">
          {title}
        </h4>
        <div className="mt-1.5 text-[11px] text-white/70 truncate">
          {activeLabel}
        </div>
      </div>
    </Link>
  );
}
