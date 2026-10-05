/**
 * Stamp the exact Vitalcore lockup onto existing photos.
 * Covers the old wordmark, leaf, and smile curve, then draws the SVG
 * (wordmark + arched MADE FOR HEALTH, no extra curve).
 *
 * Catalog bottles are read from git HEAD (the pre-stamp photos) so a
 * second pass does not paint over the new logo.
 *
 *   node scripts/stamp-vitalcore-logo.mjs --catalog-pilot
 *   node scripts/stamp-vitalcore-logo.mjs --catalogs --write
 *   node scripts/stamp-vitalcore-logo.mjs --pilot
 *   node scripts/stamp-vitalcore-logo.mjs --all --write
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const svgPath = path.join(root, "public/brand/vitalcore-logo.svg");
const outRoot = path.join(root, "scripts/_tmp-logo-out");
const LOGO_ASPECT = 977 / 375;

const PACKS = [
  "public/packaging/jar.webp",
  "public/packaging/sachets.webp",
  "public/packaging/blister.webp",
  "public/packaging/bulk-packs.webp",
  "public/packaging/bottle-packs.webp",
  "public/packaging/alu-alu.webp",
  "public/packaging/stick-pack.webp",
];

const PREVIEW = [
  "public/packaging/jar.webp",
  "public/packaging/sachets.webp",
  "public/packaging/blister.webp",
  "public/packaging/stick-pack.webp",
];

const CATALOG_PILOT = [
  "public/product-images/Nutraceutical/Anti-Ageing/L-Carnitine + Grapeseed Extract + Astaxanthin.webp",
  "public/product-images/Nutraceutical/Joint care/Glucosamine.webp",
  "public/product-images/Nutraceutical/Anti oxidants/Acai Berry Powder + Vitamin C + Vitamin E + Selenium.webp",
  "public/product-images/Herbaceutical/Liver Health/Milk Thistle + Dandelion Root + Green Turmeric.webp",
  "public/product-images/Herbaceutical/Anti Oxidents/Elderberry + Green Tea + Beetroot.webp",
];

function readManifestPaths(file) {
  const text = fs.readFileSync(path.join(root, file), "utf8");
  return [...text.matchAll(/"(\/[^"]+\.webp)"/g)].map((m) => m[1].replace(/^\//, ""));
}

function catalogTargets() {
  return [
    ...readManifestPaths("src/herbaceutical/imageManifest.ts"),
    ...readManifestPaths("src/nutraceutical/imageManifest.ts"),
  ].map((p) => `public/${p}`);
}

function allTargets() {
  const products = [
    ...readManifestPaths("src/herbaceutical/imageManifest.ts"),
    ...readManifestPaths("src/nutraceutical/imageManifest.ts"),
    ...readManifestPaths("src/organic/imageManifest.ts"),
  ].map((p) => `public/${p}`);
  const explore = [
    "public/homepage/nuetra.webp",
    "public/homepage/herbal.webp",
    "public/homepage/organic.webp",
  ];
  const packs = [
    "jar",
    "sachets",
    "blister",
    "bulk-packs",
    "bottle-packs",
    "alu-alu",
    "stick-pack",
  ].map((name) => `public/packaging/${name}.webp`);
  return [...new Set([...products, ...explore, ...packs])];
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

function isBotanical(r, g, b) {
  if (isLogoFamily(r, g, b)) return false;
  const lum = (r + g + b) / 3;
  const spread = Math.max(r, g, b) - Math.min(r, g, b);
  if (spread < 28 || lum > 210 || g < r + 8) return false;
  const h = hueOf(r, g, b);
  return h >= 70 && h < 155;
}

function isCream(r, g, b) {
  if (isLogoInk(r, g, b)) return false;
  const lum = (r + g + b) / 3;
  const spread = Math.max(r, g, b) - Math.min(r, g, b);
  return lum > 175 && r + 8 >= b && spread < 70;
}

function isDarkTitle(r, g, b) {
  if (isLogoFamily(r, g, b) || isLogoInk(r, g, b) || isSmileInk(r, g, b) || isArcGreen(r, g, b)) return false;
  const lum = (r + g + b) / 3;
  if (lum >= 95) return false;
  if (g > r + 8 && g >= b) return false;
  return true;
}

function isGoldLine(r, g, b) {
  const h = hueOf(r, g, b);
  const lum = (r + g + b) / 3;
  const spread = Math.max(r, g, b) - Math.min(r, g, b);
  return h >= 28 && h <= 62 && spread > 28 && lum > 100 && lum < 220 && r > b + 18;
}

function isSmileInk(r, g, b) {
  if (isBotanical(r, g, b) || isGoldLine(r, g, b)) return false;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const l = (max + min) / 2;
  if (d < 8 || l < 40 || l > 225) return false;
  if (g < r) return false;
  const h = hueOf(r, g, b);
  return h >= 150 && h <= 205;
}

function isArcGreen(r, g, b) {
  if (isGoldLine(r, g, b)) return false;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const l = (max + min) / 2;
  if (d < 14 || l < 40 || l > 195) return false;
  if (g < r + 6) return false;
  const h = hueOf(r, g, b);
  return h >= 108 && h <= 170;
}

function isCoverable(r, g, b) {
  if (isBotanical(r, g, b) || isGoldLine(r, g, b) || isDarkTitle(r, g, b)) return false;
  if (isLogoFamily(r, g, b) || isLogoInk(r, g, b) || isCream(r, g, b) || isSmileInk(r, g, b)) return true;
  const lum = (r + g + b) / 3;
  const spread = Math.max(r, g, b) - Math.min(r, g, b);
  return lum > 155 && spread < 95;
}

function components(mask, w, h, minArea) {
  const seen = new Uint8Array(mask.length);
  const comps = [];
  const stack = [];
  for (let start = 0; start < mask.length; start++) {
    if (!mask[start] || seen[start]) continue;
    let minX = w, maxX = 0, minY = h, maxY = 0, area = 0;
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
      const nbs = [p - 1, p + 1, p - w, p + w];
      for (const n of nbs) {
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
      const r = data[i], g = data[i + 1], b = data[i + 2];
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
    let minX = Infinity, maxX = -1, minY = Infinity, maxY = -1, area = 0;
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
      bw > w * 0.08 &&
      bw < w * 0.52 &&
      bh > h * 0.012 &&
      bh < h * 0.12 &&
      cream >= 0.35;
    if (process.env.DEBUG && bw > w * 0.04) {
      console.log(
        "  cand",
        `${bw}x${bh}@${minX},${minY}`,
        `n=${members.length}`,
        `fill=${fill.toFixed(2)}`,
        `asp=${aspect.toFixed(2)}`,
        `cream=${cream.toFixed(2)}`,
        word ? "KEEP" : "drop",
      );
    }
    if (!word) continue;
    marks.push({ ...box, cream });
  }
  marks.sort((a, b) => a.minY - b.minY || b.bw - a.bw);
  const band = marks.filter((m) => m.minY > h * 0.32 && m.minY < h * 0.5);
  const pool = band.length ? band : marks.filter((m) => m.minY > h * 0.32 && m.minY < h * 0.55);
  const usable = pool.length ? pool : marks;
  const strong = usable.filter((m) => m.cream >= 0.8);
  const pickFrom = strong.length ? strong : usable;
  pickFrom.sort((a, b) => a.minY - b.minY);
  return pickFrom.slice(0, 1);
}

function rowHits(data, w, y, x0, x1, pred) {
  let n = 0;
  let seen = 0;
  for (let x = x0; x <= x1; x += 2) {
    seen++;
    const i = (y * w + x) * 4;
    if (pred(data[i], data[i + 1], data[i + 2])) n++;
  }
  return { n, seen };
}

function expandMark(data, w, h, box) {
  const x0 = Math.max(0, box.minX - Math.round(box.bw * 0.06));
  const x1 = Math.min(w - 1, box.maxX + Math.round(box.bw * 0.06));
  let minY = box.minY;
  let maxY = box.maxY;
  const upLimit = Math.max(0, box.minY - Math.round(box.bh * 0.55));
  const downLimit = Math.min(h - 1, box.maxY + Math.round(box.bh * 1.15));
  const gapLimit = Math.max(6, Math.round(box.bh * 0.5));

  let gap = 0;
  for (let y = box.minY; y >= upLimit; y--) {
    const ink = rowHits(data, w, y, x0, x1, isLogoFamily);
    const dark = rowHits(data, w, y, x0, x1, isDarkTitle);
    if (dark.seen && dark.n / dark.seen > 0.18) break;
    if (ink.n >= 2) {
      minY = y;
      gap = 0;
    } else if (++gap > gapLimit) break;
  }

  gap = 0;
  for (let y = box.maxY; y <= downLimit; y++) {
    const ink = rowHits(data, w, y, x0, x1, isSmileInk);
    const dark = rowHits(data, w, y, x0, x1, isDarkTitle);
    if (dark.seen && dark.n / dark.seen > 0.1) break;
    if (ink.n >= 2) {
      maxY = y;
      gap = 0;
    } else if (++gap > gapLimit) break;
  }

  const padX = Math.max(3, Math.round(box.bh * 0.12));
  const padY = Math.max(4, Math.round(box.bh * 0.14));
  let minX = Math.max(0, box.minX - padX);
  let maxX = Math.min(w - 1, box.maxX + padX);
  minY = Math.max(0, minY - padY);
  const wordBottom = maxY;
  const grow = Math.round(box.bw * 0.12);
  for (let x = maxX + 1; x <= Math.min(w - 1, maxX + grow); x++) {
    let hit = false;
    for (let y = minY; y <= wordBottom; y += 2) {
      const i = (y * w + x) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if (isLogoFamily(r, g, b) || isArcGreen(r, g, b)) {
        hit = true;
        break;
      }
    }
    if (!hit) break;
    maxX = x;
  }

  const smileEnd = Math.min(h - 1, wordBottom + Math.round(Math.max(box.bh, 28) * 1.5));
  const smileGap = Math.max(10, Math.round(box.bh * 0.7));
  let smileGapRun = 0;
  let smileTop = -1;
  let smileBot = -1;
  for (let y = wordBottom + 1; y <= smileEnd; y++) {
    const arc = rowHits(data, w, y, minX, maxX, isArcGreen);
    const dark = rowHits(data, w, y, minX, maxX, isDarkTitle);
    if (dark.seen && dark.n / dark.seen > 0.15 && smileTop < 0) break;
    const hit = arc.n >= 6;
    if (hit) {
      if (smileTop < 0) smileTop = y;
      smileBot = y;
      smileGapRun = 0;
    } else if (smileTop >= 0) {
      if (++smileGapRun > 3) break;
    } else if (++smileGapRun > smileGap) break;
  }
  if (smileTop >= 0) {
    const smileH = smileBot - smileTop + 1;
    if (smileH <= Math.max(22, Math.round(box.bh * 0.5))) {
      maxY = Math.min(h - 1, smileBot + 4);
    }
  }

  const capW = Math.min(Math.round(box.bw * 1.18), Math.round(w * 0.38));
  const capH = Math.min(Math.round(Math.max(box.bh, 24) * 2.3), Math.round(h * 0.12));
  if (maxX - minX + 1 > capW) {
    const cx = Math.round((box.minX + box.maxX) / 2);
    minX = Math.max(0, cx - Math.round(capW / 2));
    maxX = Math.min(w - 1, minX + capW - 1);
  }
  if (maxY - minY + 1 > capH) {
    minY = Math.max(0, box.minY - Math.round(box.bh * 0.25));
    maxY = Math.min(h - 1, minY + capH - 1);
  }

  let inkMin = maxX;
  let inkMax = minX;
  const inkBottom = Math.min(maxY, minY + Math.round((maxY - minY) * 0.75));
  for (let x = minX; x <= maxX; x++) {
    let n = 0;
    for (let y = minY; y <= inkBottom; y += 2) {
      const i = (y * w + x) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if (isLogoFamily(r, g, b) || isLogoInk(r, g, b)) n++;
    }
    if (n >= 2) {
      if (x < inkMin) inkMin = x;
      if (x > inkMax) inkMax = x;
    }
  }
  if (inkMax - inkMin > w * 0.08) {
    const pad = 16;
    minX = Math.max(0, inkMin - pad);
    maxX = Math.min(w - 1, inkMax + pad);
  }

  const extendEdge = (start, dir) => {
    let edge = start;
    let miss = 0;
    const y1 = Math.min(maxY, minY + Math.round((maxY - minY) * 0.72));
    for (let step = 1; step <= 36; step++) {
      const x = start + dir * step;
      if (x < 0 || x >= w) break;
      let n = 0;
      for (let y = minY; y <= y1; y += 2) {
        const i = (y * w + x) * 4;
        const r = data[i], g = data[i + 1], b = data[i + 2];
        if (isLogoFamily(r, g, b) || isLogoInk(r, g, b) || isArcGreen(r, g, b)) n++;
      }
      if (n >= 2) {
        edge = x;
        miss = 0;
      } else if (++miss > 4) break;
    }
    return edge;
  };
  let leftEdge = extendEdge(minX, -1);
  let rightEdge = extendEdge(maxX, 1);
  const maxW = Math.round(w * 0.36);
  if (rightEdge - leftEdge + 1 > maxW) {
    const slack = maxW - (maxX - minX + 1);
    if (slack > 0) {
      const useR = Math.min(rightEdge - maxX, slack);
      const useL = Math.min(minX - leftEdge, slack - useR);
      rightEdge = maxX + useR;
      leftEdge = minX - useL;
    } else {
      leftEdge = minX;
      rightEdge = maxX;
    }
  }
  minX = leftEdge;
  maxX = rightEdge;

  return { minX, maxX, minY, maxY, bw: maxX - minX + 1, bh: maxY - minY + 1, wordBottom };
}

function isOliveWord(r, g, b) {
  if (isGoldLine(r, g, b)) return false;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const l = (max + min) / 2;
  if (d < 18 || l < 36 || l > 165) return false;
  if (g < r + 10) return false;
  const h = hueOf(r, g, b);
  return h >= 95 && h <= 165;
}

function findOliveMark(data, w, h) {
  const x0 = Math.floor(w * 0.3);
  const x1 = Math.floor(w * 0.7);
  const y0 = Math.floor(h * 0.34);
  const y1 = Math.floor(h * 0.5);
  let minX = w;
  let maxX = 0;
  let minY = h;
  let maxY = 0;
  let rows = 0;
  let gap = 0;
  let started = false;
  const need = Math.max(6, Math.round((x1 - x0) / 40));
  for (let y = y0; y <= y1; y++) {
    let n = 0;
    let rx0 = w;
    let rx1 = 0;
    for (let x = x0; x <= x1; x += 2) {
      const i = (y * w + x) * 4;
      if (!isOliveWord(data[i], data[i + 1], data[i + 2])) continue;
      n++;
      if (x < rx0) rx0 = x;
      if (x > rx1) rx1 = x;
    }
    if (n >= need && rx1 - rx0 > w * 0.1) {
      started = true;
      gap = 0;
      rows++;
      if (rx0 < minX) minX = rx0;
      if (rx1 > maxX) maxX = rx1;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    } else if (started && ++gap > 5) break;
  }
  if (rows < 8) return null;
  const coreTop = minY;
  const coreBot = maxY;
  const upLimit = Math.max(Math.floor(h * 0.3), coreTop - 52);
  for (let y = coreTop - 1; y >= upLimit; y--) {
    let n = 0;
    const left = Math.max(0, minX - 24);
    const right = Math.min(w - 1, maxX + 24);
    for (let x = left; x <= right; x += 2) {
      const i = (y * w + x) * 4;
      if (isOliveWord(data[i], data[i + 1], data[i + 2])) n++;
    }
    if (n >= 3) minY = y;
  }
  const downLimit = Math.min(Math.floor(h * 0.56), coreBot + 90);
  for (let y = coreBot + 1; y <= downLimit; y++) {
    let n = 0;
    let rx0 = w;
    let rx1 = 0;
    for (let x = x0; x <= x1; x += 2) {
      const i = (y * w + x) * 4;
      if (!isOliveWord(data[i], data[i + 1], data[i + 2])) continue;
      n++;
      if (x < rx0) rx0 = x;
      if (x > rx1) rx1 = x;
    }
    if (n >= need * 2.2 && rx1 - rx0 > w * 0.22) break;
    if (n >= 3) maxY = y;
  }
  const pad = 14;
  minX = Math.max(0, minX - pad);
  maxX = Math.min(w - 1, maxX + pad);
  minY = Math.max(0, minY - 6);
  maxY = Math.min(h - 1, maxY + 4);
  const outW = maxX - minX + 1;
  const outH = maxY - minY + 1;
  if (outW > w * 0.42 || outH > h * 0.13 || outW / Math.max(1, outH) < 1.25) return null;
  return { minX, maxX, minY, maxY, bw: outW, bh: outH, wordBottom: coreBot };
}

function isGrayInk(r, g, b) {
  const lum = (r + g + b) / 3;
  const spread = Math.max(r, g, b) - Math.min(r, g, b);
  return lum >= 90 && lum <= 168 && spread < 36;
}

function findGrayMark(data, w, h) {
  const x0 = Math.floor(w * 0.28);
  const x1 = Math.floor(w * 0.72);
  const y0 = Math.floor(h * 0.34);
  const y1 = Math.floor(h * 0.58);
  let minX = w;
  let maxX = 0;
  let minY = h;
  let maxY = 0;
  let rows = 0;
  let gap = 0;
  let started = false;
  const need = Math.round((x1 - x0) / 28);
  for (let y = y0; y <= y1; y++) {
    let n = 0;
    let rx0 = w;
    let rx1 = 0;
    for (let x = x0; x <= x1; x += 2) {
      const i = (y * w + x) * 4;
      if (!isGrayInk(data[i], data[i + 1], data[i + 2])) continue;
      n++;
      if (x < rx0) rx0 = x;
      if (x > rx1) rx1 = x;
    }
    if (n >= need && rx1 - rx0 > w * 0.12) {
      started = true;
      gap = 0;
      rows++;
      if (rx0 < minX) minX = rx0;
      if (rx1 > maxX) maxX = rx1;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    } else if (started && ++gap > 10) break;
  }
  if (rows < 8) return null;
  const bh = maxY - minY + 1;
  const smileEnd = Math.min(h - 1, maxY + Math.round(Math.max(bh, 36) * 1.4));
  gap = 0;
  for (let y = maxY + 1; y <= smileEnd; y++) {
    let n = 0;
    for (let x = minX; x <= maxX; x += 2) {
      const i = (y * w + x) * 4;
      if (isGrayInk(data[i], data[i + 1], data[i + 2])) n++;
    }
    if (n >= 4) {
      maxY = y;
      gap = 0;
    } else if (++gap > 16) break;
  }
  const pad = 6;
  minX = Math.max(0, minX - pad);
  maxX = Math.min(w - 1, maxX + pad);
  minY = Math.max(0, minY - pad);
  maxY = Math.min(h - 1, maxY + 4);
  const outW = maxX - minX + 1;
  const outH = maxY - minY + 1;
  if (outW > w * 0.4 || outH > h * 0.12 || outW / Math.max(1, outH) < 1.8) return null;
  return { minX, maxX, minY, maxY, bw: outW, bh: outH, wordBottom: minY };
}

function sampleLabel(data, w, h, box) {
  const colors = [];
  const y0 = box.minY + Math.round(box.bh * 0.25);
  const y1 = box.minY + Math.round(box.bh * 0.6);
  const take = (x0, x1) => {
    for (let y = y0; y <= y1; y += 2) {
      for (let x = x0; x <= x1; x += 2) {
        if (x < 0 || x >= w || y < 0 || y >= h) continue;
        const i = (y * w + x) * 4;
        const r = data[i], g = data[i + 1], b = data[i + 2];
        if (!isCream(r, g, b)) continue;
        colors.push([r, g, b]);
      }
    }
  };
  const margin = Math.max(8, Math.round(box.bh * 0.35));
  take(box.minX - margin * 3, box.minX - 4);
  take(box.maxX + 4, box.maxX + margin * 3);
  if (colors.length < 8) return [244, 240, 232];
  const mid = (ch) => {
    const arr = colors.map((c) => c[ch]).sort((a, b) => a - b);
    return arr[Math.floor(arr.length / 2)];
  };
  return [mid(0), mid(1), mid(2)];
}

function sampleSide(data, w, h, y, xStart, dir) {
  const colors = [];
  for (let d = 2; d <= 42; d++) {
    const x = xStart + dir * d;
    if (x < 0 || x >= w || y < 0 || y >= h) break;
    const i = (y * w + x) * 4;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (!isCream(r, g, b)) continue;
    colors.push([r, g, b]);
    if (colors.length >= 6) break;
  }
  if (!colors.length) return null;
  const mid = (ch) => {
    const arr = colors.map((c) => c[ch]).sort((a, b) => a - b);
    return arr[Math.floor(arr.length / 2)];
  };
  return [mid(0), mid(1), mid(2)];
}

function paintCover(data, w, h, box) {
  const fallback = sampleLabel(data, w, h, box);
  const feather = 3;
  for (let y = box.minY; y <= box.maxY; y++) {
    const left = sampleSide(data, w, h, y, box.minX, -1) || fallback;
    const right = sampleSide(data, w, h, y, box.maxX, 1) || left;
    const yEdge = Math.min(y - box.minY, box.maxY - y);
    for (let x = box.minX; x <= box.maxX; x++) {
      const i = (y * w + x) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if (isGoldLine(r, g, b) || isDarkTitle(r, g, b)) continue;
      const xEdge = Math.min(x - box.minX, box.maxX - x);
      const edge = Math.min(xEdge, yEdge);
      const fringe = !isCream(r, g, b);
      const t = fringe ? 1 : Math.min(1, edge / feather);
      const u = box.bw <= 1 ? 0 : (x - box.minX) / (box.bw - 1);
      const cr = left[0] + (right[0] - left[0]) * u;
      const cg = left[1] + (right[1] - left[1]) * u;
      const cb = left[2] + (right[2] - left[2]) * u;
      data[i] = Math.round(r + (cr - r) * t);
      data[i + 1] = Math.round(g + (cg - g) * t);
      data[i + 2] = Math.round(b + (cb - b) * t);
      data[i + 3] = 255;
    }
  }
}

function findCapMark(data, w, h) {
  const x0 = Math.floor(w * 0.36);
  const x1 = Math.floor(w * 0.64);
  const y0 = Math.floor(h * 0.1);
  const y1 = Math.floor(h * 0.32);
  let runStart = -1;
  let best = null;
  const similar = (y, prev) => {
    const a = (y * w + Math.floor(w * 0.42)) * 4;
    const b = (prev * w + Math.floor(w * 0.42)) * 4;
    const d = Math.abs(data[a] - data[b]) + Math.abs(data[a + 1] - data[b + 1]) + Math.abs(data[a + 2] - data[b + 2]);
    const lum = (data[a] + data[a + 1] + data[a + 2]) / 3;
    const spread = Math.max(data[a], data[a + 1], data[a + 2]) - Math.min(data[a], data[a + 1], data[a + 2]);
    return d < 36 && lum > 45 && lum < 160 && spread > 8 && !isCream(data[a], data[a + 1], data[a + 2]);
  };
  for (let y = y0; y <= y1; y++) {
    if (runStart < 0) {
      if (similar(y, y)) runStart = y;
      continue;
    }
    if (!similar(y, runStart)) {
      const len = y - runStart;
      if (len > h * 0.04 && (!best || len > best.len)) best = { y0: runStart, y1: y - 1, len };
      runStart = similar(y, y) ? y : -1;
    }
  }
  if (runStart >= 0) {
    const len = y1 - runStart;
    if (len > h * 0.04 && (!best || len > best.len)) best = { y0: runStart, y1, len };
  }
  if (!best) return null;
  const midY = Math.round((best.y0 + best.y1) / 2);
  const sample = (midY * w + Math.floor(w * 0.42)) * 4;
  const bw = Math.round((x1 - x0) * 0.92);
  const bh = Math.round((best.y1 - best.y0) * 0.42);
  const minX = Math.max(0, Math.floor((x0 + x1) / 2) - Math.round(bw / 2));
  const maxX = Math.min(w - 1, minX + bw);
  const minY = Math.max(best.y0 + 2, midY - Math.round(bh / 2));
  const maxY = Math.min(best.y1 - 2, minY + bh);
  return {
    minX, maxX, minY, maxY,
    bw: maxX - minX + 1,
    bh: maxY - minY + 1,
    cap: true,
    color: [data[sample], data[sample + 1], data[sample + 2]],
  };
}

function paintCap(data, w, box) {
  const [cr, cg, cb] = box.color;
  for (let y = box.minY; y <= box.maxY; y++) {
    for (let x = box.minX; x <= box.maxX; x++) {
      const i = (y * w + x) * 4;
      const d =
        Math.abs(data[i] - cr) + Math.abs(data[i + 1] - cg) + Math.abs(data[i + 2] - cb);
      if (d > 70) continue;
      data[i] = cr;
      data[i + 1] = cg;
      data[i + 2] = cb;
      data[i + 3] = 255;
    }
  }
}

async function loadLogo() {
  const rendered = await sharp(svgPath, { density: 320 }).resize({ width: 1600 }).png().toBuffer();
  return sharp(rendered).trim().png().toBuffer();
}

function readImageInput(rel, fromHead) {
  if (!fromHead) return path.join(root, rel);
  return execFileSync("git", ["show", `HEAD:${rel}`], {
    cwd: root,
    maxBuffer: 40 * 1024 * 1024,
  });
}

async function processFile(rel, logoPng, { write, fromHead }) {
  const abs = path.join(root, rel);
  const { data, info } = await sharp(readImageInput(rel, fromHead)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  let marks = findLabelMarks(data, w, h).map((m) => expandMark(data, w, h, m));
  if (process.env.DEBUG) {
    for (const m of marks) console.log("  expanded", `${m.bw}x${m.bh}@${m.minX},${m.minY}`);
  }
  marks = marks
    .filter((m) => m.bw > w * 0.08 && m.bh < h * 0.14 && m.minY > h * 0.28)
    .map((m) => {
      const maxW = Math.round(w * 0.38);
      if (m.bw <= maxW) return m;
      const cx = Math.round((m.minX + m.maxX) / 2);
      const minX = Math.max(0, cx - Math.round(maxW / 2));
      const maxX = Math.min(w - 1, minX + maxW - 1);
      return { ...m, minX, maxX, bw: maxX - minX + 1 };
    });
  if (marks.length > 1) {
    marks.sort((a, b) => b.bw - a.bw);
    marks = [marks[0]];
  }
  if (!marks.length) {
    const olive = findOliveMark(data, w, h);
    if (olive) marks = [olive];
  }
  if (!marks.length) {
    const gray = findGrayMark(data, w, h);
    if (gray) marks = [gray];
  }
  if (!marks.length && !fromHead) {
    const cap = findCapMark(data, w, h);
    if (cap) marks = [cap];
  }
  const composites = [];
  for (const box of marks) {
    if (box.cap) paintCap(data, w, box);
    else paintCover(data, w, h, box);
    const insetX = Math.round(box.bw * 0.04);
    const maxW = Math.max(12, box.bw - insetX * 2);
    const maxH = Math.max(12, box.bh - 2);
    let logoW = maxW;
    let logoH = Math.round(logoW / LOGO_ASPECT);
    if (logoH > maxH) {
      logoH = maxH;
      logoW = Math.round(logoH * LOGO_ASPECT);
    }
    const logoBuf = await sharp(logoPng).resize({ width: logoW, height: logoH, fit: "fill" }).png().toBuffer();
    const left = box.minX + Math.round((box.bw - logoW) / 2);
    const top = box.minY + Math.round((box.bh - logoH) / 2);
    composites.push({ input: logoBuf, left: Math.max(0, left), top: Math.max(0, top) });
  }
  let pipeline = sharp(data, { raw: { width: w, height: h, channels: 4 } });
  if (composites.length && !process.env.COVER_ONLY) pipeline = pipeline.composite(composites);
  const dest = write ? abs : path.join(outRoot, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  await pipeline.webp({ quality: 90 }).toFile(dest);
  return { rel, n: marks.length, boxes: marks.map((b) => `${b.bw}x${b.bh}@${b.minX},${b.minY}${b.cap ? " cap" : ""}`) };
}

async function main() {
  const args = process.argv.slice(2);
  const write = args.includes("--write");
  const fromHead = args.includes("--from-head") || args.includes("--catalogs") || args.includes("--catalog-pilot");
  let files = PREVIEW;
  if (args.includes("--catalog-pilot")) files = CATALOG_PILOT;
  else if (args.includes("--catalogs")) files = catalogTargets();
  else if (args.includes("--packs")) files = PACKS;
  else if (args.includes("--all")) files = allTargets();
  else if (args.includes("--files")) {
    const idx = args.indexOf("--files");
    files = args.slice(idx + 1).filter((a) => !a.startsWith("--"));
  }
  const logoPng = await loadLogo();
  let misses = 0;
  for (const rel of files) {
    const result = await processFile(rel, logoPng, { write, fromHead });
    if (!result.n) misses++;
    console.log(result.n ? "OK" : "MISS", result.rel, result.boxes.join(" | ") || "(none)");
  }
  console.log(`done ${files.length}, misses ${misses}, ${write ? "in place" : outRoot}${fromHead ? " from HEAD" : ""}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
