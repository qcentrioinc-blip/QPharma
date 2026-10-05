import sharp from "sharp";
import path from "node:path";
import fs from "node:fs";

const files = process.argv.slice(2);
const outDir = path.resolve("scripts/_tmp-logo-crops");
fs.mkdirSync(outDir, { recursive: true });

for (const rel of files) {
  const file = path.resolve("public", rel);
  const meta = await sharp(file).metadata();
  const w = meta.width;
  const h = meta.height;
  // crop upper-middle where labels sit
  const left = Math.floor(w * 0.22);
  const top = Math.floor(h * 0.22);
  const width = Math.floor(w * 0.56);
  const height = Math.floor(h * 0.38);
  const name = rel.replace(/[\\/]/g, "_").replace(/\s+/g, "-");
  await sharp(file)
    .extract({ left, top, width, height })
    .resize({ width: 480 })
    .png()
    .toFile(path.join(outDir, name + ".png"));
  console.log("crop", name, `${w}x${h}`, { left, top, width, height });
}
