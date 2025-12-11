"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { God } from "@/types/god";
import { GodSkeleton } from "@/components/gods/GodSkeleton";
import { GodsErrorBoundary } from "@/components/gods/GodsErrorBoundary";

// Dynamic imports for god components to improve initial load time
const GodGrid = dynamic(() => import("@/components/gods/GodGrid").then((mod) => ({ default: mod.GodGrid })), {
  loading: () => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <GodSkeleton key={i} />
      ))}
    </div>
  ),
});

const GodDetailPanel = dynamic(() => import("@/components/gods/GodDetailPanel").then((mod) => ({ default: mod.GodDetailPanel })), {
  ssr: false,
});

function GodsPageContent() {
  const [gods, setGods] = useState<God[]>([]);
  const [selectedGod, setSelectedGod] = useState<God | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [favoriteGodIds, setFavoriteGodIds] = useState<string[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    async function loadGods() {
      try {
        const response = await fetch("/api/gods");
        const data = await response.json();
        setGods(data);
      } catch (error) {
        console.error("Failed to load gods:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadGods();
  }, []);

  // Fetch favorites when session changes
  useEffect(() => {
    async function loadFavorites() {
      if (!session?.user) {
        setFavoriteGodIds([]);
        return;
      }
      
      try {
        const response = await fetch("/api/user/favorites");
        if (response.ok) {
          const data = await response.json();
          setFavoriteGodIds(data.favoriteGods || []);
        }
      } catch (error) {
        console.error("Failed to load favorites:", error);
      }
    }

    loadFavorites();
  }, [session]);

  const handleGodClick = (god: God) => {
    setSelectedGod(god);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setTimeout(() => setSelectedGod(null), 300);
  };

  const handleFavoriteToggle = (godId: string, isFavorite: boolean) => {
    setFavoriteGodIds((prev) =>
      isFavorite
        ? [...prev, godId]
        : prev.filter((id) => id !== godId)
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-norse-gold">
          Norse Gods & Deities
        </h1>
        <p className="text-lg text-norse-stone max-w-2xl mx-auto">
          Explore the pantheon of Norse mythology. Click any god to learn more
          about their powers, domains, and legends.
        </p>
      </div>

      {/* Grid */}
      {isLoading ? (
        <GodSkeleton />
      ) : (
        <GodGrid 
          gods={gods} 
          onGodClick={handleGodClick} 
          favoriteGodIds={favoriteGodIds}
          onFavoriteToggle={handleFavoriteToggle}
        />
      )}

      {/* Detail Panel */}
      <GodDetailPanel
        god={selectedGod}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
      />
    </div>
  );
}

export default function GodsPage() {
  return (
    <GodsErrorBoundary>
      <GodsPageContent />
    </GodsErrorBoundary>
  );
}
