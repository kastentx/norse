"use client";

import { motion } from "framer-motion";
import { God } from "@/types/god";
import { GodCard } from "./GodCard";
import { useReducedMotion } from "@/lib/animations/hooks";
import {
  fadeInStaggerVariants,
  reducedMotionVariants,
} from "@/lib/animations/variants";

export interface GodGridProps {
  gods: God[];
  onGodClick: (god: God) => void;
  onFavoriteToggle?: (godId: string, isFavorite: boolean) => void;
}

export function GodGrid({ gods, onGodClick, onFavoriteToggle }: GodGridProps) {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = prefersReducedMotion
    ? reducedMotionVariants
    : fadeInStaggerVariants;

  if (gods.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-norse-stone">No gods found.</p>
        <p className="text-sm text-norse-stone/60 mt-2">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {gods.map((god, index) => (
        <GodCard
          key={god.id}
          god={god}
          index={index}
          onClick={() => onGodClick(god)}
          onFavoriteToggle={onFavoriteToggle}
        />
      ))}
    </motion.div>
  );
}
