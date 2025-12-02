# Quick Start: Automated Image Generation

This guide will help you set up automated image generation for the Norse Mythology project using Venice.ai.

## Prerequisites

- Venice.ai Pro account with API access
- Node.js 18+ installed
- Access to this repository

## Step-by-Step Setup

### 1. Get Venice.ai API Key

1. Go to [Venice.ai](https://venice.ai/)
2. Sign up or log in to your Pro account
3. Navigate to Settings → API
4. Click "Generate New API Key"
5. Copy the key (you'll need it in step 3)

### 2. Install Dependencies

```bash
cd tools/image-generator
npm install
```

This will install:
- `@modelcontextprotocol/sdk` - MCP server framework
- `axios` - HTTP client for Venice.ai API
- `sharp` - Image processing (WebP/AVIF conversion)
- `dotenv` - Environment variable management
- `zod` - Input validation

### 3. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env and add your API key
nano .env  # or use your preferred editor
```

Add your Venice.ai API key:
```env
VENICE_AI_API_KEY=your_actual_api_key_here
```

### 4. Build the MCP Server

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

### 5. Test the Connection

Create a test script to verify your API key works:

```bash
# From tools/image-generator directory
node -e "
const { VeniceAIClient } = require('./dist/venice-client.js');
const client = new VeniceAIClient(process.env.VENICE_AI_API_KEY);
client.testConnection().then(ok => {
  console.log(ok ? '✓ Connection successful!' : '✗ Connection failed');
});
"
```

## Usage Options

### Option A: VS Code MCP Integration (Recommended)

Add to your VS Code settings (`.vscode/settings.json` or User Settings):

```json
{
  "mcp.servers": {
    "norse-image-generator": {
      "command": "node",
      "args": [
        "/absolute/path/to/norse/tools/image-generator/dist/index.js"
      ],
      "env": {
        "VENICE_AI_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

**Important**: Replace `/absolute/path/to/norse/` with your actual project path.

Then in VS Code:
1. Open Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)
2. Type "MCP: Restart Servers"
3. The Norse Image Generator tools will be available in Copilot

### Option B: GitHub Copilot Chat Integration

If using GitHub Copilot, the MCP server tools should automatically appear in your tool list when configured.

You can invoke tools like:
```
@workspace Generate a god portrait for Odin using the norse-image-generator MCP server
```

### Option C: Standalone CLI Script

For batch generation without MCP:

```bash
# Generate a single god portrait
npm run generate -- --type god --name Odin --domain "wisdom and war" --output ../../public/images/gods/odin

# Batch generate all gods
npm run generate -- --batch gods

# Generate specific category with limit
npm run generate -- --batch stories --limit 5
```

## Example: Generate Your First Image

### Using MCP Tools (in VS Code with Copilot)

```typescript
// Call the generate_god_portrait tool
{
  "godName": "Thor",
  "domain": "thunder and strength",
  "attributes": [
    "red beard",
    "powerful build",
    "Mjolnir hammer",
    "lightning crackling around him"
  ],
  "mood": "fierce and heroic",
  "outputPath": "public/images/gods/thor"
}
```

The tool will:
1. Generate an enhanced prompt
2. Call Venice.ai API
3. Download the image
4. Convert to WebP and AVIF formats
5. Save to `public/images/gods/thor.webp` and `thor.avif`

### Using Standalone Script

```bash
cd tools/image-generator
npm run generate -- \
  --type god \
  --name "Thor" \
  --domain "thunder and strength" \
  --attributes "red beard, Mjolnir, lightning" \
  --mood "fierce and heroic" \
  --output "../../public/images/gods/thor"
```

## Batch Generation Workflow

For generating all missing images:

### 1. Assess Current Needs

```bash
cd ../..  # Back to project root
npm run validate-data  # Check what content exists
```

### 2. Generate by Category

```bash
cd tools/image-generator

# Generate all god portraits (12 images)
npm run generate -- --batch gods

# Generate all story illustrations (6 images)
npm run generate -- --batch stories

# Generate all realm landscapes (9 images)
npm run generate -- --batch realms

# Generate all symbol icons (10 images)
npm run generate -- --batch symbols
```

### 3. Review Results

Images will be saved in:
- `public/images/gods/*.webp` and `*.avif`
- `public/images/stories/*.webp` and `*.avif`
- `public/images/realms/*.webp` and `*.avif`
- `public/images/symbols/*.webp` and `*.svg`

### 4. Regenerate Low-Quality Images

If an image doesn't meet standards:

```bash
# Regenerate single image with modified prompt
npm run generate -- --type god --name Odin --output ../../public/images/gods/odin --regenerate
```

## Cost Estimation

**Venice.ai Pricing** (approximate):
- Standard 1024x1024: ~$0.03 per image
- Portrait 768x1024: ~$0.04 per image
- Landscape 1920x1080: ~$0.08 per image

**Total for Norse Project**:
- 12 gods @ $0.04 = $0.48
- 6 stories @ $0.08 = $0.48
- 9 realms @ $0.08 = $0.72
- 10 symbols @ $0.03 = $0.30
- **Total: ~$2-3**

## Troubleshooting

### "Module not found" errors
```bash
npm install
npm run build
```

### "Invalid API key"
- Check `.env` file exists in `tools/image-generator/`
- Verify API key is correct (no extra spaces)
- Confirm key is active in Venice.ai dashboard

### Images look wrong
- Edit prompts in `src/prompt-enhancer.ts`
- Adjust style parameters
- Add more specific attributes

### Timeout errors
- Venice.ai may be slow during peak times
- Increase timeout in `src/venice-client.ts`
- Reduce batch size

### Rate limiting
- Venice.ai has rate limits per minute/hour
- Add delays between requests
- Process in smaller batches

## Tips for Best Results

### God Portraits
- Include specific physical traits (beard color, eye details)
- Mention iconic weapons or artifacts
- Specify facial expression (wise, fierce, serene)

### Story Illustrations
- Describe the exact moment in the story
- Include key characters and their positions
- Mention atmospheric elements (storm, fire, mist)

### Realm Landscapes
- Emphasize unique realm characteristics
- Include architectural elements
- Describe lighting and weather

### Symbol Icons
- Keep descriptions focused on shape
- Mention material (gold, iron, wood)
- Specify decoration style (minimalist, ornate)

## Next Steps

After images are generated:

1. **Review Quality**: Check each image for accuracy
2. **Optimize**: Run `npm run build` in main project to optimize
3. **Commit**: `git add public/images && git commit -m "feat: Add AI-generated mythology images"`
4. **Test**: Verify images load correctly in dev server
5. **Deploy**: Images will be included in production build

## Alternative Approach: Perplexity Pro

If Venice.ai doesn't work well, you can use Perplexity Pro to:
1. Generate enhanced image prompts
2. Use those prompts with another service (DALL-E, Midjourney)
3. Manual download and processing

See `docs/IMAGE_GENERATION_PLAN.md` for details.

## Need Help?

- Check `tools/image-generator/README.md` for detailed API docs
- See `docs/IMAGE_GENERATION_PLAN.md` for architecture overview
- Review Venice.ai documentation: https://docs.venice.ai/
- Check MCP documentation: https://modelcontextprotocol.io/

## Summary

You now have:
- ✅ MCP server configured for image generation
- ✅ Venice.ai API integration
- ✅ Batch processing capabilities
- ✅ Multi-format output (WebP, AVIF, SVG)
- ✅ Cost-effective automation (~$2-3 for all images)

Ready to generate! 🎨
