import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Nine Realms - Interactive Map | Norse Mythology",
  description:
    "Explore the Nine Realms of Norse cosmology connected by Yggdrasil, the World Tree. Interactive map with detailed information about each realm, its inhabitants, and connections.",
  openGraph: {
    title: "The Nine Realms - Interactive Map",
    description:
      "Explore the Nine Realms of Norse cosmology connected by Yggdrasil, the World Tree.",
  },
};

export default function RealmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-black via-norse-gray-900 to-black py-16">
          <div className="container mx-auto px-4">
            {/* Header Skeleton */}
            <div className="mb-12 text-center">
              <div className="mx-auto mb-4 h-16 w-3/4 animate-pulse rounded-lg bg-norse-gray-800 md:h-20" />
              <div className="mx-auto h-6 w-1/2 animate-pulse rounded-lg bg-norse-gray-800" />
            </div>

            {/* Map Skeleton */}
            <div className="relative mx-auto max-w-7xl">
              <div className="h-[600px] animate-pulse rounded-lg border border-norse-gold/20 bg-norse-gray-900" />
            </div>

            {/* Legend Skeleton */}
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-48 animate-pulse rounded-lg border border-norse-gold/20 bg-norse-gray-800/50"
                />
              ))}
            </div>
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
