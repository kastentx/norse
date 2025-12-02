/**
 * Data Loading Abstraction Layer
 * 
 * This module provides an abstraction layer for data loading that can be
 * easily migrated from static JSON files to a CMS (Contentful/Sanity) in the future.
 * 
 * Current implementation: Static JSON files
 * Future implementation: CMS API calls with same interfaces
 */

export interface DataSource {
  name: string;
  type: "static" | "cms";
}

export interface DataLoader<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  search(query: string): Promise<T[]>;
}

/**
 * Factory function to create data loaders
 * In the future, this can be modified to return CMS-based loaders
 */
export function createDataLoader<T>(
  dataType: string,
  validator: (data: unknown) => T
): DataLoader<T> {
  // Current implementation returns static JSON loader
  // Future: return CMS loader based on environment variable
  return {
    async getAll() {
      // To be implemented by specific data loaders
      return [];
    },
    async getById(id: string) {
      // To be implemented by specific data loaders
      return null;
    },
    async search(query: string) {
      // To be implemented by specific data loaders
      return [];
    },
  };
}

/**
 * CMS Integration Interface (for future use)
 */
export interface CMSConfig {
  provider: "contentful" | "sanity";
  spaceId?: string;
  accessToken?: string;
  projectId?: string;
  dataset?: string;
}

export const dataSource: DataSource = {
  name: "Static JSON",
  type: "static",
};
