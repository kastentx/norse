"use client";

import Link from "next/link";

/**
 * Offline Fallback Page
 * 
 * Shown when the user tries to access an uncached page while offline.
 * This page is pre-cached by the service worker.
 */
export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {/* Offline Icon */}
      <div className="mb-8">
        <svg
          className="w-24 h-24 text-amber-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a5 5 0 01-.707-7.072m0 0L9.172 9.172m-2.829 2.829a9 9 0 01-.707-12.728m0 0L3 3"
          />
        </svg>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gold-400 mb-4">
        You&apos;re Offline
      </h1>

      {/* Description */}
      <p className="text-lg text-gray-300 mb-8 max-w-md">
        The ravens Huginn and Muninn cannot reach you right now. 
        Check your connection and try again.
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-gold-500 hover:bg-gold-600 text-norse-night font-semibold rounded-lg transition-colors"
        >
          Try Again
        </button>
        
        <Link
          href="/"
          className="px-6 py-3 border border-gold-500 text-gold-400 hover:bg-gold-500/10 font-semibold rounded-lg transition-colors"
        >
          Go Home
        </Link>
      </div>

      {/* Tip */}
      <p className="mt-12 text-sm text-gray-500">
        <span className="text-amber-500">Tip:</span> Pages you&apos;ve visited before 
        are available offline. Try navigating to a cached page.
      </p>
    </div>
  );
}
