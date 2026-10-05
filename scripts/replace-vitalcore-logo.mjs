/**
 * Replace painted Vitalcore wordmarks with the updated lockup
 * (wordmark + "Made for Health"), fitted inside the existing logo band.
 *
 *   node scripts/replace-vitalcore-logo.mjs --pilot
 *   node scripts/replace-vitalcore-logo.mjs --all
 *   node scripts/replace-vitalcore-logo.mjs --files public/homepage/herbal.webp
 *
 * Outputs go to scripts/_tmp-logo-out unless --write is passed.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const svgPath = path.join(root, "public/brand/vitalcore-logo.svg");
const outRoot = path.join(root, "scripts/_tmp-logo-out");

const PILOT = [
  "public/product-images/Herbaceutical/Liver Health/Milk Thistle + Dandelion Root + Green Turmeric.webp",
  "public/product-images/Nutraceutical/Anti oxidants/Acai Berry Powder + Vitamin C + Vitamin E + Selenium.webp",
  "public/product-images/Organic/Ashwagandha/Kalmegh + Pippali + Vasaka.webp",
  "public/homepage/herbal.webp",
  "public/packaging/jar.webp",
  "public/packaging/sachets.webp",
];

function readManifestPaths(file) {
  const text = fs.readFileSync(path.join(root, file), "utf8");
  return [...text.matchAll(/"(\/[^"]+\.webp)"/g)].map((m) => m[1].replace(/^\//, ""));
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
    "public/packaging/jar.webp",
    "public/packaging/sachets.webp",
    "public/packaging/blister.webp",
    "public/packaging/bulk-packs.webp",
    "public/packaging/bottle-packs.webp",
    "public/packaging/alu-alu.webp",
    "public/packaging/stick-pack.webp",
  ];
  return [...new Set([...products, ...explore, ...packs])];
}

function isTealInk(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const l = (max + min) / 2;
  if (d < 26 || l < 32 || l > 205) return false;
  if (g < r + 10) return false;
  let h;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h *= 60;
  if (h < 0) h += 360;
  // Leaf green through blue-teal wordmarks. Skip yellow-green botanical art.
  return h >= 138 && h <= 215;
}

function componentsFromMask(mask, w, h, minArea, maxArea) {
  const seen = new Uint8Array(mask.length);
  const comps = [];
  const stack = [];
  for (let start = 0; start < mask.length; start++) {
    if (!mask[start] || seen[start]) continue;
    stack.push(start);
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
      if (x > 0 && mask[p - 1] && !seen[p - 1]) {
        seen[p - 1] = 1;
        stack.push(p - 1);
      }
      if (x + 1 < w && mask[p + 1] && !seen[p + 1]) {
        seen[p + 1] = 1;
        stack.push(p + 1);
      }
      if (y > 0 && mask[p - w] && !seen[p - w]) {
        seen[p - w] = 1;
        stack.push(p - w);
      }
      if (y + 1 < h && mask[p + w] && !seen[p + w]) {
        seen[p + w] = 1;
        stack.push(p + w);
      }
    }
    if (area < minArea || area > maxArea) continue;
    const bw = maxX - minX + 1;
    const bh = maxY - minY + 1;
    // Drop tall side-panels. A full word may be one wide component.
    if (bw > w * 0.62 || bh > h * 0.2) continue;
    if (bh > bw * 3.2 && bh > h * 0.08) continue;
    comps.push({
      minX, maxX, minY, maxY, area,
      cx: sumX / area,
      cy: sumY / area,
      bw, bh,
    });
  }
  return comps;
}

function groupLines(comps, w) {
  const parent = comps.map((_, i) => i);
  const find = (i) => {
    while (parent[i] !== i) {
      parent[i] = parent[parent[i]];
      i = parent[i];
    }
    return i;
  };
  const unite = (a, b) => {
    const pa = find(a);
    const pb = find(b);
    if (pa !== pb) parent[pa] = pb;
  };
  for (let i = 0; i < comps.length; i++) {
    for (let j = i + 1; j < comps.length; j++) {
      const a = comps[i];
      const b = comps[j];
      const overlap = Math.min(a.maxY, b.maxY) - Math.max(a.minY, b.minY);
      const minH = Math.min(a.bh, b.bh);
      if (overlap < minH * 0.45) continue;
      const gap = Math.max(0, Math.max(a.minX, b.minX) - Math.min(a.maxX, b.maxX));
      const allow = Math.max(a.bh, b.bh) * 0.9;
      if (gap > allow) continue;
      unite(i, j);
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
  const step = Math.max(1, Math.round(Math.min(box.bw, box.bh) / 12));
  for (let y = box.minY; y <= box.maxY; y += step) {
    for (let x = box.minX; x <= box.maxX; x += step) {
      const i = (y * w + x) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if (isTealInk(r, g, b)) continue;
      total++;
      const lum = (r + g + b) / 3;
      const spread = Math.max(r, g, b) - Math.min(r, g, b);
      if (lum > 168 && r + 6 >= b && spread < 78) cream++;
    }
  }
  if (total < 6) return 0;
  return cream / total;
}

function keepTopmost(marks) {
  const sorted = [...marks].sort((a, b) => a.minY - b.minY || b.bw - a.bw);
  const kept = [];
  for (const m of sorted) {
    const stacked = kept.some((k) => {
      const overlap = Math.min(k.maxX, m.maxX) - Math.max(k.minX, m.minX);
      return overlap > Math.min(k.bw, m.bw) * 0.45;
    });
    if (!stacked) kept.push(m);
  }
  return kept;
}

function lineBox(members) {
  let minX = Infinity, maxX = -1, minY = Infinity, maxY = -1, area = 0;
  for (const c of members) {
    if (c.minX < minX) minX = c.minX;
    if (c.maxX > maxX) maxX = c.maxX;
    if (c.minY < minY) minY = c.minY;
    if (c.maxY > maxY) maxY = c.maxY;
    area += c.area;
  }
  return { minX, maxX, minY, maxY, area, bw: maxX - minX + 1, bh: maxY - minY + 1, n: members.length };
}

function findWordmarks(data, w, h) {
  const mask = new Uint8Array(w * h);
  for (let p = 0, i = 0; p < w * h; p++, i += 4) {
    if (isTealInk(data[i], data[i + 1], data[i + 2])) mask[p] = 1;
  }
  const scale = (w / 1024) * (h / 1024);
  const minArea = Math.max(12, Math.round(18 * scale));
  const maxArea = Math.round(w * h * 0.05);
  const comps = componentsFromMask(mask, w, h, minArea, maxArea);
  const groups = groupLines(comps, w);
  const marks = [];

  for (const members of groups) {
    const box = lineBox(members);
    const aspect = box.bw / Math.max(1, box.bh);
    const wideEnough = box.bw > w * 0.06 && box.bw < w * 0.72;
    const shortEnough = box.bh > h * 0.015 && box.bh < h * 0.22;
    const letterLike = box.n >= 5 && aspect >= 1.55 && aspect <= 14;
    const cream = creamScore(data, w, box);
    if (process.argv.includes("--debug")) {
      console.log("  cand", `${box.bw}x${box.bh}@${box.minX},${box.minY}`, "n", box.n, "aspect", aspect.toFixed(2), "cream", cream.toFixed(2), "wide", wideEnough, "short", shortEnough, "letters", letterLike, "single", singleWord);
    }
    if (!wideEnough || !shortEnough || !letterLike) continue;
    if (box.minY < h * 0.04 || box.minX < 2 || box.maxX > w - 3) continue;
    if (creamScore(data, w, box) < 0.42) continue;
    marks.push(box);
  }

  const kept = marks.filter((a) => !marks.some((b) => b !== a && b.minX <= a.minX && b.maxX >= a.maxX && b.minY <= a.minY && b.maxY >= a.maxY && b.bw * b.bh > a.bw * a.bh * 1.4));
  return keepTopmost(kept);
}

function findCapMark(data, w, h) {
  const x0 = Math.floor(w * 0.32);
  const x1 = Math.floor(w * 0.68);
  const y0 = Math.floor(h * 0.05);
  const y1 = Math.floor(h * 0.4);
  const row = new Float64Array(h);
  for (let y = y0 + 3; y < y1 - 3; y++) {
    for (let x = x0; x < x1; x += 2) {
      const i = (y * w + x) * 4;
      const up = ((y - 3) * w + x) * 4;
      const d =
        Math.abs(data[i] - data[up]) +
        Math.abs(data[i + 1] - data[up + 1]) +
        Math.abs(data[i + 2] - data[up + 2]);
      const spread = Math.max(data[i], data[i + 1], data[i + 2]) - Math.min(data[i], data[i + 1], data[i + 2]);
      if (d > 16 && d < 110 && spread < 90) row[y] += 1;
    }
  }
  let bestY = -1;
  let best = 0;
  for (let y = y0 + 6; y < y1 - 6; y++) {
    let s = 0;
    for (let k = -4; k <= 4; k++) s += row[y + k] || 0;
    if (s > best) {
      best = s;
      bestY = y;
    }
  }
  const need = ((x1 - x0) / 2) * 0.35;
  if (bestY < 0 || best < need) return null;
  const bw = Math.round(w * 0.34);
  const bh = Math.round(h * 0.075);
  const cx = Math.round(w / 2);
  const minX = Math.max(0, cx - Math.round(bw / 2));
  const maxX = Math.min(w - 1, minX + bw);
  const minY = Math.max(0, bestY - Math.round(bh * 0.55));
  const maxY = Math.min(h - 1, minY + bh);
  return { minX, maxX, minY, maxY, bw: maxX - minX + 1, bh: maxY - minY + 1, n: 1, area: 1, cap: true };
}

function paintCap(data, w, h, band) {
  const colors = [];
  const yA = Math.max(0, band.minY - 10);
  const yB = Math.min(h - 1, band.maxY + 10);
  for (let x = band.minX; x <= band.maxX; x += 3) {
    for (const y of [yA, yB]) {
      const i = (y * w + x) * 4;
      colors.push([data[i], data[i + 1], data[i + 2]]);
    }
  }
  colors.sort((a, b) => a[0] + a[1] + a[2] - (b[0] + b[1] + b[2]));
  const mid = colors[Math.floor(colors.length / 2)] || [120, 130, 80];
  for (let y = band.minY; y <= band.maxY; y++) {
    for (let x = band.minX; x <= band.maxX; x++) {
      const i = (y * w + x) * 4;
      const d = dist([data[i], data[i + 1], data[i + 2]], mid);
      if (d > 95) continue;
      data[i] = mid[0];
      data[i + 1] = mid[1];
      data[i + 2] = mid[2];
      data[i + 3] = 255;
    }
  }
  return mid;
}

function growToInk(data, w, h, box) {
  const x0 = Math.max(0, box.minX - Math.round(box.bw * 0.22));
  const x1 = Math.min(w - 1, box.maxX + Math.round(box.bw * 0.22));
  const y0 = Math.max(0, box.minY - Math.round(box.bh * 0.7));
  const y1 = Math.min(h - 1, box.maxY + Math.round(box.bh * 0.85));
  let minX = box.minX, maxX = box.maxX, minY = box.minY, maxY = box.maxY;
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const i = (y * w + x) * 4;
      if (!isTealInk(data[i], data[i + 1], data[i + 2])) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  const pad = Math.max(2, Math.round(box.bh * 0.06));
  minX = Math.max(0, Math.max(box.minX - Math.round(box.bw * 0.16), minX - pad));
  maxX = Math.min(w - 1, Math.min(box.maxX + Math.round(box.bw * 0.16), maxX + pad));
  minY = Math.max(0, Math.max(box.minY - Math.round(box.bh * 0.5), minY - pad));
  maxY = Math.min(h - 1, Math.min(box.maxY + Math.round(box.bh * 0.55), maxY + pad));
  return { minX, maxX, minY, maxY, bw: maxX - minX + 1, bh: maxY - minY + 1 };
}

function sampleCover(data, w, h, band) {
  const gap = Math.max(4, Math.round(band.bh * 0.06));
  const colors = [];
  const y0 = Math.max(0, band.minY - gap);
  const y1 = Math.min(h - 1, band.maxY + gap);
  const x0 = Math.max(0, band.minX - gap * 2);
  const x1 = Math.min(w - 1, band.maxX + gap * 2);
  for (let y = y0; y <= y1; y += 2) {
    for (let x = x0; x <= x1; x += 2) {
      const i = (y * w + x) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if (isTealInk(r, g, b)) continue;
      let near = false;
      for (let dy = -gap; dy <= gap && !near; dy += 2) {
        for (let dx = -gap; dx <= gap; dx += 2) {
          const yy = y + dy;
          const xx = x + dx;
          if (yy < 0 || xx < 0 || yy >= h || xx >= w) continue;
          const j = (yy * w + xx) * 4;
          if (isTealInk(data[j], data[j + 1], data[j + 2])) {
            near = true;
            break;
          }
        }
      }
      if (near) continue;
      const lum = (r + g + b) / 3;
      const spread = Math.max(r, g, b) - Math.min(r, g, b);
      if (lum < 170 || spread > 62) continue;
      colors.push([r, g, b]);
    }
  }
  if (colors.length < 8) return [244, 240, 232];
  const mid = (ch) => {
    const arr = colors.map((c) => c[ch]).sort((a, b) => a - b);
    return arr[Math.floor(arr.length / 2)];
  };
  return [mid(0), mid(1), mid(2)];
}

function labelLike(r, g, b) {
  if (isTealInk(r, g, b)) return false;
  const lum = (r + g + b) / 3;
  const spread = Math.max(r, g, b) - Math.min(r, g, b);
  return lum > 168 && spread < 72;
}

function dist(a, b) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
}

function paintBand(data, w, h, band, fallback) {
  const [fr, fg, fb] = fallback;
  const feather = Math.max(2, Math.round(band.bw * 0.03));
  for (let x = band.minX; x <= band.maxX; x++) {
    let above = null;
    let below = null;
    for (let y = band.minY - 2; y >= Math.max(0, band.minY - 28); y--) {
      const i = (y * w + x) * 4;
      if (labelLike(data[i], data[i + 1], data[i + 2])) {
        above = [data[i], data[i + 1], data[i + 2]];
        break;
      }
    }
    for (let y = band.maxY + 2; y <= Math.min(h - 1, band.maxY + 28); y++) {
      const i = (y * w + x) * 4;
      if (labelLike(data[i], data[i + 1], data[i + 2])) {
        below = [data[i], data[i + 1], data[i + 2]];
        break;
      }
    }
    const topC = above && dist(above, [fr, fg, fb]) < 48 ? above : [fr, fg, fb];
    const botC = below && dist(below, [fr, fg, fb]) < 48 ? below : topC;
    const xEdge = Math.min(x - band.minX, band.maxX - x);
    const edgeT = Math.min(1, xEdge / feather);
    for (let y = band.minY; y <= band.maxY; y++) {
      const i = (y * w + x) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const lum = (r + g + b) / 3;
      const ink = isTealInk(r, g, b);
      if (!ink && !labelLike(r, g, b)) continue;
      if (!ink && lum < 95) continue;
      const ty = band.bh <= 1 ? 0 : (y - band.minY) / (band.bh - 1);
      const cr = Math.round(topC[0] + (botC[0] - topC[0]) * ty);
      const cg = Math.round(topC[1] + (botC[1] - topC[1]) * ty);
      const cb = Math.round(topC[2] + (botC[2] - topC[2]) * ty);
      const t = ink ? 1 : edgeT;
      data[i] = Math.round(r + (cr - r) * t);
      data[i + 1] = Math.round(g + (cg - g) * t);
      data[i + 2] = Math.round(b + (cb - b) * t);
      data[i + 3] = 255;
    }
  }
}

async function loadLogoPng() {
  const rendered = await sharp(svgPath, { density: 300 })
    .resize({ width: 1400 })
    .png()
    .toBuffer();
  return sharp(rendered).trim().png().toBuffer();
}

async function processFile(rel, logoPng, { write, debug, red }) {
  const abs = path.join(root, rel);
  const { data, info } = await sharp(abs).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const marks = findWordmarks(data, w, h);
  const bands = marks.map((m) => growToInk(data, w, h, m));

  const colors = [];
  for (const band of bands) {
    const color = red ? [255, 0, 0] : sampleCover(data, w, h, band);
    colors.push(color.join(","));
    paintBand(data, w, h, band, color);
  }

  const composites = [];
  for (const band of bands) {
    const inset = 0.06;
    const bw = Math.max(8, Math.round(band.bw * (1 - inset * 2)));
    const bh = Math.max(8, Math.round(band.bh * (1 - inset * 2)));
    const aspect = 977 / 375;
    let logoW, logoH;
    if (bw / bh > aspect) {
      logoH = bh;
      logoW = Math.round(bh * aspect);
    } else {
      logoW = bw;
      logoH = Math.round(bw / aspect);
    }
    const logoBuf = await sharp(logoPng).resize({ width: logoW, height: logoH, fit: "fill" }).png().toBuffer();
    const left = band.minX + Math.round((band.bw - logoW) / 2);
    const top = band.minY + Math.round((band.bh - logoH) / 2);
    composites.push({ input: logoBuf, left: Math.max(0, left), top: Math.max(0, top) });
  }

  let pipeline = sharp(data, { raw: { width: w, height: h, channels: 4 } });
  if (!red && composites.length) pipeline = pipeline.composite(composites);

  if (debug && bands.length) {
    const svg = `<svg width="${w}" height="${h}">${bands
      .map(
        (b) =>
          `<rect x="${b.minX}" y="${b.minY}" width="${b.bw}" height="${b.bh}" fill="none" stroke="red" stroke-width="3"/>`,
      )
      .join("")}</svg>`;
    pipeline = pipeline.composite([{ input: Buffer.from(svg), top: 0, left: 0 }]);
  }

  const dest = write ? abs : path.join(outRoot, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  await pipeline.webp({ quality: 90 }).toFile(dest);
  return { rel, marks: marks.length, bands: bands.map((b, i) => `${b.bw}x${b.bh}@${b.minX},${b.minY} rgb(${colors[i]})`) };
}

async function main() {
  const args = process.argv.slice(2);
  const write = args.includes("--write");
  const debug = args.includes("--debug");
  const red = args.includes("--red");
  let files;
  if (args.includes("--all")) files = allTargets();
  else if (args.includes("--pilot")) files = PILOT;
  else {
    const idx = args.indexOf("--files");
    files = idx >= 0 ? args.slice(idx + 1).filter((a) => !a.startsWith("--")) : PILOT;
  }

  const logoPng = await loadLogoPng();
  let misses = 0;
  for (const rel of files) {
    const result = await processFile(rel, logoPng, { write, debug, red });
    if (!result.marks) misses++;
    console.log(result.marks ? "OK" : "MISS", result.rel, result.bands.join(" | ") || "(no wordmark)");
  }
  console.log(`done ${files.length} files, ${misses} misses, ${write ? "wrote in place" : "preview " + outRoot}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
