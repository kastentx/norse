import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Discord from "next-auth/providers/discord";

/**
 * Auth.js v5 Configuration
 * 
 * This file exports:
 * - handlers: GET/POST handlers for /api/auth/* routes
 * - auth: Function to get current session (server-side)
 * - signIn: Function to trigger sign-in
 * - signOut: Function to trigger sign-out
 * 
 * Providers:
 * - Google: Most common, works for general audiences
 * - GitHub: Good for developers
 * - Discord: Popular with gaming/community audiences
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // Google - primary provider for general audiences
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    // GitHub - for developers
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    // Discord - for gaming/community audiences
    Discord({
      clientId: process.env.AUTH_DISCORD_ID,
      clientSecret: process.env.AUTH_DISCORD_SECRET,
    }),
  ],

  callbacks: {
    /**
     * JWT Callback
     * Called when JWT is created (sign in) or updated (session access)
     * We use the provider's account ID for consistent identification
     */
    async jwt({ token, account }) {
      // Initial sign in - use provider's consistent account ID
      // Without a database adapter, user.id is a random UUID each login
      // account.providerAccountId is the consistent ID from Google/GitHub/Discord
      if (account) {
        token.userId = `${account.provider}:${account.providerAccountId}`;
      }
      return token;
    },

    /**
     * Session Callback
     * Called when session is checked
     * We expose the consistent user ID from the token to the session
     */
    async session({ session, token }) {
      if (session.user && token.userId) {
        session.user.id = token.userId as string;
      }
      return session;
    },
  },

  // Use JWT strategy (stateless, no database required)
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Trust the host header (required for production behind proxy)
  trustHost: true,
});
