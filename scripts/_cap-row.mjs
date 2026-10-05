import { execFileSync } from "node:child_process";
import sharp from "sharp";

const rel = process.argv[2];
const y = Number(process.argv[3]);
const gitBuf = execFileSync("git", ["show", `HEAD:${rel}`], { maxBuffer: 30_000_000 });
const { data, info } = await sharp(gitBuf)
  .resize({ width: 1728, height: 2304, kernel: "lanczos3" })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const w = info.width;
let line = "";
for (let x = 460; x <= 1260; x += 40) {
  const i = (y * w + x) * 4;
  const lum = Math.round((data[i] + data[i + 1] + data[i + 2]) / 3);
  line += `${x}:${lum} `;
}
console.log(y, line);
