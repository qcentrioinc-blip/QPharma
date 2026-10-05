import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const rendered = await sharp("public/brand/vitalcore-logo.svg", { density: 700 }).png().toBuffer();
const trimmed = await sharp(rendered).trim().png().toBuffer();
const logoMeta = await sharp(trimmed).metadata();
const aspect = logoMeta.width / logoMeta.height;

function lumAt(data, w, x, y) {
  const i = (y * w + x) * 4;
  return (data[i] + data[i + 1] + data[i + 2]) / 3;
}

async function stamp(file) {
  const base = sharp(file).resize({ width: 1728, height: 2304, kernel: "lanczos3" }).ensureAlpha();
  const { data, info } = await base.raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const peaks = [];
  let last = -999;
  for (let y = 180; y < 980; y += 2) {
    let g = 0;
    let n = 0;
    for (let x = Math.round(w * 0.4); x <= Math.round(w * 0.6); x += 14) {
      g += lumAt(data, w, x, Math.max(0, y - 5)) - lumAt(data, w, x, Math.min(h - 1, y + 5));
      n++;
    }
    const v = g / n;
    if (v > 16 && y - last > 36) {
      peaks.push(y);
      last = y;
    }
  }
  const top = peaks.find((y) => y < 520) || peaks[0] || 320;
  const bot = peaks.find((y) => y > top + 180 && y < top + 520) || top + 300;
  const mid = Math.round((top + bot) / 2);
  const cx = Math.round(w / 2);
  const rgb = (x, y) => {
    const i = (y * w + x) * 4;
    return [data[i], data[i + 1], data[i + 2]];
  };
  const delta = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
  const seed = rgb(cx, mid);
  const seek = (dir) => {
    for (let x = cx; dir < 0 ? x > 30 : x < w - 30; x += dir) {
      if (delta(rgb(x, mid), rgb(Math.max(0, x - dir * 8), mid)) > 70 && delta(rgb(x, mid), seed) > 50 && Math.abs(x - cx) > 70) return x;
    }
    return null;
  };
  let left = seek(-1) ?? cx - 380;
  let right = seek(1) ?? cx + 380;
  if (right - left < 480) {
    left = cx - 400;
    right = cx + 400;
  }
  if (right - left > 1300) {
    left = cx - 500;
    right = cx + 500;
  }
  const src = Buffer.from(data);
  const yStart = Math.max(8, top - 70);
  for (let y = yStart; y < bot - 6; y++) {
    const fy = Math.min(1, Math.min(y - yStart, bot - y) / 16);
    const li = (y * w + (left + 28)) * 4;
    const ri = (y * w + (right - 28)) * 4;
    for (let x = left + 28; x < right - 28; x++) {
      const fx = Math.min(1, Math.min(x - (left + 28), right - 28 - x) / 20);
      const f = fx * fy;
      const t = (x - (left + 28)) / Math.max(1, right - left - 56);
      const i = (y * w + x) * 4;
      for (let c = 0; c < 3; c++) {
        const plastic = src[li + c] + (src[ri + c] - src[li + c]) * t;
        data[i + c] = Math.round(src[i + c] * (1 - f) + plastic * f);
      }
    }
  }
  const capW = right - left;
  let logoW = Math.round(capW * 0.62);
  let logoH = Math.round(logoW / aspect);
  const room = Math.round((bot - top) * 0.55);
  if (logoH > room) {
    logoH = room;
    logoW = Math.round(logoH * aspect);
  }
  const raster = await sharp(trimmed).resize({ width: logoW, height: logoH, kernel: "lanczos3" }).ensureAlpha().raw().toBuffer();
  const originX = Math.round(cx - logoW / 2);
  const originY = Math.round(mid - logoH * 0.42);
  const plastic = lumAt(data, w, cx, Math.min(h - 2, bot - 16));
  const white = plastic > 175;
  const tagCut = Math.round(logoH * 0.66);
  const alpha = new Float32Array(logoW * logoH);
  for (let i = 0; i < alpha.length; i++) alpha[i] = raster[i * 4 + 3] / 255;
  for (let y = 0; y < logoH; y++) {
    for (let x = 0; x < logoW; x++) {
      let a = alpha[y * logoW + x];
      if (y >= tagCut) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const xx = x + dx;
            const yy = y + dy;
            if (xx < 0 || yy < tagCut || xx >= logoW || yy >= logoH) continue;
            a = Math.max(a, alpha[yy * logoW + xx]);
          }
        }
      }
      if (a < 0.16) continue;
      const px = originX + x;
      const py = originY + y;
      if (px < 1 || py < 1 || px >= w - 1 || py >= h - 1) continue;
      const up = a - (x > 4 && y > 4 ? alpha[(y - 4) * logoW + (x - 4)] : 0);
      const down = a - (x < logoW - 5 && y < logoH - 5 ? alpha[(y + 4) * logoW + (x + 4)] : 0);
      let factor;
      const tag = y >= tagCut;
      const darkCap = plastic < 70;
      if (darkCap) {
        const lift = (tag ? 168 : a > 0.78 ? 150 : 110) * Math.min(1, a);
        const i = (py * w + px) * 4;
        data[i] = Math.max(0, Math.min(255, Math.round(data[i] + lift)));
        data[i + 1] = Math.max(0, Math.min(255, Math.round(data[i + 1] + lift)));
        data[i + 2] = Math.max(0, Math.min(255, Math.round(data[i + 2] + lift)));
        continue;
      }
      if (tag) factor = a > 0.35 ? (white ? 0.5 : 0.3) : white ? 0.62 : 0.42;
      else if (a > 0.78) factor = white ? 0.58 : 0.38;
      else if (up > 0.2 && up >= down) factor = white ? 0.48 : 0.28;
      else if (down > 0.2 && a < 0.7) factor = white ? 0.82 : 0.72;
      else factor = white ? 0.64 : 0.42;
      const i = (py * w + px) * 4;
      data[i] = Math.max(0, Math.min(255, Math.round(data[i] * factor)));
      data[i + 1] = Math.max(0, Math.min(255, Math.round(data[i + 1] * factor)));
      data[i + 2] = Math.max(0, Math.min(255, Math.round(data[i + 2] * factor)));
    }
  }
  return { data, w, h, top, bot, left, right };
}

if (process.argv[2] === "all") {
  const root = "public/product-images/Organic";
  const outDir = "scripts/_organic-caps/fix2";
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
      const { data, w, h } = await stamp(abs);
      const id = String(n).padStart(2, "0");
      const tmp = `${abs}.stamp-tmp`;
      fs.rmSync(tmp, { force: true });
      await sharp(data, { raw: { width: w, height: h, channels: 4 } })
        .webp({ quality: 92, smartSubsample: false, effort: 4 })
        .toFile(tmp);
      console.log("staged", id, name.slice(0, 48));
    }
  }
  console.log("previews", n);
} else {
  const jobs = process.argv.slice(2);
  for (const file of jobs) {
    const { data, w, h, top, bot, left, right } = await stamp(file);
    const name = path.basename(file, ".webp").slice(0, 18);
    await sharp(data, { raw: { width: w, height: h, channels: 4 } })
      .resize({ width: 480 })
      .jpeg({ quality: 78 })
      .toFile(`scripts/_organic-caps/fix/wash-${name}.jpg`);
    console.log(name, top, bot, left, right);
  }
}
