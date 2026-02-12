# FADAI Website Overhaul Plan

## Overview
Major restructuring of the FADAI marketing website: removing Standards page, enhancing Products with rich text, overhauling Services with two-level hierarchy + scroll spy, adding new Support (Destek) page, and new News (Xeberler) page with staggered animations.

**New Navigation Order**: Mehsullar | Xidmetler | Destek | Haqqimizda | Xeberler

---

## Phase 1: Database Migration (005_overhaul.sql)
- [ ] Create `service_categories` table (main services: Coaching, Consulting, etc.)
- [ ] Add `category_id`, `slug`, `content` (rich text), `detail_image_url` columns to `services` table (sub-services)
- [ ] Add `content` (rich text/markdown) column to `products` table
- [ ] Create `support_types` table (id, title, slug, description, image_url, content, sort_order, is_visible)
- [ ] Create `news` table (id, title, slug, summary, content, image_url, published_at, is_visible)
- [ ] Add RLS policies for all new tables
- [ ] Create storage buckets for support & news images
- [ ] Seed placeholder data for service_categories + sub-services
- [ ] Update `database.types.ts` with new table types
- [ ] Update `lib/types/index.ts` with new exported types

## Phase 2: Remove Standart Protokollar
- [ ] Remove `/standards` route (app/standards/)
- [ ] Remove admin `/admin/dashboard/standards` route
- [ ] Remove `lib/queries/standards.ts`
- [ ] Remove `lib/actions/standards.ts`
- [ ] Remove `components/admin/StandardForm.tsx`
- [ ] Remove "Standartlar" from AdminSidebar nav items
- [ ] (Keep DB table/migration - no destructive changes)

## Phase 3: Products Enhancement
- [ ] Add `content` textarea field to `ProductForm.tsx` (markdown/rich text)
- [ ] Update `createProduct` and `updateProduct` server actions to handle `content`
- [ ] Update product detail page (`/products/[slug]`) to render markdown content
- [ ] Ensure product cards on `/products` are properly clickable (already linked)

## Phase 4: Services Overhaul (Complete Redesign)

### 4a: Backend (queries, actions, types)
- [ ] Create `lib/queries/service-categories.ts` - getVisibleCategories(), getCategoryBySlug(), etc.
- [ ] Update `lib/queries/services.ts` - getServicesByCategory(), getServiceBySlug(), etc.
- [ ] Create `lib/actions/service-categories.ts` - CRUD for main services
- [ ] Update `lib/actions/services.ts` - add category_id, slug, content fields

### 4b: Admin Panel
- [ ] Create admin page for service categories (`/admin/dashboard/service-categories/`)
- [ ] Create `ServiceCategoryForm.tsx` component
- [ ] Update `ServiceForm.tsx` - add category dropdown, slug, content fields
- [ ] Update admin services list to show category grouping
- [ ] Add "Xidmət Kateqoriyaları" to AdminSidebar

### 4c: Public Services Page
- [ ] Redesign `/services` page with:
  - Hero section (keep existing)
  - Sticky secondary navbar with main service category names
  - Continuous scroll layout with all sub-services grouped by category
  - Zig-zag alternating layout (text-left/image-right, then text-right/image-left)
  - IntersectionObserver-based scroll spy for active navbar state
  - Clicking sub-service navigates to detail page
- [ ] Create `/services/[slug]` detail page for sub-services
  - Full content rendering (markdown)
  - Image, description, CTA to contact

## Phase 5: Destek (Support) Page

### 5a: Backend
- [ ] Create `lib/queries/support.ts` - getVisibleSupportTypes(), getSupportBySlug()
- [ ] Create `lib/actions/support.ts` - CRUD operations
- [ ] Create admin page `/admin/dashboard/support/` with list, new, edit
- [ ] Create `SupportForm.tsx` component
- [ ] Add "Destek" to AdminSidebar

### 5b: Public Pages
- [ ] Create `/support` page with:
  - Classic Hero section
  - Support types grid (text on left, image on right)
  - Clickable to detail page
- [ ] Create `/support/[slug]` detail page with:
  - Rich content display
  - Embedded contact form (reuse contact form logic)
  - Button that directs to /contact

## Phase 6: Xeberler (News) Page

### 6a: Backend
- [ ] Create `lib/queries/news.ts` - getVisibleNews(), getNewsBySlug()
- [ ] Create `lib/actions/news.ts` - CRUD operations
- [ ] Create admin page `/admin/dashboard/news/` with list, new, edit
- [ ] Create `NewsForm.tsx` component
- [ ] Add "Xeberler" to AdminSidebar

### 6b: Public Pages
- [ ] Create `/news` page with:
  - Classic Hero section
  - News grid with staggered cascade animation
  - Each card: small image, title, date, brief summary
  - fade-in + slide-up, sequential delay per card
  - Click navigates to detail page
- [ ] Create `/news/[slug]` detail page (blog layout)
  - Full content, image, date, back to news link

## Phase 7: Navigation Update
- [ ] Update `GlassHeader.tsx` navLinks: Mehsullar, Xidmetler, Destek, Haqqimizda, Xeberler
- [ ] Update `Footer.tsx` navLinks to match
- [ ] Update AdminSidebar: remove Standartlar, add Destek, Xeberler, Xidmet Kateqoriyalari

---

## Progress Tracker

| Phase | Status |
|-------|--------|
| Phase 1: DB Migration | DONE |
| Phase 2: Remove Standards | DONE |
| Phase 3: Products Enhancement | DONE |
| Phase 4: Services Overhaul | DONE |
| Phase 5: Destek Page | DONE |
| Phase 6: Xeberler Page | DONE |
| Phase 7: Navigation Update | DONE |

## Notes
- Migration file: `supabase/migrations/005_overhaul.sql` (run against Supabase to apply)
- Old `ServiceSection.tsx` deleted (replaced by `ServicesClient.tsx`)
- All admin CRUD pages created for: service-categories, services, support, news
