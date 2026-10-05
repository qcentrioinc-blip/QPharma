import { execFileSync } from "node:child_process";
import fs from "node:fs";
import sharp from "sharp";

const manifest = fs.readFileSync("src/organic/imageManifest.ts", "utf8");
const paths = {};
for (const match of manifest.matchAll(/"([^"]+)": "([^"]+)"/g)) paths[match[1]] = `public${match[2]}`;
const key = "Garcinia Cambogia|Goji Berry + Bilberry + Marigold + Carrot";
const rel = paths[key];
const gitBuf = execFileSync("git", ["show", `HEAD:${rel}`], { maxBuffer: 30_000_000 });
const { data, info } = await sharp(gitBuf).resize({ width: 1728, height: 2304, kernel: "lanczos3" }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const w = info.width;
const y0 = 490;
const y1 = 760;
const refY = 430;
const left = 500;
const right = 1220;
const lum = (x, y) => {
  const i = (y * w + x) * 4;
  return (data[i] + data[i + 1] + data[i + 2]) / 3;
};
for (let y = y0; y <= y1; y++) {
  const shift = 0;
  for (let x = left; x <= right; x++) {
    const edge = Math.min(x - left, right - x, y - y0, y1 - y);
    const blend = edge >= 18 ? 1 : edge / 18;
    const i = (y * w + x) * 4;
    const j = (refY * w + x) * 4;
    for (let c = 0; c < 3; c++) {
      const pred = Math.max(0, Math.min(255, data[j + c] + shift));
      data[i + c] = Math.round(data[i + c] * (1 - blend) + pred * blend);
    }
  }
}
await sharp(data, { raw: { width: w, height: info.height, channels: 4 } })
  .extract({ left: 430, top: 460, width: 860, height: 320 })
  .jpeg({ quality: 90 })
  .toFile("scripts/_organic-caps/r29/goji-solid.jpg");
const orig = await sharp(gitBuf).resize({ width: 1728, height: 2304, kernel: "lanczos3" }).jpeg({ quality: 90 }).toBuffer();
await sharp(orig)
  .extract({ left: 430, top: 460, width: 860, height: 320 })
  .jpeg({ quality: 90 })
  .toFile("scripts/_organic-caps/r29/goji-orig.jpg");
console.log("wrote");
