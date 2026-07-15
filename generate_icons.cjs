const sharp = require('sharp');
const fs = require('fs');
const pngToIco = require('png-to-ico');

async function generate() {
  const svgBuffer = fs.readFileSync('public/favicon.svg');

  const sizes = [16, 32, 48, 64, 180, 192, 512];
  
  for (const size of sizes) {
    let name = '';
    if (size === 16 || size === 32) name = `favicon-${size}x${size}.png`;
    else if (size === 180) name = `apple-touch-icon.png`;
    else if (size === 192 || size === 512) name = `android-chrome-${size}x${size}.png`;
    else name = `icon-${size}.png`;

    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(`public/${name}`);
    console.log(`Generated public/${name}`);
  }

  // Generate ICO from 64x64 PNG
  pngToIco('public/icon-64.png').then(buf => {
    fs.writeFileSync('public/favicon.ico', buf);
    console.log('Generated public/favicon.ico');
    // Clean up temporary 64 and 48
    fs.unlinkSync('public/icon-64.png');
    fs.unlinkSync('public/icon-48.png');
  }).catch(console.error);
}

generate().catch(console.error);
