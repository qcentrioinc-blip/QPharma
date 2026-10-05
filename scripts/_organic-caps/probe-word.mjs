import fs from "node:fs";
import sharp from "sharp";

const manifest = fs.readFileSync("src/organic/imageManifest.ts", "utf8");
const paths = {};
for (const match of manifest.matchAll(/"([^"]+)": "([^"]+)"/g)) {
  paths[match[1]] = `public${match[2]}`;
}
const jobs = [
  ["pippali", "Ashwagandha|Kalmegh + Pippali + Vasaka", 450, 510],
  ["cats", "Liverwort|Cat's Claw + Bromelain Extract + Ashwagandha Root", 430, 490],
  ["goji", "Garcinia Cambogia|Goji Berry + Bilberry + Marigold + Carrot", 580, 670],
  ["flax", "Moringa|Flaxseed + Red Clover + Black Cohosh Root + Ginseng", 490, 600],
  ["cissus", "Liverwort|Cissus Quadrangularis + Boswellia Serrata + Piperine + Hadjod", 420, 490],
  ["manj", "Gynoestemma|Manjistha + Amla + Fennel Seed + Celery", 470, 530],
  ["fennel", "Garcinia Cambogia|Fennel Seed + Bay Berry + Spinach", 500, 640],
];

for (const [name, key, y0, y1] of jobs) {
  const { data, info } = await sharp(paths[key])
    .resize({ width: 1728, height: 2304, kernel: "lanczos3" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const w = info.width;
  const L = (x, y) => {
    const i = (y * w + x) * 4;
    return (data[i] + data[i + 1] + data[i + 2]) / 3;
  };
  let minX = w;
  let maxX = 0;
  const counts = new Map();
  for (let y = y0; y <= y1; y += 2) {
    for (let x = 200; x < w - 200; x += 2) {
      const local = (L(x - 10, y) + L(x + 10, y)) / 2;
      if (Math.abs(local - L(x, y)) > 7) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        counts.set(x, (counts.get(x) || 0) + 1);
      }
    }
  }
  const xs = [...counts.entries()].filter(([, n]) => n > 4).map(([x]) => x).sort((a, b) => a - b);
  const left = xs[0];
  const right = xs[xs.length - 1];
  console.log(name, "ink", left, right, "w", right - left, "mid", Math.round((left + right) / 2));
}
