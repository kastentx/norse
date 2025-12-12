"use client";

import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useReducedMotion } from "@/lib/animations/hooks";
import {
  useIsFavorited,
  useToggleFavorite,
  useSync,
  useInitializeLocalData,
} from "@/lib/db/sync/hooks";

interface FavoriteButtonProps {
  type: "god" | "realm";
  id: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  onToggle?: (isFavorite: boolean) => void;
}

/**
 * Favorite Button (Offline-First)
 *
 * Heart button that toggles favorite status using local-first architecture.
 * - Reads from local IndexedDB (Dexie) for instant response
 * - Writes locally first, then queues sync to Supabase
 * - Shows pending indicator when offline with unsynced changes
 * - Redirects to sign in if not authenticated
 */
export function FavoriteButton({
  type,
  id,
  size = "md",
  className,
  onToggle,
}: FavoriteButtonProps) {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const prefersReducedMotion = useReducedMotion();

  // Initialize local data from remote on first load
  useInitializeLocalData(userId);

  // Get favorite state from local IndexedDB (reactive)
  const isFavorite = useIsFavorited(userId, type, id);

  // Get sync status
  const { isOnline, pendingCount } = useSync(userId);

  // Get toggle function
  const toggleFavorite = useToggleFavorite(userId);

  const handleToggle = async (e: React.MouseEvent) => {
    // Prevent bubbling to parent (e.g., card click)
    e.stopPropagation();
    e.preventDefault();

    // Redirect to sign in if not authenticated
    if (status !== "authenticated" || !session) {
      window.location.href = `/api/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    const newState = await toggleFavorite(type, id);
    onToggle?.(newState ?? !isFavorite);
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

  // Show pending indicator when offline with unsynced changes
  const showPendingIndicator = !isOnline && pendingCount > 0;

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "relative rounded-full transition-all",
        "hover:bg-norse-gold/20",
        "focus:outline-none focus:ring-2 focus:ring-norse-gold focus:ring-offset-2 focus:ring-offset-norse-night",
        "active:scale-95",
        sizeClasses[size],
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
      {/* Pending sync indicator */}
      {showPendingIndicator && (
        <span
          className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-amber-500"
          title="Changes pending sync"
        />
      )}
    </button>
  );
}
