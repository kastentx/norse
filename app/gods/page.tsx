"use client";

import { useEffect, useState } from "react";
import { God } from "@/types/god";
import { GodGrid } from "@/components/gods/GodGrid";
import { GodDetailPanel } from "@/components/gods/GodDetailPanel";
import { GodSkeleton } from "@/components/gods/GodSkeleton";

export default function GodsPage() {
  const [gods, setGods] = useState<God[]>([]);
  const [selectedGod, setSelectedGod] = useState<God | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleGodClick = (god: God) => {
    setSelectedGod(god);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setTimeout(() => setSelectedGod(null), 300);
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
        <GodGrid gods={gods} onGodClick={handleGodClick} />
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
