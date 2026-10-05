import { execFileSync } from "node:child_process";
import fs from "node:fs";
import sharp from "sharp";

const manifest = fs.readFileSync("src/organic/imageManifest.ts", "utf8");
const paths = {};
for (const match of manifest.matchAll(/"([^"]+)": "([^"]+)"/g)) paths[match[1]] = `public${match[2]}`;
const key = process.argv[2];
const rel = paths[key];
const gitBuf = execFileSync("git", ["show", `HEAD:${rel}`], { maxBuffer: 30_000_000 });
const { data, info } = await sharp(gitBuf).resize({ width: 1728, height: 2304, kernel: "lanczos3" }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const w = info.width;
const y0 = Number(process.argv[3]);
const y1 = Number(process.argv[4]);
const lum = (x, y) => {
  const i = (y * w + x) * 4;
  return (data[i] + data[i + 1] + data[i + 2]) / 3;
};
console.log(key.split("|")[1]);
for (let y = y0; y <= y1; y += 8) {
  let e = 0;
  let n = 0;
  for (let x = 500; x <= 1220; x += 4) {
    e += Math.abs(lum(x, y) - lum(x + 4, y));
    n++;
  }
  if (e / n > 4) console.log("y", y, (e / n).toFixed(1));
}
