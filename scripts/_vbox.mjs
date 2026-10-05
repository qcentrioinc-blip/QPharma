import sharp from "sharp";
const file = "public/product-images/Nutraceutical/Respiratory Health/Hesperidin + Ellagic Acid + Elderberry Extract + Grapeseed Extract + Zinc.webp";
const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const w = info.width;
const rows = [];
for (let y = 370; y <= 530; y++) {
  let c = 0, a = w, b = 0;
  for (let x = 300; x <= 640; x++) {
    const i = (y * w + x) * 4;
    const r = data[i], g = data[i + 1], bl = data[i + 2];
    const lum = (r + g + bl) / 3;
    if (lum < 165 || lum > 245) continue;
    if (g > r + 16 && r < 175) continue;
    if (bl - g < 0) continue;
    if (r - g < 12) continue;
    c++;
    if (x < a) a = x;
    if (x > b) b = x;
  }
  if (c > 8) rows.push(`${y} n${c} ${a}-${b}`);
}
console.log(rows.join("\n"));
