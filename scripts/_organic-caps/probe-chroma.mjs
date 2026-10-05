import fs from "node:fs";
import sharp from "sharp";

const manifest = fs.readFileSync("src/organic/imageManifest.ts", "utf8");
const paths = {};
for (const match of manifest.matchAll(/"([^"]+)": "([^"]+)"/g)) {
  paths[match[1]] = `public${match[2]}`;
}
const jobs = [
  ["cats", "Liverwort|Cat's Claw + Bromelain Extract + Ashwagandha Root", 520],
  ["flax", "Moringa|Flaxseed + Red Clover + Black Cohosh Root + Ginseng", 680],
  ["pippali", "Ashwagandha|Kalmegh + Pippali + Vasaka", 580],
  ["goji", "Garcinia Cambogia|Goji Berry + Bilberry + Marigold + Carrot", 760],
];
for (const [name, key, y] of jobs) {
  const { data, info } = await sharp(paths[key])
    .resize({ width: 1728, height: 2304, kernel: "lanczos3" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const w = info.width;
  let row = `${name} `;
  for (let x = 200; x <= 1500; x += 40) {
    const i = (y * w + x) * 4;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const c = Math.max(r, g, b) - Math.min(r, g, b);
    row += `${x}:${c} `;
  }
  console.log(row);
}
