import fs from "node:fs";

const files = [
  "public/product-images/Nutraceutical/Respiratory Health/Hesperidin + Ellagic Acid + Elderberry Extract + Grapeseed Extract + Zinc.webp",
  "public/product-images/Herbaceutical/Immunity booster/American Ginseng + Kalmegh + Echinacea Root + Spirulina.webp",
];

for (const rel of files) {
  const tmp = `${rel}.stamp-tmp`;
  const aside = `${rel}.replaced`;
  fs.renameSync(rel, aside);
  fs.renameSync(tmp, rel);
  fs.rmSync(aside, { force: true });
  console.log(rel, fs.statSync(rel).size);
}
