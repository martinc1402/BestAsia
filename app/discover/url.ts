export interface DiscoverSP {
  category?: string;
  neighborhood?: string;
  price?: string;
  sort?: string;
  tags?: string;
  open?: string;
  top?: string;
}

export function buildHref(
  sp: DiscoverSP,
  patch: Partial<DiscoverSP>
): string {
  const merged: DiscoverSP = { ...sp, ...patch };
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(merged)) {
    if (v !== undefined && v !== "") params.set(k, String(v));
  }
  const qs = params.toString();
  return qs ? `/discover?${qs}` : "/discover";
}

export function activeTags(sp: DiscoverSP): string[] {
  return sp.tags ? sp.tags.split(",").filter(Boolean) : [];
}

export function toggleTagsParam(
  sp: DiscoverSP,
  tag: string
): string | undefined {
  const tags = activeTags(sp);
  const next = tags.includes(tag)
    ? tags.filter((t) => t !== tag)
    : [...tags, tag];
  return next.length ? next.join(",") : undefined;
}

export function activeFilterCount(sp: DiscoverSP): number {
  return (
    (sp.category ? 1 : 0) +
    (sp.neighborhood ? 1 : 0) +
    (sp.price ? 1 : 0) +
    (sp.open === "1" ? 1 : 0) +
    (sp.top === "1" ? 1 : 0) +
    activeTags(sp).length
  );
}
