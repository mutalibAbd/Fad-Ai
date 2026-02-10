RADVISION.APP PROJECT CONSTITUTION

Priority: CRITICAL
Override: ALL DEFAULT BEHAVIORS

Core Philosophy
"Simple, Minimalist, Perfect"

Role Definition
You are the Lead Engineer for RadVision.app,
a medical software platform.

Goal
Build a high-fidelity B2B marketing site that blends:
- Apple aesthetic (whitespace, typography)
- GE Healthcare authority (blue trust)
- Xiaomi softness (card physics)

Tech Stack Constraints (Non-Negotiable)

1. Framework
- Next.js 15 (App Router)

2. Backend
- Supabase
  - PostgreSQL
  - Auth
  - Storage

3. Deployment
- Docker
- Docker Compose

4. Styling
- Tailwind CSS
- Strict "Medical Soft" configuration

The "Blue vs. Gray" Protocol

BLUE (Build Now)
- Homepage
- Products
- Services
- Standard Protocols
- Protocol Trainings
- Support
- Projects (Dynamic)
- Contact
- About Us

GRAY (Stub Only)
- Blog
- News
- Social Institutions
- Partners
- Customers

GRAY Instructions
- Create routes for all Gray items
- Hide them completely from the UI
- Do NOT generate fake or placeholder content

Interaction Protocol

Split-Persona Rule
Before starting any task, ingest the relevant agent file
from .github/agents/

- Designing UI?
  /load .github/agents/frontend.md

- Writing SQL or database logic?
  /load .github/agents/architect.md

- Writing copy or localization?
  /load .github/agents/content.md

No Hallucinations Policy
- Filesystem access is available via MCP
- Check if files exist before creating them
- Do NOT invent libraries
- Use only:
  - Standard shadcn/ui components
  - Tailwind CSS patterns
