"use client";

import { ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { useReducedMotion } from "@/lib/animations/hooks";
import {
  fadeInVariants,
  slideInFromRightVariants,
  reducedMotionVariants,
} from "@/lib/animations/variants";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  className?: string;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  className,
  closeOnBackdrop = true,
  closeOnEscape = true,
}: ModalProps) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const backdropVariants = prefersReducedMotion
    ? reducedMotionVariants
    : fadeInVariants;

  const contentVariants = prefersReducedMotion
    ? reducedMotionVariants
    : slideInFromRightVariants;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-norse-night/80 backdrop-blur-sm z-50"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={closeOnBackdrop ? onClose : undefined}
            aria-hidden="true"
          />

          {/* Modal Content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className={cn(
                "relative max-w-2xl w-full max-h-[90vh] overflow-y-auto",
                "bg-norse-night border border-norse-gold/30 rounded-lg shadow-2xl shadow-norse-gold/20",
                "focus:outline-none",
                className
              )}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? "modal-title" : undefined}
            >
              {/* Header */}
              {title && (
                <div className="flex items-center justify-between p-6 border-b border-norse-stone/20">
                  <h2
                    id="modal-title"
                    className="text-2xl font-semibold text-norse-gold"
                  >
                    {title}
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-norse-stone hover:text-norse-gold transition-colors p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-norse-gold"
                    aria-label="Close modal"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}

              {/* Content */}
              <div className="p-6">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
