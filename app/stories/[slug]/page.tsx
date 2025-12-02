import { getStoryBySlug, getAllStories } from "@/lib/data/stories";
import { StoryHero } from "@/components/stories/StoryHero";
import { StorySection } from "@/components/stories/StorySection";
import { StoryNav } from "@/components/stories/StoryNav";
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

  return (
    <main className="relative bg-white dark:bg-gray-950">
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

      {/* Related Stories Section */}
      {story.relatedStories && story.relatedStories.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 py-16 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            Related Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {story.relatedStories.map((relatedSlug) => (
              <div
                key={relatedSlug}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-norse-gold dark:hover:border-norse-gold transition-colors"
              >
                {/* Related story cards will be implemented when we have the data */}
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {relatedSlug}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
