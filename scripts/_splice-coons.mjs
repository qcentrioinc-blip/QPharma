import fs from "node:fs";

const p = "scripts/_cap-redo29.mjs";
const lines = fs.readFileSync(p, "utf8").split(/\n/);
const start = lines.findIndex((l) => l.trim() === "let cleared = 0;");
const end = lines.findIndex((l, i) => i > start && l.includes("const style = blackCap"));
if (start < 0 || end < 0) throw new Error(`${start} ${end}`);
const block = `
  let cleared = 0;
  let refNote = "coons";
  if (!blankFront) {
    const x0 = left + 18;
    const x1 = right - 18;
    const yTop = Math.max(2, y0);
    const yBot = Math.min(h - 3, y1);
    const at = (x, y, c) => src[(y * w + x) * 4 + c];
    const yN = yTop - 1;
    const yS = yBot + 1;
    const xW = x0 - 1;
    const xE = x1 + 1;
    for (let y = yTop; y <= yBot; y++) {
      const v = (y - yN) / (yS - yN);
      for (let x = x0; x <= x1; x++) {
        const u = (x - xW) / (xE - xW);
        const i = (y * w + x) * 4;
        for (let c = 0; c < 3; c++) {
          const val =
            (1 - u) * at(xW, y, c) +
            u * at(xE, y, c) +
            (1 - v) * at(x, yN, c) +
            v * at(x, yS, c) -
            (1 - u) * (1 - v) * at(xW, yN, c) -
            u * (1 - v) * at(xE, yN, c) -
            (1 - u) * v * at(xW, yS, c) -
            u * v * at(xE, yS, c);
          data[i + c] = Math.max(0, Math.min(255, Math.round(val)));
        }
        cleared++;
      }
    }
  }
`.trim().split("\n");
lines.splice(start, end - start, ...block);
fs.writeFileSync(p, lines.join("\n"));
console.log("replaced", start, end, "lines", lines.length);
