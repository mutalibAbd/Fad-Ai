# FADAI - Docker & Supabase Setup

## Architecture Overview

This project uses **Supabase CLI** for local backend infrastructure and **Docker** for the Next.js application.

### Infrastructure Components

1. **Supabase CLI** (`supabase start`)
   - PostgreSQL (Port 54322)
   - Supabase Studio (Port 54323)
   - Kong API Gateway (Port 54321)
   - PostgREST, GoTrue, Realtime, Storage

2. **Next.js Application** (Port 3000)
   - Hot reload enabled
   - Connected to Supabase via `host.docker.internal`

## Quick Start

### Prerequisites
- Docker Desktop installed and running
- Node.js 20+
- Supabase CLI (`npm install supabase` or `npx supabase`)

### Setup Steps

1. **Environment Configuration**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Start Supabase**
   ```bash
   npx supabase start
   ```
   This will output your local API URL, anon key, and service role key. Update `.env.local` if needed.

3. **Start Next.js (local)**
   ```bash
   npm run dev
   ```

   Or via Docker:
   ```bash
   docker-compose up -d
   ```

4. **Verify Services**
   - Next.js App: http://localhost:3000
   - Supabase Studio: http://localhost:54323
   - Supabase API: http://localhost:54321

5. **Check Logs**
   ```bash
   # Supabase
   npx supabase status

   # Next.js (Docker)
   docker-compose logs -f nextjs
   ```

## Database Management

### Run Migrations
Migrations in `supabase/migrations/` are applied automatically on `supabase start`.

### Reset Database
```bash
npx supabase db reset
```

### Generate TypeScript Types
```bash
npx supabase gen types typescript --local > lib/supabase/database.types.ts
```

## Development Workflow

### Stop Services
```bash
npx supabase stop
docker-compose down
```

### Clean Rebuild
```bash
npx supabase stop
npx supabase start
docker-compose down -v && docker-compose up -d --build
```

## Security Notes

### RLS Policies
- Public users: Can only view visible projects
- Admin users: Full CRUD access
- Service role: Bypasses all RLS (use carefully)

### Authentication
- ANON_KEY: Safe for client-side
- SERVICE_KEY: **NEVER** expose to browser

## Production Deployment

This configuration is for **local development only**.

For production:
- Use managed Supabase instance (https://supabase.com)
- Deploy Next.js to Vercel/Docker
- Update environment variables
- Configure proper JWT secrets
