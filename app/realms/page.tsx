"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { getAllRealms } from "@/lib/data/realms";
import { Realm } from "@/types/realm";
import { RealmsErrorBoundary } from "@/components/realms/RealmsErrorBoundary";

// Dynamic imports for heavy components to reduce initial bundle size
const RealmMap = dynamic(() => import("@/components/realms/RealmMap"), {
  loading: () => (
    <div className="flex h-[600px] items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-norse-gold border-t-transparent"></div>
        <p className="text-norse-gray-400">Loading Nine Realms Map...</p>
      </div>
    </div>
  ),
  ssr: false,
});

const RealmDetail = dynamic(() => import("@/components/realms/RealmDetail"), {
  ssr: false,
});

// Metadata is set in layout since this is a Client Component

function RealmsPageContent() {
  const realms = getAllRealms();
  const [selectedRealm, setSelectedRealm] = useState<Realm | null>(null);
  const { status } = useSession();
  const [favoriteRealmIds, setFavoriteRealmIds] = useState<string[]>([]);

  // Fetch user's favorite realms when authenticated
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/user/favorites")
        .then((res) => res.json())
        .then((data) => {
          if (data.favoriteRealms) {
            setFavoriteRealmIds(data.favoriteRealms);
          }
        })
        .catch((err) => console.error("Failed to fetch favorites:", err));
    }
  }, [status]);

  const handleFavoriteToggle = (realmId: string, isFavorite: boolean) => {
    setFavoriteRealmIds((prev) =>
      isFavorite
        ? [...prev, realmId]
        : prev.filter((id) => id !== realmId)
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-norse-gray-900 to-black py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 font-norse text-5xl text-norse-gold md:text-6xl lg:text-7xl">
            The Nine Realms
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-norse-gray-300 md:text-xl">
            Explore the cosmic tree Yggdrasil and discover the Nine Realms of
            Norse mythology, each connected by the World Tree
          </p>
        </div>

        {/* Map Container */}
        <div className="relative mx-auto max-w-7xl">
          <RealmMap
            realms={realms}
            selectedRealm={selectedRealm}
            onRealmSelect={setSelectedRealm}
          />
        </div>

        {/* Detail Panel */}
        {selectedRealm && (
          <RealmDetail
            realm={selectedRealm}
            onClose={() => setSelectedRealm(null)}
            initialFavorited={favoriteRealmIds.includes(selectedRealm.id)}
            onFavoriteToggle={handleFavoriteToggle}
          />
        )}

        {/* Realm Legend */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-norse-gold/20 bg-norse-gray-800/50 p-6 backdrop-blur-sm">
            <h3 className="mb-3 font-norse text-xl text-norse-gold">
              Upper Realms
            </h3>
            <ul className="space-y-2 text-norse-gray-300">
              {realms
                .filter((r) => r.location.level === "upper")
                .map((realm) => (
                  <li key={realm.id}>• {realm.name}</li>
                ))}
            </ul>
          </div>
          <div className="rounded-lg border border-norse-gold/20 bg-norse-gray-800/50 p-6 backdrop-blur-sm">
            <h3 className="mb-3 font-norse text-xl text-norse-gold">
              Middle Realms
            </h3>
            <ul className="space-y-2 text-norse-gray-300">
              {realms
                .filter((r) => r.location.level === "middle")
                .map((realm) => (
                  <li key={realm.id}>• {realm.name}</li>
                ))}
            </ul>
          </div>
          <div className="rounded-lg border border-norse-gold/20 bg-norse-gray-800/50 p-6 backdrop-blur-sm">
            <h3 className="mb-3 font-norse text-xl text-norse-gold">
              Lower Realms
            </h3>
            <ul className="space-y-2 text-norse-gray-300">
              {realms
                .filter((r) => r.location.level === "lower")
                .map((realm) => (
                  <li key={realm.id}>• {realm.name}</li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RealmsPage() {
  return (
    <RealmsErrorBoundary>
      <RealmsPageContent />
    </RealmsErrorBoundary>
  );
}
