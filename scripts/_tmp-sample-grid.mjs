import sharp from "sharp";
import path from "node:path";

const file = path.resolve("public", process.argv[2]);
const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const w = info.width, h = info.height;
const y0 = Number(process.argv[3] ?? 0.05);
const y1 = Number(process.argv[4] ?? 0.22);
const x0 = Number(process.argv[5] ?? 0.35);
const x1 = Number(process.argv[6] ?? 0.65);

function hsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  let hue = 0;
  if (d) {
    if (max === r) hue = ((g - b) / d) % 6;
    else if (max === g) hue = (b - r) / d + 2;
    else hue = (r - g) / d + 4;
    hue *= 60;
    if (hue < 0) hue += 360;
  }
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return [Math.round(hue), Math.round(s * 100), Math.round(l * 100)];
}

console.log(info.width, info.height);
for (let yp = y0; yp <= y1; yp += (y1 - y0) / 8) {
  const row = [];
  for (let xp = x0; xp <= x1; xp += (x1 - x0) / 6) {
    const x = Math.floor(w * xp);
    const y = Math.floor(h * yp);
    const i = (y * w + x) * 4;
    row.push(`${data[i]},${data[i+1]},${data[i+2]} hsl${hsl(data[i], data[i+1], data[i+2]).join("/")}`);
  }
  console.log(yp.toFixed(3), row.join(" | "));
}
