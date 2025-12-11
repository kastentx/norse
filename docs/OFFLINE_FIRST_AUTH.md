# Offline-First Authentication Architecture

> **Purpose**: This document provides patterns and implementation guidance for building authentication that works in offline/intermittent connectivity scenarios. Useful for PWAs, mobile apps, and applications requiring offline data sync.

---

## 🎯 The Core Challenge

Traditional authentication assumes constant network connectivity:
- Tokens have short expiry (15 min - 1 hour)
- Session validation happens server-side
- OAuth flows require redirects to external providers

**Offline-first breaks these assumptions.** Users need to:
1. Access the app when offline
2. See their authenticated identity
3. Perform actions that sync when back online
4. Have tokens refresh automatically in the background

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     ONLINE MODE                              │
│  User → OAuth Login → Server validates → JWT issued          │
│                            ↓                                 │
│                   Store in IndexedDB:                        │
│                   - Access token (short-lived)               │
│                   - Refresh token (long-lived)               │
│                   - User profile                             │
│                   - Token expiry timestamp                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    OFFLINE MODE                              │
│  1. Check IndexedDB for cached credentials                   │
│  2. Validate locally (is token expired?)                     │
│  3. If expired but has refresh token → queue refresh         │
│  4. Allow "optimistic" access based on cached user           │
│  5. Queue data mutations for sync                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   BACK ONLINE                                │
│  1. Background sync triggers                                 │
│  2. Refresh token if needed                                  │
│  3. Replay queued mutations                                  │
│  4. Reconcile conflicts                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📚 Recommended Technology Stack

| Layer | Tool | Purpose |
|-------|------|---------|
| **Auth** | Auth.js v5 + custom adapter | OAuth + token management |
| **Local Storage** | **Dexie.js** | IndexedDB wrapper (much nicer API than raw IndexedDB) |
| **Sync Engine** | **TinyBase** or **PowerSync** | Handles conflict resolution |
| **Service Worker** | **Workbox** | Background sync, caching |

### Why Dexie.js over raw IndexedDB?

```javascript
// Raw IndexedDB - Verbose, callback-based
const request = indexedDB.open('AuthDB', 1);
request.onerror = (event) => { /* handle error */ };
request.onsuccess = (event) => {
  const db = event.target.result;
  const transaction = db.transaction(['auth'], 'readonly');
  const store = transaction.objectStore('auth');
  const getRequest = store.get('current');
  getRequest.onsuccess = () => { /* finally have data */ };
};

// Dexie.js - Clean, Promise-based
import Dexie from 'dexie';
const db = new Dexie('AuthDB');
const session = await db.auth.get('current');
```

---

## 🔧 Implementation Patterns

### 1. Auth Database Schema with Dexie.js

```typescript
// lib/offline/auth-store.ts
import Dexie, { type Table } from 'dexie';

export interface CachedUser {
  id: string;
  email: string;
  name: string;
  image?: string;
}

export interface AuthRecord {
  id: string;              // Always 'current' for single-user apps
  accessToken: string;
  refreshToken: string;
  expiresAt: number;       // Unix timestamp in milliseconds
  user: CachedUser;
  cachedAt: number;        // When this was cached
}

class AuthDatabase extends Dexie {
  auth!: Table<AuthRecord, string>;

  constructor() {
    super('AuthDB');
    this.version(1).stores({
      auth: 'id, expiresAt, cachedAt'
    });
  }
}

export const authDB = new AuthDatabase();

// Cache the current session
export async function cacheAuthSession(session: Omit<AuthRecord, 'id' | 'cachedAt'>) {
  await authDB.auth.put({
    ...session,
    id: 'current',
    cachedAt: Date.now(),
  });
}

// Retrieve cached session with validity check
export async function getCachedSession(): Promise<AuthRecord | null> {
  const record = await authDB.auth.get('current');
  if (!record) return null;
  
  // Check if token is still valid (with 5 minute buffer)
  const bufferMs = 5 * 60 * 1000;
  const isValid = record.expiresAt > Date.now() + bufferMs;
  
  return isValid ? record : null;
}

// Get cached session even if expired (for offline mode)
export async function getCachedSessionForOffline(): Promise<AuthRecord | null> {
  const record = await authDB.auth.get('current');
  if (!record) return null;
  
  // In offline mode, allow expired tokens up to 7 days old
  const maxOfflineAge = 7 * 24 * 60 * 60 * 1000;
  const isTooOld = record.cachedAt < Date.now() - maxOfflineAge;
  
  return isTooOld ? null : record;
}

// Clear cached session on logout
export async function clearCachedSession() {
  await authDB.auth.delete('current');
}
```

### 2. Offline-Aware Auth Hook

```typescript
// lib/offline/useOfflineAuth.ts
"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { 
  getCachedSession, 
  getCachedSessionForOffline,
  cacheAuthSession,
  clearCachedSession,
  type AuthRecord,
  type CachedUser
} from "./auth-store";

interface OfflineAuthState {
  user: CachedUser | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  isOnline: boolean;
  isOfflineMode: boolean;
  lastSyncedAt: number | null;
}

export function useOfflineAuth(): OfflineAuthState {
  const { data: onlineSession, status: onlineStatus } = useSession();
  const [offlineSession, setOfflineSession] = useState<AuthRecord | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);

  // Monitor online/offline status
  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine);
    
    const handleOnline = () => {
      console.log('[OfflineAuth] Back online');
      setIsOnline(true);
    };
    
    const handleOffline = () => {
      console.log('[OfflineAuth] Gone offline');
      setIsOnline(false);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Cache session when online and authenticated
  useEffect(() => {
    if (onlineSession?.user && isOnline) {
      const sessionData = {
        accessToken: (onlineSession as any).accessToken || '',
        refreshToken: (onlineSession as any).refreshToken || '',
        expiresAt: (onlineSession as any).expiresAt || Date.now() + 60 * 60 * 1000,
        user: {
          id: onlineSession.user.id || '',
          email: onlineSession.user.email || '',
          name: onlineSession.user.name || '',
          image: onlineSession.user.image || undefined,
        },
      };
      
      cacheAuthSession(sessionData);
      setLastSyncedAt(Date.now());
      console.log('[OfflineAuth] Session cached');
    }
  }, [onlineSession, isOnline]);

  // Load cached session when offline
  useEffect(() => {
    async function loadOfflineSession() {
      if (!isOnline) {
        const cached = await getCachedSessionForOffline();
        setOfflineSession(cached);
        console.log('[OfflineAuth] Loaded cached session:', !!cached);
      }
    }
    
    loadOfflineSession();
  }, [isOnline]);

  // Determine final auth state
  if (isOnline) {
    return {
      user: onlineSession?.user as CachedUser | null,
      status: onlineStatus,
      isOnline: true,
      isOfflineMode: false,
      lastSyncedAt,
    };
  }

  // Offline mode
  return {
    user: offlineSession?.user || null,
    status: offlineSession ? 'authenticated' : 'unauthenticated',
    isOnline: false,
    isOfflineMode: !!offlineSession,
    lastSyncedAt: offlineSession?.cachedAt || null,
  };
}
```

### 3. Auth.js Configuration for Offline Support

```typescript
// auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import type { JWT } from "next-auth/jwt";

// Token refresh function
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    // This URL depends on your OAuth provider
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      expiresAt: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          access_type: "offline",  // Required for refresh tokens
          prompt: "consent",
        },
      },
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, account, user }) {
      // Initial sign in - store tokens
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at ? account.expires_at * 1000 : Date.now() + 3600 * 1000,
          userId: user.id,
        };
      }

      // Return previous token if not expired
      if (Date.now() < (token.expiresAt as number)) {
        return token;
      }

      // Token expired, try to refresh
      console.log("[Auth] Token expired, refreshing...");
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      // Expose tokens to client for IndexedDB caching
      // SECURITY: Only do this if you need offline support
      return {
        ...session,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        expiresAt: token.expiresAt,
        error: token.error,
        user: {
          ...session.user,
          id: token.userId || token.sub,
        },
      };
    },
  },

  // Use JWT strategy for stateless auth (better for offline)
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
});
```

### 4. Background Sync with Service Worker (Workbox)

```typescript
// service-worker.ts
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, NetworkOnly } from 'workbox-strategies';
import { BackgroundSyncPlugin } from 'workbox-background-sync';
import { ExpirationPlugin } from 'workbox-expiration';

// Precache static assets
precacheAndRoute(self.__WB_MANIFEST);

// Background sync plugin for auth-related requests
const authSyncPlugin = new BackgroundSyncPlugin('auth-queue', {
  maxRetentionTime: 24 * 60, // Retry for up to 24 hours
  onSync: async ({ queue }) => {
    console.log('[SW] Processing auth queue');
    let entry;
    while ((entry = await queue.shiftRequest())) {
      try {
        await fetch(entry.request);
        console.log('[SW] Auth request synced:', entry.request.url);
      } catch (error) {
        console.error('[SW] Auth sync failed:', error);
        await queue.unshiftRequest(entry);
        throw error;
      }
    }
  },
});

// Queue token refresh requests when offline
registerRoute(
  /\/api\/auth\/(session|refresh)/,
  new NetworkOnly({
    plugins: [authSyncPlugin],
  }),
  'POST'
);

// Cache user data with network-first strategy
registerRoute(
  /\/api\/user/,
  new NetworkFirst({
    cacheName: 'user-data',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
      }),
    ],
  })
);
```

### 5. Sync Queue for User Actions

```typescript
// lib/offline/sync-queue.ts
import Dexie, { type Table } from 'dexie';

export interface QueuedAction {
  id?: number;
  type: 'favorite' | 'unfavorite' | 'updateProfile' | 'custom';
  payload: Record<string, unknown>;
  endpoint: string;
  method: 'POST' | 'PUT' | 'DELETE';
  createdAt: number;
  retryCount: number;
}

class SyncDatabase extends Dexie {
  queue!: Table<QueuedAction, number>;

  constructor() {
    super('SyncDB');
    this.version(1).stores({
      queue: '++id, type, createdAt'
    });
  }
}

export const syncDB = new SyncDatabase();

// Queue an action for later sync
export async function queueAction(action: Omit<QueuedAction, 'id' | 'createdAt' | 'retryCount'>) {
  await syncDB.queue.add({
    ...action,
    createdAt: Date.now(),
    retryCount: 0,
  });
  console.log('[SyncQueue] Action queued:', action.type);
}

// Process queued actions when back online
export async function processQueue(): Promise<{ success: number; failed: number }> {
  const actions = await syncDB.queue.orderBy('createdAt').toArray();
  let success = 0;
  let failed = 0;

  for (const action of actions) {
    try {
      const response = await fetch(action.endpoint, {
        method: action.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action.payload),
      });

      if (response.ok) {
        await syncDB.queue.delete(action.id!);
        success++;
        console.log('[SyncQueue] Synced:', action.type);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      failed++;
      // Increment retry count
      await syncDB.queue.update(action.id!, {
        retryCount: action.retryCount + 1,
      });
      console.error('[SyncQueue] Failed:', action.type, error);
    }
  }

  return { success, failed };
}

// Hook to auto-process queue when online
export function useAutoSync() {
  useEffect(() => {
    const handleOnline = async () => {
      console.log('[AutoSync] Online, processing queue...');
      const result = await processQueue();
      console.log('[AutoSync] Complete:', result);
    };

    window.addEventListener('online', handleOnline);
    
    // Also try on mount if already online
    if (navigator.onLine) {
      handleOnline();
    }

    return () => window.removeEventListener('online', handleOnline);
  }, []);
}
```

---

## 🔒 Security Considerations

### Token Storage Security

| Concern | Risk Level | Mitigation |
|---------|-----------|------------|
| **Tokens in IndexedDB** | Medium | Encrypt with Web Crypto API |
| **XSS attacks** | High | CSP headers, sanitize inputs |
| **Device theft** | Medium | Remote session revocation |
| **Long-lived refresh tokens** | Medium | Token rotation, limit offline duration |
| **Stale permissions** | Low | Re-validate when back online |

### Token Encryption Example

```typescript
// lib/offline/crypto.ts

// Generate a device-specific encryption key
async function getOrCreateDeviceKey(): Promise<CryptoKey> {
  const keyData = localStorage.getItem('device-key');
  
  if (keyData) {
    const rawKey = Uint8Array.from(atob(keyData), c => c.charCodeAt(0));
    return await crypto.subtle.importKey(
      'raw',
      rawKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }
  
  // Generate new key
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
  
  const exported = await crypto.subtle.exportKey('raw', key);
  localStorage.setItem('device-key', btoa(String.fromCharCode(...new Uint8Array(exported))));
  
  return key;
}

export async function encryptToken(token: string): Promise<string> {
  const key = await getOrCreateDeviceKey();
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );
  
  // Combine IV + encrypted data
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  
  return btoa(String.fromCharCode(...combined));
}

export async function decryptToken(encryptedToken: string): Promise<string> {
  const key = await getOrCreateDeviceKey();
  const combined = Uint8Array.from(atob(encryptedToken), c => c.charCodeAt(0));
  
  const iv = combined.slice(0, 12);
  const data = combined.slice(12);
  
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );
  
  return new TextDecoder().decode(decrypted);
}
```

---

## 📱 UI Patterns for Offline States

### Offline Indicator Component

```tsx
// components/shared/OfflineIndicator.tsx
"use client";

import { useOfflineAuth } from "@/lib/offline/useOfflineAuth";
import { WifiOff, RefreshCw } from "lucide-react";

export function OfflineIndicator() {
  const { isOnline, isOfflineMode, lastSyncedAt } = useOfflineAuth();
  
  if (isOnline) return null;
  
  const lastSyncText = lastSyncedAt 
    ? `Last synced ${formatRelativeTime(lastSyncedAt)}`
    : 'Not synced';
  
  return (
    <div className="fixed bottom-4 left-4 flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-black shadow-lg">
      <WifiOff size={16} />
      <span className="text-sm font-medium">
        Offline Mode
        {isOfflineMode && (
          <span className="ml-2 text-xs opacity-75">({lastSyncText})</span>
        )}
      </span>
    </div>
  );
}

function formatRelativeTime(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
```

### Optimistic UI with Rollback

```tsx
// Example: Favorite button with optimistic update
"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { queueAction } from "@/lib/offline/sync-queue";

export function FavoriteButton({ itemId, initialFavorited }: Props) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isPending, setIsPending] = useState(false);

  const handleToggle = async () => {
    const newState = !isFavorited;
    
    // Optimistic update
    setIsFavorited(newState);
    setIsPending(true);
    
    try {
      if (navigator.onLine) {
        // Try immediate sync
        const response = await fetch(`/api/favorites/${itemId}`, {
          method: newState ? 'POST' : 'DELETE',
        });
        
        if (!response.ok) throw new Error('Failed');
      } else {
        // Queue for later
        await queueAction({
          type: newState ? 'favorite' : 'unfavorite',
          endpoint: `/api/favorites/${itemId}`,
          method: newState ? 'POST' : 'DELETE',
          payload: { itemId },
        });
      }
    } catch (error) {
      // Rollback on failure
      setIsFavorited(!newState);
      console.error('Favorite failed:', error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button onClick={handleToggle} disabled={isPending}>
      <Heart fill={isFavorited ? 'red' : 'none'} />
    </button>
  );
}
```

---

## 🚀 Implementation Checklist

When adding offline-first auth to a project:

- [ ] Install Dexie.js: `npm install dexie`
- [ ] Create auth database schema
- [ ] Implement `useOfflineAuth` hook
- [ ] Configure Auth.js with token exposure in session callback
- [ ] Add `access_type: "offline"` to OAuth providers for refresh tokens
- [ ] Create sync queue for user actions
- [ ] Set up Workbox service worker for background sync
- [ ] Add offline indicator UI component
- [ ] Implement token encryption for IndexedDB storage
- [ ] Add remote session revocation endpoint
- [ ] Test offline → online transitions
- [ ] Set maximum offline session duration (e.g., 7 days)
- [ ] Handle "RefreshAccessTokenError" gracefully (force re-login)

---

## 📚 Further Reading

- [Dexie.js Documentation](https://dexie.org/)
- [Workbox Background Sync](https://developer.chrome.com/docs/workbox/modules/workbox-background-sync/)
- [Auth.js v5 Documentation](https://authjs.dev/)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [PowerSync - Offline-first sync](https://www.powersync.com/)
- [TinyBase - Reactive data store](https://tinybase.org/)
