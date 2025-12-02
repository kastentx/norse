// Export all type definitions
export * from "./god";
export * from "./story";
export * from "./realm";
export * from "./symbol";

// Search and filter types
export interface SearchResults {
  gods: import("./god").God[];
  stories: import("./story").Story[];
  realms: import("./realm").Realm[];
  totalResults: number;
}

export interface ContentFilters {
  godTypes?: import("./god").GodType[];
  storyThemes?: string[];
  realmLevels?: import("./realm").RealmLevel[];
  difficulty?: import("./story").StoryDifficulty;
  featured?: boolean;
}

export interface FilteredContent {
  gods: import("./god").God[];
  stories: import("./story").Story[];
  realms: import("./realm").Realm[];
}
