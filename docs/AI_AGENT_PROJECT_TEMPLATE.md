# AI Agent Project Template: Next.js Full-Stack Application

> **Purpose**: This document provides instructions for an AI agent to scaffold and build a modern Next.js application following established patterns and best practices. Use this as context when starting a new project.

---

## 🎯 Project Configuration

### Technology Stack (Required)

```json
{
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "framer-motion": "^12.0.0",
    "zod": "^4.0.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^3.0.0",
    "lucide-react": "^0.400.0",
    "next-auth": "^5.0.0-beta.30"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@types/node": "^22.0.0",
    "vitest": "^3.0.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@vitejs/plugin-react": "^5.0.0",
    "jsdom": "^25.0.0",
    "@playwright/test": "^1.50.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "^16.0.0",
    "prettier": "^3.0.0"
  }
}
```

### TypeScript Configuration

Create `tsconfig.json` with strict mode and path aliases:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Next.js Configuration

Create `next.config.js` with image optimization and caching:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

---

## 📁 Project Structure

Create the following directory structure:

```
project-root/
├── auth.ts                       # Auth.js v5 configuration
├── middleware.ts                 # Route protection middleware
├── app/                          # Next.js App Router
│   ├── globals.css               # Global styles with Tailwind
│   ├── layout.tsx                # Root layout (with SessionProvider)
│   ├── page.tsx                  # Home page
│   ├── not-found.tsx             # 404 page
│   ├── robots.ts                 # SEO robots.txt
│   ├── sitemap.ts                # SEO sitemap
│   ├── api/                      # API Route Handlers
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts      # Auth.js route handler
│   │   ├── user/
│   │   │   └── favorites/
│   │   │       └── route.ts      # User favorites API
│   │   └── [resource]/
│   │       └── route.ts
│   ├── profile/                  # Protected user profile
│   │   └── page.tsx
│   └── [feature]/                # Feature routes
│       ├── layout.tsx
│       ├── page.tsx
│       └── [slug]/
│           └── page.tsx
├── components/
│   ├── auth/                     # Auth components (SessionProvider, SignInButton, UserMenu)
│   ├── favorites/                # Favorites components (FavoriteButton, FavoritesSection)
│   ├── layout/                   # Header, Footer, Navigation
│   ├── shared/                   # Reusable components (Breadcrumbs, ErrorBoundary)
│   ├── ui/                       # Primitives (Button, Card, Modal, Skeleton)
│   └── [feature]/                # Feature-specific components
├── lib/
│   ├── animations/
│   │   ├── hooks.ts              # useReducedMotion, useScrollAnimation
│   │   ├── variants.ts           # Framer Motion variants
│   │   └── transitions.ts        # Shared transitions
│   ├── data/
│   │   └── [resource].ts         # Data fetching functions
│   └── utils/
│       ├── cn.ts                 # Class name utility
│       └── [other-utils].ts
├── types/
│   ├── index.ts                  # Re-exports
│   └── [resource].ts             # Zod schemas + TypeScript types
├── data/                         # JSON data files (if using file-based data)
│   └── [resource]/
│       └── [item].json
├── public/
│   └── images/
├── scripts/                      # Build/validation scripts
└── tests/                        # Test files (or colocate with components)
```

---

## 🔧 Core Utility Files

### 1. Class Name Utility (`lib/utils/cn.ts`)

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes with proper override handling.
 * Uses clsx for conditional classes and twMerge to resolve conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 2. Animation Hooks (`lib/animations/hooks.ts`)

```typescript
"use client";

import { useEffect, useState, useRef } from "react";

/**
 * Detects user's reduced motion preference.
 * Returns true if user prefers reduced motion.
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Triggers animation when element enters viewport.
 * Returns [ref, isInView] tuple.
 */
export function useScrollAnimation(
  options: { threshold?: number; triggerOnce?: boolean } = {}
) {
  const { threshold = 0.1, triggerOnce = true } = options;
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true);
          if (triggerOnce) observer.disconnect();
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, triggerOnce]);

  return [ref, isInView] as const;
}
```

### 3. Animation Variants (`lib/animations/variants.ts`)

```typescript
import { Variants } from "framer-motion";

// Reduced motion fallback (instant transitions)
export const reducedMotionVariants: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
  exit: { opacity: 1 },
};

// Fade in
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

// Stagger container (for lists)
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Stagger child item
export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

// Slide in from right (panels/modals)
export const slideInRightVariants: Variants = {
  hidden: { x: "100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

// Scale on hover (cards)
export const scaleHoverVariants: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.03, transition: { duration: 0.2 } },
  tap: { scale: 0.98 },
};
```

---

## 📝 Type Definition Pattern

### Zod Schema + TypeScript Type (`types/[resource].ts`)

Always define Zod schemas first, then infer TypeScript types:

```typescript
import { z } from "zod";

// Define enums as Zod schemas
export const ResourceTypeSchema = z.enum(["type1", "type2", "type3"]);
export type ResourceType = z.infer<typeof ResourceTypeSchema>;

// Define nested object schemas
export const ResourceMetadataSchema = z.object({
  featured: z.boolean(),
  popularity: z.number().int().min(1).max(100),
  lastUpdated: z.string().datetime(),
});

// Define main schema with validation rules
export const ResourceSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "ID must be lowercase alphanumeric with hyphens"),
  name: z.string().min(1).max(100),
  type: ResourceTypeSchema,
  description: z.string().min(50).max(2000),
  imageUrl: z.string().startsWith("/images/"),
  tags: z.array(z.string()).min(1).max(10),
  relatedIds: z.array(z.string()),
  metadata: ResourceMetadataSchema,
});

// Infer TypeScript type from Zod schema
export type Resource = z.infer<typeof ResourceSchema>;

// Optional: TypeScript interface for cases where you need it
export interface ResourceMetadata {
  featured: boolean;
  popularity: number;
  lastUpdated: string;
}
```

---

## 📊 Data Layer Pattern

### Data Fetching (`lib/data/[resource].ts`)

```typescript
import { promises as fs } from "fs";
import path from "path";
import { Resource, ResourceSchema } from "@/types/resource";
import { z } from "zod";

const DATA_DIR = path.join(process.cwd(), "data", "resources");

/**
 * Load all resources from JSON files with Zod validation.
 */
export async function getAllResources(): Promise<Resource[]> {
  try {
    const files = await fs.readdir(DATA_DIR);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    const resources = await Promise.all(
      jsonFiles.map(async (file) => {
        const filePath = path.join(DATA_DIR, file);
        const content = await fs.readFile(filePath, "utf-8");
        const data = JSON.parse(content);
        return ResourceSchema.parse(data); // Validates at runtime
      })
    );

    // Sort by popularity or other criteria
    return resources.sort((a, b) => b.metadata.popularity - a.metadata.popularity);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation failed:", error.issues);
      throw new Error(`Invalid data format: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Load single resource by ID.
 */
export async function getResourceById(id: string): Promise<Resource | null> {
  try {
    const filePath = path.join(DATA_DIR, `${id}.json`);
    const content = await fs.readFile(filePath, "utf-8");
    return ResourceSchema.parse(JSON.parse(content));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

/**
 * Search resources by query string.
 */
export async function searchResources(query: string): Promise<Resource[]> {
  const resources = await getAllResources();
  const lowerQuery = query.toLowerCase();

  return resources.filter(
    (resource) =>
      resource.name.toLowerCase().includes(lowerQuery) ||
      resource.description.toLowerCase().includes(lowerQuery) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}
```

---

## 🧱 Component Patterns

### 1. Root Layout (`app/layout.tsx`)

```tsx
import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "Project Name",
    template: "%s | Project Name",
  },
  description: "Project description for SEO",
  keywords: ["keyword1", "keyword2"],
  authors: [{ name: "Author Name" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Project Name",
    description: "Project description",
    siteName: "Project Name",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased">
        <Header />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
```

### 2. Feature Page with Dynamic Imports (`app/[feature]/page.tsx`)

```tsx
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Resource } from "@/types/resource";
import { ResourceSkeleton } from "@/components/[feature]/ResourceSkeleton";
import { FeatureErrorBoundary } from "@/components/[feature]/FeatureErrorBoundary";

// Dynamic imports for code splitting
const ResourceGrid = dynamic(
  () => import("@/components/[feature]/ResourceGrid").then((mod) => ({ default: mod.ResourceGrid })),
  {
    loading: () => (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => <ResourceSkeleton key={i} />)}
      </div>
    ),
  }
);

const ResourceDetailPanel = dynamic(
  () => import("@/components/[feature]/ResourceDetailPanel").then((mod) => ({ default: mod.ResourceDetailPanel })),
  { ssr: false }
);

function FeaturePageContent() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadResources() {
      try {
        const response = await fetch("/api/resources");
        const data = await response.json();
        setResources(data);
      } catch (error) {
        console.error("Failed to load resources:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadResources();
  }, []);

  return (
    <div className="space-y-8">
      <header className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold">Page Title</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Page description text.
        </p>
      </header>

      {isLoading ? (
        <ResourceSkeleton />
      ) : (
        <ResourceGrid
          resources={resources}
          onResourceClick={setSelectedResource}
        />
      )}

      <ResourceDetailPanel
        resource={selectedResource}
        isOpen={!!selectedResource}
        onClose={() => setSelectedResource(null)}
      />
    </div>
  );
}

export default function FeaturePage() {
  return (
    <FeatureErrorBoundary>
      <FeaturePageContent />
    </FeatureErrorBoundary>
  );
}
```

### 3. Detail Page with SSG (`app/[feature]/[slug]/page.tsx`)

```tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getResourceById, getAllResources } from "@/lib/data/resources";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

interface DetailPageProps {
  params: Promise<{ slug: string }>;
}

// Pre-render all pages at build time
export async function generateStaticParams() {
  const resources = await getAllResources();
  return resources.map((resource) => ({ slug: resource.id }));
}

// Dynamic metadata per page
export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const resource = await getResourceById(slug);

  if (!resource) {
    return { title: "Not Found" };
  }

  return {
    title: resource.name,
    description: resource.description,
    openGraph: {
      title: resource.name,
      description: resource.description,
      images: [{ url: resource.imageUrl }],
    },
  };
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { slug } = await params;
  const resource = await getResourceById(slug);

  if (!resource) {
    notFound();
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Resources", href: "/resources" },
          { label: resource.name, href: `/resources/${resource.id}` },
        ]}
      />
      {/* Page content */}
    </div>
  );
}
```

### 4. Animated Card Component

```tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Resource } from "@/types/resource";
import { cn } from "@/lib/utils/cn";
import { useReducedMotion } from "@/lib/animations/hooks";
import { scaleHoverVariants, reducedMotionVariants } from "@/lib/animations/variants";

interface ResourceCardProps {
  resource: Resource;
  index: number;
  onClick: () => void;
}

export function ResourceCard({ resource, index, onClick }: ResourceCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? reducedMotionVariants : scaleHoverVariants;

  return (
    <motion.article
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-card",
        "cursor-pointer transition-shadow duration-300",
        "hover:shadow-lg",
        "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
      )}
      variants={variants}
      whileHover={prefersReducedMotion ? {} : "hover"}
      whileTap={prefersReducedMotion ? {} : "tap"}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View details about ${resource.name}`}
    >
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={resource.imageUrl}
          alt={resource.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="text-xl font-semibold">{resource.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {resource.description}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {resource.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 rounded text-xs bg-secondary"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
```

### 5. Error Boundary Component

```tsx
"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-[400px] items-center justify-center px-4">
            <div className="max-w-md text-center">
              <h2 className="mb-4 text-2xl font-bold">Something Went Wrong</h2>
              <p className="mb-6 text-muted-foreground">
                {this.state.error?.message || "An unexpected error occurred"}
              </p>
              <button
                onClick={() => this.setState({ hasError: false, error: undefined })}
                className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground"
              >
                Try Again
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

### 6. Button Component with Variants

```tsx
"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, disabled, children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
      ghost: "bg-transparent hover:bg-accent",
      danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    };

    const sizes = {
      sm: "text-sm px-3 py-1.5",
      md: "text-base px-4 py-2",
      lg: "text-lg px-6 py-3",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
```

---

## 🔐 Authentication Pattern (Auth.js v5)

### 1. Auth Configuration (`auth.ts`)

```typescript
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],
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

### 2. Route Handler (`app/api/auth/[...nextauth]/route.ts`)

```typescript
import { handlers } from "@/auth";
export const { GET, POST } = handlers;
```

### 3. Middleware (`middleware.ts`)

```typescript
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const protectedPaths = ["/profile", "/dashboard"];
  const isProtected = protectedPaths.some((p) => req.nextUrl.pathname.startsWith(p));

  if (isProtected && !req.auth) {
    const signInUrl = new URL("/api/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
```

### 4. Session Provider (`components/auth/SessionProvider.tsx`)

```typescript
"use client";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
```

### 5. Type Augmentation (`types/next-auth.d.ts`)

```typescript
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}
```

### 6. Environment Variables (`.env.example`)

```bash
# Auth.js Configuration
AUTH_SECRET="generate-with-openssl-rand-base64-32"
AUTH_URL="http://localhost:3000"

# GitHub OAuth
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"
```

---

## 🔍 SEO Files

### Robots (`app/robots.ts`)

```typescript
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://your-domain.com/sitemap.xml",
  };
}
```

### Sitemap (`app/sitemap.ts`)

```typescript
import { MetadataRoute } from "next";
import { getAllResources } from "@/lib/data/resources";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://your-domain.com";

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), priority: 1 },
    { url: `${baseUrl}/resources`, lastModified: new Date(), priority: 0.9 },
  ];

  const resources = await getAllResources();
  const resourcePages = resources.map((resource) => ({
    url: `${baseUrl}/resources/${resource.id}`,
    lastModified: new Date(resource.metadata.lastUpdated),
    priority: resource.metadata.featured ? 0.8 : 0.7,
  }));

  return [...staticPages, ...resourcePages];
}
```

---

## 🧪 Testing Configuration

### Vitest Config (`vitest.config.ts`)

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
```

### Test Setup (`vitest.setup.ts`)

```typescript
import "@testing-library/jest-dom";
```

### Playwright Config (`playwright.config.ts`)

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## 📜 NPM Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

---

## ⚙️ Customization Options

When using this template, specify any of the following adjustments:

### Data Source Options
- [ ] **File-based JSON** (default) - JSON files in `/data` directory
- [ ] **API/Database** - Replace data layer with API calls or ORM
- [ ] **CMS Integration** - Contentful, Sanity, Strapi, etc.

### Styling Options
- [ ] **Custom color palette** - Define in `tailwind.config.ts`
- [ ] **Dark mode** - Add `dark:` variants and theme toggle
- [ ] **Custom fonts** - Configure in layout with next/font

### Feature Additions
- [x] **Authentication** - Auth.js v5 (NextAuth.js) with OAuth providers
- [ ] **Search** - Full-text search with Algolia or Meilisearch
- [ ] **Internationalization** - next-intl or next-i18next
- [ ] **Analytics** - Vercel Analytics, Plausible, or Posthog
- [ ] **Forms** - React Hook Form with Zod validation

### Animation Preferences
- [ ] **Minimal animations** - Use only fade transitions
- [ ] **Rich animations** - Add parallax, scroll-triggered, and gesture animations
- [ ] **No animations** - Remove Framer Motion, use CSS transitions only

---

## 🚀 Quick Start Instructions for AI Agent

1. **Initialize project**: Create a new Next.js project with TypeScript
2. **Install dependencies**: Use the package.json dependencies listed above
3. **Create directory structure**: Follow the project structure diagram
4. **Set up core utilities**: Create `cn.ts`, animation hooks, and variants
5. **Define types**: Create Zod schemas for all data entities
6. **Build data layer**: Implement data fetching functions with validation
7. **Create layout**: Build root layout with Header/Footer
8. **Implement features**: Build pages following the component patterns
9. **Add SEO**: Create robots.ts and sitemap.ts
10. **Configure testing**: Set up Vitest and Playwright

---

## 📋 Pre-Flight Checklist

Before considering the project complete, verify:

- [ ] All TypeScript strict mode errors resolved
- [ ] Zod schemas validate all data sources
- [ ] Images use Next.js Image component with proper sizes
- [ ] Dynamic imports used for non-critical components
- [ ] All interactive elements have keyboard support
- [ ] Reduced motion hook used for all animations
- [ ] ARIA labels on interactive elements
- [ ] Metadata configured for all pages
- [ ] Error boundaries wrap feature sections
- [ ] Loading skeletons for async content
- [ ] Mobile responsive at all breakpoints
- [ ] Console free of errors and warnings
