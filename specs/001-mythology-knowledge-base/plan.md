# Implementation Plan: Interactive Norse Mythology Knowledge Base

**Branch**: `001-mythology-knowledge-base` | **Date**: 2025-12-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-mythology-knowledge-base/spec.md`

## Summary

Build an interactive web application for exploring Norse mythology with animated god/deity cards, scrollable story narratives with parallax effects, an interactive Nine Realms map, and animated search/filter capabilities. The application will use Next.js 15+ with App Router, React Server Components, Framer Motion for animations, and Tailwind CSS for responsive design. Content will be managed as static JSON with TypeScript type safety throughout.

**Technical Approach**: Leverage React Server Components for initial content delivery, Client Components for interactive animations, Framer Motion for 60fps animations with reduced-motion support, Tailwind CSS for mobile-first responsive design, and static generation for optimal performance.

## Technical Context

**Language/Version**: TypeScript 5.3+ with strict mode enabled  
**Primary Dependencies**: Next.js 15.0+, React 19.0+, Framer Motion 11.0+, Tailwind CSS 3.4+  
**Storage**: Static JSON files in `/data` directory (future: Contentful/Sanity CMS integration)  
**Testing**: Vitest for unit tests, Playwright for E2E tests, React Testing Library for components  
**Target Platform**: Modern web browsers (Chrome/Firefox/Safari/Edge last 2 versions), SSG deployment on Vercel  
**Project Type**: Web application (Next.js App Router with Server/Client Components)  
**Performance Goals**: 60fps animations, <2s FCP, <500ms page transitions, Lighthouse score 90+  
**Constraints**: <200ms search response, reduced-motion compliance, 320px-2560px responsive range  
**Scale/Scope**: 12-15 gods, 5-8 stories, 9 realms, ~20 animated components, static generation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Principle I: Component-First Architecture

**Status**: COMPLIANT

- All features built as React components (GodCard, StoryViewer, RealmMap, SearchBar)
- App Router enforces feature co-location in `/app` directory
- Components organized by domain (gods/, stories/, realms/, search/)
- TypeScript interfaces for all component props
- Independent testability with React Testing Library

### ✅ Principle II: Type Safety & Data Integrity

**Status**: COMPLIANT

- TypeScript strict mode enabled in `tsconfig.json`
- Zod schemas for runtime validation at build time (SSG): All JSON files validated during `npm run build` before embedding in static HTML
- Runtime validation enforcement: Data loading functions in `lib/data/` parse JSON with `z.parse()` ensuring type safety at compilation boundaries
- All entities (God, Story, Realm, Symbol) have explicit TypeScript interfaces matching Zod schemas
- No `any` types (ESLint rule enforced)
- Data loading abstraction layer prepared for future CMS API integration with same validation contracts

### ✅ Principle III: Responsive & Accessible Design

**Status**: COMPLIANT

- Tailwind CSS with mobile-first breakpoints: 320px (base), sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px
- Responsive testing at key breakpoints: 320px, 375px, 768px, 1024px, 1920px, 2560px
- Semantic HTML5 elements (`<article>`, `<nav>`, `<section>`, `<aside>`, `<main>`, `<header>`)
- ARIA labels, roles, and live regions for all interactive elements
- Keyboard navigation with focus management (Tab, Enter, Escape, Arrow keys)
- Reduced-motion queries detected via `prefers-reduced-motion` with alternative animation variants
- Color contrast meets WCAG 2.1 AA standard (tested via Lighthouse accessibility audit)
- Screen reader compatibility tested with VoiceOver (macOS) and NVDA (Windows)

### ✅ Principle IV: Performance & User Experience

**Status**: COMPLIANT

- Server Components by default for static content
- Client Components only for animations and interactions
- Next.js Image component for optimized images (WebP/AVIF)
- Route prefetching enabled
- Suspense boundaries with animated loading states
- Framer Motion with `useReducedMotion` hook
- Code splitting via dynamic imports

### ✅ Principle V: Modern Stack Adherence

**Status**: COMPLIANT

- Next.js 15+ App Router (not Pages Router)
- React Server Components with Server Actions
- Streaming with Suspense
- Modern React hooks (useReducedMotion, useInView, useScroll)
- ESLint + Prettier configured
- TypeScript for all source files

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/                          # Next.js 15 App Router
├── (gods)/                   # Route group for god-related pages
│   ├── gods/
│   │   ├── page.tsx         # Server Component: Gods listing page
│   │   └── [slug]/
│   │       └── page.tsx     # Server Component: God detail page
│   └── layout.tsx           # Shared layout for gods section
├── (stories)/               # Route group for story pages
│   ├── stories/
│   │   ├── page.tsx         # Server Component: Stories listing
│   │   └── [slug]/
│   │       └── page.tsx     # Server Component: Story detail with parallax
│   └── layout.tsx
├── (realms)/                # Route group for Nine Realms
│   ├── realms/
│   │   └── page.tsx         # Client Component: Interactive map
│   └── layout.tsx
├── search/                  # Search and filter page
│   └── page.tsx             # Client Component: Search with animations
├── layout.tsx               # Root layout with navigation
├── page.tsx                 # Home page
├── globals.css              # Tailwind CSS imports
└── not-found.tsx            # 404 page

components/                  # Shared React components
├── gods/
│   ├── GodCard.tsx          # Client Component: Animated god card
│   ├── GodGrid.tsx          # Client Component: Grid with stagger animations
│   ├── GodDetailPanel.tsx   # Client Component: Slide-in detail panel
│   └── GodSkeleton.tsx      # Loading skeleton
├── stories/
│   ├── StoryHero.tsx        # Client Component: Parallax hero section
│   ├── StorySection.tsx     # Client Component: Animated story sections
│   └── StoryNav.tsx         # Navigation between stories
├── realms/
│   ├── RealmMap.tsx         # Client Component: SVG interactive map
│   ├── RealmTooltip.tsx     # Animated tooltip component
│   └── RealmDetail.tsx      # Realm information panel
├── search/
│   ├── SearchBar.tsx        # Client Component: Search input
│   ├── FilterGroup.tsx      # Client Component: Category filters
│   └── SearchResults.tsx    # Client Component: Animated results
├── ui/
│   ├── Button.tsx           # Base button component
│   ├── Card.tsx             # Base card component
│   ├── Modal.tsx            # Accessible modal with animations
│   └── Skeleton.tsx         # Base skeleton loader
└── layout/
    ├── Header.tsx           # Site header with navigation
    ├── Footer.tsx           # Site footer
    └── Navigation.tsx       # Main navigation menu

lib/                         # Utility functions and helpers
├── animations/
│   ├── variants.ts          # Framer Motion animation variants
│   ├── transitions.ts       # Reusable transition configs
│   └── hooks.ts             # useReducedMotion, useScrollAnimation
├── data/
│   ├── gods.ts              # God data loading/filtering functions
│   ├── stories.ts           # Story data functions
│   ├── realms.ts            # Realm data functions
│   └── search.ts            # Search/filter logic
└── utils/
    ├── cn.ts                # Tailwind class name merger (clsx + twMerge)
    └── accessibility.ts     # A11y helper functions

types/                       # TypeScript type definitions
├── god.ts                   # God/Deity types and Zod schemas
├── story.ts                 # Story types and schemas
├── realm.ts                 # Realm types and schemas
├── symbol.ts                # Symbol types and schemas
└── index.ts                 # Barrel exports

data/                        # Static content as JSON
├── gods/
│   ├── odin.json
│   ├── thor.json
│   ├── loki.json
│   └── ... (12-15 total)
├── stories/
│   ├── ragnarok.json
│   ├── yggdrasil.json
│   └── ... (5-8 total)
└── realms/
    └── nine-realms.json     # All 9 realms in one file

public/                      # Static assets
├── images/
│   ├── gods/               # God portraits (WebP/AVIF)
│   ├── stories/            # Story illustrations
│   └── realms/             # Realm visualizations
└── icons/                  # SVG icons

__tests__/                   # Test files
├── components/
│   ├── gods/
│   │   ├── GodCard.test.tsx
│   │   └── GodGrid.test.tsx
│   ├── stories/
│   └── realms/
├── lib/
│   ├── data/
│   └── utils/
└── e2e/
    ├── gods.spec.ts         # Playwright E2E tests
    ├── stories.spec.ts
    └── search.spec.ts

Configuration files (repository root):
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── next.config.js           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── vitest.config.ts         # Vitest configuration
├── playwright.config.ts     # Playwright configuration
├── .eslintrc.json          # ESLint rules
├── .prettierrc             # Prettier formatting
└── .env.local              # Environment variables (not committed)
```

**Structure Decision**: Next.js 15 App Router web application with feature-based organization. Route groups `(gods)`, `(stories)`, `(realms)` organize related pages without affecting URL structure. Components are organized by feature domain (gods/, stories/, realms/) rather than technical role. Static JSON content in `/data` directory with TypeScript validation. All configuration at repository root following Next.js conventions.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**No violations detected.** All constitution principles are satisfied by this implementation plan.
