"use client";

import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-norse-stone/20 bg-norse-night/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
            aria-label="Norse Mythology Knowledge Base Home"
          >
            <div className="text-2xl font-bold text-norse-gold group-hover:text-norse-gold/80 transition-colors">
              ⚡
            </div>
            <span className="text-xl font-semibold text-norse-gold group-hover:text-norse-gold/80 transition-colors hidden sm:inline">
              Norse Mythology
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-2 sm:gap-4" role="navigation">
            <NavLink href="/gods">Gods</NavLink>
            <NavLink href="/stories">Stories</NavLink>
            <NavLink href="/realms">Realms</NavLink>
            <NavLink href="/search">Search</NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "px-3 py-2 text-sm font-medium text-norse-stone transition-colors rounded-md",
        "hover:text-norse-gold hover:bg-norse-gold/10",
        "focus:outline-none focus:ring-2 focus:ring-norse-gold focus:ring-offset-2 focus:ring-offset-norse-night",
        "active:bg-norse-gold/20",
        className
      )}
    >
      {children}
    </Link>
  );
}
