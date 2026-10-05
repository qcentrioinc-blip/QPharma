import { execFileSync } from "node:child_process";
import sharp from "sharp";

const hes = "public/product-images/Nutraceutical/Respiratory Health/Hesperidin + Ellagic Acid + Elderberry Extract + Grapeseed Extract + Zinc.webp";
const headBuf = execFileSync("git", ["show", `HEAD:${hes}`], { maxBuffer: 80_000_000 });
const head = await sharp(headBuf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const cur = await sharp(hes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const w = cur.info.width;

function sample(label, buf) {
  console.log("\n" + label);
  for (let y of [396, 412, 428, 444, 468, 488]) {
    const parts = [];
    for (let x = 360; x <= 580; x += 16) {
      const i = (y * w + x) * 4;
      const r = buf[i], g = buf[i + 1], b = buf[i + 2];
      const ink = g > r + 16 && r < 170;
      parts.push(ink ? `${x}:INK` : `${x}:${r - g}/${b - g}`);
    }
    console.log(y, parts.join(" "));
  }
}
sample("HEAD r-g / b-g", head.data);
sample("NOW r-g / b-g", cur.data);

const raw = await sharp(hes).extract({ left: 300, top: 370, width: 320, height: 180 }).ensureAlpha().raw().toBuffer();
const blur = await sharp(hes).extract({ left: 300, top: 370, width: 320, height: 180 }).blur(10).ensureAlpha().raw().toBuffer();
const width = 320, height = 180;
const out = Buffer.alloc(width * height * 3);
for (let i = 0; i < width * height; i++) {
  const l = (raw[i * 4] + raw[i * 4 + 1] + raw[i * 4 + 2]) / 3;
  const b = (blur[i * 4] + blur[i * 4 + 1] + blur[i * 4 + 2]) / 3;
  const v = Math.max(0, Math.min(255, Math.round(128 + (l - b) * 8)));
  out[i * 3] = out[i * 3 + 1] = out[i * 3 + 2] = v;
}
await sharp(out, { raw: { width, height, channels: 3 } }).jpeg({ quality: 92 }).toFile("scripts/_pack-fix/hes-hp.jpg");
console.log("hp written");
