import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

const svgPath = path.join(publicDir, 'favicon.svg');
const svg = readFileSync(svgPath);

const sizes = [16, 32, 48, 180, 192, 512];

for (const size of sizes) {
  await sharp(svg, { density: 300 })
    .resize(size, size)
    .png()
    .toFile(path.join(publicDir, `favicon-${size}.png`));
  console.log(`Created favicon-${size}.png`);
}

// Apple touch icon
await sharp(svg, { density: 300 })
  .resize(180, 180)
  .png()
  .toFile(path.join(publicDir, 'apple-touch-icon.png'));
console.log('Created apple-touch-icon.png');
