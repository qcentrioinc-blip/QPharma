import { execFileSync } from "node:child_process";
import sharp from "sharp";
const rel = "public/product-images/Nutraceutical/Respiratory Health/Hesperidin + Ellagic Acid + Elderberry Extract + Grapeseed Extract + Zinc.webp";
const buf = execFileSync("git", ["show", `HEAD:${rel}`], { maxBuffer: 80_000_000 });
const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const w = info.width;
let n = 0, minx = w, maxx = 0, miny = 9999, maxy = 0;
for (let y = 380; y <= 520; y++) {
  let c = 0;
  for (let x = 320; x <= 600; x++) {
    const i = (y * w + x) * 4;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const l = (r + g + b) / 3;
    if (l > 175) continue;
    if (g < r + 4) continue;
    n++; c++;
    if (x < minx) minx = x;
    if (x > maxx) maxx = x;
    if (y < miny) miny = y;
    if (y > maxy) maxy = y;
  }
  if (c > 20 && y % 6 === 0) console.log(y, c);
}
console.log({ n, minx, maxx, miny, maxy });
