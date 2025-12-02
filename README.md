# Norse Mythology Knowledge Base

An interactive web application for exploring Norse mythology with animated god cards, mythology stories with parallax scrolling, an interactive Nine Realms map, and comprehensive search functionality.

## 🚀 Features

- **Browse Gods & Deities**: Explore Norse gods with animated card interfaces and detailed information
- **Mythology Stories**: Read tales with parallax scrolling effects and animated illustrations
- **Nine Realms Map**: Interactive map with clickable regions and smooth animations
- **Search & Filter**: Find gods, stories, and realms with animated transitions
- **Accessibility**: WCAG 2.1 AA compliant with reduced-motion support
- **Performance**: 60fps animations, <2s FCP, static site generation

## 🛠️ Tech Stack

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript 5.9+ (strict mode)
- **Styling**: Tailwind CSS 4.1+
- **Animations**: Framer Motion 12+
- **Validation**: Zod 4+
- **Testing**: Vitest, Playwright, React Testing Library
- **Runtime**: React 19+

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/kastentx/norse.git
cd norse

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🧪 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Run production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format with Prettier
npm run type-check   # TypeScript type checking
npm run test         # Run Vitest unit tests
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run Playwright E2E tests
npm run test:e2e:ui  # Run E2E tests with UI
```

## 📁 Project Structure

```
norse/
├── app/                    # Next.js App Router pages
│   ├── gods/              # God listing and detail pages
│   ├── stories/           # Story pages
│   ├── realms/            # Nine Realms map
│   └── search/            # Search and filter
├── components/            # React components
│   ├── gods/             # God-related components
│   ├── stories/          # Story components
│   ├── realms/           # Realm components
│   ├── search/           # Search components
│   └── ui/               # Shared UI components
├── lib/                  # Utilities and data loading
│   ├── data/            # Data loading functions
│   ├── animations/      # Framer Motion configs
│   └── utils/           # Helper functions
├── types/               # TypeScript type definitions
├── data/                # Static JSON content files
│   ├── gods/           # God JSON files
│   ├── stories/        # Story JSON files
│   └── realms/         # Realm JSON files
└── public/             # Static assets
    └── images/         # Images and illustrations
```

## 🎨 Features

### Browse Gods

- Animated card grid with staggered fade-in
- Hover effects with smooth scaling
- Detailed god information panels
- Family relationships and powers

### Mythology Stories

- Parallax scrolling effects
- Animated illustrations
- Difficulty levels (beginner/intermediate/advanced)
- Reading time estimates

### Nine Realms Map

- Interactive SVG map
- Animated region highlighting
- Tooltips with realm information
- Smooth zoom and pan interactions

### Search & Filter

- Real-time search with 300ms debounce
- Filter by god types, story themes, realms
- Animated result transitions
- Empty state handling

## ♿ Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Reduced motion support
- Semantic HTML5 structure
- ARIA labels and roles

## 🎯 Performance

- Target: 60fps animations
- First Contentful Paint: <2s on 4G
- Lighthouse scores: 90+ (Performance, Accessibility, Best Practices)
- Static Site Generation (SSG)
- Image optimization (WebP/AVIF)

## 📊 Implementation Status

- ✅ Phase 1: Setup (Complete)
- 🔄 Phase 2: Foundational (In Progress)
- ⏳ Phase 3: User Story 1 - Gods
- ⏳ Phase 4: User Story 4 - Search
- ⏳ Phase 5: User Story 2 - Stories
- ⏳ Phase 6: User Story 3 - Map
- ⏳ Phase 7: Polish & Validation

## 🔮 Roadmap

- [ ] Complete Framer Motion animations
- [ ] Add 12-15 major Norse gods
- [ ] Create 5-8 mythology stories
- [ ] Build Nine Realms interactive map
- [ ] Implement search and filter
- [ ] Add skeleton loading states
- [ ] Lighthouse optimization
- [ ] Accessibility audits
- [ ] CMS integration (Contentful/Sanity)

## 📝 Documentation

- [Feature Specification](./specs/001-mythology-knowledge-base/spec.md)
- [Implementation Plan](./specs/001-mythology-knowledge-base/plan.md)
- [Task Breakdown](./specs/001-mythology-knowledge-base/tasks.md)
- [Data Model](./specs/001-mythology-knowledge-base/data-model.md)
- [Research](./specs/001-mythology-knowledge-base/research.md)
- [Quickstart Guide](./specs/001-mythology-knowledge-base/quickstart.md)

## 🤝 Contributing

This project follows a specification-driven development approach. See the [tasks.md](./specs/001-mythology-knowledge-base/tasks.md) for the implementation roadmap.

## 📄 License

ISC

## 🙏 Acknowledgments

Built with cutting-edge web technologies and Norse mythology knowledge.
