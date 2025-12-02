# Research: Interactive Norse Mythology Knowledge Base

**Feature**: 001-mythology-knowledge-base  
**Date**: 2025-12-02  
**Purpose**: Research findings for technical decisions and best practices

## Animation Performance with Framer Motion

### Decision: Use Framer Motion 11+ with `useReducedMotion` hook

**Rationale**:
- Framer Motion is the industry standard for React animations with excellent Next.js integration
- Built-in support for reduced-motion preferences via `useReducedMotion` hook
- Optimized for 60fps with GPU-accelerated transforms and opacity
- Declarative API with `motion` components reduces animation complexity
- Strong TypeScript support and active maintenance

**Alternatives Considered**:
- **React Spring**: More physics-based, but steeper learning curve and less declarative
- **CSS Animations only**: Limited control, harder to sync with React state
- **GSAP**: Powerful but imperative API, larger bundle size, licensing considerations
- **Anime.js**: Good performance but less React-centric integration

**Best Practices**:
- Use `transform` and `opacity` properties for best performance (avoid layout properties)
- Implement `initial`, `animate`, `exit` variants for consistent animations
- Leverage `AnimatePresence` for exit animations
- Use `useInView` hook for viewport-triggered animations (lazy animation)
- Apply `useReducedMotion` globally with conditional animation variants
- Keep animation duration under 300ms for micro-interactions, up to 800ms for page transitions

## Static Content Management

### Decision: Static JSON files with Zod validation, future CMS-ready

**Rationale**:
- Static JSON enables simple start without CMS infrastructure
- Type-safe with Zod schemas for runtime validation
- Easy to version control and review content changes
- Fast builds with Static Site Generation
- Clear migration path to Contentful/Sanity CMS later

**Alternatives Considered**:
- **Immediate CMS (Contentful/Sanity)**: Overkill for initial 12-15 gods, adds complexity
- **Markdown files**: Less structured, harder to query and filter
- **Database (PostgreSQL)**: Requires backend infrastructure, unnecessary for static content
- **Hardcoded in components**: Not maintainable, difficult to update content

**Best Practices**:
- Define Zod schemas matching TypeScript interfaces
- Use `z.parse()` at data loading boundaries
- Organize JSON files by entity type (gods/, stories/, realms/)
- Include metadata (version, lastUpdated) in each JSON file
- Implement data loading functions in `/lib/data` for abstraction
- Use Next.js `generateStaticParams` for dynamic routes

## Responsive Image Optimization

### Decision: Next.js Image component with WebP/AVIF formats

**Rationale**:
- Next.js Image provides automatic optimization, lazy loading, and responsive sizing
- WebP/AVIF formats reduce file size by 30-50% vs JPEG/PNG
- Automatic srcset generation for different device sizes
- Blur placeholder for loading states
- Built-in lazy loading with Intersection Observer

**Alternatives Considered**:
- **Manual `<img>` tags**: No optimization, manual responsive handling
- **Cloudinary/Imgix**: External service cost, unnecessary for static content
- **React Image**: Less feature-complete than Next.js Image

**Best Practices**:
- Store original images in `/public/images` organized by type
- Use `width` and `height` props to prevent layout shift
- Set `priority` on above-the-fold images
- Use `fill` with `object-fit` for responsive containers
- Implement `blurDataURL` for placeholder effect
- Configure `formats: ['image/avif', 'image/webp']` in next.config.js

## Accessibility for Animated Content

### Decision: Reduced-motion detection with alternative static variants

**Rationale**:
- WCAG 2.1 requires respecting prefers-reduced-motion
- Motion can cause vestibular disorders in 35% of adults over 40
- Framer Motion's `useReducedMotion` provides simple detection
- Can provide static or simplified animations as fallback

**Alternatives Considered**:
- **Ignore reduced motion**: Fails WCAG compliance, excludes users
- **Disable all animations**: Removes engaging experience for majority
- **Manual media query**: More verbose, Framer Motion abstracts this

**Best Practices**:
- Check `useReducedMotion()` at component level
- Provide two animation variants: full and reduced
- Reduced variant: instant transitions or subtle fades only
- Test with browser DevTools "Emulate CSS prefers-reduced-motion"
- Document accessibility in component JSDoc comments
- Use `transition={{ duration: 0 }}` for reduced-motion variant

## State Management for Search/Filtering

### Decision: React hooks (useState, useTransition) with URL search params

**Rationale**:
- Simple search/filter state doesn't require global state management
- URL search params enable shareable filtered views
- useTransition allows non-blocking UI updates during filtering
- Avoids external state library complexity (Zustand, Redux)

**Alternatives Considered**:
- **Zustand**: Overkill for simple search state, adds dependency
- **React Context**: Unnecessary for component-local state
- **Redux Toolkit**: Far too complex for this use case

**Best Practices**:
- Use `useSearchParams` for URL state persistence
- Wrap filter operations in `useTransition` for responsive UI
- Debounce search input with `useDeferredValue` or lodash.debounce
- Implement optimistic UI updates for instant feedback
- Keep filter logic pure for testability

## Parallax Scrolling Implementation

### Decision: Framer Motion `useScroll` and `useTransform` hooks

**Rationale**:
- Framer Motion provides smooth, performant scroll-linked animations
- `useScroll` tracks scroll position efficiently
- `useTransform` maps scroll values to animation properties
- Works seamlessly with reduced-motion preferences

**Alternatives Considered**:
- **react-scroll-parallax**: Separate library, less Next.js integration
- **Intersection Observer only**: Binary in/out of view, not smooth scroll tracking
- **CSS scroll-timeline**: Still experimental, limited browser support

**Best Practices**:
- Use `useScroll` with `target` ref to specific scrollable containers
- Apply `useTransform` for smooth value interpolation
- Limit parallax to background/decorative elements (not content)
- Reduce parallax intensity for reduced-motion users
- Test on low-end devices for performance

## Testing Strategy

### Decision: Vitest + React Testing Library + Playwright

**Rationale**:
- Vitest is fast, Vite-based, compatible with Next.js 15
- React Testing Library encourages accessible component testing
- Playwright provides cross-browser E2E testing
- All three tools have excellent TypeScript support

**Alternatives Considered**:
- **Jest**: Slower than Vitest, requires more configuration with Next.js
- **Cypress**: Heavier than Playwright, slower execution
- **Testing Library alone**: Insufficient for E2E user flows

**Best Practices**:
- Unit test pure functions in `/lib` with Vitest
- Component test with React Testing Library (user interactions)
- E2E test with Playwright for critical user journeys
- Mock Framer Motion in unit tests with `jest-mock-framer-motion`
- Test reduced-motion variants explicitly
- Run Lighthouse CI in E2E tests for accessibility audits

## Summary of Technical Decisions

| Area | Technology | Rationale |
|------|-----------|-----------|
| **Animations** | Framer Motion 11+ | Industry standard, reduced-motion support, 60fps performance |
| **Content** | Static JSON + Zod | Simple start, type-safe, CMS-ready migration path |
| **Images** | Next.js Image + WebP/AVIF | Automatic optimization, lazy loading, responsive |
| **Accessibility** | useReducedMotion + ARIA | WCAG 2.1 AA compliance, alternative variants |
| **State** | React hooks + URL params | Simple, shareable, no external library needed |
| **Parallax** | useScroll + useTransform | Smooth, performant, integrated with Framer Motion |
| **Testing** | Vitest + RTL + Playwright | Fast, accessible, cross-browser E2E coverage |

All decisions align with the project constitution's principles of modern stack adherence, performance optimization, and accessibility-first design.
