# Data Model: Interactive Norse Mythology Knowledge Base

**Feature**: 001-mythology-knowledge-base  
**Date**: 2025-12-02  
**Purpose**: Define entities, relationships, and validation rules

## Entity Definitions

### God (Deity)

Represents a Norse god or deity with comprehensive information.

**Fields**:

- `id` (string, required): Unique identifier (kebab-case, e.g., "odin", "thor")
- `name` (string, required): Display name of the deity
- `type` (enum, required): Classification - "Aesir" | "Vanir" | "Jotun" | "Other"
- `domain` (string[], required): Areas of influence (e.g., ["war", "wisdom", "poetry"])
- `title` (string, optional): Epithet or title (e.g., "All-Father", "God of Thunder")
- `description` (string, required): Main biographical summary (200-500 words)
- `symbols` (Symbol[], required): Associated symbols/artifacts (min 1)
- `realm` (string, required): Primary realm of residence (reference to Realm.id)
- `family` (object, optional): Family relationships
  - `parents` (string[]): Parent deity IDs
  - `siblings` (string[]): Sibling deity IDs
  - `children` (string[]): Child deity IDs
  - `spouse` (string): Spouse deity ID
- `attributes` (object, required): Physical and character traits
  - `appearance` (string): Physical description
  - `personality` (string): Character traits
  - `powers` (string[]): Special abilities or powers
- `stories` (string[], required): Related story IDs (min 1)
- `imageUrl` (string, required): Path to deity portrait image
- `iconUrl` (string, optional): Small icon representation
- `metadata` (object, required):
  - `featured` (boolean): Whether to highlight on homepage
  - `popularity` (number): Sorting weight (1-100)
  - `lastUpdated` (ISO date string): Content update timestamp

**Validation Rules**:

- `id` must be unique, lowercase, alphanumeric with hyphens
- `type` must be one of defined enum values
- `domain` must have 1-5 entries
- `description` must be 200-2000 characters
- `symbols` must reference valid Symbol entities
- `realm` must reference existing Realm.id
- `family` IDs must reference existing God.id
- `imageUrl` must be valid relative path starting with `/images/gods/`
- `metadata.popularity` must be 1-100

**Relationships**:

- Many-to-One with Realm (many gods per realm)
- Many-to-Many with Story (gods appear in multiple stories)
- Many-to-Many with Symbol (gods associated with multiple symbols)
- Many-to-Many with God (family relationships)

---

### Story

Represents a Norse mythology narrative tale.

**Fields**:

- `id` (string, required): Unique identifier (kebab-case, e.g., "ragnarok")
- `title` (string, required): Story display title
- `slug` (string, required): URL-friendly version of title
- `summary` (string, required): Brief overview (100-200 words)
- `content` (Section[], required): Full story content in sections
  - `type` (enum): "text" | "quote" | "illustration"
  - `heading` (string, optional): Section title
  - `text` (string): Section content (markdown)
  - `imageUrl` (string, optional): Illustration path
  - `parallaxIntensity` (number, optional): Parallax effect strength (0-1)
- `themes` (string[], required): Story themes/categories (e.g., ["creation", "prophecy"])
- `characters` (string[], required): Involved deity IDs (min 1)
- `realms` (string[], required): Realms featured in story (min 1)
- `readingTime` (number, required): Estimated minutes to read
- `difficulty` (enum, required): "beginner" | "intermediate" | "advanced"
- `relatedStories` (string[], optional): IDs of related stories
- `imageUrl` (string, required): Hero image for story
- `metadata` (object, required):
  - `featured` (boolean): Display on stories homepage
  - `publishedDate` (ISO date): When story was added
  - `lastUpdated` (ISO date): Last content update

**Validation Rules**:

- `id` and `slug` must be unique
- `summary` must be 100-500 characters
- `content` must have 3-20 sections
- Each section with `type: "illustration"` must have `imageUrl`
- `themes` must have 1-5 entries
- `characters` must reference existing God.id
- `realms` must reference existing Realm.id
- `readingTime` must be 1-30 minutes
- `parallaxIntensity` must be 0-1

**Relationships**:

- Many-to-Many with God (stories feature multiple gods)
- Many-to-Many with Realm (stories span multiple realms)
- Many-to-Many with Story (related stories)

---

### Realm

Represents one of the Nine Realms in Norse cosmology.

**Fields**:

- `id` (string, required): Unique identifier (kebab-case, e.g., "asgard")
- `name` (string, required): Display name of realm
- `description` (string, required): Overview of the realm (200-400 words)
- `location` (object, required): Position in cosmology
  - `level` (enum): "upper" | "middle" | "lower" (Yggdrasil position)
  - `coordinates` (object): Map visualization position
    - `x` (number): Horizontal position (0-100)
    - `y` (number): Vertical position (0-100)
- `inhabitants` (object, required):
  - `primaryTypes` (string[]): Main inhabitant types (e.g., ["Aesir", "Vanir"])
  - `notableResidents` (string[]): God IDs who reside here
- `characteristics` (object, required):
  - `environment` (string): Physical environment description
  - `culture` (string): Social/cultural notes
  - `significance` (string): Role in mythology
- `stories` (string[], required): Story IDs featuring this realm
- `connections` (string[], optional): Realm IDs connected via Bifrost/paths
- `imageUrl` (string, required): Realm visualization image
- `mapRegion` (object, required): SVG map region definition
  - `path` (string): SVG path data for map shape
  - `color` (string): Primary color hex code
  - `glowColor` (string): Highlight glow color hex code

**Validation Rules**:

- `id` must be unique, one of nine canonical realms
- `description` must be 200-1000 characters
- `location.coordinates` x and y must be 0-100
- `inhabitants.notableResidents` must reference existing God.id
- `stories` must reference existing Story.id
- `connections` must reference existing Realm.id
- `mapRegion.color` must be valid hex color

**Relationships**:

- One-to-Many with God (many gods per realm)
- Many-to-Many with Story (realms appear in multiple stories)
- Many-to-Many with Realm (realm connections)

---

### Symbol

Represents mythological symbols, artifacts, or objects.

**Fields**:

- `id` (string, required): Unique identifier (kebab-case, e.g., "mjolnir")
- `name` (string, required): Display name
- `type` (enum, required): "weapon" | "artifact" | "creature" | "concept"
- `description` (string, required): Symbol explanation (100-300 words)
- `associatedGods` (string[], required): God IDs linked to this symbol (min 1)
- `significance` (string, required): Cultural/mythological importance
- `properties` (string[], optional): Special attributes or powers
- `stories` (string[], optional): Story IDs where symbol appears
- `imageUrl` (string, required): Symbol visualization
- `iconUrl` (string, required): Small icon version for UI

**Validation Rules**:

- `id` must be unique
- `type` must be one of defined enum values
- `description` must be 100-500 characters
- `associatedGods` must reference existing God.id
- `stories` must reference existing Story.id
- `imageUrl` and `iconUrl` must be valid paths

**Relationships**:

- Many-to-Many with God (symbols associated with multiple gods)
- Many-to-Many with Story (symbols appear in multiple stories)

## TypeScript Interfaces

```typescript
// types/god.ts
export type GodType = 'Aesir' | 'Vanir' | 'Jotun' | 'Other';

export interface God {
  id: string;
  name: string;
  type: GodType;
  domain: string[];
  title?: string;
  description: string;
  symbols: string[]; // Symbol IDs
  realm: string; // Realm ID
  family?: {
    parents?: string[];
    siblings?: string[];
    children?: string[];
    spouse?: string;
  };
  attributes: {
    appearance: string;
    personality: string;
    powers: string[];
  };
  stories: string[]; // Story IDs
  imageUrl: string;
  iconUrl?: string;
  metadata: {
    featured: boolean;
    popularity: number;
    lastUpdated: string;
  };
}

// types/story.ts
export type StoryDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type SectionType = 'text' | 'quote' | 'illustration';

export interface StorySection {
  type: SectionType;
  heading?: string;
  text: string;
  imageUrl?: string;
  parallaxIntensity?: number;
}

export interface Story {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: StorySection[];
  themes: string[];
  characters: string[]; // God IDs
  realms: string[]; // Realm IDs
  readingTime: number;
  difficulty: StoryDifficulty;
  relatedStories?: string[];
  imageUrl: string;
  metadata: {
    featured: boolean;
    publishedDate: string;
    lastUpdated: string;
  };
}

// types/realm.ts
export type RealmLevel = 'upper' | 'middle' | 'lower';

export interface Realm {
  id: string;
  name: string;
  description: string;
  location: {
    level: RealmLevel;
    coordinates: {
      x: number;
      y: number;
    };
  };
  inhabitants: {
    primaryTypes: string[];
    notableResidents: string[]; // God IDs
  };
  characteristics: {
    environment: string;
    culture: string;
    significance: string;
  };
  stories: string[]; // Story IDs
  connections?: string[]; // Realm IDs
  imageUrl: string;
  mapRegion: {
    path: string;
    color: string;
    glowColor: string;
  };
}

// types/symbol.ts
export type SymbolType = 'weapon' | 'artifact' | 'creature' | 'concept';

export interface Symbol {
  id: string;
  name: string;
  type: SymbolType;
  description: string;
  associatedGods: string[]; // God IDs
  significance: string;
  properties?: string[];
  stories?: string[]; // Story IDs
  imageUrl: string;
  iconUrl: string;
}
```

## State Transitions

### Search/Filter State

```
Initial → Typing → Debounced → Filtered → Displayed
  ↑                                         ↓
  └─────────────── Clear ──────────────────┘
```

**States**:

- **Initial**: No search query, all content visible
- **Typing**: User entering text, no filtering yet (debounced)
- **Debounced**: 300ms after last keystroke, trigger filter
- **Filtered**: Content filtered by query, animate transitions
- **Displayed**: Results shown with animation complete

### God Detail Panel State

```
Closed → Opening → Open → Closing → Closed
```

**States**:

- **Closed**: Panel off-screen (translateX: 100%)
- **Opening**: Slide animation in progress (300ms)
- **Open**: Panel fully visible, interactive
- **Closing**: Slide out animation (300ms)
- Focus returns to grid card after Closed

### Animation State (Reduced Motion)

```
Initial → Check Preference → [Full Animations | Reduced Animations]
```

**States**:

- Check `prefers-reduced-motion` on mount
- If enabled: Use instant transitions (duration: 0) or minimal fade
- If disabled: Use full Framer Motion animation variants
- Re-check on preference change (rare edge case)

## Data Loading Strategy

**Static Generation** (Build Time):

- All JSON files parsed and validated with Zod
- TypeScript compilation ensures type safety
- `generateStaticParams` generates all god/story/realm routes
- Content embedded in HTML for instant first paint

**Client-Side Filtering**:

- Full dataset loaded once (small: <500KB compressed)
- Filtering done in browser with immediate feedback
- No API calls needed for search/filter operations

**Future Migration to CMS**:

- Replace JSON loading with CMS API calls
- Keep same TypeScript interfaces
- Add ISR (Incremental Static Regeneration) for content updates
- Maintain Zod validation at API boundary
