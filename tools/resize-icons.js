#!/usr/bin/env node

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceIcon = path.join(__dirname, '../public/icon.webp');
const publicDir = path.join(__dirname, '../public');

const sizes = [
  { name: 'favicon.ico', size: 32, format: 'png' }, // ICO will be created from PNG
  { name: 'icon-192.png', size: 192, format: 'png' },
  { name: 'icon-512.png', size: 512, format: 'png' },
  { name: 'apple-touch-icon.png', size: 180, format: 'png' },
];

async function generateIcons() {
  console.log('🎨 Generating icon sizes from icon.webp...\n');

  for (const config of sizes) {
    const outputPath = path.join(publicDir, config.name);
    
    try {
      await sharp(sourceIcon)
        .resize(config.size, config.size, {
          fit: 'contain',
          background: { r: 26, g: 26, b: 46, alpha: 1 } // Norse night background
        })
        .toFormat(config.format)
        .toFile(outputPath);
      
      const stats = fs.statSync(outputPath);
      console.log(`✅ ${config.name} (${config.size}x${config.size}) - ${(stats.size / 1024).toFixed(1)}KB`);
    } catch (error) {
      console.error(`❌ Failed to generate ${config.name}:`, error.message);
    }
  }

  // Create favicon.ico from the 32px PNG
  console.log('\n📦 Creating favicon.ico...');
  const faviconPng = path.join(publicDir, 'favicon-32.png');
  const faviconIco = path.join(publicDir, 'favicon.ico');
  
  try {
    await sharp(sourceIcon)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 26, g: 26, b: 46, alpha: 1 }
      })
      .toFormat('png')
      .toFile(faviconPng);
    
    // Copy as .ico (browsers accept PNG with .ico extension)
    fs.copyFileSync(faviconPng, faviconIco);
    fs.unlinkSync(faviconPng); // Remove temp file
    
    const stats = fs.statSync(faviconIco);
    console.log(`✅ favicon.ico (32x32) - ${(stats.size / 1024).toFixed(1)}KB`);
  } catch (error) {
    console.error(`❌ Failed to create favicon.ico:`, error.message);
  }

  console.log('\n🎉 All icons generated successfully!');
}

generateIcons().catch(console.error);
