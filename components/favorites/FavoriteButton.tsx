"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useReducedMotion } from "@/lib/animations/hooks";

interface FavoriteButtonProps {
  type: "god" | "realm";
  id: string;
  initialFavorited?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Favorite Button
 * 
 * Heart button that toggles favorite status.
 * Uses optimistic updates for snappy UX.
 * Redirects to sign in if not authenticated.
 */
export function FavoriteButton({
  type,
  id,
  initialFavorited = false,
  size = "md",
  className,
}: FavoriteButtonProps) {
  const { data: session, status } = useSession();
  const [isFavorite, setIsFavorite] = useState(initialFavorited);
  const [isLoading, setIsLoading] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const handleToggle = async (e: React.MouseEvent) => {
    // Prevent bubbling to parent (e.g., card click)
    e.stopPropagation();
    e.preventDefault();

    // Redirect to sign in if not authenticated
    if (status !== "authenticated" || !session) {
      window.location.href = `/api/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    setIsLoading(true);

    // Optimistic update
    const previousState = isFavorite;
    setIsFavorite(!isFavorite);

    try {
      const response = await fetch("/api/user/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id }),
      });

      if (!response.ok) {
        throw new Error("Failed to update favorite");
      }

      const result = await response.json();
      // Sync with server state
      setIsFavorite(result.isFavorite);
    } catch (error) {
      // Rollback on error
      console.error("Error toggling favorite:", error);
      setIsFavorite(previousState);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-3",
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 24,
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        "rounded-full transition-all",
        "hover:bg-norse-gold/20",
        "focus:outline-none focus:ring-2 focus:ring-norse-gold focus:ring-offset-2 focus:ring-offset-norse-night",
        "active:scale-95",
        sizeClasses[size],
        isLoading && "opacity-50 cursor-not-allowed",
        className
      )}
      aria-label={isFavorite ? `Remove from favorites` : `Add to favorites`}
      aria-pressed={isFavorite}
    >
      <Heart
        size={iconSizes[size]}
        className={cn(
          "transition-all",
          !prefersReducedMotion && "transition-transform hover:scale-110",
          isFavorite
            ? "fill-red-500 text-red-500"
            : "text-norse-stone hover:text-red-400"
        )}
      />
    </button>
  );
}
