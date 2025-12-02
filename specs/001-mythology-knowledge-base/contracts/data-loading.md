# API Contracts: Interactive Norse Mythology Knowledge Base

**Feature**: 001-mythology-knowledge-base  
**Date**: 2025-12-02  
**Purpose**: Define data contracts for content loading

## Overview

This feature uses **Static Data Loading** (not REST/GraphQL APIs). All content is loaded at build time from JSON files and embedded in the application. Future iterations may add CMS API endpoints.

## Data Loading Functions

These are the TypeScript functions that load and validate content. They serve as "contracts" between data files and application components.

### GET /lib/data/gods.ts

#### `getAllGods(): Promise<God[]>`

Loads all god entities from `/data/gods/*.json`.

**Returns**:

```typescript
Promise<God[]>
```

**Behavior**:

- Reads all JSON files in `/data/gods/` directory
- Validates each file against God Zod schema
- Throws validation error if any file is invalid
- Returns array sorted by `metadata.popularity` descending

**Example Response**:

```json
[
  {
    "id": "odin",
    "name": "Odin",
    "type": "Aesir",
    "domain": ["wisdom", "war", "poetry", "death"],
    "title": "All-Father",
    "description": "Odin is the chief god in Norse mythology...",
    "symbols": ["gungnir", "sleipnir", "huginn-muninn"],
    "realm": "asgard",
    "family": {
      "spouse": "frigg",
      "children": ["thor", "baldur", "hodr"]
    },
    "attributes": {
      "appearance": "One-eyed elder with long grey beard...",
      "personality": "Wise, cunning, knowledge-seeking...",
      "powers": ["shapeshifting", "rune magic", "prophecy"]
    },
    "stories": ["ragnarok", "creation-of-world", "odins-sacrifice"],
    "imageUrl": "/images/gods/odin.webp",
    "iconUrl": "/images/gods/icons/odin.svg",
    "metadata": {
      "featured": true,
      "popularity": 100,
      "lastUpdated": "2025-12-02T00:00:00Z"
    }
  }
]
```

#### `getGodById(id: string): Promise<God | null>`

Loads a single god by ID.

**Parameters**:

- `id` (string): God identifier (e.g., "thor")

**Returns**:

```typescript
Promise<God | null>
```

**Behavior**:

- Reads `/data/gods/{id}.json`
- Validates against God schema
- Returns null if file doesn't exist
- Throws validation error if file is invalid

#### `getGodsByType(type: GodType): Promise<God[]>`

Filters gods by type classification.

**Parameters**:

- `type` (GodType): "Aesir" | "Vanir" | "Jotun" | "Other"

**Returns**:

```typescript
Promise<God[]>
```

#### `searchGods(query: string): Promise<God[]>`

Searches gods by name, domain, or description.

**Parameters**:

- `query` (string): Search term

**Returns**:

```typescript
Promise<God[]>
```

**Behavior**:

- Case-insensitive search
- Matches against `name`, `domain[]`, `description`, `title`
- Returns results sorted by relevance (exact match → partial match)

---

### GET /lib/data/stories.ts

#### `getAllStories(): Promise<Story[]>`

Loads all mythology stories from `/data/stories/*.json`.

**Returns**:

```typescript
Promise<Story[]>
```

**Behavior**:

- Reads all JSON files in `/data/stories/`
- Validates against Story schema
- Returns array sorted by `metadata.featured` then `publishedDate` descending

**Example Response**:

```json
[
  {
    "id": "ragnarok",
    "title": "Ragnarök: The Twilight of the Gods",
    "slug": "ragnarok",
    "summary": "The apocalyptic battle that brings about the end of the world...",
    "content": [
      {
        "type": "text",
        "heading": "The Beginning of the End",
        "text": "When the great winter Fimbulvetr arrives..."
      },
      {
        "type": "illustration",
        "imageUrl": "/images/stories/ragnarok-1.webp",
        "parallaxIntensity": 0.5
      }
    ],
    "themes": ["prophecy", "apocalypse", "fate"],
    "characters": ["odin", "thor", "loki", "fenrir"],
    "realms": ["asgard", "midgard", "helheim"],
    "readingTime": 12,
    "difficulty": "intermediate",
    "relatedStories": ["creation-of-world", "death-of-baldur"],
    "imageUrl": "/images/stories/ragnarok-hero.webp",
    "metadata": {
      "featured": true,
      "publishedDate": "2025-12-01T00:00:00Z",
      "lastUpdated": "2025-12-02T00:00:00Z"
    }
  }
]
```

#### `getStoryBySlug(slug: string): Promise<Story | null>`

Loads a single story by URL slug.

**Parameters**:

- `slug` (string): Story slug (e.g., "ragnarok")

**Returns**:

```typescript
Promise<Story | null>
```

#### `getStoriesByCharacter(godId: string): Promise<Story[]>`

Gets all stories featuring a specific god.

**Parameters**:

- `godId` (string): God identifier

**Returns**:

```typescript
Promise<Story[]>
```

#### `getStoriesByTheme(theme: string): Promise<Story[]>`

Filters stories by theme/category.

**Parameters**:

- `theme` (string): Theme identifier (e.g., "creation", "prophecy")

**Returns**:

```typescript
Promise<Story[]>
```

---

### GET /lib/data/realms.ts

#### `getAllRealms(): Promise<Realm[]>`

Loads all Nine Realms from `/data/realms/nine-realms.json`.

**Returns**:

```typescript
Promise<Realm[]>
```

**Behavior**:

- Reads single JSON file containing all 9 realms
- Validates against Realm schema
- Returns array ordered by `location.level` (upper → middle → lower)

**Example Response**:

```json
[
  {
    "id": "asgard",
    "name": "Asgard",
    "description": "The realm of the Aesir gods, located at the top of Yggdrasil...",
    "location": {
      "level": "upper",
      "coordinates": { "x": 50, "y": 10 }
    },
    "inhabitants": {
      "primaryTypes": ["Aesir"],
      "notableResidents": ["odin", "thor", "frigg", "baldur"]
    },
    "characteristics": {
      "environment": "Golden halls and vast meadows...",
      "culture": "Warrior society with emphasis on honor...",
      "significance": "Home of the Aesir and seat of power..."
    },
    "stories": ["ragnarok", "building-of-asgards-wall"],
    "connections": ["midgard", "vanaheim"],
    "imageUrl": "/images/realms/asgard.webp",
    "mapRegion": {
      "path": "M150,50 L250,50 L250,150 L150,150 Z",
      "color": "#FFD700",
      "glowColor": "#FFA500"
    }
  }
]
```

#### `getRealmById(id: string): Promise<Realm | null>`

Loads a single realm by ID.

**Parameters**:

- `id` (string): Realm identifier (e.g., "asgard")

**Returns**:

```typescript
Promise<Realm | null>
```

#### `getRealmsByLevel(level: RealmLevel): Promise<Realm[]>`

Filters realms by cosmological level.

**Parameters**:

- `level` (RealmLevel): "upper" | "middle" | "lower"

**Returns**:

```typescript
Promise<Realm[]>
```

---

### GET /lib/data/search.ts

#### `searchAll(query: string): Promise<SearchResults>`

Unified search across gods, stories, and realms.

**Parameters**:

- `query` (string): Search term

**Returns**:

```typescript
interface SearchResults {
  gods: God[];
  stories: Story[];
  realms: Realm[];
  totalResults: number;
}
```

**Behavior**:

- Searches all content types in parallel
- Case-insensitive matching
- Returns combined results object
- `totalResults` is sum of all arrays' lengths

**Example Response**:

```json
{
  "gods": [
    { "id": "thor", "name": "Thor", ... }
  ],
  "stories": [
    { "id": "thors-journey", "title": "Thor's Journey to Jotunheim", ... }
  ],
  "realms": [],
  "totalResults": 2
}
```

#### `filterContent(filters: ContentFilters): Promise<FilteredContent>`

Applies multiple filters to content.

**Parameters**:

```typescript
interface ContentFilters {
  godTypes?: GodType[];
  storyThemes?: string[];
  realmLevels?: RealmLevel[];
  difficulty?: StoryDifficulty;
  featured?: boolean;
}
```

**Returns**:

```typescript
interface FilteredContent {
  gods: God[];
  stories: Story[];
  realms: Realm[];
}
```

**Behavior**:

- Applies all active filters (AND logic within category, OR across categories)
- Empty filter object returns all content
- Filters applied client-side for instant results

## Zod Validation Schemas

All data loading functions use these schemas for runtime validation:

```typescript
// types/god.ts
import { z } from 'zod';

export const GodTypeSchema = z.enum(['Aesir', 'Vanir', 'Jotun', 'Other']);

export const GodSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(100),
  type: GodTypeSchema,
  domain: z.array(z.string()).min(1).max(5),
  title: z.string().optional(),
  description: z.string().min(200).max(2000),
  symbols: z.array(z.string()).min(1),
  realm: z.string(),
  family: z.object({
    parents: z.array(z.string()).optional(),
    siblings: z.array(z.string()).optional(),
    children: z.array(z.string()).optional(),
    spouse: z.string().optional(),
  }).optional(),
  attributes: z.object({
    appearance: z.string(),
    personality: z.string(),
    powers: z.array(z.string()),
  }),
  stories: z.array(z.string()).min(1),
  imageUrl: z.string().startsWith('/images/gods/'),
  iconUrl: z.string().startsWith('/images/gods/icons/').optional(),
  metadata: z.object({
    featured: z.boolean(),
    popularity: z.number().int().min(1).max(100),
    lastUpdated: z.string().datetime(),
  }),
});

export type God = z.infer<typeof GodSchema>;
export type GodType = z.infer<typeof GodTypeSchema>;
```

Similar schemas exist for Story, Realm, and Symbol entities (see `data-model.md` for full definitions).

## Error Handling

All data loading functions follow this error handling pattern:

```typescript
try {
  // Load and parse JSON
  // Validate with Zod
  return validatedData;
} catch (error) {
  if (error instanceof z.ZodError) {
    // Validation error - log details for debugging
    console.error('Data validation failed:', error.errors);
    throw new Error(`Invalid data format: ${error.message}`);
  }
  // File not found or other error
  throw error;
}
```

**Error Types**:

- `ZodError`: Data doesn't match schema (development time issue)
- `ENOENT`: File not found (return null for optional content)
- `SyntaxError`: Invalid JSON syntax (development time issue)

## Future API Endpoints (CMS Integration)

When migrating to a headless CMS:

- `GET /api/gods` - Replace `getAllGods()`
- `GET /api/gods/[id]` - Replace `getGodById()`
- `GET /api/stories` - Replace `getAllStories()`
- `GET /api/stories/[slug]` - Replace `getStoryBySlug()`
- `GET /api/realms` - Replace `getAllRealms()`
- `GET /api/search?q={query}` - Replace `searchAll()`

All endpoints will maintain the same TypeScript interfaces and Zod validation.
