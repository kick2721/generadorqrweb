import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { SEEDS_BY_KIND } from "../src/lib/seed-data.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const envRaw = readFileSync(resolve(root, ".env.local"), "utf-8");
const env = Object.fromEntries(
  envRaw.split(/\r?\n/).filter(l => l.includes("=")).map(l => {
    const i = l.indexOf("=");
    return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
  })
);

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const { data: rows, error } = await supabase
  .from("catalog_items")
  .select("qr_id, template, blocks")
  .in("template", ["products", "services"]);

if (error) { console.error("Query error:", error.message); process.exit(1); }

const OLD_PATTERNS = ["categorize-design", "unsplash", "picsum"];
function isOldImage(url: string) {
  return OLD_PATTERNS.some(p => url?.includes(p));
}

function hasOldImages(blocks) {
  if (!blocks?.categories) return false;
  for (const cat of blocks.categories) {
    if (isOldImage(cat.image)) return true;
    for (const sub of cat.subcategories || []) {
      for (const item of sub.items || []) {
        if (isOldImage(item.image)) return true;
      }
    }
  }
  return false;
}

let fixed = 0, skipped = 0;
for (const row of rows) {
  if (!hasOldImages(row.blocks)) {
    skipped++;
    continue;
  }

  const seed = SEEDS_BY_KIND[row.template];
  if (!seed) { console.error(`No seed for template=${row.template}`); continue; }

  const newBlocks = {
    categories: seed.categories,
    info: seed.info,
    theme: seed.theme,
  };

  const { error: updErr } = await supabase
    .from("catalog_items")
    .update({ blocks: newBlocks })
    .eq("qr_id", row.qr_id);

  if (updErr) {
    console.error(`FAIL qr_id=${row.qr_id?.slice(0, 8)}: ${updErr.message}`);
  } else {
    console.log(`OK  qr_id=${row.qr_id?.slice(0, 8)} template=${row.template}`);
    fixed++;
  }
}

console.log(`\nDone: ${fixed} fixed, ${skipped} already OK`);
