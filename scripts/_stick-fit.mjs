import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const svg = fs.readFileSync("public/brand/vitalcore-logo.svg");
const outDir = "scripts/_pack-fix";
fs.mkdirSync(outDir, { recursive: true });

const bins = [
  [80, 380, 540, 690],
  [380, 660, 460, 600],
  [660, 930, 410, 560],
  [930, 1180, 390, 550],
  [1180, 1460, 400, 560],
  [1460, 1720, 440, 620],
  [1720, 2000, 500, 700],
];

function isInk(r, g, b) {
  const lum = (r + g + b) / 3;
  if (lum > 220 || r > 170) return false;
  return g > r + 12 && g > 55 && g + 18 >= b && b + 30 > r;
}

function isPaper(r, g, b) {
  const lum = (r + g + b) / 3;
  return lum > 228 && Math.abs(r - g) < 16 && Math.abs(g - b) < 16;
}

async function makeLogo(width, angle) {
  const trimmed = await sharp(svg, { density: 520 }).trim().png().toBuffer();
  const meta = await sharp(trimmed).metadata();
  const height = Math.max(1, Math.round(width * (meta.height / meta.width)));
  let buf = await sharp(trimmed).resize({ width, height, kernel: "lanczos3" }).png().toBuffer();
  if (angle) {
    buf = await sharp(buf).rotate(angle, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  }
  return sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
}

function surfacePrint(data, w, h, logo, ox, oy) {
  const src = logo.data;
  const lw = logo.info.width;
  const lh = logo.info.height;
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
      const gain = Math.min(1.05, Math.max(0.82, lum / 248));
      for (let c = 0; c < 3; c++) {
        const ink = Math.min(255, src[s + c] * gain);
        data[i + c] = Math.round(data[i + c] * (1 - a) + ink * a);
      }
    }
  }
}

function cluster(data, w, box) {
  const [x0, x1, y0, y1] = box;
  let n = 0;
  let sx = 0;
  let sy = 0;
  let minx = 1e9;
  let maxx = 0;
  let miny = 1e9;
  let maxy = 0;
  const pts = [];
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const i = (y * w + x) * 4;
      if (!isInk(data[i], data[i + 1], data[i + 2])) continue;
      pts.push([x, y]);
      n++;
      sx += x;
      sy += y;
      if (x < minx) minx = x;
      if (x > maxx) maxx = x;
      if (y < miny) miny = y;
      if (y > maxy) maxy = y;
    }
  }
  if (n < 200) return null;
  const word = pts.filter((p) => p[1] < miny + (maxy - miny) * 0.62);
  let cx = sx / n;
  let cy = sy / n;
  let sxx = 0;
  let syy = 0;
  let sxy = 0;
  const basis = word.length > 80 ? word : pts;
  const bx = basis.reduce((s, p) => s + p[0], 0) / basis.length;
  const by = basis.reduce((s, p) => s + p[1], 0) / basis.length;
  for (const [x, y] of basis) {
    const dx = x - bx;
    const dy = y - by;
    sxx += dx * dx;
    syy += dy * dy;
    sxy += dx * dy;
  }
  const angle = (0.5 * Math.atan2(2 * sxy, sxx - syy) * 180) / Math.PI;
  return { cx, cy, minx, maxx, miny, maxy, bw: maxx - minx, angle, n };
}

function erase(data, w, h, mark) {
  const ang = (mark.angle * Math.PI) / 180;
  const axisX = Math.cos(ang);
  const axisY = Math.sin(ang);
  const perpX = -axisY;
  const perpY = axisX;
  const cx = mark.cx;
  const cy = mark.cy;
  let maxU = mark.bw / 2;
  let maxV = (mark.maxy - mark.miny) / 2;
  const scanX0 = Math.max(0, mark.minx - 30);
  const scanX1 = Math.min(w - 1, mark.maxx + 30);
  const scanY0 = Math.max(0, mark.miny - 24);
  const scanY1 = Math.min(h - 1, mark.maxy + 24);
  for (let y = scanY0; y <= scanY1; y++) {
    for (let x = scanX0; x <= scanX1; x++) {
      const i = (y * w + x) * 4;
      if (!isInk(data[i], data[i + 1], data[i + 2])) continue;
      const dx = x - cx;
      const dy = y - cy;
      const u = dx * axisX + dy * axisY;
      const v = dx * perpX + dy * perpY;
      maxU = Math.max(maxU, Math.abs(u));
      maxV = Math.max(maxV, Math.abs(v));
    }
  }
  const hw = maxU + 16;
  const hh = maxV + 14;
  const reach = Math.ceil(Math.hypot(hw, hh) + 4);
  const x0 = Math.max(1, Math.floor(cx - reach));
  const x1 = Math.min(w - 2, Math.ceil(cx + reach));
  const y0 = Math.max(1, Math.floor(cy - reach));
  const y1 = Math.min(h - 2, Math.ceil(cy + reach));
  const local = (x, y) => {
    const dx = x - cx;
    const dy = y - cy;
    return { u: dx * axisX + dy * axisY, v: dx * perpX + dy * perpY };
  };
  const outsidePaper = (x, y) => {
    const nx = Math.round(x);
    const ny = Math.round(y);
    if (nx < 1 || ny < 1 || nx >= w - 1 || ny >= h - 1) return null;
    const { u, v } = local(nx, ny);
    if (Math.abs(u) <= hw && Math.abs(v) <= hh) return null;
    const i = (ny * w + nx) * 4;
    if (!isPaper(data[i], data[i + 1], data[i + 2])) return null;
    return [data[i], data[i + 1], data[i + 2]];
  };

  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const { u, v } = local(x, y);
      const eu = hw - Math.abs(u);
      const ev = hh - Math.abs(v);
      if (eu < 0 || ev < 0) continue;
      let above = null;
      let below = null;
      for (let k = 2; k <= 180 && (!above || !below); k++) {
        if (!above) above = outsidePaper(x - perpX * k, y - perpY * k);
        if (!below) below = outsidePaper(x + perpX * k, y + perpY * k);
      }
      if (!above) above = below;
      if (!below) below = above;
      if (!above) continue;
      const t = Math.min(1, Math.max(0, (v + hh) / (2 * hh)));
      const f = Math.min(1, Math.min(eu, ev) / 12);
      const i = (y * w + x) * 4;
      for (let c = 0; c < 3; c++) {
        const filled = above[c] * (1 - t) + below[c] * t;
        data[i + c] = Math.round(data[i + c] * (1 - f) + filled * f);
      }
    }
  }
}

const srcPath = "scripts/_pack-fix/stick-git.webp";
const { data, info } = await sharp(srcPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const w = info.width;
const h = info.height;
const marks = bins.map((box) => cluster(data, w, box)).filter(Boolean);
console.log(marks.map((m) => ({
  cx: Math.round(m.cx),
  cy: Math.round(m.cy),
  bw: m.bw,
  angle: Math.round(m.angle * 10) / 10,
})));

for (const mark of marks) erase(data, w, h, mark);

if (process.argv.includes("clean-only")) {
  await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .extract({ left: 0, top: 360, width: 2048, height: 420 })
    .jpeg({ quality: 90 })
    .toFile(path.join(outDir, "stick-clean.jpg"));
  console.log("clean preview");
  process.exit(0);
}

function walkPaper(data, w, h, x, y, dx, dy, stopAtRidge) {
  let n = 0;
  for (let k = 1; k < 420; k++) {
    const nx = Math.round(x + dx * k);
    const ny = Math.round(y + dy * k);
    if (nx < 2 || ny < 3 || nx >= w - 2 || ny >= h - 3) break;
    const i = (ny * w + nx) * 4;
    if (!isPaper(data[i], data[i + 1], data[i + 2])) break;
    if (stopAtRidge) {
      let min = 255;
      let max = 0;
      for (let dy2 = -3; dy2 <= 3; dy2++) {
        const j = ((ny + dy2) * w + nx) * 4;
        const lum = (data[j] + data[j + 1] + data[j + 2]) / 3;
        if (lum < min) min = lum;
        if (lum > max) max = lum;
      }
      if (max - min > 16 || min < 236) break;
    }
    n = k;
  }
  return n;
}

for (const mark of marks) {
  const ang = (mark.angle * Math.PI) / 180;
  const axisX = Math.cos(ang);
  const axisY = Math.sin(ang);
  const perpX = -axisY;
  const perpY = axisX;
  const towardText = walkPaper(data, w, h, mark.cx, mark.cy, perpX, perpY, false);
  const towardCrimp = walkPaper(data, w, h, mark.cx, mark.cy, -perpX, -perpY, false);
  const up = Math.max(36, towardCrimp - 86);
  const down = Math.max(36, towardText - 16);
  const along = up + down;
  const width = Math.round(Math.min(230, along * 0.9));
  const logoAngle = mark.angle + 90;
  const logo = await makeLogo(width, logoAngle);
  const shift = (down - up) / 2;
  const px = mark.cx + perpX * shift;
  const py = mark.cy + perpY * shift;
  const ox = Math.round(px - logo.info.width / 2);
  const oy = Math.round(py - logo.info.height / 2);
  surfacePrint(data, w, h, logo, ox, oy);
  console.log("placed", {
    width,
    angle: Math.round(logoAngle * 10) / 10,
    along,
    towardText,
    towardCrimp,
    ox,
    oy,
    lw: logo.info.width,
    lh: logo.info.height,
  });
}

await sharp(data, { raw: { width: w, height: h, channels: 4 } })
  .resize({ width: 1400 })
  .jpeg({ quality: 86 })
  .toFile(path.join(outDir, "stick-fit.jpg"));

for (const [i, mark] of marks.entries()) {
  const left = Math.max(0, Math.round(mark.minx - 40));
  const top = Math.max(0, Math.round(mark.miny - 30));
  const width = Math.min(w - left, mark.bw + 80);
  const height = Math.min(h - top, mark.maxy - mark.miny + 70);
  await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .extract({ left, top, width, height })
    .jpeg({ quality: 92 })
    .toFile(path.join(outDir, `stick-fit-${i}.jpg`));
}

if (process.argv.includes("write")) {
  const tmp = "public/packaging/stick-pack.webp.stamp-tmp";
  fs.rmSync(tmp, { force: true });
  await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .webp({ quality: 92, smartSubsample: false, effort: 4 })
    .toFile(tmp);
  console.log("wrote", tmp);
}

console.log("preview ready");
