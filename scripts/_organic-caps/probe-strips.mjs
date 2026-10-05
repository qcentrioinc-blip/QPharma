import sharp from "sharp";

const jobs = [
  ["goji", "public/product-images/Organic/Garcinia Cambogia/Goji Berry + Bilberry + Marigold + Carrot.webp"],
  ["cats", "public/product-images/Organic/Liverwort/Cat's Claw + Bromelain Extract + Ashwagandha Root.webp"],
  ["manj", "public/product-images/Organic/Gynoestemma/Manjistha + Amla + Fennel Seed + Celery.webp"],
  ["flax", "public/product-images/Organic/Moringa/Flaxseed + Red Clover + Black Cohosh Root + Ginseng.webp"],
];

for (const [name, file] of jobs) {
  await sharp(file)
    .resize({ width: 1728, height: 2304, kernel: "lanczos3" })
    .extract({ left: 560, top: 220, width: 600, height: 760 })
    .jpeg({ quality: 78 })
    .toFile(`scripts/_organic-caps/probe/strip-${name}.jpg`);
  console.log(name);
}
