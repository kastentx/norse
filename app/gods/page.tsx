import { getAllGods } from "@/lib/data/gods";
import Link from "next/link";

export default async function GodsPage() {
  const gods = await getAllGods();

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Norse Gods</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gods.map((god) => (
            <Link
              key={god.id}
              href={`/gods/${god.id}`}
              className="block p-6 border border-gray-300 rounded-lg hover:border-norse-gold hover:shadow-lg transition-all"
            >
              <h2 className="text-2xl font-semibold mb-2">{god.name}</h2>
              {god.title && <p className="text-sm text-gray-600 mb-2">{god.title}</p>}
              <p className="text-gray-700 line-clamp-3">{god.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {god.domain.map((domain) => (
                  <span
                    key={domain}
                    className="px-2 py-1 bg-norse-gold bg-opacity-20 text-sm rounded"
                  >
                    {domain}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <Link href="/" className="text-norse-gold hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
