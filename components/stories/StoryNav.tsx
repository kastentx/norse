"use client";

import { useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";
import Link from "next/link";
import { useReducedMotion } from "@/lib/animations/hooks";
import { cn } from "@/lib/utils/cn";

export interface StoryNavSection {
  id: string;
  title: string;
}

export interface StoryNavProps {
  sections: StoryNavSection[];
  showBackButton?: boolean;
}

export function StoryNav({ sections, showBackButton = true }: StoryNavProps) {
  const [activeSection, setActiveSection] = useState<string>("");
  const { scrollYProgress } = useScroll();
  const prefersReducedMotion = useReducedMotion();

  // Track which section is currently in view
  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections
        .map((section) => ({
          id: section.id,
          element: document.getElementById(section.id),
        }))
        .filter((item) => item.element !== null);

      const currentSection = sectionElements.find((item) => {
        if (!item.element) return false;
        const rect = item.element.getBoundingClientRect();
        return rect.top <= 200 && rect.bottom >= 200;
      });

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const handleSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: prefersReducedMotion ? 0.01 : 0.6, delay: 0.8 }}
      className="fixed left-8 top-1/2 -translate-y-1/2 z-40 hidden lg:block"
    >
      <div className="relative">
        {/* Progress indicator */}
        <div className="absolute left-0 w-0.5 h-full bg-gray-300 dark:bg-gray-700">
          <motion.div
            style={{ scaleY: scrollYProgress }}
            className="w-full bg-norse-gold origin-top"
          />
        </div>

        {/* Section links */}
        <ul className="pl-6 space-y-4">
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <li key={section.id}>
                <button
                  onClick={() => handleSectionClick(section.id)}
                  className={cn(
                    "text-left text-sm transition-colors group flex items-center gap-2",
                    isActive
                      ? "text-norse-gold font-medium"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  )}
                  aria-current={isActive ? "location" : undefined}
                >
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      isActive
                        ? "bg-norse-gold scale-125"
                        : "bg-gray-400 dark:bg-gray-600 group-hover:bg-gray-600 dark:group-hover:bg-gray-400"
                    )}
                  />
                  <span className="max-w-[150px] truncate">{section.title}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Back to stories button */}
      {showBackButton && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: prefersReducedMotion ? 0.01 : 0.4,
            delay: prefersReducedMotion ? 0 : 1.2,
          }}
          className="mt-8"
        >
          <Link
            href="/stories"
            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-norse-gold dark:hover:text-norse-gold transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>All Stories</span>
          </Link>
        </motion.div>
      )}
    </motion.nav>
  );
}
