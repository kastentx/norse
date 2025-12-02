"use client";

import { SkeletonGodCard } from "@/components/ui/Skeleton";

export function GodSkeleton() {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      role="status"
      aria-label="Loading gods..."
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonGodCard key={i} />
      ))}
    </div>
  );
}
