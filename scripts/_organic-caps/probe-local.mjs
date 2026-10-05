import fs from "node:fs";
import sharp from "sharp";

const manifest = fs.readFileSync("src/organic/imageManifest.ts", "utf8");
const paths = {};
for (const match of manifest.matchAll(/"([^"]+)": "([^"]+)"/g)) paths[match[1]] = `public${match[2]}`;

const jobs = [
  ["purple", "Guduchi|Astragalus Root + Aronia Berry + Maitake Mushroom + Holy Basil", 420, 560, 500, 1200],
  ["pippali", "Ashwagandha|Kalmegh + Pippali + Vasaka", 420, 620, 540, 1200],
  ["pink", "Magnolia Bark|Manjistha Stem + Propolis + Avocado Fruit", 430, 600, 560, 1200],
];

for (const [name, key, y0, y1, x0, x1] of jobs) {
  const { data, info } = await sharp(paths[key])
    .resize({ width: 1728, height: 2304, kernel: "lanczos3" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const orig = Buffer.from(data);
  const L = (x, y) => {
    const i = (y * w + x) * 4;
    return (orig[i] + orig[i + 1] + orig[i + 2]) / 3;
  };
  const edge = new Uint8Array(w * h);
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const local = (L(x - 14, y) + L(x + 14, y)) / 2;
      if (Math.abs(L(x, y) - local) > 6) edge[y * w + x] = 1;
    }
  }
  const grown = new Uint8Array(w * h);
  const R = 11;
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if (!edge[y * w + x]) continue;
      for (let dy = -R; dy <= R; dy++) {
        for (let dx = -R; dx <= R; dx++) {
          if (dx * dx + dy * dy > R * R) continue;
          const yy = y + dy;
          const xx = x + dx;
          if (yy < y0 || yy > y1 || xx < x0 || xx > x1) continue;
          grown[yy * w + xx] = 1;
        }
      }
    }
  }
  let n = 0;
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if (!grown[y * w + x]) continue;
      let left = null;
      let right = null;
      for (let s = R + 2; s <= 50 && !left; s += 2) {
        const xx = x - s;
        if (xx <= x0 || grown[y * w + xx]) continue;
        const i = (y * w + xx) * 4;
        left = [orig[i], orig[i + 1], orig[i + 2]];
      }
      for (let s = R + 2; s <= 50 && !right; s += 2) {
        const xx = x + s;
        if (xx >= x1 || grown[y * w + xx]) continue;
        const i = (y * w + xx) * 4;
        right = [orig[i], orig[i + 1], orig[i + 2]];
      }
      const c = left && right ? left.map((v, i) => (v + right[i]) / 2) : left || right;
      if (!c) continue;
      const i = (y * w + x) * 4;
      data[i] = c[0];
      data[i + 1] = c[1];
      data[i + 2] = c[2];
      n++;
    }
  }
  console.log(name, "filled", n);
  await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .extract({ left: x0 - 20, top: y0 - 20, width: x1 - x0 + 40, height: y1 - y0 + 40 })
    .resize({ width: 480 })
    .jpeg({ quality: 84 })
    .toFile(`scripts/_organic-caps/probe/local-${name}.jpg`);
}
