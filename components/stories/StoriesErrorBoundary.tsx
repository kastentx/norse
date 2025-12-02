"use client";

import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { ReactNode } from "react";

interface StoriesErrorBoundaryProps {
  children: ReactNode;
}

export function StoriesErrorBoundary({ children }: StoriesErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex min-h-[600px] items-center justify-center px-4">
          <div className="max-w-md text-center">
            <div className="mb-6 text-6xl">📖</div>
            <h2 className="mb-4 font-norse text-2xl text-norse-gold">
              Failed to Load Story
            </h2>
            <p className="mb-6 text-norse-gray-300">
              The story could not be loaded. This tale may be lost to time.
            </p>
            <button
              onClick={() => window.location.href = "/stories"}
              className="rounded-lg bg-norse-gold px-6 py-3 font-semibold text-black transition-colors hover:bg-norse-gold/90"
            >
              Return to Stories
            </button>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
