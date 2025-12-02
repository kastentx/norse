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

interface StorySpec {
  name: string;
  fileName: string;
  scene: string;
  mood: string;
}

const stories: StorySpec[] = [
  // Ragnarok
  {
    name: 'Ragnarok - Overview',
    fileName: 'ragnarok-hero',
    scene: 'The apocalyptic twilight of the gods, armies converging on the plain of Vigrid, burning sky',
    mood: 'apocalyptic, epic doom, end of all things'
  },
  {
    name: 'Ragnarok - Fimbulvetr',
    fileName: 'ragnarok-winter',
    scene: 'The three terrible winters of Fimbulvetr, endless snow, frozen landscape, darkened sun',
    mood: 'desolate, freezing cold, darkness before the end'
  },
  {
    name: 'Ragnarok - Serpent Rising',
    fileName: 'ragnarok-serpent',
    scene: 'Jormungandr the World Serpent rising from the ocean, tidal waves, venom spewing',
    mood: 'catastrophic, monstrous scale, ocean fury'
  },
  {
    name: 'Ragnarok - Final Battle',
    fileName: 'ragnarok-battle',
    scene: 'Gods and giants clash at Vigrid, Odin vs Fenrir, Thor vs Jormungandr, Surtr\'s flames',
    mood: 'epic battle, heroic doom, gods\' last stand'
  },
  // Yggdrasil
  {
    name: 'Yggdrasil - Overview',
    fileName: 'yggdrasil-full',
    scene: 'The World Tree Yggdrasil spanning all Nine Realms, massive cosmic ash tree with glowing branches',
    mood: 'majestic, cosmic scale, center of all existence'
  },
  {
    name: 'Yggdrasil - Creatures',
    fileName: 'yggdrasil-creatures',
    scene: 'The creatures of Yggdrasil: eagle at top, dragon Nidhogg at roots, squirrel Ratatosk running between',
    mood: 'mystical ecosystem, eternal conflict between eagle and dragon'
  },
  {
    name: 'Yggdrasil - Four Stags',
    fileName: 'yggdrasil-stags',
    scene: 'The four stags Dáinn, Dvalinn, Duneyrr, and Duraþrór eating the branches of Yggdrasil',
    mood: 'eternal cycle, consumption and renewal, cosmic balance'
  }
];

async function generateStoryIllustration(story: StorySpec): Promise<void> {
  const apiKey = process.env.VENICE_AI_API_KEY;
  if (!apiKey) {
    throw new Error('VENICE_AI_API_KEY not found in environment');
  }

  console.log(`\n🎨 Generating illustration: ${story.name}...`);
  
  const client = new VeniceAIClient(apiKey);
  const promptEnhancer = new PromptEnhancer();
  const imageProcessor = new ImageProcessor();

  // Generate enhanced prompt
  const prompt = promptEnhancer.createStoryPrompt(
    story.name,
    story.scene,
    story.mood
  );

  console.log(`📝 Prompt: ${prompt.substring(0, 100)}...`);

  try {
    // Generate image from Venice.ai
    console.log('⏳ Calling Venice.ai API...');
    const imageData = await client.generateImage(prompt, {
      size: '1536x1024', // Landscape orientation for story illustrations
      model: process.env.VENICE_AI_MODEL || 'fluently-xl',
      outputFormat: 'png',
    });

    console.log('✓ Image generated successfully');

    // Save in multiple formats (go up to project root from dist/)
    const projectRoot = path.join(__dirname, '../../..');
    const outputPath = path.join(projectRoot, 'public/images/stories', story.fileName);
    console.log(`💾 Saving to ${outputPath}...`);
    
    const savedPaths = await imageProcessor.saveImage(
      imageData,
      `${outputPath}.webp`,
      ['webp', 'avif']
    );

    console.log(`✅ ${story.name} illustration complete!`);
    savedPaths.forEach(p => console.log(`   - ${p}`));
  } catch (error) {
    console.error(`❌ Failed to generate ${story.name}:`, error);
    throw error;
  }
}

async function generateAllStories(): Promise<void> {
  console.log('═══════════════════════════════════════════════════════');
  console.log('     Ragnarok & Yggdrasil Story Illustrations');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`Total illustrations to generate: ${stories.length}`);
  console.log('');

  let successCount = 0;
  let failCount = 0;

  for (const story of stories) {
    try {
      await generateStoryIllustration(story);
      successCount++;
      
      // Small delay between requests to avoid rate limiting
      if (stories.indexOf(story) < stories.length - 1) {
        console.log('⏸️  Waiting 2 seconds before next request...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      failCount++;
      console.error(`Failed to generate ${story.name}, continuing...`);
    }
  }

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('                  GENERATION COMPLETE');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`📊 Total: ${stories.length}`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateAllStories()
    .then(() => {
      console.log('\n🎉 All done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Generation failed:', error);
      process.exit(1);
    });
}
