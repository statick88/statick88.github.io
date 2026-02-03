import sharp from 'sharp';
import path from 'path';

async function convertImage(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .webp({ quality: 85 })
      .toFile(outputPath);
    console.log(`✓ Converted: ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`✗ Error converting ${inputPath}:`, error.message);
  }
}

console.log('Converting dashboard screenshots to webp...');

// Convert ML dashboard to project image
await convertImage('/tmp/real-estate-prediction.png', 'public/projects/real-estate-prediction.webp');

// Convert Security dashboard to project image  
await convertImage('/tmp/vulnerability-scanner.png', 'public/projects/vulnerability-scanner.webp');

console.log('Done!');
