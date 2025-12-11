import { supabase, UserFavoritesRow } from "@/lib/supabase/client";
import { UserFavorites, DEFAULT_FAVORITES } from "@/types/user";

/**
 * Convert database row to UserFavorites type
 */
function rowToFavorites(row: UserFavoritesRow | null): UserFavorites {
  if (!row) {
    return { ...DEFAULT_FAVORITES };
  }
  return {
    favoriteGods: row.favorite_gods || [],
    favoriteRealms: row.favorite_realms || [],
    updatedAt: row.updated_at,
  };
}

/**
 * Get a user's favorites from Supabase
 * Returns default empty favorites if user has no data yet
 */
export async function getUserFavorites(userId: string): Promise<UserFavorites> {
  const { data, error } = await supabase
    .from("user_favorites")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = no rows returned, which is fine for new users
    console.error("Error fetching favorites:", error);
  }

  return rowToFavorites(data);
}

/**
 * Update a user's favorites in Supabase
 * Uses upsert to create or update
 */
export async function updateUserFavorites(
  userId: string,
  favorites: Partial<UserFavorites>
): Promise<UserFavorites> {
  const current = await getUserFavorites(userId);
  
  const updatedFavorites = {
    favorite_gods: favorites.favoriteGods ?? current.favoriteGods,
    favorite_realms: favorites.favoriteRealms ?? current.favoriteRealms,
  };

  const { data, error } = await supabase
    .from("user_favorites")
    .upsert(
      {
        user_id: userId,
        ...updatedFavorites,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      }
    )
    .select()
    .single();

  if (error) {
    console.error("Error updating favorites:", error);
    throw new Error("Failed to update favorites");
  }

  return rowToFavorites(data);
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
