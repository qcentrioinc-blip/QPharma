import fs from "node:fs";
import sharp from "sharp";

const manifest = fs.readFileSync("src/organic/imageManifest.ts", "utf8");
const paths = {};
for (const match of manifest.matchAll(/"([^"]+)": "([^"]+)"/g)) paths[match[1]] = `public${match[2]}`;

const jobs = [
  ["pippali", "Ashwagandha|Kalmegh + Pippali + Vasaka", 580],
  ["cats", "Liverwort|Cat's Claw + Bromelain Extract + Ashwagandha Root", 498],
  ["goji", "Garcinia Cambogia|Goji Berry + Bilberry + Marigold + Carrot", 690],
  ["flax", "Moringa|Flaxseed + Red Clover + Black Cohosh Root + Ginseng", 674],
  ["cissus", "Liverwort|Cissus Quadrangularis + Boswellia Serrata + Piperine + Hadjod", 558],
  ["manj", "Gynoestemma|Manjistha + Amla + Fennel Seed + Celery", 600],
  ["fennel", "Garcinia Cambogia|Fennel Seed + Bay Berry + Spinach", 640],
  ["iron", "Holy Basil|Iron + Folic Acid + Vitamin B12 + Vitamin B6 + Zinc", 560],
];

function edges(data, w, y) {
  const rgb = (x) => {
    x = Math.max(0, Math.min(w - 1, x));
    const i = (y * w + x) * 4;
    return [data[i], data[i + 1], data[i + 2]];
  };
  const delta = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
  const cx = Math.round(w / 2);
  const seed = rgb(cx);
  const seek = (dir) => {
    for (let x = cx; dir < 0 ? x > 40 : x < w - 40; x += dir) {
      const jump = delta(rgb(x), rgb(x - dir * 8));
      if (jump > 80 && delta(rgb(x), seed) > 60 && Math.abs(x - cx) > 80) return x - dir;
    }
    return null;
  };
  let left = seek(-1);
  let right = seek(1);
  if (left == null && right == null) return "none";
  if (left == null) left = cx - (right - cx);
  if (right == null) right = cx + (cx - left);
  left = Math.max(20, left);
  right = Math.min(w - 20, right);
  return `${left}-${right} w ${right - left}`;
}

for (const [name, key, y] of jobs) {
  const { data, info } = await sharp(paths[key])
    .resize({ width: 1728, height: 2304, kernel: "lanczos3" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  console.log(name, edges(data, info.width, y));
}
