export type TagDimension =
  | "occasion"
  | "vibe"
  | "cuisine"
  | "practical"
  | "budget"
  | "highlight";

export interface Tag {
  id: string;
  dimension: TagDimension;
  name: string;
  display_name: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
}

export interface VenueTag {
  tag_id: string;
  dimension: TagDimension;
  name: string;
  display_name: string;
  confidence: number;
  source: "api" | "ai_inferred" | "manual";
}

export interface Venue {
  id: string;
  name: string;
  slug: string;
  category: "bar" | "restaurant" | "cafe" | "nightclub";
  subcategory: string | null;
  city_id: string;
  neighborhood_id: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  website: string | null;
  instagram: string | null;
  facebook_url: string | null;
  opening_hours: Record<string, string> | null;
  price_level: 1 | 2 | 3 | 4 | null;
  is_open_late: boolean;
  is_24_hours: boolean;
  google_rating: number | null;
  google_review_count: number | null;
  google_place_id: string | null;
  best_score: number | null;
  best_score_rank: number | null;
  score_quality: number | null;
  score_popularity: number | null;
  score_recency: number | null;
  score_trending: number | null;
  score_editorial: number | null;
  editorial_notes: string | null;
  short_description: string | null;
  featured_photo_url: string | null;
  status: "active" | "unverified" | "closed" | "flagged";
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface VenueWithTags extends Venue {
  tags: VenueTag[] | null;
  city_slug: string;
  city_name: string;
  neighborhood_name: string | null;
  neighborhood_slug: string | null;
}

export interface Neighborhood {
  id: string;
  city_id: string;
  name: string;
  slug: string;
  description: string | null;
  latitude: number;
  longitude: number;
  radius_meters: number;
}

export interface CuratedList {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  city_id: string;
  neighborhood_id: string | null;
  category: string | null;
  meta_title: string | null;
  meta_description: string | null;
  is_published: boolean;
  is_sponsored: boolean;
  sponsor_name: string | null;
  published_at: string | null;
}

export interface CuratedListItem {
  id: string;
  list_id: string;
  venue_id: string;
  position: number;
  editorial_note: string | null;
  venues: Venue;
  curated_lists: CuratedList;
}

export interface QuizQuestion {
  id: string;
  tag_dimension: TagDimension;
  question_text: string;
  subtitle: string | null;
  sort_order: number;
  category_filter: string | null;
  is_active: boolean;
  quiz_options: QuizOption[];
}

export interface QuizOption {
  id: string;
  label: string;
  description: string | null;
  tag_id: string;
}
