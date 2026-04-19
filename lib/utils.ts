import type { TagDimension } from "./types";

export function getPriceSymbol(level: number | null): string {
  if (!level) return "";
  return "₱".repeat(level);
}

export const TAG_COLORS: Record<
  TagDimension,
  { bg: string; text: string }
> = {
  occasion: { bg: "bg-tag-occasion-bg", text: "text-tag-occasion-text" },
  vibe: { bg: "bg-tag-vibe-bg", text: "text-tag-vibe-text" },
  cuisine: { bg: "bg-tag-cuisine-bg", text: "text-tag-cuisine-text" },
  practical: { bg: "bg-tag-practical-bg", text: "text-tag-practical-text" },
  budget: { bg: "bg-tag-budget-bg", text: "text-tag-budget-text" },
  highlight: { bg: "bg-tag-highlight-bg", text: "text-tag-highlight-text" },
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
