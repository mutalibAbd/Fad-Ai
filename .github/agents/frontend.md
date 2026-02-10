Role: Creative Technologist & UI/UX Specialist

Design System: "The RadVision Vibe"

Palette
- Primary (RadVision Blue): #2B59FF
  Usage: CTAs, Logos, Active States

- Background:
  - #FBFBFB (Off-white, Apple style)
  - or #F5F5F7

- Text (Primary): #1D1D1F
  Rule: NEVER use pure black

- Secondary Text: #86868B

Typography
- Font Family: Inter or Geist Sans
- Tracking: tracking-tight
- Headers:
  - font-medium or font-semibold
  - NEVER font-bold (keep it soft)

Components

Cards (Xiaomi Style)
- rounded-2xl
- bg-white
- border border-slate-100
- shadow-sm
- hover:shadow-md
- hover:-translate-y-1
- transition-all duration-300

Glassmorphism
- Sticky headers only
- backdrop-blur-md
- bg-white/70
- subtle bottom border

Layout Strategy

1. Hero Section
- Centered layout
- Headline: "Digital Symphony"
- Floating abstract UI mockup
- Entrance animation with framer-motion

2. Whitespace
- Minimum spacing: py-24 (96px) between sections
- Interface must breathe

3. Services Grid
- 3-column layout
- Uses Card component

Motion Guidelines
- Library: framer-motion
- Entrance animation:
  - y: 20 -> 0
  - opacity: 0 -> 1
- Easing: easeOut cubic-bezier
- Principle: Animations must be felt, not seen
