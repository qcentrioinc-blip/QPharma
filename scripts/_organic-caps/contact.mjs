import fs from "node:fs";
import sharp from "sharp";

const dir = "scripts/_organic-caps";
const files = fs
  .readdirSync(dir)
  .filter((name) => /^\d\d-/.test(name))
  .sort();
const cellW = 280;
const cellH = 160;
const cols = 5;
const labelH = 18;
for (let sheet = 0; sheet < 2; sheet++) {
  const slice = files.slice(sheet * 25, sheet * 25 + 25);
  const rows = Math.ceil(slice.length / cols);
  const composites = [];
  for (let i = 0; i < slice.length; i++) {
    const buf = await sharp(`${dir}/${slice[i]}`)
      .resize({ width: cellW, height: cellH, fit: "cover" })
      .jpeg()
      .toBuffer();
    composites.push({
      input: buf,
      left: (i % cols) * cellW,
      top: Math.floor(i / cols) * (cellH + labelH) + labelH,
    });
  }
  const canvas = sharp({
    create: {
      width: cols * cellW,
      height: rows * (cellH + labelH),
      channels: 3,
      background: "#111",
    },
  });
  await canvas.composite(composites).jpeg({ quality: 70 }).toFile(`${dir}/probe/sheet-${sheet}.jpg`);
  console.log("sheet", sheet, slice.join(" "));
}
