import fs from "node:fs";
import sharp from "sharp";

const manifest = fs.readFileSync("src/organic/imageManifest.ts", "utf8");
const paths = {};
for (const match of manifest.matchAll(/"([^"]+)": "([^"]+)"/g)) paths[match[1]] = `public${match[2]}`;

const jobs = [
  ["purple", "Guduchi|Astragalus Root + Aronia Berry + Maitake Mushroom + Holy Basil", 554, 410, 530, 480, 1250],
  ["pippali", "Ashwagandha|Kalmegh + Pippali + Vasaka", 580, 420, 630, 540, 1220],
  ["pink", "Magnolia Bark|Manjistha Stem + Propolis + Avocado Fruit", 586, 430, 620, 660, 1280],
  ["cats", "Liverwort|Cat's Claw + Bromelain Extract + Ashwagandha Root", 498, 410, 590, 500, 1220],
];

for (const [name, key, donor, y0, y1, x0, x1] of jobs) {
  const { data, info } = await sharp(paths[key])
    .resize({ width: 1728, height: 2304, kernel: "lanczos3" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const orig = Buffer.from(data);
  const side = (y) => {
    const acc = [0, 0, 0];
    let n = 0;
    for (const x of [x0 + 8, x0 + 20, x0 + 32, x1 - 8, x1 - 20, x1 - 32]) {
      const i = (y * w + x) * 4;
      acc[0] += orig[i];
      acc[1] += orig[i + 1];
      acc[2] += orig[i + 2];
      n++;
    }
    return acc.map((v) => v / n);
  };
  const donorSide = side(donor);
  let n = 0;
  for (let y = y0; y <= y1; y++) {
    const shift = side(y).map((v, c) => v - donorSide[c]);
    for (let x = x0; x <= x1; x++) {
      const i = (y * w + x) * 4;
      const j = (donor * w + x) * 4;
      const target = [0, 1, 2].map((c) => Math.max(0, Math.min(255, orig[j + c] + shift[c])));
      const d = target.reduce((s, v, c) => s + Math.abs(orig[i + c] - v), 0);
      if (d < 14) continue;
      data[i] = target[0];
      data[i + 1] = target[1];
      data[i + 2] = target[2];
      n++;
    }
  }
  console.log(name, "replaced", n);
  await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .extract({ left: Math.max(0, x0 - 10), top: Math.max(0, y0 - 16), width: Math.min(w, x1 - x0 + 20), height: y1 - y0 + 32 })
    .resize({ width: 460 })
    .jpeg({ quality: 84 })
    .toFile(`scripts/_organic-caps/probe/shift-${name}.jpg`);
}
