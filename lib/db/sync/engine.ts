/**
 * Sync Engine
 *
 * Orchestrates synchronization between local IndexedDB (Dexie) and remote Supabase.
 * Handles pushing local mutations to remote and pulling remote state to local.
 * 
 * IMPORTANT: This runs in the browser, so we use API routes (not direct Supabase access)
 * to communicate with the server. The API routes handle authentication and Supabase calls.
 */

import { db } from "../index";
import {
  getPendingMutations,
  removeMutation,
  incrementRetry,
  clearPendingMutations,
} from "./queue";

const MAX_RETRIES = 3;

export interface SyncResult {
  synced: number;
  failed: number;
  errors: string[];
}

interface SyncResponse {
  favoriteGods: string[];
  favoriteRealms: string[];
  updatedAt: string | null;
}

/**
 * Push all pending local mutations to remote via API
 */
export async function syncToRemote(userId: string): Promise<SyncResult> {
  const pending = await getPendingMutations(userId);
  let synced = 0;
  let failed = 0;
  const errors: string[] = [];

  // If no pending mutations, nothing to do
  if (pending.length === 0) {
    return { synced: 0, failed: 0, errors: [] };
  }

  try {
    // Get current local state to push
    const local = await db.favorites
      .where("providerAccountId")
      .equals(userId)
      .first();

    if (!local) {
      // No local data to sync - clear pending mutations
      await clearPendingMutations(userId);
      return { synced: 0, failed: 0, errors: [] };
    }

    // Push the current local favorites state to remote via API
    const response = await fetch("/api/user/favorites/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        favoriteGods: local.favoriteGods,
        favoriteRealms: local.favoriteRealms,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    // Success - clear all pending mutations
    await clearPendingMutations(userId);
    synced = pending.length;

    // Update last sync timestamp
    await db.syncMeta.put({ key: "lastSyncToRemote", value: new Date().toISOString() });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";

    // Increment retry count for all pending mutations
    for (const mutation of pending) {
      if (mutation.retryCount >= MAX_RETRIES) {
        errors.push(
          `Failed to sync ${mutation.type} ${mutation.entityType}:${mutation.entityId} - ${errorMsg}`
        );
        await removeMutation(mutation.id!);
        failed++;
      } else {
        await incrementRetry(mutation.id!);
      }
    }
  }

  return { synced, failed, errors };
}

/**
 * Pull latest state from remote via API to local IndexedDB
 */
export async function syncFromRemote(userId: string): Promise<void> {
  const response = await fetch("/api/user/favorites/sync");
  
  if (!response.ok) {
    if (response.status === 401) {
      // User not authenticated - nothing to sync
      return;
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}`);
  }

  const data: SyncResponse = await response.json();
  const now = new Date().toISOString();

  // Check if we have local data
  const existing = await db.favorites
    .where("providerAccountId")
    .equals(userId)
    .first();

  if (existing) {
    // Update existing record
    await db.favorites.update(existing.id!, {
      favoriteGods: data.favoriteGods,
      favoriteRealms: data.favoriteRealms,
      updatedAt: data.updatedAt || now,
      syncedAt: now,
    });
  } else {
    // Create new local record from remote
    await db.favorites.add({
      providerAccountId: userId,
      favoriteGods: data.favoriteGods,
      favoriteRealms: data.favoriteRealms,
      updatedAt: data.updatedAt || now,
      syncedAt: now,
    });
  }

  await db.syncMeta.put({ key: "lastSyncFromRemote", value: now });
}

/**
 * Full bidirectional sync: push local changes, then pull remote state
 */
export async function fullSync(userId: string): Promise<SyncResult> {
  // First push any pending mutations
  const pushResult = await syncToRemote(userId);

  // Then pull the latest remote state
  await syncFromRemote(userId);

  return pushResult;
}

/**
 * Get the last sync timestamps
 */
export async function getLastSyncTimes(): Promise<{
  toRemote?: string;
  fromRemote?: string;
}> {
  const toRemote = await db.syncMeta.get("lastSyncToRemote");
  const fromRemote = await db.syncMeta.get("lastSyncFromRemote");

  return {
    toRemote: toRemote?.value,
    fromRemote: fromRemote?.value,
  };
}

/**
 * Clear all local data for a user (e.g., on logout)
 */
export async function clearLocalData(userId: string): Promise<void> {
  await db.favorites.where("providerAccountId").equals(userId).delete();
  await db.pendingMutations.where("providerAccountId").equals(userId).delete();
}
