"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { God } from "@/types/god";
import { cn } from "@/lib/utils/cn";
import { useReducedMotion } from "@/lib/animations/hooks";
import {
  slideInFromRightVariants,
  fadeInVariants,
  reducedMotionVariants,
} from "@/lib/animations/variants";
import { Button } from "@/components/ui/Button";

export interface GodDetailPanelProps {
  god: God | null;
  isOpen: boolean;
  onClose: () => void;
}

export function GodDetailPanel({ god, isOpen, onClose }: GodDetailPanelProps) {
  const prefersReducedMotion = useReducedMotion();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Store previous focus and handle escape key
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      // Focus close button after animation
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 300);

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          handleClose();
        }
      };

      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";

      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose();
    // Return focus to previous element
    setTimeout(() => {
      previousFocusRef.current?.focus();
    }, 100);
  };

  const backdropVariants = prefersReducedMotion
    ? reducedMotionVariants
    : fadeInVariants;

  const panelVariants = prefersReducedMotion
    ? reducedMotionVariants
    : slideInFromRightVariants;

  if (!god) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-norse-night/90 backdrop-blur-sm z-40"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.aside
            className={cn(
              "fixed top-0 right-0 h-full w-full sm:w-[600px] lg:w-[700px]",
              "bg-norse-night border-l-2 border-norse-gold/30 shadow-2xl",
              "overflow-y-auto z-50"
            )}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="god-detail-title"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-norse-night/95 backdrop-blur-sm border-b border-norse-stone/20 p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2
                    id="god-detail-title"
                    className="text-3xl font-bold text-norse-gold mb-1"
                  >
                    {god.name}
                  </h2>
                  {god.title && (
                    <p className="text-lg text-norse-stone italic">
                      {god.title}
                    </p>
                  )}
                </div>
                <Button
                  ref={closeButtonRef}
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  aria-label="Close god details"
                  className="shrink-0"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              </div>

              {/* Type & Featured */}
              <div className="flex items-center gap-3 mt-4">
                <span
                  className={cn(
                    "inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold",
                    god.type === "Aesir" && "bg-norse-gold/20 text-norse-gold",
                    god.type === "Vanir" && "bg-norse-ice/20 text-norse-ice",
                    god.type === "Jotun" && "bg-norse-fire/20 text-norse-fire",
                    god.type === "Other" && "bg-norse-stone/20 text-norse-stone"
                  )}
                >
                  {god.type}
                </span>
                {god.metadata.featured && (
                  <span className="text-norse-gold flex items-center gap-1">
                    <span aria-hidden="true">⭐</span>
                    <span className="text-sm font-semibold">Featured</span>
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* Image */}
              <div className="relative aspect-[3/4] w-full max-w-md mx-auto rounded-lg overflow-hidden border-2 border-norse-stone/20 bg-gradient-to-br from-norse-night via-norse-stone/10 to-norse-night">
                <Image
                  src={god.imageUrl}
                  alt={`${god.name} - ${god.title || "Norse deity"}`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 640px) 100vw, 600px"
                />
              </div>

              {/* Description */}
              <section>
                <h3 className="text-xl font-semibold text-norse-gold mb-3">
                  About
                </h3>
                <p className="text-norse-stone leading-relaxed">
                  {god.description}
                </p>
              </section>

              {/* Domains */}
              <section>
                <h3 className="text-xl font-semibold text-norse-gold mb-3">
                  Domains
                </h3>
                <div className="flex flex-wrap gap-2">
                  {god.domain.map((domain) => (
                    <span
                      key={domain}
                      className="inline-flex items-center px-3 py-2 rounded-lg text-sm bg-norse-stone/10 text-norse-stone border border-norse-stone/20 font-medium"
                    >
                      {domain}
                    </span>
                  ))}
                </div>
              </section>

              {/* Appearance */}
              <section>
                <h3 className="text-xl font-semibold text-norse-gold mb-3">
                  Appearance
                </h3>
                <p className="text-norse-stone leading-relaxed">
                  {god.attributes.appearance}
                </p>
              </section>

              {/* Personality */}
              <section>
                <h3 className="text-xl font-semibold text-norse-gold mb-3">
                  Personality
                </h3>
                <p className="text-norse-stone leading-relaxed">
                  {god.attributes.personality}
                </p>
              </section>

              {/* Powers */}
              {god.attributes.powers.length > 0 && (
                <section>
                  <h3 className="text-xl font-semibold text-norse-gold mb-3">
                    Powers & Abilities
                  </h3>
                  <ul className="space-y-2">
                    {god.attributes.powers.map((power, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-norse-stone"
                      >
                        <span className="text-norse-gold mt-1" aria-hidden="true">
                          ✦
                        </span>
                        <span>{power}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Family */}
              {god.family && (
                <section>
                  <h3 className="text-xl font-semibold text-norse-gold mb-3">
                    Family
                  </h3>
                  <dl className="space-y-3">
                    {god.family.parents && god.family.parents.length > 0 && (
                      <div>
                        <dt className="text-sm font-semibold text-norse-gold/80 mb-1">
                          Parents:
                        </dt>
                        <dd className="text-sm text-norse-stone">
                          {god.family.parents.join(", ")}
                        </dd>
                      </div>
                    )}
                    {god.family.spouse && (
                      <div>
                        <dt className="text-sm font-semibold text-norse-gold/80 mb-1">
                          Spouse:
                        </dt>
                        <dd className="text-sm text-norse-stone">
                          {god.family.spouse}
                        </dd>
                      </div>
                    )}
                    {god.family.children && god.family.children.length > 0 && (
                      <div>
                        <dt className="text-sm font-semibold text-norse-gold/80 mb-1">
                          Children:
                        </dt>
                        <dd className="text-sm text-norse-stone">
                          {god.family.children.join(", ")}
                        </dd>
                      </div>
                    )}
                    {god.family.siblings && god.family.siblings.length > 0 && (
                      <div>
                        <dt className="text-sm font-semibold text-norse-gold/80 mb-1">
                          Siblings:
                        </dt>
                        <dd className="text-sm text-norse-stone">
                          {god.family.siblings.join(", ")}
                        </dd>
                      </div>
                    )}
                  </dl>
                </section>
              )}

              {/* Symbols */}
              {god.symbols && god.symbols.length > 0 && (
                <section>
                  <h3 className="text-xl font-semibold text-norse-gold mb-3">
                    Associated Symbols
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {god.symbols.map((symbol) => (
                      <span
                        key={symbol}
                        className="inline-flex items-center px-3 py-2 rounded-lg text-sm bg-norse-gold/10 text-norse-gold border border-norse-gold/20 font-medium"
                      >
                        {symbol}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Popularity */}
              <section className="p-4 bg-norse-stone/5 rounded-lg border border-norse-stone/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-norse-gold">
                    Popularity
                  </span>
                  <span className="text-2xl font-bold text-norse-gold">
                    {god.metadata.popularity}
                  </span>
                </div>
                <div className="h-2 bg-norse-stone/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-norse-gold to-norse-bronze rounded-full transition-all duration-500"
                    style={{ width: `${god.metadata.popularity}%` }}
                    role="progressbar"
                    aria-valuenow={god.metadata.popularity}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Popularity: ${god.metadata.popularity}%`}
                  />
                </div>
              </section>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
