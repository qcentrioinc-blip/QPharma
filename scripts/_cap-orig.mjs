import { execFileSync } from "node:child_process";
import fs from "node:fs";
import sharp from "sharp";

const items = [
  ["mw", "public/product-images/Organic/Moringa/Motherwort + Passion Flower + Valerian.v34.webp", 400, 780],
  ["goji", "public/product-images/Organic/Garcinia Cambogia/Goji Berry + Bilberry + Marigold + Carrot.webp", 420, 840],
  ["fennel", "public/product-images/Organic/Garcinia Cambogia/Fennel Seed + Bay Berry + Spinach.webp", 400, 720],
  ["mucuna", "public/product-images/Organic/Gymnema Sylvestre/Ashwagandha Root + Mucuna Pruriens + Safed Musli.webp", 400, 800],
  ["shilajit", "public/product-images/Organic/Gymnema Sylvestre/Shilajit + Ashwagandha Root + Ginseng.webp", 460, 820],
  ["elder", "public/product-images/Organic/Horsetail/Elderberry + Green Tea + Beetroot.v34.webp", 220, 560],
  ["bitter", "public/product-images/Organic/Liquorice/Bitter Melon + Lucuma + Banaba Leaf.webp", 320, 680],
];

fs.mkdirSync("scripts/_organic-caps/orig", { recursive: true });
for (const [name, rel, y0, y1] of items) {
  const gitBuf = execFileSync("git", ["show", `HEAD:${rel}`], { maxBuffer: 30_000_000 });
  const { data, info } = await sharp(gitBuf)
    .resize({ width: 1728, height: 2304, kernel: "lanczos3" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const top = Math.max(0, y0);
  const height = Math.min(h - top, y1 - top);
  await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .extract({ left: 400, top, width: 960, height })
    .resize({ width: 640 })
    .jpeg({ quality: 86 })
    .toFile(`scripts/_organic-caps/orig/${name}.jpg`);
  let peak = 0;
  let peakY = 0;
  for (let y = top; y < top + height; y += 4) {
    let e = 0;
    let c = 0;
    for (let x = 560; x < 1160; x += 4) {
      const i = (y * w + x) * 4;
      const j = (y * w + x + 6) * 4;
      const a = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const b = (data[j] + data[j + 1] + data[j + 2]) / 3;
      e += Math.abs(a - b);
      c++;
    }
    if (e / c > peak) {
      peak = e / c;
      peakY = y;
    }
  }
  console.log(name, "peak", peak.toFixed(2), "y", peakY);
}
