"use client";

import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { ReactNode } from "react";

interface GodsErrorBoundaryProps {
  children: ReactNode;
}

export function GodsErrorBoundary({ children }: GodsErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex min-h-[600px] items-center justify-center px-4">
          <div className="max-w-md text-center">
            <div className="mb-6 text-6xl">⚡</div>
            <h2 className="mb-4 font-norse text-2xl text-norse-gold">
              Failed to Load Gods
            </h2>
            <p className="mb-6 text-norse-gray-300">
              We couldn't load the gods from Asgard. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-norse-gold px-6 py-3 font-semibold text-black transition-colors hover:bg-norse-gold/90"
            >
              Reload Page
            </button>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
