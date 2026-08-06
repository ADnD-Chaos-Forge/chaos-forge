// Baut Karten für die magischen Gegenstände aus magic_items. Effekte werden aus
// dem magic_effects-JSONB gelesen und in lesbare Zeilen übersetzt; Artwork via
// Imagen, gecacht in cache/art-items/ (ein Bild pro Gegenstand, einmalig).
//
// Nutzung: node build-item-cards.mjs [--tarot70|--tarot] [--only=ring] [--force]
import { chromium } from "playwright";
import { GoogleGenAI } from "@google/genai";
import sharp from "sharp";
import { readFileSync, existsSync, mkdirSync, rmSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { supa, slug } from "./lib.mjs";
import { renderItemCard } from "./template-item.mjs";
import { TAROT_EPIC_FMT, IS_TAROT as TAROT, DIR_SUFFIX } from "./tarot.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const F = TAROT ? TAROT_EPIC_FMT : undefined;
const CW = F?.W ?? 768, CH = F?.H ?? 1146;
const A_W = TAROT ? 898 : 768, A_H = TAROT ? 610 : 470;
const SUF = TAROT ? "-tarot" : "";
const OUT = join(HERE, "out", `item-cards${TAROT ? DIR_SUFFIX : ""}`);
const ITEMART = join(HERE, "cache", "art-items");
[OUT, ITEMART].forEach((d) => mkdirSync(d, { recursive: true }));

const env = Object.fromEntries(
  readFileSync(join(ROOT, ".env.local"), "utf8")
    .split("\n").filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);
const genai = new GoogleGenAI({ apiKey: env.GOOGLE_API_KEY });
const STYLE =
  " — a single magic item as the clear subject, centered on dark stone, dark fantasy painterly digital illustration," +
  " deep indigo-purple atmosphere with teal and gold arcane light, dramatic rim lighting, highly detailed," +
  " no people, no hands, no text, no letters, no words.";

// Kategorie → Akzentfarbe (wie die Klassengruppen im übrigen Set) + Bildmotiv.
const CAT = {
  Ring: { a: ["#e0b24e", "#a1782f"], art: "an ornate magical ring" },
  Amulet: { a: ["#e0b24e", "#a1782f"], art: "an ornate magical amulet on a chain" },
  Potion: { a: ["#3ec7bd", "#0d7d75"], art: "a glass potion vial with luminous liquid" },
  Cloak: { a: ["#5b8def", "#2f4fa0"], art: "a flowing enchanted cloak" },
  Boots: { a: ["#5b8def", "#2f4fa0"], art: "a pair of enchanted leather boots" },
  Bracers: { a: ["#e0524e", "#8f2f2b"], art: "a pair of enchanted bracers" },
  Belt: { a: ["#e0524e", "#8f2f2b"], art: "a broad enchanted belt with a heavy buckle" },
  Rod: { a: ["#3ec7bd", "#0d7d75"], art: "an ornate magical rod" },
  Wand: { a: ["#3ec7bd", "#0d7d75"], art: "a slender magical wand" },
  Wondrous: { a: ["#e0b24e", "#a1782f"], art: "a wondrous enchanted object" },
};

const sgn = (n) => (n >= 0 ? `+${n}` : `${n}`);

// magic_effects → Zeilen für die Karte. AD&D nutzt absteigende AC, ein
// ac_bonus von -1 ist also eine Verbesserung um 1 und wird auch so gezeigt.
function effectLines(fx) {
  const out = [];
  if (typeof fx.ac_bonus === "number") out.push({ label: "Armor Class", value: `${sgn(-fx.ac_bonus)} (AC ${sgn(fx.ac_bonus)})` });
  if (typeof fx.save_all === "number") out.push({ label: "All Saves", value: sgn(fx.save_all) });
  if (typeof fx.save_vs_breath === "number") out.push({ label: "Save vs. Breath", value: sgn(fx.save_vs_breath) });
  if (typeof fx.save_vs_spell === "number") out.push({ label: "Save vs. Spell", value: sgn(fx.save_vs_spell) });
  if (typeof fx.save_vs_poison === "number") out.push({ label: "Save vs. Poison", value: sgn(fx.save_vs_poison) });
  if (typeof fx.movement_bonus === "number") out.push({ label: "Movement", value: sgn(fx.movement_bonus) });
  if (typeof fx.hide_in_shadows === "number") out.push({ label: "Hide in Shadows", value: `${fx.hide_in_shadows}%` });
  if (typeof fx.move_silently === "number") out.push({ label: "Move Silently", value: `${fx.move_silently}%` });
  if (fx.stat_overrides) {
    for (const [k, v] of Object.entries(fx.stat_overrides)) {
      if (k === "str_exceptional") continue; // wird an STR angehängt
      const exc = k === "str" && fx.stat_overrides.str_exceptional;
      out.push({ label: k.toUpperCase(), value: exc ? `${v}/${exc === 100 ? "00" : exc}` : String(v) });
    }
  }
  if (typeof fx.max_charges === "number") out.push({ label: "Charges", value: `${fx.current_charges ?? fx.max_charges} / ${fx.max_charges}` });
  for (const r of fx.resistances || []) out.push({ label: "Resistance", value: r });
  return out;
}

function noteLines(fx) {
  const out = [];
  for (const p of fx.passive_abilities || []) out.push(p);
  for (const s of fx.spell_abilities || []) out.push(`${s.name_en || s.name}: ${s.description_en || s.description}`);
  const d = fx.description_en || fx.description;
  if (d && !out.some((o) => o.includes(d))) out.push(d);
  return out;
}

async function artB64(key, prompt) {
  const f = join(ITEMART, `${key}${SUF}.webp`);
  const srcCache = join(ITEMART, `${key}.src.webp`);
  if (!existsSync(f) || process.argv.includes("--force")) {
    let srcBuf;
    if (existsSync(srcCache)) {
      srcBuf = readFileSync(srcCache); // Original wiederverwenden, keine neue Quota
    } else {
      const r = await genai.models.generateImages({
        model: "imagen-4.0-generate-001",
        prompt: prompt + STYLE,
        config: { numberOfImages: 1, aspectRatio: "4:3" },
      });
      const b64 = r.generatedImages?.[0]?.image?.imageBytes;
      if (!b64) throw new Error("kein Artwork für " + key);
      srcBuf = Buffer.from(b64, "base64");
      await sharp(srcBuf).webp({ quality: 95 }).toFile(srcCache);
    }
    await sharp(srcBuf).resize(A_W, A_H, { fit: "cover", position: "attention" }).webp({ quality: 88 }).toFile(f);
  }
  return readFileSync(f).toString("base64");
}

const sb = supa();
const { data: items } = await sb.from("magic_items").select("*").order("category").order("name");

const ONLY = process.argv.find((a) => a.startsWith("--only="))?.split("=")[1]?.toLowerCase();
// Beim Vollauf den Ordner leeren: die Karten sind durchnummeriert, ein Rest aus
// einem früheren --only-Lauf trüge sonst eine alte Nummer und liefe als Dublette
// ins Druckpaket.
if (!ONLY) { rmSync(OUT, { recursive: true, force: true }); mkdirSync(OUT, { recursive: true }); }
// Dublette in der DB: "Ring des Schutzes (Ring)" ist eine unvollständige Kopie
// von "Ring of Protection +1" (nur ac_bonus, ohne save_all) und ohne name_en.
// Zwei Karten für denselben Ring wären am Spieltisch nur verwirrend.
const SKIP = new Set(["Ring des Schutzes (Ring)"]);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: CW, height: CH }, deviceScaleFactor: 1 });
let n = 0;
for (const it of items) {
  const name = (it.name_en || it.name).trim();
  if (SKIP.has(it.name)) { console.log(`  – übersprungen (Dublette): ${it.name}`); continue; }
  if (ONLY && !name.toLowerCase().includes(ONLY)) continue;
  const cat = CAT[it.category] || CAT.Wondrous;
  const key = slug(name);
  const fx = it.magic_effects || {};
  const b64 = await artB64(key, `${cat.art}, ${name}`);
  const footer = [it.source_book, it.weight ? `${it.weight} kg` : null].filter(Boolean).join(" · ");
  const card = (artH) =>
    renderItemCard({
      name, category: it.category, artB64: b64,
      accent: cat.a[0], accent2: cat.a[1],
      effects: effectLines(fx), notes: noteLines(fx), footer,
      fmt: artH ? { ...F, artH, bodyTop: artH - 14 } : F,
    });

  // Zweistufig: erst messen, wie viel Text die Karte wirklich braucht, dann das
  // Artwork den gesamten Rest einnehmen lassen. Ein Ring mit zwei Effektzeilen
  // bekommt so ein großes Bild statt einer halbleeren unteren Kartenhälfte.
  await page.setContent(card(null), { waitUntil: "networkidle" });
  const needed = await page.evaluate(() => {
    const b = document.querySelector(".body");
    return [...b.children].reduce((sum, el) => sum + el.offsetHeight, 0) + 44; // 44 = Abstände der .rule
  });
  const artH = Math.max(520, Math.min(1010, CH - (F?.bodyBottom ?? 78) - needed - 36));
  await page.setContent(card(artH), { waitUntil: "networkidle" });
  await page.screenshot({ path: join(OUT, `${String(++n).padStart(2, "0")}_${key}.png`), clip: { x: 0, y: 0, width: CW, height: CH } });
  const over = await page.evaluate(() => {
    const b = document.querySelector(".body");
    return b.scrollHeight - b.clientHeight;
  });
  console.log(`  ✓ ${name}${over > 4 ? `   ⚠ ${over}px Überlauf` : ""}`);
}
await browser.close();
console.log(`\nFertig: ${n} Item-Karten → ${OUT}`);
