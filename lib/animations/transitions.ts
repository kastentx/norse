import { Transition } from "framer-motion";

/**
 * Reusable transition configurations for Framer Motion animations
 */

// Fast transition for micro-interactions (<300ms)
export const fastTransition: Transition = {
  duration: 0.2,
  ease: "easeOut",
};

// Standard transition for most animations (<500ms)
export const standardTransition: Transition = {
  duration: 0.3,
  ease: "easeInOut",
};

// Slow transition for major page changes (<800ms)
export const slowTransition: Transition = {
  duration: 0.5,
  ease: "easeInOut",
};

// Spring transition for bouncy effects
export const springTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

// Smooth spring for cards and interactive elements
export const smoothSpring: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 25,
};

// Stagger configuration for lists
export const staggerTransition: Transition = {
  staggerChildren: 0.1,
  delayChildren: 0.1,
};

// Instant transition for reduced motion
export const instantTransition: Transition = {
  duration: 0.01,
};

// Parallax scroll transition
export const parallaxTransition: Transition = {
  duration: 0.5,
  ease: "easeOut",
};
