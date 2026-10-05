import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const svg = fs.readFileSync("public/brand/vitalcore-logo.svg");
const outDir = "scripts/_pack-fix";
fs.mkdirSync(outDir, { recursive: true });

function orig(rel) {
  const buf = execFileSync("git", ["show", `HEAD:${rel}`], { maxBuffer: 80 * 1024 * 1024 });
  return sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
}

async function makeLogo(width, angle = 0) {
  const trimmed = await sharp(svg, { density: 480 }).trim().png().toBuffer();
  const meta = await sharp(trimmed).metadata();
  const height = Math.max(1, Math.round(width * (meta.height / meta.width)));
  let buf = await sharp(trimmed).resize({ width, height, kernel: "lanczos3" }).png().toBuffer();
  if (angle) buf = await sharp(buf).rotate(angle, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  return sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
}

function blit(data, w, h, logo, ox, oy) {
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
      if (a < 0.05) continue;
      const i = (dy * w + dx) * 4;
      for (let c = 0; c < 3; c++) data[i + c] = Math.round(data[i + c] * (1 - a) + src[s + c] * a);
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
      if (a < 0.06) continue;
      const dx = ox + x;
      if (dx < 0 || dx >= w) continue;
      const shade = a - A(x + 1, y + 1);
      const factor = Math.min(1.38, Math.max(0.46, 1 - 0.42 * a + 0.62 * shade));
      const i = (dy * w + dx) * 4;
      for (let c = 0; c < 3; c++) data[i + c] = Math.min(255, Math.max(0, Math.round(data[i + c] * factor)));
    }
  }
}

function place(data, w, h, logo, cx, cy, mode = "print") {
  const ox = Math.round(cx - logo.info.width / 2);
  const oy = Math.round(cy - logo.info.height / 2);
  if (mode === "deboss") deboss(data, w, h, logo, ox, oy);
  else blit(data, w, h, logo, ox, oy);
}

function tealInk(r, g, b) {
  if (r > 165 && r > g + 28 && r > b + 28) return false;
  if (r < 140 && g > 70 && g < 210 && b > 50 && g > r + 18) return true;
  const lum = (r + g + b) / 3;
  if (lum < 170 && Math.abs(r - g) < 30 && Math.abs(g - b) < 38 && r < 180) return true;
  return false;
}

function clearNearest(data, w, h, x0, y0, x1, y1, test) {
  const mask = new Uint8Array(w * h);
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const i = (y * w + x) * 4;
      if (test(data[i], data[i + 1], data[i + 2])) mask[y * w + x] = 1;
    }
  }
  const grown = mask.slice();
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if (!mask[y * w + x]) continue;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < x0 || nx > x1 || ny < y0 || ny > y1) continue;
          grown[ny * w + nx] = 1;
        }
      }
    }
  }
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if (!grown[y * w + x]) continue;
      let found = null;
      for (let rad = 1; rad <= 18 && !found; rad++) {
        for (let dy = -rad; dy <= rad && !found; dy++) {
          for (let dx = -rad; dx <= rad; dx++) {
            if (Math.max(Math.abs(dx), Math.abs(dy)) !== rad) continue;
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
            if (grown[ny * w + nx]) continue;
            found = (ny * w + nx) * 4;
            break;
          }
        }
      }
      if (!found) continue;
      const i = (y * w + x) * 4;
      data[i] = data[found];
      data[i + 1] = data[found + 1];
      data[i + 2] = data[found + 2];
    }
  }
}

function solidCapsules(data, w, h, x0, y0, x1, y1) {
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const i = (y * w + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const lum = (r + g + b) / 3;
      if (lum > 236) continue;
      const white = lum > 145 && lum < 236 && r > 150 && r + 8 >= g && r + 6 >= b && Math.abs(r - g) < 36;
      const teal = g > r + 10 && b + 8 > r && g > 35 && lum > 18 && lum < 210;
      if (!white && !teal) continue;
      const t = Math.max(0.22, Math.min(1.05, lum / 168));
      data[i] = Math.min(255, Math.round(36 * t));
      data[i + 1] = Math.min(255, Math.round(154 * t));
      data[i + 2] = Math.min(255, Math.round(162 * t));
    }
  }
}

async function sharpenWindow(data, w, h, x0, y0, x1, y1) {
  const width = x1 - x0 + 1;
  const height = y1 - y0 + 1;
  const raw = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = ((y0 + y) * w + (x0 + x)) * 4;
      const o = (y * width + x) * 4;
      raw[o] = data[i];
      raw[o + 1] = data[i + 1];
      raw[o + 2] = data[i + 2];
      raw[o + 3] = 255;
    }
  }
  const sharpBuf = await sharp(raw, { raw: { width, height, channels: 4 } })
    .sharpen({ sigma: 0.7, m1: 0.6, m2: 0.3 })
    .raw()
    .toBuffer();
  for (let y = 2; y < height - 2; y++) {
    for (let x = 2; x < width - 2; x++) {
      const i = ((y0 + y) * w + (x0 + x)) * 4;
      const o = (y * width + x) * 4;
      data[i] = sharpBuf[o];
      data[i + 1] = sharpBuf[o + 1];
      data[i + 2] = sharpBuf[o + 2];
    }
  }
}

function isCapGreen(r, g, b) {
  const lum = (r + g + b) / 3;
  return lum > 50 && lum < 210 && g + 12 >= r && g + 12 >= b && g > 55;
}

function capEdges(data, w, y, x0, x1) {
  let left = null;
  let right = null;
  for (let x = x0; x <= x1; x++) {
    const i = (y * w + x) * 4;
    if (!isCapGreen(data[i], data[i + 1], data[i + 2])) continue;
    if (left == null) left = x;
    right = x;
  }
  return { left, right };
}

function brightEdge(data, w, y, from, to) {
  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;
  for (let x = from; x <= to; x++) {
    const i = (y * w + x) * 4;
    const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
    if (lum < 100) continue;
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    n++;
  }
  if (n < 3) return null;
  return [r / n, g / n, b / n];
}

function paintRow(data, w, y, left, right, xA, xB, a, b) {
  for (let x = xA; x <= xB; x++) {
    const t = (x - left) / Math.max(1, right - left);
    const dist = Math.min(x - xA, xB - x, 8) / 8;
    const i = (y * w + x) * 4;
    for (let c = 0; c < 3; c++) {
      const val = a[c] * (1 - t) + b[c] * t;
      data[i + c] = Math.round(data[i + c] * (1 - dist) + val * dist);
    }
  }
}

function clearOrganicCap(data, w, h) {
  const x0 = 1490;
  const x1 = 1840;
  for (let y = 448; y <= 528; y++) {
    const { left, right } = capEdges(data, w, y, x0, x1);
    if (left == null || right - left < 50) continue;
    const a = brightEdge(data, w, y, left + 4, left + 26);
    const b = brightEdge(data, w, y, right - 26, right - 4);
    if (!a || !b) continue;
    paintRow(data, w, y, left, right, left + 18, right - 18, a, b);
  }
  for (let y = 540; y <= 730; y++) {
    const { left, right } = capEdges(data, w, y, x0, x1);
    if (left == null || right - left < 70) continue;
    const a = brightEdge(data, w, y, left + 6, left + 34);
    const b = brightEdge(data, w, y, right - 34, right - 6);
    if (!a || !b) continue;
    const gate = Math.min((a[0] + a[1] + a[2]) / 3, (b[0] + b[1] + b[2]) / 3) - 18;
    const xA = left + 10;
    const xB = right - 10;
    for (let x = xA; x <= xB; x++) {
      const i = (y * w + x) * 4;
      const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
      if (lum > gate) continue;
      const t = (x - left) / Math.max(1, right - left);
      data[i] = Math.round(a[0] * (1 - t) + b[0] * t);
      data[i + 1] = Math.round(a[1] * (1 - t) + b[1] * t);
      data[i + 2] = Math.round(a[2] * (1 - t) + b[2] * t);
    }
  }
}

async function fixNuetra() {
  const { data, info } = await orig("public/homepage/nuetra.webp");
  const w = info.width;
  const h = info.height;
  clearNearest(data, w, h, 340, 290, 720, 430, tealInk);
  solidCapsules(data, w, h, 360, 248, 690, 372);
  solidCapsules(data, w, h, 360, 825, 700, 905);
  await sharpenWindow(data, w, h, 360, 248, 690, 372);
  await sharpenWindow(data, w, h, 360, 825, 700, 905);
  clearNearest(data, w, h, 360, 385, 700, 515, tealInk);
  const logo = await makeLogo(268);
  place(data, w, h, logo, 528, 458);
  return { data, w, h, rel: "public/homepage/nuetra.webp" };
}

async function fixBottles() {
  const { data, info } = await orig("public/packaging/bottle-packs.webp");
  const w = info.width;
  const h = info.height;
  const labels = [
    { box: [210, 850, 640, 1048], cx: 405, cy: 952, width: 320 },
    { box: [840, 820, 1230, 1040], cx: 1020, cy: 930, width: 330 },
    { box: [1488, 910, 1840, 1088], cx: 1655, cy: 990, width: 320 },
  ];
  for (const label of labels) {
    clearNearest(data, w, h, ...label.box, tealInk);
    const logo = await makeLogo(label.width);
    place(data, w, h, logo, label.cx, label.cy);
  }
  clearOrganicCap(data, w, h);
  const capLogo = await makeLogo(248);
  place(data, w, h, capLogo, 1654, 630, "deboss");
  return { data, w, h, rel: "public/packaging/bottle-packs.webp" };
}

function stickInk(r, g, b) {
  const lum = (r + g + b) / 3;
  if (lum > 228) return false;
  if (g > r + 16 && g > 60 && r < 190 && g < 210 && b > r - 5) return true;
  if (lum < 175 && Math.abs(r - g) < 18 && Math.abs(g - b) < 22) return true;
  return false;
}

async function fixSticks() {
  const { data, info } = await orig("public/packaging/stick-pack.webp");
  const w = info.width;
  const h = info.height;
  const sticks = [
    { cx: 148, cy: 548, angle: 16, width: 168, box: [20, 430, 280, 680] },
    { cx: 430, cy: 470, angle: 11, width: 186, box: [300, 340, 580, 640] },
    { cx: 725, cy: 430, angle: 5, width: 198, box: [590, 300, 880, 620] },
    { cx: 1008, cy: 410, angle: 0, width: 206, box: [880, 280, 1160, 600] },
    { cx: 1290, cy: 430, angle: -6, width: 198, box: [1140, 290, 1460, 630] },
    { cx: 1565, cy: 470, angle: -12, width: 186, box: [1420, 320, 1740, 680] },
    { cx: 1835, cy: 530, angle: -16, width: 172, box: [1680, 360, 2020, 720] },
  ];
  for (const stick of sticks) {
    clearNearest(data, w, h, ...stick.box, stickInk);
    const logo = await makeLogo(stick.width, stick.angle);
    place(data, w, h, logo, stick.cx, stick.cy);
  }
  return { data, w, h, rel: "public/packaging/stick-pack.webp" };
}

const mode = process.argv[2] || "preview";
const jobs = [
  ["nuetra", fixNuetra],
  ["bottle-packs", fixBottles],
  ["stick-pack", fixSticks],
];

if (mode === "swap") {
  for (const rel of [
    "public/homepage/nuetra.webp",
    "public/packaging/bottle-packs.webp",
    "public/packaging/stick-pack.webp",
  ]) {
    const tmp = `${rel}.stamp-tmp`;
    const aside = `${rel}.replaced`;
    if (!fs.existsSync(tmp)) continue;
    if (fs.existsSync(aside)) fs.rmSync(aside, { force: true });
    fs.renameSync(rel, aside);
    fs.renameSync(tmp, rel);
    try { fs.rmSync(aside, { force: true }); } catch { console.log("kept aside", aside); }
    console.log("swapped", rel);
  }
  process.exit(0);
}

const crops = {
  nuetra: [[300, 230, 440, 280, "n-top"], [320, 780, 400, 160, "n-bot"], [340, 370, 400, 200, "n-logo"]],
  "bottle-packs": [[1480, 430, 420, 320, "b-cap"], [180, 840, 500, 280, "b-left"], [820, 820, 500, 300, "b-mid"], [1460, 880, 480, 280, "b-right"]],
  "stick-pack": [[0, 250, 2048, 560, "s-top"]],
};

for (const [name, fn] of jobs) {
  const result = await fn();
  if (mode === "write") {
    const tmp = `${result.rel}.stamp-tmp`;
    fs.rmSync(tmp, { force: true });
    await sharp(result.data, { raw: { width: result.w, height: result.h, channels: 4 } })
      .webp({ quality: 92, smartSubsample: false, effort: 4 })
      .toFile(tmp);
    console.log("wrote", tmp);
  } else {
    await sharp(result.data, { raw: { width: result.w, height: result.h, channels: 4 } })
      .resize({ width: 900 })
      .jpeg({ quality: 84 })
      .toFile(path.join(outDir, `${name}-new.jpg`));
    for (const [left, top, width, height, cropName] of crops[name]) {
      await sharp(result.data, { raw: { width: result.w, height: result.h, channels: 4 } })
        .extract({ left, top, width, height })
        .jpeg({ quality: 90 })
        .toFile(path.join(outDir, `${cropName}-new.jpg`));
    }
  }
  console.log("ok", name);
}
