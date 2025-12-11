import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

/**
 * Auth.js v5 Configuration
 * 
 * This file exports:
 * - handlers: GET/POST handlers for /api/auth/* routes
 * - auth: Function to get current session (server-side)
 * - signIn: Function to trigger sign-in
 * - signOut: Function to trigger sign-out
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],

  callbacks: {
    /**
     * JWT Callback
     * Called when JWT is created (sign in) or updated (session access)
     * We add the user ID to the token for later use
     */
    async jwt({ token, user, account }) {
      // Initial sign in - add user ID to token
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    /**
     * Session Callback
     * Called when session is checked
     * We expose the user ID from the token to the session
     */
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
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
