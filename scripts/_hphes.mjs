import sharp from "sharp";
const file = "scripts/_pack-fix/fix-hes.jpg";
const meta = await sharp(file).metadata();
const raw = await sharp(file).ensureAlpha().raw().toBuffer();
const blur = await sharp(file).blur(8).ensureAlpha().raw().toBuffer();
const w = meta.width;
const h = meta.height;
const out = Buffer.alloc(w * h * 3);
for (let i = 0; i < w * h; i++) {
  const l = (raw[i * 4] + raw[i * 4 + 1] + raw[i * 4 + 2]) / 3;
  const b = (blur[i * 4] + blur[i * 4 + 1] + blur[i * 4 + 2]) / 3;
  const v = Math.max(0, Math.min(255, Math.round(128 + (l - b) * 8)));
  out[i * 3] = out[i * 3 + 1] = out[i * 3 + 2] = v;
}
await sharp(out, { raw: { width: w, height: h, channels: 3 } }).jpeg({ quality: 92 }).toFile("scripts/_pack-fix/fix-hes-hp.jpg");
console.log("ok");
