import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const svg = fs.readFileSync("public/brand/vitalcore-logo.svg");
const outDir = "scripts/_pack-fix";
fs.mkdirSync(outDir, { recursive: true });

async function makeLogo(width) {
  const trimmed = await sharp(svg, { density: 520 }).trim().png().toBuffer();
  const meta = await sharp(trimmed).metadata();
  const height = Math.max(1, Math.round(width * (meta.height / meta.width)));
  const buf = await sharp(trimmed).resize({ width, height, kernel: "lanczos3" }).png().toBuffer();
  return sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
}

function surfacePrint(data, w, h, logo, ox, oy) {
  const src = logo.data;
  const lw = logo.info.width;
  const lh = logo.info.height;
  let sum = 0;
  let n = 0;
  for (let y = 0; y < lh; y += 2) {
    const dy = oy + y;
    if (dy < 0 || dy >= h) continue;
    for (let x = 0; x < lw; x += 2) {
      const dx = ox + x;
      if (dx < 0 || dx >= w) continue;
      if (src[(y * lw + x) * 4 + 3] < 40) continue;
      const i = (dy * w + dx) * 4;
      sum += (data[i] + data[i + 1] + data[i + 2]) / 3;
      n++;
    }
  }
  const mean = n ? sum / n : 220;
  for (let y = 0; y < lh; y++) {
    const dy = oy + y;
    if (dy < 0 || dy >= h) continue;
    for (let x = 0; x < lw; x++) {
      const dx = ox + x;
      if (dx < 0 || dx >= w) continue;
      const s = (y * lw + x) * 4;
      const a = src[s + 3] / 255;
      if (a < 0.04) continue;
      const i = (dy * w + dx) * 4;
      const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const gain = Math.min(1.12, Math.max(0.68, lum / mean));
      const nx = x / lw - 0.5;
      const wrap = 1 - nx * nx * 0.18;
      for (let c = 0; c < 3; c++) {
        const ink = Math.min(255, src[s + c] * gain * wrap);
        data[i + c] = Math.round(data[i + c] * (1 - a) + ink * a);
      }
    }
  }
}

function deboss(data, w, h, logo, ox, oy) {
  const src = logo.data;
  const lw = logo.info.width;
  const lh = logo.info.height;
  const A = (x, y) => {
    if (x < 0 || y < 0 || x >= lw || y >= lh) return 0;
    return src[(y * lw + x) * 4 + 3] / 255;
  };
  for (let y = 0; y < lh; y++) {
    const dy = oy + y;
    if (dy < 0 || dy >= h) continue;
    for (let x = 0; x < lw; x++) {
      const a = A(x, y);
      if (a < 0.05) continue;
      const dx = ox + x;
      if (dx < 0 || dx >= w) continue;
      const shade = A(x - 1, y - 1) * 0.35 - A(x + 2, y + 2);
      const factor = Math.min(1.34, Math.max(0.33, 1 - 0.58 * a + shade));
      const i = (dy * w + dx) * 4;
      for (let c = 0; c < 3; c++) data[i + c] = Math.min(255, Math.max(0, Math.round(data[i + c] * factor)));
    }
  }
}

function labelPaper(r, g, b) {
  const lum = (r + g + b) / 3;
  return lum > 198 && r > 168 && Math.abs(r - g) < 36 && r + 22 >= b && b < r + 40;
}

function wipeGradient(data, w, h, x0, y0, x1, y1, isPaper) {
  const src = Buffer.from(data);
  const paperAt = (x, y) => {
    if (x < 1 || y < 1 || x >= w - 1 || y >= h - 1) return null;
    const i = (y * w + x) * 4;
    if (!isPaper(src[i], src[i + 1], src[i + 2])) return null;
    return [src[i], src[i + 1], src[i + 2]];
  };
  const avg = (list) => {
    if (!list.length) return null;
    const c = [0, 0, 0];
    for (const p of list) {
      c[0] += p[0];
      c[1] += p[1];
      c[2] += p[2];
    }
    return c.map((v) => v / list.length);
  };
  for (let x = x0; x <= x1; x++) {
    const tops = [];
    const bots = [];
    for (let dx = -3; dx <= 3; dx++) {
      for (let k = 4; k <= 28; k++) {
        const p = paperAt(x + dx, y0 - k);
        if (p) {
          tops.push(p);
          break;
        }
      }
      for (let k = 4; k <= 22; k++) {
        const p = paperAt(x + dx, y1 + k);
        if (p) {
          bots.push(p);
          break;
        }
      }
    }
    let top = avg(tops);
    let bot = avg(bots);
    if (!top) top = bot;
    if (!bot) bot = top;
    if (!top) continue;
    for (let y = y0; y <= y1; y++) {
      const t = y1 === y0 ? 0 : (y - y0) / (y1 - y0);
      const i = (y * w + x) * 4;
      for (let c = 0; c < 3; c++) data[i + c] = top[c] * (1 - t) + bot[c] * t;
    }
  }
  const blur = Buffer.from(data);
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      let s = [0, 0, 0];
      let n = 0;
      for (let dx = -7; dx <= 7; dx++) {
        const xx = Math.min(x1, Math.max(x0, x + dx));
        const i = (y * w + xx) * 4;
        s[0] += data[i];
        s[1] += data[i + 1];
        s[2] += data[i + 2];
        n++;
      }
      const edge = Math.min(x - x0, x1 - x, y - y0, y1 - y);
      const f = Math.min(1, edge / 5);
      const i = (y * w + x) * 4;
      for (let c = 0; c < 3; c++) {
        const smoothed = s[c] / n;
        blur[i + c] = src[i + c] * (1 - f) + smoothed * f;
      }
    }
  }
  blur.copy(data);
}

function greenPlastic(r, g, b) {
  const lum = (r + g + b) / 3;
  return g + 2 >= r && g > b && lum > 75 && lum < 205 && r > 35;
}

function liftStrokes(data, w, x0, y0, x1, y1) {
  for (let pass = 0; pass < 3; pass++) {
    const src = Buffer.from(data);
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const i = (y * w + x) * 4;
        const lum = (src[i] + src[i + 1] + src[i + 2]) / 3;
        if (lum < 36) continue;
        const colors = [];
        for (let dx = -18; dx <= 18; dx += 2) {
          const nx = x + dx;
          if (nx < x0 || nx > x1) continue;
          const j = (y * w + nx) * 4;
          if (!greenPlastic(src[j], src[j + 1], src[j + 2])) continue;
          colors.push([src[j], src[j + 1], src[j + 2]]);
        }
        if (colors.length < 6) continue;
        colors.sort((p, q) => p[0] + p[1] + p[2] - (q[0] + q[1] + q[2]));
        const ref = colors[Math.floor(colors.length * 0.7)];
        const refLum = (ref[0] + ref[1] + ref[2]) / 3;
        if (lum > refLum - 14 && lum < refLum + 22) continue;
        for (let c = 0; c < 3; c++) data[i + c] = ref[c];
      }
    }
  }
}

function refillBand(data, w, x0, y0, x1, y1, yA, yB) {
  const src = Buffer.from(data);
  for (let x = x0; x <= x1; x++) {
    const ia = (yA * w + x) * 4;
    const ib = (yB * w + x) * 4;
    if (!greenPlastic(src[ia], src[ia + 1], src[ia + 2])) continue;
    if (!greenPlastic(src[ib], src[ib + 1], src[ib + 2])) continue;
    for (let y = y0; y <= y1; y++) {
      const t = (y - yA) / (yB - yA);
      const edge = Math.min(x - x0, x1 - x, y - y0, y1 - y, 16) / 16;
      const i = (y * w + x) * 4;
      for (let c = 0; c < 3; c++) {
        const rebuilt = src[ia + c] * (1 - t) + src[ib + c] * t;
        data[i + c] = Math.round(src[i + c] * (1 - edge) + rebuilt * edge);
      }
    }
  }
}

function clearGhostLine(data, w) {
  const src = Buffer.from(data);
  const x0 = 1584;
  const x1 = 1768;
  const y0 = 718;
  const y1 = 742;
  for (let x = x0; x <= x1; x++) {
    const up = (696 * w + x) * 4;
    if (!greenPlastic(src[up], src[up + 1], src[up + 2])) continue;
    for (let y = y0; y <= y1; y++) {
      const edge = Math.min(x - x0, x1 - x, y - y0, y1 - y, 4) / 4;
      const i = (y * w + x) * 4;
      const shade = 1 - (y - 696) * 0.002;
      for (let c = 0; c < 3; c++) {
        const rebuilt = Math.max(0, src[up + c] * shade);
        data[i + c] = Math.round(src[i + c] * (1 - edge) + rebuilt * edge);
      }
    }
  }
}

function repairOrganicCrown(data, w) {
  const darkAt = (x, y) => {
    if (y < 0 || x < 0) return false;
    const i = (y * w + x) * 4;
    const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
    return lum < 155 && data[i + 1] + 8 >= data[i] && data[i + 1] > 28;
  };
  const missing = [];
  for (let x = 1540; x <= 1605; x++) {
    let top = null;
    for (let y = 1100; y <= 1168; y++) {
      if (darkAt(x, y)) {
        top = y;
        break;
      }
    }
    if (top !== null && top > 1126) missing.push(x);
  }
  if (missing.length < 6) {
    console.log("organic crown gap", missing.length);
    return;
  }
  const gapL = missing[0];
  const gapR = missing[missing.length - 1];
  const samples = [];
  for (let y = 1116; y <= 1140; y++) {
    for (let x = gapL - 14; x <= gapL - 4; x++) {
      if (!darkAt(x, y)) continue;
      const i = (y * w + x) * 4;
      const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
      if (lum < 80) samples.push([data[i], data[i + 1], data[i + 2], lum]);
    }
  }
  if (!samples.length) return;
  samples.sort((a, b) => a[3] - b[3]);
  const ink = samples[Math.min(samples.length - 1, Math.floor(samples.length * 0.35))];
  const midline = 1127;
  for (let x = gapL - 18; x <= gapR + 18; x++) {
    let outer = null;
    let inner = null;
    for (let y = 1164; y >= 1132; y--) {
      if (!darkAt(x, y)) {
        if (outer !== null) break;
        continue;
      }
      if (outer === null) outer = y;
      inner = y;
    }
    if (outer === null) continue;
    const yStart = Math.min(2 * midline - outer, 2 * midline - inner);
    const yEnd = Math.max(2 * midline - outer, 2 * midline - inner);
    for (let y = yStart; y <= yEnd; y++) {
      const i = (y * w + x) * 4;
      const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
      if (lum < 145) continue;
      for (let c = 0; c < 3; c++) data[i + c] = ink[c];
    }
  }
  console.log("organic crown closed", gapL, gapR, "ink", ink.slice(0, 3).map((v) => Math.round(v)).join(","));
  for (let y = 1104; y <= 1156; y += 2) {
    let row = String(y);
    for (let x = 1536; x <= 1608; x += 2) {
      const i = (y * w + x) * 4;
      const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
      row += lum < 150 ? "#" : ".";
    }
    console.log(row);
  }
}

async function main() {
  const mode = process.argv[2] || "preview";
  const { data, info } = await sharp("public/packaging/bottle-packs.webp")
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;

  refillBand(data, w, 1532, 572, 1804, 698, 548, 706);
  clearGhostLine(data, w);
  const capLogo = await makeLogo(206);
  deboss(
    data,
    w,
    h,
    capLogo,
    Math.round(1668 - capLogo.info.width / 2),
    Math.round(632 - capLogo.info.height / 2),
  );

  wipeGradient(data, w, h, 860, 850, 1188, 1012, labelPaper);
  const mid = await makeLogo(252);
  surfacePrint(
    data,
    w,
    h,
    mid,
    Math.round(1033 - mid.info.width / 2),
    Math.round(924 - mid.info.height / 2),
  );

  repairOrganicCrown(data, w);

  if (mode === "write") {
    const tmp = "public/packaging/bottle-packs.webp.stamp-tmp";
    fs.rmSync(tmp, { force: true });
    await sharp(data, { raw: { width: w, height: h, channels: 4 } })
      .webp({ quality: 92, smartSubsample: false, effort: 4 })
      .toFile(tmp);
    console.log("wrote", tmp);
    return;
  }

  const raw = { width: w, height: h, channels: 4 };
  await sharp(data, { raw }).extract({ left: 860, top: 820, width: 460, height: 340 }).jpeg({ quality: 92 }).toFile(path.join(outDir, "touch-mid.jpg"));
  await sharp(data, { raw }).extract({ left: 1520, top: 1088, width: 380, height: 120 }).resize({ width: 760 }).jpeg({ quality: 93 }).toFile(path.join(outDir, "touch-organic.jpg"));
  await sharp(data, { raw }).extract({ left: 1450, top: 500, width: 460, height: 280 }).jpeg({ quality: 92 }).toFile(path.join(outDir, "touch-cap.jpg"));
  const lumAt = (x, y) => {
    const i = (y * w + x) * 4;
    return (data[i] + data[i + 1] + data[i + 2]) / 3;
  };
  console.log("cap edge jump");
  for (const y of [580, 630, 680, 730]) {
    let best = 0;
    let bx = 0;
    for (let x = 1480; x < 1880; x += 2) {
      const g = Math.abs(lumAt(x + 4, y) - lumAt(x - 4, y));
      if (g > best) {
        best = g;
        bx = x;
      }
    }
    console.log(y, "max", Math.round(best), "at", bx, "center", Math.round(lumAt(1668, y)));
  }
  for (let y = 680; y <= 760; y += 2) {
    let row = String(y);
    let marks = 0;
    for (let x = 1560; x <= 1800; x += 3) {
      const here = lumAt(x, y);
      const side = (lumAt(x - 14, y) + lumAt(x + 14, y)) / 2;
      const mark = here < side - 8;
      if (mark) marks++;
      row += mark ? "#" : ".";
    }
    if (marks > 2) console.log(row);
  }
  console.log("preview", mid.info.width, mid.info.height, capLogo.info.width, capLogo.info.height);
}

main();
