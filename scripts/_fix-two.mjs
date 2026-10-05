import { execFileSync } from "node:child_process";
import fs from "node:fs";
import sharp from "sharp";

const hesRel = "public/product-images/Nutraceutical/Respiratory Health/Hesperidin + Ellagic Acid + Elderberry Extract + Grapeseed Extract + Zinc.webp";
const ginRel = "public/product-images/Herbaceutical/Immunity booster/American Ginseng + Kalmegh + Echinacea Root + Spirulina.webp";

function at(data, w, x, y) {
  const i = (y * w + x) * 4;
  return [data[i], data[i + 1], data[i + 2]];
}
function lum(p) {
  return (p[0] + p[1] + p[2]) / 3;
}
function logoInk(p) {
  const [r, g, b] = p;
  const l = lum(p);
  return l > 55 && l < 205 && g > r + 16 && g > 70 && r < 185 && g + 16 >= b;
}
function warm(p) {
  if (!p) return false;
  if (lum(p) < 155 || lum(p) > 250) return false;
  if (logoInk(p)) return false;
  return p[2] - p[1] < -3 && p[0] - p[1] < 22;
}

async function fixHes() {
  const headBuf = execFileSync("git", ["show", `HEAD:${hesRel}`], { maxBuffer: 80_000_000 });
  const head = await sharp(headBuf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const img = await sharp(hesRel).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { data, info } = img;
  const w = info.width;
  const h = info.height;
  const src = Buffer.from(data.subarray(0, data.length));
  const oldInk = new Uint8Array(w * h);
  for (let y = 400; y <= 510; y++) {
    for (let x = 300; x <= 600; x++) {
      const hp = at(head.data, w, x, y);
      const l = lum(hp);
      if (l < 200 && hp[1] > hp[0] + 4 && hp[1] > 50) oldInk[y * w + x] = 1;
    }
  }
  const grown = new Uint8Array(oldInk);
  for (let y = 405; y <= 505; y++) {
    for (let x = 310; x <= 590; x++) {
      if (!oldInk[y * w + x]) continue;
      for (let dy = -5; dy <= 5; dy++) {
        for (let dx = -5; dx <= 5; dx++) grown[(y + dy) * w + (x + dx)] = 1;
      }
    }
  }
  const mask = new Uint8Array(w * h);
  let n = 0;
  for (let y = 386; y <= 500; y++) {
    for (let x = 340; x <= 580; x++) {
      const p = at(src, w, x, y);
      if (logoInk(p)) continue;
      if (grown[y * w + x]) {
        mask[y * w + x] = 1;
        n++;
        continue;
      }
      if (lum(p) < 150) continue;
      const hp = at(head.data, w, x, y);
      const i = (y * w + x) * 4;
      if (grown[y * w + x]) {
        mask[y * w + x] = 1;
        n++;
        continue;
      }
      const headCream = lum(hp) > 158 && hp[2] - hp[1] < -4 && hp[1] <= hp[0] + 4 && hp[0] > 155;
      if (headCream) {
        data[i] = hp[0];
        data[i + 1] = hp[1];
        data[i + 2] = hp[2];
        n++;
        continue;
      }
      if (p[2] - p[1] >= -2 && lum(p) > 160) {
        mask[y * w + x] = 1;
        n++;
      }
    }
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!mask[y * w + x]) continue;
      let left = null;
      let leftX = x;
      for (let xx = x - 1; xx >= 260; xx--) {
        if (mask[y * w + xx]) continue;
        const p = at(data, w, xx, y);
        if (!warm(p)) continue;
        left = p;
        leftX = xx;
        break;
      }
      let right = null;
      let rightX = x;
      for (let xx = x + 1; xx <= Math.min(w - 1, 680); xx++) {
        if (mask[y * w + xx]) continue;
        const p = at(data, w, xx, y);
        if (!warm(p)) continue;
        right = p;
        rightX = xx;
        break;
      }
      const a = left || right;
      const b = right || left;
      if (!a) continue;
      const span = Math.max(1, rightX - leftX);
      const u = left && right ? (x - leftX) / span : 0;
      const i = (y * w + x) * 4;
      data[i] = Math.round(a[0] + (b[0] - a[0]) * u);
      data[i + 1] = Math.round(a[1] + (b[1] - a[1]) * u);
      data[i + 2] = Math.round(a[2] + (b[2] - a[2]) * u);
    }
  }
  let leftV = 0;
  for (let y = 396; y <= 488; y++) {
    for (let x = 440; x <= 568; x++) {
      const p = at(data, w, x, y);
      if (logoInk(p) || lum(p) < 160) continue;
      if (p[2] - p[1] >= 0) leftV++;
    }
  }
  let ghost = 0;
  let gx0 = 9999, gx1 = 0, gy0 = 9999, gy1 = 0;
  for (let y = 400; y <= 505; y++) {
    const row = [];
    for (let x = 300; x <= 620; x++) {
      const p = at(data, w, x, y);
      if (logoInk(p)) continue;
      if (p[2] - p[1] < -3 && lum(p) > 160) row.push(lum(p));
    }
    row.sort((a, b) => a - b);
    const med = row[Math.floor(row.length / 2)] || 200;
    let line = "";
    for (let x = 320; x <= 580; x += 8) {
      const p = at(data, w, x, y);
      if (logoInk(p)) { line += "L"; continue; }
      const d = med - lum(p);
      const green = p[1] > p[0] + 2;
      if (d > 10 || green) {
        ghost++;
        gx0 = Math.min(gx0, x); gx1 = Math.max(gx1, x);
        gy0 = Math.min(gy0, y); gy1 = Math.max(gy1, y);
        line += green ? "g" : "d";
      } else line += ".";
    }
    if (y % 8 === 0) console.log(String(y).padStart(4), line);
  }
  let greenish = 0;
  for (let y = 386; y <= 500; y++) {
    for (let x = 340; x <= 580; x++) {
      const p = at(data, w, x, y);
      if (logoInk(p)) continue;
      if (p[1] > p[0] + 2 && lum(p) > 140) greenish++;
    }
  }
  let changed = 0;
  let purpleHit = 0;
  let logoChanged = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (data[i] === src[i] && data[i + 1] === src[i + 1] && data[i + 2] === src[i + 2]) continue;
      changed++;
      const p = [src[i], src[i + 1], src[i + 2]];
      if (logoInk(p)) logoChanged++;
      const chroma = Math.max(...p) - Math.min(...p);
      if (chroma > 35 && p[2] > p[1]) purpleHit++;
    }
  }
  console.log("hes masked", n, "violet remaining", leftV, "greenish nonlogo", greenish, "changed", changed, "logo changed", logoChanged, "purple hit", purpleHit);
  const diff = Buffer.from(data);
  for (let i = 0; i < diff.length; i += 4) {
    if (data[i] !== src[i] || data[i + 1] !== src[i + 1] || data[i + 2] !== src[i + 2]) {
      diff[i] = 220;
      diff[i + 1] = 40;
      diff[i + 2] = 40;
    }
  }
  await sharp(diff, { raw: { width: w, height: h, channels: 4 } })
    .extract({ left: 280, top: 360, width: 360, height: 200 })
    .jpeg({ quality: 92 })
    .toFile("scripts/_pack-fix/fix-hes-diff.jpg");
  await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .extract({ left: 280, top: 360, width: 360, height: 200 })
    .jpeg({ quality: 92 })
    .toFile("scripts/_pack-fix/fix-hes.jpg");
  return { data, w, h };
}

async function fixGin() {
  const headBuf = execFileSync("git", ["show", `HEAD:${ginRel}`], { maxBuffer: 80_000_000 });
  const head = await sharp(headBuf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const img = await sharp(ginRel).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { data, info } = img;
  const src = Buffer.from(data.subarray(0, data.length));
  const w = info.width;
  const h = info.height;
  const side = (x) => x < 300 || x > 555;
  const mask = new Uint8Array(w * h);
  const stack = [];
  for (let y = 300; y < 720; y++) {
    for (let x = 120; x < 760; x++) {
      if (!side(x)) continue;
      const i = (y * w + x) * 4;
      const c = [data[i], data[i + 1], data[i + 2]];
      const p = [head.data[i], head.data[i + 1], head.data[i + 2]];
      if (logoInk(c)) continue;
      const cl = lum(c);
      const hl = lum(p);
      const cc = Math.max(...c) - Math.min(...c);
      const hc = Math.max(...p) - Math.min(...p);
      if (hl > 190 && hc < 30) continue;
      if (cl > 155 && cc < 55 && cl - hl > 8) {
        mask[y * w + x] = 1;
        stack.push(y * w + x);
      }
    }
  }
  while (stack.length) {
    const p = stack.pop();
    const x = p % w;
    const y = (p - x) / w;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const xx = x + dx;
      const yy = y + dy;
      if (xx < 120 || yy < 300 || xx >= 760 || yy >= 720 || !side(xx)) continue;
      if (mask[yy * w + xx]) continue;
      const i = (yy * w + xx) * 4;
      const c = [data[i], data[i + 1], data[i + 2]];
      const hp = [head.data[i], head.data[i + 1], head.data[i + 2]];
      if (logoInk(c)) continue;
      const hl = lum(hp);
      const hc = Math.max(...hp) - Math.min(...hp);
      if (hl > 190 && hc < 30) continue;
      const cl = lum(c);
      const cc = Math.max(...c) - Math.min(...c);
      if (cl > 140 && cc < 60 && cl - hl > 4) {
        mask[yy * w + xx] = 1;
        stack.push(yy * w + xx);
      }
    }
  }
  let n = 0;
  for (let i = 0; i < mask.length; i++) {
    if (!mask[i]) continue;
    const o = i * 4;
    data[o] = head.data[o];
    data[o + 1] = head.data[o + 1];
    data[o + 2] = head.data[o + 2];
    n++;
  }
  let white = 0;
  let dumped = 0;
  for (let y = 380; y <= 560; y += 6) {
    let line = "";
    for (let x = 160; x <= 720; x += 8) {
      const c = at(data, w, x, y);
      const p = [head.data[(y * w + x) * 4], head.data[(y * w + x) * 4 + 1], head.data[(y * w + x) * 4 + 2]];
      const cl = lum(c);
      const hl = lum(p);
      const cc = Math.max(...c) - Math.min(...c);
      if (x > 300 && x < 555) { line += " "; continue; }
      if (cl > 175 && cc < 40 && cl - hl > 12) {
        white++;
        line += "W";
        if (dumped < 12) {
          dumped++;
          console.log("  left", x, y, "now", c.map(Math.round), "head", p.map(Math.round), "d", Math.round(cl - hl));
        }
      }
      else line += ".";
    }
    console.log(String(y).padStart(4), line);
  }
  let teal = 0;
  for (let y = 300; y < 720; y++) {
    for (let x = 120; x < 760; x++) {
      if (!side(x)) continue;
      const c = at(data, w, x, y);
      if (logoInk(c)) teal++;
    }
  }
  let glassDiff = 0;
  let glassN = 0;
  let barLeft = 0;
  for (let y = 400; y < 560; y++) {
    for (let x = 180; x < 270; x++) {
      const i = (y * w + x) * 4;
      const dl = Math.abs(data[i] + data[i + 1] + data[i + 2] - (head.data[i] + head.data[i + 1] + head.data[i + 2])) / 3;
      glassDiff += dl;
      glassN++;
      const cl = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const hl = (head.data[i] + head.data[i + 1] + head.data[i + 2]) / 3;
      if (cl > hl + 25 && cl > 180) barLeft++;
    }
  }
  let glassDiffR = 0;
  let glassNR = 0;
  let barRight = 0;
  for (let y = 400; y < 560; y++) {
    for (let x = 590; x < 700; x++) {
      const i = (y * w + x) * 4;
      const dl = Math.abs(data[i] + data[i + 1] + data[i + 2] - (head.data[i] + head.data[i + 1] + head.data[i + 2])) / 3;
      glassDiffR += dl;
      glassNR++;
      const cl = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const hl = (head.data[i] + head.data[i + 1] + head.data[i + 2]) / 3;
      if (cl > hl + 25 && cl > 180) barRight++;
    }
  }
  console.log("gin restored", n, "white leftover", white, "side teal", teal);
  console.log("glass L mad", (glassDiff / glassN).toFixed(1), "bars", barLeft, "R mad", (glassDiffR / glassNR).toFixed(1), "bars", barRight);
  await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .extract({ left: 180, top: 400, width: 140, height: 160 })
    .jpeg({ quality: 95 })
    .toFile("scripts/_pack-fix/fix-gin-l-native.jpg");
  await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .extract({ left: 540, top: 400, width: 160, height: 160 })
    .jpeg({ quality: 95 })
    .toFile("scripts/_pack-fix/fix-gin-r-native.jpg");
  const diff = Buffer.from(data);
  for (let i = 0; i < diff.length; i += 4) {
    if (data[i] !== src[i] || data[i + 1] !== src[i + 1] || data[i + 2] !== src[i + 2]) {
      diff[i] = 220;
      diff[i + 1] = 40;
      diff[i + 2] = 40;
    }
  }
  await sharp(diff, { raw: { width: w, height: h, channels: 4 } })
    .extract({ left: 140, top: 340, width: 600, height: 280 })
    .jpeg({ quality: 92 })
    .toFile("scripts/_pack-fix/fix-gin-diff.jpg");
  await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .extract({ left: 140, top: 340, width: 600, height: 280 })
    .jpeg({ quality: 92 })
    .toFile("scripts/_pack-fix/fix-gin.jpg");
  await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .extract({ left: 150, top: 360, width: 160, height: 220 })
    .resize({ width: 320, kernel: "nearest" })
    .jpeg({ quality: 92 })
    .toFile("scripts/_pack-fix/fix-gin-l.jpg");
  await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .extract({ left: 560, top: 360, width: 180, height: 220 })
    .resize({ width: 360, kernel: "nearest" })
    .jpeg({ quality: 92 })
    .toFile("scripts/_pack-fix/fix-gin-r.jpg");
  return { data, w, h };
}

const hes = await fixHes();
const gin = await fixGin();

if (process.argv.includes("write")) {
  for (const [rel, result] of [[hesRel, hes], [ginRel, gin]]) {
    const tmp = `${rel}.stamp-tmp`;
    fs.rmSync(tmp, { force: true });
    await sharp(result.data, { raw: { width: result.w, height: result.h, channels: 4 } })
      .webp({ quality: 92, smartSubsample: false, effort: 4 })
      .toFile(tmp);
    console.log("wrote", tmp);
  }
}
