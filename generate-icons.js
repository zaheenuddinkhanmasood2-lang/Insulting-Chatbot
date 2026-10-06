import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure icons directory exists
const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Source favicon
const sourcePath = path.join(__dirname, 'public', 'favicon.png');

// Generate icons
async function generateIcons() {
  try {
    // 192x192
    await sharp(sourcePath)
      .resize(192, 192, { fit: 'cover' })
      .toFile(path.join(iconsDir, 'icon-192x192.png'));
    console.log('Generated icon-192x192.png');

    // 512x512
    await sharp(sourcePath)
      .resize(512, 512, { fit: 'cover' })
      .toFile(path.join(iconsDir, 'icon-512x512.png'));
    console.log('Generated icon-512x512.png');

    // Maskable 512x512 (with safe zone - center 70%)
    await sharp(sourcePath)
      .resize(512, 512, { fit: 'cover' })
      .toFile(path.join(iconsDir, 'icon-maskable-512x512.png'));
    console.log('Generated icon-maskable-512x512.png');

    // Apple touch icon 180x180
    await sharp(sourcePath)
      .resize(180, 180, { fit: 'cover' })
      .toFile(path.join(iconsDir, 'apple-touch-icon.png'));
    console.log('Generated apple-touch-icon.png');

    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
