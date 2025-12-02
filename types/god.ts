import { z } from "zod";

// Type enums
export type GodType = "Aesir" | "Vanir" | "Jotun" | "Other";

// Family relationships interface
export interface GodFamily {
  parents?: string[];
  siblings?: string[];
  children?: string[];
  spouse?: string;
}

// Attributes interface
export interface GodAttributes {
  appearance: string;
  personality: string;
  powers: string[];
}

// Metadata interface
export interface GodMetadata {
  featured: boolean;
  popularity: number;
  lastUpdated: string;
}

// Main God interface
export interface God {
  id: string;
  name: string;
  type: GodType;
  domain: string[];
  title?: string;
  description: string;
  symbols: string[]; // Symbol IDs
  realm: string; // Realm ID
  family?: GodFamily;
  attributes: GodAttributes;
  stories: string[]; // Story IDs
  imageUrl: string;
  iconUrl?: string;
  metadata: GodMetadata;
}

// Zod Schemas
export const GodTypeSchema = z.enum(["Aesir", "Vanir", "Jotun", "Other"]);

export const GodFamilySchema = z
  .object({
    parents: z.array(z.string()).optional(),
    siblings: z.array(z.string()).optional(),
    children: z.array(z.string()).optional(),
    spouse: z.string().optional(),
  })
  .optional();

export const GodAttributesSchema = z.object({
  appearance: z.string(),
  personality: z.string(),
  powers: z.array(z.string()),
});

export const GodMetadataSchema = z.object({
  featured: z.boolean(),
  popularity: z.number().int().min(1).max(100),
  lastUpdated: z.string().datetime(),
});

export const GodSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(100),
  type: GodTypeSchema,
  domain: z.array(z.string()).min(1).max(5),
  title: z.string().optional(),
  description: z.string().min(200).max(2000),
  symbols: z.array(z.string()).min(1),
  realm: z.string(),
  family: GodFamilySchema,
  attributes: GodAttributesSchema,
  stories: z.array(z.string()).min(1),
  imageUrl: z.string().startsWith("/images/gods/"),
  iconUrl: z.string().startsWith("/images/gods/icons/").optional(),
  metadata: GodMetadataSchema,
});

// Type inference from Zod schema
export type GodValidated = z.infer<typeof GodSchema>;
