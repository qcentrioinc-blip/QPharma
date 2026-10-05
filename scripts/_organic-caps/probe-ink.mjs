import fs from "node:fs";
import sharp from "sharp";

const manifest = fs.readFileSync("src/organic/imageManifest.ts", "utf8");
const paths = {};
for (const match of manifest.matchAll(/"([^"]+)": "([^"]+)"/g)) paths[match[1]] = `public${match[2]}`;
const file = paths["Liverwort|Cat's Claw + Bromelain Extract + Ashwagandha Root"];
const { data, info } = await sharp(file)
  .resize({ width: 1728, height: 2304, kernel: "lanczos3" })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const w = info.width;
const donor = 498;
const dAt = (x, y) => {
  const i = (y * w + x) * 4;
  const j = (donor * w + x) * 4;
  return (
    Math.abs(data[i] - data[j]) +
    Math.abs(data[i + 1] - data[j + 1]) +
    Math.abs(data[i + 2] - data[j + 2])
  );
};
for (let y = 400; y <= 620; y += 8) {
  let n = 0;
  let max = 0;
  for (let x = 560; x <= 1160; x += 2) {
    const d = dAt(x, y);
    if (d > 20) n++;
    if (d > max) max = d;
  }
  if (n > 10) console.log(y, "n", n, "max", max);
}
