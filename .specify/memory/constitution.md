<!--
SYNC IMPACT REPORT - Constitution v1.0.0

Version Change: [TEMPLATE] → 1.0.0 (Initial constitution)
Bump Rationale: MINOR - Initial project constitution establishing core principles

Modified Principles:
- NEW: I. Component-First Architecture
- NEW: II. Type Safety & Data Integrity
- NEW: III. Responsive & Accessible Design
- NEW: IV. Performance & User Experience
- NEW: V. Modern Stack Adherence

Added Sections:
- Technology Stack Standards
- Development Workflow

Templates Status:
- ✅ plan-template.md: Reviewed - already supports web application structure
- ✅ spec-template.md: Reviewed - user story format aligns with UX-first principle
- ✅ tasks-template.md: Reviewed - supports component and testing discipline
- ✅ checklist-template.md: Reviewed - generic structure supports all principles
- ✅ agent-file-template.md: Reviewed - dynamic generation aligns with constitution

Follow-up TODOs: None - all placeholders filled
-->

# Norse Mythology Explorer Constitution

## Core Principles

### I. Component-First Architecture

Every feature MUST be built as composable, reusable React components following Next.js app directory conventions. Components MUST be:

- Self-contained with clear single responsibility
- Independently testable in isolation
- Documented with TypeScript types and JSDoc comments
- Organized by feature domain, not technical role

**Rationale**: Component-first architecture ensures scalability, maintainability, and enables parallel development. The app directory structure in Next.js 13+ enforces co-location of related code, reducing cognitive load.

### II. Type Safety & Data Integrity

TypeScript MUST be used throughout with strict mode enabled. All data structures, API responses, and component props MUST have explicit type definitions. Zod or similar runtime validation MUST be used for external data.

- No `any` types without explicit justification
- Shared types co-located with features or in dedicated `types/` directory
- API contracts defined with TypeScript interfaces
- Runtime validation for all user input and API responses

**Rationale**: Type safety catches errors at compile time, serves as living documentation, and enables confident refactoring. Runtime validation prevents invalid data from corrupting application state.

### III. Responsive & Accessible Design

All UI components MUST be fully responsive (mobile-first) and meet WCAG 2.1 AA accessibility standards. Tailwind CSS utility classes MUST be used for styling.

- Mobile-first responsive breakpoints (sm, md, lg, xl, 2xl)
- Semantic HTML elements with proper ARIA attributes
- Keyboard navigation support for all interactive elements
- Color contrast ratios meeting accessibility standards
- Dark mode support where applicable

**Rationale**: Norse mythology is rich visual content that must be accessible on all devices. Accessibility is not optional—it expands audience reach and improves SEO. Tailwind CSS ensures consistent design system adherence.

### IV. Performance & User Experience

Application MUST leverage Next.js performance optimizations and deliver excellent user experience.

- Server Components by default, Client Components only when needed (interactivity, hooks, browser APIs)
- Image optimization using Next.js Image component
- Route prefetching and optimistic UI updates
- Loading states and Suspense boundaries for async operations
- Bundle size monitoring and code splitting

**Rationale**: Norse mythology content is media-rich. Performance optimizations ensure fast load times and smooth interactions, critical for user engagement and SEO rankings.

### V. Modern Stack Adherence

Leverage cutting-edge capabilities of Next.js 15+ and React 19+. Stay current with framework best practices.

- Next.js App Router (not Pages Router)
- React Server Components and Server Actions
- Streaming and Suspense for progressive enhancement
- Modern React patterns (hooks, composition, server/client boundary)
- ESLint and Prettier for code quality

**Rationale**: Modern stack features provide better performance, developer experience, and maintainability. Framework-aligned patterns reduce friction and ensure long-term supportability.

## Technology Stack Standards

**Required Technologies**:

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript 5+ with strict mode
- **Styling**: Tailwind CSS 3+ with custom design system
- **Runtime**: Node.js 20+ LTS
- **Package Manager**: npm, yarn, or pnpm (project must document choice)

**Recommended Libraries**:

- **Validation**: Zod for schema validation
- **State Management**: React Context + hooks for simple state, Zustand for complex global state
- **Data Fetching**: Native fetch with Next.js caching, React Query for complex client-side data
- **UI Components**: Radix UI or Headless UI for accessible primitives
- **Icons**: Lucide React or Heroicons
- **Testing**: Vitest or Jest with React Testing Library

**Prohibited Patterns**:

- Pages Router (use App Router)
- JavaScript without TypeScript
- Inline styles (use Tailwind classes or CSS modules)
- Class components (use functional components with hooks)

## Development Workflow

**Specification-First**: All features begin with a specification document (`spec.md`) defining user stories, requirements, and success criteria before any implementation.

**Implementation Planning**: After specification approval, create implementation plan (`plan.md`) with technical approach, architecture decisions, and task breakdown.

**Incremental Delivery**: Build features as independently testable user stories, prioritized by value (P1, P2, P3). Each story MUST be demonstrable on its own.

**Code Reviews**: All changes require review for:

- Constitution compliance (principles adherence)
- TypeScript type safety
- Accessibility standards
- Component reusability
- Performance considerations

**Quality Gates**:

- TypeScript compilation with no errors
- ESLint passes with zero warnings
- All tests pass (if feature includes tests)
- Lighthouse accessibility score ≥ 90
- No console errors in browser

## Governance

This constitution supersedes all other development practices. Any deviation from core principles MUST be explicitly justified in the Complexity Tracking section of the implementation plan.

**Amendment Process**:

1. Propose amendment with clear rationale
2. Document impact on existing features
3. Update constitution version following semantic versioning
4. Update all dependent templates and documentation
5. Communicate changes to all contributors

**Versioning**:

- **MAJOR**: Backward incompatible principle changes or removals
- **MINOR**: New principles added or significant expansions
- **PATCH**: Clarifications, wording improvements, non-semantic refinements

**Compliance**: All feature specifications, implementation plans, and code reviews MUST verify constitution compliance. Use `.specify/memory/constitution.md` as the authoritative reference for all development decisions.

**Version**: 1.0.0 | **Ratified**: 2025-12-01 | **Last Amended**: 2025-12-01
