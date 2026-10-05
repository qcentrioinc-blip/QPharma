import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const redo = [
  "Cinnamon|Milk Thistle + Artichoke Fruit + Myrobalan",
  "Garcinia Cambogia|Goji Berry + Bilberry + Marigold + Carrot",
  "Guduchi|Curcumin + Moringa + Liquorice + Ashwagandha Root",
  "Gymnema Sylvestre|Ashwagandha Root + Mucuna Pruriens + Safed Musli",
  "Gymnema Sylvestre|Muira Puama + Gokhru + Shilajit",
  "Gymnema Sylvestre|Shilajit + Ashwagandha Root + Ginseng",
  "Holy Basil|Iron + Folic Acid + Vitamin B12 + Vitamin B6 + Zinc",
  "Holy Basil|Vitamin B1 + Vitamin B2 + Vitamin B6 + Vitamin B12",
  "Kalmegh|Shatavari + Black Sesame Seed + Liquorice Root + Musta",
  "Liverwort|Cissus Quadrangularis + Boswellia Serrata + Piperine + Hadjod",
  "Liverwort|Guggul + Sea Buck Thorn + Schindra + Eucalyptus",
];

const faceBox = {
  "Cinnamon|Milk Thistle + Artichoke Fruit + Myrobalan": [318, 512],
  "Curcuma Longa|Gingko Biloba + Bacopa Monnieri + Shankhpushpi": [360, 560],
  "Curcuma Longa|Rosemary Leaf + Gotu Kola + Curcumin + Vacha": [430, 650],
  "Garcinia Cambogia|Goji Berry + Bilberry + Marigold + Carrot": [488, 804],
  "Garcinia Cambogia|Fennel Seed + Bay Berry + Spinach": [450, 660],
  "Guduchi|Neem Leaf + Morinda Citrifolia Fruit + Ashwagandha Root + Moringa Fruit": [360, 560],
  "Guduchi|American Ginseng + Kalmegh + Echinacea Root + Spirulina": [360, 550],
  "Guduchi|Curcumin + Moringa + Liquorice + Ashwagandha Root": [210, 436],
  "Gymnema Sylvestre|Ashwagandha Root + Mucuna Pruriens + Safed Musli": [452, 740],
  "Gymnema Sylvestre|Muira Puama + Gokhru + Shilajit": [468, 656],
  "Gymnema Sylvestre|Shilajit + Ashwagandha Root + Ginseng": [516, 708],
  "Gynoestemma|Horse Tail Herb + Birch Leaf + Tulsi Ark": [340, 560],
  "Gynoestemma|Manjistha + Amla + Fennel Seed + Celery": [360, 610],
  "Holy Basil|Iron + Folic Acid + Vitamin B12 + Vitamin B6 + Zinc": [448, 616],
  "Holy Basil|Folic Acid + Vitamin B12 + Vitamin C": [380, 600],
  "Holy Basil|Folic Acid + Vitamin B12 + Vitamin C + Iron + Zinc": [430, 650],
  "Holy Basil|Vitamin B1 + Vitamin B2 + Vitamin B6 + Vitamin B12": [436, 612],
  "Horsetail|Elderberry + Green Tea + Beetroot": [270, 490],
  "Kalmegh|Shatavari + Black Sesame Seed + Liquorice Root + Musta": [468, 640],
  "Kalmegh|Gokshuru + Holy Basil + Ashwagandha Root + Shalparni": [400, 650],
  "Liquorice|Bitter Melon + Lucuma + Banaba Leaf": [380, 620],
  "Liverwort|Cissus Quadrangularis + Boswellia Serrata + Piperine + Hadjod": [648, 820],
  "Liverwort|Cat's Claw + Bromelain Extract + Ashwagandha Root": [400, 630],
  "Liverwort|Rosehip Powder + Ginger + Curcumin + Maca Root": [500, 720],
  "Liverwort|Guggul + Sea Buck Thorn + Schindra + Eucalyptus": [464, 636],
  "Magnolia Bark|Manjistha Stem + Propolis + Avocado Fruit": [400, 650],
  "Triphala|Horse Chestnut + Rutin Powder + Arjuna + Cassia Bark": [380, 580],
  "Triphala|Arjuna + Guggul + Brahmi": [400, 650],
  "Triphala|Fenugreek Seed + Amla + Garlic Powder + Arjuna": [250, 480],
};

const manifest = fs.readFileSync("src/organic/imageManifest.ts", "utf8");
const paths = {};
for (const match of manifest.matchAll(/"([^"]+)": "([^"]+)"/g)) paths[match[1]] = `public${match[2]}`;

const rendered = await sharp("public/brand/vitalcore-logo.svg", { density: 700 }).png().toBuffer();
const trimmed = await sharp(rendered).trim().png().toBuffer();
const logoMeta = await sharp(trimmed).metadata();
const aspect = logoMeta.width / logoMeta.height;

function lumAt(data, w, x, y, h) {
  x = Math.max(0, Math.min(w - 1, x | 0));
  y = Math.max(0, Math.min(h - 1, y | 0));
  const i = (y * w + x) * 4;
  return (data[i] + data[i + 1] + data[i + 2]) / 3;
}

function rowRGB(data, w, y, x0, x1) {
  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;
  for (let x = x0; x <= x1; x += 8) {
    const i = (y * w + x) * 4;
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    n++;
  }
  return [r / n, g / n, b / n];
}

function findLabelTop(data, w, h) {
  const x0 = Math.round(w * 0.42);
  const x1 = Math.round(w * 0.58);
  for (let y = 640; y < 1180; y += 2) {
    const c = rowRGB(data, w, y, x0, x1);
    const above = rowRGB(data, w, y - 40, x0, x1);
    const bright = c[0] > 175 && c[1] > 160 && c[2] > 140 && c[0] - c[2] < 90;
    const jump = c[0] + c[1] + c[2] - (above[0] + above[1] + above[2]) > 140;
    if (!bright || !jump) continue;
    const below = rowRGB(data, w, Math.min(h - 2, y + 28), x0, x1);
    if (below[0] > 165 && below[1] > 150) return y;
  }
  return null;
}

function findLogoBand(data, w, h, label) {
  const yEnd = label ? Math.min(label - 28, 980) : 860;
  const x0 = Math.round(w * 0.36);
  const x1 = Math.round(w * 0.64);
  const clusters = [];
  let cur = null;
  for (let y = 250; y <= yEnd; y += 2) {
    const e = rowEnergy(data, w, h, y, x0, x1);
    if (e > 6) {
      if (cur && y <= cur.max + 14) {
        cur.max = y;
        cur.peak = Math.max(cur.peak, e);
        cur.sum += e;
      } else {
        if (cur) clusters.push(cur);
        cur = { min: y, max: y, peak: e, sum: e };
      }
    }
  }
  if (cur) clusters.push(cur);
  const tall = clusters.filter((c) => c.max - c.min >= 36);
  if (!tall.length) return { min: 380, max: 560 };
  const maxPeak = Math.max(...tall.map((c) => c.peak));
  const candidates = tall.filter((c) => c.peak >= maxPeak * 0.5);
  candidates.sort((a, b) => a.min - b.min);
  return candidates[0];
}

function findFace(data, w, h) {
  const peaks = [];
  let last = -999;
  for (let y = 240; y < 960; y += 2) {
    let g = 0;
    let n = 0;
    for (let x = Math.round(w * 0.37); x <= Math.round(w * 0.63); x += 12) {
      g += lumAt(data, w, x, y - 5, h) - lumAt(data, w, x, y + 5, h);
      n++;
    }
    const v = g / n;
    if (v > 18 && y - last > 40) {
      peaks.push({ y, v });
      last = y;
    }
  }
  const top = peaks.find((p) => p.y < 520);
  let bot = top ? peaks.filter((p) => p.y > top.y + 160 && p.y < top.y + 460).sort((a, b) => b.v - a.v)[0] : null;
  if (!top || !bot) {
    bot = peaks.filter((p) => p.y > 500 && p.y < 920).sort((a, b) => b.v - a.v)[0];
    if (!bot) return { top: 360, bot: 720 };
    return { top: bot.y - 380, bot: bot.y };
  }
  return { top: top.y, bot: bot.y };
}

function rowEnergy(data, w, h, y, x0, x1) {
  let e = 0;
  let c = 0;
  for (let x = x0; x <= x1 - 8; x += 4) {
    e += Math.abs(lumAt(data, w, x, y, h) - lumAt(data, w, x + 6, y, h));
    c++;
  }
  return c ? e / c : 99;
}

async function loadOriginal(rel) {
  const gitBuf = execFileSync("git", ["show", `HEAD:${rel}`], { maxBuffer: 30_000_000 });
  return sharp(gitBuf).resize({ width: 1728, height: 2304, kernel: "lanczos3" }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
}

function paint(data, w, h, logo, lw, lh, originX, originY, style, plasticLum, deep) {
  const alpha = new Float32Array(lw * lh);
  for (let i = 0; i < lw * lh; i++) alpha[i] = logo[i * 4 + 3] / 255;
  const tagCut = Math.round(lh * 0.66);
  const bold = new Float32Array(alpha);
  for (let y = tagCut; y < lh; y++) {
    for (let x = 0; x < lw; x++) {
      let m = alpha[y * lw + x];
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx;
          const yy = y + dy;
          if (xx < 0 || yy < tagCut || xx >= lw || yy >= lh) continue;
          m = Math.max(m, alpha[yy * lw + xx]);
        }
      }
      bold[y * lw + x] = m;
    }
  }
  const at = (x, y) => (x < 0 || y < 0 || x >= lw || y >= lh ? 0 : alpha[y * lw + x]);
  const white = plasticLum > 175;
  const black = style === "raise";
  for (let y = 0; y < lh; y++) {
    for (let x = 0; x < lw; x++) {
      const tag = y >= tagCut;
      const a = tag ? bold[y * lw + x] : alpha[y * lw + x];
      if (a < 0.16) continue;
      const px = originX + x;
      const py = originY + y;
      if (px < 1 || py < 1 || px >= w - 1 || py >= h - 1) continue;
      const i = (py * w + px) * 4;
      if (black) {
        const up = a - at(x - 5, y - 5);
        const down = a - at(x + 5, y + 5);
        let lift = tag ? 168 : a > 0.78 ? 158 : 118;
        if (!tag && up > 0.18 && up >= down) lift += 32;
        if (!tag && down > 0.18) lift -= 40;
        lift *= Math.min(1, a);
        data[i] = Math.min(255, Math.round(data[i] + lift));
        data[i + 1] = Math.min(255, Math.round(data[i + 1] + lift));
        data[i + 2] = Math.min(255, Math.round(data[i + 2] + lift));
        continue;
      }
      const bevel = deep ? 7 : 4;
      const dropUp = a - at(x - bevel, y - bevel);
      const dropDown = a - at(x + bevel, y + bevel);
      let factor;
      if (deep) {
        if (tag) factor = a > 0.35 ? 0.24 : 0.36;
        else if (a > 0.78) factor = 0.3;
        else if (dropUp > 0.2 && dropUp >= dropDown) factor = 0.2;
        else if (dropDown > 0.2 && a < 0.7) factor = 0.78;
        else factor = 0.34;
      } else if (tag) factor = a > 0.35 ? (white ? 0.5 : 0.3) : white ? 0.62 : 0.42;
      else if (a > 0.78) factor = white ? 0.58 : 0.38;
      else if (dropUp > 0.2 && dropUp >= dropDown) factor = white ? 0.48 : 0.28;
      else if (dropDown > 0.2 && a < 0.7) factor = white ? 0.82 : 0.72;
      else factor = white ? 0.64 : 0.42;
      data[i] = Math.max(0, Math.min(255, Math.round(data[i] * factor)));
      data[i + 1] = Math.max(0, Math.min(255, Math.round(data[i + 1] * factor)));
      data[i + 2] = Math.max(0, Math.min(255, Math.round(data[i + 2] * factor)));
    }
  }
}

function dropSpecks(mask, w, y0, y1, x0, x1) {
  const seen = new Uint8Array(w * (y1 + 1));
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const start = y * w + x;
      if (!mask[start] || seen[start]) continue;
      const stack = [start];
      const comp = [];
      seen[start] = 1;
      let minY = y;
      let maxY = y;
      while (stack.length) {
        const p = stack.pop();
        comp.push(p);
        const py = (p / w) | 0;
        const px = p - py * w;
        if (py < minY) minY = py;
        if (py > maxY) maxY = py;
        for (const n of [p - 1, p + 1, p - w, p + w]) {
          if (n < 0 || seen[n] || !mask[n]) continue;
          const ny = (n / w) | 0;
          const nx = n - ny * w;
          if (ny < y0 || ny > y1 || nx < x0 || nx > x1) continue;
          seen[n] = 1;
          stack.push(n);
        }
      }
      if (comp.length < 70 || maxY - minY < 3) {
        for (const p of comp) mask[p] = 0;
      }
    }
  }
}

function capEdges(src, w, h, y) {
  const cx = Math.round(w / 2);
  const rgb = (x, yy) => {
    const i = (yy * w + x) * 4;
    return [src[i], src[i + 1], src[i + 2]];
  };
  const delta = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
  const seed = rgb(cx, y);
  const seek = (dir) => {
    for (let x = cx; dir < 0 ? x > 80 : x < w - 80; x += dir) {
      const jumped = delta(rgb(x, y), rgb(x - dir * 6, y)) > 70;
      const leftCap = delta(rgb(x, y), seed) > 55;
      if (jumped && leftCap && Math.abs(x - cx) > 120) return x - dir * 2;
    }
    return null;
  };
  let left = seek(-1);
  let right = seek(1);
  if (left == null || right == null || Math.abs((left + right) / 2 - cx) > 28 || right - left < 560 || right - left > 980) {
    left = cx - 390;
    right = cx + 390;
  }
  return { left, right };
}

function solve3(a11, a12, a13, b1, a21, a22, a23, b2, a31, a32, a33, b3) {
  const det = (a, b, c, d, e, f, g, h, i) => a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
  const d = det(a11, a12, a13, a21, a22, a23, a31, a32, a33);
  if (Math.abs(d) < 1e-4) return null;
  return [
    det(b1, a12, a13, b2, a22, a23, b3, a32, a33) / d,
    det(a11, b1, a13, a21, b2, a23, a31, b3, a33) / d,
    det(a11, a12, b1, a21, a22, b2, a31, a32, b3) / d,
  ];
}

function rowFit(src, w, y, left, right) {
  const capW = right - left;
  const band = Math.max(28, Math.round(capW * 0.1));
  const xs = [];
  for (let x = left + 16; x < left + 16 + band; x += 3) xs.push(x);
  for (let x = right - 16 - band; x <= right - 16; x += 3) xs.push(x);
  let s0 = 0;
  let s1 = 0;
  let s2 = 0;
  let s3 = 0;
  let s4 = 0;
  const y0 = [0, 0, 0];
  const y1 = [0, 0, 0];
  const y2 = [0, 0, 0];
  for (const x of xs) {
    const t = (x - left) / capW;
    const i = (y * w + x) * 4;
    s0++;
    s1 += t;
    s2 += t * t;
    s3 += t * t * t;
    s4 += t * t * t * t;
    for (let c = 0; c < 3; c++) {
      const v = src[i + c];
      y0[c] += v;
      y1[c] += v * t;
      y2[c] += v * t * t;
    }
  }
  const fits = [0, 1, 2].map((c) => solve3(s4, s3, s2, y2[c], s3, s2, s1, y1[c], s2, s1, s0, y0[c]));
  if (fits.some((f) => !f)) return null;
  return (x) => {
    const t = (x - left) / capW;
    return fits.map((f) => f[0] * t * t + f[1] * t + f[2]);
  };
}

async function stamp(key) {
  const rel = paths[key];
  const box = faceBox[key];
  if (!rel || !box) throw new Error(`missing ${key}`);
  const { data, info } = await loadOriginal(rel);
  const w = info.width;
  const h = info.height;
  const src = Buffer.from(data);
  const y0 = box[0];
  const y1 = box[1];
  const midY = Math.round((y0 + y1) / 2);
  const { left, right } = capEdges(src, w, h, Math.max(8, y0 + 16));
  const capW = right - left;
  const xL = left + 22;
  const xR = right - 22;
  const blackCap = key.includes("Shilajit + Ashwagandha");
  const blankFront = key.includes("Rosehip Powder");
  const ornate = key.includes("Mucuna Pruriens");
  const plasticLum = (lumAt(src, w, left + 36, midY, h) + lumAt(src, w, right - 36, midY, h)) / 2;
  const whiteCap = plasticLum > 185;
  const xA = left + 12;
  const xB = right - 12;
let cleared = 0;
  let refNote = "blur";
  const grain = false;
  if (!blankFront) {
    const x0 = Math.max(2, left + 4);
    const x1 = Math.min(w - 3, right - 4);
    const yTop = Math.max(2, y0);
    const yBot = Math.min(h - 3, y1);
    const quietNear = (y, dir) => {
      let best = y;
      let bestE = 999;
      for (let i = 0; i <= 16; i += 2) {
        const yy = y + dir * i;
        if (yy < 8 || yy > h - 8) break;
        const e = rowEnergy(src, w, h, yy, left + 80, right - 80);
        if (e < bestE) {
          bestE = e;
          best = yy;
        }
        if (e < 2.4) break;
      }
      return best;
    };
    const yN = quietNear(Math.max(8, yTop - 2), -1);
    const yS = quietNear(Math.min(h - 8, yBot + 2), 1);
    refNote = yN + "-" + yS;
    const blurRow = (y) => {
      const n = x1 - x0 + 1;
      const raw = new Float32Array(n * 3);
      for (let x = x0; x <= x1; x++) {
        const i = (y * w + x) * 4;
        const o = (x - x0) * 3;
        raw[o] = src[i];
        raw[o + 1] = src[i + 1];
        raw[o + 2] = src[i + 2];
      }
      const out = new Float32Array(n * 3);
      const radius = 1;
      for (let x = 0; x < n; x++) {
        let r = 0;
        let g = 0;
        let b = 0;
        let c = 0;
        for (let k = -radius; k <= radius; k += 2) {
          const xx = Math.max(0, Math.min(n - 1, x + k));
          r += raw[xx * 3];
          g += raw[xx * 3 + 1];
          b += raw[xx * 3 + 2];
          c++;
        }
        out[x * 3] = r / c;
        out[x * 3 + 1] = g / c;
        out[x * 3 + 2] = b / c;
      }
      return out;
    };
    const top = blurRow(yN);
    const bot = blurRow(yS);
    for (let y = yTop; y <= yBot; y++) {
      const v = (y - yN) / Math.max(1, yS - yN);
      for (let x = x0; x <= x1; x++) {
        const o = (x - x0) * 3;
        const i = (y * w + x) * 4;
        const pred = [0, 1, 2].map((c) => top[o + c] * (1 - v) + bot[o + c] * v);
        const diff =
          Math.abs(src[i] - pred[0]) + Math.abs(src[i + 1] - pred[1]) + Math.abs(src[i + 2] - pred[2]);
        if (grain && diff < 52) continue;
        const edge = Math.min(x - x0, x1 - x, y - yTop, yBot - y);
        const feather = edge < 10 && diff < 18 ? edge / 10 : 1;
        for (let c = 0; c < 3; c++) {
          const val = Math.max(0, Math.min(255, pred[c]));
          data[i + c] = Math.round(src[i + c] * (1 - feather) + val * feather);
        }
        if (feather > 0.5) cleared++;
      }
    }
    if (key.includes("Mucuna Pruriens")) {
      const mid = Math.round((x0 + x1) / 2);
      const half = 70;
      const topC = [0, 0, 0];
      const botC = [0, 0, 0];
      let cn = 0;
      for (let x = mid - half; x <= mid + half; x++) {
        const o = (x - x0) * 3;
        for (let c = 0; c < 3; c++) {
          topC[c] += top[o + c];
          botC[c] += bot[o + c];
        }
        cn++;
      }
      for (let c = 0; c < 3; c++) {
        topC[c] /= cn;
        botC[c] /= cn;
      }
      const n = x1 - x0 + 1;
      const light = new Float32Array(n);
      const rad = 56;
      for (let x = 0; x < n; x++) {
        let s = 0;
        let c = 0;
        for (let k = -rad; k <= rad; k += 3) {
          const xx = Math.max(0, Math.min(n - 1, x + k));
          s += (top[xx * 3] + top[xx * 3 + 1] + top[xx * 3 + 2]) / 3;
          c++;
        }
        light[x] = s / c;
      }
      const midL = Math.max(1, light[mid - x0]);
      for (let y = yTop; y <= yBot; y++) {
        const v = (y - yN) / Math.max(1, yS - yN);
        const edge = Math.min(y - yTop, yBot - y);
        const fade = edge < 12 ? edge / 12 : 1;
        for (let x = x0; x <= x1; x++) {
          const i = (y * w + x) * 4;
          const scale = light[x - x0] / midL;
          for (let c = 0; c < 3; c++) {
            const base = topC[c] * (1 - v) + botC[c] * v;
            const val = Math.max(0, Math.min(255, base * scale));
            data[i + c] = Math.round(src[i + c] * (1 - fade) + val * fade);
          }
        }
      }
    }
  }
  const style = blackCap ? "raise" : "engrave";
  const big = key.includes("Goji Berry") || (key.startsWith("Gymnema") && !blackCap);
  const deep = key.startsWith("Gymnema") && !blackCap;
  let logoW = Math.round(capW * (big ? 0.74 : blackCap ? 0.66 : 0.64));
  let logoH = Math.round(logoW / aspect);
  const maxH = big ? 220 : blackCap ? 172 : Math.round((y1 - y0) * 0.82);
  if (logoH > maxH) {
    logoH = maxH;
    logoW = Math.round(logoH * aspect);
  }
  const focus = {
    "Cinnamon|Milk Thistle + Artichoke Fruit + Myrobalan": 418,
    "Garcinia Cambogia|Goji Berry + Bilberry + Marigold + Carrot": 600,
    "Guduchi|Curcumin + Moringa + Liquorice + Ashwagandha Root": 328,
    "Gymnema Sylvestre|Ashwagandha Root + Mucuna Pruriens + Safed Musli": 590,
    "Gymnema Sylvestre|Muira Puama + Gokhru + Shilajit": 548,
    "Gymnema Sylvestre|Shilajit + Ashwagandha Root + Ginseng": 612,
    "Holy Basil|Iron + Folic Acid + Vitamin B12 + Vitamin B6 + Zinc": 524,
    "Holy Basil|Vitamin B1 + Vitamin B2 + Vitamin B6 + Vitamin B12": 516,
    "Kalmegh|Shatavari + Black Sesame Seed + Liquorice Root + Musta": 548,
    "Liverwort|Cissus Quadrangularis + Boswellia Serrata + Piperine + Hadjod": 728,
    "Liverwort|Guggul + Sea Buck Thorn + Schindra + Eucalyptus": 540,
  }[key] ?? midY;
  const bare = Buffer.from(data);
  const raster = await sharp(trimmed).resize({ width: logoW, height: logoH, kernel: "lanczos3" }).ensureAlpha().raw().toBuffer();
  const originX = Math.round((left + right) / 2 - logoW / 2);
  let originY = Math.round(focus - logoH / 2);
  originY = Math.max(y0 + 2, Math.min(originY, y1 - logoH - 2));
  paint(data, w, h, raster, logoW, logoH, originX, originY, style, plasticLum, deep);
  return {
    data, w, h, rel, style, plasticLum,
    face: { top: y0, bot: y1, label: refNote },
    left, right, originX, originY, logoW, logoH, cleared, bare,
  };
}

const mode = process.argv[2] || "preview";
const only = (process.argv[3] || "").toLowerCase();
const outDir = "scripts/_organic-caps/fix11";
fs.mkdirSync(outDir, { recursive: true });

if (mode === "swap") {
  let swapped = 0;
  for (const key of redo) {
    if (only && !key.toLowerCase().includes(only)) continue;
    const dest = paths[key];
    const tmp = `${dest}.stamp-tmp`;
    const aside = `${dest}.replaced`;
    if (!fs.existsSync(tmp)) {
      console.log("missing", tmp);
      continue;
    }
    if (fs.existsSync(aside)) fs.rmSync(aside, { force: true });
    fs.renameSync(dest, aside);
    fs.renameSync(tmp, dest);
    try {
      fs.rmSync(aside, { force: true });
    } catch {
      console.log("kept aside", aside);
    }
    swapped++;
    console.log("swapped", path.basename(dest));
  }
  console.log("swapped", swapped);
  process.exit(0);
}

let n = 0;
for (const key of redo) {
  n++;
  if (only && !key.toLowerCase().includes(only)) continue;
  const id = String(n).padStart(2, "0");
  const result = await stamp(key);
  if (mode === "preview") {
    await sharp(result.data, { raw: { width: result.w, height: result.h, channels: 4 } })
      .resize({ width: 420 })
      .jpeg({ quality: 78 })
      .toFile(path.join(outDir, `${id}.jpg`));
    const cropTop = Math.max(0, result.face.top - 10);
    const cropH = Math.min(result.h - cropTop, result.face.bot - cropTop + 16);
    await sharp(result.data, { raw: { width: result.w, height: result.h, channels: 4 } })
      .extract({ left: 430, top: cropTop, width: 860, height: cropH })
      .jpeg({ quality: 86 })
      .toFile(path.join(outDir, `${id}-cap.jpg`));
    await sharp(result.bare, { raw: { width: result.w, height: result.h, channels: 4 } })
      .extract({ left: 430, top: cropTop, width: 860, height: cropH })
      .jpeg({ quality: 86 })
      .toFile(path.join(outDir, `${id}-bare.jpg`));
  } else {
    const dest = result.rel;
    const tmp = `${dest}.stamp-tmp`;
    fs.rmSync(tmp, { force: true });
    await sharp(result.data, { raw: { width: result.w, height: result.h, channels: 4 } })
      .webp({ quality: 92, smartSubsample: false, effort: 4 })
      .toFile(tmp);
  }
  console.log(
    id,
    result.style,
    Math.round(result.plasticLum),
    `face ${result.face.top}-${result.face.bot} label ${result.face.label}`,
    `cap ${result.left}-${result.right}`,
    `logo ${result.originX},${result.originY} ${result.logoW}x${result.logoH}`,
    `cleared ${result.cleared}`,
    `ref ${result.face.label}`,
    key.split("|")[1].slice(0, 36),
  );
}
console.log("done", only || redo.length);
