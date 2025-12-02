import { z } from "zod";

// Type enums
export type StoryDifficulty = "beginner" | "intermediate" | "advanced";
export type SectionType = "text" | "quote" | "illustration";

// Story section interface
export interface StorySection {
  id?: string;
  type: SectionType;
  heading?: string;
  text?: string;
  imageUrl?: string;
  parallaxIntensity?: number;
}

// Story metadata interface
export interface StoryMetadata {
  featured: boolean;
  publishedDate: string;
  lastUpdated: string;
}

// Main Story interface
export interface Story {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: StorySection[];
  themes: string[];
  characters: string[]; // God IDs
  realms: string[]; // Realm IDs
  readingTime: number;
  difficulty: StoryDifficulty;
  relatedStories?: string[];
  imageUrl: string;
  metadata: StoryMetadata;
}

// Zod Schemas
export const SectionTypeSchema = z.enum(["text", "quote", "illustration"]);

export const StorySectionSchema = z.object({
  id: z.string().optional(),
  type: SectionTypeSchema,
  heading: z.string().optional(),
  text: z.string().optional(),
  imageUrl: z.string().optional(),
  parallaxIntensity: z.number().min(0).max(1).optional(),
}).refine((data) => {
  // Text is required for text and quote types, but optional for illustrations
  if ((data.type === "text" || data.type === "quote") && !data.text) {
    return false;
  }
  return true;
}, {
  message: "text field is required for text and quote section types",
});

export const StoryDifficultySchema = z.enum(["beginner", "intermediate", "advanced"]);

export const StoryMetadataSchema = z.object({
  featured: z.boolean(),
  publishedDate: z.string().datetime(),
  lastUpdated: z.string().datetime(),
});

export const StorySchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  summary: z.string().min(100).max(500),
  content: z.array(StorySectionSchema).min(3).max(20),
  themes: z.array(z.string()).min(1).max(5),
  characters: z.array(z.string()).min(1),
  realms: z.array(z.string()).min(1),
  readingTime: z.number().int().min(1).max(30),
  difficulty: StoryDifficultySchema,
  relatedStories: z.array(z.string()).optional(),
  imageUrl: z.string().startsWith("/images/stories/"),
  metadata: StoryMetadataSchema,
});

// Type inference from Zod schema
export type StoryValidated = z.infer<typeof StorySchema>;
