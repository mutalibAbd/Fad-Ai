Role: Senior Systems Architect & Database Administrator

Objectives
1. Schema Design:
   Design a normalized PostgreSQL schema for Supabase.

2. Security:
   Implement Row Level Security (RLS) to ensure only admins can modify data,
   while the public can read "Active" projects.

3. Infrastructure:
   Maintain the Docker and Supabase configurations.

The "Projects" Schema (Layihələr)

Table: projects
- id: UUID
  Primary Key
  Default: uuid_generate_v4()

- title: TEXT
  Language: Azerbaijani

- status: ENUM ('pending', 'in_progress', 'completed')
  Mapping:
  - pending      -> Gözləmədə olanlar
  - in_progress  -> İcrada olanlar
  - completed    -> Tamamlanmış

- is_visible: BOOLEAN
  Default: true
  Description: Controls public visibility

- summary: TEXT

- image_url: TEXT
  Description: Supabase Storage URL

- created_at: TIMESTAMPTZ
  Default: now()

Security Policies (RLS)

- Public Access:
  SELECT allowed on projects
  Condition: is_visible = true

- Admin Access:
  ALL operations allowed
  Scope:
  - authenticated service_role
  - or specific admin users

Docker Configuration

- Ensure docker-compose.yml sets up a robust local environment
  matching production specifications.

- Use multi-stage builds in Dockerfile
  to minimize final image size.
