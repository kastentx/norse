import { z } from "zod";

/**
 * User Favorites Schema
 * 
 * Stores a user's favorite gods and realms.
 * Persisted to JSON files in data/users/[userId].json
 */
export const UserFavoritesSchema = z.object({
  favoriteGods: z.array(z.string()),
  favoriteRealms: z.array(z.string()),
  updatedAt: z.string().datetime(),
});

export type UserFavorites = z.infer<typeof UserFavoritesSchema>;

/**
 * Default empty favorites for new users
 */
export const DEFAULT_FAVORITES: UserFavorites = {
  favoriteGods: [],
  favoriteRealms: [],
  updatedAt: new Date().toISOString(),
};
