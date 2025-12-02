#!/usr/bin/env node

import { VeniceAIClient } from './venice-client.js';
import { ImageProcessor } from './image-processor.js';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
config({ path: path.join(__dirname, '../.env') });

async function generateFavicon(): Promise<void> {
  const apiKey = process.env.VENICE_AI_API_KEY;
  if (!apiKey) {
    throw new Error('VENICE_AI_API_KEY not found in environment');
  }

  console.log('═══════════════════════════════════════════════════════');
  console.log('     Norse Mythology Favicon Generation');
  console.log('═══════════════════════════════════════════════════════');
  console.log('');

  const client = new VeniceAIClient(apiKey);
  const imageProcessor = new ImageProcessor();

  // Create an epic Norse mythology favicon prompt
  const prompt = `Norse mythology app icon, minimalist design, Yggdrasil world tree silhouette in gold on dark background, clean lines, iconic, professional app icon, geometric, mystical Nordic runes subtle pattern, centered composition, high contrast, perfect for small sizes, app icon style, premium quality`;

  console.log('🎨 Generating Norse mythology favicon...');
  console.log(`📝 Prompt: ${prompt.substring(0, 100)}...`);
  console.log('');

  try {
    // Generate square icon (optimal for favicon)
    console.log('⏳ Calling Venice.ai API...');
    const imageData = await client.generateImage(prompt, {
      size: '1024x1024', // Square for favicon
      model: process.env.VENICE_AI_MODEL || 'fluently-xl',
      outputFormat: 'png',
    });

    console.log('✓ Image generated successfully');

    // Save to app directory (Next.js will automatically use icon.png)
    const projectRoot = path.join(__dirname, '../../..');
    const outputPath = path.join(projectRoot, 'app/icon');
    
    console.log(`💾 Saving favicon to ${outputPath}.png...`);

    // Save as PNG first
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(`${outputPath}.png`, imageData);
    console.log(`✓ Saved: ${outputPath}.png`);

    // Also save WebP version for modern browsers
    const savedPaths = await imageProcessor.saveImage(
      imageData,
      `${projectRoot}/public/icon.webp`,
      ['webp']
    );

    console.log('✅ Favicon generation complete!');
    savedPaths.forEach(p => console.log(`   - ${p}`));
    console.log('');
    console.log('📝 Next.js will automatically use app/icon.png as favicon');
    console.log('   Standard sizes (16x16, 32x32, 48x48) will be auto-generated');
    console.log('');

  } catch (error) {
    console.error('❌ Failed to generate favicon:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateFavicon()
    .then(() => {
      console.log('🎉 All done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Generation failed:', error);
      process.exit(1);
    });
}
