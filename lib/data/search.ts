import { getAllGods } from "./gods";
import { getAllStories } from "./stories";
import { getAllRealms } from "./realms";
import type { God } from "@/types/god";
import type { Story } from "@/types/story";
import type { Realm } from "@/types/realm";

export type SearchResult = {
  type: "god" | "story" | "realm";
  id: string;
  title: string;
  description: string;
  url: string;
  metadata?: Record<string, string | number | boolean>;
};

export type ContentFilters = {
  godTypes?: Array<"Aesir" | "Vanir" | "Jotun" | "Other">;
  storyDifficulty?: Array<"beginner" | "intermediate" | "advanced">;
  realmLevels?: Array<"upper" | "middle" | "lower">;
  storyThemes?: string[];
};

/**
 * Search across all content types
 * @param query - Search query string
 * @returns Array of SearchResult objects
 */
export async function searchAll(query: string): Promise<SearchResult[]> {
  const lowerQuery = query.toLowerCase();
  const results: SearchResult[] = [];

  // Search gods
  const gods = await getAllGods();
  const matchingGods = gods.filter(
    (god) =>
      god.name.toLowerCase().includes(lowerQuery) ||
      (god.title && god.title.toLowerCase().includes(lowerQuery)) ||
      god.description.toLowerCase().includes(lowerQuery) ||
      god.domain.some((d) => d.toLowerCase().includes(lowerQuery))
  );

  results.push(
    ...matchingGods.map((god) => ({
      type: "god" as const,
      id: god.id,
      title: god.title ? `${god.name} - ${god.title}` : god.name,
      description: god.description.substring(0, 150) + "...",
      url: `/gods/${god.id}`,
      metadata: {
        type: god.type,
        popularity: god.metadata.popularity,
        domain: god.domain.join(", "),
      },
    }))
  );

  // Search stories
  const stories = await getAllStories();
  const matchingStories = stories.filter(
    (story) =>
      story.title.toLowerCase().includes(lowerQuery) ||
      story.summary.toLowerCase().includes(lowerQuery) ||
      story.themes.some((theme) => theme.toLowerCase().includes(lowerQuery))
  );

  results.push(
    ...matchingStories.map((story) => ({
      type: "story" as const,
      id: story.slug,
      title: story.title,
      description: story.summary,
      url: `/stories/${story.slug}`,
      metadata: {
        difficulty: story.difficulty,
        readingTime: story.readingTime,
        themes: story.themes.join(", "),
      },
    }))
  );

  // Search realms
  const realms = await getAllRealms();
  const matchingRealms = realms.filter(
    (realm) =>
      realm.name.toLowerCase().includes(lowerQuery) ||
      realm.description.toLowerCase().includes(lowerQuery) ||
      realm.characteristics.environment.toLowerCase().includes(lowerQuery) ||
      realm.characteristics.culture.toLowerCase().includes(lowerQuery) ||
      realm.characteristics.significance.toLowerCase().includes(lowerQuery)
  );

  results.push(
    ...matchingRealms.map((realm) => ({
      type: "realm" as const,
      id: realm.id,
      title: realm.name,
      description: realm.description.substring(0, 150) + "...",
      url: `/realms/${realm.id}`,
      metadata: {
        level: realm.location.level,
        environment: realm.characteristics.environment,
        culture: realm.characteristics.culture,
      },
    }))
  );

  return results;
}

/**
 * Filter content based on provided criteria
 * @param filters - Content filter options
 * @returns Object with filtered gods, stories, and realms
 */
export async function filterContent(filters: ContentFilters): Promise<{
  gods: God[];
  stories: Story[];
  realms: Realm[];
}> {
  const [gods, stories, realms] = await Promise.all([
    getAllGods(),
    getAllStories(),
    getAllRealms(),
  ]);

  // Filter gods
  const filteredGods = gods.filter((god) => {
    if (filters.godTypes && !filters.godTypes.includes(god.type)) {
      return false;
    }
    return true;
  });

  // Filter stories
  const filteredStories = stories.filter((story) => {
    if (
      filters.storyDifficulty &&
      !filters.storyDifficulty.includes(story.difficulty)
    ) {
      return false;
    }
    if (
      filters.storyThemes &&
      !story.themes.some((theme) => filters.storyThemes?.includes(theme))
    ) {
      return false;
    }
    return true;
  });

  // Filter realms
  const filteredRealms = realms.filter((realm) => {
    if (
      filters.realmLevels &&
      !filters.realmLevels.includes(realm.location.level)
    ) {
      return false;
    }
    return true;
  });

  return {
    gods: filteredGods,
    stories: filteredStories,
    realms: filteredRealms,
  };
}
