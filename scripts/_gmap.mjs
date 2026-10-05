import { execFileSync } from "node:child_process";
import sharp from "sharp";

const rel = "public/product-images/Herbaceutical/Immunity booster/American Ginseng + Kalmegh + Echinacea Root + Spirulina.webp";
const headBuf = execFileSync("git", ["show", `HEAD:${rel}`], { maxBuffer: 80_000_000 });
const head = await sharp(headBuf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const cur = await sharp(rel).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const w = cur.info.width;
const h = cur.info.height;

function stretch(buf, left, top, width, height, name) {
  const out = Buffer.alloc(width * height * 3);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = ((top + y) * w + left + x) * 4;
      const l = (buf[i] + buf[i + 1] + buf[i + 2]) / 3;
      const v = Math.max(0, Math.min(255, Math.round((l - 60) * 1.6)));
      const o = (y * width + x) * 3;
      out[o] = out[o + 1] = out[o + 2] = v;
    }
  }
  return sharp(out, { raw: { width, height, channels: 3 } }).resize({ width: width * 2, kernel: "nearest" }).jpeg({ quality: 92 }).toFile(name);
}

await stretch(cur.data, 150, 360, 160, 220, "scripts/_pack-fix/gin-l-now.jpg");
await stretch(head.data, 150, 360, 160, 220, "scripts/_pack-fix/gin-l-head.jpg");
await stretch(cur.data, 560, 360, 180, 220, "scripts/_pack-fix/gin-r-now.jpg");
await stretch(head.data, 560, 360, 180, 220, "scripts/_pack-fix/gin-r-head.jpg");

let n = 0;
for (let y = 360; y < 620; y++) {
  for (let x = 140; x < 760; x++) {
    if (x > 280 && x < 580) continue;
    const i = (y * w + x) * 4;
    const d = Math.abs(cur.data[i] - head.data[i]) + Math.abs(cur.data[i + 1] - head.data[i + 1]) + Math.abs(cur.data[i + 2] - head.data[i + 2]);
    if (d > 36) n++;
  }
}
console.log("side pixels changed vs HEAD", n, "size", w, h);
