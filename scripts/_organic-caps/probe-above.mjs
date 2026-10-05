import fs from "node:fs";
import sharp from "sharp";

const manifest = fs.readFileSync("src/organic/imageManifest.ts", "utf8");
const paths = {};
for (const match of manifest.matchAll(/"([^"]+)": "([^"]+)"/g)) {
  paths[match[1]] = `public${match[2]}`;
}
const jobs = [
  ["pippali", "Ashwagandha|Kalmegh + Pippali + Vasaka", 354, 580],
  ["cats", "Liverwort|Cat's Claw + Bromelain Extract + Ashwagandha Root", 382, 520],
  ["goji", "Garcinia Cambogia|Goji Berry + Bilberry + Marigold + Carrot", 442, 760],
  ["flax", "Moringa|Flaxseed + Red Clover + Black Cohosh Root + Ginseng", 472, 680],
  ["cissus", "Liverwort|Cissus Quadrangularis + Boswellia Serrata + Piperine + Hadjod", 354, 520],
  ["manj", "Gynoestemma|Manjistha + Amla + Fennel Seed + Celery", 400, 600],
];

for (const [name, key, top, y] of jobs) {
  const { data, info } = await sharp(paths[key])
    .resize({ width: 1728, height: 2304, kernel: "lanczos3" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const w = info.width;
  const rgb = (x, yy) => {
    const i = (yy * w + x) * 4;
    return [data[i], data[i + 1], data[i + 2]];
  };
  const delta = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
  const above = 180;
  const cx = 864;
  const onCap = (x) => delta(rgb(x, y), rgb(x, above)) > 45;
  let left = cx;
  let right = cx;
  for (let x = cx; x > 40; x--) {
    if (!onCap(x)) break;
    left = x;
  }
  for (let x = cx; x < w - 40; x++) {
    if (!onCap(x)) break;
    right = x;
  }
  console.log(name, left, right, "w", right - left, "above", above);
}
