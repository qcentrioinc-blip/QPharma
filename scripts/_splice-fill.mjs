import fs from "node:fs";

const p = "scripts/_cap-redo29.mjs";
const lines = fs.readFileSync(p, "utf8").split(/\n/);
const start = lines.findIndex((l) => l.includes("let cleared = 0"));
const end = lines.findIndex((l, i) => i > start && l.trim().startsWith("paint(data"));
if (start < 0 || end < 0) throw new Error(`${start} ${end}`);
const block = `
  let cleared = 0;
  let refNote = "blur";
  const grain = key.includes("Muira Puama");
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
      const radius = 36;
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
  }
  const style = blackCap ? "raise" : "engrave";
  const big = key.includes("Goji Berry") || key.startsWith("Gymnema");
  const deep = key.startsWith("Gymnema") && !blackCap;
  let logoW = Math.round(capW * (big ? 0.74 : 0.64));
  let logoH = Math.round(logoW / aspect);
  const maxH = big ? 220 : Math.round((y1 - y0) * 0.82);
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
`.trim().split("\n");
lines.splice(start, end - start + 1, ...block);
fs.writeFileSync(p, lines.join("\n"));
console.log("spliced", start, end, "lines", lines.length);
