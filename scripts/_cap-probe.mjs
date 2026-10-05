import sharp from "sharp";

const file = process.argv[2];
const y = Number(process.argv[3] || 0);
const { data, info } = await sharp(file)
  .resize({ width: 1728, height: 2304, kernel: "lanczos3" })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const w = info.width;
const row = [];
for (let x = 300; x < 1450; x += 4) {
  const i = (y * w + x) * 4;
  row.push(Math.round((data[i] + data[i + 1] + data[i + 2]) / 3));
}
console.log(file.split("/").pop(), "y", y);
console.log(row.join(" "));
