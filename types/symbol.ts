import { z } from "zod";

// Type enums
export type SymbolType = "weapon" | "artifact" | "creature" | "concept";

// Main Symbol interface
export interface Symbol {
  id: string;
  name: string;
  type: SymbolType;
  description: string;
  associatedGods: string[]; // God IDs
  significance: string;
  properties?: string[];
  stories?: string[]; // Story IDs
  imageUrl: string;
  iconUrl: string;
}

// Zod Schemas
export const SymbolTypeSchema = z.enum(["weapon", "artifact", "creature", "concept"]);

export const SymbolSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(100),
  type: SymbolTypeSchema,
  description: z.string().min(100).max(500),
  associatedGods: z.array(z.string()).min(1),
  significance: z.string(),
  properties: z.array(z.string()).optional(),
  stories: z.array(z.string()).optional(),
  imageUrl: z.string().startsWith("/images/symbols/"),
  iconUrl: z.string().startsWith("/images/symbols/icons/"),
});

// Type inference from Zod schema
export type SymbolValidated = z.infer<typeof SymbolSchema>;
