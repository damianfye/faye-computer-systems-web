import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logoDir = path.join(__dirname, '..', 'public', 'logo');

const input = path.join(logoDir, 'FCS-logo.png');

async function makeTransparent() {
  const image = sharp(input);
  const { width, height, channels } = await image.metadata();

  // Get raw pixel data
  const raw = await image.ensureAlpha().raw().toBuffer();

  // Replace white (and near-white) pixels with transparent
  const threshold = 240; // pixels with R,G,B all above this become transparent
  for (let i = 0; i < raw.length; i += 4) {
    const r = raw[i], g = raw[i + 1], b = raw[i + 2];
    if (r >= threshold && g >= threshold && b >= threshold) {
      // Make transparent
      raw[i] = 0;
      raw[i + 1] = 0;
      raw[i + 2] = 0;
      raw[i + 3] = 0;
    }
  }

  // Save transparent version
  await sharp(raw, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(path.join(logoDir, 'FCS-logo-transparent.png'));

  console.log('Created FCS-logo-transparent.png');

  // Also create a smaller version for navbar (height 64px)
  await sharp(raw, { raw: { width, height, channels: 4 } })
    .resize({ height: 64 })
    .png()
    .toFile(path.join(logoDir, 'FCS-logo-nav.png'));

  console.log('Created FCS-logo-nav.png (64px height)');

  // Create an even smaller version (height 32px) for compact use
  await sharp(raw, { raw: { width, height, channels: 4 } })
    .resize({ height: 32 })
    .png()
    .toFile(path.join(logoDir, 'FCS-logo-sm.png'));

  console.log('Created FCS-logo-sm.png (32px height)');
}

makeTransparent().catch(console.error);
