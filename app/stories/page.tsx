import { getAllStories } from "@/lib/data/stories";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Norse Mythology Stories | Tales of Gods, Giants, and Heroes",
  description:
    "Explore epic Norse mythology stories including Ragnarök, Yggdrasil, and more. Immersive tales with parallax effects and stunning visuals.",
  openGraph: {
    title: "Norse Mythology Stories",
    description:
      "Epic tales from Norse mythology brought to life with immersive storytelling.",
    type: "website",
  },
};

const difficultyColors = {
  beginner: "bg-green-500/10 text-green-600 border-green-500/20",
  intermediate: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  advanced: "bg-red-500/10 text-red-600 border-red-500/20",
};

const difficultyLabels = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default async function StoriesPage() {
  const stories = await getAllStories();

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
          Norse Mythology Stories
        </h1>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
          Immerse yourself in the epic tales of Norse mythology. Experience stories with
          parallax scrolling effects and animated illustrations that bring ancient legends to life.
        </p>
      </header>

      {/* Story Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stories.map((story) => (
          <Link
            key={story.id}
            href={`/stories/${story.slug}`}
            className="group block rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
          >
            {/* Story Image */}
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={story.imageUrl}
                alt={story.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span
                  className={`px-3 py-1 rounded-full border text-xs font-medium backdrop-blur-sm ${
                    difficultyColors[story.difficulty]
                  }`}
                >
                  {difficultyLabels[story.difficulty]}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs">
                  {story.readingTime} min
                </span>
              </div>
            </div>

            {/* Story Info */}
            <div className="p-6 bg-white dark:bg-gray-900">
              <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-norse-gold transition-colors">
                {story.title}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                {story.summary}
              </p>

              {/* Themes */}
              <div className="flex flex-wrap gap-2">
                {story.themes.slice(0, 3).map((theme) => (
                  <span
                    key={theme}
                    className="px-2 py-1 rounded bg-norse-gold/10 text-norse-gold text-xs capitalize"
                  >
                    {theme.replace("-", " ")}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {stories.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📖</div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            No Stories Yet
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            New mythology stories will be added soon.
          </p>
        </div>
      )}
    </div>
  );
}
