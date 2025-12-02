import { getGodById, getAllGods } from "@/lib/data/gods";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const gods = await getAllGods();
  return gods.map((god) => ({
    id: god.id,
  }));
}

export default async function GodDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const god = await getGodById(id);

  if (!god) {
    notFound();
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-2">{god.name}</h1>
        {god.title && <p className="text-2xl text-gray-600 mb-6">{god.title}</p>}

        <div className="mb-6">
          <span className="px-3 py-1 bg-norse-bronze bg-opacity-30 rounded text-sm font-medium">
            {god.type}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {god.domain.map((domain) => (
            <span
              key={domain}
              className="px-3 py-1 bg-norse-gold bg-opacity-20 text-sm rounded capitalize"
            >
              {domain}
            </span>
          ))}
        </div>

        <div className="prose prose-lg max-w-none mb-8">
          <p className="text-lg leading-relaxed">{god.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="border border-gray-300 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3">Appearance</h2>
            <p>{god.attributes.appearance}</p>
          </div>

          <div className="border border-gray-300 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3">Personality</h2>
            <p>{god.attributes.personality}</p>
          </div>
        </div>

        {god.attributes.powers.length > 0 && (
          <div className="border border-gray-300 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-3">Powers & Abilities</h2>
            <ul className="list-disc list-inside space-y-1">
              {god.attributes.powers.map((power, index) => (
                <li key={index} className="capitalize">
                  {power}
                </li>
              ))}
            </ul>
          </div>
        )}

        {god.family && (
          <div className="border border-gray-300 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-3">Family</h2>
            {god.family.spouse && (
              <p>
                <strong>Spouse:</strong> {god.family.spouse}
              </p>
            )}
            {god.family.children && god.family.children.length > 0 && (
              <p>
                <strong>Children:</strong> {god.family.children.join(", ")}
              </p>
            )}
            {god.family.parents && god.family.parents.length > 0 && (
              <p>
                <strong>Parents:</strong> {god.family.parents.join(", ")}
              </p>
            )}
            {god.family.siblings && god.family.siblings.length > 0 && (
              <p>
                <strong>Siblings:</strong> {god.family.siblings.join(", ")}
              </p>
            )}
          </div>
        )}

        <div className="mt-8">
          <Link href="/gods" className="text-norse-gold hover:underline">
            ← Back to All Gods
          </Link>
        </div>
      </div>
    </main>
  );
}
