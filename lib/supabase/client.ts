import { createBrowserClient } from '@supabase/ssr'
import { Database } from './database.types'

/**
 * Client-side Supabase Client (Singleton Pattern)
 * 
 * CRITICAL RULES:
 * - Only use in Client Components (with 'use client' directive)
 * - Never use in Server Components or API routes
 * - Automatically handles browser cookie-based authentication
 * 
 * Security:
 * - Respects RLS policies defined in database
 * - Uses anon key (public-safe)
 * - Session managed via HTTP-only cookies
 * 
 * Pattern:
 * - Singleton ensures one instance per browser session
 * - Reduces overhead and connection pooling issues
 */

let client: ReturnType<typeof createBrowserClient<Database>> | null = null

export function createClient() {
  if (client) {
    return client
  }

  client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return client
}

/**
 * Reset the singleton client
 * Useful for testing or when you need to force a new instance
 */
export function resetClient() {
  client = null
}
