"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const pathname = usePathname();

  // Auto-generate breadcrumbs from pathname if items not provided
  const breadcrumbItems = items || generateBreadcrumbsFromPath(pathname);

  if (breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-sm">
        {/* Home */}
        <li>
          <Link
            href="/"
            className="flex items-center text-norse-gray-400 transition-colors hover:text-norse-gold"
            aria-label="Home"
          >
            <Home size={16} />
          </Link>
        </li>

        {/* Breadcrumb Items */}
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <li key={item.href} className="flex items-center gap-2">
              <ChevronRight
                size={16}
                className="text-norse-gray-600"
                aria-hidden="true"
              />
              {isLast ? (
                <span
                  className="font-medium text-norse-gold"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-norse-gray-400 transition-colors hover:text-norse-gold"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function generateBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
  const paths = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  let currentPath = "";
  for (let i = 0; i < paths.length; i++) {
    const segment = paths[i]!;
    currentPath += `/${segment}`;

    // Format label (capitalize and remove hyphens)
    const label = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    breadcrumbs.push({
      label,
      href: currentPath,
    });
  }

  return breadcrumbs;
}
