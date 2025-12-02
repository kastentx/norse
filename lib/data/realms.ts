import { Realm, RealmSchema } from "@/types/realm";
import { z } from "zod";
import realmsData from "@/data/realms/nine-realms.json";

// Validate the imported data
const RealmsArraySchema = z.array(RealmSchema);

/**
 * Get all Nine Realms sorted by level (upper -> middle -> lower) and name
 * @returns Array of Realm objects
 */
export function getAllRealms(): Realm[] {
  try {
    const validated = RealmsArraySchema.parse(realmsData);
    
    // Sort by level priority (upper > middle > lower), then alphabetically
    const levelOrder = { upper: 0, middle: 1, lower: 2 };
    return validated.sort((a, b) => {
      const levelDiff = levelOrder[a.location.level] - levelOrder[b.location.level];
      return levelDiff !== 0 ? levelDiff : a.name.localeCompare(b.name);
    });
  } catch (error) {
    console.error("Failed to validate realms data:", error);
    return [];
  }
}

/**
 * Get a single realm by its ID
 * @param id - Realm ID
 * @returns Realm object or undefined if not found
 */
export function getRealmById(id: string): Realm | undefined {
  const realms = getAllRealms();
  return realms.find((realm) => realm.id === id);
}

/**
 * Get realms filtered by cosmology level
 * @param level - Realm level (upper, middle, or lower)
 * @returns Array of Realm objects
 */
export function getRealmsByLevel(
  level: "upper" | "middle" | "lower"
): Realm[] {
  const realms = getAllRealms();
  return realms.filter((realm) => realm.location.level === level);
}

/**
 * Get realms connected to a specific realm
 * @param realmId - The realm ID
 * @returns Array of connected realms
 */
export function getConnectedRealms(realmId: string): Realm[] {
  const realm = getRealmById(realmId);
  if (!realm || !realm.connections) return [];

  const allRealms = getAllRealms();
  return allRealms.filter((r) => realm.connections?.includes(r.id));
}

/**
 * Search realms by name, description, or characteristics
 * @param query - Search query string
 * @returns Array of Realm objects matching the query
 */
export function searchRealms(query: string): Realm[] {
  const realms = getAllRealms();
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
