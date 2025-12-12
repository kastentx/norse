/**
 * Sync Queue
 *
 * Manages the queue of pending mutations that need to be synced
 * to Supabase when the user comes back online.
 */

import { db, type PendingMutation } from "../index";

/**
 * Add a mutation to the pending queue
 */
export async function queueMutation(
  mutation: Omit<PendingMutation, "id" | "createdAt" | "retryCount">
): Promise<number> {
  return db.pendingMutations.add({
    ...mutation,
    createdAt: new Date().toISOString(),
    retryCount: 0,
  });
}

/**
 * Get all pending mutations for a user, sorted by creation time
 */
export async function getPendingMutations(
  providerAccountId: string
): Promise<PendingMutation[]> {
  return db.pendingMutations
    .where("providerAccountId")
    .equals(providerAccountId)
    .sortBy("createdAt");
}

/**
 * Get count of pending mutations for a user
 */
export async function getPendingMutationsCount(
  providerAccountId: string
): Promise<number> {
  return db.pendingMutations
    .where("providerAccountId")
    .equals(providerAccountId)
    .count();
}

/**
 * Remove a mutation from the queue (after successful sync)
 */
export async function removeMutation(id: number): Promise<void> {
  await db.pendingMutations.delete(id);
}

/**
 * Increment retry count for a failed mutation
 */
export async function incrementRetry(id: number): Promise<void> {
  const mutation = await db.pendingMutations.get(id);
  if (mutation) {
    await db.pendingMutations.update(id, {
      retryCount: mutation.retryCount + 1,
    });
  }
}

/**
 * Clear all pending mutations for a user (e.g., on logout)
 */
export async function clearPendingMutations(
  providerAccountId: string
): Promise<void> {
  await db.pendingMutations
    .where("providerAccountId")
    .equals(providerAccountId)
    .delete();
}
