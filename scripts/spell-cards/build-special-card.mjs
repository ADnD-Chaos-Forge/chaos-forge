// Sonderkarte: ein Zitat auf einem eigenen Artwork statt auf leerem Grund.
// Für die Sprüche, die eine Bühne verdienen.
//
// Nutzung: node build-special-card.mjs [--tarot70|--tarot] [--force]
import { chromium } from "playwright";
import sharp from "sharp";
import { readFileSync, existsSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { escapeHtml, fontFaceCss } from "./lib.mjs";
import { generateImage } from "./generate-image.mjs";
import { checkArt } from "./check-art.mjs";
import { TAROT_REF_FMT, IS_TAROT as TAROT, DIR_SUFFIX } from "./tarot.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const CW = TAROT ? TAROT_REF_FMT.W : 768, CH = TAROT ? TAROT_REF_FMT.H : 1146;
const OUT = join(HERE, "out", `special-cards${TAROT ? DIR_SUFFIX : ""}`);
const ART = join(HERE, "cache", "art-items");
[OUT, ART].forEach((d) => mkdirSync(d, { recursive: true }));
const FONT_CSS = fontFaceCss();

const CARD = {
  key: "labskaus",
  quote: "East Coast, West Coast, Labskaus",
  who: "Chronik des Chaos",
  // Der Spruch verschraubt die Rapper-Fehde der US-Küsten mit einem
  // norddeutschen Seemannsgericht — das Bild nimmt genau diesen Zusammenprall
  // auf. Menschen sind hier ausdrücklich erwünscht, anders als bei den
  // Gegenstandskarten.
  prompt:
    "A jovial bearded dwarven sailor in a torchlit harbour tavern, striking a confident hip-hop pose with " +
    "crossed arms and heavy gold chains over his weathered seafarer's coat, a steaming tin plate of labskaus " +
    "(mashed potato hash with beetroot, pickled herring and a fried egg on top) held up proudly in one hand. " +
    "Two rival crews of sailors glower at each other in the smoky background, tankards raised. " +
    "Warm amber lantern light against deep indigo shadows, dark fantasy painterly digital illustration, " +
    "humorous and larger than life, richly detailed. No text, no letters, no numbers, no watermark.",
};

async function artB64() {
  const f = join(ART, `special-${CARD.key}${TAROT ? "-tarot" : ""}.webp`);
  const src = join(ART, `special-${CARD.key}.src.webp`);
  if (!existsSync(f) || process.argv.includes("--force")) {
    let buf;
    if (existsSync(src) && !process.argv.includes("--force")) {
      buf = readFileSync(src);
    } else {
      for (let attempt = 1; attempt <= 4; attempt++) {
        const candidate = await generateImage(CARD.prompt, { aspectRatio: "3:4" });
        // Nur auf Text prüfen — Menschen gehören hier ins Bild.
        const check = await checkArt(candidate, "a jovial dwarven sailor in a tavern holding a plate of food");
        if (!check.detail?.has_real_text) {
          buf = candidate;
          console.log(`  Bildprüfung ok (Versuch ${attempt}): ${check.detail?.subject_seen ?? ""}`);
          break;
        }
        console.log(`  Versuch ${attempt} verworfen: Text im Bild — ${check.reason}`);
      }
      if (!buf) throw new Error("kein brauchbares Bild nach 4 Versuchen");
      await sharp(buf).webp({ quality: 95 }).toFile(src);
    }
    await sharp(buf).resize(CW, CH, { fit: "cover", position: "attention" }).webp({ quality: 90 }).toFile(f);
  }
  return readFileSync(f).toString("base64");
}

const b64 = await artB64();
const fs = TAROT ? 1.28 : 1;
const px = (n) => Math.round(n * fs);

const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>
${FONT_CSS}
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:${CW}px;height:${CH}px;}
body{position:relative;overflow:hidden;font-family:'EB Garamond',Georgia,serif;color:#f6f0e4;--gold:#e0b24e;}
.art{position:absolute;inset:0;background:#100b18 center/cover no-repeat;
  background-image:url(data:image/webp;base64,${b64});}
/* Das Zitat sitzt auf dem Bild — der Verlauf legt ihm einen dunklen Grund
   unter, ohne das Motiv zuzudecken. */
.art::after{content:"";position:absolute;inset:0;
  background:linear-gradient(180deg,rgba(16,11,24,.55) 0%,rgba(16,11,24,.15) 28%,rgba(16,11,24,.62) 58%,rgba(16,11,24,.94) 82%,#100b18 100%);}
.frame{position:absolute;left:66px;top:66px;right:66px;bottom:66px;border-radius:22px;
  border:2px solid color-mix(in srgb,var(--gold) 70%,#3a3350);
  box-shadow:0 0 0 1px rgba(0,0,0,.55) inset,0 0 60px rgba(0,0,0,.6) inset;pointer-events:none;z-index:3;}
.frame::before{content:"";position:absolute;inset:7px;border-radius:16px;border:1px solid color-mix(in srgb,var(--gold) 38%,transparent);}
.tag{position:absolute;top:${px(104)}px;left:50%;transform:translateX(-50%);z-index:3;
  font:600 ${px(16)}px/1 'EB Garamond',serif;letter-spacing:.34em;text-transform:uppercase;
  color:var(--gold);text-shadow:0 2px 10px rgba(0,0,0,.8);}
.body{position:absolute;left:${px(96)}px;right:${px(96)}px;bottom:${px(150)}px;z-index:3;
  display:flex;flex-direction:column;align-items:center;gap:${px(26)}px;text-align:center;}
.q{font-family:'Cinzel',serif;font-weight:700;font-size:${px(58)}px;line-height:1.14;color:#fdf8ec;
  text-wrap:balance;text-shadow:0 3px 18px rgba(0,0,0,.85),0 1px 3px rgba(0,0,0,.9);}
.by{display:flex;flex-direction:column;align-items:center;gap:${px(9)}px;}
.by .line{width:${px(120)}px;height:2px;background:linear-gradient(90deg,transparent,var(--gold),transparent);}
.by .who{font:600 ${px(17)}px/1 'EB Garamond',serif;letter-spacing:.2em;text-transform:uppercase;
  color:#e8dcc6;text-shadow:0 2px 8px rgba(0,0,0,.8);}
.foot{position:absolute;left:${px(96)}px;right:${px(96)}px;bottom:${px(96)}px;z-index:3;
  display:flex;justify-content:center;font:600 ${px(14)}px/1 'EB Garamond',serif;
  letter-spacing:.16em;text-transform:uppercase;color:var(--gold);opacity:.85;}
</style></head><body>
<div class="art"></div><div class="frame"></div>
<div class="tag">Special</div>
<div class="body">
  <div class="q">${escapeHtml(CARD.quote)}</div>
  <div class="by"><span class="line"></span><span class="who">${escapeHtml(CARD.who)}</span></div>
</div>
<div class="foot">Chaos Forge</div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: CW, height: CH }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: "networkidle" });
await page.screenshot({ path: join(OUT, `01_${CARD.key}.png`), clip: { x: 0, y: 0, width: CW, height: CH } });
await browser.close();
console.log(`✓ Sonderkarte "${CARD.quote}" → ${OUT}/01_${CARD.key}.png`);
