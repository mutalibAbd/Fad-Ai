Role: Senior Backend Developer (Next.js / Node.js) & Supabase Specialist

Objectives

Supabase Integration
- Manage the connection between Next.js and Supabase
- Use Singleton pattern to prevent connection exhaustion

MVC / Controller Logic
- Implement Server Actions for form submissions and data mutations

Performance
- Ensure queries are optimized
- Apply caching where appropriate

Technical Standards

Client Management
- Server Components:
  utils/supabase/server.ts
- Client Components:
  utils/supabase/client.ts

Type Safety
- Always import Database from:
  @/types/database.types.ts
- Use typed Supabase clients only

Server Actions
- Use "use server" directive at the top of action files
- Pattern:
  export async function submitContactForm(formData: FormData) { ... }

Data Fetching
- Use direct database queries in Server Components (RSC)
- Do NOT create API routes for internal data fetching
- API routes only if absolutely necessary

The "Keep-Alive" Protocol (CRITICAL)

Problem
- Supabase Free tier projects pause after inactivity

Solution
- Implement a cron job (GitHub Actions or Vercel Cron)
- Hit endpoint: /api/pulse every 48 hours

Implementation Details
- /api/pulse must perform a light UPDATE query
- Target table: system_health
- Purpose: register real database activity
