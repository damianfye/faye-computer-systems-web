import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logoDir = path.join(__dirname, '..', 'public', 'logo');

const input = path.join(logoDir, 'FCS-logo-final.png');

async function makeTransparent() {
  const image = sharp(input);
  const { width, height } = await image.metadata();

  const raw = await image.ensureAlpha().raw().toBuffer();

  const threshold = 240;
  for (let i = 0; i < raw.length; i += 4) {
    const r = raw[i], g = raw[i + 1], b = raw[i + 2];
    if (r >= threshold && g >= threshold && b >= threshold) {
      raw[i] = 0;
      raw[i + 1] = 0;
      raw[i + 2] = 0;
      raw[i + 3] = 0;
    }
  }

  await sharp(raw, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(path.join(logoDir, 'FCS-logo-final-transparent.png'));
  console.log('Created FCS-logo-final-transparent.png');

  await sharp(raw, { raw: { width, height, channels: 4 } })
    .resize({ height: 64 })
    .png()
    .toFile(path.join(logoDir, 'FCS-logo-final-nav.png'));
  console.log('Created FCS-logo-final-nav.png');

  await sharp(raw, { raw: { width, height, channels: 4 } })
    .resize({ height: 32 })
    .png()
    .toFile(path.join(logoDir, 'FCS-logo-final-sm.png'));
  console.log('Created FCS-logo-final-sm.png');
}

makeTransparent().catch(console.error);
