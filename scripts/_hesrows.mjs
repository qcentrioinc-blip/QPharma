import sharp from "sharp";

const img = await sharp("scripts/_pack-fix/fix-hes.jpg").ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { data, info } = img;
const w = info.width;
function lum(x, y) {
  const i = (y * w + x) * 4;
  return Math.round((data[i] + data[i + 1] + data[i + 2]) / 3);
}
function bg(x, y) {
  const i = (y * w + x) * 4;
  return data[i + 2] - data[i + 1];
}
for (const y of [40, 70, 100, 120, 130, 140, 150]) {
  let l = "";
  let b = "";
  for (let x = 40; x < 320; x += 10) {
    l += String(lum(x, y)).padStart(4);
    b += String(bg(x, y)).padStart(4);
  }
  console.log("y", y, "lum", l);
  console.log("y", y, "b-g", b);
}
