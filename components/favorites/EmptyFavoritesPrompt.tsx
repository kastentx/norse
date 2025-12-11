"use client";

import Link from "next/link";
import { Heart, Compass, Users } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { useReducedMotion } from "@/lib/animations/hooks";

/**
 * Empty Favorites Prompt
 * 
 * Shown when user has no favorites yet.
 * Provides guidance on how to add favorites.
 */
export function EmptyFavoritesPrompt() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "p-6 rounded-lg",
        "bg-gradient-to-br from-norse-gold/5 to-norse-rune/5",
        "border border-norse-stone/20"
      )}
    >
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-3 mb-4"
      >
        <div className="p-2 rounded-full bg-norse-gold/10">
          <Heart className="text-norse-gold" size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-norse-gold">
            Start Your Collection
          </h3>
          <p className="text-sm text-norse-stone">
            Mark your favorite gods and realms to see them here
          </p>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="grid gap-3 sm:grid-cols-2"
      >
        <PromptCard
          href="/gods"
          icon={<Users size={18} />}
          title="Explore Gods"
          description="Discover the Norse pantheon and find your favorites"
        />
        <PromptCard
          href="/realms"
          icon={<Compass size={18} />}
          title="Explore Realms"
          description="Journey through the Nine Realms of Norse cosmology"
        />
      </motion.div>

      <motion.p
        variants={itemVariants}
        className="mt-4 text-xs text-norse-stone/70 text-center"
      >
        💡 Tip: Click the <Heart size={12} className="inline text-red-400" /> icon on any god or realm to add it to your favorites
      </motion.p>
    </motion.div>
  );
}

interface PromptCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

function PromptCard({ href, icon, title, description }: PromptCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg",
        "bg-norse-night/30 border border-norse-stone/10",
        "hover:border-norse-gold/30 hover:bg-norse-night/50",
        "transition-all group"
      )}
    >
      <div className="p-1.5 rounded bg-norse-gold/10 text-norse-gold group-hover:bg-norse-gold/20 transition-colors">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-medium text-norse-gold group-hover:text-norse-gold/90">
          {title}
        </h4>
        <p className="text-xs text-norse-stone/70">{description}</p>
      </div>
    </Link>
  );
}
