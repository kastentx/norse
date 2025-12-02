"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useReducedMotion } from "@/lib/animations/hooks";
import {
  fadeInStaggerVariants,
  scaleInVariants,
} from "@/lib/animations/variants";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

interface SearchResult {
  type: "god" | "story" | "realm";
  id: string;
  title: string;
  description: string;
  url: string;
  metadata?: Record<string, string | number | boolean>;
}

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  isLoading: boolean;
}

export function SearchResults({
  results,
  query,
  isLoading,
}: SearchResultsProps) {
  const prefersReducedMotion = useReducedMotion();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-48 animate-pulse rounded-lg bg-gray-200"
            role="status"
            aria-label="Loading results"
          />
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return <EmptyState query={query} />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`results-${query}-${results.length}`}
        variants={prefersReducedMotion ? undefined : fadeInStaggerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {results.map((result, index) => (
          <motion.div
            key={`${result.type}-${result.id}`}
            variants={prefersReducedMotion ? undefined : scaleInVariants}
            custom={index}
            transition={{
              delay: prefersReducedMotion ? 0 : index * 0.05,
            }}
          >
            <SearchResultCard result={result} />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}

interface SearchResultCardProps {
  result: SearchResult;
}

function SearchResultCard({ result }: SearchResultCardProps) {
  const prefersReducedMotion = useReducedMotion();

  const typeColors = {
    god: "norse-gold",
    story: "norse-rune",
    realm: "norse-ice",
  };

  const typeIcons = {
    god: "⚡",
    story: "📖",
    realm: "🌍",
  };

  const color = typeColors[result.type];

  return (
    <Link href={result.url}>
      <Card
        hover
        className={cn(
          "h-full cursor-pointer border-2",
          !prefersReducedMotion && "transition-all duration-200"
        )}
      >
        <div className="space-y-3">
          {/* Type Badge */}
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium capitalize",
                result.type === "god" &&
                  "bg-norse-gold/20 text-norse-gold border border-norse-gold/30",
                result.type === "story" &&
                  "bg-norse-rune/20 text-norse-rune border border-norse-rune/30",
                result.type === "realm" &&
                  "bg-norse-ice/30 text-blue-700 border border-blue-300"
              )}
            >
              <span>{typeIcons[result.type]}</span>
              <span>{result.type}</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {result.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-3">
            {result.description}
          </p>

          {/* Metadata */}
          {result.metadata && Object.keys(result.metadata).length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
              {Object.entries(result.metadata).slice(0, 3).map(([key, value]) => (
                <span
                  key={key}
                  className="inline-flex items-center text-xs text-gray-500"
                >
                  <span className="font-medium capitalize">{key}:</span>
                  <span className="ml-1">
                    {typeof value === "string"
                      ? value
                      : typeof value === "number"
                      ? value
                      : value
                      ? "Yes"
                      : "No"}
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}

interface EmptyStateProps {
  query: string;
}

function EmptyState({ query }: EmptyStateProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? false : { opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="mb-4 text-6xl">🔍</div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900">
        No results found
      </h3>
      {query && (
        <p className="mb-4 text-gray-600">
          No results found for <span className="font-medium">&quot;{query}&quot;</span>
        </p>
      )}
      <p className="max-w-md text-sm text-gray-500">
        Try adjusting your search or filters, or browse all content using the
        navigation menu.
      </p>
    </motion.div>
  );
}
