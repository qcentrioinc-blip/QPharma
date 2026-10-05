import { execFileSync } from "node:child_process";
import fs from "node:fs";
import sharp from "sharp";

const manifest = fs.readFileSync("src/organic/imageManifest.ts", "utf8");
const paths = {};
for (const match of manifest.matchAll(/"([^"]+)": "([^"]+)"/g)) paths[match[1]] = `public${match[2]}`;

const items = [
  ["cinnamon3", "Cinnamon|Milk Thistle + Artichoke Fruit + Myrobalan", 250, 620],
  ["goji", "Garcinia Cambogia|Goji Berry + Bilberry + Marigold + Carrot", 450, 860],
  ["guduchi4", "Guduchi|Curcumin + Moringa + Liquorice + Ashwagandha Root", 160, 560],
  ["gym1", "Gymnema Sylvestre|Ashwagandha Root + Mucuna Pruriens + Safed Musli", 400, 820],
  ["basil1", "Holy Basil|Iron + Folic Acid + Vitamin B12 + Vitamin B6 + Zinc", 380, 740],
  ["basil4", "Holy Basil|Vitamin B1 + Vitamin B2 + Vitamin B6 + Vitamin B12", 360, 740],
  ["kalmegh1", "Kalmegh|Shatavari + Black Sesame Seed + Liquorice Root + Musta", 360, 760],
  ["liver1", "Liverwort|Cissus Quadrangularis + Boswellia Serrata + Piperine + Hadjod", 560, 960],
  ["liver4", "Liverwort|Guggul + Sea Buck Thorn + Schindra + Eucalyptus", 340, 760],
];

fs.mkdirSync("scripts/_organic-caps/fix11", { recursive: true });
for (const [name, key, y0, y1] of items) {
  const rel = paths[key];
  const gitBuf = execFileSync("git", ["show", `HEAD:${rel}`], { maxBuffer: 30_000_000 });
  const buf = await sharp(gitBuf).resize({ width: 1728, height: 2304, kernel: "lanczos3" }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const top = y0;
  const height = y1 - y0;
  await sharp(buf.data, { raw: buf.info })
    .extract({ left: 400, top, width: 960, height })
    .resize({ width: 560 })
    .jpeg({ quality: 86 })
    .toFile(`scripts/_organic-caps/fix11/orig-${name}.jpg`);
  console.log("orig", name);
}
