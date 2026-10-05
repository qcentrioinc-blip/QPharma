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
  ["manj", "Gynoestemma|Manjistha + Amla + Fennel Seed + Celery", 600],
  ["fennel", "Garcinia Cambogia|Fennel Seed + Bay Berry + Spinach", 640],
];

function edges(data, w, y) {
  const L = (x) => {
    x = Math.max(2, Math.min(w - 3, x));
    const i = (y * w + x) * 4;
    return (data[i] + data[i + 1] + data[i + 2]) / 3;
  };
  const cx = Math.round(w * 0.5);
  const walk = (dir) => {
    let x = cx;
    while (dir < 0 ? x > 60 : x < w - 60) {
      const n = x + dir * 4;
      const local = L(n) - L(n - dir * 16);
      const prev = L(n - dir * 16) - L(n - dir * 32);
      if (Math.abs(n - cx) > 100 && Math.abs(local - prev) > 18) {
        const ahead = L(n + dir * 28);
        const departed = Math.abs(L(n) - L(n - dir * 16));
        const stillGone = Math.abs(ahead - L(n - dir * 16));
        if (stillGone > departed * 0.65 && stillGone > 12) return x;
      }
      x = n;
    }
    return x;
  };
  const left = walk(-1);
  const right = walk(1);
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
