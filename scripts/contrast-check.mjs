#!/usr/bin/env node
// scripts/contrast-check.mjs
//
// Pre-publish контраст-чек для карусели.
//
// Usage:
//   node scripts/contrast-check.mjs result/<N>
//
// Читает result/<N>/meta.json. Для каждого слайда с "text": true считает
// WCAG-ratio средней яркости bbox-фона (под текстом) против цвета текста (--fg)
// и акцента (--accent). Если slide.bbox отсутствует — берёт прямоугольник
// нижней половины слайда (эвристика по умолчанию для карусели, где текст внизу).
//
// Вывод — одна строка JSON со списком слайдов и общим pass/fail.
//
// Зависимости: ImageMagick (`magick`) на PATH.

import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve, join } from "node:path";

const dir = process.argv[2];
if (!dir) {
  console.error("usage: node scripts/contrast-check.mjs result/<N>");
  process.exit(2);
}

const root = resolve(dir);
const metaPath = join(root, "meta.json");
if (!existsSync(metaPath)) {
  console.error(`meta.json not found at ${metaPath}`);
  process.exit(2);
}

const meta = JSON.parse(readFileSync(metaPath, "utf8"));
const [W, H] = (meta.size || "1080x1350").split("x").map(Number);

// Theme tokens — light vs dark по contrast_strategy в meta.json (если skill его туда положит)
// или эвристике: для time-squats* — dark; для time-squats-female* — light.
const strategy = meta.contrast_strategy
  || (String(meta.theme || meta.brand || "").includes("female") ? "light-on-light" : "dark-on-dark");

const FG = meta.fg_hex || (strategy === "light-on-light" ? "#1E1A14" : "#FFFFFF");
const ACCENT = meta.accent_hex || (strategy === "light-on-light" ? "#D85E32" : "#B0E821");

function relLum(hex) {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  const t = (v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * t(r) + 0.7152 * t(g) + 0.0722 * t(b);
}

function ratio(L1, L2) {
  const a = Math.max(L1, L2);
  const b = Math.min(L1, L2);
  return (a + 0.05) / (b + 0.05);
}

function avgPixel(imgPath, x, y, w, h) {
  // crop region, downsample to 1x1, read RGB. ImageMagick can emit either
  // "srgb(123,45,67)" or "srgb(48.2%,17.6%,26.3%)" depending on Q-depth — handle both.
  const fmt = "%[pixel:p{0,0}]";
  const out = execFileSync(
    "magick",
    [imgPath, "-crop", `${w}x${h}+${x}+${y}`, "+repage", "-resize", "1x1!", "-format", fmt, "info:"],
    { encoding: "utf8" },
  ).trim();
  const m = out.match(/srgba?\(([^,]+),\s*([^,]+),\s*([^,)]+)/i);
  if (!m) throw new Error(`magick avg parse failed: ${out}`);
  const parse = (s) => {
    s = s.trim();
    if (s.endsWith("%")) return Math.round(parseFloat(s) * 2.55);
    return Math.round(parseFloat(s));
  };
  const [r, g, b] = [m[1], m[2], m[3]].map(parse);
  return { r, g, b, hex: "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("") };
}

const fgL = relLum(FG);
const accentL = relLum(ACCENT);

const results = [];
let allPass = true;

for (const slide of meta.slides) {
  if (slide.text === false) {
    results.push({ n: slide.n, skipped: "no text overlay" });
    continue;
  }
  const slideFile = join(root, "inst", String(slide.n).padStart(2, "0") + ".png");
  if (!existsSync(slideFile)) {
    results.push({ n: slide.n, error: `missing ${slideFile}` });
    allPass = false;
    continue;
  }

  // bbox: explicit from meta, else heuristic — bottom 40% of slide, padded 88px from edges.
  const b = slide.bbox || {
    x: 88,
    y: Math.round(H * 0.55),
    w: W - 88 * 2,
    h: Math.round(H * 0.35),
  };

  const px = avgPixel(slideFile, b.x, b.y, b.w, b.h);
  const bgL = relLum(px.hex);
  const ratioFg = ratio(bgL, fgL);
  const ratioAccent = ratio(bgL, accentL);

  const passFg = ratioFg >= 4.5;
  const passAccent = ratioAccent >= 3.0; // accent only used at large display sizes
  const slidePass = passFg && passAccent;
  if (!slidePass) allPass = false;

  results.push({
    n: slide.n,
    bbox: b,
    bg_avg_hex: px.hex,
    ratio_fg: +ratioFg.toFixed(2),
    ratio_accent: +ratioAccent.toFixed(2),
    pass_fg: passFg,
    pass_accent: passAccent,
    pass: slidePass,
  });
}

const summary = {
  ok: allPass,
  size: meta.size,
  contrast_strategy: strategy,
  fg: FG,
  accent: ACCENT,
  slides: results,
};

console.log(JSON.stringify(summary, null, 2));
process.exit(allPass ? 0 : 1);
