import sharp from "sharp";

function family(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const l = (max + min) / 2;
  if (d < 12 || l < 20 || l > 250 || g < r - 2) return false;
  let h;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h *= 60;
  if (h < 0) h += 360;
  return h >= 158 && h <= 205 && !(l > 232 && d < 16);
}

const img = await sharp("public/packaging/stick-pack.webp").ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const out = await sharp("scripts/_tmp-logo-out/public/packaging/stick-pack.webp").ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const W = img.info.width;
const boxes = [
  [670, 432, 225, 108],
  [940, 421, 215, 99],
  [1207, 422, 215, 125],
  [1470, 459, 217, 140],
  [397, 484, 230, 97],
  [1731, 527, 218, 153],
  [117, 559, 238, 114],
];
for (const [x, y, w, h] of boxes) {
  let n = 0, sx = 0, sy = 0, sxx = 0, sxy = 0, oldInk = 0, same = 0;
  for (let yy = y; yy < y + h; yy += 2) {
    for (let xx = x; xx < x + w; xx += 2) {
      const i = (yy * W + xx) * 4;
      const r = img.data[i], g = img.data[i + 1], b = img.data[i + 2];
      if (!family(r, g, b)) continue;
      oldInk++;
      n++;
      sx += xx; sy += yy; sxx += xx * xx; sxy += xx * yy;
      const d = Math.abs(r - out.data[i]) + Math.abs(g - out.data[i + 1]) + Math.abs(b - out.data[i + 2]);
      if (d < 18) same++;
    }
  }
  const meanX = sx / n;
  const varX = sxx - sx * meanX;
  const cov = sxy - sx * (sy / n);
  const slope = varX ? cov / varX : 0;
  const angle = Math.atan(slope) * 180 / Math.PI;
  console.log(`@${x},${y} ink ${oldInk} same ${same} angle ${angle.toFixed(1)}`);
}
