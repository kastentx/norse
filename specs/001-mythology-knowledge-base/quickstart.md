# Quickstart Guide: Interactive Norse Mythology Knowledge Base

**Feature**: 001-mythology-knowledge-base  
**Date**: 2025-12-02  
**Purpose**: Get the application running locally in under 10 minutes

## Prerequisites

- **Node.js**: v20.x LTS or higher ([Download](https://nodejs.org/))
- **Package Manager**: npm (comes with Node.js), yarn, or pnpm
- **Git**: For cloning the repository
- **Code Editor**: VS Code recommended (with TypeScript support)

Check your setup:

```bash
node --version  # Should show v20.x or higher
npm --version   # Should show 10.x or higher
```

## Quick Start (5 minutes)

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd norse

# Checkout the feature branch
git checkout 001-mythology-knowledge-base

# Install dependencies
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see the Norse Mythology Knowledge Base homepage with animated god cards.

### 3. Explore the Application

- **Browse Gods**: Navigate to `/gods` to see the animated god card grid
- **Click a God**: View detailed information with slide-in animation
- **Read Stories**: Go to `/stories` to explore mythology tales with parallax scrolling
- **Nine Realms Map**: Visit `/realms` for the interactive map
- **Search**: Use the search bar in the header to filter content

## Project Structure

```text
norse/
├── app/                    # Next.js 15 App Router pages
│   ├── gods/              # God listing and detail pages
│   ├── stories/           # Story pages with parallax
│   ├── realms/            # Interactive Nine Realms map
│   └── search/            # Search and filter page
├── components/            # React components
│   ├── gods/             # God-related components
│   ├── stories/          # Story components
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
    └── images/         # God portraits, illustrations
```

## Available Scripts

```bash
# Development
npm run dev          # Start dev server at localhost:3000
npm run build        # Build for production
npm run start        # Run production build locally

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix ESLint issues
npm run format       # Format with Prettier
npm run type-check   # TypeScript type checking

# Testing
npm run test         # Run Vitest unit tests
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run Playwright E2E tests
npm run test:e2e:ui  # Run E2E tests with UI

# Utilities
npm run analyze      # Analyze bundle size
```

## Configuration Files

### Environment Variables

Create `.env.local` in the project root:

```env
# Optional: For future CMS integration
# NEXT_PUBLIC_CMS_API_URL=https://api.example.com
# CMS_API_TOKEN=your_token_here

# Development
NODE_ENV=development
```

### TypeScript Configuration

The project uses strict TypeScript mode. Key settings in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitAny": true
  }
}
```

### Tailwind CSS

Custom configuration in `tailwind.config.ts`:

- Extended color palette with Norse-themed colors
- Custom animation utilities for Framer Motion
- Mobile-first breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)

## Development Workflow

### 1. Create a New God Entry

Add a JSON file in `data/gods/`:

```json
// data/gods/new-god.json
{
  "id": "new-god",
  "name": "New God",
  "type": "Aesir",
  "domain": ["example"],
  "description": "Description of the god (200+ characters)...",
  "symbols": ["symbol-id"],
  "realm": "asgard",
  "attributes": {
    "appearance": "Physical description",
    "personality": "Character traits",
    "powers": ["power1", "power2"]
  },
  "stories": ["story-id"],
  "imageUrl": "/images/gods/new-god.webp",
  "metadata": {
    "featured": false,
    "popularity": 50,
    "lastUpdated": "2025-12-02T00:00:00Z"
  }
}
```

The god will automatically appear in the gods grid on next page load.

### 2. Add a New Story

Create a JSON file in `data/stories/`:

```json
// data/stories/new-story.json
{
  "id": "new-story",
  "title": "New Story Title",
  "slug": "new-story",
  "summary": "Brief summary (100+ characters)...",
  "content": [
    {
      "type": "text",
      "heading": "Chapter 1",
      "text": "Story content in markdown..."
    },
    {
      "type": "illustration",
      "imageUrl": "/images/stories/new-story-1.webp",
      "parallaxIntensity": 0.3
    }
  ],
  "themes": ["theme1", "theme2"],
  "characters": ["god-id"],
  "realms": ["realm-id"],
  "readingTime": 8,
  "difficulty": "beginner",
  "imageUrl": "/images/stories/new-story-hero.webp",
  "metadata": {
    "featured": false,
    "publishedDate": "2025-12-02T00:00:00Z",
    "lastUpdated": "2025-12-02T00:00:00Z"
  }
}
```

### 3. Create a New Component

Follow the component structure:

```typescript
// components/gods/NewComponent.tsx
'use client'; // Only if component uses interactivity/animations

import { motion } from 'framer-motion';
import type { God } from '@/types/god';

interface NewComponentProps {
  god: God;
}

export function NewComponent({ god }: NewComponentProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2>{god.name}</h2>
    </motion.div>
  );
}
```

### 4. Add Images

Place images in appropriate directories:

- God portraits: `public/images/gods/*.webp`
- Story illustrations: `public/images/stories/*.webp`
- Realm visualizations: `public/images/realms/*.webp`

Use Next.js Image component for optimization:

```typescript
import Image from 'next/image';

<Image
  src="/images/gods/odin.webp"
  alt="Odin"
  width={400}
  height={400}
  priority={false}
/>
```

## Testing the Application

### Unit Tests

Test individual functions and components:

```bash
npm run test
```

Example test structure:

```typescript
// __tests__/lib/data/gods.test.ts
import { describe, it, expect } from 'vitest';
import { getAllGods, getGodById } from '@/lib/data/gods';

describe('God Data Loading', () => {
  it('should load all gods', async () => {
    const gods = await getAllGods();
    expect(gods).toBeInstanceOf(Array);
    expect(gods.length).toBeGreaterThan(0);
  });

  it('should load specific god by ID', async () => {
    const god = await getGodById('odin');
    expect(god).toBeDefined();
    expect(god?.name).toBe('Odin');
  });
});
```

### E2E Tests

Test user flows with Playwright:

```bash
npm run test:e2e
```

Example E2E test:

```typescript
// __tests__/e2e/gods.spec.ts
import { test, expect } from '@playwright/test';

test('browse and view god details', async ({ page }) => {
  await page.goto('/gods');
  
  // Wait for animated cards to appear
  await expect(page.locator('[data-testid="god-card"]').first()).toBeVisible();
  
  // Click on a god card
  await page.locator('[data-testid="god-card"]').first().click();
  
  // Verify detail panel slides in
  await expect(page.locator('[data-testid="god-detail-panel"]')).toBeVisible();
});
```

## Accessibility Testing

### Keyboard Navigation

Test all interactive elements:

1. Tab through god cards (should have visible focus)
2. Press Enter/Space to open detail panel
3. Press Escape to close detail panel
4. Tab through search filters

### Reduced Motion

Enable reduced motion in your OS settings, then verify:

- Animations are minimal or instant
- Content still functions correctly
- No jarring transitions

Test with DevTools:

```javascript
// In browser console
document.documentElement.style.setProperty('--motion-reduce', 'reduce');
```

### Screen Reader

Test with a screen reader (VoiceOver on Mac, NVDA on Windows):

- All images have descriptive alt text
- Interactive elements have ARIA labels
- Headings form logical hierarchy
- Focus management works correctly

## Performance Monitoring

### Lighthouse

Run Lighthouse audit:

1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Select "Mobile" + "Performance, Accessibility, Best Practices, SEO"
4. Click "Generate report"

**Target Scores**:

- Performance: 90+
- Accessibility: 90+
- Best Practices: 95+
- SEO: 100

### Animation Performance

Monitor FPS during animations:

1. Open Chrome DevTools → Performance tab
2. Start recording
3. Trigger animations (scroll, card clicks, transitions)
4. Stop recording
5. Check FPS graph (should maintain 60fps)

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use a different port
npm run dev -- -p 3001
```

### TypeScript Errors

```bash
# Clear TypeScript cache
rm -rf .next
npm run type-check
```

### Image Optimization Errors

Ensure images are in correct format:

```bash
# Convert PNG to WebP
cwebp input.png -o output.webp
```

### Animation Performance Issues

- Check for too many simultaneous animations
- Reduce `parallaxIntensity` values in story content
- Enable "Reduce Motion" for testing
- Profile with Chrome DevTools Performance tab

### Build Errors

```bash
# Clear all caches and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

## Next Steps

1. **Add Content**: Create JSON files for more gods, stories, and realms
2. **Customize Styling**: Modify Tailwind config and color palette
3. **Enhance Animations**: Adjust Framer Motion variants in `/lib/animations`
4. **Run Tests**: Ensure all features work with `npm run test && npm run test:e2e`
5. **Deploy**: Build and deploy to Vercel with `npm run build`

## Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zod Documentation](https://zod.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)

## Getting Help

If you encounter issues:

1. Check error messages in terminal and browser console
2. Review this quickstart guide
3. Consult the [spec.md](./spec.md) for feature requirements
4. Review [data-model.md](./data-model.md) for entity structure
5. Check [contracts/data-loading.md](./contracts/data-loading.md) for data loading details

Happy coding! ⚡️
