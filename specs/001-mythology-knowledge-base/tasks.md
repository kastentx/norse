# Tasks: Interactive Norse Mythology Knowledge Base

**Input**: Design documents from `/specs/001-mythology-knowledge-base/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are NOT explicitly requested in the feature specification, so test tasks are excluded per template guidance.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Initialize Next.js 15+ project with TypeScript and App Router in repository root
- [X] T002 [P] Install dependencies: React 19, Framer Motion 11, Tailwind CSS 3.4, Zod
- [X] T003 [P] Configure TypeScript strict mode in tsconfig.json
- [X] T004 [P] Setup Tailwind CSS with mobile-first config in tailwind.config.ts
- [X] T005 [P] Configure ESLint rules (no any types, accessibility checks) in .eslintrc.json
- [X] T006 [P] Setup Prettier formatting rules in .prettierrc
- [X] T007 Create base directory structure: app/, components/, lib/, types/, data/, public/images/
- [X] T008 [P] Configure Next.js Image optimization in next.config.js (formats: ['image/avif', 'image/webp'], domains, image sizing)
- [X] T009 [P] Setup Vitest configuration in vitest.config.ts with jest-mock-framer-motion for animation testing
- [X] T010 [P] Setup Playwright E2E test configuration in playwright.config.ts
- [X] T010.5 Create data loading abstraction layer in lib/data/ with future CMS integration interfaces (prepare for Contentful/Sanity migration)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T011 [P] Create TypeScript type definitions for God entity in types/god.ts
- [X] T012 [P] Create TypeScript type definitions for Story entity in types/story.ts
- [X] T013 [P] Create TypeScript type definitions for Realm entity in types/realm.ts
- [X] T014 [P] Create TypeScript type definitions for Symbol entity in types/symbol.ts
- [X] T015 Create barrel export file in types/index.ts
- [X] T016 [P] Create Zod validation schema for God in types/god.ts
- [X] T017 [P] Create Zod validation schema for Story in types/story.ts
- [X] T018 [P] Create Zod validation schema for Realm in types/realm.ts
- [X] T019 [P] Create Zod validation schema for Symbol in types/symbol.ts
- [X] T020 [P] Create Framer Motion animation variants in lib/animations/variants.ts
- [X] T021 [P] Create reusable transition configs in lib/animations/transitions.ts
- [X] T022 [P] Implement useReducedMotion hook in lib/animations/hooks.ts
- [X] T023 [P] Implement useScrollAnimation hook in lib/animations/hooks.ts
- [X] T024 [P] Create Tailwind class merger utility (clsx + twMerge) in lib/utils/cn.ts
- [X] T025 [P] Create accessibility helper functions in lib/utils/accessibility.ts
- [X] T026 [P] Implement data loading function getAllGods in lib/data/gods.ts
- [X] T027 [P] Implement data loading function getGodById in lib/data/gods.ts
- [X] T028 [P] Implement data loading function getAllStories in lib/data/stories.ts
- [X] T029 [P] Implement data loading function getStoryBySlug in lib/data/stories.ts
- [X] T030 [P] Implement data loading function getAllRealms in lib/data/realms.ts
- [X] T031 [P] Implement search function searchAll in lib/data/search.ts
- [X] T032 [P] Implement filter function filterContent in lib/data/search.ts
- [X] T033 [P] Create base Button component in components/ui/Button.tsx
- [X] T034 [P] Create base Card component in components/ui/Card.tsx
- [X] T035 [P] Create base Modal component with animations in components/ui/Modal.tsx
- [X] T036 [P] Create base Skeleton loader component in components/ui/Skeleton.tsx
- [X] T037 Create root layout with metadata in app/layout.tsx
- [X] T038 [P] Create Header component with navigation in components/layout/Header.tsx
- [X] T039 [P] Create Footer component in components/layout/Footer.tsx
- [X] T040 [P] Create Navigation menu component in components/layout/Navigation.tsx
- [X] T041 Setup Tailwind global styles in app/globals.css
- [X] T042 Create homepage with hero section in app/page.tsx
- [X] T043 Create 404 not-found page in app/not-found.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Browse Gods and Deities (Priority: P1) 🎯 MVP

**Goal**: Users can explore animated god cards, hover for effects, click for details with slide-in panel

**Independent Test**: Navigate to /gods, verify cards fade in with stagger, hover for scale effect, click card to open detail panel with slide animation, close panel to return focus

### Implementation for User Story 1

- [ ] T044 [P] [US1] Create sample God JSON data files (Odin, Thor, Loki) in data/gods/
- [ ] T045 [US1] Create gods route group directory structure: app/(gods)/gods/
- [ ] T046 [US1] Create gods listing page (Server Component) in app/(gods)/gods/page.tsx
- [ ] T047 [US1] Create god detail dynamic route in app/(gods)/gods/[slug]/page.tsx
- [ ] T048 [US1] Implement generateStaticParams for god routes in app/(gods)/gods/[slug]/page.tsx
- [ ] T049 [P] [US1] Create GodSkeleton loading component in components/gods/GodSkeleton.tsx
- [ ] T050 [US1] Create GodCard component (Client Component) with hover animations in components/gods/GodCard.tsx
- [ ] T051 [US1] Create GodGrid component (Client Component) with stagger animations in components/gods/GodGrid.tsx
- [ ] T052 [US1] Create GodDetailPanel component (Client Component) with slide-in animation in components/gods/GodDetailPanel.tsx
- [ ] T053 [US1] Add keyboard navigation support (Enter, Escape keys) to GodDetailPanel component
- [ ] T054 [US1] Add focus management to return focus to grid card after closing panel
- [ ] T055 [US1] Implement ARIA labels and semantic HTML in all god components
- [ ] T056 [US1] Add reduced-motion variants to all god component animations
- [ ] T057 [P] [US1] Add placeholder god images to public/images/gods/
- [ ] T058 [P] [US1] Optimize god images with Next.js Image component in GodCard
- [ ] T059 [US1] Add loading Suspense boundary with skeleton to gods listing page
- [ ] T060 [US1] Create gods section layout in app/(gods)/layout.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 4 - Search and Filter Content (Priority: P2)

**Goal**: Users can search gods/stories with animated results and apply category filters with smooth transitions

**Independent Test**: Use search bar to query content, verify staggered result animations, apply filters to see fade-out/reposition animations, clear search to restore content

### Implementation for User Story 4

- [ ] T061 [US4] Create search page directory: app/search/
- [ ] T062 [US4] Create search page (Client Component) with URL search params in app/search/page.tsx
- [ ] T063 [P] [US4] Create SearchBar component (Client Component) with debounced input in components/search/SearchBar.tsx
- [ ] T064 [P] [US4] Create FilterGroup component (Client Component) for categories in components/search/FilterGroup.tsx
- [ ] T065 [US4] Create SearchResults component (Client Component) with staggered animations in components/search/SearchResults.tsx
- [ ] T066 [US4] Implement search logic using searchAll function from lib/data/search.ts
- [ ] T067 [US4] Implement filter logic using filterContent function from lib/data/search.ts
- [ ] T068 [US4] Add useTransition for non-blocking UI updates during filtering
- [ ] T069 [US4] Add useDeferredValue for search input debouncing
- [ ] T070 [US4] Implement animated result count with number transition
- [ ] T071 [US4] Create empty state component with fade-in animation for no results
- [ ] T072 [US4] Add clear search button with animation to restore all content
- [ ] T073 [US4] Implement keyboard navigation (Tab, Arrow keys) for filter options
- [ ] T074 [US4] Add ARIA live region for search result announcements
- [ ] T075 [US4] Add reduced-motion variants for search result animations
- [ ] T076 [US4] Integrate search bar into Header component for global access

**Checkpoint**: Search and filtering fully functional across all content types

---

## Phase 5: User Story 2 - Explore Mythology Stories (Priority: P2)

**Goal**: Users can read stories with parallax scrolling effects and animated illustrations that trigger on scroll

**Independent Test**: Navigate to /stories, select a story, scroll to see parallax background movement, verify illustrations fade in with scale animation, check section titles animate character-by-character

### Implementation for User Story 2

- [ ] T077 [P] [US2] Create sample Story JSON data files (Ragnarok, Yggdrasil) in data/stories/
- [ ] T078 [US2] Create stories route group directory structure: app/(stories)/stories/
- [ ] T079 [US2] Create stories listing page (Server Component) in app/(stories)/stories/page.tsx
- [ ] T080 [US2] Create story detail dynamic route in app/(stories)/stories/[slug]/page.tsx
- [ ] T081 [US2] Implement generateStaticParams for story routes in app/(stories)/stories/[slug]/page.tsx
- [ ] T082 [P] [US2] Create StoryHero component (Client Component) with parallax effect in components/stories/StoryHero.tsx
- [ ] T083 [P] [US2] Create StorySection component (Client Component) with scroll animations in components/stories/StorySection.tsx
- [ ] T084 [P] [US2] Create StoryNav component for story navigation in components/stories/StoryNav.tsx
- [ ] T085 [US2] Implement useScroll hook for parallax scrolling in StoryHero component
- [ ] T086 [US2] Implement useTransform hook for parallax value mapping in StoryHero component
- [ ] T087 [US2] Implement useInView hook for illustration animations in StorySection component
- [ ] T088 [US2] Add character-by-character text animation for section titles in StorySection component
- [ ] T089 [US2] Implement page transition animations between stories using AnimatePresence
- [ ] T090 [US2] Add reduced-motion variants (disable parallax, simple fades) for stories
- [ ] T091 [US2] Optimize parallax performance for low-end devices
- [ ] T092 [P] [US2] Add story illustration images to public/images/stories/
- [ ] T093 [P] [US2] Optimize story images with Next.js Image and blur placeholders
- [ ] T094 [US2] Add reading time estimate display in story header
- [ ] T095 [US2] Add related stories section with links at story end
- [ ] T096 [US2] Create stories section layout in app/(stories)/layout.tsx
- [ ] T097 [US2] Add loading Suspense boundary for story content

**Checkpoint**: Stories with parallax effects fully functional and accessible

---

## Phase 6: User Story 3 - Interactive World Map (Priority: P3)

**Goal**: Users can explore Nine Realms map with animated regions, tooltips, and zoom/pan interactions

**Independent Test**: Load /realms page, verify realm regions draw in with stroke animation, hover for glow and tooltip, click to zoom smoothly to realm, test pinch-to-zoom on mobile

### Implementation for User Story 3

- [ ] T098 [US3] Create Nine Realms JSON data file with all 9 realms in data/realms/nine-realms.json
- [ ] T099 [US3] Create realms route group directory structure: app/(realms)/realms/
- [ ] T100 [US3] Create realms map page (Client Component) in app/(realms)/realms/page.tsx
- [ ] T101 [P] [US3] Create RealmMap component (Client Component) with SVG in components/realms/RealmMap.tsx
- [ ] T102 [P] [US3] Create RealmTooltip component with fade animation in components/realms/RealmTooltip.tsx
- [ ] T103 [P] [US3] Create RealmDetail component for selected realm info in components/realms/RealmDetail.tsx
- [ ] T104 [US3] Implement SVG path drawing animation for realm regions on page load
- [ ] T105 [US3] Add hover state with glow effect for realm regions
- [ ] T106 [US3] Implement smooth zoom animation when realm is clicked
- [ ] T107 [US3] Add zoom out animation to return to full map view
- [ ] T108 [US3] Implement pinch-to-zoom gesture support for mobile devices
- [ ] T109 [US3] Implement drag/pan gesture support for mobile devices
- [ ] T110 [US3] Add keyboard navigation (Tab, Enter) for realm selection
- [ ] T111 [US3] Add ARIA labels for all realm regions
- [ ] T112 [US3] Add reduced-motion variants (instant transitions, no zoom animations)
- [ ] T113 [P] [US3] Add realm visualization images to public/images/realms/
- [ ] T114 [US3] Display realm detail panel with animation when realm selected
- [ ] T115 [US3] Add loading state for realm data
- [ ] T116 [US3] Create realms section layout in app/(realms)/layout.tsx

**Checkpoint**: Interactive Nine Realms map fully functional with mobile gesture support

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T117 [P] Add remaining god JSON files (12-15 total) in data/gods/
- [ ] T118 [P] Add remaining story JSON files (5-8 total) in data/stories/
- [ ] T119 [P] Add all god portrait images (WebP/AVIF with fallbacks) in public/images/gods/
- [ ] T120 [P] Add all story illustration images (WebP/AVIF) in public/images/stories/
- [ ] T121 [P] Add all realm visualization images (WebP/AVIF) in public/images/realms/
- [ ] T122 [P] Create Symbol entity JSON data files in data/symbols/
- [ ] T123 [P] Add symbol icon images to public/images/symbols/
- [ ] T124 Implement related content cross-linking (gods ↔ stories ↔ realms)
- [ ] T125 Add breadcrumb navigation across all pages
- [ ] T126 [P] Optimize bundle size with dynamic imports for heavy components
- [ ] T127 [P] Add meta tags and Open Graph data for SEO in all page.tsx files
- [ ] T128 [P] Create sitemap.xml with all routes
- [ ] T129 [P] Create robots.txt for search engine crawling
- [ ] T130 [P] Add favicons and app icons in app/
- [ ] T131 Run Lighthouse audit and address performance issues
- [ ] T132 Run Lighthouse accessibility audit and fix any issues below 90 score
- [ ] T133 Test all animations with reduced-motion enabled
- [ ] T134 Test keyboard navigation across all pages
- [ ] T135 Test responsive layout on mobile (320px-768px)
- [ ] T136 Test responsive layout on tablet (768px-1024px)
- [ ] T137 Test responsive layout on desktop (1024px-2560px)
- [ ] T138 Verify all images have descriptive alt text
- [ ] T139 Test loading states and skeleton animations
- [ ] T140 Validate all JSON data files against Zod schemas
- [ ] T141 Add error boundaries for component error handling
- [ ] T142 Test browser tab inactive behavior during animations
- [ ] T143 Add analytics or tracking (optional, per requirements)
- [ ] T144 Create README.md with project overview and setup instructions
- [ ] T145 Verify quickstart.md instructions work end-to-end
- [ ] T146 Run comprehensive ARIA audit on all interactive components and fix issues
- [ ] T147 Conduct screen reader testing (VoiceOver/NVDA) on all pages and fix navigation issues
- [ ] T148 Verify keyboard navigation compliance (Tab, Enter, Escape, Arrow keys) across all interactive elements
- [ ] T149 Run Lighthouse CI in automated tests and ensure all scores meet targets (Performance 90+, Accessibility 90+, Best Practices 95+, SEO 100)
- [ ] T150 Run HTML5 validator on generated pages and fix semantic structure issues

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase - MVP starts here
- **User Story 4 (Phase 4)**: Depends on Foundational phase - Can run parallel to US1
- **User Story 2 (Phase 5)**: Depends on Foundational phase - Can run parallel to US1/US4
- **User Story 3 (Phase 6)**: Depends on Foundational phase - Can run parallel to other stories
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Independent - MVP foundation
- **User Story 4 (P2)**: Independent - Can search/filter as soon as gods/stories data exists
- **User Story 2 (P2)**: Independent - Stories work standalone
- **User Story 3 (P3)**: Independent - Map works standalone

### Within Each User Story

- Data files before pages that consume them
- Type definitions and Zod schemas before data loading functions
- Base components before feature components
- Server Components before Client Components that wrap them
- Core functionality before animations
- Animations before reduced-motion variants
- Functionality before ARIA/accessibility enhancements

### Parallel Opportunities

**Setup Phase**: T002-T006, T009-T010 can run in parallel  
**Foundational Phase**: T011-T014, T016-T019, T020-T024, T026-T032, T033-T036, T038-T040 can run in parallel  
**User Story 1**: T044, T049, T057-T058 can run in parallel  
**User Story 4**: T063-T064 can run in parallel  
**User Story 2**: T077, T082-T084, T092-T093 can run in parallel  
**User Story 3**: T098, T101-T103, T113 can run in parallel  
**Polish**: T117-T123, T126-T130, T135-T137 can run in parallel

---

## Parallel Example: User Story 1

```bash
# After Foundational phase, launch these together:
Task T044: "Create sample God JSON data files in data/gods/"
Task T049: "Create GodSkeleton loading component in components/gods/GodSkeleton.tsx"
Task T057: "Add placeholder god images to public/images/gods/"

# Then build page and components in sequence
Task T045-T048: Page structure and routing
Task T050-T052: Interactive components
Task T053-T056: Accessibility enhancements
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T010)
2. Complete Phase 2: Foundational (T011-T043) - **CRITICAL BLOCKER**
3. Complete Phase 3: User Story 1 (T044-T060)
4. **STOP and VALIDATE**: Test god browsing independently
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → **Deploy MVP!** (Browse Gods)
3. Add User Story 4 → Test independently → Deploy (Add Search)
4. Add User Story 2 → Test independently → Deploy (Add Stories)
5. Add User Story 3 → Test independently → Deploy (Add Map)
6. Polish → Final deployment

### Parallel Team Strategy

With multiple developers (after Foundational phase complete):

- **Developer A**: User Story 1 (Gods) - T044-T060
- **Developer B**: User Story 4 (Search) - T061-T076
- **Developer C**: User Story 2 (Stories) - T077-T097
- **Developer D**: User Story 3 (Map) - T098-T116

Stories integrate independently without blocking each other.

---

## Future Work / Post-MVP

**Symbol Entity Implementation**: The Symbol entity is fully defined in data-model.md but not included in MVP task breakdown. Add these tasks for Symbol support:
- Create Symbol JSON data files in data/symbols/
- Create Symbol display components in components/symbols/
- Add Symbol references to God detail panels
- Create Symbol filter in search/filter UI

**CMS Integration**: Once T010.5 abstraction layer is in place, migrate to headless CMS:
- Configure Contentful/Sanity workspace
- Create content models matching TypeScript interfaces
- Replace static JSON loading with CMS API calls
- Add ISR (Incremental Static Regeneration) for content updates

---

## Notes

- [P] tasks = different files, no dependencies - can run simultaneously
- [Story] label (US1, US2, US3, US4) maps task to specific user story
- Each user story is independently completable and testable
- No test tasks included (not requested in spec.md)
- Foundational phase (T011-T043) is critical - all stories depend on it
- Commit after each task or logical group
- Verify reduced-motion compliance for all animations
- Test keyboard navigation and ARIA labels for accessibility
- Stop at any checkpoint to validate story independently
