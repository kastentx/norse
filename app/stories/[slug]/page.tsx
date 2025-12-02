import { getStoryBySlug, getAllStories } from "@/lib/data/stories";
import { StoryHero } from "@/components/stories/StoryHero";
import { StorySection } from "@/components/stories/StorySection";
import { StoryNav } from "@/components/stories/StoryNav";
import { RelatedContent } from "@/components/shared/RelatedContent";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { getAllGods } from "@/lib/data/gods";
import { getAllRealms } from "@/lib/data/realms";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface StoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const stories = await getAllStories();
  return stories.map((story) => ({
    slug: story.slug,
  }));
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) {
    return {
      title: "Story Not Found",
    };
  }

  return {
    title: `${story.title} | Norse Mythology`,
    description: story.summary,
    openGraph: {
      title: story.title,
      description: story.summary,
      type: "article",
      images: [
        {
          url: story.imageUrl,
          width: 1920,
          height: 1080,
          alt: story.title,
        },
      ],
    },
  };
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  // Extract navigation sections (text sections with headings only)
  const navSections = story.content
    .filter((section) => section.type === "text" && section.heading)
    .map((section) => ({
      id: section.id || "",
      title: section.heading || "",
    }));

  // Fetch related content
  const allGods = await getAllGods();
  const relatedGods = allGods
    .filter((god) => story.characters.includes(god.id))
    .map((god) => ({
      id: god.id,
      name: god.name,
      imageUrl: god.imageUrl,
      type: "god" as const,
    }));

  const allRealms = getAllRealms();
  const relatedRealms = allRealms
    .filter((realm) => story.realms.includes(realm.id))
    .map((realm) => ({
      id: realm.id,
      name: realm.name,
      imageUrl: realm.imageUrl,
      type: "realm" as const,
    }));

  return (
    <main className="relative bg-white dark:bg-gray-950">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 pt-6">
        <Breadcrumbs
          items={[
            { label: "Stories", href: "/stories" },
            { label: story.title, href: `/stories/${story.slug}` },
          ]}
        />
      </div>

      {/* Hero Section with Parallax */}
      <StoryHero
        title={story.title}
        summary={story.summary}
        imageUrl={story.imageUrl}
        difficulty={story.difficulty}
        readingTime={story.readingTime}
        themes={story.themes}
      />

      {/* Story Navigation (left sidebar on desktop) */}
      <StoryNav sections={navSections} showBackButton={true} />

      {/* Story Content */}
      <article className="relative">
        {story.content.map((section) => (
          <StorySection
            key={section.id}
            id={section.id || ""}
            type={section.type}
            title={section.heading}
            content={section.text}
            text={section.text}
            imageUrl={section.imageUrl}
            parallaxIntensity={section.parallaxIntensity}
          />
        ))}
      </article>

      {/* Related Content Sections */}
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-16">
        {/* Related Characters */}
        {relatedGods.length > 0 && (
          <RelatedContent
            items={relatedGods}
            title="Characters in This Story"
          />
        )}

        {/* Related Realms */}
        {relatedRealms.length > 0 && (
          <RelatedContent
            items={relatedRealms}
            title="Realms Featured in This Story"
          />
        )}
      </div>
    </main>
  );
}
