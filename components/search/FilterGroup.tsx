"use client";

import { useState } from "react";
import { useReducedMotion } from "@/lib/animations/hooks";
import { cn } from "@/lib/utils/cn";
import type { GodType } from "@/types/god";
import type { StoryDifficulty } from "@/types/story";
import type { RealmLevel } from "@/types/realm";

interface FilterGroupProps {
  filters: {
    godTypes?: GodType[];
    storyDifficulty?: StoryDifficulty[];
    realmLevels?: RealmLevel[];
  };
  onChange: (filters: {
    godTypes?: GodType[];
    storyDifficulty?: StoryDifficulty[];
    realmLevels?: RealmLevel[];
  }) => void;
}

type FilterSection = "gods" | "stories" | "realms";

export function FilterGroup({ filters, onChange }: FilterGroupProps) {
  const prefersReducedMotion = useReducedMotion();
  const [expandedSections, setExpandedSections] = useState<Set<FilterSection>>(
    new Set(["gods", "stories", "realms"])
  );

  const toggleSection = (section: FilterSection) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const handleGodTypeChange = (type: GodType) => {
    const currentTypes = filters.godTypes || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter((t) => t !== type)
      : [...currentTypes, type];

    onChange({
      ...filters,
      godTypes: newTypes.length > 0 ? newTypes : undefined,
    });
  };

  const handleDifficultyChange = (difficulty: StoryDifficulty) => {
    const currentDifficulties = filters.storyDifficulty || [];
    const newDifficulties = currentDifficulties.includes(difficulty)
      ? currentDifficulties.filter((d) => d !== difficulty)
      : [...currentDifficulties, difficulty];

    onChange({
      ...filters,
      storyDifficulty:
        newDifficulties.length > 0 ? newDifficulties : undefined,
    });
  };

  const handleRealmLevelChange = (level: RealmLevel) => {
    const currentLevels = filters.realmLevels || [];
    const newLevels = currentLevels.includes(level)
      ? currentLevels.filter((l) => l !== level)
      : [...currentLevels, level];

    onChange({
      ...filters,
      realmLevels: newLevels.length > 0 ? newLevels : undefined,
    });
  };

  const godTypes: GodType[] = ["Aesir", "Vanir", "Jotun", "Other"];
  const storyDifficulties: StoryDifficulty[] = [
    "beginner",
    "intermediate",
    "advanced",
  ];
  const realmLevels: RealmLevel[] = ["upper", "middle", "lower"];

  return (
    <div className="rounded-lg border-2 border-gray-300 bg-white p-4">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Filters</h2>

      {/* God Types */}
      <FilterSection
        title="God Types"
        isExpanded={expandedSections.has("gods")}
        onToggle={() => toggleSection("gods")}
        prefersReducedMotion={prefersReducedMotion}
      >
        <div className="space-y-2">
          {godTypes.map((type) => (
            <FilterCheckbox
              key={type}
              label={type}
              checked={filters.godTypes?.includes(type) || false}
              onChange={() => handleGodTypeChange(type)}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </div>
      </FilterSection>

      {/* Story Difficulty */}
      <FilterSection
        title="Story Difficulty"
        isExpanded={expandedSections.has("stories")}
        onToggle={() => toggleSection("stories")}
        prefersReducedMotion={prefersReducedMotion}
      >
        <div className="space-y-2">
          {storyDifficulties.map((difficulty) => (
            <FilterCheckbox
              key={difficulty}
              label={difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              checked={filters.storyDifficulty?.includes(difficulty) || false}
              onChange={() => handleDifficultyChange(difficulty)}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </div>
      </FilterSection>

      {/* Realm Levels */}
      <FilterSection
        title="Realm Levels"
        isExpanded={expandedSections.has("realms")}
        onToggle={() => toggleSection("realms")}
        prefersReducedMotion={prefersReducedMotion}
      >
        <div className="space-y-2">
          {realmLevels.map((level) => (
            <FilterCheckbox
              key={level}
              label={level.charAt(0).toUpperCase() + level.slice(1)}
              checked={filters.realmLevels?.includes(level) || false}
              onChange={() => handleRealmLevelChange(level)}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </div>
      </FilterSection>
    </div>
  );
}

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  prefersReducedMotion: boolean;
}

function FilterSection({
  title,
  children,
  isExpanded,
  onToggle,
  prefersReducedMotion,
}: FilterSectionProps) {
  return (
    <div className="border-b border-gray-200 py-4 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={isExpanded}
      >
        <span className="font-medium text-gray-900">{title}</span>
        <svg
          className={cn(
            "h-5 w-5 text-gray-500",
            !prefersReducedMotion && "transition-transform duration-200",
            isExpanded && "rotate-180"
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isExpanded && <div className="mt-3">{children}</div>}
    </div>
  );
}

interface FilterCheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  prefersReducedMotion: boolean;
}

function FilterCheckbox({
  label,
  checked,
  onChange,
  prefersReducedMotion,
}: FilterCheckboxProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3 py-1">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={cn(
          "h-4 w-4 rounded border-gray-300 text-norse-gold focus:ring-2 focus:ring-norse-gold/20",
          !prefersReducedMotion && "transition-colors duration-150"
        )}
      />
      <span className="select-none text-sm text-gray-700">{label}</span>
    </label>
  );
}
