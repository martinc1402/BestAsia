import Link from "next/link";
import type { Neighborhood } from "@/lib/types";

interface NeighborhoodPillsProps {
  neighborhoods: Neighborhood[];
}

export default function NeighborhoodPills({ neighborhoods }: NeighborhoodPillsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {neighborhoods.map((hood) => (
        <Link
          key={hood.id}
          href={`/manila#${hood.slug}`}
          className="shrink-0 px-4 py-2 rounded-full border border-border text-body-sm text-stone-deep hover:bg-rust hover:text-white hover:border-rust transition-all duration-200"
        >
          {hood.name}
        </Link>
      ))}
    </div>
  );
}
