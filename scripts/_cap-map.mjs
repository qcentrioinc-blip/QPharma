import { execFileSync } from "node:child_process";
import fs from "node:fs";
import sharp from "sharp";

const redo = [
  "Cinnamon|Milk Thistle + Artichoke Fruit + Myrobalan",
  "Curcuma Longa|Gingko Biloba + Bacopa Monnieri + Shankhpushpi",
  "Curcuma Longa|Rosemary Leaf + Gotu Kola + Curcumin + Vacha",
  "Garcinia Cambogia|Goji Berry + Bilberry + Marigold + Carrot",
  "Garcinia Cambogia|Fennel Seed + Bay Berry + Spinach",
  "Guduchi|Neem Leaf + Morinda Citrifolia Fruit + Ashwagandha Root + Moringa Fruit",
  "Guduchi|American Ginseng + Kalmegh + Echinacea Root + Spirulina",
  "Guduchi|Curcumin + Moringa + Liquorice + Ashwagandha Root",
  "Gymnema Sylvestre|Ashwagandha Root + Mucuna Pruriens + Safed Musli",
  "Gymnema Sylvestre|Muira Puama + Gokhru + Shilajit",
  "Gymnema Sylvestre|Shilajit + Ashwagandha Root + Ginseng",
  "Gynoestemma|Horse Tail Herb + Birch Leaf + Tulsi Ark",
  "Gynoestemma|Manjistha + Amla + Fennel Seed + Celery",
  "Holy Basil|Iron + Folic Acid + Vitamin B12 + Vitamin B6 + Zinc",
  "Holy Basil|Folic Acid + Vitamin B12 + Vitamin C",
  "Holy Basil|Folic Acid + Vitamin B12 + Vitamin C + Iron + Zinc",
  "Holy Basil|Vitamin B1 + Vitamin B2 + Vitamin B6 + Vitamin B12",
  "Horsetail|Elderberry + Green Tea + Beetroot",
  "Kalmegh|Shatavari + Black Sesame Seed + Liquorice Root + Musta",
  "Kalmegh|Gokshuru + Holy Basil + Ashwagandha Root + Shalparni",
  "Liquorice|Bitter Melon + Lucuma + Banaba Leaf",
  "Liverwort|Cissus Quadrangularis + Boswellia Serrata + Piperine + Hadjod",
  "Liverwort|Cat's Claw + Bromelain Extract + Ashwagandha Root",
  "Liverwort|Rosehip Powder + Ginger + Curcumin + Maca Root",
  "Liverwort|Guggul + Sea Buck Thorn + Schindra + Eucalyptus",
  "Magnolia Bark|Manjistha Stem + Propolis + Avocado Fruit",
  "Triphala|Horse Chestnut + Rutin Powder + Arjuna + Cassia Bark",
  "Triphala|Arjuna + Guggul + Brahmi",
  "Triphala|Fenugreek Seed + Amla + Garlic Powder + Arjuna",
];

const manifest = fs.readFileSync("src/organic/imageManifest.ts", "utf8");
const paths = {};
for (const match of manifest.matchAll(/"([^"]+)": "([^"]+)"/g)) paths[match[1]] = `public${match[2]}`;

function lumAt(data, w, x, y) {
  const i = (y * w + x) * 4;
  return (data[i] + data[i + 1] + data[i + 2]) / 3;
}
function rgb(data, w, x, y) {
  const i = (y * w + x) * 4;
  return [data[i], data[i + 1], data[i + 2]];
}
function avg(data, w, y, x0, x1) {
  let r = 0, g = 0, b = 0, n = 0;
  for (let x = x0; x <= x1; x += 10) {
    const c = rgb(data, w, x, y);
    r += c[0]; g += c[1]; b += c[2]; n++;
  }
  return [Math.round(r / n), Math.round(g / n), Math.round(b / n)];
}
function energy(data, w, y, x0, x1) {
  let e = 0, c = 0;
  for (let x = x0; x <= x1 - 8; x += 6) {
    e += Math.abs(lumAt(data, w, x, y) - lumAt(data, w, x + 6, y));
    c++;
  }
  return e / c;
}

const only = (process.argv[2] || "").toLowerCase();
let n = 0;
for (const key of redo) {
  n++;
  if (only && !key.toLowerCase().includes(only)) continue;
  const rel = paths[key];
  const gitBuf = execFileSync("git", ["show", `HEAD:${rel}`], { maxBuffer: 30_000_000 });
  const { data, info } = await sharp(gitBuf).resize({ width: 1728, height: 2304, kernel: "lanczos3" }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const cx0 = Math.round(w * 0.44);
  const cx1 = Math.round(w * 0.56);
  const sx0 = Math.round(w * 0.30);
  const sx1 = Math.round(w * 0.36);
  console.log("\n" + String(n).padStart(2, "0"), key.split("|")[1].slice(0, 42));
  for (let y = 240; y <= 980; y += 40) {
    const c = avg(data, w, y, cx0, cx1);
    const s = avg(data, w, y, sx0, sx1);
    const e = energy(data, w, y, Math.round(w * 0.38), Math.round(w * 0.62));
    console.log(
      String(y).padStart(4),
      `C ${c.map((v) => String(v).padStart(3)).join(",")}`,
      `S ${s.map((v) => String(v).padStart(3)).join(",")}`,
      `e ${e.toFixed(0).padStart(3)}`,
    );
  }
}
