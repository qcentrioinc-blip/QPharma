import fs from "node:fs";
import sharp from "sharp";

async function run(file, out) {
const style = "engrave";
const { data, info } = await sharp(file)
  .resize({ width: 1728, height: 2304, kernel: "lanczos3" })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const w = info.width;
const h = info.height;
const src = Buffer.from(data);

function lum(x, y) {
  const i = (y * w + x) * 4;
  return (src[i] + src[i + 1] + src[i + 2]) / 3;
}

const peaks = [];
let last = -999;
for (let y = 240; y < 960; y += 2) {
  let g = 0;
  let n = 0;
  for (let x = Math.round(w * 0.37); x <= Math.round(w * 0.63); x += 12) {
    g += lum(x, y - 5) - lum(x, y + 5);
    n++;
  }
  const v = g / n;
  if (v > 18 && y - last > 40) {
    peaks.push({ y, v });
    last = y;
  }
}
const top = peaks.find((p) => p.y < 520);
let bot = top
  ? peaks.filter((p) => p.y > top.y + 160 && p.y < top.y + 460).sort((a, b) => b.v - a.v)[0]
  : null;
let faceTop = top ? top.y : 360;
let faceBot = bot ? bot.y : faceTop + 280;
if (!bot) {
  bot = peaks.filter((p) => p.y > 500 && p.y < 920).sort((a, b) => b.v - a.v)[0];
  if (bot) {
    faceBot = bot.y;
    faceTop = bot.y - 380;
  }
}

const midX0 = Math.round(w * 0.4);
const midX1 = Math.round(w * 0.6);
function rowEnergy(y) {
  let e = 0;
  let c = 0;
  for (let x = midX0; x <= midX1 - 8; x += 4) {
    e += Math.abs(lum(x, y) - lum(x + 6, y));
    c++;
  }
  return c ? e / c : 99;
}
const clusters = [];
let cur = null;
for (let y = faceTop + 16; y <= faceBot - 14; y += 2) {
  const e = rowEnergy(y);
  if (e > 5) {
    if (cur && y <= cur.max + 10) {
      cur.max = y;
      cur.sum += e;
    } else {
      if (cur) clusters.push(cur);
      cur = { min: y, max: y, sum: e };
    }
  }
}
if (cur) clusters.push(cur);
const mark = clusters.filter((c) => c.max - c.min >= 20).sort((a, b) => b.sum - a.sum)[0] || {
  min: faceTop + 80,
  max: faceTop + 160,
};
let donorY = mark.max + 16;
let donorE = 99;
for (let y = mark.max + 8; y <= Math.min(faceBot - 6, mark.max + 80); y += 2) {
  const e = rowEnergy(y);
  if (e < donorE) {
    donorE = e;
    donorY = y;
  }
}

const cx = Math.round(w / 2);
const rgb = (x, y) => {
  const i = (y * w + x) * 4;
  return [src[i], src[i + 1], src[i + 2]];
};
const delta = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
const seed = rgb(cx, donorY);
const seek = (dir) => {
  for (let x = cx; dir < 0 ? x > 40 : x < w - 40; x += dir) {
    const jump = delta(rgb(x, donorY), rgb(x - dir * 8, donorY));
    if (jump > 80 && delta(rgb(x, donorY), seed) > 60 && Math.abs(x - cx) > 80) return x - dir;
  }
  return null;
};
let left = seek(-1);
let right = seek(1);
if (left == null) left = cx - 400;
if (right == null) right = cx + 400;
const capW = right - left;
const wordL = Math.round(cx - capW * 0.28);
const wordR = Math.round(cx + capW * 0.28);
const bandMid = (mark.min + mark.max) / 2;
const bandH = Math.min(200, Math.max(120, mark.max - mark.min + 70));
const y0 = Math.max(faceTop + 8, Math.round(bandMid - bandH / 2));
const y1 = Math.min(faceBot - 8, y0 + bandH);

for (let y = y0; y <= y1; y++) {
  const fadeY = Math.min(1, Math.min(y - y0, y1 - y) / 14);
  for (let x = wordL; x <= wordR; x++) {
    const fadeX = Math.min(1, Math.min(x - wordL, wordR - x) / 16);
    const fade = fadeX * fadeY;
    const i = (y * w + x) * 4;
    const j = (donorY * w + x) * 4;
    for (let c = 0; c < 3; c++) data[i + c] = Math.round(src[i + c] * (1 - fade) + src[j + c] * fade);
  }
}

const rendered = await sharp("public/brand/vitalcore-logo.svg", { density: 700 }).png().toBuffer();
const trimmed = await sharp(rendered).trim().png().toBuffer();
const meta = await sharp(trimmed).metadata();
const aspect = meta.width / meta.height;
let logoW = Math.round(capW * (style === "engrave" ? 0.62 : 0.58));
let logoH = Math.round(logoW / aspect);
const raster = await sharp(trimmed).resize({ width: logoW, height: logoH, kernel: "lanczos3" }).ensureAlpha().raw().toBuffer();
const originX = Math.round(cx - logoW / 2);
const originY = Math.round((y0 + y1) / 2 - logoH / 2);
const plasticLum = lum(cx, donorY);
const white = plasticLum > 175;
const tagCut = Math.round(logoH * 0.66);
const alpha = new Float32Array(logoW * logoH);
for (let i = 0; i < alpha.length; i++) alpha[i] = raster[i * 4 + 3] / 255;
const bold = new Float32Array(alpha);
for (let y = tagCut; y < logoH; y++) {
  for (let x = 0; x < logoW; x++) {
    let m = alpha[y * logoW + x];
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const xx = x + dx;
        const yy = y + dy;
        if (xx < 0 || yy < tagCut || xx >= logoW || yy >= logoH) continue;
        m = Math.max(m, alpha[yy * logoW + xx]);
      }
    }
    bold[y * logoW + x] = m;
  }
}
const at = (x, y) => (x < 0 || y < 0 || x >= logoW || y >= logoH ? 0 : alpha[y * logoW + x]);
for (let y = 0; y < logoH; y++) {
  for (let x = 0; x < logoW; x++) {
    const tag = y >= tagCut;
    const a = tag ? bold[y * logoW + x] : alpha[y * logoW + x];
    if (a < 0.16) continue;
    const px = originX + x;
    const py = originY + y;
    const dropUp = a - at(x - 4, y - 4);
    const dropDown = a - at(x + 4, y + 4);
    let factor;
    if (style === "engrave") {
      if (tag) factor = a > 0.35 ? (white ? 0.5 : 0.3) : white ? 0.62 : 0.42;
      else if (a > 0.78) factor = white ? 0.58 : 0.38;
      else if (dropUp > 0.2 && dropUp >= dropDown) factor = white ? 0.48 : 0.28;
      else if (dropDown > 0.2 && a < 0.7) factor = white ? 0.82 : 0.72;
      else factor = white ? 0.64 : 0.42;
    } else if (tag) {
      factor = a > 0.35 ? (white ? 0.42 : 0.34) : white ? 0.55 : 0.46;
    } else if (a > 0.78) {
      factor = white ? 1.06 : plasticLum < 110 ? 1.22 : 1.1;
    } else if (dropUp > 0.2 && dropUp >= dropDown) {
      factor = white ? 1.12 : plasticLum < 110 ? 1.34 : 1.2;
    } else if (dropDown > 0.2 && a < 0.7) {
      factor = plasticLum < 110 ? 0.62 : 0.72;
    } else factor = 1;
    const i = (py * w + px) * 4;
    data[i] = Math.max(0, Math.min(255, Math.round(data[i] * factor)));
    data[i + 1] = Math.max(0, Math.min(255, Math.round(data[i + 1] * factor)));
    data[i + 2] = Math.max(0, Math.min(255, Math.round(data[i + 2] * factor)));
  }
}

const cropLeft = Math.max(0, left - 10);
const cropTop = Math.max(0, faceTop - 20);
const cropW = Math.max(20, Math.min(w - cropLeft, right - left + 20));
const cropH = Math.max(20, Math.min(h - cropTop, faceBot - faceTop + 40));
await sharp(data, { raw: { width: w, height: h, channels: 4 } })
  .extract({ left: cropLeft, top: cropTop, width: cropW, height: cropH })
  .resize({ width: 420 })
  .jpeg({ quality: 80 })
  .toFile(out);
console.log(pathBasename(file), { faceTop, faceBot, donorY, y0, y1, plasticLum: Math.round(plasticLum) });
}

function pathBasename(file) {
  return file.split(/[/\\]/).pop();
}

import path from "node:path";

if (process.argv[2] === "all") {
  const root = "public/product-images/Organic";
  const outDir = "scripts/_organic-caps/fix";
  fs.mkdirSync(outDir, { recursive: true });
  let n = 0;
  for (const dir of fs.readdirSync(root)) {
    const folder = path.join(root, dir);
    if (!fs.statSync(folder).isDirectory()) continue;
    for (const name of fs.readdirSync(folder)) {
      if (!name.endsWith(".webp")) continue;
      const abs = path.join(folder, name);
      const meta = await sharp(abs).metadata();
      if (meta.width !== 864) continue;
      n++;
      const id = String(n).padStart(2, "0");
      await run(abs, path.join(outDir, `${id}.jpg`));
    }
  }
  console.log("previews", n);
} else {
  await run(process.argv[2], process.argv[3] || "scripts/_organic-caps/try.jpg");
}
