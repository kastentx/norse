# Automated Image Generation Plan

## Goal
Automate the creation of Norse mythology image assets using AI image generation services (Venice.ai Pro or Perplexity Pro) via MCP server integration.

## Current Image Needs

Based on tasks.md, we need:
- **Gods**: 12 portrait images (WebP/AVIF) - `public/images/gods/`
- **Stories**: 6-8 illustration images (WebP/AVIF) - `public/images/stories/`
- **Realms**: 9 visualization images (WebP/AVIF) - `public/images/realms/`
- **Symbols**: 10 icon/symbol images (SVG/WebP) - `public/images/symbols/`

**Total**: ~37-39 images

## Current Status
We have placeholder `.txt` spec files for all images that describe what each image should contain.

## Integration Options

### Option 1: Venice.ai Pro MCP Server

**Pros:**
- Venice.ai has native image generation capabilities
- No censorship/content filtering (good for mythology themes)
- Direct API access available
- Supports custom models

**Implementation:**
```bash
# Create MCP server for Venice.ai
npm install -D @modelcontextprotocol/sdk
```

**Server structure:**
```
tools/mcp-venice-server/
├── package.json
├── src/
│   ├── index.ts          # MCP server entry point
│   ├── venice-client.ts  # Venice.ai API wrapper
│   └── prompts.ts        # Image generation prompts
└── README.md
```

**Capabilities needed:**
- `generate_image(prompt, style, dimensions)` - Generate single image
- `batch_generate_images(specs[])` - Generate multiple images
- `save_image(imageData, path)` - Save to project

### Option 2: Perplexity Pro API

**Note:** Perplexity primarily provides text/search capabilities. Image generation would require:
- Using Perplexity to generate enhanced prompts
- Piping those prompts to an image generation service (DALL-E, Midjourney, etc.)

**Not ideal** for this use case as it adds complexity.

### Option 3: Hybrid Approach (Recommended)

1. **Use Venice.ai for image generation**
2. **Create custom MCP server** that:
   - Reads our placeholder `.txt` files
   - Enhances prompts with mythology-specific context
   - Calls Venice.ai API to generate images
   - Saves images in correct format (WebP/AVIF)
   - Updates our codebase with actual image files

## Implementation Steps

### Phase 1: MCP Server Setup (1-2 hours)

1. **Create MCP server structure**
   ```bash
   mkdir -p tools/image-generator
   cd tools/image-generator
   npm init -y
   npm install @modelcontextprotocol/sdk dotenv
   ```

2. **Configure Venice.ai API credentials**
   - Get API key from Venice.ai dashboard
   - Add to `.env.local`: `VENICE_AI_API_KEY=xxx`

3. **Create server implementation**
   - `src/index.ts` - MCP server entry point
   - `src/venice-api.ts` - API client for Venice.ai
   - `src/image-processor.ts` - Image format conversion (WebP/AVIF)
   - `src/prompt-enhancer.ts` - Norse mythology prompt templates

4. **Register server in VS Code**
   ```json
   // .vscode/settings.json (or VS Code settings)
   {
     "mcp.servers": {
       "norse-image-generator": {
         "command": "node",
         "args": ["tools/image-generator/dist/index.js"]
       }
     }
   }
   ```

### Phase 2: Prompt Engineering (1 hour)

Create prompt templates for each category:

**Gods (Portrait style):**
```
A majestic portrait of {god_name}, Norse god/goddess of {domain}.
Style: Epic fantasy art, dramatic lighting, mystical atmosphere
Details: {specific_attributes from JSON}
Art style: Digital painting, high detail, cinematic
Mood: {god_specific_mood}
```

**Stories (Illustration style):**
```
Illustration depicting {story_scene}
Style: Norse mythology illustration, epic fantasy
Scene: {scene_description from JSON}
Mood: {story_mood}
```

**Realms (Environment style):**
```
A vast landscape of {realm_name}, {realm_description}
Style: Fantasy environment art, atmospheric perspective
Details: {characteristics from JSON}
Mood: {realm_specific_atmosphere}
```

**Symbols (Icon style):**
```
Norse mythology symbol: {symbol_name}
Style: Minimal, iconic, vector-style illustration
Details: {symbol_description}
Format: Clean, recognizable silhouette
```

### Phase 3: Batch Generation Script (1 hour)

Create script that:
1. Scans placeholder `.txt` files
2. Reads corresponding JSON data for context
3. Generates enhanced prompts
4. Calls Venice.ai API via MCP server
5. Converts to WebP/AVIF formats
6. Saves to correct directories
7. Generates report of created assets

```typescript
// tools/generate-images.ts
import { MCPClient } from './mcp-client';
import { scanPlaceholders } from './scanner';
import { enhancePrompt } from './prompt-enhancer';

async function generateAllImages() {
  const placeholders = await scanPlaceholders();
  
  for (const placeholder of placeholders) {
    const jsonData = await loadRelatedJSON(placeholder);
    const prompt = enhancePrompt(placeholder, jsonData);
    const image = await mcp.generateImage(prompt);
    await saveImage(image, placeholder.path);
  }
}
```

### Phase 4: Image Optimization (30 min)

- Convert to WebP/AVIF with sharp
- Optimize file sizes
- Generate blur placeholders for Next.js
- Validate dimensions

### Phase 5: Validation & Review (1 hour)

- Generate all images
- Manual review for quality/accuracy
- Regenerate any that don't meet standards
- Commit final assets

## Technical Requirements

### Dependencies
```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "dotenv": "^16.0.0",
    "sharp": "^0.33.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "tsx": "^4.0.0"
  }
}
```

### Environment Variables
```bash
# .env.local
VENICE_AI_API_KEY=your_api_key_here
VENICE_AI_MODEL=venice-1  # or preferred model
IMAGE_GENERATION_BATCH_SIZE=5
IMAGE_OUTPUT_FORMAT=webp,avif
```

### MCP Server Tools

```typescript
// Tools exposed by MCP server
{
  "tools": [
    {
      "name": "generate_god_portrait",
      "description": "Generate a Norse god portrait image",
      "inputSchema": {
        "godName": "string",
        "domain": "string",
        "attributes": "string[]",
        "mood": "string"
      }
    },
    {
      "name": "generate_story_illustration",
      "description": "Generate a mythology story illustration",
      "inputSchema": {
        "storyName": "string",
        "scene": "string",
        "mood": "string"
      }
    },
    {
      "name": "generate_realm_landscape",
      "description": "Generate a Nine Realms landscape",
      "inputSchema": {
        "realmName": "string",
        "description": "string",
        "atmosphere": "string"
      }
    },
    {
      "name": "generate_symbol_icon",
      "description": "Generate a Norse symbol icon",
      "inputSchema": {
        "symbolName": "string",
        "description": "string",
        "style": "string"
      }
    },
    {
      "name": "batch_generate_images",
      "description": "Generate multiple images from placeholder specs",
      "inputSchema": {
        "category": "gods|stories|realms|symbols|all"
      }
    }
  ]
}
```

## Venice.ai API Reference

**Endpoint:** `https://api.venice.ai/v1/images/generate`

**Request:**
```json
{
  "prompt": "Your detailed prompt",
  "model": "venice-1",
  "width": 1024,
  "height": 1024,
  "num_images": 1,
  "style": "fantasy",
  "negative_prompt": "low quality, blurry, distorted"
}
```

**Response:**
```json
{
  "images": [
    {
      "url": "https://...",
      "b64_json": "base64_encoded_image"
    }
  ]
}
```

## Cost Estimation

**Venice.ai Pro Pricing:**
- ~$0.02-0.10 per image (depending on resolution/model)
- Total for 37-39 images: **~$1-4**

**Time Savings:**
- Manual creation: 15-30 min per image = 9-20 hours
- Automated: ~5 minutes per image = ~3 hours (including setup)

## Alternative: Manual Script Without MCP

If MCP setup is too complex, we can create a standalone script:

```typescript
// scripts/generate-images.ts
import axios from 'axios';
import sharp from 'sharp';
import fs from 'fs/promises';

async function generateImage(prompt: string) {
  const response = await axios.post('https://api.venice.ai/v1/images/generate', {
    prompt,
    model: 'venice-1',
    width: 1024,
    height: 1024
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.VENICE_AI_API_KEY}`
    }
  });
  
  return response.data.images[0];
}

// Read placeholder, generate, save
```

Run with: `npx tsx scripts/generate-images.ts`

## Next Steps

1. **Decision Point:** MCP server vs standalone script?
2. **Get Venice.ai API key** from dashboard
3. **Create initial MCP server** or script structure
4. **Test with 1-2 images** to validate approach
5. **Batch generate** all remaining images
6. **Review and refine** prompts based on results

## Questions to Answer

- [ ] Do you have a Venice.ai Pro account with API access?
- [ ] Preference: MCP server (reusable) vs one-off script (faster)?
- [ ] Image style preferences (realistic, stylized, painted, etc.)?
- [ ] Should we generate variations and let you choose best?
- [ ] Fallback plan if Venice.ai doesn't work well?

## Resources

- [Venice.ai API Documentation](https://docs.venice.ai/)
- [Model Context Protocol Spec](https://modelcontextprotocol.io/)
- [MCP SDK for TypeScript](https://github.com/modelcontextprotocol/typescript-sdk)
- [Sharp Image Processing](https://sharp.pixelplumbing.com/)
