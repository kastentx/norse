import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getGodById, getAllGods } from "@/lib/data/gods";
import { Button } from "@/components/ui/Button";

interface GodDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const gods = await getAllGods();
  return gods.map((god) => ({
    slug: god.id,
  }));
}

export async function generateMetadata({
  params,
}: GodDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const god = await getGodById(slug);

  if (!god) {
    return {
      title: "God Not Found",
    };
  }

  return {
    title: `${god.name} - ${god.title || god.type} | Norse Mythology`,
    description: god.description,
    openGraph: {
      title: `${god.name} - ${god.title || god.type}`,
      description: god.description,
      images: [
        {
          url: god.imageUrl,
          width: 800,
          height: 600,
          alt: god.name,
        },
      ],
    },
  };
}

export default async function GodDetailPage({ params }: GodDetailPageProps) {
  const { slug } = await params;
  const god = await getGodById(slug);

  if (!god) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <Link href="/gods">
            <Button variant="ghost" className="mb-4 text-white hover:text-gray-300">
              ← Back to Gods
            </Button>
          </Link>

          <div className="grid gap-8 md:grid-cols-[300px_1fr]">
            {/* God Image */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg border-2 border-norse-gold shadow-xl">
              <Image
                src={god.imageUrl}
                alt={god.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 300px"
              />
            </div>

            {/* God Header Info */}
            <div className="flex flex-col justify-center space-y-4">
              <div>
                <h1 className="text-5xl font-bold mb-2">{god.name}</h1>
                {god.title && (
                  <p className="text-2xl text-norse-gold">{god.title}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-norse-gold/20 px-3 py-1 text-sm font-medium text-norse-gold border border-norse-gold/30">
                  {god.type}
                </span>
                {god.domain.map((domain) => (
                  <span
                    key={domain}
                    className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white border border-white/20"
                  >
                    {domain}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300">Popularity:</span>
                <div className="flex-1 max-w-xs">
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-norse-gold to-norse-bronze"
                      style={{ width: `${god.metadata.popularity}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-norse-gold">
                  {god.metadata.popularity}/100
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Description */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">About</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {god.description}
            </p>
          </section>

          {/* Attributes */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Characteristics
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Appearance */}
              <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Appearance
                </h3>
                <p className="text-gray-700">{god.attributes.appearance}</p>
              </div>

              {/* Personality */}
              <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Personality
                </h3>
                <p className="text-gray-700">{god.attributes.personality}</p>
              </div>
            </div>
          </section>

          {/* Powers */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Powers</h2>
            <div className="bg-gradient-to-br from-norse-rune/10 to-norse-ice/10 rounded-lg border-2 border-norse-rune/30 p-6">
              <ul className="space-y-2">
                {god.attributes.powers.map((power) => (
                  <li
                    key={power}
                    className="flex items-start gap-3 text-gray-700"
                  >
                    <span className="text-norse-rune text-lg">✦</span>
                    <span className="flex-1 capitalize">{power}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Family */}
          {god.family && Object.keys(god.family).length > 0 && (
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Family</h2>
              <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
                <dl className="space-y-4">
                  {god.family.spouse && (
                    <div>
                      <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Spouse
                      </dt>
                      <dd className="mt-1 text-lg text-gray-900 capitalize">
                        {god.family.spouse}
                      </dd>
                    </div>
                  )}
                  {god.family.parents && god.family.parents.length > 0 && (
                    <div>
                      <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Parents
                      </dt>
                      <dd className="mt-1 text-lg text-gray-900">
                        {god.family.parents.map((parent, idx) => (
                          <span key={parent}>
                            <span className="capitalize">{parent}</span>
                            {idx < (god.family?.parents?.length ?? 0) - 1 && ", "}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                  {god.family.siblings && god.family.siblings.length > 0 && (
                    <div>
                      <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Siblings
                      </dt>
                      <dd className="mt-1 text-lg text-gray-900">
                        {god.family.siblings.map((sibling, idx) => (
                          <span key={sibling}>
                            <span className="capitalize">{sibling}</span>
                            {idx < (god.family?.siblings?.length ?? 0) - 1 && ", "}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                  {god.family.children && god.family.children.length > 0 && (
                    <div>
                      <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Children
                      </dt>
                      <dd className="mt-1 text-lg text-gray-900">
                        {god.family.children.map((child, idx) => (
                          <span key={child}>
                            <span className="capitalize">{child}</span>
                            {idx < (god.family?.children?.length ?? 0) - 1 && ", "}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </section>
          )}

          {/* Symbols */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Sacred Symbols
            </h2>
            <div className="flex flex-wrap gap-3">
              {god.symbols.map((symbol) => (
                <span
                  key={symbol}
                  className="inline-flex items-center rounded-lg bg-gradient-to-br from-norse-gold/20 to-norse-bronze/20 border-2 border-norse-gold/40 px-4 py-2 text-base font-medium text-gray-900 capitalize"
                >
                  {symbol.replace(/-/g, " ")}
                </span>
              ))}
            </div>
          </section>

          {/* Stories */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Featured In
            </h2>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-gray-300 p-6">
              <p className="text-gray-600 mb-3">
                {god.name} appears in {god.stories.length} mythological{" "}
                {god.stories.length === 1 ? "story" : "stories"}:
              </p>
              <ul className="space-y-2">
                {god.stories.map((story) => (
                  <li key={story} className="flex items-center gap-2">
                    <span className="text-norse-gold">📖</span>
                    <span className="text-gray-900 capitalize">
                      {story.replace(/-/g, " ")}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Back Button */}
          <div className="flex justify-center pt-8">
            <Link href="/gods">
              <Button variant="primary" size="lg">
                ← Back to All Gods
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
