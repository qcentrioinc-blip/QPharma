import fs from "node:fs";
import sharp from "sharp";

const manifest = fs.readFileSync("src/organic/imageManifest.ts", "utf8");
const paths = {};
for (const match of manifest.matchAll(/"([^"]+)": "([^"]+)"/g)) {
  paths[match[1]] = `public${match[2]}`;
}

const jobs = [
  ["pippali", "Ashwagandha|Kalmegh + Pippali + Vasaka", 580],
  ["cats", "Liverwort|Cat's Claw + Bromelain Extract + Ashwagandha Root", 498],
  ["goji", "Garcinia Cambogia|Goji Berry + Bilberry + Marigold + Carrot", 690],
  ["cissus", "Liverwort|Cissus Quadrangularis + Boswellia Serrata + Piperine + Hadjod", 558],
  ["flax", "Moringa|Flaxseed + Red Clover + Black Cohosh Root + Ginseng", 674],
  ["manj", "Gynoestemma|Manjistha + Amla + Fennel Seed + Celery", 544],
];

function edgesOf(data, w, y) {
  const rgb = (x) => {
    const i = (y * w + x) * 4;
    return [data[i], data[i + 1], data[i + 2]];
  };
  const L = (x) => (rgb(x)[0] + rgb(x)[1] + rgb(x)[2]) / 3;
  const delta = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
  const cx = Math.round(w * 0.5);
  const seed = rgb(cx);
  const seedL = L(cx);
  const walk = (dir) => {
    let lastGood = cx;
    let run = 0;
    for (let x = cx; dir < 0 ? x > 24 : x < w - 24; x += dir) {
      const jump = Math.abs(L(x) - L(x - dir * 6));
      const fromSeed = delta(rgb(x), seed);
      if (jump > 16 && fromSeed > 50) {
        run++;
        if (run >= 2) return lastGood;
      } else {
        run = 0;
        lastGood = x;
      }
      if (fromSeed > 85 && Math.abs(L(x) - seedL) > 26) return x - dir * 4;
    }
    return lastGood;
  };
  const left = walk(-1);
  const right = walk(1);
  return { left, right, width: right - left, seedL: seedL.toFixed(0) };
}

for (const [name, key, y] of jobs) {
  const { data, info } = await sharp(paths[key])
    .resize({ width: 1728, height: 2304, kernel: "lanczos3" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  console.log(name, JSON.stringify(edgesOf(data, info.width, y)));
}
