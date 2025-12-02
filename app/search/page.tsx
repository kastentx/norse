"use client";

import { useState, useEffect, useTransition, useDeferredValue, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { SearchErrorBoundary } from "@/components/search/SearchErrorBoundary";
import type { GodType } from "@/types/god";
import type { StoryDifficulty } from "@/types/story";
import type { RealmLevel } from "@/types/realm";

// Dynamic imports for search components to reduce initial bundle
const SearchBar = dynamic(() => import("@/components/search/SearchBar").then((mod) => ({ default: mod.SearchBar })), {
  loading: () => (
    <div className="mb-8 h-14 animate-pulse rounded-lg bg-norse-gray-800"></div>
  ),
});

const FilterGroup = dynamic(() => import("@/components/search/FilterGroup").then((mod) => ({ default: mod.FilterGroup })), {
  loading: () => (
    <div className="mb-8 h-32 animate-pulse rounded-lg bg-norse-gray-800"></div>
  ),
});

const SearchResults = dynamic(() => import("@/components/search/SearchResults").then((mod) => ({ default: mod.SearchResults })), {
  loading: () => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-64 animate-pulse rounded-lg bg-norse-gray-800"></div>
      ))}
    </div>
  ),
});

interface SearchResult {
  type: "god" | "story" | "realm";
  id: string;
  title: string;
  description: string;
  url: string;
  metadata?: Record<string, string | number | boolean>;
}

interface ContentFilters {
  godTypes?: GodType[];
  storyDifficulty?: StoryDifficulty[];
  realmLevels?: RealmLevel[];
}

function SearchPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get initial values from URL
  const initialQuery = searchParams.get("q") || "";
  const initialGodTypes = searchParams.get("godTypes")?.split(",").filter(Boolean) as GodType[] || [];
  const initialDifficulties = searchParams.get("difficulties")?.split(",").filter(Boolean) as StoryDifficulty[] || [];
  const initialRealms = searchParams.get("realms")?.split(",").filter(Boolean) as RealmLevel[] || [];

  // State
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  
  // Filters
  const [filters, setFilters] = useState<ContentFilters>({
    godTypes: initialGodTypes.length > 0 ? initialGodTypes : undefined,
    storyDifficulty: initialDifficulties.length > 0 ? initialDifficulties : undefined,
    realmLevels: initialRealms.length > 0 ? initialRealms : undefined,
  });

  // Deferred query for non-blocking UI
  const deferredQuery = useDeferredValue(query);

  // Update URL when filters or query change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (deferredQuery) {
      params.set("q", deferredQuery);
    }
    
    if (filters.godTypes && filters.godTypes.length > 0) {
      params.set("godTypes", filters.godTypes.join(","));
    }
    
    if (filters.storyDifficulty && filters.storyDifficulty.length > 0) {
      params.set("difficulties", filters.storyDifficulty.join(","));
    }
    
    if (filters.realmLevels && filters.realmLevels.length > 0) {
      params.set("realms", filters.realmLevels.join(","));
    }

    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [deferredQuery, filters, pathname, router]);

  // Perform search via API
  useEffect(() => {
    async function performSearch() {
      setIsLoading(true);
      
      try {
        // Build query params
        const params = new URLSearchParams();
        if (deferredQuery.trim()) {
          params.set("q", deferredQuery);
        }
        if (filters.godTypes && filters.godTypes.length > 0) {
          params.set("godTypes", filters.godTypes.join(","));
        }
        if (filters.storyDifficulty && filters.storyDifficulty.length > 0) {
          params.set("difficulties", filters.storyDifficulty.join(","));
        }
        if (filters.realmLevels && filters.realmLevels.length > 0) {
          params.set("realms", filters.realmLevels.join(","));
        }

        // Fetch from API
        const response = await fetch(`/api/search?${params.toString()}`);
        const data = await response.json();
        
        startTransition(() => {
          setResults(data.results || []);
        });
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }

    performSearch();
  }, [deferredQuery, filters]);

  // Handle filter changes
  const handleFilterChange = (newFilters: ContentFilters) => {
    setFilters(newFilters);
  };

  // Handle search query change
  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
  };

  // Clear search and filters
  const handleClear = () => {
    setQuery("");
    setFilters({
      godTypes: undefined,
      storyDifficulty: undefined,
      realmLevels: undefined,
    });
  };

  const hasQuery = query.trim().length > 0;
  const hasFilters =
    (filters.godTypes && filters.godTypes.length > 0) ||
    (filters.storyDifficulty && filters.storyDifficulty.length > 0) ||
    (filters.realmLevels && filters.realmLevels.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Search Norse Mythology
          </h1>
          <p className="text-lg text-gray-600">
            Find gods, stories, and realms across the Nine Worlds
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            value={query}
            onChange={handleQueryChange}
            onClear={handleClear}
            placeholder="Search for gods, stories, or realms..."
          />
        </div>

        {/* Filters and Results */}
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Filter Sidebar */}
          <aside>
            <FilterGroup filters={filters} onChange={handleFilterChange} />
          </aside>

          {/* Results */}
          <main>
            {/* Result Count */}
            <div className="mb-4 flex items-center justify-between">
              <div
                className="text-sm text-gray-600"
                role="status"
                aria-live="polite"
                aria-atomic="true"
              >
                {isLoading || isPending ? (
                  <span>Searching...</span>
                ) : (
                  <span>
                    Found {results.length} {results.length === 1 ? "result" : "results"}
                    {hasQuery && ` for "${query}"`}
                  </span>
                )}
              </div>

              {(hasQuery || hasFilters) && (
                <button
                  onClick={handleClear}
                  className="text-sm text-norse-gold hover:text-norse-bronze transition-colors font-medium"
                  type="button"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Search Results */}
            <SearchResults
              results={results}
              query={deferredQuery}
              isLoading={isLoading || isPending}
            />
          </main>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <SearchErrorBoundary>
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Search Norse Mythology
              </h1>
              <p className="text-lg text-gray-600">
                Find gods, stories, and realms across the Nine Worlds
              </p>
            </div>
            <div className="mb-6 h-14 animate-pulse rounded-lg bg-norse-gray-800"></div>
          </div>
        </div>
      }>
        <SearchPageContent />
      </Suspense>
    </SearchErrorBoundary>
  );
}
