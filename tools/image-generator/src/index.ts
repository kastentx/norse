#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { VeniceAIClient } from './venice-client.js';
import { PromptEnhancer } from './prompt-enhancer.js';
import { ImageProcessor } from './image-processor.js';
import { z } from 'zod';

// Tool input schemas
const GenerateGodPortraitSchema = z.object({
  godName: z.string(),
  domain: z.string(),
  attributes: z.array(z.string()),
  mood: z.string(),
  outputPath: z.string(),
});

const GenerateStoryIllustrationSchema = z.object({
  storyName: z.string(),
  scene: z.string(),
  mood: z.string(),
  outputPath: z.string(),
});

const GenerateRealmLandscapeSchema = z.object({
  realmName: z.string(),
  description: z.string(),
  atmosphere: z.string(),
  outputPath: z.string(),
});

const GenerateSymbolIconSchema = z.object({
  symbolName: z.string(),
  description: z.string(),
  style: z.string().default('minimal'),
  outputPath: z.string(),
});

const BatchGenerateSchema = z.object({
  category: z.enum(['gods', 'stories', 'realms', 'symbols', 'all']),
  limit: z.number().optional(),
});

// Initialize server
const server = new Server(
  {
    name: 'norse-image-generator',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Initialize clients
const veniceClient = new VeniceAIClient(process.env.VENICE_AI_API_KEY || '');
const promptEnhancer = new PromptEnhancer();
const imageProcessor = new ImageProcessor();

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'generate_god_portrait',
        description:
          'Generate a portrait image of a Norse god/goddess with epic fantasy styling',
        inputSchema: {
          type: 'object',
          properties: {
            godName: {
              type: 'string',
              description: 'Name of the god/goddess (e.g., Odin, Thor, Freyja)',
            },
            domain: {
              type: 'string',
              description: 'Domain or role of the deity (e.g., war, wisdom, thunder)',
            },
            attributes: {
              type: 'array',
              items: { type: 'string' },
              description: 'Physical or symbolic attributes (e.g., one-eyed, red beard, ravens)',
            },
            mood: {
              type: 'string',
              description: 'Desired mood or atmosphere (e.g., majestic, fierce, mystical)',
            },
            outputPath: {
              type: 'string',
              description: 'Output file path relative to project root',
            },
          },
          required: ['godName', 'domain', 'attributes', 'mood', 'outputPath'],
        },
      },
      {
        name: 'generate_story_illustration',
        description: 'Generate an illustration for a Norse mythology story scene',
        inputSchema: {
          type: 'object',
          properties: {
            storyName: {
              type: 'string',
              description: 'Name of the story (e.g., Ragnarok, The Theft of Mjolnir)',
            },
            scene: {
              type: 'string',
              description: 'Description of the specific scene to illustrate',
            },
            mood: {
              type: 'string',
              description: 'Mood or tone of the scene (e.g., epic, ominous, triumphant)',
            },
            outputPath: {
              type: 'string',
              description: 'Output file path relative to project root',
            },
          },
          required: ['storyName', 'scene', 'mood', 'outputPath'],
        },
      },
      {
        name: 'generate_realm_landscape',
        description: 'Generate a landscape visualization of one of the Nine Realms',
        inputSchema: {
          type: 'object',
          properties: {
            realmName: {
              type: 'string',
              description: 'Name of the realm (e.g., Asgard, Midgard, Jotunheim)',
            },
            description: {
              type: 'string',
              description: 'Description of the realm\'s appearance and characteristics',
            },
            atmosphere: {
              type: 'string',
              description: 'Atmospheric quality (e.g., golden and radiant, dark and misty)',
            },
            outputPath: {
              type: 'string',
              description: 'Output file path relative to project root',
            },
          },
          required: ['realmName', 'description', 'atmosphere', 'outputPath'],
        },
      },
      {
        name: 'generate_symbol_icon',
        description: 'Generate a Norse mythology symbol or artifact icon',
        inputSchema: {
          type: 'object',
          properties: {
            symbolName: {
              type: 'string',
              description: 'Name of the symbol (e.g., Mjolnir, Valknut, Yggdrasil)',
            },
            description: {
              type: 'string',
              description: 'Description of the symbol\'s appearance and significance',
            },
            style: {
              type: 'string',
              description: 'Visual style (default: minimal, options: detailed, runic, ornate)',
              default: 'minimal',
            },
            outputPath: {
              type: 'string',
              description: 'Output file path relative to project root',
            },
          },
          required: ['symbolName', 'description', 'outputPath'],
        },
      },
      {
        name: 'batch_generate_images',
        description: 'Generate multiple images based on existing JSON data files',
        inputSchema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              enum: ['gods', 'stories', 'realms', 'symbols', 'all'],
              description: 'Category of images to generate',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of images to generate (optional)',
            },
          },
          required: ['category'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'generate_god_portrait': {
        const params = GenerateGodPortraitSchema.parse(args);
        const prompt = promptEnhancer.createGodPrompt(
          params.godName,
          params.domain,
          params.attributes,
          params.mood
        );
        
        const imageData = await veniceClient.generateImage(prompt, {
          width: 768,
          height: 1024,
          style: 'fantasy portrait',
        });
        
        await imageProcessor.saveImage(imageData, params.outputPath, ['webp', 'avif']);
        
        return {
          content: [
            {
              type: 'text',
              text: `Successfully generated portrait for ${params.godName}\nSaved to: ${params.outputPath}`,
            },
          ],
        };
      }

      case 'generate_story_illustration': {
        const params = GenerateStoryIllustrationSchema.parse(args);
        const prompt = promptEnhancer.createStoryPrompt(
          params.storyName,
          params.scene,
          params.mood
        );
        
        const imageData = await veniceClient.generateImage(prompt, {
          width: 1920,
          height: 1080,
          style: 'fantasy illustration',
        });
        
        await imageProcessor.saveImage(imageData, params.outputPath, ['webp', 'avif']);
        
        return {
          content: [
            {
              type: 'text',
              text: `Successfully generated illustration for ${params.storyName}\nSaved to: ${params.outputPath}`,
            },
          ],
        };
      }

      case 'generate_realm_landscape': {
        const params = GenerateRealmLandscapeSchema.parse(args);
        const prompt = promptEnhancer.createRealmPrompt(
          params.realmName,
          params.description,
          params.atmosphere
        );
        
        const imageData = await veniceClient.generateImage(prompt, {
          width: 1920,
          height: 1080,
          style: 'fantasy landscape',
        });
        
        await imageProcessor.saveImage(imageData, params.outputPath, ['webp', 'avif']);
        
        return {
          content: [
            {
              type: 'text',
              text: `Successfully generated landscape for ${params.realmName}\nSaved to: ${params.outputPath}`,
            },
          ],
        };
      }

      case 'generate_symbol_icon': {
        const params = GenerateSymbolIconSchema.parse(args);
        const prompt = promptEnhancer.createSymbolPrompt(
          params.symbolName,
          params.description,
          params.style
        );
        
        const imageData = await veniceClient.generateImage(prompt, {
          width: 512,
          height: 512,
          style: 'icon design',
        });
        
        await imageProcessor.saveImage(imageData, params.outputPath, ['webp', 'svg']);
        
        return {
          content: [
            {
              type: 'text',
              text: `Successfully generated icon for ${params.symbolName}\nSaved to: ${params.outputPath}`,
            },
          ],
        };
      }

      case 'batch_generate_images': {
        const params = BatchGenerateSchema.parse(args);
        // This would scan JSON files and generate images
        // Implementation details in separate module
        return {
          content: [
            {
              type: 'text',
              text: `Batch generation for category "${params.category}" not yet implemented`,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Norse Image Generator MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
