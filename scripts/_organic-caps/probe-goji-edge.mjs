import sharp from "sharp";

const file =
  "public/product-images/Organic/Garcinia Cambogia/Goji Berry + Bilberry + Marigold + Carrot.webp";
const { data, info } = await sharp(file)
  .resize({ width: 1728, height: 2304, kernel: "lanczos3" })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const w = info.width;
const y = 690;
const rgb = (x) => {
  const i = (y * w + x) * 4;
  return [data[i], data[i + 1], data[i + 2]];
};
const delta = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
const seed = rgb(864);
console.log("seed", seed);
for (let x = 800; x <= 1400; x += 20) {
  const jump = delta(rgb(x), rgb(x - 8));
  const fromSeed = delta(rgb(x), seed);
  if (jump > 30 || fromSeed > 50) console.log(x, "jump", jump, "seed", fromSeed, rgb(x).join(","));
}
