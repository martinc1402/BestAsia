import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getVenuesByCategory } from "@/lib/queries";
import VenueCard from "@/components/VenueCard";
import { getCategoryLabel } from "@/lib/utils";
import CategoryFilter from "./CategoryFilter";

const VALID_CATEGORIES = ["restaurants", "bars", "cafes", "nightclubs"];

function singularCategory(category: string): string {
  const map: Record<string, string> = {
    restaurants: "restaurant",
    bars: "bar",
    cafes: "cafe",
    nightclubs: "nightclub",
  };
  return map[category] || category;
}

interface Props {
  params: Promise<{ city: string; category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, category } = await params;
  if (!VALID_CATEGORIES.includes(category)) return { title: "Not Found" };

  const label = getCategoryLabel(singularCategory(category));
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);

  return {
    title: `Best ${label} in ${cityName}`,
    description: `Discover the best ${label.toLowerCase()} in ${cityName}, ranked by our Best Score algorithm.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { city, category } = await params;
  if (!VALID_CATEGORIES.includes(category)) notFound();

  const dbCategory = singularCategory(category);
  const venues = await getVenuesByCategory(city, dbCategory, 60);
  const label = getCategoryLabel(dbCategory);
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-h3 sm:text-h2 font-display font-semibold text-ink">
          Best {label} in {cityName}
        </h1>
        <p className="mt-2 text-stone-deep">
          {venues.length} curated {label.toLowerCase()} ranked by Best Score
        </p>
      </div>

      <CategoryFilter city={city} active={category} />

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {venues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>

      {venues.length === 0 && (
        <div className="text-center py-20 text-stone-deep">
          <p className="text-body-lg">No {label.toLowerCase()} found yet.</p>
          <p className="mt-1 text-body-sm">Check back soon — we&apos;re adding more spots.</p>
        </div>
      )}
    </div>
  );
}
