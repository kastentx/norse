#!/usr/bin/env node

/**
 * JSON Data Validation Script
 * 
 * Validates all JSON data files against their corresponding Zod schemas.
 * Usage: npm run validate-data
 */

import { readdir, readFile } from 'fs/promises';
import { join, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Import Zod schemas
import { GodSchema } from '../types/god.js';
import { StorySchema } from '../types/story.js';
import { RealmSchema } from '../types/realm.js';
import { SymbolSchema } from '../types/symbol.js';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_DIR = join(__dirname, '..', 'data');

interface ValidationResult {
  file: string;
  entity: string;
  valid: boolean;
  errors?: string[];
}

const results: ValidationResult[] = [];
let totalFiles = 0;
let validFiles = 0;
let invalidFiles = 0;

/**
 * Validate a single JSON file against a Zod schema
 */
async function validateFile(
  filePath: string,
  schema: any,
  entityType: string
): Promise<ValidationResult> {
  const fileName = basename(filePath);
  
  try {
    const content = await readFile(filePath, 'utf-8');
    const data = JSON.parse(content);
    
    // Validate against schema
    const result = schema.safeParse(data);
    
    if (result.success) {
      return {
        file: fileName,
        entity: entityType,
        valid: true,
      };
    } else {
      return {
        file: fileName,
        entity: entityType,
        valid: false,
        errors: result.error.issues.map(
          (issue: any) => `${issue.path.join('.')}: ${issue.message}`
        ),
      };
    }
  } catch (error) {
    return {
      file: fileName,
      entity: entityType,
      valid: false,
      errors: [error instanceof Error ? error.message : String(error)],
    };
  }
}

/**
 * Validate all files in a directory
 */
async function validateDirectory(
  dirName: string,
  schema: any,
  entityType: string,
  options?: { arrayFile?: string }
): Promise<void> {
  const dirPath = join(DATA_DIR, dirName);
  
  try {
    const files = await readdir(dirPath);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    
    console.log(`\nValidating ${jsonFiles.length} ${entityType} files...`);
    
    for (const file of jsonFiles) {
      totalFiles++;
      const filePath = join(dirPath, file);
      
      // Special handling for array files (e.g., nine-realms.json)
      const schemaToUse = options?.arrayFile === file 
        ? z.array(schema) 
        : schema;
      
      const result = await validateFile(filePath, schemaToUse, entityType);
      results.push(result);
      
      if (result.valid) {
        validFiles++;
        console.log(`  ✓ ${file}`);
      } else {
        invalidFiles++;
        console.log(`  ✗ ${file}`);
        result.errors?.forEach(err => console.log(`    → ${err}`));
      }
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.log(`  ⚠ Directory not found: ${dirName}`);
    } else {
      console.error(`  ✗ Error reading ${dirName}:`, error);
    }
  }
}

/**
 * Main validation function
 */
async function validateAll() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('        Norse Mythology Data Validation');
  console.log('═══════════════════════════════════════════════════════');
  
  // Validate each entity type
  await validateDirectory('gods', GodSchema, 'God');
  await validateDirectory('stories', StorySchema, 'Story');
  await validateDirectory('realms', RealmSchema, 'Realm', { arrayFile: 'nine-realms.json' });
  await validateDirectory('symbols', SymbolSchema, 'Symbol');
  
  // Print summary
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('                    SUMMARY');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`Total files:   ${totalFiles}`);
  console.log(`Valid:         ${validFiles} ✓`);
  console.log(`Invalid:       ${invalidFiles} ✗`);
  console.log('═══════════════════════════════════════════════════════');
  
  // Show invalid files summary
  if (invalidFiles > 0) {
    console.log('\n❌ VALIDATION FAILED');
    console.log('\nInvalid files:');
    results
      .filter(r => !r.valid)
      .forEach(r => {
        console.log(`\n  ${r.entity}: ${r.file}`);
        r.errors?.forEach(err => console.log(`    → ${err}`));
      });
    process.exit(1);
  } else {
    console.log('\n✅ ALL FILES VALID');
    process.exit(0);
  }
}

// Run validation
validateAll().catch(error => {
  console.error('Fatal error during validation:', error);
  process.exit(1);
});
