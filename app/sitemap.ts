import { MetadataRoute } from "next";
import { getAllGods } from "@/lib/data/gods";
import { getAllStories } from "@/lib/data/stories";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://norse-mythology.app";

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/gods`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/stories`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/realms`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];

  // God pages
  const gods = await getAllGods();
  const godPages = gods.map((god) => ({
    url: `${baseUrl}/gods/${god.id}`,
    lastModified: new Date(god.metadata?.lastUpdated || new Date()),
    changeFrequency: "monthly" as const,
    priority: god.metadata?.featured ? 0.8 : 0.7,
  }));

  // Story pages
  const stories = await getAllStories();
  const storyPages = stories.map((story) => ({
    url: `${baseUrl}/stories/${story.slug}`,
    lastModified: new Date(story.metadata?.lastUpdated || new Date()),
    changeFrequency: "monthly" as const,
    priority: story.metadata?.featured ? 0.8 : 0.7,
  }));

  return [...staticPages, ...godPages, ...storyPages];
}
