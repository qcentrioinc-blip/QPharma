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
  const left = Math.floor(w * 0.15);
  const top = 0;
  const width = Math.floor(w * 0.7);
  const height = Math.floor(h * 0.42);
  const name = "top_" + rel.replace(/[\\/]/g, "_").replace(/\s+/g, "-");
  await sharp(file)
    .extract({ left, top, width, height })
    .resize({ width: 420 })
    .png()
    .toFile(path.join(outDir, name + ".png"));
  console.log(name);
}
