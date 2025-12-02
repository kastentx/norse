import fs from "fs/promises";
import path from "path";
import { Realm, RealmSchema } from "@/types/realm";

const DATA_DIR = path.join(process.cwd(), "data", "realms");

/**
 * Get all Nine Realms sorted by level (upper -> middle -> lower) and name
 * @returns Array of Realm objects
 */
export async function getAllRealms(): Promise<Realm[]> {
  try {
    const files = await fs.readdir(DATA_DIR);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    const realms = await Promise.all(
      jsonFiles.map(async (file) => {
        const filePath = path.join(DATA_DIR, file);
        const content = await fs.readFile(filePath, "utf-8");
        const data = JSON.parse(content);
        return RealmSchema.parse(data);
      })
    );

    // Sort by level priority (upper > middle > lower), then alphabetically
    const levelOrder = { upper: 0, middle: 1, lower: 2 };
    return realms.sort((a, b) => {
      const levelDiff = levelOrder[a.location.level] - levelOrder[b.location.level];
      return levelDiff !== 0 ? levelDiff : a.name.localeCompare(b.name);
    });
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      console.warn(`Realms directory not found: ${DATA_DIR}`);
      return [];
    }
    console.error("Error loading realms:", error);
    return [];
  }
}

/**
 * Get a single realm by its ID
 * @param id - Realm ID
 * @returns Realm object or null if not found
 */
export async function getRealmById(id: string): Promise<Realm | null> {
  try {
    const filePath = path.join(DATA_DIR, `${id}.json`);
    const content = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(content);
    return RealmSchema.parse(data);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return null;
    }
    console.error(`Error loading realm ${id}:`, error);
    return null;
  }
}

/**
 * Get realms filtered by cosmology level
 * @param level - Realm level (upper, middle, or lower)
 * @returns Array of Realm objects
 */
export async function getRealmsByLevel(
  level: "upper" | "middle" | "lower"
): Promise<Realm[]> {
  const realms = await getAllRealms();
  return realms.filter((realm) => realm.location.level === level);
}

/**
 * Search realms by name, description, or characteristics
 * @param query - Search query string
 * @returns Array of Realm objects matching the query
 */
export async function searchRealms(query: string): Promise<Realm[]> {
  const realms = await getAllRealms();
  const lowerQuery = query.toLowerCase();

  return realms.filter(
    (realm) =>
      realm.name.toLowerCase().includes(lowerQuery) ||
      realm.description.toLowerCase().includes(lowerQuery) ||
      realm.characteristics.environment.toLowerCase().includes(lowerQuery) ||
      realm.characteristics.culture.toLowerCase().includes(lowerQuery) ||
      realm.characteristics.significance.toLowerCase().includes(lowerQuery)
  );
}
