import fs from "node:fs";
import sharp from "sharp";

const manifest = fs.readFileSync("src/organic/imageManifest.ts", "utf8");
const paths = {};
for (const match of manifest.matchAll(/"([^"]+)": "([^"]+)"/g)) {
  paths[match[1]] = `public${match[2]}`;
}

const keys = [
  "Ashwagandha|Kalmegh + Pippali + Vasaka",
  "Liverwort|Cat's Claw + Bromelain Extract + Ashwagandha Root",
  "Garcinia Cambogia|Goji Berry + Bilberry + Marigold + Carrot",
  "Gynoestemma|Manjistha + Amla + Fennel Seed + Celery",
  "Moringa|Flaxseed + Red Clover + Black Cohosh Root + Ginseng",
  "Liverwort|Cissus Quadrangularis + Boswellia Serrata + Piperine + Hadjod",
  "Holy Basil|Iron + Folic Acid + Vitamin B12 + Vitamin B6 + Zinc",
];

for (const key of keys) {
  const file = paths[key];
  const { data, info } = await sharp(file)
    .resize({ width: 1728, height: 2304, kernel: "lanczos3" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const w = info.width;
  const L = (x, y) => {
    const i = (y * w + x) * 4;
    return (data[i] + data[i + 1] + data[i + 2]) / 3;
  };
  const energy = (y) => {
    let e = 0;
    let c = 0;
    for (let x = 640; x <= 1080; x += 3) {
      e += Math.abs(L(x, y) - L(x + 6, y));
      c++;
    }
    return e / c;
  };
  const hot = [];
  for (let y = 280; y <= 860; y += 8) {
    const e = energy(y);
    if (e > 2.4) hot.push(`${y}:${e.toFixed(1)}`);
  }
  console.log("\n" + key.split("|")[1].slice(0, 28));
  console.log(hot.join(" "));
}
