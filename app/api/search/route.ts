import { NextResponse } from "next/server";
import { searchAll, filterContent } from "@/lib/data/search";
import type { SearchResult, ContentFilters } from "@/lib/data/search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const godTypes = searchParams.get("godTypes")?.split(",").filter(Boolean);
  const difficulties = searchParams.get("difficulties")?.split(",").filter(Boolean);
  const realms = searchParams.get("realms")?.split(",").filter(Boolean);

  try {
    let results: SearchResult[] = [];

    // Build filters
    const filters: ContentFilters = {
      godTypes: godTypes?.length ? (godTypes as any) : undefined,
      storyDifficulty: difficulties?.length ? (difficulties as any) : undefined,
      realmLevels: realms?.length ? (realms as any) : undefined,
    };

    const hasActiveFilters =
      (filters.godTypes && filters.godTypes.length > 0) ||
      (filters.storyDifficulty && filters.storyDifficulty.length > 0) ||
      (filters.realmLevels && filters.realmLevels.length > 0);

    if (query.trim()) {
      // Search all content
      results = await searchAll(query);

      // Apply filters to search results if any
      if (hasActiveFilters) {
        const filtered = await filterContent(filters);
        const filteredIds = new Set([
          ...filtered.gods.map((g) => g.id),
          ...filtered.stories.map((s) => s.slug),
          ...filtered.realms.map((r) => r.id),
        ]);

        results = results.filter((r) => filteredIds.has(r.id));
      }
    } else if (hasActiveFilters) {
      // No query, just apply filters
      const filtered = await filterContent(filters);
      results = [
        ...filtered.gods.map((god) => ({
          type: "god" as const,
          id: god.id,
          title: god.title ? `${god.name} - ${god.title}` : god.name,
          description: god.description.substring(0, 150) + "...",
          url: `/gods/${god.id}`,
          metadata: {
            type: god.type,
            popularity: god.metadata.popularity,
          },
        })),
        ...filtered.stories.map((story) => ({
          type: "story" as const,
          id: story.slug,
          title: story.title,
          description: story.summary,
          url: `/stories/${story.slug}`,
          metadata: {
            difficulty: story.difficulty,
            readingTime: story.readingTime,
          },
        })),
        ...filtered.realms.map((realm) => ({
          type: "realm" as const,
          id: realm.id,
          title: realm.name,
          description: realm.description.substring(0, 150) + "...",
          url: `/realms/${realm.id}`,
          metadata: {
            level: realm.location.level,
          },
        })),
      ];
    } else {
      // No query and no filters - return all content
      const [gods, stories, realms] = await Promise.all([
        import("@/lib/data/gods").then((m) => m.getAllGods()),
        import("@/lib/data/stories").then((m) => m.getAllStories()),
        import("@/lib/data/realms").then((m) => m.getAllRealms()),
      ]);

      results = [
        ...gods.map((god) => ({
          type: "god" as const,
          id: god.id,
          title: god.title ? `${god.name} - ${god.title}` : god.name,
          description: god.description.substring(0, 150) + "...",
          url: `/gods/${god.id}`,
          metadata: {
            type: god.type,
            popularity: god.metadata.popularity,
          },
        })),
        ...stories.map((story) => ({
          type: "story" as const,
          id: story.slug,
          title: story.title,
          description: story.summary,
          url: `/stories/${story.slug}`,
          metadata: {
            difficulty: story.difficulty,
            readingTime: story.readingTime,
          },
        })),
        ...realms.map((realm) => ({
          type: "realm" as const,
          id: realm.id,
          title: realm.name,
          description: realm.description.substring(0, 150) + "...",
          url: `/realms/${realm.id}`,
          metadata: {
            level: realm.location.level,
          },
        })),
      ];
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Failed to search content", results: [] },
      { status: 500 }
    );
  }
}
