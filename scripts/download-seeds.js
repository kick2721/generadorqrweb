import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const envRaw = readFileSync(resolve(root, ".env.local"), "utf-8");
const env = Object.fromEntries(
  envRaw.split("\n").filter(l => l.includes("=")).map(l => {
    const [k, ...v] = l.split("=");
    return [k.trim(), v.join("=").trim()];
  })
);

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, serviceRoleKey);

const FILES = {
  // --- PRODUCTOS ---
  "electronics.jpg": 1448561,
  "headphones.jpg": 2919003,
  "speaker.jpg": 9767551,
  "smartwatch.jpg": 11947534,
  "laptop.jpg": 129208,
  "fashion.jpg": 298863,
  "tshirt.jpg": 8217431,
  "shoe.jpg": 292999,
  "sneakers.jpg": 17931134,
  "bag.jpg": 16690455,
  "jewelry.jpg": 29502924,
  "backpack.jpg": 13693103,
  "home-kitchen.jpg": 35618208,
  "sports-outdoors.jpg": 7010129,

  // --- SERVICIOS ---
  "marketing.jpg": 6483592,
  "seo.jpg": 106341,
  "social-media.jpg": 16229745,
  "creative.jpg": 30397433,
  "design.jpg": 37663439,
  "branding.jpg": 7598007,
  "web-design.jpg": 6373045,
  "development.jpg": 37880001,
  "mobile-app.jpg": 6608248,
  "cloud.jpg": 4508751,
  "consulting.jpg": 36729965,
  "strategy.jpg": 8970679,
  "analytics.jpg": 572056,
};

const dir = resolve(root, "seed-images");
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

async function downloadAll() {
  let ok = 0, err = 0;
  for (const [name, id] of Object.entries(FILES)) {
    const url = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg`;
    const filePath = resolve(dir, name);
    try {
      const resp = await fetch(url);
      if (!resp.ok) { console.error(`FAIL ${name}: HTTP ${resp.status}`); err++; continue; }
      const buf = Buffer.from(await resp.arrayBuffer());
      writeFileSync(filePath, buf);
      const sizeKb = (buf.length / 1024).toFixed(1);
      console.log(`OK  ${name} (${sizeKb} KB)`);
      ok++;
    } catch (e) {
      console.error(`FAIL ${name}: ${e.message}`);
      err++;
    }
  }
  console.log(`\nDownloaded: ${ok} ok, ${err} err`);

  if (err > 0) {
    console.log("Some downloads failed, aborting upload");
    return;
  }

  const files = readdirSync(dir).filter(f => f.endsWith(".jpg"));
  let uok = 0, uerr = 0;
  for (const file of files) {
    const buffer = readFileSync(resolve(dir, file));
    const path = `seed/${file}`;
    const { error } = await supabase.storage.from("catalog-images").upload(path, buffer, {
      contentType: "image/jpeg",
      upsert: true,
    });
    if (error) {
      console.error(`UPL FAIL ${file}: ${error.message}`);
      uerr++;
    } else {
      console.log(`UPL OK  ${file}`);
      uok++;
    }
  }
  console.log(`\nUploaded: ${uok} ok, ${uerr} err`);
}

downloadAll();
