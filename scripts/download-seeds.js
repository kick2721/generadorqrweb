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
  "headphones.jpg": 815494,
  "speaker.jpg": 9767551,
  "smartwatch.jpg": 5083218,
  "laptop.jpg": 205420,
  "fashion.jpg": 298863,
  "tshirt.jpg": 14534753,
  "shoe.jpg": 10657971,
  "sneakers.jpg": 4495408,
  "bag.jpg": 6650001,
  "jewelry.jpg": 1453008,
  "backpack.jpg": 18269634,
  "home-kitchen.jpg": 4221389,
  "sports-outdoors.jpg": 3822365,

  // --- SERVICIOS ---
  "marketing.jpg": 7414209,
  "seo.jpg": 927576,
  "social-media.jpg": 7550307,
  "creative.jpg": 693859,
  "design.jpg": 326518,
  "branding.jpg": 4735885,
  "web-design.jpg": 574069,
  "development.jpg": 6424585,
  "mobile-app.jpg": 7661072,
  "cloud.jpg": 4508751,
  "consulting.jpg": 7413845,
  "strategy.jpg": 7947757,
  "analytics.jpg": 577210,
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
