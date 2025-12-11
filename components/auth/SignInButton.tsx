"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { LogIn, LogOut } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface SignInButtonProps {
  className?: string;
  showIcon?: boolean;
}

/**
 * Sign In/Out Button
 * 
 * Shows "Sign In" when logged out, "Sign Out" when logged in.
 * Uses GitHub OAuth by default.
 */
export function SignInButton({ className, showIcon = true }: SignInButtonProps) {
  const { data: session, status } = useSession();

  // Loading state
  if (status === "loading") {
    return (
      <div
        className={cn(
          "h-9 w-20 animate-pulse rounded-lg bg-norse-stone/20",
          className
        )}
        aria-label="Loading authentication status"
      />
    );
  }

  // Signed in - show sign out button
  if (session) {
    return (
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium",
          "text-norse-stone hover:text-norse-gold",
          "transition-colors rounded-lg",
          "hover:bg-norse-gold/10",
          "focus:outline-none focus:ring-2 focus:ring-norse-gold focus:ring-offset-2 focus:ring-offset-norse-night",
          className
        )}
      >
        {showIcon && <LogOut size={16} />}
        <span>Sign Out</span>
      </button>
    );
  }

  // Signed out - show sign in button
  return (
    <button
      onClick={() => signIn("github")}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium",
        "bg-norse-gold text-norse-night",
        "rounded-lg transition-colors",
        "hover:bg-norse-gold/90",
        "focus:outline-none focus:ring-2 focus:ring-norse-gold focus:ring-offset-2 focus:ring-offset-norse-night",
        className
      )}
    >
      {showIcon && <LogIn size={16} />}
      <span>Sign In</span>
    </button>
  );
}
