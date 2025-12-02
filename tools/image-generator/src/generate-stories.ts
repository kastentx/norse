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
  // Binding of Fenrir
  {
    name: 'Binding of Fenrir - Overview',
    fileName: 'fenrir-full',
    scene: 'The great wolf Fenrir bound with Gleipnir, the magical ribbon, on a remote island',
    mood: 'tense, fateful, the moment before Ragnarok is sealed'
  },
  {
    name: 'Binding of Fenrir - Young Wolf',
    fileName: 'fenrir-young',
    scene: 'Young Fenrir as a pup among the Aesir, growing rapidly and menacingly',
    mood: 'ominous growth, gods\' growing fear'
  },
  {
    name: 'Binding of Fenrir - Breaking Chains',
    fileName: 'fenrir-chains',
    scene: 'Fenrir breaking through iron chains Leyding and Dromi with ease',
    mood: 'powerful, unstoppable force, gods\' desperation'
  },
  {
    name: 'Binding of Fenrir - Tyr\'s Sacrifice',
    fileName: 'fenrir-tyr',
    scene: 'Tyr placing his hand in Fenrir\'s mouth as the binding is completed',
    mood: 'heroic sacrifice, betrayal, Tyr\'s bravery'
  },
  // Creation of the World
  {
    name: 'Creation - Overview',
    fileName: 'creation-full',
    scene: 'The cosmic creation from Ymir\'s body, Odin and his brothers shaping the world',
    mood: 'primordial, epic genesis moment'
  },
  {
    name: 'Creation - The Void',
    fileName: 'creation-void',
    scene: 'Ginnungagap, the primordial void between fire and ice',
    mood: 'mysterious, before creation, chaos'
  },
  {
    name: 'Creation - Ymir',
    fileName: 'creation-ymir',
    scene: 'The frost giant Ymir emerging from the melting ice',
    mood: 'ancient, primal power, birth of first being'
  },
  {
    name: 'Creation - Midgard',
    fileName: 'creation-midgard',
    scene: 'Midgard being formed from Ymir\'s flesh, mountains from bones',
    mood: 'transformation, divine craftsmanship'
  },
  {
    name: 'Creation - First Humans',
    fileName: 'creation-humans',
    scene: 'Odin, Vili, and Ve giving life to Ask and Embla, the first humans',
    mood: 'gift of life, beginning of humanity'
  },
  // Theft of Mjolnir
  {
    name: 'Theft of Mjolnir - Overview',
    fileName: 'mjolnir-full',
    scene: 'Thor discovers Mjolnir is missing, Loki reports it stolen by Thrym',
    mood: 'alarm, anger, comedic desperation'
  },
  {
    name: 'Theft of Mjolnir - Discovery',
    fileName: 'mjolnir-missing',
    scene: 'Thor waking to find Mjolnir gone, searching frantically',
    mood: 'panic, vulnerability without his hammer'
  },
  {
    name: 'Theft of Mjolnir - Disguise',
    fileName: 'mjolnir-disguise',
    scene: 'Thor dressed as Freyja in bridal gown, Loki as bridesmaid',
    mood: 'comedic, absurd, Thor\'s reluctance'
  },
  {
    name: 'Theft of Mjolnir - Revealed',
    fileName: 'mjolnir-revealed',
    scene: 'Thor seizing Mjolnir at the wedding feast, revealing himself',
    mood: 'triumphant, explosive violence, Thrym\'s doom'
  },
  // Thor's Journey to Utgard
  {
    name: 'Thor\'s Journey - Overview',
    fileName: 'utgard-full',
    scene: 'The massive halls of Utgard-Loki, Thor and companions tiny before the giant king',
    mood: 'overwhelming scale, illusion, humbling'
  },
  {
    name: 'Thor\'s Journey - The Goats',
    fileName: 'utgard-goats',
    scene: 'Thor killing and resurrecting his goats, Thjalfi\'s error with the bone',
    mood: 'magical, consequence of breaking rules'
  },
  {
    name: 'Thor\'s Journey - Skrymir',
    fileName: 'utgard-skrymir',
    scene: 'Thor, Loki, and servants meeting the massive giant Skrymir in the forest',
    mood: 'intimidating scale, frustration at unopenable food sack'
  },
  {
    name: 'Thor\'s Journey - Drinking Contest',
    fileName: 'utgard-drinking',
    scene: 'Thor attempting to drain the drinking horn, unknowingly drinking the ocean',
    mood: 'determined effort, confusion at failure'
  },
  {
    name: 'Thor\'s Journey - Revelation',
    fileName: 'utgard-revelation',
    scene: 'Utgard-Loki revealing the illusions: horn was the ocean, cat was Jormungandr',
    mood: 'amazement, revelation of true power, respect'
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
  console.log('     Norse Mythology Story Illustrations');
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
