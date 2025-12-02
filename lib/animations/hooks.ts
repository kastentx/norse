"use client";

import { useEffect, useState, useRef } from "react";
import type { Variants } from "framer-motion";

/**
 * Hook that detects user's reduced motion preference
 * Returns true if user prefers reduced motion
 * 
 * @returns boolean indicating if reduced motion is preferred
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

export interface UseScrollAnimationOptions extends IntersectionObserverInit {
  triggerOnce?: boolean;
}

/**
 * Hook that triggers animation when element enters viewport
 * Returns ref to attach to element and boolean indicating if in view
 * 
 * @param options - IntersectionObserver options with triggerOnce flag
 * @returns [ref, isInView] tuple
 */
export function useScrollAnimation(
  options: UseScrollAnimationOptions = { threshold: 0.1, triggerOnce: true }
) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const { triggerOnce, ...observerOptions } = options;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setIsInView(true);
        if (triggerOnce) {
          observer.disconnect();
        }
      } else if (!triggerOnce) {
        setIsInView(false);
      }
    }, observerOptions);

    observer.observe(element);

    return () => observer.disconnect();
  }, [options.threshold, options.triggerOnce]);

  return [ref, isInView] as const;
}

/**
 * Helper to get animation duration based on reduced motion preference
 * Returns instant duration if reduced motion is preferred
 * 
 * @param normalDuration - Duration in seconds for normal motion
 * @param prefersReducedMotion - Whether user prefers reduced motion
 * @returns Duration in seconds
 */
export function getAnimationDuration(
  normalDuration: number,
  prefersReducedMotion: boolean
): number {
  return prefersReducedMotion ? 0.01 : normalDuration;
}

/**
 * Helper to get animation variants based on reduced motion preference
 * Returns instant variants if reduced motion is preferred
 * 
 * @param normalVariants - Animation variants for normal motion
 * @param reducedVariants - Animation variants for reduced motion
 * @param prefersReducedMotion - Whether user prefers reduced motion
 * @returns Animation variants
 */
export function getAnimationVariants(
  normalVariants: Variants,
  reducedVariants: Variants,
  prefersReducedMotion: boolean
): Variants {
  return prefersReducedMotion ? reducedVariants : normalVariants;
}
