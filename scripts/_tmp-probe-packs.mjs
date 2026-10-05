import sharp from "sharp";

function stats(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const l = (max + min) / 2;
  let h = 0;
  if (d) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h: Math.round(h), d, l: Math.round(l) };
}

const files = [
  ["public/packaging/jar.webp", 194, 850, 380, 180],
  ["public/packaging/sachets.webp", 842, 780, 400, 200],
  ["public/packaging/blister.webp", 400, 700, 1200, 500],
  ["public/packaging/stick-pack.webp", 200, 700, 1600, 500],
];

for (const [rel, x, y, w, h] of files) {
  const img = await sharp(rel).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = img.info.width;
  const H = img.info.height;
  let teal = 0;
  let dark = 0;
  const samples = [];
  for (let yy = y; yy < Math.min(H, y + h); yy += 3) {
    for (let xx = x; xx < Math.min(W, x + w); xx += 3) {
      const i = (yy * W + xx) * 4;
      const r = img.data[i], g = img.data[i + 1], b = img.data[i + 2];
      const s = stats(r, g, b);
      if (s.h >= 145 && s.h <= 210 && s.d >= 18 && g > r) {
        teal++;
        if (samples.length < 8) samples.push(`${xx},${yy} ${r},${g},${b} h${s.h} d${s.d} l${s.l}`);
      }
      if (s.l < 80) dark++;
    }
  }
  console.log(`\n${rel} ${W}x${H} teal~${teal} dark~${dark}`);
  console.log(samples.join("\n"));
}
