"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Heart, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { useReducedMotion } from "@/lib/animations/hooks";
import { EmptyFavoritesPrompt } from "./EmptyFavoritesPrompt";

interface FavoriteItem {
  id: string;
  name: string;
  title?: string;
  imageUrl: string;
  type: "god" | "realm";
}

interface FavoritesSectionProps {
  className?: string;
}

/**
 * Favorites Section for Landing Page
 * 
 * Shows the user's favorite god and realm with links to their detail pages.
 * Displays prompts when favorites are empty.
 */
export function FavoritesSection({ className }: FavoritesSectionProps) {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState<{
    god: FavoriteItem | null;
    realm: FavoriteItem | null;
  }>({ god: null, realm: null });
  const [isLoading, setIsLoading] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    async function loadFavorites() {
      if (status !== "authenticated") {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch user's favorites
        const favResponse = await fetch("/api/user/favorites");
        if (!favResponse.ok) throw new Error("Failed to fetch favorites");
        const favData = await favResponse.json();

        // Fetch details for first favorite god
        let godData = null;
        if (favData.favoriteGods?.length > 0) {
          const godsResponse = await fetch("/api/gods");
          const gods = await godsResponse.json();
          const favoriteGod = gods.find((g: any) =>
            favData.favoriteGods.includes(g.id)
          );
          if (favoriteGod) {
            godData = {
              id: favoriteGod.id,
              name: favoriteGod.name,
              title: favoriteGod.title,
              imageUrl: favoriteGod.imageUrl,
              type: "god" as const,
            };
          }
        }

        // For realms, we'll use static data since there's no realms API
        let realmData = null;
        if (favData.favoriteRealms?.length > 0) {
          // Simplified - in production you'd fetch from API
          const realmId = favData.favoriteRealms[0];
          const realmNames: Record<string, string> = {
            asgard: "Asgard",
            midgard: "Midgard",
            jotunheim: "Jotunheim",
            vanaheim: "Vanaheim",
            alfheim: "Alfheim",
            svartalfheim: "Svartalfheim",
            helheim: "Helheim",
            niflheim: "Niflheim",
            muspelheim: "Muspelheim",
          };
          if (realmNames[realmId]) {
            realmData = {
              id: realmId,
              name: realmNames[realmId],
              imageUrl: `/images/realms/${realmId}.webp`,
              type: "realm" as const,
            };
          }
        }

        setFavorites({ god: godData, realm: realmData });
      } catch (error) {
        console.error("Error loading favorites:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadFavorites();
  }, [status]);

  // Don't show section if not logged in
  if (status === "unauthenticated") {
    return null;
  }

  // Loading state
  if (status === "loading" || isLoading) {
    return (
      <section className={cn("w-full max-w-4xl", className)}>
        <div className="flex items-center gap-2 mb-4">
          <Heart className="text-norse-gold" size={20} />
          <h2 className="text-xl font-semibold text-norse-gold">
            Your Favorites
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-32 animate-pulse rounded-lg bg-norse-stone/10" />
          <div className="h-32 animate-pulse rounded-lg bg-norse-stone/10" />
        </div>
      </section>
    );
  }

  const hasNoFavorites = !favorites.god && !favorites.realm;

  return (
    <section className={cn("w-full max-w-4xl", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Heart className="text-norse-gold" size={20} />
          <h2 className="text-xl font-semibold text-norse-gold">
            Your Favorites
          </h2>
        </div>
        {!hasNoFavorites && (
          <Link
            href="/profile#favorites"
            className="text-sm text-norse-stone hover:text-norse-gold transition-colors flex items-center gap-1"
          >
            View all
            <ArrowRight size={14} />
          </Link>
        )}
      </div>

      <AnimatePresence mode="wait">
        {hasNoFavorites ? (
          <motion.div
            key="empty"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
          >
            <EmptyFavoritesPrompt />
          </motion.div>
        ) : (
          <motion.div
            key="favorites"
            initial={prefersReducedMotion ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {/* Favorite God */}
            <FavoriteCard
              item={favorites.god}
              label="Favorite God"
              emptyHref="/gods"
              emptyText="Choose a deity"
            />

            {/* Favorite Realm */}
            <FavoriteCard
              item={favorites.realm}
              label="Favorite Realm"
              emptyHref="/realms"
              emptyText="Explore the Nine Realms"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

interface FavoriteCardProps {
  item: FavoriteItem | null;
  label: string;
  emptyHref: string;
  emptyText: string;
}

function FavoriteCard({ item, label, emptyHref, emptyText }: FavoriteCardProps) {
  const prefersReducedMotion = useReducedMotion();

  if (!item) {
    return (
      <Link
        href={emptyHref}
        className={cn(
          "flex flex-col items-center justify-center p-6 rounded-lg",
          "border-2 border-dashed border-norse-stone/30",
          "hover:border-norse-gold/50 hover:bg-norse-gold/5",
          "transition-all group"
        )}
      >
        <Sparkles
          className="text-norse-stone/50 group-hover:text-norse-gold transition-colors mb-2"
          size={24}
        />
        <span className="text-sm text-norse-stone/70 group-hover:text-norse-stone">
          {label}
        </span>
        <span className="text-xs text-norse-gold mt-1">{emptyText}</span>
      </Link>
    );
  }

  const href = item.type === "god" ? `/gods/${item.id}` : `/realms#${item.id}`;

  return (
    <motion.div
      whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
    >
      <Link
        href={href}
        className={cn(
          "relative flex items-center gap-4 p-4 rounded-lg overflow-hidden",
          "bg-norse-night/50 border border-norse-stone/20",
          "hover:border-norse-gold/50 hover:shadow-lg hover:shadow-norse-gold/10",
          "transition-all group"
        )}
      >
        {/* Image */}
        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <span className="text-xs text-norse-stone/70 uppercase tracking-wide">
            {label}
          </span>
          <h3 className="text-lg font-semibold text-norse-gold truncate">
            {item.name}
          </h3>
          {item.title && (
            <p className="text-sm text-norse-stone truncate">{item.title}</p>
          )}
        </div>

        {/* Arrow */}
        <ArrowRight
          className="text-norse-stone/50 group-hover:text-norse-gold group-hover:translate-x-1 transition-all"
          size={20}
        />
      </Link>
    </motion.div>
  );
}
