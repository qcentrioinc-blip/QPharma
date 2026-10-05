import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const svg = fs.readFileSync("public/brand/vitalcore-logo.svg");
const outDir = "scripts/_pack-fix";
fs.mkdirSync(outDir, { recursive: true });

async function makeLogo(width, angle = 0) {
  const trimmed = await sharp(svg, { density: 480 }).trim().png().toBuffer();
  const meta = await sharp(trimmed).metadata();
  const height = Math.max(1, Math.round(width * (meta.height / meta.width)));
  let buf = await sharp(trimmed).resize({ width, height, kernel: "lanczos3" }).png().toBuffer();
  if (angle) {
    buf = await sharp(buf).rotate(angle, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  }
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

function engrave(data, w, h, logo, ox, oy, strength) {
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
      if (a < 0.08) continue;
      const i = (dy * w + dx) * 4;
      const cut = Math.min(0.72, a * strength);
      for (let c = 0; c < 3; c++) data[i + c] = Math.round(data[i + c] * (1 - cut));
    }
  }
}

function dilate(mask, w, h, x0, y0, x1, y1, rad) {
  const next = mask.slice();
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if (!mask[y * w + x]) continue;
      for (let dy = -rad; dy <= rad; dy++) {
        for (let dx = -rad; dx <= rad; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < x0 || nx > x1 || ny < y0 || ny > y1) continue;
          next[ny * w + nx] = 1;
        }
      }
    }
  }
  return next;
}

function clearInk(data, w, h, x0, y0, x1, y1, test, rad = 1) {
  x0 = Math.max(1, x0);
  y0 = Math.max(1, y0);
  x1 = Math.min(w - 2, x1);
  y1 = Math.min(h - 2, y1);
  let mask = new Uint8Array(w * h);
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const i = (y * w + x) * 4;
      if (test(data[i], data[i + 1], data[i + 2])) mask[y * w + x] = 1;
    }
  }
  if (rad) mask = dilate(mask, w, h, x0, y0, x1, y1, rad);
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if (!mask[y * w + x]) continue;
      let lx = x - 1;
      let rx = x + 1;
      while (lx >= x0 && mask[y * w + lx]) lx--;
      while (rx <= x1 && mask[y * w + rx]) rx++;
      const i = (y * w + x) * 4;
      const pick = (px) => {
        const p = (y * w + Math.max(x0, Math.min(x1, px))) * 4;
        return [data[p], data[p + 1], data[p + 2]];
      };
      const leftOk = lx >= x0 && !mask[y * w + lx];
      const rightOk = rx <= x1 && !mask[y * w + rx];
      let col;
      if (leftOk && rightOk) {
        const a = pick(lx);
        const b = pick(rx);
        const t = (x - lx) / Math.max(1, rx - lx);
        col = a.map((v, k) => Math.round(v * (1 - t) + b[k] * t));
      } else if (leftOk) col = pick(lx);
      else if (rightOk) col = pick(rx);
      else {
        const above = Math.max(0, y0 - 2);
        const p = (above * w + x) * 4;
        col = [data[p], data[p + 1], data[p + 2]];
      }
      data[i] = col[0];
      data[i + 1] = col[1];
      data[i + 2] = col[2];
    }
  }
}

function tealInk(r, g, b) {
  if (r > 165 && r > g + 28 && r > b + 28) return false;
  if (r < 125 && g > 65 && g < 200 && b > 45 && g > r + 22) return true;
  const lum = (r + g + b) / 3;
  if (lum < 165 && Math.abs(r - g) < 28 && Math.abs(g - b) < 36 && r < 175) return true;
  return false;
}

function clearCapMark(data, w, h, x0, y0, x1, y1) {
  const width = x1 - x0 + 1;
  const height = y1 - y0 + 1;
  const src = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = ((y0 + y) * w + (x0 + x)) * 4;
      const o = (y * width + x) * 4;
      src[o] = data[i];
      src[o + 1] = data[i + 1];
      src[o + 2] = data[i + 2];
      src[o + 3] = 255;
    }
  }
  return { src, width, height, x0, y0 };
}

function isCapGreen(r, g, b) {
  const lum = (r + g + b) / 3;
  return lum > 45 && lum < 210 && g + 15 >= r && g + 15 >= b && g > 50;
}

function rowEdges(data, w, y, x0, x1) {
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

function edgeColor(data, w, y, x) {
  const i = (y * w + x) * 4;
  return [data[i], data[i + 1], data[i + 2]];
}

async function flattenCap(data, w, h, x0, y0, x1, y1) {
  for (let y = y0; y <= y0 + 72; y++) {
    const { left, right } = rowEdges(data, w, y, x0, x1);
    if (left == null || right - left < 40) continue;
    const a = edgeColor(data, w, y, Math.min(right - 4, left + 10));
    const b = edgeColor(data, w, y, Math.max(left + 4, right - 10));
    const xA = left + 16;
    const xB = right - 16;
    for (let x = xA; x <= xB; x++) {
      const t = (x - left) / Math.max(1, right - left);
      const dist = Math.min(x - xA, xB - x);
      const mix = Math.min(1, dist / 8);
      const i = (y * w + x) * 4;
      for (let c = 0; c < 3; c++) {
        const val = a[c] * (1 - t) + b[c] * t;
        data[i + c] = Math.round(data[i + c] * (1 - mix) + val * mix);
      }
    }
  }
  function bright(y, from, to) {
    const col = [0, 0, 0];
    let n = 0;
    for (let x = from; x <= to; x++) {
      const c = edgeColor(data, w, y, x);
      if ((c[0] + c[1] + c[2]) / 3 <= 100) continue;
      col[0] += c[0];
      col[1] += c[1];
      col[2] += c[2];
      n++;
    }
    if (n < 3) return null;
    return col.map((v) => v / n);
  }
  const front = [];
  for (let y = y0 + 70; y <= y1; y++) {
    const { left, right } = rowEdges(data, w, y, x0, x1);
    if (left == null || right - left < 80) {
      front.push(null);
      continue;
    }
    const a = bright(y, left + 2, left + 28);
    const b = bright(y, right - 28, right - 2);
    if (!a || !b) {
      front.push(null);
      continue;
    }
    const gate = Math.min((a[0] + a[1] + a[2]) / 3, (b[0] + b[1] + b[2]) / 3) - 14;
    const xA = left + 6;
    const xB = right - 6;
    let dark = 0;
    for (let x = xA; x <= xB; x++) {
      const i = (y * w + x) * 4;
      if ((data[i] + data[i + 1] + data[i + 2]) / 3 < gate) dark++;
    }
    front.push(dark >= 4 ? { left, right, xA, xB, a, b } : null);
  }
  const smooth = front.map((row, i) => {
    if (!row) return null;
    const acc = [0, 0, 0, 0, 0, 0, 0];
    for (let k = -6; k <= 6; k++) {
      const other = front[i + k];
      if (!other) continue;
      acc[6]++;
      for (let c = 0; c < 3; c++) {
        acc[c] += other.a[c];
        acc[c + 3] += other.b[c];
      }
    }
    return {
      ...row,
      a: [0, 1, 2].map((c) => acc[c] / acc[6]),
      b: [0, 1, 2].map((c) => acc[c + 3] / acc[6]),
    };
  });
  let paintTop = null;
  let paintBot = null;
  for (let i = 0; i < smooth.length; i++) {
    const row = smooth[i];
    if (!row) continue;
    const y = y0 + 70 + i;
    paintTop = paintTop == null ? y : paintTop;
    paintBot = y;
    for (let x = row.xA; x <= row.xB; x++) {
      const t = (x - row.left) / Math.max(1, row.right - row.left);
      const dist = Math.min(x - row.xA, row.xB - x, 10) / 10;
      const iPx = (y * w + x) * 4;
      for (let c = 0; c < 3; c++) {
        const val = row.a[c] * (1 - t) + row.b[c] * t;
        data[iPx + c] = Math.round(data[iPx + c] * (1 - dist) + val * dist);
      }
    }
  }
  if (paintTop != null) {
    const bw = x1 - x0 + 1;
    const bh = paintBot - paintTop + 1;
    const raw = Buffer.alloc(bw * bh * 4);
    for (let y = 0; y < bh; y++) {
      for (let x = 0; x < bw; x++) {
        const i = ((paintTop + y) * w + (x0 + x)) * 4;
        const o = (y * bw + x) * 4;
        raw[o] = data[i];
        raw[o + 1] = data[i + 1];
        raw[o + 2] = data[i + 2];
        raw[o + 3] = 255;
      }
    }
    const blurred = await sharp(raw, { raw: { width: bw, height: bh, channels: 4 } }).blur(1.6).raw().toBuffer();
    for (let i = 0; i < smooth.length; i++) {
      const row = smooth[i];
      if (!row) continue;
      const y = y0 + 70 + i;
      for (let x = row.xA + 4; x <= row.xB - 4; x++) {
        const o = ((y - paintTop) * bw + (x - x0)) * 4;
        const p = (y * w + x) * 4;
        data[p] = blurred[o];
        data[p + 1] = blurred[o + 1];
        data[p + 2] = blurred[o + 2];
      }
    }
  }
}

function stickInk(r, g, b) {
  const lum = (r + g + b) / 3;
  if (lum > 228) return false;
  if (g > r + 16 && g > 60 && r < 190 && g < 210 && b > r - 5) return true;
  if (lum < 195 && Math.abs(r - g) < 18 && Math.abs(g - b) < 22) return true;
  return false;
}

async function load(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height };
}

async function savePreview(name, data, w, h) {
  await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .resize({ width: 900 })
    .jpeg({ quality: 84 })
    .toFile(path.join(outDir, `${name}.jpg`));
}

async function saveWebpTmp(rel, data, w, h) {
  const tmp = `${rel}.stamp-tmp`;
  fs.rmSync(tmp, { force: true });
  await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .webp({ quality: 92, smartSubsample: false, effort: 4 })
    .toFile(tmp);
  console.log("wrote", tmp);
}

function place(data, w, h, logo, cx, cy) {
  const lw = logo.info.width;
  const lh = logo.info.height;
  blit(data, w, h, logo, Math.round(cx - lw / 2), Math.round(cy - lh / 2));
}

async function fixNuetra() {
  const { data, w, h } = await load("public/homepage/nuetra.webp");
  clearInk(data, w, h, 350, 300, 690, 515, tealInk, 2);
  clearInk(data, w, h, 590, 330, 708, 500, (r, g, b) => {
    const lum = (r + g + b) / 3;
    return lum > 100 && lum < 236 && g > r + 10 && b > r && r < 230;
  }, 2);
  const logo = await makeLogo(292);
  place(data, w, h, logo, 508, 402);
  return { data, w, h, rel: "public/homepage/nuetra.webp" };
}

async function fixJar() {
  const { data, w, h } = await load("public/packaging/jar.webp");
  clearInk(data, w, h, 880, 860, 1360, 1055, tealInk, 2);
  const logo = await makeLogo(348);
  place(data, w, h, logo, 1056, 948);
  return { data, w, h, rel: "public/packaging/jar.webp" };
}

async function fixBottles() {
  const { data, w, h } = await load("public/packaging/bottle-packs.webp");
  const labels = [
    { box: [210, 850, 640, 1048], cx: 405, cy: 952, width: 320 },
    { box: [840, 820, 1230, 1040], cx: 1020, cy: 930, width: 330 },
    { box: [1488, 910, 1840, 1088], cx: 1655, cy: 990, width: 320 },
  ];
  for (const label of labels) {
    clearInk(data, w, h, ...label.box, tealInk, 2);
    const logo = await makeLogo(label.width);
    place(data, w, h, logo, label.cx, label.cy);
  }

  await flattenCap(data, w, h, 1490, 446, 1830, 705);
  const capLogo = await makeLogo(220);
  engrave(data, w, h, capLogo, Math.round(1656 - capLogo.info.width / 2), Math.round(578 - capLogo.info.height / 2), 0.68);
  return { data, w, h, rel: "public/packaging/bottle-packs.webp" };
}

async function fixSticks() {
  const { data, w, h } = await load("public/packaging/stick-pack.webp");
  const sticks = [
    { cx: 155, cy: 600, angle: 14, width: 156, box: [10, 420, 290, 720] },
    { cx: 425, cy: 545, angle: 10, width: 178, box: [290, 350, 590, 700] },
    { cx: 730, cy: 520, angle: 4, width: 190, box: [590, 300, 890, 690] },
    { cx: 1010, cy: 510, angle: -2, width: 196, box: [870, 280, 1160, 690] },
    { cx: 1295, cy: 530, angle: -8, width: 190, box: [1140, 290, 1460, 710] },
    { cx: 1575, cy: 565, angle: -12, width: 178, box: [1420, 320, 1740, 740] },
    { cx: 1845, cy: 605, angle: -15, width: 164, box: [1680, 350, 2030, 780] },
  ];
  for (const stick of sticks) {
    clearInk(data, w, h, ...stick.box, stickInk, 2);
    const logo = await makeLogo(stick.width, stick.angle);
    place(data, w, h, logo, stick.cx, stick.cy);
  }
  return { data, w, h, rel: "public/packaging/stick-pack.webp" };
}

const mode = process.argv[2] || "preview";
const jobs = [
  ["nuetra", fixNuetra],
  ["jar", fixJar],
  ["bottle-packs", fixBottles],
  ["stick-pack", fixSticks],
];

if (mode === "swap") {
  for (const rel of [
    "public/homepage/nuetra.webp",
    "public/packaging/jar.webp",
    "public/packaging/bottle-packs.webp",
    "public/packaging/stick-pack.webp",
  ]) {
    const tmp = `${rel}.stamp-tmp`;
    const aside = `${rel}.replaced`;
    if (!fs.existsSync(tmp)) {
      console.log("missing", tmp);
      continue;
    }
    if (fs.existsSync(aside)) fs.rmSync(aside, { force: true });
    fs.renameSync(rel, aside);
    fs.renameSync(tmp, rel);
    try {
      fs.rmSync(aside, { force: true });
    } catch {
      console.log("kept aside", aside);
    }
    console.log("swapped", rel);
  }
  process.exit(0);
}

const crops = {
  nuetra: [[340, 300, 400, 240, "n-logo"]],
  jar: [[760, 820, 640, 360, "j-mid"]],
  "bottle-packs": [
    [1480, 430, 420, 280, "b-cap"],
    [180, 840, 500, 280, "b-left"],
    [820, 820, 500, 300, "b-mid"],
    [1460, 880, 480, 280, "b-right"],
  ],
  "stick-pack": [[0, 250, 2048, 520, "s-top"]],
};

for (const [name, fn] of jobs) {
  const result = await fn();
  if (mode === "write") await saveWebpTmp(result.rel, result.data, result.w, result.h);
  else {
    await savePreview(name, result.data, result.w, result.h);
    for (const [left, top, width, height, cropName] of crops[name]) {
      await sharp(result.data, { raw: { width: result.w, height: result.h, channels: 4 } })
        .extract({ left, top, width, height })
        .jpeg({ quality: 90 })
        .toFile(path.join(outDir, `${cropName}.jpg`));
    }
  }
  console.log("ok", name);
}
