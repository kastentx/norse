"use client";

import { useSession } from "next-auth/react";
import { FavoritesSection } from "@/components/favorites/FavoritesSection";

/**
 * Client wrapper for favorites section on landing page.
 * Only renders when user is authenticated.
 */
export function LandingFavorites() {
  const { data: session, status } = useSession();

  // Don't render anything while loading or if not authenticated
  if (status === "loading") {
    return (
      <section className="w-full max-w-4xl animate-fade-in animation-delay-350">
        <div className="h-32 bg-norse-night/50 rounded-lg animate-pulse border border-norse-stone/10" />
      </section>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <section className="w-full max-w-4xl animate-fade-in animation-delay-350">
      <FavoritesSection />
    </section>
  );
}
