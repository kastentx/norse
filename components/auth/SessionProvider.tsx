"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { ReactNode } from "react";

/**
 * Session Provider Wrapper
 * 
 * Wraps the app with NextAuth's SessionProvider to enable:
 * - useSession() hook in client components
 * - signIn() and signOut() functions
 * - Session state management
 * 
 * This is a client component because SessionProvider uses React Context.
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
