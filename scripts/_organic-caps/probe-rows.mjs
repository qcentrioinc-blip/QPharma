import fs from "node:fs";
import sharp from "sharp";

const manifest = fs.readFileSync("src/organic/imageManifest.ts", "utf8");
const paths = {};
for (const match of manifest.matchAll(/"([^"]+)": "([^"]+)"/g)) {
  paths[match[1]] = `public${match[2]}`;
}
const jobs = [
  ["pippali", "Ashwagandha|Kalmegh + Pippali + Vasaka", 580],
  ["cats", "Liverwort|Cat's Claw + Bromelain Extract + Ashwagandha Root", 520],
  ["goji", "Garcinia Cambogia|Goji Berry + Bilberry + Marigold + Carrot", 760],
  ["flax", "Moringa|Flaxseed + Red Clover + Black Cohosh Root + Ginseng", 680],
  ["cissus", "Liverwort|Cissus Quadrangularis + Boswellia Serrata + Piperine + Hadjod", 520],
];
for (const [name, key, y] of jobs) {
  const { data, info } = await sharp(paths[key])
    .resize({ width: 1728, height: 2304, kernel: "lanczos3" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const w = info.width;
  const L = (x) => {
    const i = (y * w + x) * 4;
    return (data[i] + data[i + 1] + data[i + 2]) / 3;
  };
  let row = name + " ";
  for (let x = 80; x < 1680; x += 40) row += `${x}:${L(x).toFixed(0)} `;
  console.log(row);
}
