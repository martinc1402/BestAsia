import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Broadened to cover every Google user-content subdomain (gps-cs-s, lh3,
    // lh4, lh5, gps-proxy, etc.) that the Supabase venue photos come from.
    remotePatterns: [
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
    // Next.js 16 requires explicit `qualities` for any non-default value.
    // Some code paths pass q=85 / q=90 via source URL query params; listing
    // them here prevents the optimizer from 400'ing those requests.
    qualities: [50, 60, 75, 85, 90, 95, 100],
    // Longer cache for optimized images keeps hotlinked sources (Unsplash,
    // Google Places photos) from being hit on every request.
    minimumCacheTTL: 60 * 60 * 24,
  },
};

export default nextConfig;
