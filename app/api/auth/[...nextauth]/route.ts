import { handlers } from "@/auth";

/**
 * Auth.js Route Handler
 * 
 * This creates all the auth API endpoints:
 * - GET/POST /api/auth/signin - Sign in page
 * - GET/POST /api/auth/signout - Sign out
 * - GET /api/auth/callback/[provider] - OAuth callback
 * - GET /api/auth/session - Get current session
 * - GET /api/auth/csrf - Get CSRF token
 * - GET /api/auth/providers - List available providers
 */
export const { GET, POST } = handlers;
