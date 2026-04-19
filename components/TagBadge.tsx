import type { TagDimension } from "@/lib/types";
import { TAG_COLORS } from "@/lib/utils";

interface TagBadgeProps {
  name: string;
  dimension: TagDimension;
}

export default function TagBadge({ name, dimension }: TagBadgeProps) {
  const colors = TAG_COLORS[dimension];
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${colors.bg} ${colors.text}`}
    >
      {name}
    </span>
  );
}
