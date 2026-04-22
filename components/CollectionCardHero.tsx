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
      className="group relative block aspect-[3/4] rounded-[14px] overflow-hidden hover: hover:-translate-y-1 transition-all duration-[220ms]"
    >
      <Image
        src={activeImg}
        alt={title}
        fill
        className="object-cover transition-opacity duration-300"
        sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 25vw"
      />
      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/95 text-rust text-micro font-bold tracking-[0.1em]">
        TOP {count}
      </span>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h4 className="font-display text-verdict font-bold text-white leading-[1.05] tracking-[-0.02em]">
          {title}
        </h4>
        <div className="mt-1.5 text-micro text-white/70 truncate">
          {activeLabel}
        </div>
      </div>
    </Link>
  );
}
