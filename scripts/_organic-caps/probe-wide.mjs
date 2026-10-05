import fs from "node:fs";
import sharp from "sharp";

const manifest = fs.readFileSync("src/organic/imageManifest.ts", "utf8");
const paths = {};
for (const match of manifest.matchAll(/"([^"]+)": "([^"]+)"/g)) {
  paths[match[1]] = `public${match[2]}`;
}
const keys = [
  ["cats", "Liverwort|Cat's Claw + Bromelain Extract + Ashwagandha Root"],
  ["flax", "Moringa|Flaxseed + Red Clover + Black Cohosh Root + Ginseng"],
  ["cissus", "Liverwort|Cissus Quadrangularis + Boswellia Serrata + Piperine + Hadjod"],
  ["goji", "Garcinia Cambogia|Goji Berry + Bilberry + Marigold + Carrot"],
  ["manj", "Gynoestemma|Manjistha + Amla + Fennel Seed + Celery"],
  ["fennel", "Garcinia Cambogia|Fennel Seed + Bay Berry + Spinach"],
];
for (const [name, key] of keys) {
  await sharp(paths[key])
    .resize({ width: 864, height: 1152, kernel: "lanczos3" })
    .extract({ left: 0, top: 80, width: 864, height: 420 })
    .jpeg({ quality: 70 })
    .toFile(`scripts/_organic-caps/probe/wide-${name}.jpg`);
  console.log(name);
}
