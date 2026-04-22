import type { TagDimension } from "./types";

export function getPriceSymbol(level: number | null): string {
  if (!level) return "";
  return "₱".repeat(level);
}

export const TAG_COLORS: Record<
  TagDimension,
  { bg: string; text: string }
> = {
  occasion: { bg: "bg-seafoam", text: "text-teal" },
  vibe: { bg: "bg-stone", text: "text-ink" },
  cuisine: { bg: "bg-stone", text: "text-rust" },
  practical: { bg: "bg-stone", text: "text-stone-deep" },
  budget: { bg: "bg-stone", text: "text-stone-deep" },
  highlight: { bg: "bg-rust/10", text: "text-rust" },
};

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    restaurant: "Restaurants",
    bar: "Bars",
    cafe: "Cafes",
    nightclub: "Nightclubs",
  };
  return labels[category] || category;
}

export function getCategorySingular(category: string): string {
  const labels: Record<string, string> = {
    restaurant: "Restaurant",
    bar: "Bar",
    cafe: "Cafe",
    nightclub: "Nightclub",
  };
  return labels[category] || category;
}

// Score-tier color per design-system.md §Score-specific palette.
// 9.0+ rust (canon), 7.0–8.9 ink, 6.0–6.9 stone-deep (mid), 5.0–5.9 ember (low).
export function scoreColor(score: number | null | undefined): string {
  if (score == null) return "text-stone-deep";
  if (score >= 9.0) return "text-rust";
  if (score >= 7.0) return "text-ink";
  if (score >= 6.0) return "text-stone-deep";
  return "text-ember";
}
