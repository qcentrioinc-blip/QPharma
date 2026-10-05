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
for (let y = y0; y <= y1; y += 8) {
  let e = 0;
  let c = 0;
  let lum = 0;
  for (let x = 620; x < 1100; x += 4) {
    const i = (y * w + x) * 4;
    const j = (y * w + x + 8) * 4;
    const a = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const b = (data[j] + data[j + 1] + data[j + 2]) / 3;
    e += Math.abs(a - b);
    lum += a;
    c++;
  }
  console.log(y, (e / c).toFixed(2), (lum / c).toFixed(0));
}
