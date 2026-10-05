import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const rels = [
  "public/product-images/Organic/Cinnamon/Kutki + Schisandra Berry + Nigella Sativa.v34.webp",
  "public/product-images/Organic/Moringa/Evening Primrose + Nettle Leaf + Valerian + Wild Yam.v34.webp",
  "public/product-images/Organic/Moringa/Motherwort + Passion Flower + Valerian.v34.webp",
  "public/product-images/Organic/Liverwort/Rosehip Powder + Ginger + Curcumin + Maca Root.webp",
];

for (const rel of rels) {
  const live = await sharp(rel).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const gitBuf = execFileSync("git", ["show", `HEAD:${rel.replaceAll("\\", "/")}`], { maxBuffer: 20_000_000 });
  const head = await sharp(gitBuf).resize({ width: live.info.width, height: live.info.height, kernel: "lanczos3" }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = live.info.width;
  const h = live.info.height;
  let cap = 0;
  let label = 0;
  let capN = 0;
  let labelN = 0;
  const split = Math.round(h * 0.42);
  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      const i = (y * w + x) * 4;
      const d = Math.abs(live.data[i] - head.data[i]) + Math.abs(live.data[i + 1] - head.data[i + 1]) + Math.abs(live.data[i + 2] - head.data[i + 2]);
      if (y < split) {
        capN++;
        if (d > 24) cap++;
      } else {
        labelN++;
        if (d > 24) label++;
      }
    }
  }
  console.log(path.basename(rel).slice(0, 40), live.info.width, "cap", ((cap / capN) * 100).toFixed(1) + "%", "label", ((label / labelN) * 100).toFixed(1) + "%", "live", fs.statSync(rel).size);
}
