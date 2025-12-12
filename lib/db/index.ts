/**
 * Norse Database (Dexie.js)
 *
 * Local IndexedDB database for offline-first functionality.
 * Stores user favorites locally for instant access and queues
 * mutations for sync when the user comes back online.
 */

import Dexie, { type Table } from "dexie";
import type { FavoritesRecord, PendingMutation, SyncMeta } from "./schema";

class NorseDatabase extends Dexie {
  favorites!: Table<FavoritesRecord>;
  pendingMutations!: Table<PendingMutation>;
  syncMeta!: Table<SyncMeta>;

  constructor() {
    super("NorseDB");

    this.version(1).stores({
      // Primary key is auto-increment, indexed by providerAccountId
      favorites: "++id, providerAccountId",
      // Queue of pending mutations, indexed by user and creation time
      pendingMutations: "++id, providerAccountId, createdAt",
      // Key-value store for sync metadata
      syncMeta: "key",
    });
  }
}

// Singleton instance
export const db = new NorseDatabase();

// Re-export types for convenience
export type { FavoritesRecord, PendingMutation, SyncMeta };
