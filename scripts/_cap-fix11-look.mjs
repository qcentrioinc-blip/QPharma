import fs from "node:fs";
import sharp from "sharp";

const manifest = fs.readFileSync("src/organic/imageManifest.ts", "utf8");
const paths = {};
for (const match of manifest.matchAll(/"([^"]+)": "([^"]+)"/g)) paths[match[1]] = `public${match[2]}`;

const items = [
  ["cinnamon3", "Cinnamon|Milk Thistle + Artichoke Fruit + Myrobalan", 280, 620],
  ["goji", "Garcinia Cambogia|Goji Berry + Bilberry + Marigold + Carrot", 430, 860],
  ["guduchi4", "Guduchi|Curcumin + Moringa + Liquorice + Ashwagandha Root", 180, 560],
  ["gym1", "Gymnema Sylvestre|Ashwagandha Root + Mucuna Pruriens + Safed Musli", 400, 820],
  ["gym2", "Gymnema Sylvestre|Muira Puama + Gokhru + Shilajit", 340, 740],
  ["gym3", "Gymnema Sylvestre|Shilajit + Ashwagandha Root + Ginseng", 460, 820],
  ["basil1", "Holy Basil|Iron + Folic Acid + Vitamin B12 + Vitamin B6 + Zinc", 380, 740],
  ["basil4", "Holy Basil|Vitamin B1 + Vitamin B2 + Vitamin B6 + Vitamin B12", 360, 740],
  ["kalmegh1", "Kalmegh|Shatavari + Black Sesame Seed + Liquorice Root + Musta", 360, 760],
  ["liver1", "Liverwort|Cissus Quadrangularis + Boswellia Serrata + Piperine + Hadjod", 580, 940],
  ["liver4", "Liverwort|Guggul + Sea Buck Thorn + Schindra + Eucalyptus", 360, 740],
];

fs.mkdirSync("scripts/_organic-caps/fix11", { recursive: true });
for (const [name, key, y0, y1] of items) {
  const rel = paths[key];
  const buf = await sharp(rel).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = buf.info;
  const top = Math.max(0, y0);
  const height = Math.min(h - top, y1 - top);
  await sharp(buf.data, { raw: buf.info })
    .extract({ left: 400, top, width: 960, height })
    .resize({ width: 640 })
    .jpeg({ quality: 88 })
    .toFile(`scripts/_organic-caps/fix11/${name}.jpg`);
  console.log(name, w, h);
}
