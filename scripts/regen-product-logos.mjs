/**
 * Rebuild catalog product photos from the current bottle plus the official lockup.
 * Erases the old smile logo and prints public/brand/vitalcore-logo.svg.
 * Writes review copies first. Promotes onto the live files only with --promote.
 *
 *   node scripts/regen-product-logos.mjs --pilot
 *   node scripts/regen-product-logos.mjs --all
 *   node scripts/regen-product-logos.mjs --promote
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const svgPath = path.join(root, "public/brand/vitalcore-logo.svg");
const LOGO_ASPECT = 977 / 375;

const MANIFESTS = [
  ["herb", "src/herbaceutical/imageManifest.ts"],
  ["nutra", "src/nutraceutical/imageManifest.ts"],
  ["organic", "src/organic/imageManifest.ts"],
];

function readManifest(file) {
  const text = fs.readFileSync(path.join(root, file), "utf8");
  return [...text.matchAll(/"(\/product-images\/[^"]+\.webp)"/g)].map((m) => m[1].replace(/^\//, ""));
}

function reviewRel(rel) {
  return rel
    .replace("product-images/Herbaceutical/", "product-images/Herbaceutical-review/")
    .replace("product-images/Nutraceutical/", "product-images/Nutraceutical-review/")
    .replace("product-images/Organic/", "product-images/Organic-review/");
}

function lists() {
  return MANIFESTS.map(([range, file]) => ({ range, files: readManifest(file) }));
}

function pilotFiles() {
  return [
    "product-images/Herbaceutical/Anti Oxidents/Elderberry + Green Tea + Beetroot.webp",
    "product-images/Nutraceutical/Anti oxidants/Acai Berry Powder + Vitamin C + Vitamin E + Selenium.webp",
    "product-images/Herbaceutical/Heart Health/Horse Chestnut + Rutin Powder + Arjuna + Cassia Bark.webp",
    "product-images/Organic/Ashwagandha/Ginger + Liquorice + Cardamom.v34.webp",
    "product-images/Organic/Horsetail/Pomegranate + Cranberry + Curcumin.webp",
    "product-images/Organic/Kalmegh/Shatavari + Black Sesame Seed + Liquorice Root + Musta.v34.webp",
  ];
}

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

function isLogoInk(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const l = (max + min) / 2;
  if (d < 18 || l < 26 || l > 210) return false;
  if (g < r + 6) return false;
  const h = hueOf(r, g, b);
  return h >= 155 && h <= 205;
}

function isLogoFamily(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const l = (max + min) / 2;
  if (d < 12 || l < 20 || l > 250) return false;
  if (g < r - 2) return false;
  const h = hueOf(r, g, b);
  if (h < 158 || h > 205) return false;
  if (l > 232 && d < 16) return false;
  return true;
}

function isCover(r, g, b) {
  if (isLogoInk(r, g, b) || isLogoFamily(r, g, b)) return true;
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

function isCream(r, g, b) {
  if (isLogoInk(r, g, b)) return false;
  const lum = (r + g + b) / 3;
  const spread = Math.max(r, g, b) - Math.min(r, g, b);
  return lum > 175 && r + 8 >= b && spread < 70;
}

function components(mask, w, h, minArea) {
  const seen = new Uint8Array(mask.length);
  const comps = [];
  const stack = [];
  for (let start = 0; start < mask.length; start++) {
    if (!mask[start] || seen[start]) continue;
    let minX = w;
    let maxX = 0;
    let minY = h;
    let maxY = 0;
    let area = 0;
    stack.push(start);
    seen[start] = 1;
    while (stack.length) {
      const p = stack.pop();
      const x = p % w;
      const y = (p - x) / w;
      area++;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      for (const n of [p - 1, p + 1, p - w, p + w]) {
        if (n < 0 || n >= mask.length || seen[n] || !mask[n]) continue;
        const nx = n % w;
        if (Math.abs(nx - x) > 1) continue;
        seen[n] = 1;
        stack.push(n);
      }
    }
    const bw = maxX - minX + 1;
    const bh = maxY - minY + 1;
    if (area < minArea) continue;
    if (bw > w * 0.72 || bh > h * 0.28) continue;
    if (area > bw * bh * 0.72) continue;
    comps.push({ minX, maxX, minY, maxY, bw, bh, area });
  }
  return comps;
}

function groupLines(comps) {
  const parent = comps.map((_, i) => i);
  const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  for (let i = 0; i < comps.length; i++) {
    for (let j = i + 1; j < comps.length; j++) {
      const a = comps[i];
      const b = comps[j];
      const overlapY = Math.min(a.maxY, b.maxY) - Math.max(a.minY, b.minY);
      if (overlapY < Math.min(a.bh, b.bh) * 0.35) continue;
      const gapX = Math.max(a.minX, b.minX) - Math.min(a.maxX, b.maxX);
      if (gapX > Math.max(a.bh, b.bh) * 0.95) continue;
      parent[find(i)] = find(j);
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

function creamScore(data, w, box) {
  let cream = 0;
  let total = 0;
  const step = Math.max(2, Math.round(Math.min(box.bw, box.bh) / 10));
  for (let y = box.minY; y <= box.maxY; y += step) {
    for (let x = box.minX; x <= box.maxX; x += step) {
      const i = (y * w + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (isLogoInk(r, g, b)) continue;
      total++;
      if (isCream(r, g, b)) cream++;
    }
  }
  return total < 4 ? 0 : cream / total;
}

function findLabelMarks(data, w, h) {
  const mask = new Uint8Array(w * h);
  for (let p = 0, i = 0; p < mask.length; p++, i += 4) {
    if (isLogoInk(data[i], data[i + 1], data[i + 2])) mask[p] = 1;
  }
  const minArea = Math.max(10, Math.round((w * h) / 180000));
  const comps = components(mask, w, h, minArea);
  const marks = [];
  for (const members of groupLines(comps)) {
    let minX = Infinity;
    let maxX = -1;
    let minY = Infinity;
    let maxY = -1;
    let area = 0;
    for (const c of members) {
      minX = Math.min(minX, c.minX);
      maxX = Math.max(maxX, c.maxX);
      minY = Math.min(minY, c.minY);
      maxY = Math.max(maxY, c.maxY);
      area += c.area;
    }
    const bw = maxX - minX + 1;
    const bh = maxY - minY + 1;
    const aspect = bw / Math.max(1, bh);
    const fill = area / Math.max(1, bw * bh);
    const box = { minX, maxX, minY, maxY, bw, bh, area };
    const cream = creamScore(data, w, box);
    const word =
      members.length >= 3 &&
      fill < 0.62 &&
      aspect >= 1.45 &&
      aspect <= 16 &&
      bw > w * 0.02 &&
      bw < w * 0.7 &&
      bh > h * 0.008 &&
      bh < h * 0.22 &&
      cream >= 0.35;
    if (word && bw > w * 0.12) marks.push(box);
  }
  marks.sort((a, b) => a.minY - b.minY || b.bw - a.bw);
  const kept = [];
  for (const m of marks) {
    const stacked = kept.some((k) => {
      const overlap = Math.min(k.maxX, m.maxX) - Math.max(k.minX, m.minX);
      return overlap > Math.min(k.bw, m.bw) * 0.45;
    });
    if (!stacked) kept.push(m);
  }
  return kept;
}

function expandMark(data, w, h, box) {
  const x0 = Math.max(0, box.minX - Math.round(box.bw * 0.08));
  const x1 = Math.min(w - 1, box.maxX + Math.round(box.bw * 0.08));
  let minY = box.minY;
  let maxY = box.maxY;
  const upLimit = Math.max(0, box.minY - Math.round(box.bh * 0.45));
  const downLimit = Math.min(h - 1, box.maxY + Math.round(box.bh * 0.85));
  let gap = 0;
  const gapLimit = Math.max(4, Math.round(box.bh * 0.22));
  for (let y = box.minY; y >= upLimit; y--) {
    let hit = false;
    for (let x = x0; x <= x1; x += 2) {
      const i = (y * w + x) * 4;
      if (isLogoFamily(data[i], data[i + 1], data[i + 2])) {
        hit = true;
        break;
      }
    }
    if (hit) {
      minY = y;
      gap = 0;
    } else if (++gap > gapLimit) break;
  }
  gap = 0;
  for (let y = box.maxY; y <= downLimit; y++) {
    let hit = false;
    for (let x = x0; x <= x1; x += 2) {
      const i = (y * w + x) * 4;
      if (isLogoFamily(data[i], data[i + 1], data[i + 2])) {
        hit = true;
        break;
      }
    }
    if (hit) {
      maxY = y;
      gap = 0;
    } else if (++gap > gapLimit) break;
  }
  const padX = Math.max(4, Math.round(box.bw * 0.06));
  const padY = Math.max(2, Math.round(box.bh * 0.1));
  const minX = Math.max(0, box.minX - padX);
  const maxX = Math.min(w - 1, box.maxX + padX);
  minY = Math.max(0, minY - padY);
  maxY = Math.min(h - 1, maxY + Math.round(box.bh * 0.42));
  return { minX, maxX, minY, maxY, bw: maxX - minX + 1, bh: maxY - minY + 1 };
}

function isMuted(r, g, b) {
  const lum = (r + g + b) / 3;
  const chroma = Math.max(r, g, b) - Math.min(r, g, b);
  return lum >= 115 && lum <= 175 && chroma < 40 && g < r + 8;
}

function findGrayMark(data, w, h) {
  const y0 = Math.round(h * 0.38);
  const y1 = Math.round(h * 0.56);
  const x0 = Math.round(w * 0.22);
  const x1 = Math.round(w * 0.78);
  const counts = [];
  for (let y = y0; y <= y1; y++) {
    let n = 0;
    for (let x = x0; x <= x1; x++) {
      const i = (y * w + x) * 4;
      if (isMuted(data[i], data[i + 1], data[i + 2])) n++;
    }
    counts.push(n);
  }
  let peak = 0;
  let peakAt = 0;
  counts.forEach((n, i) => {
    if (n > peak) {
      peak = n;
      peakAt = i;
    }
  });
  if (peak < 28) return null;
  let top = peakAt;
  let bot = peakAt;
  while (top > 0 && counts[top - 1] > peak * 0.4) top--;
  while (bot < counts.length - 1 && counts[bot + 1] > peak * 0.4) bot++;
  const minY = y0 + top;
  const maxY = y0 + bot;
  if (maxY - minY > h * 0.07 || maxY - minY < 8) return null;
  let minX = w;
  let maxX = 0;
  for (let y = minY; y <= maxY; y++) {
    for (let x = x0; x <= x1; x++) {
      const i = (y * w + x) * 4;
      if (!isMuted(data[i], data[i + 1], data[i + 2])) continue;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
    }
  }
  const bw = maxX - minX + 1;
  if (bw < w * 0.12) return null;
  return {
    minX: Math.max(0, minX - Math.round(bw * 0.12)),
    maxX: Math.min(w - 1, maxX + Math.round(bw * 0.08)),
    minY: Math.max(0, minY - 4),
    maxY: Math.min(h - 1, maxY + 10),
    bw: 0,
    bh: 0,
    gray: true,
  };
}

function findCapMark(data, w, h) {
  const limit = Math.round(h * 0.36);
  const x0 = Math.round(w * 0.18);
  const x1 = Math.round(w * 0.82);
  const mask = new Uint8Array(w * h);
  for (let y = 0; y < limit; y++) {
    for (let x = x0; x <= x1; x++) {
      const i = (y * w + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const lum = (r + g + b) / 3;
      if (lum < 40 || lum > 210) continue;
      const chroma = Math.max(r, g, b) - Math.min(r, g, b);
      if (chroma < 12 || lum > 196) continue;
      mask[y * w + x] = 1;
    }
  }
  const seen = new Uint8Array(mask.length);
  const stack = [];
  let face = null;
  for (let start = 0; start < mask.length; start++) {
    if (!mask[start] || seen[start]) continue;
    let minX = w;
    let maxX = 0;
    let minY = h;
    let maxY = 0;
    let area = 0;
    stack.push(start);
    seen[start] = 1;
    while (stack.length) {
      const p = stack.pop();
      const x = p % w;
      const y = (p - x) / w;
      area++;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      for (const n of [p - 1, p + 1, p - w, p + w]) {
        if (n < 0 || n >= mask.length || seen[n] || !mask[n]) continue;
        const nx = n % w;
        if (Math.abs(nx - x) > 1) continue;
        seen[n] = 1;
        stack.push(n);
      }
    }
    if (!face || area > face.area) face = { minX, maxX, minY, maxY, bw: maxX - minX + 1, bh: maxY - minY + 1, area };
  }
  if (!face) return null;
  if (face.bw < w * 0.18 || face.bh < h * 0.04) return null;
  const minX = face.minX + Math.round(face.bw * 0.08);
  const maxX = face.maxX - Math.round(face.bw * 0.08);
  const minY = face.minY + Math.round(face.bh * 0.28);
  const maxY = face.minY + Math.round(face.bh * 0.78);
  if (maxX <= minX || maxY <= minY) return null;
  return { minX, maxX, minY, maxY, bw: 0, bh: 0, cap: true };
}

function finishBox(box) {
  box.bw = box.maxX - box.minX + 1;
  box.bh = box.maxY - box.minY + 1;
  return box;
}

function coverInk(data, w, h, box) {
  const pad = 2;
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
  const dil = new Uint8Array(cover);
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      if (!cover[y * w + x]) continue;
      for (let dy = -2; dy <= 2; dy++) {
        const yy = y + dy;
        if (yy < minY || yy > maxY) continue;
        for (let dx = -2; dx <= 2; dx++) {
          if (dx * dx + dy * dy > 4) continue;
          const xx = x + dx;
          if (xx < minX || xx > maxX) continue;
          dil[yy * w + xx] = 1;
        }
      }
    }
  }
  const src = Buffer.from(data.subarray(0, data.length));
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      if (!dil[y * w + x]) continue;
      let color = null;
      for (let step = 3; step <= 28 && !color; step++) {
        for (const [dx, dy] of dirs) {
          const xx = x + dx * step;
          const yy = y + dy * step;
          if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
          if (dil[yy * w + xx]) continue;
          const i = (yy * w + xx) * 4;
          if (isCover(src[i], src[i + 1], src[i + 2])) continue;
          color = [src[i], src[i + 1], src[i + 2]];
          break;
        }
      }
      if (!color) color = [236, 236, 232];
      const i = (y * w + x) * 4;
      data[i] = color[0];
      data[i + 1] = color[1];
      data[i + 2] = color[2];
    }
  }
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

async function loadLogo() {
  const rendered = await sharp(svgPath, { density: 600 }).resize({ width: 3200 }).png().toBuffer();
  return sharp(rendered).trim().png().toBuffer();
}

function coverGray(data, w, h, box) {
  const src = Buffer.from(data.subarray(0, data.length));
  const isPaper = (r, g, b) => {
    const lum = (r + g + b) / 3;
    const chroma = Math.max(r, g, b) - Math.min(r, g, b);
    return lum > 176 && chroma < 55;
  };
  for (let y = box.minY; y <= box.maxY; y++) {
    for (let x = box.minX; x <= box.maxX; x++) {
      const i = (y * w + x) * 4;
      const lum = (src[i] + src[i + 1] + src[i + 2]) / 3;
      const chroma = Math.max(src[i], src[i + 1], src[i + 2]) - Math.min(src[i], src[i + 1], src[i + 2]);
      if (lum < 100 || lum > 205 || chroma > 48 || src[i + 1] > src[i] + 10) continue;
      let color = null;
      for (let step = 2; step <= 30 && !color; step++) {
        for (const xx of [x - step, x + step]) {
          if (xx < 0 || xx >= w) continue;
          const j = (y * w + xx) * 4;
          if (!isPaper(src[j], src[j + 1], src[j + 2])) continue;
          color = [src[j], src[j + 1], src[j + 2]];
          break;
        }
      }
      if (!color) continue;
      data[i] = color[0];
      data[i + 1] = color[1];
      data[i + 2] = color[2];
    }
  }
}

function coverCap(data, w, h, box) {
  const src = Buffer.from(data.subarray(0, data.length));
  const above = Math.max(0, box.minY - 8);
  const below = Math.min(h - 1, box.maxY + 8);
  for (let y = box.minY; y <= box.maxY; y++) {
    const t = (y - box.minY) / Math.max(1, box.maxY - box.minY);
    for (let x = box.minX; x <= box.maxX; x++) {
      const a = (above * w + x) * 4;
      const b = (below * w + x) * 4;
      const i = (y * w + x) * 4;
      for (let c = 0; c < 3; c++) data[i + c] = src[a + c] * (1 - t) + src[b + c] * t;
    }
  }
}

async function processOne(rel, logoPng) {
  const abs = path.join(root, "public", rel);
  const { data, info } = await sharp(abs).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  let marks = findLabelMarks(data, w, h).map((box) => expandMark(data, w, h, box));
  if (!marks.length) {
    const cap = findCapMark(data, w, h);
    if (cap) marks = [finishBox(cap)];
  }
  const meta = await sharp(logoPng).metadata();
  const aspect = meta.width / meta.height || LOGO_ASPECT;
  const applied = [];
  for (const box of marks) {
    if (box.cap) {
      if (box.bw > w * 0.7) continue;
    } else if (box.bh > h * 0.18 || box.bw > w * 0.55 || box.minX < w * 0.08) {
      continue;
    }
    if (!box.cap && !box.gray) {
      const limit = Math.round(box.bw * 0.35);
      const hit = (x) => {
        if (x < 0 || x >= w) return false;
        let n = 0;
        for (let y = box.minY; y <= box.maxY; y += 2) {
          const i = (y * w + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const d = max - min;
          const l = (max + min) / 2;
          if (d < 14 || l < 30 || l > 210 || g < r + 8) continue;
          const h = hueOf(r, g, b);
          if (h >= 145 && h <= 210) n++;
        }
        return n > 2;
      };
      const grow = (dir) => {
        let extra = 0;
        let gap = 0;
        let pending = 0;
        while (extra < limit) {
          const x = dir > 0 ? box.maxX + 1 + pending : box.minX - 1 - pending;
          if (!hit(x)) {
            gap++;
            pending++;
            extra++;
            if (gap >= 8) break;
            continue;
          }
          if (dir > 0) box.maxX = x;
          else box.minX = x;
          pending = 0;
          gap = 0;
          extra++;
        }
      };
      grow(1);
      grow(-1);
      box.bw = box.maxX - box.minX + 1;
    }
    if (box.cap) {
      let top = null;
      let bot = null;
      for (let y = box.minY; y <= box.maxY; y++) {
        let sum = 0;
        let n = 0;
        for (let x = box.minX; x <= box.maxX; x += 4) {
          const i = (y * w + x) * 4;
          sum += (data[i] + data[i + 1] + data[i + 2]) / 3;
          n++;
        }
        const mean = sum / Math.max(1, n);
        if (mean > 55 && mean < 160) {
          if (top == null) top = y;
          bot = y;
        }
      }
      if (top == null || bot - top < 24) continue;
      const span = bot - top;
      box.minY = top + Math.round(span * 0.46);
      box.maxY = Math.min(bot, box.minY + Math.round(Math.min(span * 0.42, h * 0.07)));
      box.bh = box.maxY - box.minY + 1;
      if (box.bh < 16) continue;
      coverCap(data, w, h, box);
    }
    else if (box.gray) coverGray(data, w, h, box);
    else coverInk(data, w, h, box);
    let logoW = Math.max(24, Math.round(box.bw * 0.96));
    let logoH = Math.round(logoW / aspect);
    const maxH = Math.max(24, Math.round(box.bh * 0.96));
    if (logoH > maxH) {
      logoH = maxH;
      logoW = Math.round(logoH * aspect);
    }
    const raster = await sharp(logoPng)
      .resize({ width: logoW, height: logoH, kernel: "lanczos3" })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    if (box.cap) {
      for (let i = 0; i < raster.data.length; i += 4) {
        raster.data[i] = Math.round(raster.data[i] * 0.35);
        raster.data[i + 1] = Math.round(raster.data[i + 1] * 0.35);
        raster.data[i + 2] = Math.round(raster.data[i + 2] * 0.35);
      }
    }
    const left = Math.round(box.minX + box.bw / 2 - raster.info.width / 2);
    const top = Math.round(box.minY + box.bh / 2 - raster.info.height / 2);
    stampPrint(data, w, h, raster.data, raster.info.width, raster.info.height, left, top);
    applied.push(box);
  }
  marks.length = 0;
  marks.push(...applied);
  const destRel = reviewRel(rel);
  const dest = path.join(root, "public", destRel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  await sharp(data, { raw: { width: w, height: h, channels: 4 } }).webp({ quality: 88 }).toFile(dest);
  return {
    rel,
    destRel,
    n: marks.length,
    boxes: marks.map((b) => `${b.bw}x${b.bh}@${b.minX},${b.minY}${b.cap ? " cap" : ""}${b.gray ? " gray" : ""}`),
  };
}

function lumAt(data, w, x, y) {
  const i = (y * w + x) * 4;
  return (data[i] + data[i + 1] + data[i + 2]) / 3;
}

async function measureLogo(logoPng) {
  const raw = await sharp(logoPng).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = raw.info.width;
  const h = raw.info.height;
  const d = raw.data;
  let wordBottom = 0;
  for (let y = 0; y < h; y++) {
    let left = 0;
    for (let x = 0; x < Math.round(w * 0.55); x++) {
      if (d[(y * w + x) * 4 + 3] > 40) left++;
    }
    if (left > 8) wordBottom = y;
  }
  return { wordFrac: Math.min(0.82, Math.max(0.5, (wordBottom + 1) / h)), aspect: w / h };
}

function wordCore(data, w, box) {
  const rows = [];
  let max = 0;
  for (let y = box.minY; y <= box.maxY; y++) {
    let n = 0;
    let minX = w;
    let maxX = 0;
    for (let x = box.minX; x <= box.maxX; x++) {
      const i = (y * w + x) * 4;
      if (!isLogoInk(data[i], data[i + 1], data[i + 2])) continue;
      n++;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
    }
    rows.push({ y, n, minX, maxX });
    if (n > max) max = n;
  }
  const hot = rows.filter((row) => row.n > max * 0.28 && row.maxX > row.minX);
  if (!hot.length || max < 8) return box;
  let end = 0;
  for (let i = 1; i < hot.length; i++) {
    if (hot[i].y - hot[i - 1].y > 6) break;
    end = i;
  }
  const group = hot.slice(0, end + 1);
  let minX = w;
  let maxX = 0;
  for (const row of group) {
    minX = Math.min(minX, row.minX);
    maxX = Math.max(maxX, row.maxX);
  }
  return {
    minX,
    maxX,
    minY: group[0].y,
    maxY: group[end].y,
    bw: maxX - minX + 1,
    bh: group[end].y - group[0].y + 1,
  };
}

function overlapRatio(data, w, h, raster, left, top, y0, y1, x0, x1) {
  const lw = raster.info.width;
  const lh = raster.info.height;
  const src = raster.data;
  let expect = 0;
  let hit = 0;
  for (let y = Math.round(lh * y0); y < Math.round(lh * y1); y++) {
    for (let x = Math.round(lw * x0); x < Math.round(lw * x1); x++) {
      if (src[(y * lw + x) * 4 + 3] < 64) continue;
      const dx = left + x;
      const dy = top + y;
      if (dx < 0 || dy < 0 || dx >= w || dy >= h) continue;
      expect++;
      const i = (dy * w + dx) * 4;
      if (isCover(data[i], data[i + 1], data[i + 2])) hit++;
    }
  }
  return expect ? hit / expect : 0;
}

function inpaintMasked(data, w, h, mask) {
  const src = Buffer.from(data.subarray(0, data.length));
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!mask[y * w + x]) continue;
      let color = null;
      for (let step = 3; step <= 36 && !color; step++) {
        for (const [dx, dy] of dirs) {
          const xx = x + dx * step;
          const yy = y + dy * step;
          if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
          if (mask[yy * w + xx]) continue;
          const i = (yy * w + xx) * 4;
          if (isCover(src[i], src[i + 1], src[i + 2])) continue;
          color = [src[i], src[i + 1], src[i + 2]];
          break;
        }
      }
      if (!color) color = [236, 236, 232];
      const i = (y * w + x) * 4;
      data[i] = color[0];
      data[i + 1] = color[1];
      data[i + 2] = color[2];
    }
  }
}

function sweepOutsideLogo(data, w, h, raster, left, top) {
  const lw = raster.info.width;
  const lh = raster.info.height;
  const src = raster.data;
  const keep = new Uint8Array(lw * lh);
  for (let y = 0; y < lh; y++) {
    for (let x = 0; x < lw; x++) {
      if (src[(y * lw + x) * 4 + 3] < 28) continue;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          if (dx * dx + dy * dy > 4) continue;
          const xx = x + dx;
          const yy = y + dy;
          if (xx < 0 || yy < 0 || xx >= lw || yy >= lh) continue;
          keep[yy * lw + xx] = 1;
        }
      }
    }
  }
  const mask = new Uint8Array(w * h);
  const x0 = Math.max(0, left - 8);
  const x1 = Math.min(w - 1, left + lw + 8);
  const y0 = Math.max(0, top - 4);
  const y1 = Math.min(h - 1, top + lh + Math.round(lh * 0.22));
  let n = 0;
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const lx = x - left;
      const ly = y - top;
      if (lx >= 0 && ly >= 0 && lx < lw && ly < lh && keep[ly * lw + lx]) continue;
      const i = (y * w + x) * 4;
      if (!isCover(data[i], data[i + 1], data[i + 2])) continue;
      mask[y * w + x] = 1;
      n++;
    }
  }
  if (n) inpaintMasked(data, w, h, mask);
  return n;
}

function findCapFace(data, w, h) {
  const limit = Math.round(h * 0.4);
  const x0 = Math.round(w * 0.16);
  const x1 = Math.round(w * 0.84);
  const mask = new Uint8Array(w * h);
  for (let y = 0; y < limit; y++) {
    for (let x = x0; x <= x1; x++) {
      const i = (y * w + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const lum = (r + g + b) / 3;
      if (lum < 40 || lum > 210) continue;
      const chroma = Math.max(r, g, b) - Math.min(r, g, b);
      if (chroma < 8 || lum > 200) continue;
      mask[y * w + x] = 1;
    }
  }
  const seen = new Uint8Array(mask.length);
  const stack = [];
  let face = null;
  for (let start = 0; start < mask.length; start++) {
    if (!mask[start] || seen[start]) continue;
    let minX = w;
    let maxX = 0;
    let minY = h;
    let maxY = 0;
    let area = 0;
    stack.push(start);
    seen[start] = 1;
    while (stack.length) {
      const p = stack.pop();
      const x = p % w;
      const y = (p - x) / w;
      area++;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      for (const n of [p - 1, p + 1, p - w, p + w]) {
        if (n < 0 || n >= mask.length || seen[n] || !mask[n]) continue;
        const nx = n % w;
        if (Math.abs(nx - x) > 1) continue;
        seen[n] = 1;
        stack.push(n);
      }
    }
    if (!face || area > face.area) face = { minX, maxX, minY, maxY, bw: maxX - minX + 1, bh: maxY - minY + 1, area };
  }
  if (!face || face.bw < w * 0.2 || face.bh < h * 0.04 || face.bw > w * 0.78) return null;
  return face;
}

function capMarkBand(data, w, h, face) {
  const xL = face.minX + Math.round(face.bw * 0.2);
  const xR = face.maxX - Math.round(face.bw * 0.2);
  const side = Math.max(6, Math.round(face.bw * 0.06));
  const rows = [];
  let peak = 0;
  for (let y = face.minY + 4; y <= face.maxY - 4; y++) {
    let center = 0;
    let cn = 0;
    let edge = 0;
    let en = 0;
    let grad = 0;
    for (let x = xL; x <= xR; x += 3) {
      center += lumAt(data, w, x, y);
      cn++;
      grad += Math.abs(lumAt(data, w, x, y) - lumAt(data, w, x, Math.min(h - 1, y + 2)));
    }
    for (let x = face.minX + 4; x < face.minX + 4 + side; x++) {
      edge += lumAt(data, w, x, y);
      en++;
    }
    for (let x = face.maxX - 4 - side; x <= face.maxX - 4; x++) {
      edge += lumAt(data, w, x, y);
      en++;
    }
    const drop = edge / Math.max(1, en) - center / Math.max(1, cn);
    const g = grad / Math.max(1, cn);
    if (drop > peak) peak = drop;
    rows.push({ y, drop, g });
  }
  if (peak < 10) return null;
  const cut = Math.max(16, peak * 0.55);
  let best = null;
  let run = null;
  for (const row of rows) {
    const marked = row.drop >= cut || (row.drop > 8 && row.g > 7);
    if (marked) {
      if (!run) run = { minY: row.y, maxY: row.y };
      else run.maxY = row.y;
    } else if (run) {
      if (!best || run.maxY - run.minY > best.maxY - best.minY) best = run;
      run = null;
    }
  }
  if (run && (!best || run.maxY - run.minY > best.maxY - best.minY)) best = run;
  if (!best) return null;
  const bh = best.maxY - best.minY + 1;
  if (bh < 18 || bh > h * 0.16) return null;
  best.minY = Math.max(face.minY + 2, best.minY - 2);
  best.maxY = Math.min(face.maxY - 2, best.maxY + 6);
  best.xL = xL;
  best.xR = xR;
  return best;
}

function paintCapRow(data, src, w, xL, xR, y, left, right, spanL, spanR) {
  for (let x = xL; x <= xR; x++) {
    const t = (x - spanL) / Math.max(1, spanR - spanL);
    const a = (y * w + left) * 4;
    const b = (y * w + right) * 4;
    const i = (y * w + x) * 4;
    for (let c = 0; c < 3; c++) data[i + c] = src[a + c] * (1 - t) + src[b + c] * t;
  }
}

function clearCapBand(data, w, h, band) {
  const src = Buffer.from(data.subarray(0, data.length));
  const left = Math.max(0, band.xL - 8);
  const right = Math.min(w - 1, band.xR + 8);
  for (let y = band.minY; y <= band.maxY; y++) {
    paintCapRow(data, src, w, band.xL, band.xR, y, left, right, band.xL, band.xR);
  }
  const limit = Math.min(h - 1, band.maxY + 36);
  let quiet = 0;
  for (let y = band.maxY + 1; y <= limit; y++) {
    const hits = [];
    for (let x = band.xL; x <= band.xR; x++) {
      const t = (x - band.xL) / Math.max(1, band.xR - band.xL);
      const a = (y * w + left) * 4;
      const b = (y * w + right) * 4;
      const i = (y * w + x) * 4;
      const baseR = src[a] * (1 - t) + src[b] * t;
      const baseG = src[a + 1] * (1 - t) + src[b + 1] * t;
      const baseB = src[a + 2] * (1 - t) + src[b + 2] * t;
      const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const base = (baseR + baseG + baseB) / 3;
      if (base - lum < 16) continue;
      if (data[i + 1] + 12 < data[i] * 0.62) continue;
      hits.push(x);
    }
    if (hits.length < 10) {
      quiet++;
      if (quiet >= 3) break;
      continue;
    }
    quiet = 0;
    paintCapRow(data, src, w, hits[0], hits[hits.length - 1], y, left, right, band.xL, band.xR);
  }
}

function debossPrint(dest, dw, dh, logo, lw, lh, left, top) {
  const A = (x, y) => {
    if (x < 0 || y < 0 || x >= lw || y >= lh) return 0;
    return logo[(y * lw + x) * 4 + 3] / 255;
  };
  for (let y = 0; y < lh; y++) {
    const dy = top + y;
    if (dy < 0 || dy >= dh) continue;
    for (let x = 0; x < lw; x++) {
      const a = A(x, y);
      if (a < 0.06) continue;
      const dx = left + x;
      if (dx < 0 || dx >= dw) continue;
      const shade = a - A(x + 1, y + 1);
      const factor = Math.min(1.42, Math.max(0.42, 1 - 0.34 * a + 0.55 * shade));
      const i = (dy * dw + dx) * 4;
      for (let c = 0; c < 3; c++) dest[i + c] = Math.min(255, Math.max(0, dest[i + c] * factor));
    }
  }
}

async function placeLogo(logoPng, logoW, logoH) {
  return sharp(logoPng)
    .resize({ width: Math.max(24, logoW), height: Math.max(24, logoH), kernel: "lanczos3" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
}

function smileParts(mask, w, h) {
  const seen = new Uint8Array(mask.length);
  const comps = [];
  const stack = [];
  for (let start = 0; start < mask.length; start++) {
    if (!mask[start] || seen[start]) continue;
    let minX = w;
    let maxX = 0;
    let minY = h;
    let maxY = 0;
    let area = 0;
    stack.push(start);
    seen[start] = 1;
    while (stack.length) {
      const p = stack.pop();
      const x = p % w;
      const y = (p - x) / w;
      area++;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      for (const n of [p - 1, p + 1, p - w, p + w]) {
        if (n < 0 || n >= mask.length || seen[n] || !mask[n]) continue;
        const nx = n % w;
        if (Math.abs(nx - x) > 1) continue;
        seen[n] = 1;
        stack.push(n);
      }
    }
    if (area < 12) continue;
    comps.push({ minX, maxX, minY, maxY, area });
  }
  return comps;
}

function removeSmile(data, w, h, box) {
  const core = wordCore(data, w, box);
  if (core.bh < 12) return { removed: 0, core, arch: 0 };
  const yScan = Math.min(h - 1, core.maxY + Math.round(core.bh * 1.55));
  const x0 = Math.max(0, core.minX - 10);
  const x1 = Math.min(w - 1, core.maxX + 14);
  const tall = new Uint8Array(w * h);
  const cand = [];
  for (let x = x0; x <= x1; x++) {
    let start = -1;
    const close = (end) => {
      if (start < 0) return;
      const rh = end - start;
      if (rh >= 7) {
        for (let y = start; y < end; y++) tall[y * w + x] = 1;
      } else if (rh >= 1 && rh <= 4 && start > core.maxY + 2) {
        for (let y = start; y < end; y++) cand.push(y * w + x);
      }
      start = -1;
    };
    for (let y = core.minY; y <= yScan; y++) {
      const i = (y * w + x) * 4;
      const on = isCover(data[i], data[i + 1], data[i + 2]);
      if (on && start < 0) start = y;
      else if (!on && start >= 0) close(y);
    }
    if (start >= 0) close(yScan + 1);
  }
  const mask = new Uint8Array(w * h);
  for (const p of cand) {
    const x = p % w;
    const y = (p - x) / w;
    let near = false;
    for (let dy = -2; dy <= 2 && !near; dy++) {
      const yy = y + dy;
      if (yy < 0 || yy >= h) continue;
      if (tall[yy * w + x]) near = true;
    }
    if (!near) mask[p] = 1;
  }
  let archMaxY = 0;
  for (let y = core.maxY + 2; y <= yScan; y++) {
    for (let x = x0; x <= x1; x++) {
      if (!tall[y * w + x]) continue;
      if (y > archMaxY) archMaxY = y;
    }
  }
  const keep = new Uint8Array(w * h);
  let removed = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!mask[y * w + x]) continue;
      if (!(archMaxY > 0 && y > archMaxY + 2)) continue;
      keep[y * w + x] = 1;
      removed++;
    }
  }
  let low = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) if (keep[y * w + x] && y > low) low = y;
  }
  if (low) {
    removed = 0;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (!keep[y * w + x]) continue;
        if (y < low - 4) {
          keep[y * w + x] = 0;
          continue;
        }
        removed++;
      }
    }
  }
  let span = 0;
  if (removed >= 18) {
    let minX = w;
    let maxX = 0;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (!keep[y * w + x]) continue;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
      }
    }
    span = maxX - minX;
  }
  if (removed < 18 || span < 24) removed = 0;
  else inpaintMasked(data, w, h, keep);
  let arch = 0;
  const ax0 = core.minX + Math.round(core.bw * 0.42);
  for (let y = core.maxY + 2; y <= yScan; y++) {
    for (let x = ax0; x <= core.maxX; x++) if (tall[y * w + x]) arch++;
  }
  return { removed, core, arch };
}

function printedCapBand(data, w, h) {
  const y0 = Math.round(h * 0.1);
  const y1 = Math.round(h * 0.34);
  const x0 = Math.round(w * 0.18);
  const x1 = Math.round(w * 0.82);
  let minX = w;
  let maxX = 0;
  let minY = h;
  let maxY = 0;
  let n = 0;
  for (let y = y0; y <= y1; y++) {
    let edge = 0;
    let en = 0;
    for (let x = x0; x < x0 + 14; x++) {
      edge += lumAt(data, w, x, y);
      en++;
    }
    for (let x = x1 - 14; x <= x1; x++) {
      edge += lumAt(data, w, x, y);
      en++;
    }
    const base = edge / Math.max(1, en);
    if (base < 80 || base > 188) continue;
    for (let x = x0 + 22; x <= x1 - 22; x++) {
      if (base - lumAt(data, w, x, y) < 58) continue;
      n++;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  if (n < 350) return null;
  const bw = maxX - minX + 1;
  const bh = maxY - minY + 1;
  if (bw < w * 0.16 || bh < 18 || bh > h * 0.16) return null;
  return {
    xL: Math.max(0, minX - 8),
    xR: Math.min(w - 1, maxX + 8),
    minY: Math.max(0, minY - 2),
    maxY: Math.min(h - 1, maxY + 10),
  };
}

function lightCapBand(data, w, h) {
  const y0 = Math.round(h * 0.08);
  const y1 = Math.round(h * 0.36);
  const rows = [];
  for (let y = y0; y <= y1; y++) {
    let n = 0;
    let minX = w;
    let maxX = 0;
    for (let x = Math.round(w * 0.2); x <= Math.round(w * 0.8); x += 2) {
      const i = (y * w + x) * 4;
      const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const chroma = Math.max(data[i], data[i + 1], data[i + 2]) - Math.min(data[i], data[i + 1], data[i + 2]);
      if (lum < 198 || chroma > 22) continue;
      n++;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
    }
    if (n > w * 0.12 && maxX - minX > w * 0.28) rows.push(y);
  }
  if (rows.length < 24) return null;
  let start = rows[0];
  let best = null;
  for (let i = 1; i <= rows.length; i++) {
    if (i === rows.length || rows[i] > rows[i - 1] + 2) {
      const run = { minY: start, maxY: rows[i - 1] };
      if (!best || run.maxY - run.minY > best.maxY - best.minY) best = run;
      if (i < rows.length) start = rows[i];
    }
  }
  if (!best || best.maxY - best.minY < 28) return null;
  const cap = best;
  let minX = w;
  let maxX = 0;
  let minY = h;
  let maxY = 0;
  let n = 0;
  for (let y = cap.minY + 4; y <= cap.maxY - 4; y++) {
    let base = 0;
    let bn = 0;
    for (let x = Math.round(w * 0.28); x <= Math.round(w * 0.72); x += 6) {
      base += lumAt(data, w, x, y);
      bn++;
    }
    const mid = base / Math.max(1, bn);
    for (let x = Math.round(w * 0.28); x <= Math.round(w * 0.72); x++) {
      const drop = mid - lumAt(data, w, x, y);
      if (drop < 8 || drop > 50) continue;
      n++;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  if (n < 200) return null;
  const bw = maxX - minX + 1;
  const bh = maxY - minY + 1;
  if (bw < w * 0.12 || bh < 14 || bh > cap.maxY - cap.minY) return null;
  return {
    xL: Math.max(0, minX - 6),
    xR: Math.min(w - 1, maxX + 6),
    minY: Math.max(cap.minY, minY - 2),
    maxY: Math.min(cap.maxY, maxY + 8),
  };
}

function inkCapBand(data, w, h) {
  const y0 = Math.round(h * 0.12);
  const y1 = Math.round(h * 0.33);
  const x0 = Math.round(w * 0.22);
  const x1 = Math.round(w * 0.78);
  let minX = w;
  let maxX = 0;
  let minY = h;
  let maxY = 0;
  let n = 0;
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const i = (y * w + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const lum = (r + g + b) / 3;
      if (lum > 50 || g + 8 < r || g + 10 < b) continue;
      n++;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  const hot = [];
  for (let y = y0; y <= y1; y++) {
    let row = 0;
    let rowMin = w;
    let rowMax = 0;
    for (let x = x0; x <= x1; x++) {
      const i = (y * w + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const lum = (r + g + b) / 3;
      if (lum > 50 || g + 8 < r || g + 10 < b) continue;
      row++;
      if (x < rowMin) rowMin = x;
      if (x > rowMax) rowMax = x;
    }
    if (row >= 12) hot.push({ y, rowMin, rowMax });
  }
  if (hot.length < 4) return null;
  let end = 0;
  for (let i = 1; i < hot.length; i++) {
    if (hot[i].y - hot[i - 1].y > 5) break;
    end = i;
  }
  const run = hot.slice(0, end + 1);
  minX = w;
  maxX = 0;
  for (const row of run) {
    minX = Math.min(minX, row.rowMin);
    maxX = Math.max(maxX, row.rowMax);
  }
  minY = run[0].y;
  maxY = run[end].y;
  const bw = maxX - minX + 1;
  const bh = maxY - minY + 1;
  if (bw < 36 || bh < 8 || bh > h * 0.14) return null;
  return {
    xL: Math.max(x0, minX - Math.round(bw * 0.12)),
    xR: Math.min(x1, maxX + Math.round(bw * 0.12)),
    minY: Math.max(y0, minY - Math.round(bh * 0.85)),
    maxY: Math.min(h - 1, maxY + Math.round(Math.max(12, bh * 0.45))),
  };
}

async function engraveCap(data, w, h, logoPng, measure) {
  const band = inkCapBand(data, w, h);
  if (!band) return null;
  const spanW = band.xR - band.xL + 1;
  const spanH = band.maxY - band.minY + 1;
  if (spanW < 170 || spanW > 340 || spanH < 48 || spanH > 120) return null;
  if (band.minY < 160 || band.minY > 245) return null;
  clearCapBand(data, w, h, band);
  let logoW = Math.round(spanW * 0.88);
  let logoH = Math.round(logoW / measure.aspect);
  const maxH = Math.round(spanH * 0.88);
  if (logoH > maxH) {
    logoH = maxH;
    logoW = Math.round(logoH * measure.aspect);
  }
  const raster = await placeLogo(logoPng, logoW, logoH);
  const left = Math.round((band.xL + band.xR) / 2 - raster.info.width / 2);
  const top = Math.round((band.minY + band.maxY) / 2 - raster.info.height / 2);
  debossPrint(data, w, h, raster.data, raster.info.width, raster.info.height, left, top);
  return `engrave ${logoW}x${logoH}@${left},${top}`;
}

async function refineOne(rel, logoPng, measure) {
  const abs = path.join(root, "public", rel);
  const { data, info } = await sharp(abs).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const note = [];
  const organic = rel.includes("/Organic/");
  const found = findLabelMarks(data, w, h);
  const marks = found.filter((mark) => mark.minY > h * 0.3 && mark.bw < w * 0.62);
  if (marks.length) {
    const grown = expandMark(data, w, h, marks[0]);
    const smile = removeSmile(data, w, h, grown);
    if (smile.removed) note.push(`smile ${smile.removed}`);
  } else if (organic || found.some((mark) => mark.minY <= h * 0.3)) {
    const engraved = await engraveCap(data, w, h, logoPng, measure);
    if (engraved) note.push(engraved);
  }
  const destRel = reviewRel(rel);
  const dest = path.join(root, "public", destRel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  await sharp(data, { raw: { width: w, height: h, channels: 4 } }).webp({ quality: 88 }).toFile(dest);
  return { rel, destRel, n: note.length, boxes: note };
}

function promote() {
  let n = 0;
  let missing = 0;
  for (const { files } of lists()) {
    for (const rel of files) {
      const from = path.join(root, "public", reviewRel(rel));
      const to = path.join(root, "public", rel);
      if (!fs.existsSync(from)) {
        missing++;
        console.log("MISSING", reviewRel(rel));
        continue;
      }
      fs.copyFileSync(from, to);
      n++;
    }
  }
  console.log(`promoted ${n}, missing review files ${missing}`);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--promote")) {
    promote();
    return;
  }
  const listArg = args.find((arg) => arg.startsWith("--from="));
  const listed = listArg
    ? fs.readFileSync(listArg.slice("--from=".length), "utf8").split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
    : args.filter((arg) => arg.endsWith(".webp"));
  const files = listed.length
    ? listed
    : args.includes("--all")
      ? lists().flatMap((item) => item.files)
      : pilotFiles();
  const logoPng = await loadLogo();
  const measure = await measureLogo(logoPng);
  let misses = 0;
  for (const rel of files) {
    const result = await refineOne(rel, logoPng, measure);
    if (!result.n) misses++;
    console.log(result.n ? "OK" : "MISS", result.destRel, result.boxes.join(" | ") || "(none)");
  }
  console.log(`done ${files.length}, misses ${misses}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
