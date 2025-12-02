#!/usr/bin/env node

import { VeniceAIClient } from './venice-client.js';
import { PromptEnhancer } from './prompt-enhancer.js';
import { ImageProcessor } from './image-processor.js';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
config({ path: path.join(__dirname, '../.env') });

interface SymbolSpec {
  name: string;
  fileName: string;
  description: string;
  style: string;
}

const symbols: SymbolSpec[] = [
  {
    name: 'Brisingamen',
    fileName: 'brisingamen',
    description: 'Golden necklace with intricate Norse knotwork, radiant gems',
    style: 'ornate, golden, divine craftsmanship'
  },
  {
    name: 'Draupnir',
    fileName: 'draupnir',
    description: 'Golden arm ring that multiplies itself every ninth night',
    style: 'ornate, magical golden ring with runes'
  },
  {
    name: 'Fenrir',
    fileName: 'fenrir',
    description: 'Fierce wolf head, fangs, bound with Gleipnir ribbon',
    style: 'powerful, threatening, iconic wolf symbol'
  },
  {
    name: 'Gjallarhorn',
    fileName: 'gjallarhorn',
    description: 'Mighty horn that will sound at Ragnarok, Nordic decorations',
    style: 'detailed, powerful instrument, herald of doom'
  },
  {
    name: 'Gungnir',
    fileName: 'gungnir',
    description: 'Magical spear that never misses, runic inscriptions on shaft',
    style: 'detailed, divine weapon, runes glowing'
  },
  {
    name: 'Huginn and Muninn',
    fileName: 'huginn-muninn',
    description: 'Two ravens in flight, thought and memory, mystical birds',
    style: 'paired ravens, symbolic, Norse aesthetic'
  },
  {
    name: 'Mjolnir',
    fileName: 'mjolnir',
    description: 'Iconic hammer with short handle, lightning motifs, indestructible',
    style: 'powerful, recognizable hammer shape, Norse patterns'
  },
  {
    name: 'Sleipnir',
    fileName: 'sleipnir',
    description: 'Magnificent eight-legged stallion, fastest of all horses',
    style: 'dynamic, supernatural horse, eight legs clearly visible'
  },
  {
    name: 'Valknut',
    fileName: 'valknut',
    description: 'Three interlocking triangles, symbol of fallen warriors',
    style: 'geometric, interlocking triangles, sacred symbol'
  },
  {
    name: 'Yggdrasil',
    fileName: 'yggdrasil',
    description: 'Massive tree connecting nine realms, cosmic ash tree',
    style: 'majestic tree, roots and branches, nine realms represented'
  }
];

async function generateSymbolIcon(symbol: SymbolSpec): Promise<void> {
  const apiKey = process.env.VENICE_AI_API_KEY;
  if (!apiKey) {
    throw new Error('VENICE_AI_API_KEY not found in environment');
  }

  console.log(`\n🎨 Generating symbol: ${symbol.name}...`);
  
  const client = new VeniceAIClient(apiKey);
  const promptEnhancer = new PromptEnhancer();
  const imageProcessor = new ImageProcessor();

  // Generate enhanced prompt
  const prompt = promptEnhancer.createSymbolPrompt(
    symbol.name,
    symbol.description,
    symbol.style
  );

  console.log(`📝 Prompt: ${prompt.substring(0, 100)}...`);

  try {
    // Generate image from Venice.ai
    console.log('⏳ Calling Venice.ai API...');
    const imageData = await client.generateImage(prompt, {
      size: '1024x1024', // Square for icons/symbols
      model: process.env.VENICE_AI_MODEL || 'fluently-xl',
      outputFormat: 'png',
    });

    console.log('✓ Image generated successfully');

    // Save in multiple formats (go up to project root from dist/)
    const projectRoot = path.join(__dirname, '../../..');
    const outputPath = path.join(projectRoot, 'public/images/symbols', symbol.fileName);
    console.log(`💾 Saving to ${outputPath}...`);
    
    const savedPaths = await imageProcessor.saveImage(
      imageData,
      `${outputPath}.webp`,
      ['webp', 'avif']
    );

    console.log(`✅ ${symbol.name} symbol complete!`);
    savedPaths.forEach(p => console.log(`   - ${p}`));
  } catch (error) {
    console.error(`❌ Failed to generate ${symbol.name}:`, error);
    throw error;
  }
}

async function generateAllSymbols(): Promise<void> {
  console.log('═══════════════════════════════════════════════════════');
  console.log('     Norse Mythology Symbol Icons');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`Total symbols to generate: ${symbols.length}`);
  console.log('');

  let successCount = 0;
  let failCount = 0;

  for (const symbol of symbols) {
    try {
      await generateSymbolIcon(symbol);
      successCount++;
      
      // Small delay between requests to avoid rate limiting
      if (symbols.indexOf(symbol) < symbols.length - 1) {
        console.log('⏸️  Waiting 2 seconds before next request...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      failCount++;
      console.error(`Failed to generate ${symbol.name}, continuing...`);
    }
  }

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('                  GENERATION COMPLETE');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`📊 Total: ${symbols.length}`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateAllSymbols()
    .then(() => {
      console.log('\n🎉 All done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Generation failed:', error);
      process.exit(1);
    });
}
