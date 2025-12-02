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

interface RealmSpec {
  name: string;
  fileName: string;
  description: string;
  atmosphere: string;
}

const realms: RealmSpec[] = [
  {
    name: 'Asgard',
    fileName: 'asgard',
    description: 'Golden halls of Valhalla, rainbow Bifrost bridge, radiant sky palaces',
    atmosphere: 'majestic, divine radiance, golden light, otherworldly beauty'
  },
  {
    name: 'Alfheim',
    fileName: 'alfheim',
    description: 'Ethereal forests, luminous meadows, crystalline streams, elegant architecture',
    atmosphere: 'magical, luminous, serene beauty, gentle light'
  },
  {
    name: 'Helheim',
    fileName: 'helheim',
    description: 'Dark misty realm, river Gjoll, gates of Hel, shadowy landscape',
    atmosphere: 'somber, cold, foggy, neither torment nor peace'
  },
  {
    name: 'Jotunheim',
    fileName: 'jotunheim',
    description: 'Massive mountains, towering peaks, frost and stone, giant fortresses',
    atmosphere: 'harsh, imposing scale, wild nature, dangerous beauty'
  },
  {
    name: 'Midgard',
    fileName: 'midgard',
    description: 'Norse landscapes, fjords, forests, Viking settlements, mortal world',
    atmosphere: 'familiar yet mystical, connection to human world, natural beauty'
  },
  {
    name: 'Muspelheim',
    fileName: 'muspelheim',
    description: 'Rivers of lava, fire giants, scorched landscape, eternal flames',
    atmosphere: 'blazing, intense heat, primordial fire, destructive power'
  },
  {
    name: 'Niflheim',
    fileName: 'niflheim',
    description: 'Frozen wasteland, thick mists, primordial ice, cold void',
    atmosphere: 'freezing, mysterious mists, ancient cold, primordial ice'
  },
  {
    name: 'Svartalfheim',
    fileName: 'svartalfheim',
    description: 'Underground forges, intricate caverns, glowing metals, crafting halls',
    atmosphere: 'industrial beauty, forge fires, craftsmanship, underground majesty'
  },
  {
    name: 'Vanaheim',
    fileName: 'vanaheim',
    description: 'Lush forests, fertile fields, natural abundance, harmony with nature',
    atmosphere: 'abundant, fertile, natural magic, peaceful prosperity'
  }
];

async function generateRealmLandscape(realm: RealmSpec): Promise<void> {
  const apiKey = process.env.VENICE_AI_API_KEY;
  if (!apiKey) {
    throw new Error('VENICE_AI_API_KEY not found in environment');
  }

  console.log(`\n🎨 Generating landscape: ${realm.name}...`);
  
  const client = new VeniceAIClient(apiKey);
  const promptEnhancer = new PromptEnhancer();
  const imageProcessor = new ImageProcessor();

  // Generate enhanced prompt
  const prompt = promptEnhancer.createRealmPrompt(
    realm.name,
    realm.description,
    realm.atmosphere
  );

  console.log(`📝 Prompt: ${prompt.substring(0, 100)}...`);

  try {
    // Generate image from Venice.ai
    console.log('⏳ Calling Venice.ai API...');
    const imageData = await client.generateImage(prompt, {
      size: '1536x1024', // Landscape orientation for realm views
      model: process.env.VENICE_AI_MODEL || 'fluently-xl',
      outputFormat: 'png',
    });

    console.log('✓ Image generated successfully');

    // Save in multiple formats (go up to project root from dist/)
    const projectRoot = path.join(__dirname, '../../..');
    const outputPath = path.join(projectRoot, 'public/images/realms', realm.fileName);
    console.log(`💾 Saving to ${outputPath}...`);
    
    const savedPaths = await imageProcessor.saveImage(
      imageData,
      `${outputPath}.webp`,
      ['webp', 'avif']
    );

    console.log(`✅ ${realm.name} landscape complete!`);
    savedPaths.forEach(p => console.log(`   - ${p}`));
  } catch (error) {
    console.error(`❌ Failed to generate ${realm.name}:`, error);
    throw error;
  }
}

async function generateAllRealms(): Promise<void> {
  console.log('═══════════════════════════════════════════════════════');
  console.log('     Norse Mythology Realm Landscapes');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`Total realms to generate: ${realms.length}`);
  console.log('');

  let successCount = 0;
  let failCount = 0;

  for (const realm of realms) {
    try {
      await generateRealmLandscape(realm);
      successCount++;
      
      // Small delay between requests to avoid rate limiting
      if (realms.indexOf(realm) < realms.length - 1) {
        console.log('⏸️  Waiting 2 seconds before next request...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      failCount++;
      console.error(`Failed to generate ${realm.name}, continuing...`);
    }
  }

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('                  GENERATION COMPLETE');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`📊 Total: ${realms.length}`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateAllRealms()
    .then(() => {
      console.log('\n🎉 All done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Generation failed:', error);
      process.exit(1);
    });
}
