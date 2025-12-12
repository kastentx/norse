"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import type { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { User, LogOut, Heart, ChevronDown, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface UserMenuProps {
  /**
   * Optional session to use instead of useSession hook.
   * Used when offline to pass cached session.
   */
  session?: Session | null;
}

/**
 * User Menu Dropdown
 * 
 * Shows user avatar and dropdown with:
 * - Profile link
 * - Favorites link
 * - Sign out button
 * - Offline-aware sign out handling
 */
export function UserMenu({ session: propSession }: UserMenuProps) {
  const { data: hookSession } = useSession();
  const session = propSession ?? hookSession;
  const [isOpen, setIsOpen] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menu on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  if (!session?.user) {
    return null;
  }

  return (
    <div ref={menuRef} className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-2 py-1 rounded-lg",
          "hover:bg-norse-gold/10 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-norse-gold focus:ring-offset-2 focus:ring-offset-norse-night"
        )}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {session.user.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name || "User avatar"}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-norse-gold/20 flex items-center justify-center">
            <User size={16} className="text-norse-gold" />
          </div>
        )}
        <ChevronDown
          size={16}
          className={cn(
            "text-norse-stone transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={cn(
            "absolute right-0 mt-2 w-56 py-2",
            "bg-norse-night border border-norse-stone/20 rounded-lg shadow-xl",
            "z-50"
          )}
          role="menu"
        >
          {/* User Info */}
          <div className="px-4 py-2 border-b border-norse-stone/20">
            <p className="text-sm font-medium text-norse-gold truncate">
              {session.user.name}
            </p>
            <p className="text-xs text-norse-stone truncate">
              {session.user.email}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-2 text-sm text-norse-stone",
                "hover:bg-norse-gold/10 hover:text-norse-gold transition-colors"
              )}
              role="menuitem"
            >
              <User size={16} />
              <span>Profile</span>
            </Link>

            <Link
              href="/profile#favorites"
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-2 text-sm text-norse-stone",
                "hover:bg-norse-gold/10 hover:text-norse-gold transition-colors"
              )}
              role="menuitem"
            >
              <Heart size={16} />
              <span>My Favorites</span>
            </Link>
          </div>

          {/* Sign Out */}
          <div className="border-t border-norse-stone/20 pt-1">
            {signOutError && (
              <div className="px-4 py-2 text-xs text-amber-500 flex items-center gap-2">
                <WifiOff size={14} />
                <span>{signOutError}</span>
              </div>
            )}
            <button
              onClick={async () => {
                if (!navigator.onLine) {
                  setSignOutError("Connect to sign out");
                  return;
                }
                setSignOutError(null);
                setIsOpen(false);
                try {
                  await signOut({ callbackUrl: "/" });
                } catch (error) {
                  setSignOutError("Unable to sign out");
                  setIsOpen(true);
                }
              }}
              className={cn(
                "flex items-center gap-3 w-full px-4 py-2 text-sm text-norse-stone",
                "hover:bg-norse-fire/10 hover:text-norse-fire transition-colors",
                !navigator.onLine && "opacity-50"
              )}
              role="menuitem"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
