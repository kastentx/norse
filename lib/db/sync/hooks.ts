/**
 * Sync Hooks
 *
 * React hooks for offline-first data access and sync status.
 * Uses Dexie's live queries for reactive local data.
 */

"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { useState, useEffect, useCallback, useRef } from "react";
import { db, type FavoritesRecord } from "../index";
import { syncToRemote, syncFromRemote, fullSync } from "./engine";
import { queueMutation } from "./queue";

/**
 * Hook to track online/offline status
 */
export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}

/**
 * Hook to get count of pending mutations for a user
 */
export function usePendingMutationsCount(
  userId: string | undefined
): number {
  const count = useLiveQuery(
    () =>
      userId
        ? db.pendingMutations.where("providerAccountId").equals(userId).count()
        : Promise.resolve(0),
    [userId],
    0
  );

  return count;
}

/**
 * Hook to get user's favorites from local IndexedDB (reactive)
 */
export function useFavorites(
  userId: string | undefined
): FavoritesRecord | undefined {
  return useLiveQuery(
    async () => {
      if (!userId) return undefined;
      return db.favorites.where("providerAccountId").equals(userId).first();
    },
    [userId],
    undefined
  );
}

/**
 * Hook to check if a specific item is favorited
 */
export function useIsFavorited(
  userId: string | undefined,
  type: "god" | "realm",
  itemId: string
): boolean {
  const favorites = useFavorites(userId);

  if (!favorites) return false;

  return type === "god"
    ? favorites.favoriteGods?.includes(itemId) ?? false
    : favorites.favoriteRealms?.includes(itemId) ?? false;
}

/**
 * Hook for sync operations and status
 */
export function useSync(userId: string | undefined) {
  const isOnline = useOnlineStatus();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncError, setLastSyncError] = useState<string | null>(null);
  const pendingCount = usePendingMutationsCount(userId);
  const syncInProgressRef = useRef(false);

  const sync = useCallback(async () => {
    if (!userId || !isOnline || syncInProgressRef.current) return;

    syncInProgressRef.current = true;
    setIsSyncing(true);
    setLastSyncError(null);

    try {
      const result = await fullSync(userId);
      if (result.errors.length > 0 && result.errors[0]) {
        setLastSyncError(result.errors[0]);
      }
    } catch (error) {
      setLastSyncError(
        error instanceof Error ? error.message : "Sync failed"
      );
    } finally {
      setIsSyncing(false);
      syncInProgressRef.current = false;
    }
  }, [userId, isOnline]);

  // Auto-sync when coming back online with pending changes
  useEffect(() => {
    if (isOnline && pendingCount > 0 && !syncInProgressRef.current) {
      sync();
    }
  }, [isOnline, pendingCount, sync]);

  return {
    isOnline,
    isSyncing,
    pendingCount,
    lastSyncError,
    sync,
  };
}

/**
 * Hook for toggling favorites with offline-first behavior
 */
export function useToggleFavorite(userId: string | undefined) {
  const isOnline = useOnlineStatus();

  const toggleFavorite = useCallback(
    async (type: "god" | "realm", itemId: string) => {
      if (!userId) return;

      // Get current local state
      const local = await db.favorites
        .where("providerAccountId")
        .equals(userId)
        .first();

      const currentList =
        type === "god"
          ? local?.favoriteGods || []
          : local?.favoriteRealms || [];

      const isFavorited = currentList.includes(itemId);
      const newList = isFavorited
        ? currentList.filter((id) => id !== itemId)
        : [...currentList, itemId];

      // 1. Optimistic local update
      if (local) {
        await db.favorites.update(local.id!, {
          ...(type === "god"
            ? { favoriteGods: newList }
            : { favoriteRealms: newList }),
          updatedAt: new Date().toISOString(),
        });
      } else {
        await db.favorites.add({
          providerAccountId: userId,
          favoriteGods: type === "god" ? newList : [],
          favoriteRealms: type === "realm" ? newList : [],
          updatedAt: new Date().toISOString(),
        });
      }

      // 2. Queue mutation for sync
      await queueMutation({
        type: isFavorited ? "unfavorite" : "favorite",
        entityType: type,
        entityId: itemId,
        providerAccountId: userId,
      });

      // 3. Attempt immediate sync if online
      if (isOnline) {
        syncToRemote(userId).catch(console.error);
      }

      return !isFavorited;
    },
    [userId, isOnline]
  );

  return toggleFavorite;
}

/**
 * Hook to initialize local data from remote on first load
 */
export function useInitializeLocalData(userId: string | undefined) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const isOnline = useOnlineStatus();

  useEffect(() => {
    if (!userId || isInitialized || isInitializing) return;

    const initialize = async () => {
      setIsInitializing(true);
      try {
        // Check if we already have local data
        const existing = await db.favorites
          .where("providerAccountId")
          .equals(userId)
          .first();

        if (!existing && isOnline) {
          // Pull from remote on first load
          await syncFromRemote(userId);
        }
      } catch (error) {
        console.error("Failed to initialize local data:", error);
      } finally {
        setIsInitialized(true);
        setIsInitializing(false);
      }
    };

    initialize();
  }, [userId, isInitialized, isInitializing, isOnline]);

  return { isInitialized, isInitializing };
}
