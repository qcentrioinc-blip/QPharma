import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const svg = fs.readFileSync("public/brand/vitalcore-logo.svg");
const outDir = "scripts/_pack-fix";
fs.mkdirSync(outDir, { recursive: true });

async function makeLogo(width, angle = 0) {
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
      const nx = (x / lw) - 0.5;
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
      const shade = a - A(x + 1, y + 1);
      const factor = Math.min(1.4, Math.max(0.44, 1 - 0.46 * a + 0.68 * shade));
      const i = (dy * w + dx) * 4;
      for (let c = 0; c < 3; c++) data[i + c] = Math.min(255, Math.max(0, Math.round(data[i + c] * factor)));
    }
  }
}

function place(data, w, h, logo, cx, cy, mode = "print") {
  if (process.argv.includes("clear")) return;
  const ox = Math.round(cx - logo.info.width / 2);
  const oy = Math.round(cy - logo.info.height / 2);
  if (mode === "deboss") deboss(data, w, h, logo, ox, oy);
  else surfacePrint(data, w, h, logo, ox, oy);
}

function medianColor(list) {
  if (!list.length) return null;
  const sorted = list.slice().sort((a, b) => (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2]));
  return sorted[sorted.length >> 1];
}

function clearMarks(data, w, h, x0, y0, x1, y1, isMark, isPaper, dilate = 3) {
  const src = Buffer.from(data);
  const bw = x1 - x0 + 1;
  const mask = new Uint8Array(bw * (y1 - y0 + 1));
  const at = (x, y) => (y - y0) * bw + (x - x0);
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const i = (y * w + x) * 4;
      if (isMark(src[i], src[i + 1], src[i + 2])) mask[at(x, y)] = 1;
    }
  }
  const grown = mask.slice();
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if (!mask[at(x, y)]) continue;
      for (let dy = -dilate; dy <= dilate; dy++) {
        for (let dx = -dilate; dx <= dilate; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < x0 || nx > x1 || ny < y0 || ny > y1) continue;
          grown[at(nx, ny)] = 1;
        }
      }
    }
  }
  const paperAt = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return null;
    if (x >= x0 && x <= x1 && y >= y0 && y <= y1 && grown[at(x, y)]) return null;
    const i = (y * w + x) * 4;
    const lum = (src[i] + src[i + 1] + src[i + 2]) / 3;
    if (lum > 244 || lum < 180) return null;
    if (!isPaper(src[i], src[i + 1], src[i + 2])) return null;
    return [src[i], src[i + 1], src[i + 2]];
  };
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if (!grown[at(x, y)]) continue;
      let up = null;
      let down = null;
      let ud = 1;
      let dd = 1;
      for (let k = 1; k <= 80; k++) {
        if (!up) { const p = paperAt(x, y - k); if (p) { up = p; ud = k; } }
        if (!down) { const p = paperAt(x, y + k); if (p) { down = p; dd = k; } }
        if (up && down) break;
      }
      if (!up || !down) {
        for (let k = 1; k <= 80 && (!up || !down); k++) {
          if (!up) { const p = paperAt(x - k, y); if (p) { up = p; ud = k; } }
          if (!down) { const p = paperAt(x + k, y); if (p) { down = p; dd = k; } }
        }
      }
      if (!up) up = down;
      if (!down) down = up;
      if (!up) continue;
      const wu = dd / (ud + dd);
      const i = (y * w + x) * 4;
      for (let c = 0; c < 3; c++) data[i + c] = Math.round(up[c] * wu + down[c] * (1 - wu));
    }
  }
}

function cream(r, g, b) {
  const lum = (r + g + b) / 3;
  return lum > 208 && r > 185 && r + 10 >= g && r + 16 >= b && Math.abs(r - g) < 30;
}

function labelMark(r, g, b) {
  if (r > 165 && r > g + 22) return false;
  const lum = (r + g + b) / 3;
  if (b > g + 18 && b > r + 28 && lum > 125) return false;
  if (lum < 178) return true;
  return g > r + 14 && g > 70 && r < 170 && lum < 215;
}

function eraseStrokes(data, w, x0, y0, x1, y1) {
  for (let pass = 0; pass < 4; pass++) {
    const src = Buffer.from(data);
    for (let y = y0; y <= y1; y++) {
      for (let x = x0 + 20; x <= x1 - 20; x++) {
        const i = (y * w + x) * 4;
        const r = src[i];
        const g = src[i + 1];
        const b = src[i + 2];
        if (g + 14 < r || g < 16) continue;
        const lum = (r + g + b) / 3;
        let best = null;
        let bestL = -1;
        for (const dx of [-22, -16, -12, 12, 16, 22]) {
          const nx = x + dx;
          if (nx < x0 || nx > x1) continue;
          const j = (y * w + nx) * 4;
          const L = (src[j] + src[j + 1] + src[j + 2]) / 3;
          if (L > bestL) {
            bestL = L;
            best = [src[j], src[j + 1], src[j + 2]];
          }
        }
        if (!best || lum > bestL - 6) continue;
        for (let c = 0; c < 3; c++) data[i + c] = best[c];
      }
    }
  }
}

function smoothBand(data, w, x0, y0, x1, y1, radius) {
  const src = Buffer.from(data);
  for (let y = y0; y <= y1; y++) {
    const edge = Math.min(y - y0, y1 - y);
    const blend = edge < 10 ? edge / 10 : 1;
    for (let x = x0; x <= x1; x++) {
      let rs = 0;
      let gs = 0;
      let bs = 0;
      let n = 0;
      for (let dx = -radius; dx <= radius; dx += 2) {
        const nx = Math.min(x1, Math.max(x0, x + dx));
        const j = (y * w + nx) * 4;
        rs += src[j];
        gs += src[j + 1];
        bs += src[j + 2];
        n++;
      }
      const i = (y * w + x) * 4;
      for (let c = 0; c < 3; c++) {
        const avg = [rs, gs, bs][c] / n;
        data[i + c] = Math.round(src[i + c] * (1 - blend) + avg * blend);
      }
    }
  }
}

function liftEngraving(data, w, x0, y0, x1, y1) {
  const radius = 24;
  for (let pass = 0; pass < 2; pass++) {
    const src = Buffer.from(data);
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const i = (y * w + x) * 4;
        const r = src[i];
        const g = src[i + 1];
        const b = src[i + 2];
        if (g + 12 < r || g < 18) continue;
        const colors = [];
        for (let dx = -radius; dx <= radius; dx += 2) {
          const nx = x + dx;
          if (nx < x0 || nx > x1) continue;
          const j = (y * w + nx) * 4;
          if (src[j + 1] + 12 < src[j]) continue;
          colors.push([src[j], src[j + 1], src[j + 2]]);
        }
        if (colors.length < 8) continue;
        colors.sort((a, b2) => (a[0] + a[1] + a[2]) - (b2[0] + b2[1] + b2[2]));
        const ref = colors[Math.min(colors.length - 1, Math.floor(colors.length * 0.72))];
        const lum = (r + g + b) / 3;
        const refLum = (ref[0] + ref[1] + ref[2]) / 3;
        if (lum > refLum - 8) continue;
        for (let c = 0; c < 3; c++) data[i + c] = ref[c];
      }
    }
  }
}

async function load(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height };
}

async function fixNuetra() {
  const src = "C:/Users/qc_la/.cursor/projects/c-Users-qc-la-OneDrive-Qcentrio-Inc-Desktop-Zephyr/assets/nuetra-regen.jpg";
  const { data, w, h } = await load(src);
  clearMarks(data, w, h, 370, 400, 670, 512, labelMark, cream);
  const logo = await makeLogo(206);
  place(data, w, h, logo, 508, 458);
  return { data, w, h, rel: "public/homepage/nuetra.webp" };
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

function restoreCap(data, w) {
  const yRef = 548;
  const y0 = 556;
  const y1 = 722;
  const x0 = 1472;
  const x1 = 1864;
  const src = Buffer.from(data);
  for (let y = y0; y <= y1; y++) {
    const shade = 1 - ((y - yRef) / 230) * 0.16;
    for (let x = x0; x <= x1; x++) {
      const i = (y * w + x) * 4;
      const r = src[i];
      const g = src[i + 1];
      const b = src[i + 2];
      const lum = (r + g + b) / 3;
      if (lum > 206 && Math.abs(r - g) < 16) continue;
      if (g + 10 < r) continue;
      const s = (yRef * w + x) * 4;
      const sr = src[s];
      const sg = src[s + 1];
      const sb = src[s + 2];
      const sl = (sr + sg + sb) / 3;
      if (sl > 206 || sg + 8 < sr) continue;
      const edge = Math.min(y - y0, 8) / 8;
      for (let c = 0; c < 3; c++) {
        const rebuilt = Math.min(255, Math.max(0, src[s + c] * shade));
        data[i + c] = Math.round(src[i + c] * (1 - edge) + rebuilt * edge);
      }
    }
  }
}

async function fixBottles() {
  const { data, w, h } = await load("public/packaging/bottle-packs.webp");
  const labelPaper = (r, g, b) => {
    const lum = (r + g + b) / 3;
    return lum > 198 && r > 168 && Math.abs(r - g) < 36 && r + 22 >= b && b < r + 40;
  };
  const labels = [
    { box: [250, 870, 590, 1028], cx: 420, cy: 940, width: 250 },
    { box: [900, 850, 1160, 1005], cx: 996, cy: 918, width: 220 },
    { box: [1505, 915, 1835, 1065], cx: 1660, cy: 980, width: 248 },
  ];
  for (const label of labels) {
    wipeGradient(data, w, h, ...label.box, labelPaper);
    const logo = await makeLogo(label.width);
    place(data, w, h, logo, label.cx, label.cy);
  }
  return { data, w, h, rel: "public/packaging/bottle-packs.webp" };
}

async function fixSticks() {
  const { data, w, h } = await load("public/packaging/stick-pack.webp");
  const paper = (r, g, b) => {
    const lum = (r + g + b) / 3;
    return lum > 228 && Math.abs(r - g) < 22 && Math.abs(g - b) < 22;
  };
  const sticks = [
    { cx: 233, cy: 608, angle: 18, width: 176, box: [110, 530, 360, 690] },
    { cx: 512, cy: 524, angle: 12, width: 186, box: [385, 450, 645, 610] },
    { cx: 786, cy: 478, angle: 6, width: 196, box: [650, 400, 930, 565] },
    { cx: 1046, cy: 466, angle: 0, width: 200, box: [900, 385, 1190, 555] },
    { cx: 1310, cy: 480, angle: -8, width: 196, box: [1165, 400, 1460, 575] },
    { cx: 1572, cy: 518, angle: -14, width: 184, box: [1435, 440, 1720, 615] },
    { cx: 1834, cy: 582, angle: -20, width: 170, box: [1685, 500, 1985, 680] },
  ];
  for (const stick of sticks) {
    wipeGradient(data, w, h, ...stick.box, paper);
    const logo = await makeLogo(stick.width, stick.angle);
    place(data, w, h, logo, stick.cx, stick.cy);
  }
  return { data, w, h, rel: "public/packaging/stick-pack.webp" };
}

const mode = process.argv[2] || "preview";
const jobs = [
  ["bottles", fixBottles],
  ["sticks", fixSticks],
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
  nuetra: [[280, 340, 480, 320, "n-logo"], [300, 230, 420, 160, "n-caps"]],
  bottles: [[220, 800, 460, 340, "b-left"], [880, 780, 400, 360, "b-mid"], [1420, 540, 520, 280, "b-cap"], [1460, 860, 460, 340, "b-right"]],
  sticks: [[80, 480, 340, 260, "s-left"], [620, 400, 340, 240, "s-mid"], [1680, 470, 340, 280, "s-right"], [0, 380, 2048, 420, "s-top"]],
};

for (const [name, fn] of jobs) {
  const result = await fn();
  if (mode === "write") {
    const tmp = `${result.rel}.stamp-tmp`;
    fs.rmSync(tmp, { force: true });
    await sharp(result.data, { raw: { width: result.w, height: result.h, channels: 4 } })
      .webp({ quality: 92, smartSubsample: false, effort: 4 })
      .toFile(tmp);
  } else {
    await sharp(result.data, { raw: { width: result.w, height: result.h, channels: 4 } })
      .resize({ width: name === "nuetra" ? 900 : 1100 })
      .jpeg({ quality: 84 })
      .toFile(path.join(outDir, `${name}-off.jpg`));
    for (const [left, top, width, height, cropName] of crops[name]) {
      await sharp(result.data, { raw: { width: result.w, height: result.h, channels: 4 } })
        .extract({ left, top, width, height })
        .jpeg({ quality: 90 })
        .toFile(path.join(outDir, `${cropName}-off.jpg`));
    }
  }
  console.log("ok", name);
}
