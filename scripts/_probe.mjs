import sharp from "sharp";

const files = {
  hes: "scripts/_pack-fix/fix-hes.jpg",
  hp: "scripts/_pack-fix/fix-hes-hp.jpg",
  gl: "scripts/_pack-fix/fix-gin-l.jpg",
  gr: "scripts/_pack-fix/fix-gin-r.jpg",
  headL: "scripts/_pack-fix/gin-l-head.jpg",
  nowL: "scripts/_pack-fix/gin-l-now.jpg",
};

for (const [name, file] of Object.entries(files)) {
  const img = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { data, info } = img;
  console.log("\n==", name, info.width, info.height);
  const stepY = Math.max(8, Math.floor(info.height / 18));
  const stepX = Math.max(8, Math.floor(info.width / 28));
  for (let y = 4; y < info.height; y += stepY) {
    let line = String(y).padStart(4) + " ";
    for (let x = 4; x < info.width; x += stepX) {
      const i = (y * info.width + x) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const l = Math.round((r + g + b) / 3);
      const mark = g > r + 12 && g > 80 ? "G" : b > g + 6 ? "V" : l > 220 ? "W" : l < 140 ? "d" : ".";
      line += mark;
    }
    console.log(line);
  }
}
