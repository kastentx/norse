/**
 * Sync Status Component
 *
 * Displays the current sync status including:
 * - Online/offline indicator
 * - Pending changes count
 * - Manual sync button
 * - Sync errors
 */

"use client";

import { useSession } from "next-auth/react";
import { Wifi, WifiOff, RefreshCw, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useSync, useInitializeLocalData } from "@/lib/db/sync/hooks";

export function SyncStatus() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  // Initialize local data from remote
  useInitializeLocalData(userId);

  const { isOnline, isSyncing, pendingCount, lastSyncError, sync } =
    useSync(userId);

  // Don't show if not authenticated
  if (status !== "authenticated" || !session) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      {/* Online/Offline indicator */}
      <div
        className={cn(
          "flex items-center gap-1.5 px-2 py-1 rounded-full",
          isOnline
            ? "text-green-400 bg-green-400/10"
            : "text-amber-400 bg-amber-400/10"
        )}
        title={isOnline ? "Online" : "Offline - changes will sync when back online"}
      >
        {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
        <span className="hidden sm:inline text-xs">
          {isOnline ? "Online" : "Offline"}
        </span>
      </div>

      {/* Pending changes indicator */}
      {pendingCount > 0 && (
        <div
          className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded-full",
            "text-amber-400 bg-amber-400/10"
          )}
          title={`${pendingCount} change${pendingCount > 1 ? "s" : ""} pending sync`}
        >
          <span className="text-xs">{pendingCount} pending</span>
        </div>
      )}

      {/* Sync button (only show when online with pending changes) */}
      {isOnline && pendingCount > 0 && (
        <button
          onClick={sync}
          disabled={isSyncing}
          className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded-full",
            "text-norse-gold bg-norse-gold/10 hover:bg-norse-gold/20",
            "transition-colors",
            isSyncing && "opacity-50 cursor-not-allowed"
          )}
          title="Sync now"
        >
          <RefreshCw
            size={14}
            className={cn(isSyncing && "animate-spin")}
          />
          <span className="hidden sm:inline text-xs">
            {isSyncing ? "Syncing..." : "Sync"}
          </span>
        </button>
      )}

      {/* Sync error indicator */}
      {lastSyncError && (
        <div
          className="flex items-center gap-1.5 px-2 py-1 rounded-full text-red-400 bg-red-400/10"
          title={lastSyncError}
        >
          <AlertCircle size={14} />
          <span className="hidden sm:inline text-xs">Sync error</span>
        </div>
      )}
    </div>
  );
}
