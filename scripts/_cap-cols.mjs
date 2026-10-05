import { execFileSync } from "node:child_process";
import sharp from "sharp";

const rel = process.argv[2];
const y0 = Number(process.argv[3]);
const y1 = Number(process.argv[4]);
const gitBuf = execFileSync("git", ["show", `HEAD:${rel}`], { maxBuffer: 30_000_000 });
const { data, info } = await sharp(gitBuf)
  .resize({ width: 1728, height: 2304, kernel: "lanczos3" })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const w = info.width;
const lum = (x, y) => {
  const i = (y * w + x) * 4;
  return (data[i] + data[i + 1] + data[i + 2]) / 3;
};
for (let x = 450; x <= 1280; x += 16) {
  let e = 0;
  let n = 0;
  for (let y = y0; y <= y1 - 4; y += 3) {
    e += Math.abs(lum(x, y) - lum(x, y + 3));
    n++;
  }
  if (e / n > 4) console.log(x, (e / n).toFixed(1));
}
