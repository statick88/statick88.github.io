/**
 * CV Data Validation Script
 * Validates cv-data.yaml against the Zod schema
 * Usage: pnpm validate:cv
 */

import { readFileSync } from 'node:fs';
import * as yaml from 'js-yaml';
import { CVDataSchema } from '../src/lib/schemas/cv-data';

const CV_DATA_PATH = 'src/data/cv-data.yaml';

function validateCVData(): void {
  console.log('🔍 Validating cv-data.yaml...\n');

  try {
    // Read YAML file
    const raw = readFileSync(CV_DATA_PATH, 'utf-8');
    const data = yaml.load(raw);

    // Validate against Zod schema
    const result = CVDataSchema.safeParse(data);

    if (result.success) {
      console.log('✅ cv-data.yaml is VALID\n');
      console.log('📊 Summary:');
      console.log(`   - Name: ${result.data.profile.name}`);
      console.log(`   - Experience: ${result.data.experience.length} positions`);
      console.log(`   - Education: ${result.data.education.length} entries`);
      console.log(`   - Skills: ${result.data.skills.length} skills`);
      console.log(`   - Languages: ${result.data.languages.length} languages`);
      console.log(`   - Certifications: ${result.data.certifications.length} certifications`);
      console.log(`   - Projects: ${result.data.projects.length} projects`);
      console.log(`   - Metrics keys: ${Object.keys(result.data.metrics).join(', ')}`);
      console.log(`   - Schema Version: ${result.data.metadata.schemaVersion}`);
      console.log(`   - Last Verified: ${result.data.metadata.lastVerified}`);
    } else {
      console.error('❌ cv-data.yaml is INVALID\n');
      console.error('Validation errors:');
      const issues = result.error.issues;
      issues.forEach((err, i) => {
        console.error(`  ${i + 1}. ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error reading/parsing cv-data.yaml:', error);
    process.exit(1);
  }
}

validateCVData();