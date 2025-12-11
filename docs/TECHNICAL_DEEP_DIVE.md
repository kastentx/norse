# 🧭 Norse Mythology Knowledge Base - Technical Deep Dive

## 📚 **Technology Stack Overview**

### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js 16** | 16.0.6 | React framework with App Router |
| **React 19** | 19.2.0 | UI library with latest features |
| **TypeScript 5** | 5.9.3 | Static typing with strict mode |
| **Tailwind CSS 4** | 4.1.17 | Utility-first CSS framework |
| **Framer Motion** | 12.x | Animation library |
| **Zod** | 4.x | Runtime schema validation |
| **Auth.js** | 5.0.0-beta.30 | OAuth authentication (GitHub) |
---

## 🏗️ **Architecture Patterns**

### 1. **Next.js App Router Architecture**
Your project uses the modern **App Router** (not the legacy Pages Router):

```
app/
├── layout.tsx         # Root layout (wraps ALL pages, includes SessionProvider)
├── page.tsx           # Home page (/) with favorites section
├── gods/
│   ├── layout.tsx     # Gods section layout
│   ├── page.tsx       # Gods listing (/gods)
│   └── [slug]/        # Dynamic route (/gods/odin, /gods/thor)
│       └── page.tsx
├── profile/           # Protected route (requires auth)
│   └── page.tsx       # User profile with favorites
├── api/               # API Route Handlers
│   ├── auth/
│   │   └── [...nextauth]/route.ts  # Auth.js endpoints
│   ├── user/
│   │   └── favorites/route.ts      # User favorites CRUD
│   └── gods/route.ts  # GET /api/gods
```

**Key talking points:**
- **File-based routing** - folders become URL segments
- **Nested layouts** - UI shared across routes (`layout.tsx` wraps child routes)
- **Dynamic routes** - `[slug]` captures URL parameters
- **Route Groups** - organize routes without affecting URL structure

### 2. **Server vs Client Components**

Your codebase demonstrates the **Server Components model**:

```tsx
// Server Component (default) - app/gods/[slug]/page.tsx
export default async function GodDetailPage({ params }) {
  const god = await getGodById(params.slug); // Direct data fetching
  return <div>{god.name}</div>;
}

// Client Component - components/gods/GodGrid.tsx
"use client"; // Opt-in to client-side rendering
import { useState } from "react";
```

**When to use each:**
| Server Components | Client Components |
|-------------------|-------------------|
| Data fetching | useState, useEffect |
| Access to backend resources | Event handlers (onClick) |
| Sensitive data (API keys) | Browser APIs |
| Large dependencies | Interactivity |

### 3. **Data Fetching Patterns**

**Static Generation with `generateStaticParams`:**
```tsx
// Pre-renders all god pages at build time
export async function generateStaticParams() {
  const gods = await getAllGods();
  return gods.map((god) => ({ slug: god.id }));
}
```

**API Route Handler:**
```tsx
// app/api/gods/route.ts
export async function GET() {
  const gods = await getAllGods();
  return NextResponse.json(gods);
}
```

---

## 🎨 **Design Patterns & Best Practices**

### 1. **Type-Safe Data Layer with Zod**

```tsx
// types/god.ts
export const GodSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(100),
  type: z.enum(["Aesir", "Vanir", "Jotun", "Other"]),
  description: z.string().min(200).max(2000),
  metadata: z.object({
    featured: z.boolean(),
    popularity: z.number().int().min(1).max(100),
    lastUpdated: z.string().datetime(),
  }),
});

// Runtime validation
const god = GodSchema.parse(jsonData); // Throws if invalid
```

**Why this matters:**
- **Runtime type safety** - TypeScript only checks at compile time
- **Data validation** - Ensures JSON data matches expected shape
- **Error messages** - Clear validation errors for debugging
- **Type inference** - `z.infer<typeof GodSchema>` generates TypeScript types

### 2. **Utility Function Pattern: `cn()` for Class Names**

```tsx
// lib/utils/cn.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Usage:**
```tsx
<div className={cn(
  "base-styles",
  isActive && "active-styles",  // Conditional
  "text-red-500",
  "text-blue-500"  // twMerge resolves: blue wins
)} />
```

**Why combine clsx + tailwind-merge:**
- `clsx` - Conditional class joining
- `tailwind-merge` - Resolves Tailwind conflicts intelligently

### 3. **Component Composition Pattern**

```tsx
// Skeleton loading component
<GodGrid gods={gods} onGodClick={handleGodClick} />

// Card component with index for stagger animation
<GodCard god={god} index={index} onClick={() => onGodClick(god)} />
```

---

## ⚡ **Performance Optimizations**

### 1. **Dynamic Imports (Code Splitting)**

```tsx
// Only loads GodDetailPanel when needed (not in initial bundle)
const GodDetailPanel = dynamic(
  () => import("@/components/gods/GodDetailPanel")
    .then((mod) => ({ default: mod.GodDetailPanel })),
  { ssr: false }  // Don't render on server
);
```

**Benefits:**
- Smaller initial JavaScript bundle
- Components load on-demand
- `loading` prop shows skeleton while loading

### 2. **Image Optimization**

```tsx
// Next.js Image component
<Image
  src={god.imageUrl}
  alt={`${god.name} - Norse deity`}
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
  className="object-cover"
/>
```

```javascript
// next.config.js
images: {
  formats: ["image/avif", "image/webp"],  // Modern formats
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
}
```

**Optimizations happening automatically:**
- **Lazy loading** - Images load when entering viewport
- **Format conversion** - Serves AVIF/WebP to supported browsers
- **Responsive srcset** - Different sizes for different viewports
- **Blur placeholder** - Shows low-res preview while loading

### 3. **Cache Headers**

```javascript
// next.config.js
async headers() {
  return [{
    source: "/images/:path*",
    headers: [{
      key: "Cache-Control",
      value: "public, max-age=31536000, immutable",
    }],
  }];
}
```

**Result:** Images cached for 1 year (immutable = won't change)

### 4. **React 19 Concurrent Features**

```tsx
// app/search/page.tsx
const [isPending, startTransition] = useTransition();
const deferredQuery = useDeferredValue(query);
```

- **`useTransition`** - Mark state updates as non-urgent (keeps UI responsive)
- **`useDeferredValue`** - Shows stale content while computing new content

---

## 🎭 **Animation System**

### 1. **Framer Motion Variants**

```tsx
// lib/animations/variants.ts
export const fadeInStaggerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,  // Each child delayed by 0.1s
      delayChildren: 0.1,
    },
  },
};
```

**Usage pattern:**
```tsx
<motion.div variants={containerVariants} initial="hidden" animate="visible">
  {items.map((item) => (
    <motion.div key={item.id} variants={childVariants}>
      {item.name}
    </motion.div>
  ))}
</motion.div>
```

### 2. **Accessibility: Reduced Motion**

```tsx
// Custom hook
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

// Usage
const prefersReducedMotion = useReducedMotion();
const variants = prefersReducedMotion ? reducedMotionVariants : normalVariants;
```

**This respects user's OS accessibility settings!**

### 3. **Scroll-Triggered Animations**

```tsx
export function useScrollAnimation(options = { threshold: 0.1, triggerOnce: true }) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setIsInView(true);
        if (options.triggerOnce) observer.disconnect();
      }
    }, options);
    observer.observe(ref.current);
  }, []);

  return [ref, isInView];
}
```

---

## 🔐 **Authentication (Auth.js v5)**

### 1. **OAuth Flow with GitHub**

The project uses Auth.js v5 (NextAuth.js) for authentication:

```tsx
// auth.ts - Main configuration
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token?.id) session.user.id = token.id as string;
      return session;
    },
  },
});
```

**Key v5 differences from v4:**
- Config in root `auth.ts` instead of API route
- Direct exports: `{ handlers, auth, signIn, signOut }`
- Cleaner session access: `await auth()` instead of `getServerSession(authOptions)`

### 2. **Route Protection with Middleware**

```tsx
// middleware.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isProtectedRoute = req.nextUrl.pathname.startsWith("/profile");
  
  if (isProtectedRoute && !req.auth) {
    const signInUrl = new URL("/api/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }
});
```

### 3. **Session Provider Pattern**

```tsx
// components/auth/SessionProvider.tsx
"use client";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}

// app/layout.tsx - Wrap entire app
<SessionProvider>
  <Header />
  <main>{children}</main>
  <Footer />
</SessionProvider>
```

### 4. **Favorites with Optimistic UI**

```tsx
// components/favorites/FavoriteButton.tsx
const [isFavorited, setIsFavorited] = useState(initialFavorited);

const handleToggle = async () => {
  const previousState = isFavorited;
  setIsFavorited(!isFavorited);  // Optimistic update
  
  try {
    await fetch("/api/user/favorites", {
      method: "POST",
      body: JSON.stringify({ type, id }),
    });
  } catch {
    setIsFavorited(previousState);  // Rollback on error
  }
};
```

**Interview talking point:**
> "I implemented optimistic UI for the favorites feature. When a user clicks the heart, the UI updates immediately while the API call happens in the background. If the call fails, the state rolls back. This provides instant feedback while maintaining data integrity."

---

## ♿ **Accessibility (A11y) Features**

### 1. **Semantic HTML + ARIA**

```tsx
<motion.article
  role="button"
  tabIndex={0}
  aria-label={`View details about ${god.name}`}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") onClick();
  }}
/>
```

### 2. **Keyboard Navigation**

```tsx
// SearchBar.tsx
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === "Escape") handleClear();
};
```

### 3. **Breadcrumb Navigation**

```tsx
<nav aria-label="Breadcrumb">
  <ol>
    <li><Link href="/" aria-label="Home">...</Link></li>
    <li><span aria-current="page">Current Page</span></li>
  </ol>
</nav>
```

---

## 🔍 **SEO Optimizations**

### 1. **Metadata API**

```tsx
// Dynamic metadata per page
export async function generateMetadata({ params }): Promise<Metadata> {
  const god = await getGodById(params.slug);
  return {
    title: `${god.name} | Norse Mythology`,
    description: god.description,
    openGraph: {
      images: [{ url: god.imageUrl }],
    },
  };
}
```

### 2. **Programmatic Sitemap & Robots**

```tsx
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const gods = await getAllGods();
  return [
    { url: baseUrl, priority: 1 },
    ...gods.map((god) => ({
      url: `${baseUrl}/gods/${god.id}`,
      priority: god.metadata?.featured ? 0.8 : 0.7,
    })),
  ];
}
```

---

## 🧪 **Testing Setup**

| Tool | Purpose |
|------|---------|
| **Vitest** | Unit testing (fast, Vite-based) |
| **Testing Library** | Component testing |
| **Playwright** | E2E browser testing |

```tsx
// vitest.config.ts
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
});
```

---

## 🎯 **Interview Talking Points**

### "Why Next.js App Router?"
> "I chose App Router for its **Server Components model** which reduces JavaScript sent to the client, **nested layouts** for consistent UI, and **built-in data fetching** that eliminates the need for useEffect data loading patterns."

### "How do you handle data validation?"
> "I use **Zod schemas** for runtime type validation. TypeScript catches compile-time errors, but JSON data from files/APIs needs runtime validation. Zod provides both validation and TypeScript type inference from a single source of truth."

### "What performance optimizations did you implement?"
> "Several layers: **dynamic imports** for code splitting, Next.js **Image component** for automatic format conversion and lazy loading, **1-year cache headers** for static assets, and React 19's **useDeferredValue** for non-blocking search updates."

### "How did you approach accessibility?"
> "I implemented **WCAG 2.1 AA** compliance including semantic HTML, ARIA labels, keyboard navigation support, and a custom `useReducedMotion` hook that respects users' motion preferences at the OS level."

### "Explain your animation architecture"
> "I built a reusable animation system using Framer Motion **variants**. Parent containers define stagger timing, children inherit animations. The `useReducedMotion` hook swaps in instant-transition variants when needed."

### "How is the project structured?"
> "It follows **colocation** principles: components with their feature folders, data fetching logic in `lib/data`, shared types in `types/`, and animation utilities in `lib/animations`. This makes it easy to find related code."

### "How did you implement authentication?"
> "I used **Auth.js v5** with GitHub OAuth. The main config lives in `auth.ts` at the root, exporting `{ handlers, auth, signIn, signOut }`. Protected routes like `/profile` are secured via middleware that checks the session at the edge. I wrap the app in a `SessionProvider` for client-side session access via `useSession()`."

### "Why Auth.js v5 over other auth solutions?"
> "Auth.js is open-source with no vendor lock-in, has native App Router support in v5, and handles the complex OAuth handshake. The JWT strategy means no database needed for sessions, making it simpler to deploy."

### "Explain your favorites feature"
> "I implemented **optimistic UI** - when a user clicks the heart, the UI updates immediately while the API call runs in the background. If it fails, we rollback. Favorites are stored in JSON files keyed by user ID with Zod validation. The API routes use `auth()` to get the current user."

---

## 📁 **Key Files Reference**

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout with metadata, Header/Footer, SessionProvider |
| `app/gods/page.tsx` | Gods listing with dynamic imports |
| `app/gods/[slug]/page.tsx` | God detail with SSG |
| `app/profile/page.tsx` | User profile with favorites management |
| `auth.ts` | Auth.js v5 configuration with GitHub OAuth |
| `middleware.ts` | Route protection for /profile |
| `components/auth/SessionProvider.tsx` | Client-side session context |
| `components/auth/UserMenu.tsx` | User dropdown with sign out |
| `components/favorites/FavoriteButton.tsx` | Optimistic UI favorite toggle |
| `components/gods/GodCard.tsx` | Animated card component with favorite button |
| `lib/animations/hooks.ts` | Custom animation hooks |
| `lib/animations/variants.ts` | Framer Motion variants |
| `lib/data/gods.ts` | Data fetching with Zod validation |
| `lib/data/favorites.ts` | User favorites persistence layer |
| `lib/utils/cn.ts` | Tailwind class utility |
| `types/god.ts` | Zod schemas + TypeScript types |
| `types/user.ts` | User favorites Zod schema |
| `next.config.js` | Image optimization, caching |
