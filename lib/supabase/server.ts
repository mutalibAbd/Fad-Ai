import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from './database.types'

/**
 * Server-side Supabase Client (Singleton Pattern)
 * 
 * CRITICAL RULES:
 * - Only use in Server Components, Server Actions, and Route Handlers
 * - Automatically handles cookie-based authentication
 * - Creates a new client per request with proper cookie context
 * 
 * Security:
 * - Uses HTTP-only cookies for session management
 * - Respects RLS policies defined in database
 * - Service role should never be exposed to client
 */

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

/**
 * Admin Supabase Client with Service Role
 * 
 * WARNING: NEVER expose this client to the browser!
 * 
 * Use Cases:
 * - Server-side operations that bypass RLS
 * - Administrative tasks (bulk updates, system operations)
 * - Background jobs and scheduled tasks
 * 
 * Security:
 * - Bypasses all RLS policies
 * - Full database access
 * - Use only in secure server contexts
 */

export function createAdminClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    {
      cookies: {
        getAll() {
          return []
        },
        setAll() {},
      },
    }
  )
}
