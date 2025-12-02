# Norse Image Generator - MCP Server

Automated image generation for Norse Mythology Knowledge Base using Venice.ai and Model Context Protocol (MCP).

## Overview

This MCP server provides tools for generating high-quality Norse mythology images including god portraits, story illustrations, realm landscapes, and symbol icons.

## Features

- **God Portraits**: Epic fantasy portraits with dramatic lighting
- **Story Illustrations**: Detailed scene illustrations for mythology stories
- **Realm Landscapes**: Breathtaking environment art for the Nine Realms
- **Symbol Icons**: Clean, recognizable Norse symbols and artifacts
- **Batch Generation**: Process multiple images from JSON data
- **Multi-Format Output**: WebP, AVIF, JPEG, PNG, SVG
- **Automatic Optimization**: Image compression and format conversion

## Installation

```bash
cd tools/image-generator
npm install
```

## Configuration

1. **Get Venice.ai API Key**
   - Sign up at https://venice.ai/
   - Navigate to API settings
   - Generate new API key

2. **Create .env file**
   ```bash
   cp .env.example .env
   ```

3. **Add your API key**
   ```env
   VENICE_AI_API_KEY=your_api_key_here
   VENICE_AI_MODEL=venice-1
   ```

## Usage

### As MCP Server (Recommended)

Add to your VS Code settings or MCP client configuration:

```json
{
  "mcpServers": {
    "norse-image-generator": {
      "command": "node",
      "args": ["/absolute/path/to/tools/image-generator/dist/index.js"],
      "env": {
        "VENICE_AI_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

### Available MCP Tools

#### 1. generate_god_portrait

Generate epic fantasy portrait of a Norse deity.

```typescript
{
  godName: "Odin",
  domain: "wisdom, war, and death",
  attributes: ["one-eyed", "gray beard", "ravens Huginn and Muninn"],
  mood: "wise and mysterious",
  outputPath: "public/images/gods/odin"
}
```

#### 2. generate_story_illustration

Generate illustration for a mythology story scene.

```typescript
{
  storyName: "Ragnarok",
  scene: "The final battle between gods and giants on the plains of Vigrid",
  mood: "apocalyptic and dramatic",
  outputPath: "public/images/stories/ragnarok-battle"
}
```

#### 3. generate_realm_landscape

Generate landscape for one of the Nine Realms.

```typescript
{
  realmName: "Asgard",
  description: "Golden halls and rainbow bridge",
  atmosphere: "majestic, radiant, divine",
  outputPath: "public/images/realms/asgard"
}
```

#### 4. generate_symbol_icon

Generate Norse symbol or artifact icon.

```typescript
{
  symbolName: "Mjolnir",
  description: "Thor's hammer with intricate knotwork",
  style: "ornate",
  outputPath: "public/images/symbols/mjolnir"
}
```

#### 5. batch_generate_images

Generate multiple images from JSON data.

```typescript
{
  category: "gods", // or "stories", "realms", "symbols", "all"
  limit: 10 // optional
}
```

### Standalone Script Usage

Run without MCP server:

```bash
# Build first
npm run build

# Generate single image
npm run generate -- --type god --name Odin --output public/images/gods/odin.webp

# Batch generate
npm run generate -- --batch gods --limit 5
```

## Development

```bash
# Install dependencies
npm install

# Development mode with auto-reload
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start
```

## File Structure

```
tools/image-generator/
├── src/
│   ├── index.ts              # MCP server entry point
│   ├── venice-client.ts      # Venice.ai API wrapper
│   ├── prompt-enhancer.ts    # Prompt generation logic
│   ├── image-processor.ts    # Image format conversion
│   └── generate-images.ts    # CLI script for batch generation
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Prompt Engineering

### God Portraits
- **Style**: Epic fantasy, dramatic lighting, divine presence
- **Dimensions**: 768x1024 (portrait ratio)
- **Details**: Emphasize iconic attributes, expressive face

### Story Illustrations
- **Style**: Fantasy book illustration, dynamic action
- **Dimensions**: 1920x1080 (cinematic ratio)
- **Details**: Storytelling composition, atmospheric

### Realm Landscapes
- **Style**: Epic environment art, atmospheric perspective
- **Dimensions**: 1920x1080 (wide landscape)
- **Details**: Immersive, otherworldly, unique character

### Symbol Icons
- **Style**: Clean iconography, recognizable silhouette
- **Dimensions**: 512x512 (square)
- **Details**: Symbolic, scalable, instantly identifiable

## API Costs

**Venice.ai Pricing** (approximate):
- Standard images: ~$0.02-0.05 per image
- High-res images: ~$0.10-0.15 per image
- Estimated total for 37-39 images: **$1-4**

## Troubleshooting

### "Cannot find module" errors
```bash
npm install
npm run build
```

### "Invalid API key" error
- Verify VENICE_AI_API_KEY in .env
- Check key is active in Venice.ai dashboard
- Ensure .env is in correct directory

### Image quality issues
- Adjust prompts in `src/prompt-enhancer.ts`
- Modify negative prompts to exclude unwanted elements
- Try different style parameters

### Timeout errors
- Increase timeout in `venice-client.ts`
- Reduce batch size
- Check Venice.ai API status

## Advanced Configuration

### Custom Image Dimensions

Modify in `src/index.ts`:

```typescript
const imageData = await veniceClient.generateImage(prompt, {
  width: 1920,
  height: 1080,
  style: 'custom style',
});
```

### Additional Output Formats

Modify in `src/index.ts`:

```typescript
await imageProcessor.saveImage(imageData, params.outputPath, [
  'webp',
  'avif',
  'jpeg',
  'png',
]);
```

### Negative Prompts

Customize in `src/prompt-enhancer.ts`:

```typescript
negativePrompt: 'your custom negative prompt here'
```

## Future Enhancements

- [ ] Support for multiple AI providers (DALL-E, Midjourney, Stable Diffusion)
- [ ] Image variation generation (create multiple options)
- [ ] Upscaling support for higher resolution
- [ ] Style transfer between existing images
- [ ] Automated quality assessment and retry logic
- [ ] Progress tracking for batch operations
- [ ] Image metadata and provenance tracking

## Contributing

See main project README for contribution guidelines.

## License

MIT
