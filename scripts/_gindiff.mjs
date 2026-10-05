import { execFileSync } from "node:child_process";
import sharp from "sharp";

const ginRel = "public/product-images/Herbaceutical/Immunity booster/American Ginseng + Kalmegh + Echinacea Root + Spirulina.webp";
const headBuf = execFileSync("git", ["show", `HEAD:${ginRel}`], { maxBuffer: 80_000_000 });

async function crop(input, out, left, top, width, height) {
  await sharp(input).extract({ left, top, width, height }).jpeg({ quality: 95 }).toFile(out);
}

await crop(headBuf, "scripts/_pack-fix/head-l-native.jpg", 180, 400, 140, 160);
await crop(headBuf, "scripts/_pack-fix/head-r-native.jpg", 540, 400, 160, 160);
await crop(ginRel, "scripts/_pack-fix/live-l-native.jpg", 180, 400, 140, 160);
await crop(ginRel, "scripts/_pack-fix/live-r-native.jpg", 540, 400, 160, 160);

const head = await sharp(headBuf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const live = await sharp(ginRel).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const w = head.info.width;
const regions = [
  ["L", 180, 400, 140, 160],
  ["R", 540, 400, 160, 160],
];
for (const [name, left, top, width, height] of regions) {
  let n = 0;
  let bright = 0;
  for (let y = top; y < top + height; y++) {
    for (let x = left; x < left + width; x++) {
      const i = (y * w + x) * 4;
      const dl = Math.abs(live.data[i] + live.data[i + 1] + live.data[i + 2] - (head.data[i] + head.data[i + 1] + head.data[i + 2])) / 3;
      if (dl > 18) {
        n++;
        const l = (live.data[i] + live.data[i + 1] + live.data[i + 2]) / 3;
        const hl = (head.data[i] + head.data[i + 1] + head.data[i + 2]) / 3;
        if (l > hl + 18) bright++;
      }
    }
  }
  console.log(name, "live vs head differ", n, "live brighter", bright);
}
