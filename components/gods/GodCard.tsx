"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { God } from "@/types/god";
import { cn } from "@/lib/utils/cn";
import { useReducedMotion } from "@/lib/animations/hooks";
import {
  scaleInVariants,
  reducedMotionVariants,
} from "@/lib/animations/variants";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";

export interface GodCardProps {
  god: God;
  index: number;
  onClick: () => void;
  isFavorited?: boolean;
}

export function GodCard({ god, index, onClick, isFavorited = false }: GodCardProps) {
  const prefersReducedMotion = useReducedMotion();

  const cardVariants = prefersReducedMotion
    ? reducedMotionVariants
    : scaleInVariants;

  return (
    <motion.article
      className={cn(
        "group relative overflow-hidden rounded-lg border-2 border-norse-stone/30 bg-norse-night/50 backdrop-blur-sm",
        "cursor-pointer transition-all duration-300",
        "hover:border-norse-gold/50 hover:shadow-xl hover:shadow-norse-gold/20",
        "focus-within:ring-2 focus-within:ring-norse-gold focus-within:ring-offset-2 focus-within:ring-offset-norse-night"
      )}
      variants={cardVariants}
      whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View details about ${god.name}`}
      style={{
        animationDelay: `${index * 50}ms`,
      }}
    >
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-norse-stone/10">
        <Image
          src={god.imageUrl}
          alt={`${god.name} - ${god.title || "Norse deity"}`}
          fill
          className="object-cover object-[center_20%] transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-norse-night via-transparent to-transparent opacity-60" />
        
        {/* Favorite Button */}
        <div 
          className="absolute top-2 right-2 z-10"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <FavoriteButton
            type="god"
            id={god.id}
            initialFavorited={isFavorited}
            size="md"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-2xl font-bold text-norse-gold mb-1">
            {god.name}
          </h3>
          {god.title && (
            <p className="text-sm text-norse-stone italic">{god.title}</p>
          )}
        </div>

        {/* God Type Badge */}
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold",
              god.type === "Aesir" && "bg-norse-gold/20 text-norse-gold",
              god.type === "Vanir" && "bg-norse-ice/20 text-norse-ice",
              god.type === "Jotun" && "bg-norse-fire/20 text-norse-fire",
              god.type === "Other" && "bg-norse-stone/20 text-norse-stone"
            )}
          >
            {god.type}
          </span>
          {god.metadata.featured && (
            <span className="text-xs text-norse-gold" aria-label="Featured god">
              ⭐
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-norse-stone/90 line-clamp-3">
          {god.description}
        </p>

        {/* Domains */}
        <div className="flex flex-wrap gap-2">
          {god.domain.slice(0, 3).map((domain) => (
            <span
              key={domain}
              className="inline-flex items-center px-2 py-1 rounded text-xs bg-norse-stone/10 text-norse-stone border border-norse-stone/20"
            >
              {domain}
            </span>
          ))}
          {god.domain.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 text-xs text-norse-stone/60">
              +{god.domain.length - 3} more
            </span>
          )}
        </div>

        {/* Popularity indicator */}
        <div className="flex items-center gap-2 pt-2 border-t border-norse-stone/20">
          <span className="text-xs text-norse-stone/60">Popularity:</span>
          <div className="flex-1 h-1.5 bg-norse-stone/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-norse-gold to-norse-bronze rounded-full"
              style={{ width: `${god.metadata.popularity}%` }}
              role="progressbar"
              aria-valuenow={god.metadata.popularity}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Popularity: ${god.metadata.popularity}%`}
            />
          </div>
          <span className="text-xs text-norse-gold font-semibold">
            {god.metadata.popularity}
          </span>
        </div>
      </div>

      {/* Hover indicator */}
      <div className="absolute inset-0 border-2 border-norse-gold opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />
    </motion.article>
  );
}
