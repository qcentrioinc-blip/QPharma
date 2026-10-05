import sharp from "sharp";

const file =
  "public/product-images/Organic/Garcinia Cambogia/Goji Berry + Bilberry + Marigold + Carrot.webp";
const { data, info } = await sharp(file)
  .resize({ width: 1728, height: 2304, kernel: "lanczos3" })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const w = info.width;
const L = (x, y) => {
  const i = (y * w + x) * 4;
  return (data[i] + data[i + 1] + data[i + 2]) / 3;
};
for (let y = 300; y <= 880; y += 10) {
  const xs = [700, 860, 1000];
  console.log(y, xs.map((x) => L(x, y).toFixed(0)).join(" "));
}
