"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

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
            
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={cn(
                "px-3 py-2 text-sm font-medium text-norse-stone transition-colors rounded-md",
                "hover:text-norse-gold hover:bg-norse-gold/10",
                "focus:outline-none focus:ring-2 focus:ring-norse-gold focus:ring-offset-2 focus:ring-offset-norse-night",
                "active:bg-norse-gold/20",
                "flex items-center gap-2"
              )}
              aria-label="Open search"
              aria-expanded={isSearchOpen}
            >
              <Search size={16} />
              <span className="hidden sm:inline">Search</span>
            </button>
          </nav>
        </div>

        {/* Expanded Search Bar */}
        {isSearchOpen && (
          <div className="pb-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search gods, stories, realms..."
                className={cn(
                  "w-full rounded-lg border-2 border-norse-gold/30 bg-norse-gray-900 py-2 pl-10 pr-10 text-norse-gray-100 placeholder-norse-gray-500",
                  "focus:border-norse-gold focus:outline-none focus:ring-2 focus:ring-norse-gold/20",
                  "transition-all duration-200"
                )}
                autoFocus
                aria-label="Search input"
              />
              
              {/* Search Icon */}
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search size={18} className="text-norse-gray-500" />
              </div>

              {/* Clear/Close Button */}
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                }}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-norse-gray-500 hover:text-norse-gold transition-colors"
                aria-label="Close search"
              >
                <X size={18} />
              </button>
            </form>
            
            {/* Search Hint */}
            <p className="mt-2 text-xs text-norse-gray-500">
              Press Enter to search or Escape to close
            </p>
          </div>
        )}
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
