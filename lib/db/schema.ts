/**
 * Dexie Database Schema Types
 *
 * Defines the shape of data stored in IndexedDB for offline-first functionality.
 */

/**
 * User favorites stored locally in IndexedDB
 * Mirrors the Supabase user_favorites table structure
 */
export interface FavoritesRecord {
  id?: number; // Auto-increment local ID
  providerAccountId: string; // User identifier from OAuth
  favoriteGods: string[];
  favoriteRealms: string[];
  updatedAt: string;
  syncedAt?: string; // Last successful sync timestamp
}

/**
 * Pending mutations queued for sync when back online
 */
export interface PendingMutation {
  id?: number;
  type: "favorite" | "unfavorite";
  entityType: "god" | "realm";
  entityId: string;
  providerAccountId: string;
  createdAt: string;
  retryCount: number;
}

/**
 * Sync metadata (last sync time, etc.)
 */
export interface SyncMeta {
  key: string;
  value: string;
}
