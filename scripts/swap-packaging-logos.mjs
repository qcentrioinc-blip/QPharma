/**
 * Replace printed Vitalcore wordmarks on the attached packaging masters
 * with the updated lockup. Does not redraw the photos.
 *
 *   node scripts/swap-packaging-logos.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const assets =
  "C:/Users/qc_la/.cursor/projects/c-Users-qc-la-OneDrive-Qcentrio-Inc-Desktop-Zephyr/assets";
const svgPath = path.join(root, "public/brand/vitalcore-logo.svg");
const review = path.join(root, "scripts/_regen-review");
const debug = process.argv.includes("--debug");

const FILES = [
  ["alu-alu", "alu-alu.webp", false],
  ["bulk-packs", "bulk-packs.webp", false],
  ["bottle-packs", "bottle-packs.webp", true],
  ["jar", "jar.webp", true],
  ["sachets", "sachets.webp", false],
  ["stick-pack", "stick-pack.webp", false],
];

const SCALE = 2;

const BOTTLE_BOXES = [
  { minX: 118, minY: 438, maxX: 282, maxY: 502, bw: 165, bh: 65 },
  { minX: 428, minY: 436, maxX: 618, maxY: 498, bw: 191, bh: 63 },
  { minX: 742, minY: 466, maxX: 908, maxY: 532, bw: 167, bh: 67 },
];

function hueOf(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  if (!d) return 0;
  let h;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h *= 60;
  if (h < 0) h += 360;
  return h;
}

function isInk(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const l = (max + min) / 2;
  if (d < 18 || l < 26 || l > 205) return false;
  if (g < r + 10) return false;
  if (b > g + 42) return false;
  const h = hueOf(r, g, b);
  return h >= 150 && h <= 214;
}

function components(mask, w, h) {
  const seen = new Uint8Array(mask.length);
  const comps = [];
  for (let start = 0; start < mask.length; start++) {
    if (!mask[start] || seen[start]) continue;
    const stack = [start];
    seen[start] = 1;
    let minX = w, maxX = 0, minY = h, maxY = 0, area = 0;
    let sumX = 0, sumY = 0;
    while (stack.length) {
      const p = stack.pop();
      const x = p % w;
      const y = (p - x) / w;
      area++;
      sumX += x;
      sumY += y;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      const nbs = [p - 1, p + 1, p - w, p + w];
      for (const n of nbs) {
        if (n < 0 || n >= mask.length || seen[n] || !mask[n]) continue;
        if (Math.abs((n % w) - x) > 1) continue;
        seen[n] = 1;
        stack.push(n);
      }
    }
    const bw = maxX - minX + 1;
    const bh = maxY - minY + 1;
    if (area < 36 || bw < 6 || bh < 6) continue;
    const fill = area / (bw * bh);
    if (fill > 0.78) continue;
    if (bw > w * 0.72 || bh > h * 0.4) continue;
    comps.push({
      minX, maxX, minY, maxY, bw, bh, area, fill,
      cx: sumX / area, cy: sumY / area,
    });
  }
  return comps;
}

function gap(a, b) {
  const gx = Math.max(0, Math.max(a.minX, b.minX) - Math.min(a.maxX, b.maxX));
  const gy = Math.max(0, Math.max(a.minY, b.minY) - Math.min(a.maxY, b.maxY));
  return Math.hypot(gx, gy);
}

function letterish(c) {
  return c.bh >= 8 && c.bh <= 190 && c.bw <= 170 && c.fill >= 0.1 && c.fill <= 0.82;
}

function swooshy(c) {
  return c.bw >= 36 && c.bh <= 34 && c.bw > c.bh * 2.2;
}

function cluster(comps) {
  const parent = comps.map((_, i) => i);
  const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  const join = (i, j) => { parent[find(i)] = find(j); };
  for (let i = 0; i < comps.length; i++) {
    for (let j = i + 1; j < comps.length; j++) {
      const a = comps[i];
      const b = comps[j];
      const vertOverlap = Math.min(a.maxY, b.maxY) - Math.max(a.minY, b.minY);
      const horizOverlap = Math.min(a.maxX, b.maxX) - Math.max(a.minX, b.minX);
      const gx = Math.max(0, Math.max(a.minX, b.minX) - Math.min(a.maxX, b.maxX));
      const gy = Math.max(0, Math.max(a.minY, b.minY) - Math.min(a.maxY, b.maxY));
      const size = Math.max(a.bh, b.bh, 8);
      if (letterish(a) && letterish(b) && vertOverlap > Math.min(a.bh, b.bh) * 0.4 && gx < Math.max(18, Math.min(a.bh, b.bh) * 0.75)) {
        join(i, j);
        continue;
      }
      if ((swooshy(a) || swooshy(b)) && horizOverlap > 24 && gy < 20 && gx < 16) {
        join(i, j);
        continue;
      }
      const narrow = a.bw <= 40 && b.bw <= 40 && a.bh <= 48 && b.bh <= 48;
      if (narrow && horizOverlap > Math.min(a.bw, b.bw) * 0.45 && gy < 12) join(i, j);
    }
  }
  const groups = new Map();
  comps.forEach((c, i) => {
    const id = find(i);
    if (!groups.has(id)) groups.set(id, []);
    groups.get(id).push(c);
  });
  return [...groups.values()];
}

function boundsOf(members) {
  let minX = Infinity, maxX = -1, minY = Infinity, maxY = -1, area = 0;
  for (const c of members) {
    minX = Math.min(minX, c.minX);
    maxX = Math.max(maxX, c.maxX);
    minY = Math.min(minY, c.minY);
    maxY = Math.max(maxY, c.maxY);
    area += c.area;
  }
  return {
    minX, maxX, minY, maxY,
    bw: maxX - minX + 1,
    bh: maxY - minY + 1,
    area,
  };
}

function labelLight(data, w, h, box) {
  const colors = [];
  const grab = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const i = (y * w + x) * 4;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (isInk(r, g, b)) return;
    colors.push((r + g + b) / 3);
  };
  const midY = Math.round((box.minY + box.maxY) / 2);
  for (let d = 4; d <= 18; d += 2) {
    grab(box.minX - d, midY);
    grab(box.maxX + d, midY);
  }
  if (colors.length < 3) return 0;
  colors.sort((a, b) => a - b);
  return colors[Math.floor(colors.length / 2)];
}

function bgStd(data, w, h, box) {
  const vals = [];
  const step = Math.max(1, Math.round(Math.min(box.bw, box.bh) / 24));
  for (let y = box.minY; y <= box.maxY; y += step) {
    for (let x = box.minX; x <= box.maxX; x += step) {
      const i = (y * w + x) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if (isInk(r, g, b)) continue;
      vals.push((r + g + b) / 3);
    }
  }
  if (vals.length < 8) return 99;
  const mean = vals.reduce((s, v) => s + v, 0) / vals.length;
  const varr = vals.reduce((s, v) => s + (v - mean) ** 2, 0) / vals.length;
  return Math.sqrt(varr);
}

function expandDown(data, w, h, box) {
  const limit = Math.min(h - 1, box.maxY + Math.round(Math.max(box.bh, 18) * 0.55));
  let gapRows = 0;
  for (let y = box.maxY + 1; y <= limit; y++) {
    let ink = 0;
    let light = 0;
    let n = 0;
    for (let x = box.minX + 2; x <= box.maxX - 2; x += 2) {
      const i = (y * w + x) * 4;
      n++;
      if (isInk(data[i], data[i + 1], data[i + 2])) ink++;
      else if ((data[i] + data[i + 1] + data[i + 2]) / 3 > 168) light++;
    }
    if (!n) break;
    if (ink / n > 0.015) {
      box.maxY = y;
      gapRows = 0;
      continue;
    }
    if (light / n < 0.62) break;
    gapRows++;
    if (gapRows > 28) break;
    box.maxY = y;
  }
  box.bh = box.maxY - box.minY + 1;
}

function findLogos(data, w, h) {
  const mask = new Uint8Array(w * h);
  for (let p = 0, i = 0; p < mask.length; p++, i += 4) {
    if (isInk(data[i], data[i + 1], data[i + 2])) mask[p] = 1;
  }
  const comps = components(mask, w, h).filter((c) => {
    if (c.bh > 220 || c.bw > 640) return false;
    if (c.fill < 0.08) return false;
    return true;
  });
  const logos = [];
  for (const members of cluster(comps)) {
    const box = boundsOf(members);
    const vertical = box.bh > box.bw * 1.45 && box.bh > 36;
    const fail = () => {};
    if (members.length >= 4) {
      const mean = (arr) => arr.reduce((s, v) => s + v, 0) / arr.length;
      const sd = (arr) => {
        const m = mean(arr);
        return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length);
      };
      const ws = members.map((m) => m.bw);
      const hs = members.map((m) => m.bh);
      const uniform = sd(ws) < mean(ws) * 0.18 && sd(hs) < mean(hs) * 0.18;
      const tallBlobs = mean(hs) > mean(ws) * 1.15 && !members.some(swooshy);
      if (uniform && tallBlobs) { fail("caps"); continue; }
    }
    if (!vertical && (box.bw < 46 || box.bh < 14)) { fail("size"); continue; }
    if (!vertical && box.bw < box.bh * 1.35) { fail("aspect"); continue; }
    if (vertical && (box.bh < 40 || box.bw < 12 || box.bw > 96)) { fail("vsize"); continue; }
    const singleWord = members.length === 1 && box.bw > box.bh * 1.65;
    if (members.length < (vertical ? 1 : 3) && !singleWord) { fail("n"); continue; }
    if (box.area < 180) { fail("area"); continue; }
    const light = labelLight(data, w, h, box);
    if (light < 165) { fail("light"+light.toFixed(0)); continue; }
    const fill = box.area / (box.bw * box.bh);
    if (fill > 0.62 || fill < 0.05) { fail("fill"+fill.toFixed(2)); continue; }
    const std0 = bgStd(data, w, h, box);
    if (std0 > 42) { fail("std"+std0.toFixed(0)); continue; }
    const saved = { ...box };
    expandDown(data, w, h, box);
    const std1 = bgStd(data, w, h, box);
    if (std1 > 48) {
      Object.assign(box, saved);
    }
    logos.push({ ...box, light, n: members.length, vertical });
  }
  const upper = logos.filter((logo, i) => !logos.some((other, j) => {
    if (i === j) return false;
    const ox = Math.min(logo.maxX, other.maxX) - Math.max(logo.minX, other.minX);
    if (ox < Math.min(logo.bw, other.bw) * 0.55) return false;
    const gapY = logo.minY - other.maxY;
    return gapY >= -4 && gapY < 48;
  }));
  logos.length = 0;
  logos.push(...upper);
  logos.sort((a, b) => b.bw * b.bh - a.bw * a.bh);
  const kept = [];
  for (const logo of logos) {
    const dup = kept.some((k) => {
      const ox = Math.min(k.maxX, logo.maxX) - Math.max(k.minX, logo.minX);
      const oy = Math.min(k.maxY, logo.maxY) - Math.max(k.minY, logo.minY);
      return ox > 0 && oy > 0 && ox * oy > Math.min(k.bw * k.bh, logo.bw * logo.bh) * 0.45;
    });
    if (!dup) kept.push(logo);
  }
  return kept;
}

function sampleBeside(data, w, h, y, x0, x1, cover) {
  const colors = [];
  const grab = (x) => {
    if (x < 0 || x >= w || y < 0 || y >= h) return;
    if (cover[y * w + x]) return;
    const i = (y * w + x) * 4;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (isInk(r, g, b)) return;
    if ((r + g + b) / 3 < 140) return;
    colors.push([r, g, b]);
  };
  for (let d = 3; d <= 22; d++) {
    grab(x0 - d);
    grab(x1 + d);
  }
  if (colors.length < 2) return null;
  const lum = (c) => (c[0] + c[1] + c[2]) / 3;
  const paper = colors.filter((c) => lum(c) > 200 && lum(c) < 252);
  const pool = paper.length >= 4 ? paper : colors;
  const mid = (ch) => {
    const arr = pool.map((c) => c[ch]).sort((a, b) => a - b);
    return arr[Math.floor(arr.length / 2)];
  };
  return [mid(0), mid(1), mid(2)];
}

function baseline(data, w, box) {
  let n = 0;
  let sx = 0;
  let sy = 0;
  const pts = [];
  for (let y = box.minY; y <= box.maxY; y += 2) {
    for (let x = box.minX; x <= box.maxX; x += 2) {
      const i = (y * w + x) * 4;
      if (!isInk(data[i], data[i + 1], data[i + 2])) continue;
      pts.push(x, y);
      sx += x;
      sy += y;
      n++;
    }
  }
  const cx = n ? sx / n : (box.minX + box.maxX) / 2;
  const cy = n ? sy / n : (box.minY + box.maxY) / 2;
  if (n < 8) return { deg: 0, cx, cy, span: box.bw };
  let sxx = 0;
  let syy = 0;
  let sxy = 0;
  for (let i = 0; i < pts.length; i += 2) {
    const dx = pts[i] - cx;
    const dy = pts[i + 1] - cy;
    sxx += dx * dx;
    syy += dy * dy;
    sxy += dx * dy;
  }
  let deg = (0.5 * Math.atan2(2 * sxy, sxx - syy) * 180) / Math.PI;
  if (deg > 90) deg -= 180;
  if (deg < -90) deg += 180;
  const rad = (deg * Math.PI) / 180;
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  let minP = Infinity;
  let maxP = -Infinity;
  for (let i = 0; i < pts.length; i += 2) {
    const p = (pts[i] - cx) * c + (pts[i + 1] - cy) * s;
    if (p < minP) minP = p;
    if (p > maxP) maxP = p;
  }
  return { deg, cx, cy, span: Math.max(12, maxP - minP) };
}

function isCover(r, g, b) {
  if (isInk(r, g, b)) return true;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const l = (max + min) / 2;
  if (d < 7 || l < 36 || l > 246) return false;
  if (g < r + 4) return false;
  if (b > g + 55) return false;
  const h = hueOf(r, g, b);
  return h >= 140 && h <= 220;
}

function coverInk(data, w, h, box) {
  const pad = 3;
  const minX = Math.max(0, box.minX - pad);
  const maxX = Math.min(w - 1, box.maxX + pad);
  const minY = Math.max(0, box.minY - pad);
  const maxY = Math.min(h - 1, box.maxY + pad);
  const cover = new Uint8Array(w * h);
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const i = (y * w + x) * 4;
      if (isCover(data[i], data[i + 1], data[i + 2])) cover[y * w + x] = 1;
    }
  }
  const rad = 2;
  const dil = new Uint8Array(cover);
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      if (!cover[y * w + x]) continue;
      for (let dy = -rad; dy <= rad; dy++) {
        const yy = y + dy;
        if (yy < minY || yy > maxY) continue;
        for (let dx = -rad; dx <= rad; dx++) {
          if (dx * dx + dy * dy > rad * rad) continue;
          const xx = x + dx;
          if (xx < minX || xx > maxX) continue;
          dil[yy * w + xx] = 1;
        }
      }
    }
  }
  const src = Buffer.from(data.subarray(0, data.length));
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      if (!dil[y * w + x]) continue;
      let color = null;
      for (let step = 3; step <= 28 && !color; step += 1) {
        for (const [dx, dy] of dirs) {
          const xx = x + dx * step;
          const yy = y + dy * step;
          if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
          if (dil[yy * w + xx]) continue;
          const i = (yy * w + xx) * 4;
          const r = src[i];
          const g = src[i + 1];
          const b = src[i + 2];
          if (isCover(r, g, b)) continue;
          color = [r, g, b];
          break;
        }
      }
      if (!color) color = sampleBeside(src, w, h, y, x, x, dil) || [236, 236, 232];
      const i = (y * w + x) * 4;
      data[i] = color[0];
      data[i + 1] = color[1];
      data[i + 2] = color[2];
      data[i + 3] = 255;
    }
  }
}

function isLabelPaper(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (l < 188 || max - min > 42) return false;
  if (g > r + 16 && l < 228) return false;
  return true;
}

function panelCenter(data, w, h, box) {
  const y = Math.max(0, box.minY - 6);
  let start = -1;
  let run = null;
  const cx = box.minX + box.bw / 2;
  for (let x = 0; x <= w; x++) {
    const i = (y * w + Math.min(x, w - 1)) * 4;
    const on = x < w && isLabelPaper(data[i], data[i + 1], data[i + 2]);
    if (on && start < 0) start = x;
    if (!on && start >= 0) {
      if (start <= cx && x - 1 >= cx) run = { start, end: x - 1 };
      start = -1;
    }
  }
  if (!run) return null;
  const width = run.end - run.start + 1;
  if (width < box.bw * 1.05 || width > box.bw * 3.2) return null;
  return (run.start + run.end) / 2;
}

async function curveBuffer(buf, amount) {
  if (!amount) return buf;
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const out = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const nx = x / w - 0.5;
      const sy = y - amount * h * nx * nx;
      const y0 = Math.floor(sy);
      const fy = sy - y0;
      const dest = (y * w + x) * 4;
      if (y0 < 0 || y0 + 1 >= h) continue;
      const a = (y0 * w + x) * 4;
      const b = ((y0 + 1) * w + x) * 4;
      for (let c = 0; c < 4; c++) out[dest + c] = data[a + c] * (1 - fy) + data[b + c] * fy;
    }
  }
  return sharp(out, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
}

async function loadLogo() {
  const rendered = await sharp(svgPath, { density: 600 }).resize({ width: 3200 }).png().toBuffer();
  return sharp(rendered).trim().png().toBuffer();
}

async function taperBuffer(buf, amount) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const out = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    const scale = 1 - amount * (y / Math.max(1, h - 1));
    for (let x = 0; x < w; x++) {
      const srcX = (x / Math.max(1, w - 1) - 0.5) / scale + 0.5;
      const sx = srcX * (w - 1);
      const x0 = Math.floor(sx);
      const fx = sx - x0;
      const dest = (y * w + x) * 4;
      if (x0 < 0 || x0 + 1 >= w) continue;
      const a = (y * w + x0) * 4;
      const b = (y * w + x0 + 1) * 4;
      for (let c = 0; c < 4; c++) out[dest + c] = data[a + c] * (1 - fx) + data[b + c] * fx;
    }
  }
  return sharp(out, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
}

function stampPrint(dest, dw, dh, logo, lw, lh, left, top) {
  for (let y = 0; y < lh; y++) {
    const dy = top + y;
    if (dy < 0 || dy >= dh) continue;
    for (let x = 0; x < lw; x++) {
      const dx = left + x;
      if (dx < 0 || dx >= dw) continue;
      const si = (y * lw + x) * 4;
      const alpha = logo[si + 3] / 255;
      if (alpha < 0.04) continue;
      const lr = logo[si];
      const lg = logo[si + 1];
      const lb = logo[si + 2];
      const lum = (lr + lg + lb) / 3;
      const chroma = Math.max(lr, lg, lb) - Math.min(lr, lg, lb);
      if (lum > 236 && chroma < 18) continue;
      const di = (dy * dw + dx) * 4;
      const shade = (dest[di] + dest[di + 1] + dest[di + 2]) / (3 * 255);
      const tone = 0.62 + 0.38 * shade;
      for (let c = 0; c < 3; c++) {
        const ink = logo[si + c] * tone;
        dest[di + c] = ink * alpha + dest[di + c] * (1 - alpha);
      }
    }
  }
}

function scaleBox(box, scale) {
  const minX = Math.round(box.minX * scale);
  const minY = Math.round(box.minY * scale);
  const maxX = Math.round(box.maxX * scale);
  const maxY = Math.round(box.maxY * scale);
  return { ...box, minX, minY, maxX, maxY, bw: maxX - minX + 1, bh: maxY - minY + 1 };
}

function sourcePath(key) {
  const name = fs.readdirSync(assets).find((f) => f.includes(`images_${key}-`) && f.endsWith(".webp"));
  if (!name) throw new Error(`missing source for ${key}`);
  return path.join(assets, name);
}

function anchorsFor(key, logos) {
  const s = SCALE;
  const out = logos.map(() => null);
  const byX = logos.map((box, i) => ({ i, cx: box.minX + box.bw / 2, cy: box.minY + box.bh / 2, bw: box.bw })).sort((a, b) => a.cx - b.cx);
  if (key === "sachets" && byX.length >= 3) {
    [214, 510, 816].forEach((cx, n) => { out[byX[n].i] = { cx: cx * s }; });
  }
  if (key === "bulk-packs") {
    const large = byX.filter((item) => item.bw > 160 * s);
    [179, 505, 847].forEach((cx, n) => { if (large[n]) out[large[n].i] = { cx: cx * s }; });
  }
  if (key === "jar" && byX.length >= 3) {
    out[byX[1].i] = { cx: 555 * s, cy: byX[0].cy };
  }
  if (key === "stick-pack") {
    const faces = [
      [8, 214, 160, 300, 84, 254, 100],
      [165, 168, 307, 262, 236, 215, 92],
      [308, 145, 443, 235, 376, 190, 88],
      [448, 137, 578, 225, 513, 181, 88],
      [584, 143, 717, 233, 651, 188, 88],
      [719, 158, 851, 254, 785, 206, 90],
      [850, 167, 991, 284, 921, 226, 92],
    ];
    for (const item of byX) {
      let best = faces[0];
      let bestD = Infinity;
      for (const face of faces) {
        const d = Math.abs(face[4] * s - item.cx);
        if (d < bestD) { bestD = d; best = face; }
      }
      out[item.i] = {
        minX: best[0] * s, minY: best[1] * s, maxX: best[2] * s, maxY: best[3] * s,
        cx: best[4] * s, cy: best[5] * s, maxW: best[6] * s,
      };
    }
  }
  if (key === "bottle-packs" && byX.length >= 3) {
    [203, 513, 826].forEach((cx, n) => { out[byX[n].i] = { cx: cx * s }; });
  }
  return out;
}

async function archBuffer(logoPng) {
  const raw = await sharp(logoPng).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = raw.info.width;
  const h = raw.info.height;
  const d = raw.data;
  let minX = w;
  let maxX = 0;
  let minY = h;
  let maxY = 0;
  for (let y = Math.round(h * 0.68); y < h; y++) {
    for (let x = Math.round(w * 0.45); x < w; x++) {
      const i = (y * w + x) * 4;
      if (d[i + 3] < 40) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  if (maxX <= minX) return null;
  const cw = maxX - minX + 1;
  const ch = maxY - minY + 1;
  const out = Buffer.alloc(cw * ch * 4);
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const si = (y * w + x) * 4;
      const di = ((y - minY) * cw + (x - minX)) * 4;
      const alpha = d[si + 3];
      out[di] = 42;
      out[di + 1] = 68;
      out[di + 2] = 46;
      out[di + 3] = alpha;
    }
  }
  return sharp(out, { raw: { width: cw, height: ch, channels: 4 } }).png().toBuffer();
}

async function engraveCap(data, w, h, logoPng) {
  const minX = Math.round(w * 1460 / 2048);
  const maxX = Math.round(w * 1850 / 2048);
  const minY = Math.round(h * 478 / 2048);
  const maxY = Math.round(h * 548 / 2048);
  const baseY = Math.round(h * 470 / 2048);
  const src = Buffer.from(data);
  const lumAt = (buf, x, y) => {
    const i = (y * w + x) * 4;
    return (buf[i] + buf[i + 1] + buf[i + 2]) / 3;
  };
  for (let y = minY; y <= maxY; y++) {
    const clean = [];
    for (let x = minX; x <= maxX; x++) {
      const above = lumAt(src, x, baseY);
      if (above < 125 || above > 165) continue;
      if (Math.abs(lumAt(src, x, y) - above) <= 10) clean.push(x);
    }
    if (clean.length < 8) continue;
    const isClean = new Uint8Array(maxX + 1);
    for (const x of clean) isClean[x] = 1;
    for (let x = minX; x <= maxX; x++) {
      if (isClean[x]) continue;
      let left = -1;
      let right = -1;
      for (let step = 1; step <= 160; step++) {
        if (left < 0 && x - step >= minX && isClean[x - step]) left = x - step;
        if (right < 0 && x + step <= maxX && isClean[x + step]) right = x + step;
        if (left >= 0 && right >= 0) break;
      }
      if (left < 0 || right < 0) continue;
      const t = (x - left) / (right - left);
      const a = (y * w + left) * 4;
      const b = (y * w + right) * 4;
      const i = (y * w + x) * 4;
      for (let c = 0; c < 3; c++) data[i + c] = src[a + c] * (1 - t) + src[b + c] * t;
    }
  }
  const arch = await archBuffer(logoPng);
  if (!arch) return;
  const curved = await curveBuffer(arch, 0.22);
  const width = Math.round((maxX - minX) * 0.72);
  const raster = await sharp(curved).resize({ width }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const left = Math.round((minX + maxX) / 2 - raster.info.width / 2);
  const top = Math.round((minY + maxY) / 2 - raster.info.height / 2);
  stampPrint(data, w, h, raster.data, raster.info.width, raster.info.height, left, top);
}

async function processOne(key, outName, curve, logoPng) {
  const abs = sourcePath(key);
  const small = await sharp(abs).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let logos = key === "bottle-packs" ? BOTTLE_BOXES : findLogos(small.data, small.info.width, small.info.height);
  const lines = logos.map((box) => baseline(small.data, small.info.width, box));
  console.log(key, logos.map((b, i) => `${b.bw}x${b.bh}@${b.minX},${b.minY} ${lines[i].deg.toFixed(0)}°`).join(" | ") || "(none)");
  if (debug) return;

  const big = await sharp(abs).resize(small.info.width * SCALE, small.info.height * SCALE, { kernel: "lanczos3" }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const data = Buffer.from(big.data);
  const w = big.info.width;
  const h = big.info.height;
  logos = logos.map((box) => scaleBox(box, SCALE));
  const scaledLines = lines.map((line) => ({
    ...line,
    cx: line.cx * SCALE,
    cy: line.cy * SCALE,
    span: line.span * SCALE,
  }));

  const faceCenters = logos.map((box) => panelCenter(data, w, h, box));
  const anchors = anchorsFor(key, logos);
  for (const box of logos) coverInk(data, w, h, box);
  if (key === "bottle-packs") {
    for (const box of logos) coverInk(data, w, h, { ...box, minY: box.maxY - 4, maxY: Math.min(h - 1, box.maxY + 28), bh: 32 });
  }
  if (key === "stick-pack") {
    for (const anchor of anchors) {
      if (!anchor) continue;
      coverInk(data, w, h, {
        minX: anchor.minX, maxX: anchor.maxX, minY: anchor.minY, maxY: anchor.maxY,
        bw: anchor.maxX - anchor.minX, bh: anchor.maxY - anchor.minY,
      });
    }
  }

  const meta = await sharp(logoPng).metadata();
  const aspect = meta.width / meta.height;
  for (let i = 0; i < logos.length; i++) {
    const box = logos[i];
    const line = scaledLines[i];
    const tilted = key === "stick-pack" && Math.abs(line.deg) >= 6;
    const anchor = anchors[i];
    const maxW = anchor && anchor.maxW
      ? anchor.maxW
      : Math.max(24, Math.round((tilted ? line.span : box.bw) * 1.06));
    const maxH = Math.max(24, box.bh);
    let logoW = maxW;
    let logoH = Math.round(logoW / aspect);
    if (logoH > maxH) {
      logoH = maxH;
      logoW = Math.round(logoH * aspect);
    }
    let logoBuf = await sharp(logoPng).resize({ width: logoW, height: logoH, kernel: "lanczos3" }).png().toBuffer();
    if (curve && !tilted) logoBuf = await curveBuffer(logoBuf, 0.16);
    if (tilted) {
      logoBuf = await taperBuffer(logoBuf, 0.07);
      logoBuf = await sharp(logoBuf).rotate(line.deg, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
    }
    const raster = await sharp(logoBuf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const face = faceCenters[i];
    const anchorX = anchor ? anchor.cx : (!tilted && face != null ? face : (tilted ? line.cx : box.minX + box.bw / 2));
    const anchorY = anchor && anchor.cy != null ? anchor.cy : (tilted ? line.cy : box.minY + box.bh / 2);
    const left = Math.round(anchorX - raster.info.width / 2);
    const top = Math.round(anchorY - raster.info.height / 2);
    stampPrint(data, w, h, raster.data, raster.info.width, raster.info.height, left, top);
  }

  if (key === "bottle-packs") await engraveCap(data, w, h, logoPng);

  fs.mkdirSync(review, { recursive: true });
  const composed = sharp(data, { raw: { width: w, height: h, channels: 4 } });
  await composed.clone().resize(1024, 1024).png().toFile(path.join(review, outName.replace(".webp", ".png")));
  const dest = path.join(root, "public/packaging", outName);
  await composed.webp({ quality: 88 }).toFile(dest);
  console.log("wrote", dest, `${w}x${h}`);
}

function isLockup(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const l = (max + min) / 2;
  return d >= 24 && l >= 35 && l <= 155 && r < 80 && g >= r + 28 && b <= g + 28;
}

function bottleMidX(data, w, h) {
  const y0 = Math.round(h * 0.24);
  const y1 = Math.round(h * 0.36);
  let left = -1;
  let right = -1;
  for (let x = 0; x < w; x++) {
    let sum = 0;
    let sum2 = 0;
    const n = y1 - y0;
    for (let y = y0; y < y1; y++) {
      const i = (y * w + x) * 4;
      const l = (data[i] + data[i + 1] + data[i + 2]) / 3;
      sum += l;
      sum2 += l * l;
    }
    const mean = sum / n;
    const v = sum2 / n - mean * mean;
    if (v > 800) {
      if (left < 0) left = x;
      right = x;
    }
  }
  if (left < 0) return null;
  return (left + right) / 2;
}

async function centerBottleLogo(rel) {
  const dest = path.join(root, rel);
  const img = await sharp(dest).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = img.info.width;
  const h = img.info.height;
  const data = Buffer.from(img.data);
  const mid = bottleMidX(data, w, h);
  if (mid == null) {
    console.log(rel, "no bottle");
    return;
  }
  const y0 = Math.round(h * 0.39);
  const y1 = Math.round(h * 0.48);
  const counts = new Array(w).fill(0);
  const rowHit = new Uint16Array(h);
  for (let y = y0; y < y1; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (!isLockup(data[i], data[i + 1], data[i + 2])) continue;
      counts[x]++;
      rowHit[y]++;
    }
  }
  const runs = [];
  let runStart = -1;
  let runInk = 0;
  let gap = 0;
  for (let x = 0; x <= w; x++) {
    const on = x < w && counts[x] >= 7;
    if (on) {
      if (runStart < 0) runStart = x;
      runInk += counts[x];
      gap = 0;
    } else if (runStart >= 0) {
      gap++;
      if (gap > 16 || x === w) {
        runs.push({ start: runStart, end: x - gap, ink: runInk });
        runStart = -1;
        runInk = 0;
        gap = 0;
      }
    }
  }
  runs.sort((a, b) => b.ink - a.ink);
  const best = runs[0];
  const minX = best ? best.start : -1;
  const maxX = best ? best.end : 0;
  const n = best ? best.ink : 0;
  let minY = h;
  let maxY = 0;
  for (let y = y0; y < y1; y++) {
    if (rowHit[y] < 12) continue;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  if (minX < 0 || n < 400 || maxY <= minY) {
    console.log(rel, "no lockup");
    return;
  }
  const logoMid = (minX + maxX) / 2;
  const dx = Math.round(mid - logoMid);
  console.log(rel, "bottle", Math.round(mid), "logo", Math.round(logoMid), "shift", dx);
  if (Math.abs(dx) < 12) return;

  const mask = new Uint8Array(w * h);
  for (let y = minY - 2; y <= maxY + 2; y++) {
    for (let x = minX - 2; x <= maxX + 2; x++) {
      if (x < 0 || y < 0 || x >= w || y >= h) continue;
      const i = (y * w + x) * 4;
      if (isLockup(data[i], data[i + 1], data[i + 2])) mask[y * w + x] = 1;
    }
  }
  const dil = new Uint8Array(mask);
  for (let y = minY - 2; y <= maxY + 4; y++) {
    for (let x = minX - 2; x <= maxX + 4; x++) {
      if (y < 0 || x < 0 || y >= h || x >= w || !mask[y * w + x]) continue;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx2 = -2; dx2 <= 2; dx2++) {
          const xx = x + dx2;
          const yy = y + dy;
          if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
          dil[yy * w + xx] = 1;
        }
      }
    }
  }
  const src = Buffer.from(data);
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  const patch = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!dil[y * w + x]) continue;
      const i = (y * w + x) * 4;
      patch.push([x, y, src[i], src[i + 1], src[i + 2], src[i + 3]]);
    }
  }
  for (const [x, y] of patch) {
    let color = null;
    for (let step = 2; step <= 24 && !color; step++) {
      for (const [sx, sy] of dirs) {
        const xx = x + sx * step;
        const yy = y + sy * step;
        if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
        if (dil[yy * w + xx]) continue;
        const i = (yy * w + xx) * 4;
        if (isLockup(src[i], src[i + 1], src[i + 2])) continue;
        color = [src[i], src[i + 1], src[i + 2]];
        break;
      }
    }
    if (!color) continue;
    const i = (y * w + x) * 4;
    data[i] = color[0];
    data[i + 1] = color[1];
    data[i + 2] = color[2];
  }
  for (const [x, y, r, g, b, a] of patch) {
    const xx = x + dx;
    if (xx < 0 || xx >= w) continue;
    const i = (y * w + xx) * 4;
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    data[i + 3] = a;
  }
  const webp = await sharp(data, { raw: { width: w, height: h, channels: 4 } }).webp({ quality: 90 }).toBuffer();
  const tmp = `${dest}.tmp`;
  fs.writeFileSync(tmp, webp);
  try {
    fs.renameSync(tmp, dest);
  } catch {
    fs.copyFileSync(tmp, dest);
    fs.unlinkSync(tmp);
  }
  console.log("centered", dest);
}

const logoPng = await loadLogo();
for (const [key, outName, curve] of FILES) {
  await processOne(key, outName, curve, logoPng);
}
await centerBottleLogo("public/homepage/nuetra.webp");
