"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { useReducedMotion } from "@/lib/animations/hooks";
import { cn } from "@/lib/utils/cn";

export interface StoryHeroProps {
  title: string;
  summary: string;
  imageUrl: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  readingTime: number;
  themes: string[];
}

const difficultyColors = {
  beginner: "bg-green-500/10 text-green-600 border-green-500/20",
  intermediate: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  advanced: "bg-red-500/10 text-red-600 border-red-500/20",
};

const difficultyLabels = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export function StoryHero({
  title,
  summary,
  imageUrl,
  difficulty,
  readingTime,
  themes,
}: StoryHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Transform scroll progress into y offset for parallax
  // Only apply parallax if user doesn't prefer reduced motion
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, 300]
  );

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3]);

  return (
    <div
      ref={containerRef}
      className="relative h-[70vh] min-h-[500px] overflow-hidden"
    >
      {/* Parallax background image */}
      <motion.div
        style={{ y: prefersReducedMotion ? undefined : y }}
        className="absolute inset-0 -z-10"
      >
        <Image
          src={imageUrl}
          alt={title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Gradient overlay for text readability */}
        <motion.div
          style={{ opacity }}
          className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"
        />
      </motion.div>

      {/* Content */}
      <div className="container mx-auto px-4 h-full flex items-end pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0.01 : 0.6,
            ease: "easeOut",
          }}
          className="max-w-4xl text-white"
        >
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className={cn(
                "px-3 py-1 rounded-full border text-sm font-medium",
                difficultyColors[difficulty]
              )}
            >
              {difficultyLabels[difficulty]}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm">
              {readingTime} min read
            </span>
            {themes.slice(0, 3).map((theme) => (
              <span
                key={theme}
                className="px-3 py-1 rounded-full bg-norse-gold/20 backdrop-blur-sm border border-norse-gold/30 text-sm text-norse-gold capitalize"
              >
                {theme.replace("-", " ")}
              </span>
            ))}
          </div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.01 : 0.6,
              delay: prefersReducedMotion ? 0 : 0.2,
              ease: "easeOut",
            }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-shadow-lg"
          >
            {title}
          </motion.h1>

          {/* Summary */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.01 : 0.6,
              delay: prefersReducedMotion ? 0 : 0.4,
              ease: "easeOut",
            }}
            className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-3xl"
          >
            {summary}
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: prefersReducedMotion ? 0.01 : 0.6,
              delay: prefersReducedMotion ? 0 : 0.8,
            }}
            className="mt-8 flex items-center gap-2 text-sm text-gray-300"
          >
            <svg
              className={cn(
                "w-5 h-5",
                !prefersReducedMotion && "animate-bounce"
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
            <span>Scroll to begin the tale</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
