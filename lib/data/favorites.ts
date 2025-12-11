import { promises as fs } from "fs";
import path from "path";
import { UserFavorites, UserFavoritesSchema, DEFAULT_FAVORITES } from "@/types/user";

const USERS_DIR = path.join(process.cwd(), "data", "users");

/**
 * Get a user's favorites
 * Returns default empty favorites if user has no data yet
 */
export async function getUserFavorites(userId: string): Promise<UserFavorites> {
  try {
    // Sanitize userId to prevent path traversal
    const safeUserId = userId.replace(/[^a-zA-Z0-9-_]/g, "");
    const filePath = path.join(USERS_DIR, `${safeUserId}.json`);
    const content = await fs.readFile(filePath, "utf-8");
    return UserFavoritesSchema.parse(JSON.parse(content));
  } catch (error) {
    // Return empty favorites for new users
    return { ...DEFAULT_FAVORITES };
  }
}

/**
 * Update a user's favorites
 */
export async function updateUserFavorites(
  userId: string,
  favorites: Partial<UserFavorites>
): Promise<UserFavorites> {
  const current = await getUserFavorites(userId);
  const updated: UserFavorites = {
    ...current,
    ...favorites,
    updatedAt: new Date().toISOString(),
  };

  // Ensure directory exists
  await fs.mkdir(USERS_DIR, { recursive: true });

  // Sanitize userId
  const safeUserId = userId.replace(/[^a-zA-Z0-9-_]/g, "");
  const filePath = path.join(USERS_DIR, `${safeUserId}.json`);
  await fs.writeFile(filePath, JSON.stringify(updated, null, 2));

  return updated;
}

/**
 * Toggle a god in user's favorites
 * Returns the new favorite state
 */
export async function toggleFavoriteGod(
  userId: string,
  godId: string
): Promise<{ isFavorite: boolean; favorites: UserFavorites }> {
  const favorites = await getUserFavorites(userId);
  const isFavorite = favorites.favoriteGods.includes(godId);

  const newFavoriteGods = isFavorite
    ? favorites.favoriteGods.filter((id) => id !== godId)
    : [...favorites.favoriteGods, godId];

  const updated = await updateUserFavorites(userId, {
    favoriteGods: newFavoriteGods,
  });

  return {
    isFavorite: !isFavorite,
    favorites: updated,
  };
}

/**
 * Toggle a realm in user's favorites
 * Returns the new favorite state
 */
export async function toggleFavoriteRealm(
  userId: string,
  realmId: string
): Promise<{ isFavorite: boolean; favorites: UserFavorites }> {
  const favorites = await getUserFavorites(userId);
  const isFavorite = favorites.favoriteRealms.includes(realmId);

  const newFavoriteRealms = isFavorite
    ? favorites.favoriteRealms.filter((id) => id !== realmId)
    : [...favorites.favoriteRealms, realmId];

  const updated = await updateUserFavorites(userId, {
    favoriteRealms: newFavoriteRealms,
  });

  return {
    isFavorite: !isFavorite,
    favorites: updated,
  };
}

/**
 * Check if a god is in user's favorites
 */
export async function isGodFavorited(
  userId: string,
  godId: string
): Promise<boolean> {
  const favorites = await getUserFavorites(userId);
  return favorites.favoriteGods.includes(godId);
}

/**
 * Check if a realm is in user's favorites
 */
export async function isRealmFavorited(
  userId: string,
  realmId: string
): Promise<boolean> {
  const favorites = await getUserFavorites(userId);
  return favorites.favoriteRealms.includes(realmId);
}
