import sharp from "sharp";

const hes = "public/product-images/Nutraceutical/Respiratory Health/Hesperidin + Ellagic Acid + Elderberry Extract + Grapeseed Extract + Zinc.webp";
const gin = "public/product-images/Herbaceutical/Immunity booster/American Ginseng + Kalmegh + Echinacea Root + Spirulina.webp";

await sharp(hes).extract({ left: 280, top: 360, width: 360, height: 200 }).jpeg({ quality: 92 }).toFile("scripts/_pack-fix/now-hes.jpg");
await sharp(gin).extract({ left: 140, top: 340, width: 600, height: 280 }).jpeg({ quality: 92 }).toFile("scripts/_pack-fix/now-gin.jpg");
await sharp(gin).extract({ left: 160, top: 380, width: 140, height: 180 }).resize({ width: 280, kernel: "nearest" }).jpeg({ quality: 92 }).toFile("scripts/_pack-fix/now-gin-l.jpg");
await sharp(gin).extract({ left: 560, top: 380, width: 160, height: 180 }).resize({ width: 320, kernel: "nearest" }).jpeg({ quality: 92 }).toFile("scripts/_pack-fix/now-gin-r.jpg");

const { data, info } = await sharp(hes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const w = info.width;
console.log("HES violet-ish pixels behind logo");
for (let y = 390; y <= 500; y += 4) {
  const hits = [];
  for (let x = 340; x <= 580; x++) {
    const i = (y * w + x) * 4;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const lum = (r + g + b) / 3;
    if (lum < 140) continue;
    if (g > r + 16 && g > 70 && r < 180) continue;
    if (r - g > 18 && b > g - 4 && b > 140) hits.push(x);
  }
  if (hits.length > 12) console.log(y, hits.length, hits[0], hits.at(-1));
}
