import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Client
 * 
 * Server-side client for interacting with Supabase.
 * Uses service role key for full access (server-side only).
 * 
 * Environment variables required:
 * - NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL
 * - SUPABASE_SERVICE_ROLE_KEY: Service role key (keep secret!)
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
}

if (!supabaseServiceRoleKey) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable");
}

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/**
 * Database Types
 * 
 * These match the Supabase table schema.
 * Run this SQL in Supabase SQL Editor to create the table:
 * 
 * ```sql
 * CREATE TABLE user_favorites (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   user_id TEXT NOT NULL UNIQUE,
 *   favorite_gods TEXT[] DEFAULT '{}',
 *   favorite_realms TEXT[] DEFAULT '{}',
 *   created_at TIMESTAMPTZ DEFAULT NOW(),
 *   updated_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * 
 * -- Create index for fast lookups by user_id
 * CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
 * 
 * -- Enable Row Level Security (optional but recommended)
 * ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
 * 
 * -- Create policy to allow service role full access
 * CREATE POLICY "Service role has full access" ON user_favorites
 *   FOR ALL
 *   USING (true)
 *   WITH CHECK (true);
 * ```
 */
export interface UserFavoritesRow {
  id: string;
  user_id: string;
  favorite_gods: string[];
  favorite_realms: string[];
  created_at: string;
  updated_at: string;
}
