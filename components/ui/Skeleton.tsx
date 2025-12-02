"use client";

import { ComponentPropsWithoutRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { useReducedMotion } from "@/lib/animations/hooks";
import { skeletonVariants, reducedMotionVariants } from "@/lib/animations/variants";

export interface SkeletonProps {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function Skeleton({
  variant = "rectangular",
  width,
  height,
  className,
}: SkeletonProps) {
  const prefersReducedMotion = useReducedMotion();

  const variantStyles = {
    text: "rounded h-4 w-full",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  const sizeStyles = {
    width: width ? (typeof width === "number" ? `${width}px` : width) : undefined,
    height: height
      ? typeof height === "number"
        ? `${height}px`
        : height
      : variant === "circular"
        ? "40px"
        : variant === "text"
          ? "1rem"
          : "120px",
  };

  const animationVariants = prefersReducedMotion
    ? reducedMotionVariants
    : skeletonVariants;

  return (
    <motion.div
      className={cn(
        "bg-norse-stone/20",
        variantStyles[variant],
        className
      )}
      style={sizeStyles}
      variants={animationVariants}
      initial="hidden"
      animate="visible"
      aria-label="Loading..."
      role="status"
    />
  );
}

// Preset skeleton patterns
export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? "75%" : "100%"}
        />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="p-4 border border-norse-stone/20 rounded-lg space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  );
}

export function SkeletonGodCard() {
  return (
    <div className="p-6 border border-norse-stone/20 rounded-lg bg-norse-night/50 space-y-4">
      <Skeleton variant="rectangular" width="100%" height={200} />
      <Skeleton variant="text" width="80%" height={24} />
      <Skeleton variant="text" width="60%" height={16} />
      <SkeletonText lines={2} />
      <div className="flex gap-2">
        <Skeleton variant="rectangular" width={80} height={24} />
        <Skeleton variant="rectangular" width={100} height={24} />
        <Skeleton variant="rectangular" width={90} height={24} />
      </div>
    </div>
  );
}
