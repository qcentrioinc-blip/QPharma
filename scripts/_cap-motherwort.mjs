import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const redo = [
  "Cinnamon|Kutki + Schisandra Berry + Nigella Sativa",
  "Cinnamon|Milk Thistle + Artichoke Fruit + Myrobalan",
  "Curcuma Longa|Gingko Biloba + Bacopa Monnieri + Shankhpushpi",
  "Curcuma Longa|Rosemary Leaf + Gotu Kola + Curcumin + Vacha",
  "Curcuma Longa|Bacopa Monnieri + Rhodiola Rosea + Ginseng",
  "Garcinia Cambogia|Goji Berry + Bilberry + Marigold + Carrot",
  "Garcinia Cambogia|Fennel Seed + Bay Berry + Spinach",
  "Guduchi|Astragalus Root + Aronia Berry + Maitake Mushroom + Holy Basil",
  "Guduchi|Neem Leaf + Morinda Citrifolia Fruit + Ashwagandha Root + Moringa Fruit",
  "Guduchi|American Ginseng + Kalmegh + Echinacea Root + Spirulina",
  "Guduchi|Curcumin + Moringa + Liquorice + Ashwagandha Root",
  "Gymnema Sylvestre|Ashwagandha Root + Mucuna Pruriens + Safed Musli",
  "Gymnema Sylvestre|Muira Puama + Gokhru + Shilajit",
  "Gymnema Sylvestre|Shilajit + Ashwagandha Root + Ginseng",
  "Gynoestemma|Horse Tail Herb + Birch Leaf + Tulsi Ark",
  "Gynoestemma|Manjistha + Amla + Fennel Seed + Celery",
  "Holy Basil|Iron + Folic Acid + Vitamin B12 + Vitamin B6 + Zinc",
  "Holy Basil|Folic Acid + Vitamin B12 + Vitamin C",
  "Holy Basil|Folic Acid + Vitamin B12 + Vitamin C + Iron + Zinc",
  "Horsetail|Elderberry + Green Tea + Beetroot",
  "Horsetail|Pomegranate + Cranberry + Curcumin",
  "Horsetail|Wheat Grass + Acai Berry + Raspberries + Papain",
  "Horsetail|Spirulina + Tart Cherry + Bacopa Monnieri",
  "Kalmegh|Gokshuru + Holy Basil + Ashwagandha Root + Shalparni",
  "Kalmegh|Ashoka + Jeevanti + Punarnava + Guduchi",
  "Liquorice|Bitter Melon + Lucuma + Banaba Leaf",
  "Liquorice|Chitrak Root + Fenugreek Seed + Olive Leaf",
  "Liquorice|Prickly Pear Leaf + Mulberry Leaf + Cinnamon Bark",
  "Liquorice|Gymnema Leaf + Bilberry",
  "Liverwort|Cissus Quadrangularis + Boswellia Serrata + Piperine + Hadjod",
  "Liverwort|Cat's Claw + Bromelain Extract + Ashwagandha Root",
  "Liverwort|Rosehip Powder + Ginger + Curcumin + Maca Root",
  "Liverwort|Guggul + Sea Buck Thorn + Schindra + Eucalyptus",
  "Magnolia Bark|Manjistha Stem + Propolis + Avocado Fruit",
  "Magnolia Bark|Aloe Vera + Bamboo Stem + Sesbania Grandiflora + Bearberry",
  "Magnolia Bark|Amla + Bhringraj + Brahmi + Grapeseed",
  "Magnolia Bark|Orange + Hibiscus + Gingko Biloba + Green Tea",
  "Moringa|Evening Primrose + Nettle Leaf + Valerian + Wild Yam",
  "Moringa|Flaxseed + Red Clover + Black Cohosh Root + Ginseng",
  "Triphala|Horse Chestnut + Rutin Powder + Arjuna + Cassia Bark",
  "Triphala|Aronia Berry + Piperine + Maitake Mushroom",
  "Triphala|Arjuna + Guggul + Brahmi",
  "Triphala|Fenugreek Seed + Amla + Garlic Powder + Arjuna",
];

const manifest = fs.readFileSync("src/organic/imageManifest.ts", "utf8");
const paths = {};
for (const match of manifest.matchAll(/"([^"]+)": "([^"]+)"/g)) paths[match[1]] = `public${match[2]}`;

const rendered = await sharp("public/brand/vitalcore-logo.svg", { density: 700 }).png().toBuffer();
const trimmed = await sharp(rendered).trim().png().toBuffer();
const logoMeta = await sharp(trimmed).metadata();
const aspect = logoMeta.width / logoMeta.height;

function lumAt(data, w, x, y, h) {
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

function paint(data, w, h, logo, lw, lh, originX, originY, style, plasticLum) {
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
        const lift = (tag ? 170 : a > 0.78 ? 145 : 100) * Math.min(1, a);
        data[i] = Math.min(255, Math.round(data[i] + lift));
        data[i + 1] = Math.min(255, Math.round(data[i + 1] + lift));
        data[i + 2] = Math.min(255, Math.round(data[i + 2] + lift));
        continue;
      }
      const dropUp = a - at(x - 4, y - 4);
      const dropDown = a - at(x + 4, y + 4);
      let factor;
      if (style === "engrave") {
        if (tag) factor = a > 0.35 ? (white ? 0.5 : 0.3) : white ? 0.62 : 0.42;
        else if (a > 0.78) factor = white ? 0.58 : 0.38;
        else if (dropUp > 0.2 && dropUp >= dropDown) factor = white ? 0.48 : 0.28;
        else if (dropDown > 0.2 && a < 0.7) factor = white ? 0.82 : 0.72;
        else factor = white ? 0.64 : 0.42;
      } else if (tag) factor = a > 0.35 ? 0.4 : 0.5;
      else if (a > 0.78) factor = 1.08;
      else if (dropUp > 0.2 && dropUp >= dropDown) factor = 1.16;
      else if (dropDown > 0.2 && a < 0.7) factor = 0.76;
      else factor = 1;
      data[i] = Math.max(0, Math.min(255, Math.round(data[i] * factor)));
      data[i + 1] = Math.max(0, Math.min(255, Math.round(data[i + 1] * factor)));
      data[i + 2] = Math.max(0, Math.min(255, Math.round(data[i + 2] * factor)));
    }
  }
}

async function stamp(key) {
  const rel = paths[key];
  if (!rel) throw new Error(`missing ${key}`);
  const { data, info } = await loadOriginal(rel);
  const w = info.width;
  const h = info.height;
  const src = Buffer.from(data);
  const face = findFace(data, w, h);
  const midX0 = Math.round(w * 0.4);
  const midX1 = Math.round(w * 0.6);
  const clusters = [];
  let cur = null;
  for (let y = face.top + 16; y <= face.bot - 14; y += 2) {
    const e = rowEnergy(data, w, h, y, midX0, midX1);
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
    min: face.top + 70,
    max: face.top + 150,
  };
  let donorY = Math.min(face.bot - 8, mark.max + 20);
  let donorE = 99;
  for (let y = mark.max + 6; y <= Math.min(face.bot - 6, mark.max + 90); y += 2) {
    const e = rowEnergy(data, w, h, y, midX0, midX1);
    if (e < donorE) {
      donorE = e;
      donorY = y;
    }
  }
  const cx = Math.round(w / 2);
  const rgb = (x, y) => {
    const i = (y * w + Math.max(0, Math.min(w - 1, x))) * 4;
    return [src[i], src[i + 1], src[i + 2]];
  };
  const delta = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
  const seed = rgb(cx, donorY);
  const seek = (dir) => {
    for (let x = cx; dir < 0 ? x > 40 : x < w - 40; x += dir) {
      if (delta(rgb(x, donorY), rgb(x - dir * 8, donorY)) > 80 && delta(rgb(x, donorY), seed) > 60 && Math.abs(x - cx) > 80) return x - dir;
    }
    return null;
  };
  let left = seek(-1);
  let right = seek(1);
  if (left == null) left = cx - (right == null ? 400 : right - cx);
  if (right == null) right = cx + (cx - left);
  let capW = right - left;
  if (capW < 480 || capW > 1400) {
    left = cx - 420;
    right = cx + 420;
    capW = right - left;
  }
  const y0 = Math.max(face.top + 8, mark.min - 14);
  const y1 = Math.min(face.bot - 8, mark.max + 72);
  const xL = left + 24;
  const xR = right - 24;
  const ink = new Uint8Array(w * h);
  for (let y = y0; y <= y1; y++) {
    for (let x = xL; x <= xR; x++) {
      const here = lumAt(src, w, x, y, h);
      const local = (lumAt(src, w, x - 14, y, h) + lumAt(src, w, x + 14, y, h)) / 2;
      if (Math.abs(here - local) > 8) ink[y * w + x] = 1;
    }
  }
  const rad = 8;
  const grown = new Uint8Array(ink);
  for (let y = y0; y <= y1; y++) {
    for (let x = xL; x <= xR; x++) {
      if (!ink[y * w + x]) continue;
      for (let dy = -rad; dy <= rad; dy++) {
        const yy = y + dy;
        if (yy < y0 || yy > y1) continue;
        for (let dx = -rad; dx <= rad; dx++) {
          if (dx * dx + dy * dy > rad * rad) continue;
          const xx = x + dx;
          if (xx < xL || xx > xR) continue;
          grown[yy * w + xx] = 1;
        }
      }
    }
  }
  for (let y = y0; y <= y1; y++) {
    for (let x = xL; x <= xR; x++) {
      if (!grown[y * w + x]) continue;
      const j = (donorY * w + x) * 4;
      const i = (y * w + x) * 4;
      const shift = (lumAt(src, w, left + 40, y, h) + lumAt(src, w, right - 40, y, h)) / 2
        - (lumAt(src, w, left + 40, donorY, h) + lumAt(src, w, right - 40, donorY, h)) / 2;
      for (let c = 0; c < 3; c++) data[i + c] = Math.max(0, Math.min(255, Math.round(src[j + c] + shift)));
    }
  }
  const sideAt = (y) => Math.min(lumAt(src, w, left + 48, y, h), lumAt(src, w, right - 48, y, h));
  const faceSamples = [];
  let goldN = 0;
  let sampleN = 0;
  for (let y = face.top + 16; y < face.bot - 16; y += 8) {
    for (let x = left + 60; x < right - 60; x += 12) {
      const i = (y * w + x) * 4;
      faceSamples.push(lumAt(src, w, x, y, h));
      sampleN++;
      if (src[i] > 110 && src[i] - src[i + 2] > 35) goldN++;
    }
  }
  faceSamples.sort((a, b) => a - b);
  const plasticLum = faceSamples[Math.floor(faceSamples.length * 0.5)] ?? sideAt(Math.round((face.top + face.bot) / 2));
  const darkShare = faceSamples.filter((v) => v < 60).length / Math.max(1, faceSamples.length);
  const goldShare = goldN / Math.max(1, sampleN);
  const blackCap = (plasticLum < 55 && darkShare > 0.55) || (darkShare > 0.4 && goldShare > 0.08 && plasticLum < 90);
  if (blackCap) {
    const gold = new Uint8Array(w * h);
    const yStart = face.top;
    const yEnd = Math.min(h - 8, face.bot + 160);
    for (let y = yStart; y < yEnd; y++) {
      if (sideAt(y) > 70) continue;
      for (let x = left + 20; x < right - 20; x++) {
        const i = (y * w + x) * 4;
        const goldish = (buf) => buf[i] > 80 && buf[i] - buf[i + 2] > 25 && buf[i + 1] > buf[i + 2] + 8;
        if (goldish(src) || goldish(data)) gold[y * w + x] = 1;
      }
    }
    const grown = new Uint8Array(gold);
    for (let y = yStart; y < yEnd; y++) {
      for (let x = left + 20; x < right - 20; x++) {
        if (!gold[y * w + x]) continue;
        for (let dy = -4; dy <= 4; dy++) {
          const yy = y + dy;
          if (yy < yStart || yy >= yEnd || sideAt(yy) > 70) continue;
          for (let dx = -4; dx <= 4; dx++) grown[yy * w + (x + dx)] = 1;
        }
      }
    }
    for (let y = yStart; y < yEnd; y++) {
      const jl = (y * w + (left + 36)) * 4;
      for (let x = left + 20; x < right - 20; x++) {
        if (!grown[y * w + x]) continue;
        const i = (y * w + x) * 4;
        for (let c = 0; c < 3; c++) data[i + c] = src[jl + c];
      }
    }
  }
  const style = blackCap ? "raise" : "engrave";
  let logoW = Math.round(capW * 0.62);
  let logoH = Math.round(logoW / aspect);
  const room = Math.round((face.bot - face.top) * 0.58);
  if (logoH > room) {
    logoH = room;
    logoW = Math.round(logoH * aspect);
  }
  const raster = await sharp(trimmed).resize({ width: logoW, height: logoH, kernel: "lanczos3" }).ensureAlpha().raw().toBuffer();
  const originX = Math.round((left + right) / 2 - logoW / 2);
  let originY = Math.round((y0 + Math.min(y1, mark.max + 20)) / 2 - logoH / 2);
  originY = Math.max(face.top + 8, Math.min(originY, face.bot - logoH - 6));
  paint(data, w, h, raster, logoW, logoH, originX, originY, style, plasticLum);
  return { data, w, h, rel, style, plasticLum, darkShare, goldShare, face, left, right };
}

const mode = process.argv[2] || "preview";
const only = (process.argv[3] || "").toLowerCase();
const outDir = "scripts/_organic-caps/mw";
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
  } else {
    const dest = result.rel;
    const tmp = `${dest}.stamp-tmp`;
    fs.rmSync(tmp, { force: true });
    await sharp(result.data, { raw: { width: result.w, height: result.h, channels: 4 } })
      .webp({ quality: 92, smartSubsample: false, effort: 4 })
      .toFile(tmp);
  }
  console.log(id, result.style, Math.round(result.plasticLum), result.darkShare.toFixed(2), result.goldShare.toFixed(2), key.split("|")[1].slice(0, 32));
}
console.log("done", only || redo.length);
