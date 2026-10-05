/**
 * Pilot: stamp the official Vitalcore lockup onto catalog photos.
 * Writes previews under scripts/_logo-pilot. Does not touch live product images.
 *
 *   node scripts/pilot-catalog-logos.mjs
 *   node scripts/pilot-catalog-logos.mjs --png
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const svgPath = path.join(root, "public/brand/vitalcore-logo.svg");
const outRoot = path.join(root, "scripts/_logo-pilot");
let writeLive = false;

function catalogRels() {
  const rels = [];
  for (const file of ["src/herbaceutical/imageManifest.ts", "src/nutraceutical/imageManifest.ts"]) {
    const text = fs.readFileSync(path.join(root, file), "utf8");
    for (const match of text.matchAll(/"(\/product-images\/(?:Herbaceutical|Nutraceutical)\/[^"]+)"/g)) {
      rels.push(`public${match[1]}`);
    }
  }
  return [...new Set(rels)];
}

const PILOT = [
  ["label", "public/product-images/Herbaceutical/Anti Oxidents/Elderberry + Green Tea + Beetroot.webp"],
  ["label", "public/product-images/Herbaceutical/Liver Health/Milk Thistle + Dandelion Root + Green Turmeric.webp"],
  ["label", "public/product-images/Nutraceutical/Joint care/Glucosamine.webp"],
  ["label", "public/product-images/Nutraceutical/Anti oxidants/Acai Berry Powder + Vitamin C + Vitamin E + Selenium.webp"],
  ["cap", "public/product-images/Organic/Horsetail/Pomegranate + Cranberry + Curcumin.webp"],
  ["cap", "public/product-images/Organic/Ashwagandha/Kalmegh + Pippali + Vasaka.webp"],
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

function isCream(r, g, b) {
  const l = (r + g + b) / 3;
  const s = Math.max(r, g, b) - Math.min(r, g, b);
  return l > 178 && s < 78 && r + 12 >= b;
}

function isWordInk(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const l = (max + min) / 2;
  if (d < 22 || l < 34 || l > 198) return false;
  if (g < r + 8) return false;
  const h = hueOf(r, g, b);
  return h >= 158 && h <= 198;
}

function isSmileInk(r, g, b) {
  if (isCream(r, g, b)) return false;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const l = (max + min) / 2;
  if (d < 14 || l < 42 || l > 190) return false;
  if (g < r + 4) return false;
  const h = hueOf(r, g, b);
  return h >= 100 && h <= 175;
}

function isTitleDark(r, g, b) {
  return (r + g + b) / 3 < 108;
}

function rowStats(data, w, y, x0, x1, pred) {
  let n = 0;
  let minX = w;
  let maxX = 0;
  for (let x = x0; x <= x1; x++) {
    const i = (y * w + x) * 4;
    if (!pred(data[i], data[i + 1], data[i + 2])) continue;
    n++;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
  }
  return { n, minX, maxX };
}

function isForestInk(r, g, b) {
  if (isWordInk(r, g, b)) return true;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const l = (max + min) / 2;
  if (d < 18 || l < 36 || l > 160) return false;
  if (g < r + 6 || g < b) return false;
  const h = hueOf(r, g, b);
  return h >= 95 && h <= 165;
}

function findWordRun(data, w, h, ink = isWordInk, yBand) {
  const x0 = Math.floor(w * 0.24);
  const x1 = Math.floor(w * 0.76);
  const y0 = yBand ? yBand[0] : Math.floor(h * 0.34);
  const y1 = yBand ? yBand[1] : Math.floor(h * 0.55);
  const rows = [];
  for (let y = y0; y <= y1; y++) {
    const s = rowStats(data, w, y, x0, x1, ink);
    if (s.n >= 28 && s.maxX - s.minX > w * 0.1) rows.push({ y, ...s });
  }
  if (!rows.length) return null;
  const runs = [];
  let cur = [rows[0]];
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].y - cur[cur.length - 1].y <= 14) cur.push(rows[i]);
    else {
      runs.push(cur);
      cur = [rows[i]];
    }
  }
  runs.push(cur);
  const score = (run) => run.reduce((s, r) => s + r.n, 0);
  const upper = runs.filter((run) => (run[0].y + run[run.length - 1].y) / 2 < h * 0.48);
  const pool = upper.length ? upper : runs;
  pool.sort((a, b) => score(b) - score(a));
  const run = pool[0];
  let minX = w;
  let maxX = 0;
  for (const r of run) {
    if (r.minX < minX) minX = r.minX;
    if (r.maxX > maxX) maxX = r.maxX;
  }
  const yTop = run[0].y;
  const yBot = run[run.length - 1].y;
  const col = new Uint16Array(w);
  for (let y = yTop; y <= yBot; y++) {
    for (let x = Math.max(0, minX - 20); x <= Math.min(w - 1, maxX + 20); x++) {
      const i = (y * w + x) * 4;
      if (ink(data[i], data[i + 1], data[i + 2])) col[x]++;
    }
  }
  const need = Math.max(3, Math.round((yBot - yTop + 1) * 0.08));
  const hits = [];
  for (let x = 0; x < w; x++) if (col[x] >= need) hits.push(x);
  if (!hits.length) return null;
  const bands = [];
  let band = [hits[0]];
  for (let i = 1; i < hits.length; i++) {
    if (hits[i] - band[band.length - 1] <= 14) band.push(hits[i]);
    else {
      bands.push(band);
      band = [hits[i]];
    }
  }
  bands.push(band);
  bands.sort((a, b) => b.length - a.length);
  const core = bands[0];
  let left = core[0];
  let right = core[core.length - 1];
  let top = yTop;
  for (let y = yTop - 1; y >= yTop - 40 && y > 0; y--) {
    const s = rowStats(data, w, y, left - 6, right + 6, ink);
    if (s.n >= 5) top = y;
    else break;
  }
  let bot = yBot;
  for (let y = yBot + 1; y <= yBot + 16 && y < h; y++) {
    const s = rowStats(data, w, y, left, right, ink);
    const dark = rowStats(data, w, y, left, right, isTitleDark);
    if (dark.n > 90) break;
    if (s.n >= 12) bot = y;
    else break;
  }
  return { minX: left, maxX: right, minY: top, maxY: bot };
}

function findSmile(data, w, h, word) {
  let maxY = word.maxY;
  let minX = word.minX;
  let maxX = word.maxX;
  let gap = 0;
  let seen = false;
  const limit = Math.min(h - 1, word.maxY + 56);
  for (let y = word.maxY + 1; y <= limit; y++) {
    const dark = rowStats(data, w, y, word.minX, word.maxX, (r, g, b) => isTitleDark(r, g, b) && !isWordInk(r, g, b) && !isSmileInk(r, g, b));
    if (dark.n > 80) break;
    const s = rowStats(data, w, y, word.minX - 8, word.maxX + 8, isSmileInk);
    if (s.n >= 4 && s.maxX - s.minX > 12) {
      seen = true;
      maxY = y;
      if (s.minX > word.minX - 24 && s.minX < minX) minX = s.minX;
      if (s.maxX < word.maxX + 24 && s.maxX > maxX) maxX = s.maxX;
      gap = 0;
    } else if (seen && ++gap > 6) break;
    else if (!seen && ++gap > 22) break;
  }
  return { minX, maxX, maxY };
}

function findTitleTop(data, w, h, word, smileBottom) {
  const x0 = Math.max(0, word.minX - 24);
  const x1 = Math.min(w - 1, word.maxX + 36);
  let body = -1;
  const limit = Math.min(h - 1, smileBottom + 110);
  for (let y = smileBottom + 4; y <= limit; y++) {
    const dark = rowStats(data, w, y, x0, x1, isTitleDark);
    if (dark.n > 45 && dark.maxX - dark.minX > w * 0.1) {
      body = y;
      break;
    }
  }
  if (body < 0) return smileBottom + 36;
  let top = body;
  let gap = 0;
  for (let y = body - 1; y >= Math.max(0, body - 40); y--) {
    const dark = rowStats(data, w, y, x0, x1, isTitleDark);
    if (dark.n >= 3) {
      top = y;
      gap = 0;
    } else if (++gap > 5) break;
  }
  return top;
}

function findPanelTop(data, w, word) {
  const x0 = word.minX;
  const x1 = word.maxX;
  let top = word.minY;
  for (let y = word.minY - 1; y >= word.minY - 70 && y > 0; y--) {
    let cream = 0;
    let seen = 0;
    for (let x = x0; x <= x1; x += 2) {
      seen++;
      const i = (y * w + x) * 4;
      if (isCream(data[i], data[i + 1], data[i + 2])) cream++;
    }
    if (seen && cream / seen >= 0.62) top = y;
    else break;
  }
  return top;
}

function isGold(r, g, b) {
  const h = hueOf(r, g, b);
  const l = (r + g + b) / 3;
  const s = Math.max(r, g, b) - Math.min(r, g, b);
  return h >= 28 && h <= 62 && s > 28 && l > 110 && l < 220 && r > b + 18;
}

function isLabelGreen(r, g, b) {
  if (isCream(r, g, b) || isGold(r, g, b)) return false;
  if (isWordInk(r, g, b) || isSmileInk(r, g, b)) return true;
  const d = Math.max(r, g, b) - Math.min(r, g, b);
  const l = (r + g + b) / 3;
  if (d < 16 || l < 45 || l > 205) return false;
  if (g + 4 < r) return false;
  const h = hueOf(r, g, b);
  return h >= 88 && h <= 190;
}

function buildLabelMask(data, w, h, word, titleTop) {
  let x0 = Math.max(0, word.minX - 16);
  let x1 = Math.min(w - 1, word.maxX + 28);
  const y0 = Math.max(0, word.minY - 10);
  const y1 = Math.min(h - 1, titleTop - 6);
  for (let pass = 0; pass < 2; pass++) {
    for (let y = y0; y <= y1; y++) {
      const dark = rowStats(data, w, y, x0, x1, (r, g, b) => isTitleDark(r, g, b) && !isLabelGreen(r, g, b));
      if (dark.n > 100 && y > word.maxY + 6) continue;
      for (let x = Math.max(0, x0 - 24); x <= Math.min(w - 1, x1 + 24); x++) {
        const i = (y * w + x) * 4;
        if (!isLabelGreen(data[i], data[i + 1], data[i + 2])) continue;
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
      }
    }
  }
  const mask = new Uint8Array(w * h);
  let n = 0;
  for (let y = y0; y <= y1; y++) {
    const dark = rowStats(data, w, y, x0, x1, (r, g, b) => isTitleDark(r, g, b) && !isLabelGreen(r, g, b));
    if (dark.n > 100 && y > word.maxY + 6) continue;
    for (let x = x0; x <= x1; x++) {
      const i = (y * w + x) * 4;
      if (!isLabelGreen(data[i], data[i + 1], data[i + 2])) continue;
      mask[y * w + x] = 1;
      n++;
    }
  }
  const tipX0 = Math.max(0, word.minX - 12);
  const tipX1 = Math.min(w - 1, word.maxX + 28);
  const tipY0 = word.maxY + 1;
  const tipY1 = y1;
  for (let y = tipY0; y <= tipY1; y++) {
    let run = -1;
    const close = (end) => {
      if (run < 0) return;
      const width = end - run;
      if (width >= 2 && width <= tipX1 - tipX0) {
        for (let x = run; x < end; x++) {
          if (!mask[y * w + x]) {
            mask[y * w + x] = 1;
            n++;
          }
        }
      }
      run = -1;
    };
    for (let x = tipX0; x <= tipX1; x++) {
      const i = (y * w + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const bias = g - (r + b) / 2;
      const lum = (r + g + b) / 3;
      if (bias >= 6 && lum > 40 && lum < 230 && !isGold(r, g, b)) {
        if (run < 0) run = x;
      } else if (run >= 0) close(x);
    }
    close(tipX1 + 1);
  }
  const grown = new Uint8Array(mask);
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if (!mask[y * w + x]) continue;
      for (let dy = -3; dy <= 3; dy++) {
        for (let dx = -3; dx <= 3; dx++) {
          const xx = x + dx;
          const yy = y + dy;
          if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
          if (yy > y1) continue;
          const i = (yy * w + xx) * 4;
          if (isGold(data[i], data[i + 1], data[i + 2])) continue;
          grown[yy * w + xx] = 1;
        }
      }
    }
  }
  return { mask: grown, x0, x1, y0, y1, n };
}

function inpaintLabel(data, w, h, built) {
  const { mask, x0, x1, y0, y1 } = built;
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if (!mask[y * w + x]) continue;
      let left = null;
      let leftX = x;
      for (let xx = x - 1; xx >= Math.max(0, x0 - 50); xx--) {
        if (mask[y * w + xx]) continue;
        const i = (y * w + xx) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        if (!isCream(r, g, b)) continue;
        left = [r, g, b];
        leftX = xx;
        break;
      }
      let right = null;
      let rightX = x;
      for (let xx = x + 1; xx <= Math.min(w - 1, x1 + 50); xx++) {
        if (mask[y * w + xx]) continue;
        const i = (y * w + xx) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        if (!isCream(r, g, b)) continue;
        right = [r, g, b];
        rightX = xx;
        break;
      }
      const fillL = left || right;
      const fillR = right || left;
      if (!fillL) continue;
      const span = Math.max(1, rightX - leftX);
      const u = left && right ? (x - leftX) / span : 0;
      const i = (y * w + x) * 4;
      const nr = fillL[0] + (fillR[0] - fillL[0]) * u;
      const ng = fillL[1] + (fillR[1] - fillL[1]) * u;
      const nb = fillL[2] + (fillR[2] - fillL[2]) * u;
      let edge = 0;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const xx = x + dx;
        const yy = y + dy;
        if (xx < 0 || yy < 0 || xx >= w || yy >= h || !mask[yy * w + xx]) edge++;
      }
      const t = edge ? 0.72 : 1;
      data[i] = Math.round(data[i] + (nr - data[i]) * t);
      data[i + 1] = Math.round(data[i + 1] + (ng - data[i + 1]) * t);
      data[i + 2] = Math.round(data[i + 2] + (nb - data[i + 2]) * t);
    }
  }
}

function darkerThanSide(data, w, x, y) {
  const i = (y * w + x) * 4;
  const l = (data[i] + data[i + 1] + data[i + 2]) / 3;
  let sum = 0;
  let c = 0;
  for (const dx of [-18, -12, 12, 18]) {
    const xx = x + dx;
    if (xx < 0 || xx >= w) continue;
    const j = (y * w + xx) * 4;
    sum += (data[j] + data[j + 1] + data[j + 2]) / 3;
    c++;
  }
  if (!c) return false;
  return sum / c - l > 12;
}

function findCapMark(data, w, h) {
  const x0 = Math.floor(w * 0.34);
  const x1 = Math.floor(w * 0.66);
  const y0 = Math.floor(h * 0.17);
  const y1 = Math.floor(h * 0.3);
  const rows = [];
  for (let y = y0; y <= y1; y++) {
    let n = 0;
    let minX = w;
    let maxX = 0;
    for (let x = x0; x <= x1; x++) {
      if (!darkerThanSide(data, w, x, y)) continue;
      n++;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
    }
    if (n >= 22 && maxX - minX > 70) rows.push({ y, n, minX, maxX });
  }
  if (!rows.length) return null;
  const runs = [];
  let cur = [rows[0]];
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].y - cur[cur.length - 1].y <= 8) cur.push(rows[i]);
    else {
      runs.push(cur);
      cur = [rows[i]];
    }
  }
  runs.push(cur);
  runs.sort((a, b) => b.reduce((s, r) => s + r.n, 0) - a.reduce((s, r) => s + r.n, 0));
  const run = runs[0];
  let minX = w;
  let maxX = 0;
  for (const r of run) {
    if (r.minX < minX) minX = r.minX;
    if (r.maxX > maxX) maxX = r.maxX;
  }
  return { minX, maxX, minY: run[0].y, maxY: run[run.length - 1].y, n: run.reduce((s, r) => s + r.n, 0) };
}

function inpaintCap(data, w, h, box) {
  const x0 = Math.max(0, box.minX - 4);
  const x1 = Math.min(w - 1, box.maxX + 4);
  const y0 = Math.max(0, box.minY - 2);
  const y1 = Math.min(h - 1, box.maxY + 4);
  const mask = new Uint8Array(w * h);
  for (let y = y0; y <= y1; y++) {
    const lums = [];
    for (let x = x0; x <= x1; x++) {
      const i = (y * w + x) * 4;
      lums.push((data[i] + data[i + 1] + data[i + 2]) / 3);
    }
    const sorted = [...lums].sort((a, b) => a - b);
    const bright = sorted[Math.floor(sorted.length * 0.72)];
    let run = -1;
    const close = (end) => {
      if (run < 0) return;
      const width = end - run;
      if (width >= 2 && width <= 34) {
        for (let x = run; x < end; x++) mask[y * w + x] = 1;
      }
      run = -1;
    };
    for (let x = x0; x <= x1; x++) {
      const i = (y * w + x) * 4;
      const l = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const dark = bright - l > 11;
      if (dark && run < 0) run = x;
      else if (!dark && run >= 0) close(x);
    }
    close(x1 + 1);
  }
  const grown = new Uint8Array(mask);
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if (!mask[y * w + x]) continue;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx;
          const yy = y + dy;
          if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
          grown[yy * w + xx] = 1;
        }
      }
    }
  }
  grown.forEach((v, i) => { mask[i] = v; });
  for (let pass = 0; pass < 3; pass++) {
    const next = Buffer.from(data);
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        if (!mask[y * w + x]) continue;
        let sr = 0;
        let sg = 0;
        let sb = 0;
        let c = 0;
        for (let dx = -36; dx <= 36; dx++) {
          if (!dx) continue;
          const xx = x + dx;
          if (xx < 0 || xx >= w) continue;
          if (pass === 0 && mask[y * w + xx]) continue;
          const j = (y * w + xx) * 4;
          sr += data[j];
          sg += data[j + 1];
          sb += data[j + 2];
          c++;
        }
        if (!c) continue;
        const i = (y * w + x) * 4;
        next[i] = Math.round(sr / c);
        next[i + 1] = Math.round(sg / c);
        next[i + 2] = Math.round(sb / c);
      }
    }
    next.copy(data);
  }
  return { x0, y0, x1, y1 };
}

function engrave(base, logo, bw, bh, originX, originY, lw, lh) {
  const out = Buffer.from(base);
  for (let y = 0; y < lh; y++) {
    for (let x = 0; x < lw; x++) {
      const a = logo[(y * lw + x) * 4 + 3] / 255;
      if (a < 0.04) continue;
      const ax = x > 0 ? logo[(y * lw + (x - 1)) * 4 + 3] / 255 : 0;
      const ay = y > 0 ? logo[((y - 1) * lw + x) * 4 + 3] / 255 : 0;
      const edge = Math.max(-1, Math.min(1, ax + ay - 2 * a));
      const px = originX + x;
      const py = originY + y;
      const i = (py * bw + px) * 4;
      if (px < 0 || py < 0 || px >= bw || py >= bh) continue;
      const factor = 1 - 0.76 * a + 0.2 * edge;
      out[i] = Math.max(0, Math.min(255, Math.round(base[i] * factor)));
      out[i + 1] = Math.max(0, Math.min(255, Math.round(base[i + 1] * factor)));
      out[i + 2] = Math.max(0, Math.min(255, Math.round(base[i + 2] * factor)));
    }
  }
  return out;
}

function snapshotSmileTips(data, w, h, word, titleTop) {
  const pts = [];
  const x0 = Math.max(0, word.minX - 36);
  const x1 = Math.min(w - 1, word.maxX + 46);
  const y0 = Math.max(0, word.maxY - 40);
  const y1 = Math.min(h - 1, titleTop - 5);
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const i = (y * w + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const bias = g - (r + b) / 2;
      const lum = (r + g + b) / 3;
      if (bias < 4 || lum < 176 || lum > 244) continue;
      if (isGold(r, g, b)) continue;
      pts.push(x, y);
    }
  }
  return pts;
}

function clearSmileTips(data, w, h, pts, logoRaw, lw, lh, left, top) {
  const biasAt = (x, y) => {
    const i = (y * w + x) * 4;
    return data[i + 1] - (data[i] + data[i + 2]) / 2;
  };
  const lumAt = (x, y) => {
    const i = (y * w + x) * 4;
    return (data[i] + data[i + 1] + data[i + 2]) / 3;
  };
  const alphaAt = (x, y) => {
    const lx = x - left;
    const ly = y - top;
    if (lx < 0 || ly < 0 || lx >= lw || ly >= lh) return 0;
    return logoRaw[(ly * lw + lx) * 4 + 3];
  };
  const mask = new Uint8Array(w * h);
  for (let k = 0; k < pts.length; k += 2) {
    const x = pts[k];
    const y = pts[k + 1];
    if (alphaAt(x, y) > 16) continue;
    mask[y * w + x] = 1;
  }
  const grown = Buffer.from(mask);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      if (!mask[y * w + x]) continue;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const xx = x + dx;
          const yy = y + dy;
          if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
          if (yy >= top && yy > 0 && lumAt(xx, yy) < 150) continue;
          if (alphaAt(xx, yy) > 16) continue;
          grown[yy * w + xx] = 1;
        }
      }
    }
  }
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      if (!grown[y * w + x]) continue;
      if (biasAt(x, y) < 2.5 && lumAt(x, y) > 185) continue;
      let fill = null;
      for (let step = 8; step <= 36; step += 2) {
        const yy = y + step;
        if (yy >= h || grown[yy * w + x]) continue;
        if (biasAt(x, yy) > 1.5 || lumAt(x, yy) < 168) continue;
        const i = (yy * w + x) * 4;
        fill = [data[i], data[i + 1], data[i + 2]];
        break;
      }
      if (!fill) {
        for (const dx of [-20, 20, -28, 28]) {
          const xx = x + dx;
          if (xx < 0 || xx >= w || grown[y * w + xx]) continue;
          if (biasAt(xx, y) > 1.5 || lumAt(xx, y) < 168) continue;
          const i = (y * w + xx) * 4;
          fill = [data[i], data[i + 1], data[i + 2]];
          break;
        }
      }
      if (!fill) continue;
      const i = (y * w + x) * 4;
      const edge = !grown[y * w + (x - 1)] || !grown[y * w + (x + 1)] || !grown[(y - 1) * w + x];
      const blend = edge ? 0.55 : 1;
      data[i] = Math.round(data[i] * (1 - blend) + fill[0] * blend);
      data[i + 1] = Math.round(data[i + 1] * (1 - blend) + fill[1] * blend);
      data[i + 2] = Math.round(data[i + 2] * (1 - blend) + fill[2] * blend);
    }
  }
}

function clearDarkShadow(data, w, h, logoRaw, lw, lh, left, top, titleTop) {
  const alphaAt = (x, y) => {
    if (x < 0 || y < 0 || x >= lw || y >= lh) return 0;
    return logoRaw[(y * lw + x) * 4 + 3];
  };
  const sample = (x, y) => {
    const i = (y * w + x) * 4;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    return {
      r, g, b,
      lum: (r + g + b) / 3,
      spread: Math.max(r, g, b) - Math.min(r, g, b),
      bias: g - (r + b) / 2,
    };
  };
  const bottom = new Array(lw).fill(-1);
  let minX = lw;
  let maxX = -1;
  for (let x = 0; x < lw; x++) {
    for (let y = Math.floor(lh * 0.48); y < lh; y++) {
      if (alphaAt(x, y) > 40) bottom[x] = y;
    }
    if (bottom[x] < 0) continue;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
  }
  if (maxX < 0) return 0;
  const span = Math.max(1, maxX - minX);
  const nearestBottom = (x) => {
    if (x >= 0 && x < lw && bottom[x] >= 0) return bottom[x];
    for (let d = 1; d <= 18; d++) {
      if (x + d < lw && bottom[x + d] >= 0) return bottom[x + d];
      if (x - d >= 0 && bottom[x - d] >= 0) return bottom[x - d];
    }
    return -1;
  };
  const mask = new Uint8Array(w * h);
  for (let x = minX - 28; x <= maxX + 28; x++) {
    const b = nearestBottom(x);
    if (b < 0) continue;
    const end = x <= minX + span * 0.22 || x >= maxX - span * 0.22;
    const limit = end ? 7 : 10;
    for (let dy = 1; dy <= 36; dy++) {
      const px = left + x;
      const py = top + b + dy;
      if (px < 2 || py < 2 || px >= w - 2 || py >= h - 2) continue;
      if (py >= titleTop - 5) continue;
      if (alphaAt(x, py - top) > 12) continue;
      const s = sample(px, py);
      if (s.bias > 7 || s.spread > 40 || s.lum < 100 || s.lum > 220) continue;
      let sum = 0;
      let c = 0;
      for (const dx of [-18, -12, 12, 18]) {
        const xx = px + dx;
        if (xx < 0 || xx >= w) continue;
        const n = sample(xx, py);
        if (n.bias > 10) continue;
        sum += n.lum;
        c++;
      }
      if (!c || sum / c - s.lum < limit) continue;
      mask[py * w + px] = 1;
    }
  }
  const grown = Buffer.from(mask);
  for (let y = 2; y < h - 2; y++) {
    for (let x = 2; x < w - 2; x++) {
      if (!mask[y * w + x]) continue;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx;
          const yy = y + dy;
          if (yy >= titleTop - 5) continue;
          if (alphaAt(xx - left, yy - top) > 12) continue;
          const s = sample(xx, yy);
          if (s.lum < 100 || s.bias > 8) continue;
          grown[yy * w + xx] = 1;
        }
      }
    }
  }
  let cleared = 0;
  for (let y = 2; y < h - 2; y++) {
    for (let x = 2; x < w - 2; x++) {
      if (!grown[y * w + x]) continue;
      let fill = null;
      for (const dx of [-22, 22, -30, 30, -16, 16]) {
        const xx = x + dx;
        if (xx < 0 || xx >= w || grown[y * w + xx]) continue;
        const n = sample(xx, y);
        if (n.bias > 2 || n.lum < 170 || n.spread > 40) continue;
        fill = [n.r, n.g, n.b];
        break;
      }
      if (!fill) {
        for (let step = 8; step <= 28; step += 2) {
          const yy = y + step;
          if (yy >= h || yy >= titleTop - 2 || grown[yy * w + x]) continue;
          const n = sample(x, yy);
          if (n.bias > 2 || n.lum < 170) continue;
          fill = [n.r, n.g, n.b];
          break;
        }
      }
      if (!fill) continue;
      const i = (y * w + x) * 4;
      const blend = 1;
      data[i] = Math.round(data[i] * (1 - blend) + fill[0] * blend);
      data[i + 1] = Math.round(data[i + 1] * (1 - blend) + fill[1] * blend);
      data[i + 2] = Math.round(data[i + 2] * (1 - blend) + fill[2] * blend);
      cleared++;
    }
  }
  for (let y = 2; y < h - 2; y++) {
    for (let x = 2; x < w - 2; x++) {
      if (!grown[y * w + x]) continue;
      const s = sample(x, y);
      let sr = 0;
      let sg = 0;
      let sb = 0;
      let c = 0;
      for (const dx of [-8, -6, 6, 8, -12, 12]) {
        const xx = x + dx;
        if (xx < 0 || xx >= w) continue;
        const n = sample(xx, y);
        if (n.bias > 3 || n.lum < 175 || n.spread > 36) continue;
        sr += n.r;
        sg += n.g;
        sb += n.b;
        c++;
      }
      if (c < 2) continue;
      const lum = (sr + sg + sb) / (3 * c);
      if (lum - s.lum < 6) continue;
      const i = (y * w + x) * 4;
      data[i] = Math.round(sr / c);
      data[i + 1] = Math.round(sg / c);
      data[i + 2] = Math.round(sb / c);
    }
  }
  return cleared;
}

function clearUnderTagline(data, w, h, logoRaw, lw, lh, left, top) {
  const alphaAt = (x, y) => {
    if (x < 0 || y < 0 || x >= lw || y >= lh) return 0;
    return logoRaw[(y * lw + x) * 4 + 3];
  };
  const biasAt = (x, y) => {
    const i = (y * w + x) * 4;
    return data[i + 1] - (data[i] + data[i + 2]) / 2;
  };
  const lumAt = (x, y) => {
    const i = (y * w + x) * 4;
    return (data[i] + data[i + 1] + data[i + 2]) / 3;
  };
  const bottom = new Array(lw).fill(-1);
  let minX = lw;
  let maxX = -1;
  for (let x = 0; x < lw; x++) {
    for (let y = Math.floor(lh * 0.5); y < lh; y++) {
      if (alphaAt(x, y) > 40) bottom[x] = y;
    }
    if (bottom[x] < 0) continue;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
  }
  if (maxX < 0) return 0;
  const span = Math.max(1, maxX - minX);
  const leftEnd = minX + Math.round(span * 0.16);
  const rightEnd = maxX - Math.round(span * 0.16);
  const mask = new Uint8Array(w * h);
  const mark = (px, py) => {
    if (px < 1 || py < 1 || px >= w - 1 || py >= h - 1) return;
    if (alphaAt(px - left, py - top) > 18) return;
    if (biasAt(px, py) < 3.5) return;
    const lum = lumAt(px, py);
    if (lum < 155 || lum > 248) return;
    mask[py * w + px] = 1;
  };
  for (let x = minX - 8; x <= maxX + 8; x++) {
    const onLeft = x <= leftEnd;
    const onRight = x >= rightEnd;
    if (!onLeft && !onRight) continue;
    let b = x >= 0 && x < lw ? bottom[x] : -1;
    if (b < 0) {
      for (let d = 1; d <= 14; d++) {
        const xx = onLeft ? x + d : x - d;
        if (xx >= 0 && xx < lw && bottom[xx] >= 0) {
          b = bottom[xx];
          break;
        }
      }
    }
    if (b < 0) continue;
    for (let dy = 1; dy <= 11; dy++) mark(left + x, top + b + dy);
  }
  const grown = Buffer.from(mask);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      if (!mask[y * w + x]) continue;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const xx = x + dx;
          const yy = y + dy;
          if (alphaAt(xx - left, yy - top) > 18) continue;
          if (lumAt(xx, yy) < 155) continue;
          grown[yy * w + xx] = 1;
        }
      }
    }
  }
  let cleared = 0;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      if (!grown[y * w + x]) continue;
      let fill = null;
      for (let step = 10; step <= 32; step += 2) {
        const yy = y + step;
        if (yy >= h) break;
        if (grown[yy * w + x]) continue;
        if (biasAt(x, yy) > 1.5) continue;
        if (lumAt(x, yy) < 165) continue;
        const i = (yy * w + x) * 4;
        fill = [data[i], data[i + 1], data[i + 2]];
        break;
      }
      if (!fill) {
        for (const dx of [-16, 16, -24, 24]) {
          const xx = x + dx;
          if (xx < 0 || xx >= w || grown[y * w + xx]) continue;
          if (biasAt(xx, y) > 1.5 || lumAt(xx, y) < 165) continue;
          const i = (y * w + xx) * 4;
          fill = [data[i], data[i + 1], data[i + 2]];
          break;
        }
      }
      if (!fill) continue;
      const i = (y * w + x) * 4;
      const edge = !grown[y * w + (x - 1)] || !grown[y * w + (x + 1)] || !grown[(y - 1) * w + x] || !grown[(y + 1) * w + x];
      const blend = edge ? 0.45 : 1;
      data[i] = Math.round(data[i] * (1 - blend) + fill[0] * blend);
      data[i + 1] = Math.round(data[i + 1] * (1 - blend) + fill[1] * blend);
      data[i + 2] = Math.round(data[i + 2] * (1 - blend) + fill[2] * blend);
      cleared++;
    }
  }
  return cleared;
}

async function loadLogo() {
  const rendered = await sharp(svgPath, { density: 360 }).png().toBuffer();
  const trimmed = await sharp(rendered).trim().png().toBuffer();
  const meta = await sharp(trimmed).metadata();
  return { png: trimmed, aspect: meta.width / meta.height };
}

async function exportClearPng(logo) {
  const dest = path.join(root, "public/brand/vitalcore-logo-clear.png");
  await sharp(logo.png).resize({ width: 2000 }).png().toFile(dest);
  const meta = await sharp(dest).metadata();
  console.log(`png ${meta.width}x${meta.height} ${dest}`);
}

function oldLogoInk(r, g, b) {
  if (isWordInk(r, g, b) || isForestInk(r, g, b) || isSmileInk(r, g, b)) return true;
  const lum = (r + g + b) / 3;
  const bias = g - (r + b) / 2;
  return bias >= 6 && lum > 45 && lum < 215;
}

const RETOUCH = new Set([
  "public/product-images/Nutraceutical/Bone Health/Coral Calcium + Vitamin D.v34.webp",
  "public/product-images/Nutraceutical/Bone Health/Coral Calcium + Vitamin D + Vitamin B12.v34.webp",
  "public/product-images/Nutraceutical/Bone Health/Coral Calcium + Vitamin D + Magnesium + Zinc.webp",
  "public/product-images/Nutraceutical/Bone Health/Calcium + Vitamin K2 7.webp",
  "public/product-images/Nutraceutical/Bone Health/Calcium + Calcitriol + Zinc.webp",
  "public/product-images/Nutraceutical/Bone Health/Calcium + Soy Isoflavone + Vitamin D.webp",
  "public/product-images/Nutraceutical/Bone Health/Glucosamine + Chondroitin + Calcium.v34.webp",
  "public/product-images/Nutraceutical/Bone Health/Calcium + Magnesium + L-Lysine + Vitamin D.webp",
  "public/product-images/Nutraceutical/Bone Health/Calcium + Magnesium + Boron + Selenium + Copper + Vitamin D.webp",
  "public/product-images/Nutraceutical/Brain health/Alpha Lipoic Acid + Chamomile Extract + Phosphatidylserine + L-Glutathione + Co-Enzyme Q10.webp",
  "public/product-images/Nutraceutical/Diabetic Care/Cinnamon Extract + Bitter Gourd Extract + L-Carnitine + Vitamin D + Calcium Pantothenate + Chromium.webp",
  "public/product-images/Nutraceutical/digestive health/Pre-biotic.webp",
  "public/product-images/Nutraceutical/digestive health/Bromelain + Papain + Amylase.webp",
  "public/product-images/Nutraceutical/Female Fertility/N-Acetylcysteine + L Arginine + Para Aminobenzoic Acid + Vitamin E + Zinc + Chromium.webp",
  "public/product-images/Nutraceutical/Female Fertility/Inositol + Para Aminobenzoic Acid + Vitamin C + Folic Acid + Vitamin B12.webp",
  "public/product-images/Nutraceutical/geiragtic care/Ginseng Extract + Lecithin + Vitamins + Minerals.webp",
  "public/product-images/Nutraceutical/Haematinic/Vitamin B1 + Vitamin B2 + Vitamin B6 + Vitamin B12.webp",
  "public/product-images/Nutraceutical/Heart Health/Omega 3 + Lycopene + Garlic Powder + Plant Sterols.webp",
  "public/product-images/Nutraceutical/Immunity Boosters/Ashwagandha Extract + Shilajit + Beta Carotene + Vitamins.v34.webp",
  "public/product-images/Nutraceutical/Immunity Boosters/Lycopene + L-Lysine + L-Carnitine + Vitamin C + Vitamin E + Copper + Zinc.webp",
  "public/product-images/Nutraceutical/Joint care/Glucosamine + Ashwagandha Extract.v34.webp",
  "public/product-images/Nutraceutical/Joint care/Glucosamine + Gingko Biloba Extract.v34.webp",
  "public/product-images/Nutraceutical/Joint care/Glucosamine + Collagen Peptide.webp",
  "public/product-images/Nutraceutical/Joint care/Glucosamine + Chondroitin + Vitamins + Minerals.webp",
  "public/product-images/Nutraceutical/Liver Detox/Co-Enzyme Q10 + Milk Thistle + Astaxanthin + Calcium Pantothenate + Vitamin D + Selenium.webp",
  "public/product-images/Nutraceutical/Male fertility/Co-Enzyme Q10 + L-Carnitine + Glutathione + Vitamin B12 + Minerals.webp",
  "public/product-images/Nutraceutical/Male fertility/Ginseng Extract + L-Arginine + Lycopene + Vitamin C + Iron + Zinc.webp",
  "public/product-images/Nutraceutical/Respiratory Health/Citrus Bioflavonoid + Quercetin + Vitamin C + Vitamin D + Iron.webp",
  "public/product-images/Nutraceutical/Respiratory Health/Hesperidin + Ellagic Acid + Elderberry Extract + Grapeseed Extract + Zinc.webp",
  "public/product-images/Nutraceutical/Vision/Zeaxanthin + Vitamin C + Vitamin A + Zinc.webp",
  "public/product-images/Nutraceutical/Vision/Bilberry Extract + Lutein + Beta Carotene + Vitamin B1 + Vitamin C.webp",
  "public/product-images/Nutraceutical/Vision/Citrus Bioflavonoid + Beta Carotene + Vitamin B3 + Vitamin A + Zinc.webp",
  "public/product-images/Herbaceutical/Anti Oxidents/Wheat Grass + Acai Berry + Raspberries + Papain.webp",
  "public/product-images/Herbaceutical/Anti Oxidents/Spirulina + Tart Cherry + Bacopa Monnieri.webp",
  "public/product-images/Herbaceutical/Anti Oxidents/Pomegranate + Cranberry + Curcumin.v34.webp",
  "public/product-images/Herbaceutical/Brain Health/Gingko Biloba + Bacopa Monnieri + Shankhpushpi.webp",
  "public/product-images/Herbaceutical/Diabetic care/Chitrak Root + Fenugreek Seed + Olive Leaf.webp",
  "public/product-images/Herbaceutical/Diabetic care/Gymnema Leaf + Bilberry.v34.webp",
  "public/product-images/Herbaceutical/Digestive Health/Amla + Pippali + Ajwain.webp",
]);

function retouchTune(rel) {
  if (!RETOUCH.has(rel)) return null;
  if (rel.endsWith("Coral Calcium + Vitamin D + Vitamin B12.v34.webp")) return { targetW: 185, centerX: 434 };
  if (rel.endsWith("Alpha Lipoic Acid + Chamomile Extract + Phosphatidylserine + L-Glutathione + Co-Enzyme Q10.webp")) return { targetW: 172, centerX: 436 };
  if (rel.endsWith("Bromelain + Papain + Amylase.webp")) return { targetW: 178 };
  if (rel.endsWith("N-Acetylcysteine + L Arginine + Para Aminobenzoic Acid + Vitamin E + Zinc + Chromium.webp")) return { scale: 1.14 };
  if (rel.endsWith("Inositol + Para Aminobenzoic Acid + Vitamin C + Folic Acid + Vitamin B12.webp")) return { scale: 1.14, centerX: 434 };
  if (rel.endsWith("Omega 3 + Lycopene + Garlic Powder + Plant Sterols.webp")) return { targetW: 176, centerX: 437, anchor: "word" };
  if (rel.endsWith("Glucosamine + Gingko Biloba Extract.v34.webp")) return { targetW: 185, centerX: 434 };
  if (rel.endsWith("Glucosamine + Chondroitin + Vitamins + Minerals.webp")) return { targetW: 185, centerX: 434 };
  if (rel.endsWith("Zeaxanthin + Vitamin C + Vitamin A + Zinc.webp")) return { targetW: 175, centerX: 436, anchor: "word" };
  if (rel.endsWith("Citrus Bioflavonoid + Beta Carotene + Vitamin B3 + Vitamin A + Zinc.webp")) return { targetW: 175, centerX: 436, anchor: "word" };
  if (rel.endsWith("Bilberry Extract + Lutein + Beta Carotene + Vitamin B1 + Vitamin C.webp")) return { targetW: 175, centerX: 434 };
  if (rel.endsWith("Pomegranate + Cranberry + Curcumin.v34.webp")) return { centerX: 440 };
  if (rel.endsWith("Amla + Pippali + Ajwain.webp")) return { centerX: 434 };
  return {};
}

function healOldLogo(data, original, w, h, box, titleTop) {
  const y0 = Math.max(1, box.minY - 10);
  const y1 = Math.min(h - 2, titleTop - 5);
  const x0 = Math.max(1, box.minX - 18);
  const x1 = Math.min(w - 2, box.maxX + 22);
  const core = new Uint8Array(w * h);
  for (let y = y0; y <= y1; y++) {
    let side = 0;
    let sideN = 0;
    for (const x of [x0 - 14, x0 - 8, x1 + 8, x1 + 14]) {
      if (x < 1 || x >= w - 1) continue;
      const i = (y * w + x) * 4;
      const lum = (original[i] + original[i + 1] + original[i + 2]) / 3;
      if (lum < 140 || lum > 250) continue;
      side += lum;
      sideN++;
    }
    const sideLum = sideN ? side / sideN : 200;
    for (let x = x0; x <= x1; x++) {
      const i = (y * w + x) * 4;
      const r = original[i];
      const g = original[i + 1];
      const b = original[i + 2];
      if (oldLogoInk(r, g, b)) {
        core[y * w + x] = 1;
        continue;
      }
      const lum = (r + g + b) / 3;
      const spread = Math.max(r, g, b) - Math.min(r, g, b);
      const bias = g - (r + b) / 2;
      const at = (xx) => {
        const j = (y * w + xx) * 4;
        return (original[j] + original[j + 1] + original[j + 2]) / 3;
      };
      const leftLum = x > 8 ? at(x - 7) : lum;
      const rightLum = x < w - 8 ? at(x + 7) : lum;
      const lightSpike = lum > leftLum + 7 && lum > rightLum + 7 && lum > 170;
      const darkSpike = y > box.maxY - 4 && lum < leftLum - 10 && lum < rightLum - 10 && lum > 60;
      if (lightSpike || darkSpike) core[y * w + x] = 1;
      if (y > box.maxY && lum < sideLum - 16 && lum > 70 && spread < 48 && bias < 8) core[y * w + x] = 1;
    }
  }
  const ink = new Uint8Array(core);
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if (!core[y * w + x]) continue;
      for (let dy = -3; dy <= 3; dy++) {
        for (let dx = -3; dx <= 3; dx++) {
          const xx = x + dx;
          const yy = y + dy;
          if (xx < x0 || yy < y0 || xx > x1 || yy > y1) continue;
          ink[yy * w + xx] = 1;
        }
      }
    }
  }
  const creamAt = (x, y) => {
    const read = (xx, yy) => {
      if (xx < 1 || yy < 1 || xx >= w - 1 || yy >= h - 1) return null;
      if (yy >= y0 && yy <= y1 && xx >= x0 && xx <= x1 && ink[yy * w + xx]) return null;
      const i = (yy * w + xx) * 4;
      const r = original[i];
      const g = original[i + 1];
      const b = original[i + 2];
      const lum = (r + g + b) / 3;
      const bias = g - (r + b) / 2;
      if (lum < 145 || lum > 250 || bias > 8) return null;
      return [r, g, b];
    };
    for (let dy = 1; dy <= 28; dy++) {
      const up = read(x, y - dy);
      const down = read(x, y + dy);
      if (up && down) return up.map((v, i) => Math.round((v + down[i]) / 2));
      if (up) return up;
      if (down) return down;
    }
    for (let dx = 1; dx <= 12; dx++) {
      const left = read(x - dx, y);
      const right = read(x + dx, y);
      if (left) return left;
      if (right) return right;
    }
    return null;
  };
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const p = y * w + x;
      const i = p * 4;
      if (!ink[p]) {
        data[i] = original[i];
        data[i + 1] = original[i + 1];
        data[i + 2] = original[i + 2];
        continue;
      }
      const fill = creamAt(x, y);
      if (!fill) continue;
      const t = 1;
      data[i] = Math.round(original[i] + (fill[0] - original[i]) * t);
      data[i + 1] = Math.round(original[i + 1] + (fill[1] - original[i + 1]) * t);
      data[i + 2] = Math.round(original[i + 2] + (fill[2] - original[i + 2]) * t);
    }
  }
}

function flattenColumnCream(data, original, w, h, box, titleTop) {
  const y0 = Math.max(1, box.minY - 12);
  const y1 = Math.min(h - 2, titleTop - 6);
  const x0 = Math.max(1, box.minX - 16);
  const x1 = Math.min(w - 2, box.maxX + 20);
  for (let x = x0; x <= x1; x++) {
    let sample = null;
    for (let y = y0 - 2; y >= Math.max(1, y0 - 30); y--) {
      const i = (y * w + x) * 4;
      const r = original[i];
      const g = original[i + 1];
      const b = original[i + 2];
      const lum = (r + g + b) / 3;
      const bias = g - (r + b) / 2;
      if (lum < 165 || lum > 245 || bias > 8) continue;
      sample = [r, g, b];
      break;
    }
    if (!sample) continue;
    const sampleLum = (sample[0] + sample[1] + sample[2]) / 3;
    for (let y = y0; y <= y1; y++) {
      const i = (y * w + x) * 4;
      const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
      if (Math.abs(lum - sampleLum) < 6) continue;
      if (lum < 96 && y > box.maxY + 4) continue;
      const edge = Math.min(x - x0, x1 - x, y - y0, y1 - y);
      const t = edge >= 6 ? 1 : Math.max(0, edge) / 6;
      data[i] = Math.round(data[i] + (sample[0] - data[i]) * t);
      data[i + 1] = Math.round(data[i + 1] + (sample[1] - data[i + 1]) * t);
      data[i + 2] = Math.round(data[i + 2] + (sample[2] - data[i + 2]) * t);
    }
  }
}

function clearCapEngraving(data, original, w) {
  const zones = [
    { y0: 158, y1: 198, above: 152, below: 204, x0: 300, x1: 575 },
    { y0: 224, y1: 296, above: 218, below: 300, x0: 300, x1: 575 },
  ];
  const read = (x, y) => {
    if (x < 1 || y < 1) return null;
    const i = (y * w + x) * 4;
    const lum = (original[i] + original[i + 1] + original[i + 2]) / 3;
    const spread = Math.max(original[i], original[i + 1], original[i + 2]) - Math.min(original[i], original[i + 1], original[i + 2]);
    if (lum < 160 || lum > 252 || spread > 30) return null;
    return [original[i], original[i + 1], original[i + 2]];
  };
  for (const zone of zones) {
    const cols = new Array(w);
    for (let x = zone.x0; x <= zone.x1; x++) {
      const top = read(x, zone.above);
      const bot = read(x, zone.below);
      if (top && bot) cols[x] = [top, bot];
    }
    for (let x = zone.x0; x <= zone.x1; x++) {
      if (cols[x]) continue;
      for (let d = 1; d <= 36; d++) {
        if (cols[x - d]) { cols[x] = cols[x - d]; break; }
        if (cols[x + d]) { cols[x] = cols[x + d]; break; }
      }
    }
    for (let x = zone.x0; x <= zone.x1; x++) {
      if (!cols[x]) continue;
      const [top, bot] = cols[x];
      for (let y = zone.y0; y <= zone.y1; y++) {
        const t = (y - zone.above) / (zone.below - zone.above);
        const i = (y * w + x) * 4;
        data[i] = Math.round(top[0] + (bot[0] - top[0]) * t);
        data[i + 1] = Math.round(top[1] + (bot[1] - top[1]) * t);
        data[i + 2] = Math.round(top[2] + (bot[2] - top[2]) * t);
      }
    }
  }
}

async function processLabel(rel, logo) {
  const abs = path.join(root, rel);
  const { data, info } = await sharp(abs).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const original = Buffer.from(data);
  const w = info.width;
  const h = info.height;
  let word = findWordRun(data, w, h) || findWordRun(data, w, h, isForestInk);
  if (rel.includes("Omega 3 + Lycopene") || rel.includes("Zeaxanthin + Vitamin C") || rel.includes("Citrus Bioflavonoid + Beta Carotene + Vitamin B3")) {
    word = findWordRun(data, w, h, isForestInk, [400, 500]) || word;
  }
  if (!word) return { rel, ok: false, reason: "no wordmark" };
  const smile = findSmile(data, w, h, word);
  const titleTop = findTitleTop(data, w, h, word, Math.max(word.maxY, smile.maxY));
  const smileTips = snapshotSmileTips(data, w, h, word, titleTop);
  const panelTop = findPanelTop(data, w, word);
  const built = buildLabelMask(data, w, h, {
    minX: Math.min(word.minX, smile.minX),
    maxX: Math.max(word.maxX, smile.maxX),
    minY: word.minY,
    maxY: Math.max(word.maxY, smile.maxY),
  }, titleTop);
  inpaintLabel(data, w, h, built);
  const box = { minX: built.x0, maxX: built.x1, minY: word.minY, maxY: built.y1 };
  const availTop = panelTop + 2;
  const availBot = titleTop - 8;
  const availH = Math.max(24, availBot - availTop);
  const availW = Math.max(24, Math.min(word.maxX, built.x1) - Math.max(word.minX, built.x0) - 8);
  let logoW = Math.min(availW, Math.round(availH * logo.aspect));
  let logoH = Math.round(logoW / logo.aspect);
  if (logoH > availH) {
    logoH = availH;
    logoW = Math.round(logoH * logo.aspect);
  }
  const cx = Math.round((word.minX + word.maxX) / 2);
  let left = cx - Math.round(logoW / 2);
  let top = availTop + Math.round((availH - logoH) / 2);
  const tune = retouchTune(rel);
  if (tune && (tune.targetW || tune.scale || tune.centerX || tune.anchor)) {
    let width = tune.targetW || Math.round(logoW * (tune.scale || 1));
    let height = Math.round(width / logo.aspect);
    const maxH = Math.max(32, titleTop - 8 - availTop);
    if (height > maxH) {
      height = maxH;
      width = Math.round(height * logo.aspect);
    }
    const center = tune.centerX || cx;
    logoW = width;
    logoH = height;
    left = center - Math.round(logoW / 2);
    top = tune.anchor === "word"
      ? Math.max(availTop, word.minY - 2)
      : availTop + Math.round((availH - logoH) / 2);
    if (top + logoH > titleTop - 6) top = titleTop - 6 - logoH;
  }
  left = Math.max(0, Math.min(w - logoW, left));
  top = Math.max(0, Math.min(h - logoH, top));
  const logoRaw = await sharp(logo.png)
    .resize({ width: logoW, height: logoH, fit: "fill" })
    .ensureAlpha()
    .raw()
    .toBuffer();
  const stampLogo = () => {
    for (let y = 0; y < logoH; y++) {
      for (let x = 0; x < logoW; x++) {
        const a = logoRaw[(y * logoW + x) * 4 + 3] / 255;
        if (a < 0.03) continue;
        const px = left + x;
        const py = top + y;
        if (px < 0 || py < 0 || px >= w || py >= h) continue;
        const i = (py * w + px) * 4;
        const li = (y * logoW + x) * 4;
        const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const gain = 0.9 + 0.1 * Math.min(1, lum / 215);
        data[i] = Math.round(data[i] * (1 - a) + logoRaw[li] * gain * a);
        data[i + 1] = Math.round(data[i + 1] * (1 - a) + logoRaw[li + 1] * gain * a);
        data[i + 2] = Math.round(data[i + 2] * (1 - a) + logoRaw[li + 2] * gain * a);
      }
    }
  };
  if (RETOUCH.has(rel)) {
    const healBox = {
      minX: Math.min(word.minX, smile.minX),
      maxX: Math.max(word.maxX, smile.maxX),
      minY: rel.includes("Bilberry Extract + Lutein") || rel.includes("Vitamin K2 7") || rel.includes("Gingko Biloba Extract")
        ? word.minY - 36
        : word.minY,
      maxY: Math.max(word.maxY, smile.maxY),
    };
    healOldLogo(data, original, w, h, healBox, titleTop);
    if (rel.includes("Ginseng Extract + Lecithin") || rel.includes("Vitamin B1 + Vitamin B2") || rel.includes("Omega 3 + Lycopene") || rel.includes("Ashwagandha Extract + Shilajit") || rel.includes("Lycopene + L-Lysine") || rel.includes("Glucosamine + Ashwagandha") || rel.includes("Glucosamine + Collagen Peptide") || rel.includes("Glucosamine + Gingko") || rel.includes("Chondroitin + Vitamins + Minerals") || rel.includes("Milk Thistle + Astaxanthin") || rel.includes("Male fertility") || rel.includes("Respiratory Health") || rel.includes("Vision/") || rel.includes("Vitamin K2 7") || rel.includes("Wheat Grass + Acai") || rel.includes("Spirulina + Tart Cherry") || rel.includes("Pomegranate + Cranberry") || rel.includes("Chitrak Root") || rel.includes("Gymnema Leaf + Bilberry") || rel.includes("Amla + Pippali") || rel.includes("Gingko Biloba + Bacopa")) {
      flattenColumnCream(data, original, w, h, healBox, titleTop);
    }
  }
  stampLogo();
  if (rel.includes("Lycopene + L-Lysine")) {
    for (let y = Math.max(1, top - 12); y < top; y++) {
      for (let x = left; x < left + logoW; x++) {
        const i = (y * w + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const lum = (r + g + b) / 3;
        const bias = g - (r + b) / 2;
        if (bias < 6 || lum > 175) continue;
        const s = ((y - 8) * w + x) * 4;
        data[i] = data[s];
        data[i + 1] = data[s + 1];
        data[i + 2] = data[s + 2];
      }
    }
  }
  clearUnderTagline(data, w, h, logoRaw, logoW, logoH, left, top);
  clearSmileTips(data, w, h, smileTips, logoRaw, logoW, logoH, left, top);
  clearDarkShadow(data, w, h, logoRaw, logoW, logoH, left, top, titleTop);
  if (rel.includes("Hesperidin + Ellagic Acid")) {
    const xL = Math.max(1, left - 48);
    const xR = Math.min(w - 2, left + 28);
    const yL = Math.max(1, top - 8);
    const yR = Math.min(h - 2, top + logoH + 6);
    for (let y = yL; y <= yR; y++) {
      for (let x = xL; x <= xR; x++) {
        const lx = x - left;
        const ly = y - top;
        if (lx >= 0 && ly >= 0 && lx < logoW && ly < logoH && logoRaw[(ly * logoW + lx) * 4 + 3] > 24) continue;
        const i = (y * w + x) * 4;
        const r = original[i];
        const g = original[i + 1];
        const b = original[i + 2];
        const lum = (r + g + b) / 3;
        const bias = g - (r + b) / 2;
        const spread = Math.max(r, g, b) - Math.min(r, g, b);
        if (lum < 145 || lum > 230 || bias > 8 || spread > 40) continue;
        const cur = (data[i] + data[i + 1] + data[i + 2]) / 3;
        if (cur < lum + 5) continue;
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
      }
    }
    for (let y = top - 4; y < top + logoH; y++) {
      for (let x = left - 18; x < left + 22; x++) {
        const lx = x - left;
        const ly = y - top;
        const alpha = lx >= 0 && ly >= 0 && lx < logoW && ly < logoH ? logoRaw[(ly * logoW + lx) * 4 + 3] : 0;
        if (alpha > 36) continue;
        const i = (y * w + x) * 4;
        const bias = data[i + 1] - (data[i] + data[i + 2]) / 2;
        const cur = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const sx = x - 22;
        if (sx < 1) continue;
        const s = (y * w + sx) * 4;
        const sl = (data[s] + data[s + 1] + data[s + 2]) / 3;
        const sbias = data[s + 1] - (data[s] + data[s + 2]) / 2;
        if (sl < 150 || sl > 190 || sbias > 5) continue;
        const pale = bias > 5 && cur > 135 && cur < 210;
        const bright = bias < 6 && cur > sl + 8;
        if (!pale && !bright) continue;
        data[i] = data[s];
        data[i + 1] = data[s + 1];
        data[i + 2] = data[s + 2];
      }
    }
  }
  if (!RETOUCH.has(rel) && (rel.includes("Hyaluronic Acid") || rel.includes("Co-Enzyme Q10") || rel.includes("Green Tea Extract + Grapeseed"))) {
    healOldLogo(data, original, w, h, {
      minX: Math.min(word.minX, smile.minX),
      maxX: Math.max(word.maxX, smile.maxX),
      minY: word.minY,
      maxY: Math.max(word.maxY, smile.maxY),
    }, titleTop);
    stampLogo();
  }
  if (rel.includes("Gingko Biloba + Bacopa")) clearCapEngraving(data, original, w);
  const dest = writeLive ? path.join(root, rel) : path.join(outRoot, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const encoded = await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .webp({ quality: 92, smartSubsample: true })
    .toBuffer();
  if (writeLive) {
    const tmp = `${dest}.stamp-tmp`;
    fs.writeFileSync(tmp, encoded);
    fs.rmSync(dest, { force: true });
    fs.renameSync(tmp, dest);
  } else {
    fs.writeFileSync(dest, encoded);
  }
  return {
    rel,
    ok: true,
    note: `word ${word.minX},${word.minY}-${word.maxX},${word.maxY} smileY ${smile.maxY} title ${titleTop} ink ${built.n} logo ${logoW}x${logoH}@${left},${top}`,
  };
}

async function processCap(rel, logo) {
  const abs = path.join(root, rel);
  const { data, info } = await sharp(abs).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const mark = findCapMark(data, w, h);
  if (!mark) return { rel, ok: false, reason: "no cap mark" };
  const cx = Math.round((mark.minX + mark.maxX) / 2);
  const cy = Math.round((mark.minY + mark.maxY) / 2 + 6);
  const cover = {
    ...mark,
    minY: Math.max(0, mark.minY - 16),
    maxY: Math.min(h - 1, mark.maxY + 32),
  };
  inpaintCap(data, w, h, cover);
  let logoW = Math.min(Math.round((mark.maxX - mark.minX) * 1.16), Math.round(w * 0.33));
  let logoH = Math.round(logoW / logo.aspect);
  const maxH = Math.round(h * 0.115);
  if (logoH > maxH) {
    logoH = maxH;
    logoW = Math.round(logoH * logo.aspect);
  }
  const left = Math.max(0, Math.min(w - logoW, cx - Math.round(logoW / 2)));
  const top = Math.max(0, Math.min(h - logoH, cy - Math.round(logoH / 2)));
  const logoRaw = await sharp(logo.png)
    .resize({ width: logoW, height: logoH, fit: "fill" })
    .ensureAlpha()
    .raw()
    .toBuffer();
  const engraved = engrave(data, logoRaw, w, h, left, top, logoW, logoH);
  const dest = path.join(outRoot, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  await sharp(engraved, { raw: { width: w, height: h, channels: 4 } })
    .webp({ quality: 90 })
    .toFile(dest);
  return {
    rel,
    ok: true,
    note: `mark ${mark.minX},${mark.minY}-${mark.maxX},${mark.maxY} logo ${logoW}x${logoH}@${left},${top}`,
  };
}

async function main() {
  const logo = await loadLogo();
  console.log(`lockup aspect ${logo.aspect.toFixed(3)}`);
  if (process.argv.includes("--png")) await exportClearPng(logo);
  if (process.argv.includes("--catalog")) {
    writeLive = true;
    const rels = catalogRels();
    const skipped = [];
    let written = 0;
    for (const rel of rels) {
      if (!rel.startsWith("public/product-images/Herbaceutical/") && !rel.startsWith("public/product-images/Nutraceutical/")) {
        skipped.push(`${rel} (out of scope)`);
        continue;
      }
      if (!fs.existsSync(path.join(root, rel))) {
        skipped.push(`${rel} (missing file)`);
        continue;
      }
      try {
        const result = await processLabel(rel, logo);
        if (!result.ok) {
          skipped.push(`${rel} (${result.reason})`);
          console.log("SKIP", rel, result.reason);
          continue;
        }
        written++;
        console.log("ok", rel);
        console.log("   ", result.note);
      } catch (err) {
        skipped.push(`${rel} (${err.message})`);
        console.log("SKIP", rel, err.message);
      }
    }
    console.log(`written ${written}`);
    console.log(`skipped ${skipped.length}`);
    for (const line of skipped) console.log("SKIPPED", line);
    return;
  }
  const only = process.argv.filter((arg) => arg.startsWith("public/product-images/"));
  const files = only.length ? only.map((rel) => ["label", rel]) : PILOT.filter(([kind]) => kind === "label");
  for (const [kind, rel] of files) {
    const result = kind === "cap" ? await processCap(rel, logo) : await processLabel(rel, logo);
    console.log(result.ok ? "ok" : "FAIL", result.rel);
    console.log("   ", result.note || result.reason);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
