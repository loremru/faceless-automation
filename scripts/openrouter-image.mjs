#!/usr/bin/env node
// Generate one image via OpenRouter chat-completions (image modality).
// Reads OPENROUTER_API_KEY from <repo>/.env (simple KEY=VALUE parser).
//
// Usage:
//   node scripts/openrouter-image.mjs \
//     --model <openrouter-image-model-slug> \
//     --prompt-file /abs/prompt.txt \
//     [--negative-file /abs/negative.txt] \
//     [--size 1024x1820] \
//     --out /abs/result.png
//
// Exit codes:
//   0 ok | 2 config | 3 network/api | 4 no image returned

import { readFile, writeFile, rename, mkdir } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

function die(code, msg) {
  process.stderr.write(`openrouter-image: ${msg}\n`);
  process.exit(code);
}

function parseArgs(argv) {
  const out = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const k = a.slice(2);
    const v = argv[i + 1];
    if (v === undefined || v.startsWith("--")) {
      out[k] = true;
    } else {
      out[k] = v;
      i++;
    }
  }
  return out;
}

function loadEnv(repoRoot) {
  const envPath = join(repoRoot, ".env");
  if (!existsSync(envPath)) return {};
  const raw = readFileSync(envPath, "utf8");
  const env = {};
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    env[k] = v;
  }
  return env;
}

const args = parseArgs(process.argv);
const promptFile = args["prompt-file"];
const negativeFile = args["negative-file"];
const size = args.size || "1024x1820";
const outPath = args.out;

if (!promptFile) die(2, "missing --prompt-file");
if (!outPath) die(2, "missing --out");
if (!/^\d+x\d+$/.test(size)) die(2, `invalid --size "${size}", expected WxH`);

const env = { ...loadEnv(REPO_ROOT), ...process.env };
const apiKey = env.OPENROUTER_API_KEY;
if (!apiKey) die(2, "OPENROUTER_API_KEY not set in .env or environment");

const model = args.model || env.OPENROUTER_IMAGE_MODEL;
if (!model) die(2, "missing --model and OPENROUTER_IMAGE_MODEL not set in .env");

let promptBody;
try {
  promptBody = (await readFile(promptFile, "utf8")).trim();
} catch (e) {
  die(2, `cannot read --prompt-file ${promptFile}: ${e.message}`);
}
if (!promptBody) die(2, "prompt file is empty");

let negative = "";
if (negativeFile) {
  try {
    negative = (await readFile(negativeFile, "utf8")).trim();
  } catch (e) {
    die(2, `cannot read --negative-file ${negativeFile}: ${e.message}`);
  }
}

const userText =
  `${promptBody}\n\nRender at exactly ${size} px.` +
  (negative ? `\n\nAvoid: ${negative}` : "");

const body = {
  model,
  modalities: ["image", "text"],
  messages: [{ role: "user", content: [{ type: "text", text: userText }] }],
};

let resp;
try {
  resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://localhost/carousel",
      "X-Title": "carousel-generate",
    },
    body: JSON.stringify(body),
  });
} catch (e) {
  die(3, `network error: ${e.message}`);
}

if (!resp.ok) {
  const text = await resp.text().catch(() => "");
  die(3, `openrouter ${resp.status}: ${text.slice(0, 500)}`);
}

let json;
try {
  json = await resp.json();
} catch (e) {
  die(3, `invalid json from openrouter: ${e.message}`);
}

const choice = json?.choices?.[0]?.message;
if (!choice) die(4, `no choice in response: ${JSON.stringify(json).slice(0, 500)}`);

// OpenRouter image-output convention: image lives in message.images[0].image_url.url
// (data: URL), with fallback to content blocks of type "image_url".
function findImageDataUrl(message) {
  if (Array.isArray(message.images) && message.images.length) {
    const img = message.images[0];
    const url = img?.image_url?.url || img?.url;
    if (typeof url === "string") return url;
  }
  if (Array.isArray(message.content)) {
    for (const part of message.content) {
      if (part?.type === "image_url" && typeof part.image_url?.url === "string") {
        return part.image_url.url;
      }
      if (part?.type === "output_image" && typeof part.image_url === "string") {
        return part.image_url;
      }
    }
  }
  return null;
}

const dataUrl = findImageDataUrl(choice);
if (!dataUrl) die(4, `no image in response (model "${model}" may not support image output)`);

let bytes;
if (dataUrl.startsWith("data:")) {
  const comma = dataUrl.indexOf(",");
  if (comma < 0) die(4, "malformed data URL");
  const b64 = dataUrl.slice(comma + 1);
  bytes = Buffer.from(b64, "base64");
} else if (dataUrl.startsWith("http")) {
  try {
    const r = await fetch(dataUrl);
    if (!r.ok) die(3, `image fetch ${r.status}`);
    bytes = Buffer.from(await r.arrayBuffer());
  } catch (e) {
    die(3, `image fetch failed: ${e.message}`);
  }
} else {
  die(4, `unrecognized image URL: ${dataUrl.slice(0, 80)}`);
}

await mkdir(dirname(outPath), { recursive: true });
const tmp = `${outPath}.tmp`;
await writeFile(tmp, bytes);
await rename(tmp, outPath);

process.stdout.write(
  JSON.stringify({
    ok: true,
    model,
    bytes: bytes.length,
    path: outPath,
    openrouter_id: json?.id ?? null,
  }) + "\n"
);
