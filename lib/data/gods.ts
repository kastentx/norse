import { promises as fs } from "fs";
import path from "path";
import { God, GodSchema, GodType } from "@/types/god";
import { z } from "zod";

const DATA_DIR = path.join(process.cwd(), "data", "gods");

/**
 * Load all gods from JSON files
 */
export async function getAllGods(): Promise<God[]> {
  try {
    const files = await fs.readdir(DATA_DIR);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    const gods = await Promise.all(
      jsonFiles.map(async (file) => {
        const filePath = path.join(DATA_DIR, file);
        const fileContent = await fs.readFile(filePath, "utf-8");
        const data = JSON.parse(fileContent);
        return GodSchema.parse(data);
      })
    );

    // Sort by popularity descending
    return gods.sort((a, b) => b.metadata.popularity - a.metadata.popularity);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("God data validation failed:", JSON.stringify(error.issues));
      throw new Error(`Invalid god data format: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Load a single god by ID
 */
export async function getGodById(id: string): Promise<God | null> {
  try {
    const filePath = path.join(DATA_DIR, `${id}.json`);
    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);
    return GodSchema.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    if (error instanceof z.ZodError) {
      console.error(`God ${id} validation failed:`, JSON.stringify(error.issues));
      throw new Error(`Invalid god data format: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Filter gods by type
 */
export async function getGodsByType(type: GodType): Promise<God[]> {
  const gods = await getAllGods();
  return gods.filter((god) => god.type === type);
}

/**
 * Search gods by name, domain, or description
 */
export async function searchGods(query: string): Promise<God[]> {
  const gods = await getAllGods();
  const lowerQuery = query.toLowerCase();

  return gods.filter((god) => {
    // Exact name match gets priority
    if (god.name.toLowerCase() === lowerQuery) {
      return true;
    }

    // Partial matches
    return (
      god.name.toLowerCase().includes(lowerQuery) ||
      god.domain.some((d) => d.toLowerCase().includes(lowerQuery)) ||
      god.description.toLowerCase().includes(lowerQuery) ||
      (god.title && god.title.toLowerCase().includes(lowerQuery))
    );
  });
}
