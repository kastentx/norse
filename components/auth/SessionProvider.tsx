"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { ReactNode, useEffect, useCallback, createContext, useContext, useState } from "react";
import type { Session } from "next-auth";

const SESSION_CACHE_KEY = "norse-cached-session";

/**
 * Offline Session Context
 * 
 * Provides additional offline-awareness for the session state.
 */
interface OfflineSessionContextType {
  isUsingCachedSession: boolean;
  cachedSession: Session | null;
  clearSessionCache: () => void;
}

const OfflineSessionContext = createContext<OfflineSessionContextType>({
  isUsingCachedSession: false,
  cachedSession: null,
  clearSessionCache: () => {},
});

export function useOfflineSession() {
  return useContext(OfflineSessionContext);
}

/**
 * Cache the session to localStorage
 */
function cacheSession(session: Session | null) {
  if (typeof window === "undefined") return;
  
  if (session) {
    localStorage.setItem(SESSION_CACHE_KEY, JSON.stringify({
      session,
      cachedAt: Date.now(),
    }));
  } else {
    localStorage.removeItem(SESSION_CACHE_KEY);
  }
}

/**
 * Get cached session from localStorage
 */
function getCachedSession(): Session | null {
  if (typeof window === "undefined") return null;
  
  try {
    const cached = localStorage.getItem(SESSION_CACHE_KEY);
    if (!cached) return null;
    
    const { session, cachedAt } = JSON.parse(cached);
    
    // Don't use cache older than 7 days (JWT likely still valid but be cautious)
    const maxAge = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - cachedAt > maxAge) {
      localStorage.removeItem(SESSION_CACHE_KEY);
      return null;
    }
    
    return session;
  } catch {
    return null;
  }
}

/**
 * Offline Session Manager
 * 
 * Handles caching session state for offline use.
 */
function OfflineSessionManager({ children }: { children: ReactNode }) {
  const [isUsingCachedSession, setIsUsingCachedSession] = useState(false);
  const [cachedSession, setCachedSession] = useState<Session | null>(null);

  const clearSessionCache = useCallback(() => {
    localStorage.removeItem(SESSION_CACHE_KEY);
    setIsUsingCachedSession(false);
    setCachedSession(null);
  }, []);

  useEffect(() => {
    // Load cached session on mount
    const initial = getCachedSession();
    if (initial) {
      setCachedSession(initial);
    }
    
    // Listen for session changes via custom event from our patched fetch
    const handleSessionUpdate = (event: CustomEvent<{ session: Session | null; fromCache: boolean }>) => {
      if (event.detail.fromCache) {
        setIsUsingCachedSession(true);
        setCachedSession(event.detail.session);
      } else {
        setIsUsingCachedSession(false);
        if (event.detail.session) {
          setCachedSession(event.detail.session);
        }
        cacheSession(event.detail.session);
      }
    };

    window.addEventListener("session-update" as any, handleSessionUpdate);
    return () => {
      window.removeEventListener("session-update" as any, handleSessionUpdate);
    };
  }, []);

  return (
    <OfflineSessionContext.Provider value={{ isUsingCachedSession, cachedSession, clearSessionCache }}>
      {children}
    </OfflineSessionContext.Provider>
  );
}

/**
 * Session Provider Wrapper
 * 
 * Wraps the app with NextAuth's SessionProvider to enable:
 * - useSession() hook in client components
 * - signIn() and signOut() functions
 * - Session state management
 * - Offline session caching for resilient UX
 * 
 * This is a client component because SessionProvider uses React Context.
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <OfflineSessionManager>
        <SessionCacheSync />
        {children}
      </OfflineSessionManager>
    </NextAuthSessionProvider>
  );
}

/**
 * Session Cache Sync Component
 * 
 * Syncs the session with localStorage cache and handles offline scenarios.
 */
function SessionCacheSync() {
  useEffect(() => {
    // Intercept session fetches to add offline resilience
    const originalFetch = window.fetch;
    
    window.fetch = async function(input, init) {
      const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
      
      // Only intercept session API calls
      if (url.includes("/api/auth/session")) {
        try {
          const response = await originalFetch(input, init);
          
          if (response.ok) {
            // Clone response to read it and still return it
            const clonedResponse = response.clone();
            const session = await clonedResponse.json();
            
            // Cache the successful session
            cacheSession(session?.user ? session : null);
            
            // Dispatch event for session update
            window.dispatchEvent(new CustomEvent("session-update", {
              detail: { session: session?.user ? session : null, fromCache: false }
            }));
          }
          
          return response;
        } catch (error) {
          // Network error - try to use cached session
          // Don't rely on navigator.onLine as it can be unreliable
          const cachedSession = getCachedSession();
          
          if (cachedSession) {
            console.log("[Session] Using cached session due to network error");
            
            // Dispatch event indicating we're using cached session
            window.dispatchEvent(new CustomEvent("session-update", {
              detail: { session: cachedSession, fromCache: true }
            }));
            
            // Return a fake successful response with cached data
            return new Response(JSON.stringify(cachedSession), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }
          
          // No cached session - let the error propagate
          // This will show "logged out" state which is correct for first-time offline
          console.log("[Session] No cached session available, network error will show logged out");
          throw error;
        }
      }
      
      // For signout, clear the cache
      if (url.includes("/api/auth/signout")) {
        if (!navigator.onLine) {
          // Can't sign out while offline - throw to let UI handle it
          throw new Error("Cannot sign out while offline. Please reconnect to complete sign out.");
        }
        
        const response = await originalFetch(input, init);
        if (response.ok) {
          // Clear cached session on successful signout
          localStorage.removeItem(SESSION_CACHE_KEY);
          window.dispatchEvent(new CustomEvent("session-update", {
            detail: { session: null, fromCache: false }
          }));
        }
        return response;
      }
      
      // All other requests pass through
      return originalFetch(input, init);
    };
    
    // Cleanup: restore original fetch on unmount
    return () => {
      window.fetch = originalFetch;
    };
  }, []);
  
  return null;
}
