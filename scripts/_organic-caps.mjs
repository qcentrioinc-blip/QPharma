/**
 * Stamp official Vitalcore cap lockups on Organic catalog photos.
 * Odd page images are engraved like Kalmegh. Even page images are raised like Ginger.
 * Ashwagandha images 1 and 2 are masters and are skipped.
 *
 *   node scripts/_organic-caps.mjs detect
 *   node scripts/_organic-caps.mjs preview
 *   node scripts/_organic-caps.mjs write
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const manifest = fs.readFileSync(path.join(root, "src/organic/imageManifest.ts"), "utf8");
const paths = {};
for (const match of manifest.matchAll(/"([^"]+)": "([^"]+)"/g)) {
  paths[match[1]] = `public${match[2]}`;
}

const catalog = [
  ["Liverwort", "Cissus Quadrangularis + Boswellia Serrata + Piperine + Hadjod"],
  ["Liverwort", "Cat's Claw + Bromelain Extract + Ashwagandha Root"],
  ["Liverwort", "Rosehip Powder + Ginger + Curcumin + Maca Root"],
  ["Liverwort", "Guggul + Sea Buck Thorn + Schindra + Eucalyptus"],
  ["Liverwort", "Burdock Root + Moringa Leaf + Willow Bark + Curcumin"],
  ["Guduchi", "Astragalus Root + Aronia Berry + Maitake Mushroom + Holy Basil"],
  ["Guduchi", "Neem Leaf + Morinda Citrifolia Fruit + Ashwagandha Root + Moringa Fruit"],
  ["Guduchi", "American Ginseng + Kalmegh + Echinacea Root + Spirulina"],
  ["Guduchi", "Curcumin + Moringa + Liquorice + Ashwagandha Root"],
  ["Magnolia Bark", "Manjistha Stem + Propolis + Avocado Fruit"],
  ["Magnolia Bark", "Aloe Vera + Bamboo Stem + Sesbania Grandiflora + Bearberry"],
  ["Magnolia Bark", "Amla + Bhringraj + Brahmi + Grapeseed"],
  ["Magnolia Bark", "Orange + Hibiscus + Gingko Biloba + Green Tea"],
  ["Horsetail", "Elderberry + Green Tea + Beetroot"],
  ["Horsetail", "Pomegranate + Cranberry + Curcumin"],
  ["Horsetail", "Wheat Grass + Acai Berry + Raspberries + Papain"],
  ["Horsetail", "Spirulina + Tart Cherry + Bacopa Monnieri"],
  ["Gynoestemma", "Punarnava + Astragalus + Cranberry"],
  ["Gynoestemma", "Horse Tail Herb + Birch Leaf + Tulsi Ark"],
  ["Gynoestemma", "Manjistha + Amla + Fennel Seed + Celery"],
  ["Holy Basil", "Iron + Folic Acid + Vitamin B12 + Vitamin B6 + Zinc"],
  ["Holy Basil", "Folic Acid + Vitamin B12 + Vitamin C"],
  ["Holy Basil", "Folic Acid + Vitamin B12 + Vitamin C + Iron + Zinc"],
  ["Holy Basil", "Vitamin B1 + Vitamin B2 + Vitamin B6 + Vitamin B12"],
  ["Triphala", "Horse Chestnut + Rutin Powder + Arjuna + Cassia Bark"],
  ["Triphala", "Aronia Berry + Piperine + Maitake Mushroom"],
  ["Triphala", "Arjuna + Guggul + Brahmi"],
  ["Triphala", "Fenugreek Seed + Amla + Garlic Powder + Arjuna"],
  ["Curcuma Longa", "Gingko Biloba + Bacopa Monnieri + Shankhpushpi"],
  ["Curcuma Longa", "Rosemary Leaf + Gotu Kola + Curcumin + Vacha"],
  ["Curcuma Longa", "Bacopa Monnieri + Rhodiola Rosea + Ginseng"],
  ["Kalmegh", "Shatavari + Black Sesame Seed + Liquorice Root + Musta"],
  ["Kalmegh", "Gokshuru + Holy Basil + Ashwagandha Root + Shalparni"],
  ["Kalmegh", "Ashoka + Jeevanti + Punarnava + Guduchi"],
  ["Gymnema Sylvestre", "Ashwagandha Root + Mucuna Pruriens + Safed Musli"],
  ["Gymnema Sylvestre", "Muira Puama + Gokhru + Shilajit"],
  ["Gymnema Sylvestre", "Shilajit + Ashwagandha Root + Ginseng"],
  ["Liquorice", "Bitter Melon + Lucuma + Banaba Leaf"],
  ["Liquorice", "Chitrak Root + Fenugreek Seed + Olive Leaf"],
  ["Liquorice", "Prickly Pear Leaf + Mulberry Leaf + Cinnamon Bark"],
  ["Liquorice", "Gymnema Leaf + Bilberry"],
  ["Cinnamon", "Milk Thistle + Dandelion Root + Green Turmeric"],
  ["Cinnamon", "Kutki + Schisandra Berry + Nigella Sativa"],
  ["Cinnamon", "Milk Thistle + Artichoke Fruit + Myrobalan"],
  ["Moringa", "Evening Primrose + Nettle Leaf + Valerian + Wild Yam"],
  ["Moringa", "Flaxseed + Red Clover + Black Cohosh Root + Ginseng"],
  ["Moringa", "Motherwort + Passion Flower + Valerian"],
  ["Ashwagandha", "Kalmegh + Curcumin + Astragalus"],
  ["Ashwagandha", "Ginger + Liquorice + Cardamom"],
  ["Ashwagandha", "Kalmegh + Pippali + Vasaka"],
  ["Garcinia Cambogia", "Goji Berry + Bilberry + Marigold + Carrot"],
  ["Garcinia Cambogia", "Fennel Seed + Bay Berry + Spinach"],
];

const skip = new Set([
  "Ashwagandha|Kalmegh + Curcumin + Astragalus",
  "Ashwagandha|Ginger + Liquorice + Cardamom",
]);

function jobs() {
  const grouped = new Map();
  for (const [folder, formula] of catalog) {
    if (!grouped.has(folder)) grouped.set(folder, []);
    grouped.get(folder).push(formula);
  }
  const list = [];
  for (const [folder, formulas] of grouped) {
    formulas.forEach((formula, index) => {
      const key = `${folder}|${formula}`;
      if (skip.has(key)) return;
      const rel = paths[key];
      if (!rel) throw new Error(`missing manifest ${key}`);
      list.push({
        folder,
        formula,
        index,
        style: index % 2 === 0 ? "engrave" : "raise",
        rel,
      });
    });
  }
  return list;
}

function lumAt(data, w, h, x, y) {
  x = Math.max(0, Math.min(w - 1, x));
  y = Math.max(0, Math.min(h - 1, y));
  const i = (y * w + x) * 4;
  return (data[i] + data[i + 1] + data[i + 2]) / 3;
}

function findFace(data, w, h) {
  const peaks = [];
  let last = -999;
  for (let y = 240; y < 960; y += 2) {
    let g = 0;
    let n = 0;
    for (let x = Math.round(w * 0.37); x <= Math.round(w * 0.63); x += 12) {
      g += lumAt(data, w, h, x, y - 5) - lumAt(data, w, h, x, y + 5);
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
  if (!top || !bot) {
    bot = peaks.filter((p) => p.y > 500 && p.y < 920).sort((a, b) => b.v - a.v)[0];
    if (!bot) return null;
    return { top: bot.y - 380, bot: bot.y, drop: bot.v };
  }
  return { top: top.y, bot: bot.y, drop: bot.v };
}

function rowEnergy(data, w, h, y, x0, x1) {
  let e = 0;
  let c = 0;
  for (let x = x0; x <= x1 - 8; x += 4) {
    e += Math.abs(lumAt(data, w, h, x, y) - lumAt(data, w, h, x + 6, y));
    c++;
  }
  return c ? e / c : 99;
}

function rowMedian(data, w, h, y, x0, x1) {
  const vals = [];
  for (let x = x0; x <= x1; x += 6) vals.push(lumAt(data, w, h, x, y));
  vals.sort((a, b) => a - b);
  return vals.length ? vals[Math.floor(vals.length / 2)] : 0;
}

function findBands(data, w, h, yStart, yEnd) {
  const y0 = yStart;
  const y1 = yEnd;
  const x0 = Math.round(w * 0.24);
  const x1 = Math.round(w * 0.76);
  const rows = [];
  for (let y = y0; y <= y1; y += 2) {
    let n = 0;
    let minX = w;
    let maxX = 0;
    let sum = 0;
    let count = 0;
    for (let x = x0; x <= x1; x += 2) {
      const local = (lumAt(data, w, h, x - 8, y) + lumAt(data, w, h, x + 8, y)) / 2;
      const here = lumAt(data, w, h, x, y);
      sum += here;
      count++;
      if (local - here > 8 || here - local > 10) {
        n++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
      }
    }
    const span = maxX > minX ? maxX - minX : 0;
    rows.push({ y, n, span, minX, maxX, med: sum / count });
  }
  const bands = [];
  let cur = null;
  for (const row of rows) {
    const hit = row.n > 22 && row.span > 160 && row.span < 760;
    if (hit && cur && row.y <= cur.maxY + 8) {
      cur.maxY = row.y;
      cur.hits += row.n;
      cur.minX = Math.min(cur.minX, row.minX);
      cur.maxX = Math.max(cur.maxX, row.maxX);
      cur.med = row.med;
    } else if (hit) {
      if (cur && cur.maxY - cur.minY >= 8) bands.push(cur);
      cur = { minY: row.y, maxY: row.y, hits: row.n, minX: row.minX, maxX: row.maxX, med: row.med };
    }
  }
  if (cur && cur.maxY - cur.minY >= 8) bands.push(cur);
  return bands;
}

function capEdges(data, w, h, y, inkL, inkR) {
  const seedL = inkL - 24;
  const seedR = inkR + 24;
  const edge = (x0, dir) => {
    let prev = lumAt(data, w, h, x0, y);
    for (let x = x0; x > 50 && x < w - 50; x += dir) {
      const here = lumAt(data, w, h, x, y);
      if (Math.abs(here - prev) > 28) return x - dir;
      prev = here;
    }
    return dir < 0 ? 80 : w - 80;
  };
  let left = edge(Math.max(60, seedL), -1);
  let right = edge(Math.min(w - 60, seedR), 1);
  if (right - left < 420 || right - left > 1150) {
    const mid = Math.round((inkL + inkR) / 2);
    left = mid - 390;
    right = mid + 390;
  }
  return { left, right, center: Math.round((left + right) / 2), width: right - left };
}

async function loadLogo() {
  const rendered = await sharp(path.join(root, "public/brand/vitalcore-logo.svg"), { density: 700 }).png().toBuffer();
  const trimmed = await sharp(rendered).trim().png().toBuffer();
  const meta = await sharp(trimmed).metadata();
  return { trimmed, aspect: meta.width / meta.height };
}

function paint(data, w, h, logo, lw, lh, originX, originY, style, plasticLum) {
  const sharpA = new Float32Array(lw * lh);
  for (let i = 0; i < lw * lh; i++) sharpA[i] = logo[i * 4 + 3] / 255;
  const tagCut = Math.round(lh * 0.66);
  const bold = new Float32Array(sharpA);
  for (let y = tagCut; y < lh; y++) {
    for (let x = 0; x < lw; x++) {
      let m = sharpA[y * lw + x];
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx;
          const yy = y + dy;
          if (xx < 0 || yy < tagCut || xx >= lw || yy >= lh) continue;
          m = Math.max(m, sharpA[yy * lw + xx]);
        }
      }
      bold[y * lw + x] = m;
    }
  }
  const at = (x, y) => (x < 0 || y < 0 || x >= lw || y >= lh ? 0 : sharpA[y * lw + x]);
  const white = plasticLum > 175;
  for (let y = 0; y < lh; y++) {
    for (let x = 0; x < lw; x++) {
      const tag = y >= tagCut;
      const a = tag ? bold[y * lw + x] : sharpA[y * lw + x];
      if (a < 0.16) continue;
      const px = originX + x;
      const py = originY + y;
      if (px < 1 || py < 1 || px >= w - 1 || py >= h - 1) continue;
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
        factor = a > 0.35 ? (white ? 0.46 : 0.4) : white ? 0.58 : 0.5;
      } else if (a > 0.78) {
        factor = white ? 1.03 : 1.08;
      } else if (dropUp > 0.2 && dropUp >= dropDown) {
        factor = white ? 1.08 : 1.16;
      } else if (dropDown > 0.2 && a < 0.7) {
        factor = 0.76;
      } else {
        factor = 1;
      }
      const i = (py * w + px) * 4;
      data[i] = Math.max(0, Math.min(255, Math.round(data[i] * factor)));
      data[i + 1] = Math.max(0, Math.min(255, Math.round(data[i + 1] * factor)));
      data[i + 2] = Math.max(0, Math.min(255, Math.round(data[i + 2] * factor)));
    }
  }
}

function bandScore(data, w, h, band) {
  const y = Math.max(2, band.minY - 14);
  const x0 = band.minX;
  const x1 = band.maxX;
  let sum = 0;
  let n = 0;
  const vals = [];
  for (let x = x0; x <= x1; x += 4) {
    const L = lumAt(data, w, h, x, y);
    vals.push(L);
    sum += L;
    n++;
  }
  if (!n) return -1e9;
  const mean = sum / n;
  let v = 0;
  for (const L of vals) v += (L - mean) * (L - mean);
  v /= n;
  const span = band.maxX - band.minX;
  const spanPenalty = span < 220 || span > 700 ? 400 : 0;
  const lowPenalty = band.minY > 680 ? 250 : 0;
  return band.hits - v - spanPenalty - lowPenalty;
}

function clearInk(data, w, h, band) {
  const original = Buffer.from(data);
  const y0 = Math.max(2, band.minY - 10);
  const y1 = Math.min(h - 3, band.maxY + 42);
  const x0 = Math.max(12, band.minX - 16);
  const x1 = Math.min(w - 13, band.maxX + 16);
  const ink = new Uint8Array(w * h);
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const here = lumAt(original, w, h, x, y);
      const local = (lumAt(original, w, h, x - 10, y) + lumAt(original, w, h, x + 10, y)) / 2;
      if (local - here > 7 || here - local > 9) ink[y * w + x] = 1;
    }
  }
  const grown = new Uint8Array(ink);
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if (!ink[y * w + x]) continue;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const yy = y + dy;
          const xx = x + dx;
          if (yy < 0 || xx < 0 || yy >= h || xx >= w) continue;
          grown[yy * w + xx] = 1;
        }
      }
    }
  }
  let cleared = 0;
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if (!grown[y * w + x]) continue;
      let left = null;
      let right = null;
      for (let step = 4; step <= 28 && !left; step++) {
        const xx = x - step;
        if (xx < 0 || grown[y * w + xx]) continue;
        const i = (y * w + xx) * 4;
        left = [original[i], original[i + 1], original[i + 2]];
      }
      for (let step = 4; step <= 28 && !right; step++) {
        const xx = x + step;
        if (xx >= w || grown[y * w + xx]) continue;
        const i = (y * w + xx) * 4;
        right = [original[i], original[i + 1], original[i + 2]];
      }
      const color = left && right ? left.map((v, i) => (v + right[i]) / 2) : left || right;
      if (!color) continue;
      const i = (y * w + x) * 4;
      data[i] = color[0];
      data[i + 1] = color[1];
      data[i + 2] = color[2];
      cleared++;
    }
  }
  return cleared;
}

function UNUSED_largestBlob(mask, w, h) {
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
    const bw = maxX - minX + 1;
    const bh = maxY - minY + 1;
    if (bw < w * 0.18 || bh < h * 0.035 || bw > w * 0.8) continue;
    if (!face || area > face.area) face = { minX, maxX, minY, maxY, bw, bh, area };
  }
  return face;
}

function findCap(data, w, h) {
  const limit = Math.round(h * 0.42);
  const x0 = Math.round(w * 0.14);
  const x1 = Math.round(w * 0.86);
  const color = new Uint8Array(w * h);
  const white = new Uint8Array(w * h);
  for (let y = 0; y < limit; y++) {
    for (let x = x0; x <= x1; x++) {
      const i = (y * w + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const L = (r + g + b) / 3;
      const chroma = Math.max(r, g, b) - Math.min(r, g, b);
      if (L >= 48 && L <= 205 && chroma >= 10) color[y * w + x] = 1;
      if (L >= 188 && chroma <= 28) white[y * w + x] = 1;
    }
  }
  const face = largestBlob(color, w, h) || largestBlob(white, w, h);
  if (!face) return null;
  const cx = Math.round((face.minX + face.maxX) / 2);
  const sampleY = Math.min(h - 2, face.minY + Math.round(face.bh * 0.62));
  const plastic = rgbAt(data, w, Math.min(w - 2, face.minX + Math.round(face.bw * 0.18)), sampleY);
  return {
    top: face.minY,
    bottom: face.maxY,
    left: face.minX,
    right: face.maxX,
    center: cx,
    donorY: Math.max(face.minY + 4, face.maxY - 8),
    inkY: sampleY,
    lum: lum(plastic),
    med: plastic,
    width: face.bw,
  };
}

async function loadPixels(rel) {
  const abs = path.join(root, rel);
  const meta = await sharp(abs).metadata();
  let pipeline = sharp(abs).ensureAlpha();
  let scaled = false;
  if (meta.width === 864 && meta.height === 1152) {
    pipeline = pipeline.resize({ width: 1728, height: 2304, kernel: "lanczos3" });
    scaled = true;
  }
  const { data, info } = await pipeline.raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height, scaled, metaW: meta.width, metaH: meta.height };
}

const mode = process.argv[2] || "preview";
const only = (process.argv[3] || "").toLowerCase();
const pass = new Set([3, 5, 11, 17, 18, 23, 32, 41, 42, 45, 47, 48]);
const outDir = path.join(root, "scripts/_organic-caps");
fs.mkdirSync(outDir, { recursive: true });
const logoSrc = await loadLogo();

const lines = [];
let n = 0;
for (const job of jobs()) {
  n++;
  if (only && !`${job.folder} ${job.formula}`.toLowerCase().includes(only)) continue;
  const id = String(n).padStart(2, "0");
  const before = await sharp(path.join(root, job.rel)).metadata();
  if (before.width !== 864) {
    const line = `SKIP ${id} already ${before.width}x${before.height} ${job.formula}`;
    lines.push(line);
    console.log(line);
    continue;
  }
  const { data, w, h } = await loadPixels(job.rel);
  const found = findFace(data, w, h);
  const face = found && found.bot - found.top >= 90 ? found : { top: 340, bot: 760, drop: 0 };
  const faceTop = face.top + 16;
  const faceBot = face.bot - 14;
  const midX0 = Math.round(w * 0.4);
  const midX1 = Math.round(w * 0.6);
  const clusters = [];
  let cur = null;
  for (let y = faceTop; y <= faceBot; y += 2) {
    const e = rowEnergy(data, w, h, y, midX0, midX1);
    if (e > 5) {
      if (cur && y <= cur.max + 10) {
        cur.max = y;
        cur.sum += e;
        cur.peak = Math.max(cur.peak, e);
      } else {
        if (cur) clusters.push(cur);
        cur = { min: y, max: y, sum: e, peak: e };
      }
    }
  }
  if (cur) clusters.push(cur);
  const mark = clusters
    .filter((c) => c.max - c.min >= 20)
    .sort((a, b) => b.sum - a.sum)[0] || {
    min: Math.round((faceTop + faceBot) / 2) - 40,
    max: Math.round((faceTop + faceBot) / 2) + 40,
    sum: 0,
    peak: 0,
  };
  let donorY = null;
  let donorE = 99;
  for (let y = mark.max + 8; y <= Math.min(faceBot - 4, mark.max + 70); y += 2) {
    const e = rowEnergy(data, w, h, y, midX0, midX1);
    if (e < donorE) {
      donorE = e;
      donorY = y;
    }
  }
  if (donorY == null) donorY = Math.min(faceBot - 8, mark.max + 24);
  const cx = Math.round(w * 0.5);
  const rgb = (x) => {
    x = Math.max(0, Math.min(w - 1, x));
    const i = (donorY * w + x) * 4;
    return [data[i], data[i + 1], data[i + 2]];
  };
  const delta = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
  const seed = rgb(cx);
  const seek = (dir) => {
    for (let x = cx; dir < 0 ? x > 40 : x < w - 40; x += dir) {
      const jump = delta(rgb(x), rgb(x - dir * 8));
      if (jump > 80 && delta(rgb(x), seed) > 60 && Math.abs(x - cx) > 80) return x - dir;
    }
    return null;
  };
  let left = seek(-1);
  let right = seek(1);
  if (left == null && right == null) {
    left = cx - 340;
    right = cx + 340;
  } else {
    if (left == null) left = cx - (right - cx);
    if (right == null) right = cx + (cx - left);
  }
  left = Math.max(20, left);
  right = Math.min(w - 20, right);
  const edges = { left, right, center: Math.round((left + right) / 2), width: right - left };
  if (edges.width < 480 || edges.width > 1400) {
    const span = 900;
    edges.left = Math.round(edges.center - span / 2);
    edges.right = edges.left + span;
    edges.width = span;
  }
  const midY = Math.round((mark.min + Math.min(faceBot, mark.max + 80)) / 2);
  const plasticLum = lumAt(data, w, h, edges.center, donorY);
  const src = Buffer.from(data);
  const y0 = Math.max(face.top + 6, mark.min - 18);
  const y1 = Math.min(face.bot - 6, mark.max + 100);
  const colEnergy = new Float32Array(w);
  for (let y = mark.min; y <= Math.min(face.bot, mark.max + 36); y += 2) {
    for (let x = edges.left + 30; x <= edges.right - 36; x++) {
      const i = (y * w + x) * 4;
      const j = (y * w + x + 6) * 4;
      colEnergy[x] += Math.abs(src[i] - src[j]) + Math.abs(src[i + 1] - src[j + 1]) + Math.abs(src[i + 2] - src[j + 2]);
    }
  }
  let wordL = edges.center;
  let wordR = edges.center;
  const gate = 18;
  for (let x = edges.center; x > edges.left + 30; x--) {
    if (colEnergy[x] < gate && edges.center - x > 40) break;
    wordL = x;
  }
  for (let x = edges.center; x < edges.right - 30; x++) {
    if (colEnergy[x] < gate && x - edges.center > 40) break;
    wordR = x;
  }
  if (wordR - wordL < 80) {
    wordL = edges.center - 220;
    wordR = edges.center + 220;
  }
  const sampleRgb = (x, y) => {
    const i = (y * w + Math.max(0, Math.min(w - 1, x))) * 4;
    return [src[i], src[i + 1], src[i + 2]];
  };
  let cleared = 0;
  for (let y = y0; y <= y1; y++) {
    const leftC = sampleRgb(wordL - 14, y);
    const rightC = sampleRgb(wordR + 14, y);
    for (let x = wordL; x <= wordR; x++) {
      const t = (x - wordL) / Math.max(1, wordR - wordL);
      const fade = Math.min(1, Math.min(x - wordL, wordR - x) / 10);
      const i = (y * w + x) * 4;
      for (let c = 0; c < 3; c++) {
        const plastic = leftC[c] + (rightC[c] - leftC[c]) * t;
        data[i + c] = Math.round(src[i + c] * (1 - fade) + plastic * fade);
      }
      cleared++;
    }
  }
  const rowPeak = 0;
  const widthFrac = job.style === "engrave" ? 0.68 : 0.65;
  let logoW = Math.round(edges.width * widthFrac);
  let logoH = Math.round(logoW / logoSrc.aspect);
  const faceRoom = Math.round((face.bot - face.top) * 0.62);
  if (logoH > faceRoom) {
    logoH = faceRoom;
    logoW = Math.round(logoH * logoSrc.aspect);
  }
  const raster = await sharp(logoSrc.trimmed)
    .resize({ width: logoW, height: logoH, kernel: "lanczos3" })
    .ensureAlpha()
    .raw()
    .toBuffer();
  const originX = Math.round(edges.center - logoW / 2);
  let originY = Math.round(midY - logoH / 2);
  const minY = face.top + 8;
  const maxY = Math.max(minY, face.bot - logoH - 4);
  if (originY < minY) originY = minY;
  if (originY > maxY) originY = maxY;
  paint(data, w, h, raster, logoW, logoH, originX, originY, job.style, plasticLum);
  const top = Math.max(0, originY - 70);
  const bottom = Math.min(h - 1, originY + logoH + 70);
  const cropL = Math.max(0, edges.left - 20);
  const cropR = Math.min(w - 1, edges.right + 20);
  await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .extract({ left: cropL, top, width: cropR - cropL, height: bottom - top })
    .resize({ width: 460 })
    .jpeg({ quality: 82 })
    .toFile(path.join(outDir, `${id}-${job.style}.jpg`));
  if (mode === "write" && pass.has(n)) {
    const dest = path.join(root, job.rel);
    const tmp = `${dest}.stamp-tmp`;
    fs.rmSync(tmp, { force: true });
    await sharp(data, { raw: { width: w, height: h, channels: 4 } })
      .webp({ quality: 92, smartSubsample: false, effort: 6 })
      .toFile(tmp);
    console.log(`staged ${id}`);
  }
  const line = `${mode} ${id} ${job.style} ${job.index + 1} ${job.folder} | face ${face.top}-${face.bot} mark ${mark.min}-${mark.max} donor ${donorY} e ${donorE.toFixed(1)} cap ${edges.left}-${edges.right} logo ${logoW}x${logoH}@${originX},${originY} lum ${plasticLum.toFixed(0)} cleared ${cleared} row ${(rowPeak * 100).toFixed(0)}%`;
  lines.push(line);
  console.log(line);
}
fs.writeFileSync(path.join(outDir, "log.txt"), lines.join("\n"));
console.log("done", lines.length);
