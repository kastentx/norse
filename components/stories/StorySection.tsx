"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { useReducedMotion } from "@/lib/animations/hooks";
import { cn } from "@/lib/utils/cn";

export interface StorySectionProps {
  id: string;
  type: "text" | "quote" | "illustration";
  title?: string;
  content?: string;
  text?: string;
  attribution?: string;
  imageUrl?: string;
  caption?: string;
  alt?: string;
  parallaxIntensity?: number;
}

export function StorySection({
  id,
  type,
  title,
  content,
  text,
  attribution,
  imageUrl,
  caption,
  alt,
  parallaxIntensity = 0.3,
}: StorySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const prefersReducedMotion = useReducedMotion();

  // Text section
  if (type === "text") {
    return (
      <motion.section
        ref={ref}
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 50 }}
        animate={
          isInView
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: prefersReducedMotion ? 0 : 50 }
        }
        transition={{
          duration: prefersReducedMotion ? 0.01 : 0.6,
          ease: "easeOut",
        }}
        className="max-w-4xl mx-auto px-4 py-12"
        id={id}
      >
        {title && (
          <motion.h2
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.01 : 0.8,
              delay: prefersReducedMotion ? 0 : 0.2,
            }}
            className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white"
          >
            {title.split("").map((char, index) => (
              <motion.span
                key={`${id}-${index}`}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{
                  duration: prefersReducedMotion ? 0.01 : 0.05,
                  delay: prefersReducedMotion ? 0 : 0.3 + index * 0.03,
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.h2>
        )}
        <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          {content}
        </p>
      </motion.section>
    );
  }

  // Quote section
  if (type === "quote") {
    return (
      <motion.section
        ref={ref}
        initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 }}
        animate={
          isInView
            ? { opacity: 1, scale: 1 }
            : {
                opacity: 0,
                scale: prefersReducedMotion ? 1 : 0.95,
              }
        }
        transition={{
          duration: prefersReducedMotion ? 0.01 : 0.6,
          ease: "easeOut",
        }}
        className="max-w-4xl mx-auto px-4 py-16"
        id={id}
      >
        <blockquote className="relative border-l-4 border-norse-gold pl-8 py-4">
          <svg
            className="absolute -left-2 -top-4 w-12 h-12 text-norse-gold/20"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <p className="text-xl md:text-2xl italic text-gray-800 dark:text-gray-200 mb-4 leading-relaxed">
            {text}
          </p>
          {attribution && (
            <footer className="text-base text-gray-600 dark:text-gray-400">
              — {attribution}
            </footer>
          )}
        </blockquote>
      </motion.section>
    );
  }

  // Illustration section
  if (type === "illustration" && imageUrl) {
    return (
      <motion.section
        ref={ref}
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 80 }}
        animate={
          isInView
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: prefersReducedMotion ? 0 : 80 }
        }
        transition={{
          duration: prefersReducedMotion ? 0.01 : 0.8,
          ease: "easeOut",
        }}
        className="max-w-6xl mx-auto px-4 py-16"
        id={id}
      >
        <motion.div
          initial={{ scale: prefersReducedMotion ? 1 : 0.9 }}
          animate={
            isInView
              ? { scale: 1 }
              : { scale: prefersReducedMotion ? 1 : 0.9 }
          }
          transition={{
            duration: prefersReducedMotion ? 0.01 : 0.6,
            delay: prefersReducedMotion ? 0 : 0.2,
          }}
          className="relative aspect-video w-full rounded-lg overflow-hidden shadow-2xl"
        >
          <Image
            src={imageUrl}
            alt={alt || caption || "Story illustration"}
            fill
            className="object-cover"
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
        </motion.div>
        {caption && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.01 : 0.4,
              delay: prefersReducedMotion ? 0 : 0.4,
            }}
            className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4 italic"
          >
            {caption}
          </motion.p>
        )}
      </motion.section>
    );
  }

  return null;
}
