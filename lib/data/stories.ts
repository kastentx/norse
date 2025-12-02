import fs from "fs/promises";
import path from "path";
import { Story, StorySchema } from "@/types/story";

const DATA_DIR = path.join(process.cwd(), "data", "stories");

/**
 * Get all stories sorted by title
 * @returns Array of Story objects
 */
export async function getAllStories(): Promise<Story[]> {
  try {
    const files = await fs.readdir(DATA_DIR);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    const stories = await Promise.all(
      jsonFiles.map(async (file) => {
        const filePath = path.join(DATA_DIR, file);
        const content = await fs.readFile(filePath, "utf-8");
        const data = JSON.parse(content);
        return StorySchema.parse(data);
      })
    );

    return stories.sort((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      console.warn(`Stories directory not found: ${DATA_DIR}`);
      return [];
    }
    console.error("Error loading stories:", error);
    return [];
  }
}

/**
 * Get a single story by its slug
 * @param slug - Story slug (URL-safe identifier)
 * @returns Story object or null if not found
 */
export async function getStoryBySlug(slug: string): Promise<Story | null> {
  try {
    const filePath = path.join(DATA_DIR, `${slug}.json`);
    const content = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(content);
    return StorySchema.parse(data);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return null;
    }
    console.error(`Error loading story ${slug}:`, error);
    return null;
  }
}

/**
 * Get stories filtered by difficulty level
 * @param difficulty - Story difficulty level
 * @returns Array of Story objects
 */
export async function getStoriesByDifficulty(
  difficulty: "beginner" | "intermediate" | "advanced"
): Promise<Story[]> {
  const stories = await getAllStories();
  return stories.filter((story) => story.difficulty === difficulty);
}

/**
 * Search stories by title, summary, or themes
 * @param query - Search query string
 * @returns Array of Story objects matching the query
 */
export async function searchStories(query: string): Promise<Story[]> {
  const stories = await getAllStories();
  const lowerQuery = query.toLowerCase();

  return stories.filter(
    (story) =>
      story.title.toLowerCase().includes(lowerQuery) ||
      story.summary.toLowerCase().includes(lowerQuery) ||
      story.themes.some((theme) => theme.toLowerCase().includes(lowerQuery))
  );
}
