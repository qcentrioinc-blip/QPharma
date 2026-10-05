import { execFileSync } from "node:child_process";
import sharp from "sharp";

const rel = "public/product-images/Nutraceutical/Respiratory Health/Hesperidin + Ellagic Acid + Elderberry Extract + Grapeseed Extract + Zinc.webp";
const headBuf = execFileSync("git", ["show", `HEAD:${rel}`], { maxBuffer: 80_000_000 });
const head = await sharp(headBuf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const cur = await sharp(rel).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const w = cur.info.width;
const ink = (r, g, b) => g > r + 16 && g > 70 && r < 180;
let n = 0, minx = w, maxx = 0, miny = 9999, maxy = 0;
const rows = [];
for (let y = 370; y <= 520; y++) {
  let c = 0, a = w, b = 0;
  for (let x = 300; x <= 620; x++) {
    const i = (y * w + x) * 4;
    const cr = cur.data[i], cg = cur.data[i + 1], cb = cur.data[i + 2];
    const hr = head.data[i], hg = head.data[i + 1], hb = head.data[i + 2];
    if (ink(cr, cg, cb)) continue;
    const cl = (cr + cg + cb) / 3;
    const hl = (hr + hg + hb) / 3;
    if (cl < 155 || hl < 140) continue;
    if (ink(hr, hg, hb)) continue;
    const shift = (cb - cg) - (hb - hg);
    if (shift < 8) continue;
    c++; n++;
    if (x < minx) minx = x;
    if (x > maxx) maxx = x;
    if (y < miny) miny = y;
    if (y > maxy) maxy = y;
    if (x < a) a = x;
    if (x > b) b = x;
  }
  if (c > 10) rows.push(`${y} n${c} ${a}-${b}`);
}
console.log({ n, minx, maxx, miny, maxy });
console.log(rows.join("\n"));
