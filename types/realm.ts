import { z } from "zod";

// Type enums
export type RealmLevel = "upper" | "middle" | "lower";

// Realm location interface
export interface RealmLocation {
  level: RealmLevel;
  coordinates: {
    x: number;
    y: number;
  };
}

// Realm inhabitants interface
export interface RealmInhabitants {
  primaryTypes: string[];
  notableResidents: string[]; // God IDs
}

// Realm characteristics interface
export interface RealmCharacteristics {
  environment: string;
  culture: string;
  significance: string;
}

// Realm map region interface
export interface RealmMapRegion {
  path: string;
  color: string;
  glowColor: string;
}

// Main Realm interface
export interface Realm {
  id: string;
  name: string;
  description: string;
  location: RealmLocation;
  inhabitants: RealmInhabitants;
  characteristics: RealmCharacteristics;
  stories: string[]; // Story IDs
  connections?: string[]; // Realm IDs
  imageUrl: string;
  mapRegion: RealmMapRegion;
}

// Zod Schemas
export const RealmLevelSchema = z.enum(["upper", "middle", "lower"]);

export const RealmLocationSchema = z.object({
  level: RealmLevelSchema,
  coordinates: z.object({
    x: z.number().min(0).max(100),
    y: z.number().min(0).max(100),
  }),
});

export const RealmInhabitantsSchema = z.object({
  primaryTypes: z.array(z.string()),
  notableResidents: z.array(z.string()),
});

export const RealmCharacteristicsSchema = z.object({
  environment: z.string(),
  culture: z.string(),
  significance: z.string(),
});

export const RealmMapRegionSchema = z.object({
  path: z.string(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  glowColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

export const RealmSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(100),
  description: z.string().min(200).max(1000),
  location: RealmLocationSchema,
  inhabitants: RealmInhabitantsSchema,
  characteristics: RealmCharacteristicsSchema,
  stories: z.array(z.string()),
  connections: z.array(z.string()).optional(),
  imageUrl: z.string().startsWith("/images/realms/"),
  mapRegion: RealmMapRegionSchema,
});

// Type inference from Zod schema
export type RealmValidated = z.infer<typeof RealmSchema>;
