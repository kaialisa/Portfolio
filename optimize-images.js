const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const imgDir = "./img";
const maxWidth = 1400;

const files = fs.readdirSync(imgDir).filter((f) => {
  if (!/\.(jpg|jpeg|png)$/i.test(f)) return false; // only process jpg/png
  const webpVersion = path.join(imgDir, path.parse(f).name + ".webp");
  return !fs.existsSync(webpVersion); // skip if webp already exists
});
console.log(`Found ${files.length} images to process...`);

Promise.all(
  files.map(async (file) => {
    const input = path.join(imgDir, file);
    const name = path.parse(file).name;
    const output = path.join(imgDir, `${name}.webp`);

    // skip if webp version already exists and is newer
    if (fs.existsSync(output) && file.endsWith(".webp")) return;

    try {
      const image = sharp(input);
      const meta = await image.metadata();
      const width = meta.width > maxWidth ? maxWidth : meta.width;

      await image
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(output);

      const before = fs.statSync(input).size;
      const after = fs.statSync(output).size;
      const saving = Math.round((1 - after / before) * 100);
      console.log(`✓ ${file} → ${name}.webp (${saving}% smaller)`);
    } catch (e) {
      console.error(`✗ ${file}: ${e.message}`);
    }
  }),
).then(() => console.log("\nDone!"));
