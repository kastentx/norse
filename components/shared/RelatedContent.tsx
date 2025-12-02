"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/animations/hooks";
import { ArrowRight } from "lucide-react";

interface RelatedItem {
  id: string;
  name?: string;
  title?: string;
  imageUrl: string;
  type: "god" | "story" | "realm";
}

interface RelatedContentProps {
  items: RelatedItem[];
  title: string;
  emptyMessage?: string;
}

export function RelatedContent({
  items,
  title,
  emptyMessage = "No related content found",
}: RelatedContentProps) {
  const prefersReducedMotion = useReducedMotion();

  if (!items || items.length === 0) {
    return null;
  }

  const getItemHref = (item: RelatedItem) => {
    switch (item.type) {
      case "god":
        return `/gods/${item.id}`;
      case "story":
        return `/stories/${item.id}`;
      case "realm":
        return `/realms#${item.id}`;
      default:
        return "#";
    }
  };

  const getItemName = (item: RelatedItem) => {
    return item.name || item.title || item.id;
  };

  const formatItemType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <section>
      <h2 className="mb-6 font-norse text-3xl text-norse-gold">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link
              href={getItemHref(item)}
              className="group block overflow-hidden rounded-lg border border-norse-gold/20 bg-norse-gray-900/50 transition-all hover:border-norse-gold/40 hover:bg-norse-gray-900/70"
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={getItemName(item)}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-norse-gray-900 via-transparent to-transparent" />
                
                {/* Type Badge */}
                <div className="absolute right-2 top-2">
                  <span className="rounded-full bg-norse-gold/90 px-2 py-1 text-xs font-medium text-norse-night backdrop-blur-sm">
                    {formatItemType(item.type)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="mb-2 font-norse text-lg text-norse-gold group-hover:text-norse-gold/80 transition-colors">
                  {getItemName(item)}
                </h3>
                <div className="flex items-center text-sm text-norse-gray-400 group-hover:text-norse-gold transition-colors">
                  <span>Explore</span>
                  <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
