# Auth.js v5 Implementation Guide for Norse Project

> **Purpose**: This document explains the complete Auth.js v5 implementation in the Norse Mythology Knowledge Base, including OAuth setup, user favorites, and protected routes. Written for learning and interview preparation.

---

## 📋 Table of Contents

1. [What We're Building](#what-were-building)
2. [How OAuth Works](#how-oauth-works)
3. [Auth.js v5 Architecture](#authjs-v5-architecture)
4. [File Structure](#file-structure)
5. [Step-by-Step Implementation](#step-by-step-implementation)
6. [Understanding Each Component](#understanding-each-component)
7. [Data Flow Diagrams](#data-flow-diagrams)
8. [Interview Talking Points](#interview-talking-points)

---

## 🎯 What We're Building

### Features
- **OAuth Login**: Sign in with GitHub (can add Google, Discord, etc.)
- **User Profile Page**: View and manage account settings
- **Favorites System**: Save favorite gods and realms
- **Landing Page Integration**: Show user's favorites with quick links
- **Empty State Prompts**: Tooltips guiding users to add favorites
- **Protected Routes**: Middleware-based route protection

### User Flow
```
┌─────────────────────────────────────────────────────────────────┐
│  1. User visits site → Sees "Sign In" button in header          │
│  2. Clicks "Sign In" → Redirected to GitHub OAuth               │
│  3. Authorizes app → Redirected back with session               │
│  4. Landing page shows favorites section (empty initially)      │
│  5. User browses gods/realms → Clicks "♡" to favorite           │
│  6. Returns to landing page → Sees favorite god/realm cards     │
│  7. Visits /profile → Sees account info and all favorites       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 How OAuth Works

### The OAuth 2.0 Flow (Authorization Code Grant)

```
┌──────────┐                                    ┌──────────────┐
│  User's  │                                    │   GitHub     │
│  Browser │                                    │   (OAuth     │
│          │                                    │   Provider)  │
└────┬─────┘                                    └──────┬───────┘
     │                                                  │
     │  1. Click "Sign in with GitHub"                  │
     │─────────────────────────────────────────────────>│
     │                                                  │
     │  2. GitHub shows login/consent screen            │
     │<─────────────────────────────────────────────────│
     │                                                  │
     │  3. User approves, GitHub redirects with CODE    │
     │─────────────────────────────────────────────────>│
     │           ↓                                      │
     │  ┌───────────────┐                               │
     │  │  Your Server  │  4. Exchange CODE for TOKENS  │
     │  │  (Next.js)    │──────────────────────────────>│
     │  └───────────────┘                               │
     │           │        5. GitHub returns ACCESS_TOKEN│
     │           │<─────────────────────────────────────│
     │           │                                      │
     │  6. Server creates SESSION, sets cookie          │
     │<──────────│                                      │
     │                                                  │
     │  7. User is now authenticated!                   │
     │                                                  │
```

### Key Terms

| Term | Definition |
|------|------------|
| **OAuth Provider** | Service that authenticates users (GitHub, Google, etc.) |
| **Client ID** | Public identifier for your app (safe to expose) |
| **Client Secret** | Private key for your app (NEVER expose in client code) |
| **Authorization Code** | Temporary code exchanged for tokens (one-time use) |
| **Access Token** | Credential to access user data from provider's API |
| **Refresh Token** | Long-lived token to get new access tokens |
| **Session** | Server-side or JWT representation of logged-in user |

---

## 🏗️ Auth.js v5 Architecture

### How Auth.js Fits In

```
┌─────────────────────────────────────────────────────────────────┐
│                         Next.js Application                      │
│                                                                  │
│  ┌────────────────┐     ┌────────────────┐     ┌──────────────┐ │
│  │   auth.ts      │     │   middleware   │     │  Components  │ │
│  │   (config)     │────>│   .ts          │     │              │ │
│  │                │     │   (protection) │     │  useSession()│ │
│  └────────────────┘     └────────────────┘     └──────────────┘ │
│          │                                            │         │
│          │                                            │         │
│          v                                            v         │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Auth.js v5 Core                                │ │
│  │  - OAuth flow handling                                      │ │
│  │  - Session management (JWT or Database)                     │ │
│  │  - Callback processing                                      │ │
│  │  - Token refresh                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│                              v                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  /api/auth/[...nextauth]/route.ts                           │ │
│  │  - GET/POST handlers for all auth endpoints                 │ │
│  │  - /api/auth/signin, /api/auth/callback, etc.               │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### v5 vs v4 Key Difference

```typescript
// v4: Everything in API route, verbose session access
// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
export const authOptions = { providers: [...] };
export default NextAuth(authOptions);

// Then in pages:
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
const session = await getServerSession(authOptions); // Verbose!

// v5: Split config, clean session access
// auth.ts (root level)
export const { handlers, auth, signIn, signOut } = NextAuth({ providers: [...] });

// Then in pages:
import { auth } from "@/auth";
const session = await auth(); // Clean!
```

---

## 📁 File Structure

```
norse/
├── auth.ts                          # Main Auth.js configuration
├── middleware.ts                    # Route protection
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts         # Auth API endpoints
│   │   └── user/
│   │       └── favorites/
│   │           └── route.ts         # Favorites API
│   ├── profile/
│   │   └── page.tsx                 # User profile page
│   ├── layout.tsx                   # Updated with SessionProvider
│   └── page.tsx                     # Updated with favorites section
├── components/
│   ├── auth/
│   │   ├── SignInButton.tsx         # Sign in/out button
│   │   ├── UserMenu.tsx             # Dropdown with user info
│   │   └── SessionProvider.tsx      # Client-side session context
│   ├── favorites/
│   │   ├── FavoriteButton.tsx       # Heart button for favoriting
│   │   ├── FavoritesSection.tsx     # Landing page favorites display
│   │   └── EmptyFavoritesPrompt.tsx # Tooltip/prompt for empty state
│   └── layout/
│       └── Header.tsx               # Updated with auth UI
├── lib/
│   └── data/
│       └── favorites.ts             # Favorites data layer
├── types/
│   ├── next-auth.d.ts               # Type augmentation for session
│   └── user.ts                      # User-related types
└── data/
    └── users/                       # JSON-based user storage
        └── [userId].json            # Per-user favorites data
```

---

## 🔧 Step-by-Step Implementation

### Step 1: Install Dependencies

```bash
npm install next-auth@beta
```

**Why `@beta`?** Auth.js v5 is published under the beta tag. We'll pin the exact version in package.json for stability.

### Step 2: Create OAuth App on GitHub

1. Go to GitHub → Settings → Developer Settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: Norse Mythology Knowledge Base
   - **Homepage URL**: http://localhost:3000
   - **Authorization callback URL**: http://localhost:3000/api/auth/callback/github
4. Save and copy **Client ID** and **Client Secret**

### Step 3: Environment Variables

Create `.env.local`:

```bash
# Auth.js
AUTH_SECRET="your-random-secret-at-least-32-characters"
AUTH_URL="http://localhost:3000"

# GitHub OAuth
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"
```

**Generate AUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Step 4: Create Core Auth Configuration

```typescript
// auth.ts
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Add user ID to session for favorites lookup
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",  // Custom sign-in page (optional)
  },
});
```

**What's happening here:**
- `handlers` - GET/POST handlers for /api/auth/* routes
- `auth` - Function to get current session (server-side)
- `signIn` - Function to trigger sign-in
- `signOut` - Function to trigger sign-out
- `callbacks.session` - Customize what's in the session object

### Step 5: Create Route Handler

```typescript
// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
```

**Why so minimal?** Auth.js v5 exports pre-configured handlers. This file just re-exports them for the App Router.

### Step 6: Create Middleware for Protected Routes

```typescript
// middleware.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isProtectedRoute = req.nextUrl.pathname.startsWith("/profile");

  if (isProtectedRoute && !isLoggedIn) {
    const signInUrl = new URL("/api/auth/signin", req.nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/profile/:path*"],
};
```

**Key concepts:**
- `req.auth` - The current session (null if not logged in)
- `matcher` - Which routes this middleware runs on
- `callbackUrl` - Where to redirect after successful login

### Step 7: Session Provider for Client Components

```typescript
// components/auth/SessionProvider.tsx
"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export function SessionProvider({ children }: { children: ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
```

**Why a wrapper?** The `"use client"` directive can't be in layout.tsx (which is a Server Component by default).

### Step 8: Update Root Layout

```typescript
// app/layout.tsx
import { SessionProvider } from "@/components/auth/SessionProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
```

### Step 9: Create Auth UI Components

```typescript
// components/auth/SignInButton.tsx
"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export function SignInButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-8 w-20 animate-pulse bg-gray-700 rounded" />;
  }

  if (session) {
    return (
      <button
        onClick={() => signOut()}
        className="px-4 py-2 text-sm text-norse-stone hover:text-norse-gold"
      >
        Sign Out
      </button>
    );
  }

  return (
    <button
      onClick={() => signIn("github")}
      className="px-4 py-2 text-sm bg-norse-gold text-norse-night rounded-lg hover:bg-norse-gold/90"
    >
      Sign In
    </button>
  );
}
```

### Step 10: Create Favorites System

```typescript
// types/user.ts
import { z } from "zod";

export const UserFavoritesSchema = z.object({
  favoriteGods: z.array(z.string()),  // Array of god IDs
  favoriteRealms: z.array(z.string()), // Array of realm IDs
  updatedAt: z.string().datetime(),
});

export type UserFavorites = z.infer<typeof UserFavoritesSchema>;
```

```typescript
// lib/data/favorites.ts
import { promises as fs } from "fs";
import path from "path";
import { UserFavorites, UserFavoritesSchema } from "@/types/user";

const USERS_DIR = path.join(process.cwd(), "data", "users");

export async function getUserFavorites(userId: string): Promise<UserFavorites> {
  try {
    const filePath = path.join(USERS_DIR, `${userId}.json`);
    const content = await fs.readFile(filePath, "utf-8");
    return UserFavoritesSchema.parse(JSON.parse(content));
  } catch (error) {
    // Return empty favorites for new users
    return {
      favoriteGods: [],
      favoriteRealms: [],
      updatedAt: new Date().toISOString(),
    };
  }
}

export async function updateUserFavorites(
  userId: string,
  favorites: Partial<UserFavorites>
): Promise<UserFavorites> {
  const current = await getUserFavorites(userId);
  const updated = {
    ...current,
    ...favorites,
    updatedAt: new Date().toISOString(),
  };
  
  // Ensure directory exists
  await fs.mkdir(USERS_DIR, { recursive: true });
  
  const filePath = path.join(USERS_DIR, `${userId}.json`);
  await fs.writeFile(filePath, JSON.stringify(updated, null, 2));
  
  return updated;
}

export async function toggleFavoriteGod(
  userId: string,
  godId: string
): Promise<{ isFavorite: boolean }> {
  const favorites = await getUserFavorites(userId);
  const isFavorite = favorites.favoriteGods.includes(godId);
  
  const newFavorites = isFavorite
    ? favorites.favoriteGods.filter((id) => id !== godId)
    : [...favorites.favoriteGods, godId];
  
  await updateUserFavorites(userId, { favoriteGods: newFavorites });
  
  return { isFavorite: !isFavorite };
}
```

### Step 11: Favorites API Route

```typescript
// app/api/user/favorites/route.ts
import { auth } from "@/auth";
import { getUserFavorites, toggleFavoriteGod, toggleFavoriteRealm } from "@/lib/data/favorites";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const favorites = await getUserFavorites(session.user.id);
  return NextResponse.json(favorites);
}

export async function POST(request: Request) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const body = await request.json();
  const { type, id } = body; // type: "god" | "realm", id: string
  
  if (type === "god") {
    const result = await toggleFavoriteGod(session.user.id, id);
    return NextResponse.json(result);
  }
  
  if (type === "realm") {
    const result = await toggleFavoriteRealm(session.user.id, id);
    return NextResponse.json(result);
  }
  
  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}
```

### Step 12: Favorite Button Component

```typescript
// components/favorites/FavoriteButton.tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface FavoriteButtonProps {
  type: "god" | "realm";
  id: string;
  initialFavorited: boolean;
  size?: "sm" | "md" | "lg";
}

export function FavoriteButton({
  type,
  id,
  initialFavorited,
  size = "md",
}: FavoriteButtonProps) {
  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(initialFavorited);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    if (!session) {
      // Prompt to sign in
      window.location.href = "/api/auth/signin";
      return;
    }

    setIsLoading(true);
    
    // Optimistic update
    setIsFavorite(!isFavorite);

    try {
      const response = await fetch("/api/user/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id }),
      });

      if (!response.ok) {
        // Rollback on error
        setIsFavorite(isFavorite);
      }
    } catch (error) {
      // Rollback on error
      setIsFavorite(isFavorite);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: "p-1",
    md: "p-2",
    lg: "p-3",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        "rounded-full transition-all",
        "hover:bg-norse-gold/10",
        "focus:outline-none focus:ring-2 focus:ring-norse-gold",
        sizeClasses[size],
        isLoading && "opacity-50 cursor-not-allowed"
      )}
      aria-label={isFavorite ? `Remove from favorites` : `Add to favorites`}
    >
      <Heart
        size={iconSizes[size]}
        className={cn(
          "transition-colors",
          isFavorite ? "fill-red-500 text-red-500" : "text-norse-stone"
        )}
      />
    </button>
  );
}
```

### Step 13: Profile Page

```typescript
// app/profile/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserFavorites } from "@/lib/data/favorites";
import { getGodById } from "@/lib/data/gods";
import { getRealmById } from "@/lib/data/realms";
import Image from "next/image";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const favorites = await getUserFavorites(session.user.id!);
  
  // Fetch favorite god and realm details
  const favoriteGods = await Promise.all(
    favorites.favoriteGods.map((id) => getGodById(id))
  );
  const favoriteRealms = favorites.favoriteRealms
    .map((id) => getRealmById(id))
    .filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="flex items-center gap-6 p-6 bg-norse-night/50 rounded-lg border border-norse-stone/20">
        {session.user.image && (
          <Image
            src={session.user.image}
            alt={session.user.name || "Profile"}
            width={80}
            height={80}
            className="rounded-full"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold text-norse-gold">
            {session.user.name}
          </h1>
          <p className="text-norse-stone">{session.user.email}</p>
        </div>
      </div>

      {/* Favorite Gods */}
      <section>
        <h2 className="text-xl font-semibold text-norse-gold mb-4">
          Favorite Gods ({favoriteGods.length})
        </h2>
        {favoriteGods.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteGods.filter(Boolean).map((god) => (
              <Link
                key={god!.id}
                href={`/gods/${god!.id}`}
                className="p-4 bg-norse-night/50 rounded-lg border border-norse-stone/20 hover:border-norse-gold/50 transition-colors"
              >
                <h3 className="font-semibold text-norse-gold">{god!.name}</h3>
                <p className="text-sm text-norse-stone">{god!.title}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-norse-stone">
            No favorite gods yet.{" "}
            <Link href="/gods" className="text-norse-gold hover:underline">
              Explore the pantheon
            </Link>
          </p>
        )}
      </section>

      {/* Favorite Realms */}
      <section>
        <h2 className="text-xl font-semibold text-norse-gold mb-4">
          Favorite Realms ({favoriteRealms.length})
        </h2>
        {favoriteRealms.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteRealms.map((realm) => (
              <Link
                key={realm!.id}
                href={`/realms#${realm!.id}`}
                className="p-4 bg-norse-night/50 rounded-lg border border-norse-stone/20 hover:border-norse-gold/50 transition-colors"
              >
                <h3 className="font-semibold text-norse-gold">{realm!.name}</h3>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-norse-stone">
            No favorite realms yet.{" "}
            <Link href="/realms" className="text-norse-gold hover:underline">
              Explore the Nine Realms
            </Link>
          </p>
        )}
      </section>
    </div>
  );
}
```

---

## 📊 Data Flow Diagrams

### Sign In Flow

```
User clicks "Sign In"
        │
        v
┌───────────────────┐
│ signIn("github")  │ (next-auth/react)
└─────────┬─────────┘
          │
          v
┌───────────────────┐
│ /api/auth/signin  │ (Auth.js route)
│ → Redirect to     │
│   GitHub OAuth    │
└─────────┬─────────┘
          │
          v
┌───────────────────┐
│ GitHub Login Page │
│ User authorizes   │
└─────────┬─────────┘
          │
          v
┌─────────────────────────┐
│ /api/auth/callback/     │
│ github?code=xxx         │
│                         │
│ 1. Exchange code        │
│ 2. Get user profile     │
│ 3. Create JWT session   │
│ 4. Set cookie           │
└─────────┬───────────────┘
          │
          v
┌───────────────────┐
│ Redirect to       │
│ callbackUrl       │
│ (or homepage)     │
└───────────────────┘
```

### Favorite Toggle Flow

```
User clicks ♡ on Thor
        │
        v
┌───────────────────────┐
│ FavoriteButton        │
│ 1. Optimistic update  │
│ 2. POST /api/user/    │
│    favorites          │
└─────────┬─────────────┘
          │
          v
┌───────────────────────┐
│ API Route             │
│ 1. auth() → session   │
│ 2. toggleFavoriteGod  │
│    (session.user.id,  │
│     "thor")           │
└─────────┬─────────────┘
          │
          v
┌───────────────────────┐
│ favorites.ts          │
│ 1. Read user JSON     │
│ 2. Toggle "thor" in   │
│    favoriteGods[]     │
│ 3. Write user JSON    │
└─────────┬─────────────┘
          │
          v
┌───────────────────────┐
│ Return { isFavorite } │
│ → UI confirmed        │
└───────────────────────┘
```

---

## 🔑 Key Concepts Explained

### JWT vs Database Sessions

| JWT Sessions | Database Sessions |
|--------------|-------------------|
| Stored in cookie | Stored in database |
| Stateless (no DB lookup) | Requires DB lookup |
| Larger cookie size | Small cookie (just ID) |
| Can't revoke instantly | Can revoke instantly |
| **We use this** | Better for high security |

**Why JWT for this project?** 
- No database required
- Works with file-based favorites storage
- Simpler to understand and implement

### The `auth()` Function

```typescript
// In Server Components / API routes
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();
  // session = { user: { id, name, email, image }, expires }
  // or null if not logged in
}
```

### The `useSession()` Hook

```typescript
// In Client Components
"use client";
import { useSession } from "next-auth/react";

export function MyComponent() {
  const { data: session, status } = useSession();
  // status: "loading" | "authenticated" | "unauthenticated"
}
```

### Middleware vs Layout Protection

| Middleware | Layout Check |
|------------|--------------|
| Runs before page loads | Runs during render |
| Redirects immediately | Can show loading state |
| Protects entire routes | Protects specific parts |
| **Better for UX** | Good for partial protection |

---

## 🎯 Interview Talking Points

### "How does your authentication work?"

> "I implemented OAuth 2.0 using Auth.js v5. When a user clicks 'Sign In', they're redirected to GitHub's OAuth page. After authorizing, GitHub redirects back with an authorization code. Auth.js exchanges this code for an access token, creates a JWT session, and sets an HTTP-only cookie. All subsequent requests include this cookie, which the middleware can verify for protected routes."

### "Why Auth.js over other solutions?"

> "I chose Auth.js because it's the most widely adopted auth library in the Next.js ecosystem, it's open-source with no vendor lock-in, and v5 has native App Router support. It gave me full control over the auth flow while handling the complex OAuth handshake."

### "How do you protect routes?"

> "I use Next.js middleware that runs at the edge before the page loads. The middleware calls `auth()` to check if there's a valid session. For protected routes like `/profile`, it redirects unauthenticated users to sign in, preserving the original URL as a callback. This is more performant than checking in the page component because the redirect happens at the CDN edge."

### "Explain your favorites feature"

> "I implemented an optimistic UI pattern. When a user clicks the favorite button, the UI updates immediately while the API call happens in the background. If the call fails, the UI rolls back. The favorites are stored in JSON files keyed by user ID, with Zod validation to ensure data integrity. The API routes are protected using the `auth()` function to get the current user."

### "How would you scale the favorites system?"

> "The current file-based storage works for a demo but wouldn't scale. In production, I'd use a database like PostgreSQL with Prisma, or a key-value store like Redis. Auth.js has database adapters that handle user storage, and I'd create a separate `favorites` table with a foreign key to the user. The API routes and components would stay largely the same - only the data layer changes."

---

## 🧪 Testing Auth

### Manual Testing Checklist

- [ ] Sign in redirects to GitHub
- [ ] Callback redirects back to app
- [ ] Session persists across page refreshes
- [ ] Sign out clears session
- [ ] Protected routes redirect to sign in
- [ ] Callback URL preserved after sign in
- [ ] Favorites work only when signed in
- [ ] Favorite state persists across sessions

### Debug Tips

```typescript
// See what's in the session
const session = await auth();
console.log("Session:", JSON.stringify(session, null, 2));

// Check environment variables
console.log("GitHub ID set:", !!process.env.AUTH_GITHUB_ID);
console.log("Auth URL:", process.env.AUTH_URL);
```

---

## 📚 Further Reading

- [Auth.js v5 Documentation](https://authjs.dev/)
- [OAuth 2.0 Simplified](https://aaronparecki.com/oauth-2-simplified/)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [JWT.io](https://jwt.io/) - Inspect JWT tokens

---

## 🚀 Quick Setup Guide

### Prerequisites

1. Node.js 18+ installed
2. At least one OAuth provider account (Google recommended, GitHub/Discord optional)

### Step 1: Create OAuth App(s)

#### Google (Recommended - Most users have Google accounts)

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing
3. Configure **OAuth consent screen** (External, add test users if needed)
4. Go to **Credentials** → **Create Credentials** → **OAuth client ID**
5. Select **Web application**
6. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
7. Copy the **Client ID** and **Client Secret**

#### GitHub (Optional - Good for developers)

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in the form:
   - **Application name**: `Norse Mythology Dev` (or any name)
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Copy the **Client ID** and generate a **Client Secret**

#### Discord (Optional - Good for gaming/community audiences)

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **New Application**
3. Go to **OAuth2** → Add redirect: `http://localhost:3000/api/auth/callback/discord`
4. Copy the **Client ID** and **Client Secret**

### Step 2: Configure Environment Variables

Create a `.env.local` file in the project root (it's gitignored):

```bash
# Generate a secure secret
openssl rand -base64 32
```

Add to `.env.local`:

```env
# Auth.js Configuration
AUTH_SECRET="your-generated-secret-here"
AUTH_URL="http://localhost:3000"

# Google OAuth (Recommended)
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# GitHub OAuth (Optional)
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"

# Discord OAuth (Optional)
AUTH_DISCORD_ID="your-discord-client-id"
AUTH_DISCORD_SECRET="your-discord-client-secret"
```

> **Note:** You only need to configure the providers you want to use. Providers without credentials will not appear on the sign-in page.

### Step 3: Start the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` - you should see a **Sign In** button in the header.

### Step 4: Test the Flow

1. Click **Sign In** → shows provider selection page
2. Choose a provider (Google, GitHub, or Discord)
3. Authorize the app → redirects back
4. You should now see your avatar in the header
4. Visit `/gods` and click the heart icons to favorite
5. Visit `/profile` to see your favorites

---

## 📂 Complete File Manifest

### New Files Created

| File | Purpose |
|------|---------|
| `auth.ts` | Main Auth.js configuration with Google/GitHub/Discord OAuth, JWT strategy |
| `middleware.ts` | Route protection for `/profile` routes |
| `app/api/auth/[...nextauth]/route.ts` | Auth API route handler |
| `app/api/user/favorites/route.ts` | Favorites GET/POST API |
| `app/profile/layout.tsx` | Profile page layout with metadata |
| `app/profile/page.tsx` | Profile page showing user info and favorites |
| `components/auth/SessionProvider.tsx` | Client-side session context wrapper |
| `components/auth/SignInButton.tsx` | Sign in/out button with loading state |
| `components/auth/UserMenu.tsx` | User dropdown with profile links |
| `components/favorites/FavoriteButton.tsx` | Heart toggle with optimistic updates |
| `components/favorites/FavoritesSection.tsx` | Landing page favorites display |
| `components/favorites/EmptyFavoritesPrompt.tsx` | Empty state guidance UI |
| `components/favorites/LandingFavorites.tsx` | Client wrapper for landing page |
| `lib/data/favorites.ts` | JSON file-based favorites persistence |
| `types/next-auth.d.ts` | TypeScript augmentation for session.user.id |
| `types/user.ts` | UserFavoritesSchema with Zod validation |
| `data/users/.gitkeep` | Placeholder for user data directory |
| `.env.example` | Environment variable template |

### Modified Files

| File | Changes |
|------|---------|
| `app/layout.tsx` | Wrapped with `SessionProvider` |
| `app/page.tsx` | Added `LandingFavorites` component |
| `components/layout/Header.tsx` | Added auth UI (SignInButton/UserMenu) |
| `components/gods/GodCard.tsx` | Added `FavoriteButton` with `isFavorited` prop |
| `components/gods/GodGrid.tsx` | Added `favoriteGodIds` prop |
| `app/gods/page.tsx` | Fetches favorites and passes to GodGrid |
| `.gitignore` | Added `data/users/` to ignore user data |
| `package.json` | Added `next-auth@5.0.0-beta.30` dependency |

---

## ⚠️ Known Issues & Notes

### Next.js 16 Middleware Warning

You may see this warning when running the dev server:

```
⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.
```

This is expected - Next.js 16 is introducing a new "proxy" convention. Auth.js will likely update to support this in future versions. For now, the middleware works correctly.

### Production Deployment

For production, you'll need to:

1. Set `AUTH_URL` to your production domain (e.g., `https://norse.example.com`)
2. Update each OAuth provider's callback URLs to use your production domain
3. Use a secure, randomly generated `AUTH_SECRET`
4. Consider switching from file-based favorites storage to a database
