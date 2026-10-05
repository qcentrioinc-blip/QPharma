import { execFileSync } from "node:child_process";
import sharp from "sharp";

const hes = "public/product-images/Nutraceutical/Respiratory Health/Hesperidin + Ellagic Acid + Elderberry Extract + Grapeseed Extract + Zinc.webp";
const head = execFileSync("git", ["show", `HEAD:${hes}`], { maxBuffer: 80_000_000 });
const a = await sharp(head).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const b = await sharp(hes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const w = a.info.width;
const h = a.info.height;
const out = Buffer.alloc(w * h * 3);
let n = 0, minx = w, maxx = 0, miny = h, maxy = 0;
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4;
    const d = Math.abs(a.data[i] - b.data[i]) + Math.abs(a.data[i + 1] - b.data[i + 1]) + Math.abs(a.data[i + 2] - b.data[i + 2]);
    const o = (y * w + x) * 3;
    const v = d > 30 ? 255 : 0;
    out[o] = out[o + 1] = out[o + 2] = v;
    if (d > 40 && x > 250 && x < 650 && y > 350 && y < 560) {
      n++;
      if (x < minx) minx = x;
      if (x > maxx) maxx = x;
      if (y < miny) miny = y;
      if (y > maxy) maxy = y;
    }
  }
}
console.log("hes diff in logo band", { n, minx, maxx, miny, maxy });
await sharp(out, { raw: { width: w, height: h, channels: 3 } })
  .extract({ left: 260, top: 340, width: 400, height: 240 })
  .jpeg({ quality: 90 })
  .toFile("scripts/_pack-fix/hes-diff.jpg");

const { data, info } = b;
console.log("y x:r,g,b  (skipping teal ink)");
for (let y = 400; y <= 490; y += 8) {
  const parts = [];
  for (let x = 320; x <= 600; x += 20) {
    const i = (y * info.width + x) * 4;
    const r = data[i], g = data[i + 1], bl = data[i + 2];
    if (g > r + 16 && r < 170) { parts.push(`${x}:INK`); continue; }
    parts.push(`${x}:${r},${g},${bl}`);
  }
  console.log(y, parts.join(" "));
}
