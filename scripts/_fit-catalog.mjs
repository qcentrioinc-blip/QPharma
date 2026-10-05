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
  const mean = n ? sum / n : 210;
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
      const gain = Math.min(1.08, Math.max(0.78, lum / mean));
      for (let c = 0; c < 3; c++) {
        const ink = Math.min(255, src[s + c] * gain);
        data[i + c] = Math.round(data[i + c] * (1 - a) + ink * a);
      }
    }
  }
}

function wipe(data, w, h, x0, y0, x1, y1, isPaper, isInk) {
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
    for (let dx = -4; dx <= 4; dx += 2) {
      for (let k = 3; k <= 26; k++) {
        const p = paperAt(x + dx, y0 - k);
        if (p) {
          tops.push(p);
          break;
        }
      }
      for (let k = 3; k <= 20; k++) {
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
      const t = (y - y0) / Math.max(1, y1 - y0);
      const i = (y * w + x) * 4;
      const r = src[i];
      const g = src[i + 1];
      const b = src[i + 2];
      const lum = (r + g + b) / 3;
      const ink = isInk
        ? isInk(r, g, b)
        : g > r + 10 && r < 180 && lum < 210 && lum > 25;
      if (!isPaper(r, g, b) && !ink) continue;
      for (let c = 0; c < 3; c++) data[i + c] = top[c] * (1 - t) + bot[c] * t;
    }
  }
  const blur = Buffer.from(data);
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      let s = [0, 0, 0];
      let n = 0;
      for (let dx = -6; dx <= 6; dx++) {
        const xx = Math.min(x1, Math.max(x0, x + dx));
        const i = (y * w + xx) * 4;
        s[0] += data[i];
        s[1] += data[i + 1];
        s[2] += data[i + 2];
        n++;
      }
      const i = (y * w + x) * 4;
      const r = src[i];
      const g = src[i + 1];
      const b = src[i + 2];
      const lum = (r + g + b) / 3;
      const ink = isInk
        ? isInk(r, g, b)
        : g > r + 10 && r < 180 && lum < 210 && lum > 25;
      if (!isPaper(r, g, b) && !ink) continue;
      const edge = Math.min(x - x0, x1 - x, y - y0, y1 - y);
      const f = Math.min(1, edge / 4);
      for (let c = 0; c < 3; c++) blur[i + c] = src[i + c] * (1 - f) + (s[c] / n) * f;
    }
  }
  blur.copy(data);
}

const paper = (r, g, b) => {
  const lum = (r + g + b) / 3;
  return lum > 178 && r > 155 && Math.abs(r - g) < 42 && b > 140 && g < r + 28;
};

const jobs = [
  {
    name: "cal",
    file: "public/product-images/Nutraceutical/Bone Health/Calcium + Vitamin K2 7.webp",
    box: [340, 415, 530, 512],
    cx: 434,
    cy: 462,
    width: 196,
    crop: [250, 380, 400, 280],
  },
  {
    name: "hes",
    file: "public/product-images/Nutraceutical/Respiratory Health/Hesperidin + Ellagic Acid + Elderberry Extract + Grapeseed Extract + Zinc.webp",
    box: [300, 390, 570, 545],
    cx: 440,
    cy: 448,
    width: 200,
    crop: [250, 340, 380, 240],
  },
  {
    name: "gin",
    file: "public/product-images/Herbaceutical/Immunity booster/American Ginseng + Kalmegh + Echinacea Root + Spirulina.webp",
    box: [250, 395, 640, 540],
    cx: 430,
    cy: 462,
    width: 230,
    crop: [220, 360, 460, 260],
  },
  {
    name: "cis",
    file: "public/product-images/Herbaceutical/Joint care/Cissus Quadrangularis + Boswellia Serrata + Piperine + Hadjod.webp",
    box: [250, 440, 640, 565],
    cx: 418,
    cy: 498,
    width: 200,
    crop: [220, 400, 460, 280],
  },
  {
    name: "tea",
    file: "public/product-images/Herbaceutical/Weight management/Green Tea + Garcinia Cambogia + Chitosan.webp",
    box: [250, 400, 660, 560],
    cx: 436,
    cy: 474,
    width: 220,
    crop: [230, 370, 440, 280],
  },
];

const mode = process.argv[2] || "preview";

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
      const factor = Math.min(1.35, Math.max(0.42, 1 - 0.5 * a + 0.7 * shade));
      const i = (dy * w + dx) * 4;
      for (let c = 0; c < 3; c++) data[i + c] = Math.min(255, Math.max(0, Math.round(data[i + c] * factor)));
    }
  }
}

function lift(data, w, x0, y0, x1, y1, isStroke, isCap) {
  const src = Buffer.from(data);
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const i = (y * w + x) * 4;
      if (!isStroke(src[i], src[i + 1], src[i + 2])) continue;
      let m = [0, 0, 0];
      let n = 0;
      for (let dy = -16; dy <= 16; dy += 8) {
        for (let dx = -16; dx <= 16; dx += 8) {
          if (Math.abs(dx) + Math.abs(dy) < 12) continue;
          const xx = x + dx;
          const yy = y + dy;
          if (xx < 1 || yy < 1 || xx >= w - 1) continue;
          const j = (yy * w + xx) * 4;
          if (!isCap(src[j], src[j + 1], src[j + 2])) continue;
          m[0] += src[j];
          m[1] += src[j + 1];
          m[2] += src[j + 2];
          n++;
        }
      }
      if (n < 3) continue;
      for (let c = 0; c < 3; c++) data[i + c] = m[c] / n;
    }
  }
}

const caps = [
  {
    name: "kal",
    file: "public/product-images/Organic/Kalmegh/Shatavari + Black Sesame Seed + Liquorice Root + Musta.v34.webp",
    kind: "print",
    box: [650, 460, 1210, 770],
    cx: 920,
    cy: 600,
    width: 430,
    crop: [520, 280, 780, 620],
    paper: (r, g, b) => {
      const lum = (r + g + b) / 3;
      return lum > 175 && r > g && r - g < 48 && g >= b - 6 && r - b < 70;
    },
    ink: () => true,
  },
  {
    name: "cur",
    file: "public/product-images/Organic/Curcuma Longa/Gingko Biloba + Bacopa Monnieri + Shankhpushpi.webp",
    kind: "deboss",
    box: [640, 380, 1120, 640],
    cx: 870,
    cy: 500,
    width: 360,
    crop: [520, 250, 760, 520],
    stroke: (r, g, b) => (r + g + b) / 3 < 58 && g > 20,
    cap: (r, g, b) => {
      const lum = (r + g + b) / 3;
      return g > r && lum > 55 && lum < 170;
    },
  },
  {
    name: "liv",
    file: "public/product-images/Organic/Liverwort/Rosehip Powder + Ginger + Curcumin + Maca Root.webp",
    kind: "deboss",
    box: [560, 500, 1200, 740],
    top: [600, 320, 1160, 490],
    cx: 880,
    cy: 615,
    width: 400,
    crop: [480, 220, 820, 620],
    stroke: (r, g, b) => (r + g + b) / 3 < 100 && r > 40 && r < 190,
    cap: (r, g, b) => {
      const lum = (r + g + b) / 3;
      return r > g + 8 && lum > 120 && lum < 210;
    },
  },
  {
    name: "gym",
    file: "public/product-images/Organic/Gymnema Sylvestre/Shilajit + Ashwagandha Root + Ginseng.webp",
    kind: "silver",
    box: [620, 340, 1220, 680],
    cx: 910,
    cy: 490,
    width: 400,
    crop: [520, 250, 760, 520],
  },
];

function silverPrint(data, w, h, logo, ox, oy) {
  const src = logo.data;
  const lw = logo.info.width;
  const lh = logo.info.height;
  for (let y = 0; y < lh; y++) {
    const dy = oy + y;
    if (dy < 0 || dy >= h) continue;
    for (let x = 0; x < lw; x++) {
      const dx = ox + x;
      if (dx < 0 || dx >= w) continue;
      const a = src[(y * lw + x) * 4 + 3] / 255;
      if (a < 0.05) continue;
      const i = (dy * w + dx) * 4;
      const nx = (x / lw) - 0.5;
      const light = 168 * (1 - nx * nx * 0.25) * Math.min(1, a * 1.15);
      for (let c = 0; c < 3; c++) {
        data[i + c] = Math.round(data[i + c] * (1 - a) + light * a);
      }
    }
  }
}

if (mode === "swap") {
  for (const job of [...jobs, ...caps]) {
    const tmp = `${job.file}.stamp-tmp`;
    const aside = `${job.file}.replaced`;
    if (!fs.existsSync(tmp)) continue;
    if (fs.existsSync(aside)) fs.rmSync(aside, { force: true });
    fs.renameSync(job.file, aside);
    fs.renameSync(tmp, job.file);
    try { fs.rmSync(aside, { force: true }); } catch { console.log("kept aside", aside); }
    console.log("swapped", job.file);
  }
  process.exit(0);
}

for (const job of jobs) {
  const img = await sharp(job.file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const data = Buffer.from(img.data);
  const w = img.info.width;
  const h = img.info.height;
  wipe(data, w, h, ...job.box, paper);
  if (!process.argv.includes("clear")) {
    const logo = await makeLogo(job.width);
    const ox = Math.round(job.cx - logo.info.width / 2);
    const oy = Math.round(job.cy - logo.info.height / 2);
    surfacePrint(data, w, h, logo, ox, oy);
  }
  if (mode === "write") {
    const tmp = `${job.file}.stamp-tmp`;
    fs.rmSync(tmp, { force: true });
    await sharp(data, { raw: { width: w, height: h, channels: 4 } })
      .webp({ quality: 90, smartSubsample: false, effort: 4 })
      .toFile(tmp);
  } else {
    const [l, t, cw, ch] = job.crop;
    await sharp(data, { raw: { width: w, height: h, channels: 4 } })
      .extract({ left: l, top: t, width: cw, height: ch })
      .jpeg({ quality: 88 })
      .toFile(path.join(outDir, `fit-${job.name}.jpg`));
  }
  console.log("ok", job.name);
}

for (const job of caps.filter(() => false)) {
  const img = await sharp(job.file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const data = Buffer.from(img.data);
  const w = img.info.width;
  const h = img.info.height;
  if (job.kind === "print") {
    wipe(data, w, h, ...job.box, job.paper, job.ink);
  } else if (job.kind === "deboss") {
    if (job.top) lift(data, w, ...job.top, job.stroke, job.cap);
    lift(data, w, ...job.box, job.stroke, job.cap);
  } else {
    const src = Buffer.from(data);
    const [x0, y0, x1, y1] = job.box;
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const i = (y * w + x) * 4;
        const lum = (src[i] + src[i + 1] + src[i + 2]) / 3;
        if (lum < 90) continue;
        const samples = [];
        for (const [dx, dy] of [[-20, 0], [20, 0], [0, -20], [0, 20], [-28, 12], [28, 12]]) {
          const xx = x + dx;
          const yy = y + dy;
          if (xx < 1 || yy < 1 || xx >= w - 1 || yy >= h - 1) continue;
          const j = (yy * w + xx) * 4;
          const sl = (src[j] + src[j + 1] + src[j + 2]) / 3;
          if (sl < 50) samples.push([src[j], src[j + 1], src[j + 2]]);
        }
        if (!samples.length) continue;
        for (let c = 0; c < 3; c++) data[i + c] = samples[0][c];
      }
    }
  }
  if (!process.argv.includes("clear")) {
    const logo = await makeLogo(job.width);
    const ox = Math.round(job.cx - logo.info.width / 2);
    const oy = Math.round(job.cy - logo.info.height / 2);
    if (job.kind === "deboss") deboss(data, w, h, logo, ox, oy);
    else if (job.kind === "silver") silverPrint(data, w, h, logo, ox, oy);
    else surfacePrint(data, w, h, logo, ox, oy);
  }
  if (mode === "write") {
    const tmp = `${job.file}.stamp-tmp`;
    fs.rmSync(tmp, { force: true });
    await sharp(data, { raw: { width: w, height: h, channels: 4 } })
      .webp({ quality: 90, smartSubsample: false, effort: 4 })
      .toFile(tmp);
  } else {
    const [l, t, cw, ch] = job.crop;
    await sharp(data, { raw: { width: w, height: h, channels: 4 } })
      .extract({ left: l, top: t, width: cw, height: ch })
      .resize({ width: 640 })
      .jpeg({ quality: 86 })
      .toFile(path.join(outDir, `fit-${job.name}.jpg`));
  }
  console.log("ok", job.name);
}
