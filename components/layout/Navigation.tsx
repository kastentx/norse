"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const navigationItems = [
  { name: "Gods", href: "/gods", icon: "⚡" },
  { name: "Stories", href: "/stories", icon: "📖" },
  { name: "Realms", href: "/realms", icon: "🌍" },
  { name: "Search", href: "/search", icon: "🔍" },
] as const;

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav
      className="flex flex-wrap gap-4 justify-center"
      role="navigation"
      aria-label="Main navigation"
    >
      {navigationItems.map((item) => {
        const isActive = pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex flex-col items-center gap-2 px-6 py-4 rounded-lg border-2 transition-all duration-300",
              "focus:outline-none focus:ring-2 focus:ring-norse-gold focus:ring-offset-2 focus:ring-offset-norse-night",
              isActive
                ? "border-norse-gold bg-norse-gold/10 text-norse-gold"
                : "border-norse-stone/30 hover:border-norse-gold/50 hover:bg-norse-gold/5 text-norse-stone hover:text-norse-gold"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <span className="text-4xl" role="img" aria-hidden="true">
              {item.icon}
            </span>
            <span className="text-lg font-semibold">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
