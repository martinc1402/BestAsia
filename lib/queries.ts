import { createServerClient } from "./supabase";
import type {
  VenueWithTags,
  CuratedList,
  CuratedListItem,
  Neighborhood,
  QuizQuestion,
} from "./types";

function getClient() {
  return createServerClient();
}

export async function getVenuesByCategory(
  city: string,
  category: string,
  limit = 20
): Promise<VenueWithTags[]> {
  const { data, error } = await getClient()
    .from("venue_with_tags")
    .select("*")
    .eq("city_slug", city)
    .eq("category", category)
    .eq("status", "active")
    .order("best_score", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function getTopVenues(
  city: string,
  limit = 12
): Promise<VenueWithTags[]> {
  const { data, error } = await getClient()
    .from("venue_with_tags")
    .select("*")
    .eq("city_slug", city)
    .eq("status", "active")
    .order("best_score", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function getVenueBySlug(
  slug: string
): Promise<VenueWithTags | null> {
  const { data, error } = await getClient()
    .from("venue_with_tags")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data;
}

export async function getSimilarVenues(
  venue: VenueWithTags,
  limit = 4
): Promise<VenueWithTags[]> {
  const { data, error } = await getClient()
    .from("venue_with_tags")
    .select("*")
    .eq("city_slug", venue.city_slug)
    .eq("category", venue.category)
    .eq("status", "active")
    .neq("id", venue.id)
    .order("best_score", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function getCuratedLists(): Promise<CuratedList[]> {
  const { data, error } = await getClient()
    .from("curated_lists")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getCuratedListsWithCounts(): Promise<
  (CuratedList & { venue_count: number })[]
> {
  const { data, error } = await getClient()
    .from("curated_lists")
    .select("*, curated_list_items(count)")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row: CuratedList & { curated_list_items?: { count: number }[] }) => ({
    ...row,
    venue_count: row.curated_list_items?.[0]?.count ?? 0,
  }));
}

export type DiscoverSort =
  | "best"
  | "rating"
  | "price-low"
  | "price-high"
  | "name";

export interface DiscoverFilters {
  city?: string;
  category?: string;
  neighborhood?: string;
  priceLevel?: number;
  tags?: string[];
  openNow?: boolean;
  topRated?: boolean;
  sort?: DiscoverSort;
  limit?: number;
}

export async function getDiscoverVenues(
  filters: DiscoverFilters
): Promise<VenueWithTags[]> {
  // Tag-based pre-filter: get venue IDs that match any selected tag (OR within
  // the section). Returns early if no matches.
  let tagVenueIds: string[] | null = null;
  if (filters.tags && filters.tags.length > 0) {
    const { data: tagRows } = await getClient()
      .from("tags")
      .select("id")
      .in("name", filters.tags);
    const tagIds = (tagRows ?? []).map((r: { id: string }) => r.id);
    if (tagIds.length === 0) return [];

    const { data: vtRows } = await getClient()
      .from("venue_tags")
      .select("venue_id")
      .in("tag_id", tagIds)
      .eq("is_rejected", false);
    tagVenueIds = [
      ...new Set((vtRows ?? []).map((r: { venue_id: string }) => r.venue_id)),
    ];
    if (tagVenueIds.length === 0) return [];
  }

  let query = getClient()
    .from("venue_with_tags")
    .select("*")
    .eq("status", "active");

  if (filters.city) query = query.eq("city_slug", filters.city);
  if (filters.category) query = query.eq("category", filters.category);
  if (filters.neighborhood)
    query = query.eq("neighborhood_slug", filters.neighborhood);
  if (filters.priceLevel) query = query.eq("price_level", filters.priceLevel);
  if (filters.openNow) {
    query = query.or("is_open_late.eq.true,is_24_hours.eq.true");
  }
  if (filters.topRated) query = query.gte("best_score", 90);
  if (tagVenueIds !== null) query = query.in("id", tagVenueIds);

  switch (filters.sort) {
    case "name":
      query = query.order("name", { ascending: true });
      break;
    case "rating":
      query = query.order("google_rating", {
        ascending: false,
        nullsFirst: false,
      });
      break;
    case "price-low":
      query = query.order("price_level", {
        ascending: true,
        nullsFirst: false,
      });
      break;
    case "price-high":
      query = query.order("price_level", {
        ascending: false,
        nullsFirst: false,
      });
      break;
    default:
      query = query.order("best_score", {
        ascending: false,
        nullsFirst: false,
      });
  }

  query = query.limit(filters.limit ?? 40);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export interface ListPreviewVenue {
  name: string;
  slug: string;
  featured_photo_url: string | null;
}

export async function getListPreviewVenues(
  listId: string,
  limit = 5
): Promise<ListPreviewVenue[]> {
  const { data, error } = await getClient()
    .from("curated_list_items")
    .select("venues(name, slug, featured_photo_url)")
    .eq("list_id", listId)
    .order("position")
    .limit(limit);

  if (error) return [];
  const rows = (data ?? []) as Array<{
    venues: ListPreviewVenue | ListPreviewVenue[] | null;
  }>;
  return rows
    .map((row) => (Array.isArray(row.venues) ? row.venues[0] : row.venues))
    .filter((v): v is ListPreviewVenue => !!v);
}

export interface EnrichedListItem {
  id: string;
  list_id: string;
  venue_id: string;
  position: number;
  editorial_note: string | null;
  venue: VenueWithTags | null;
}

export async function getCuratedListBySlugEnriched(
  slug: string
): Promise<{ list: CuratedList; items: EnrichedListItem[] } | null> {
  const { data: list, error: listError } = await getClient()
    .from("curated_lists")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (listError) {
    if (listError.code === "PGRST116") return null;
    throw listError;
  }

  const { data: items, error: itemsError } = await getClient()
    .from("curated_list_items")
    .select("id, list_id, venue_id, position, editorial_note")
    .eq("list_id", list.id)
    .order("position");

  if (itemsError) throw itemsError;
  if (!items || items.length === 0) return { list, items: [] };

  const venueIds = items.map((i) => i.venue_id);
  const { data: venues } = await getClient()
    .from("venue_with_tags")
    .select("*")
    .in("id", venueIds);

  const venueMap = new Map<string, VenueWithTags>(
    (venues ?? []).map((v: VenueWithTags) => [v.id, v])
  );

  return {
    list,
    items: items.map((i) => ({
      ...i,
      venue: venueMap.get(i.venue_id) ?? null,
    })),
  };
}

export async function getCuratedListBySlug(
  slug: string
): Promise<{ list: CuratedList; items: CuratedListItem[] } | null> {
  const { data: list, error: listError } = await getClient()
    .from("curated_lists")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (listError) {
    if (listError.code === "PGRST116") return null;
    throw listError;
  }

  const { data: items, error: itemsError } = await getClient()
    .from("curated_list_items")
    .select("*, venues(*)")
    .eq("list_id", list.id)
    .order("position");

  if (itemsError) throw itemsError;

  return {
    list,
    items: (items ?? []).map((item: Record<string, unknown>) => ({
      ...item,
      curated_lists: list,
    })) as CuratedListItem[],
  };
}

export async function getNeighborhoods(
  citySlug = "manila"
): Promise<Neighborhood[]> {
  const { data: city } = await getClient()
    .from("cities")
    .select("id")
    .eq("slug", citySlug)
    .single();

  if (!city) return [];

  const { data, error } = await getClient()
    .from("neighborhoods")
    .select("*")
    .eq("city_id", city.id)
    .order("name");

  if (error) throw error;
  return data ?? [];
}

export async function getNeighborhoodsWithCounts(
  citySlug = "manila"
): Promise<(Neighborhood & { venue_count: number })[]> {
  const hoods = await getNeighborhoods(citySlug);
  if (hoods.length === 0) return [];

  const counts = await Promise.all(
    hoods.map(async (h) => {
      const { count } = await getClient()
        .from("venue_with_tags")
        .select("*", { count: "exact", head: true })
        .eq("neighborhood_slug", h.slug)
        .eq("status", "active");
      return { ...h, venue_count: count ?? 0 };
    })
  );

  return counts.sort((a, b) => b.venue_count - a.venue_count);
}

export async function getSpotlightVenue(
  citySlug = "manila"
): Promise<VenueWithTags | null> {
  const { data, error } = await getClient()
    .from("venue_with_tags")
    .select("*")
    .eq("city_slug", citySlug)
    .eq("status", "active")
    .not("short_description", "is", null)
    .not("featured_photo_url", "is", null)
    .order("best_score", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();

  if (error) return null;
  return data;
}

export interface HotListOptions {
  citySlug?: string;
  category?: "cafe" | "bar" | "restaurant" | "nightclub";
  cuisineTag?: string;
  sort?: "best_score" | "popularity" | "newest";
  limit?: number;
}

export async function getHotListVenues({
  citySlug = "manila",
  category,
  cuisineTag,
  sort = "best_score",
  limit = 6,
}: HotListOptions = {}): Promise<VenueWithTags[]> {
  let venueIds: string[] | null = null;

  if (cuisineTag) {
    const { data: tag } = await getClient()
      .from("tags")
      .select("id")
      .eq("name", cuisineTag)
      .maybeSingle();

    if (!tag) return [];

    const { data: tagRows } = await getClient()
      .from("venue_tags")
      .select("venue_id, confidence")
      .eq("tag_id", tag.id)
      .eq("is_rejected", false)
      .order("confidence", { ascending: false })
      .limit(200);

    venueIds = (tagRows ?? []).map((r) => r.venue_id);
    if (venueIds.length === 0) return [];
  }

  let query = getClient()
    .from("venue_with_tags")
    .select("*")
    .eq("city_slug", citySlug)
    .eq("status", "active");

  if (category) query = query.eq("category", category);
  if (venueIds) query = query.in("id", venueIds);

  if (sort === "newest") {
    query = query.order("created_at", { ascending: false });
  } else if (sort === "popularity") {
    query = query.order("google_review_count", {
      ascending: false,
      nullsFirst: false,
    });
  } else {
    query = query.order("best_score", {
      ascending: false,
      nullsFirst: false,
    });
  }

  const { data, error } = await query.limit(limit);
  if (error) return [];
  return data ?? [];
}

export async function getQuizQuestions(): Promise<QuizQuestion[]> {
  const { data, error } = await getClient()
    .from("quiz_questions")
    .select("*, quiz_options(id, label, description, tag_id)")
    .eq("is_active", true)
    .order("sort_order");

  if (error) throw error;
  return data ?? [];
}

export async function getQuizResults(
  tagIds: string[],
  limit = 5
): Promise<(VenueWithTags & { match_count: number })[]> {
  const { data, error } = await getClient().rpc("get_quiz_results", {
    selected_tag_ids: tagIds,
    result_limit: limit,
  });

  if (error) {
    // Fallback: manual query if RPC doesn't exist
    const { data: tagData, error: tagError } = await getClient()
      .from("venue_tags")
      .select("venue_id, confidence")
      .in("tag_id", tagIds)
      .eq("is_rejected", false);

    if (tagError) throw tagError;

    // Aggregate matches per venue
    const venueScores = new Map<string, { count: number; totalConf: number }>();
    for (const row of tagData ?? []) {
      const existing = venueScores.get(row.venue_id) || {
        count: 0,
        totalConf: 0,
      };
      existing.count++;
      existing.totalConf += Number(row.confidence);
      venueScores.set(row.venue_id, existing);
    }

    // Sort by match count, then confidence
    const sorted = [...venueScores.entries()]
      .sort(
        (a, b) =>
          b[1].count - a[1].count || b[1].totalConf - a[1].totalConf
      )
      .slice(0, limit);

    const venueIds = sorted.map(([id]) => id);
    if (venueIds.length === 0) return [];

    const { data: venues, error: venueError } = await getClient()
      .from("venue_with_tags")
      .select("*")
      .in("id", venueIds)
      .eq("status", "active");

    if (venueError) throw venueError;

    return venueIds
      .map((id) => {
        const venue = venues?.find((v: VenueWithTags) => v.id === id);
        if (!venue) return null;
        return { ...venue, match_count: venueScores.get(id)!.count };
      })
      .filter(Boolean) as (VenueWithTags & { match_count: number })[];
  }

  return data ?? [];
}

export interface SearchResult {
  id: string;
  slug: string;
  name: string;
  category: string;
  neighborhood_name: string | null;
  featured_photo_url: string | null;
  best_score: number | null;
  price_level: number | null;
}

export async function searchVenues(
  q: string,
  limit = 8
): Promise<SearchResult[]> {
  const trimmed = q.trim();
  if (!trimmed) return [];

  const escaped = trimmed.replace(/[%_]/g, "\\$&");

  const { data, error } = await getClient()
    .from("venue_with_tags")
    .select(
      "id, slug, name, category, neighborhood_name, featured_photo_url, best_score, price_level"
    )
    .eq("status", "active")
    .or(`name.ilike.%${escaped}%,neighborhood_name.ilike.%${escaped}%`)
    .order("best_score", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) return [];
  return data ?? [];
}

export async function getActiveVenueCount(city = "manila"): Promise<number> {
  const { count, error } = await getClient()
    .from("venue_with_tags")
    .select("*", { count: "exact", head: true })
    .eq("city_slug", city)
    .eq("status", "active");

  if (error) return 0;
  return count ?? 0;
}

export async function getCategoryCount(
  city: string,
  category: string
): Promise<number> {
  const { count, error } = await getClient()
    .from("venue_with_tags")
    .select("*", { count: "exact", head: true })
    .eq("city_slug", city)
    .eq("category", category)
    .eq("status", "active");

  if (error) return 0;
  return count ?? 0;
}
