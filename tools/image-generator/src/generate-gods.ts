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

interface GodSpec {
  name: string;
  domain: string;
  attributes: string[];
  mood: string;
}

const gods: GodSpec[] = [
  {
    name: 'Baldur',
    domain: 'light, beauty, purity, innocence',
    attributes: ['radiant', 'golden hair', 'beloved by all', 'immortal before mistletoe'],
    mood: 'serene, luminous, tragically beautiful'
  },
  {
    name: 'Freyja',
    domain: 'love, beauty, fertility, war, death',
    attributes: ['golden hair', 'Brisingamen necklace', 'falcon cloak', 'cats', 'beauty beyond compare'],
    mood: 'powerful, alluring, fierce warrior-goddess'
  },
  {
    name: 'Freyr',
    domain: 'fertility, prosperity, sunshine, fair weather',
    attributes: ['golden boar Gullinbursti', 'magic ship Skidbladnir', 'handsome'],
    mood: 'benevolent, radiant, generous'
  },
  {
    name: 'Frigg',
    domain: 'marriage, motherhood, foresight, wisdom',
    attributes: ['regal', 'spinning wheel', 'knowing eyes', 'maternal yet authoritative'],
    mood: 'wise, dignified, protective mother'
  },
  {
    name: 'Heimdall',
    domain: 'vigilance, foresight, guardian duties',
    attributes: ['golden teeth', 'Gjallarhorn', 'sees for miles', 'never sleeps'],
    mood: 'watchful, alert, eternal sentinel'
  },
  {
    name: 'Hel',
    domain: 'death, underworld, realm of the dishonored dead',
    attributes: ['half-living half-dead appearance', 'dark and pale', 'crown', 'grim beauty'],
    mood: 'somber, authoritative, neither cruel nor kind'
  },
  {
    name: 'Loki',
    domain: 'mischief, chaos, cunning, transformation',
    attributes: ['shapeshifter', 'sly grin', 'unpredictable', 'chaotic energy'],
    mood: 'mischievous, dangerous, unpredictable trickster'
  },
  {
    name: 'Njord',
    domain: 'sea, wind, fishing, sailing, wealth from the sea',
    attributes: ['weathered sailor', 'sea captain bearing', 'calming presence'],
    mood: 'tranquil, powerful like the ocean depths'
  },
  {
    name: 'Skadi',
    domain: 'winter, mountains, hunting, skiing',
    attributes: ['bow and arrow', 'skis', 'winter furs', 'strong huntress'],
    mood: 'fierce, independent, cold beauty'
  },
  {
    name: 'Thor',
    domain: 'thunder, lightning, storms, strength, protection',
    attributes: ['red beard', 'Mjolnir hammer', 'muscular', 'lightning crackling'],
    mood: 'fierce, heroic, protective warrior'
  },
  {
    name: 'Tyr',
    domain: 'war, justice, law, heroic glory',
    attributes: ['one-handed (right hand missing)', 'sword', 'martial bearing', 'honorable'],
    mood: 'brave, honorable, self-sacrificing warrior'
  }
];

async function generateGodPortrait(god: GodSpec): Promise<void> {
  const apiKey = process.env.VENICE_AI_API_KEY;
  if (!apiKey) {
    throw new Error('VENICE_AI_API_KEY not found in environment');
  }

  console.log(`\n🎨 Generating portrait for ${god.name}...`);
  
  const client = new VeniceAIClient(apiKey);
  const promptEnhancer = new PromptEnhancer();
  const imageProcessor = new ImageProcessor();

  // Generate enhanced prompt
  const prompt = promptEnhancer.createGodPrompt(
    god.name,
    god.domain,
    god.attributes,
    god.mood
  );

  console.log(`📝 Prompt: ${prompt.substring(0, 100)}...`);

  try {
    // Generate image from Venice.ai
    console.log('⏳ Calling Venice.ai API...');
    const imageData = await client.generateImage(prompt, {
      size: '1024x1536', // Portrait orientation for gods
      model: process.env.VENICE_AI_MODEL || 'fluently-xl',
      outputFormat: 'png',
    });

    console.log('✓ Image generated successfully');

    // Save in multiple formats (go up to project root from dist/)
    // __dirname is tools/image-generator/dist, need to go up 3 levels to project root
    const projectRoot = path.join(__dirname, '../../..');
    const outputPath = path.join(projectRoot, 'public/images/gods', god.name.toLowerCase());
    console.log(`💾 Saving to ${outputPath}...`);
    
    const savedPaths = await imageProcessor.saveImage(
      imageData,
      `${outputPath}.webp`,
      ['webp', 'avif']
    );

    console.log(`✅ ${god.name} portrait complete!`);
    savedPaths.forEach(p => console.log(`   - ${p}`));
  } catch (error) {
    console.error(`❌ Failed to generate ${god.name}:`, error);
    throw error;
  }
}

async function generateAllGods(): Promise<void> {
  console.log('═══════════════════════════════════════════════════════');
  console.log('     Norse Mythology God Portrait Generation');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`Total gods to generate: ${gods.length}`);
  console.log('');

  let successCount = 0;
  let failCount = 0;

  for (const god of gods) {
    try {
      await generateGodPortrait(god);
      successCount++;
      
      // Small delay between requests to avoid rate limiting
      if (gods.indexOf(god) < gods.length - 1) {
        console.log('⏸️  Waiting 2 seconds before next request...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      failCount++;
      console.error(`Failed to generate ${god.name}, continuing...`);
    }
  }

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('                  GENERATION COMPLETE');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`📊 Total: ${gods.length}`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateAllGods()
    .then(() => {
      console.log('\n🎉 All done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Generation failed:', error);
      process.exit(1);
    });
}
