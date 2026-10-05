import sharp from "sharp";
import path from "node:path";

const root = path.resolve("public");
const files = process.argv.slice(2);

function isTeal(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  // teal / blue-green wordmark, not cream, not dark green leaves
  return g > 70 && b > 60 && g > r + 25 && b > r + 10 && max - min > 30 && r < 160 && g < 210;
}

for (const rel of files) {
  const file = path.join(root, rel);
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  let minX = w, maxX = 0, minY = h, maxY = 0, count = 0;
  // center column only
  const x0 = Math.floor(w * 0.28);
  const x1 = Math.floor(w * 0.72);
  const y0 = Math.floor(h * 0.18);
  const y1 = Math.floor(h * 0.55);
  const rowCounts = [];
  for (let y = y0; y < y1; y++) {
    let row = 0;
    for (let x = x0; x < x1; x++) {
      const i = (y * w + x) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if (isTeal(r, g, b)) {
        row++;
        count++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
    if (row > 8) rowCounts.push(y);
  }
  // sample a few pixels at bbox center
  const cx = Math.floor((minX + maxX) / 2);
  const cy = Math.floor((minY + maxY) / 2);
  const si = (cy * w + cx) * 4;
  console.log(rel, {
    size: `${w}x${h}`,
    count,
    box: count ? `${minX},${minY} ${maxX - minX + 1}x${maxY - minY + 1}` : "none",
    center: count ? [data[si], data[si + 1], data[si + 2]] : null,
    rows: rowCounts.length ? `${rowCounts[0]}-${rowCounts[rowCounts.length - 1]}` : "none",
  });
}
