import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-norse-night">
          Norse Mythology Knowledge Base
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Explore the gods, stories, and realms of Norse mythology
        </p>
        <nav className="flex flex-col gap-4">
          <Link
            href="/gods"
            className="block p-6 border border-gray-300 rounded-lg hover:border-norse-gold transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">Browse Gods →</h2>
            <p className="text-gray-600">Discover Norse deities and their domains</p>
          </Link>
          <Link
            href="/stories"
            className="block p-6 border border-gray-300 rounded-lg hover:border-norse-gold transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">Read Stories →</h2>
            <p className="text-gray-600">Explore mythology tales and legends</p>
          </Link>
          <Link
            href="/realms"
            className="block p-6 border border-gray-300 rounded-lg hover:border-norse-gold transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">Nine Realms →</h2>
            <p className="text-gray-600">Navigate the cosmic tree Yggdrasil</p>
          </Link>
          <Link
            href="/search"
            className="block p-6 border border-gray-300 rounded-lg hover:border-norse-gold transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">Search →</h2>
            <p className="text-gray-600">Find gods, stories, and realms</p>
          </Link>
        </nav>
      </div>
    </main>
  );
}
