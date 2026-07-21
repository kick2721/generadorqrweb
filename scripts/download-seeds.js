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
  "ab-testing.jpg": 265087,
  "ad-creative.jpg": 11553189,
  "adjustable-dumbbells.jpg": 3838389,
  "airpods-pro-3.jpg": 3825517,
  "analytics-audit.jpg": 7054415,
  "analytics.jpg": 572056,
  "android-app.jpg": 8296105,
  "api-development.jpg": 1972464,
  "app-maintenance.jpg": 33453386,
  "apple-watch-s11.jpg": 5081421,
  "asus-rog-ally-x.jpg": 14005916,
  "aviator-sunglasses.jpg": 32677214,
  "backpack.jpg": 13693103,
  "bag.jpg": 16690455,
  "bose-qc-ultra.jpg": 17664053,
  "brand-identity.jpg": 7598021,
  "brand-strategy.jpg": 5439481,
  "branding.jpg": 7598007,
  "business-strategy.jpg": 7693692,
  "canvas-backpack.jpg": 16359264,
  "cashmere-scarf.jpg": 7594722,
  "cashmere-sweater.jpg": 868113,
  "cicd-pipeline.jpg": 18784617,
  "classic-oxford-shirt.jpg": 708440,
  "cloud-migration.jpg": 5480781,
  "cloud.jpg": 4508751,
  "consulting.jpg": 36729965,
  "content-creation.jpg": 7911532,
  "corporate-website.jpg": 3183150,
  "creative.jpg": 30397433,
  "cross-platform-app.jpg": 9784247,
  "custom-dashboard.jpg": 139387,
  "custom-webapp.jpg": 3888149,
  "dashboard-ui.jpg": 577210,
  "data-strategy.jpg": 97080,
  "dell-xps-16.jpg": 3197390,
  "design-system.jpg": 27141314,
  "design.jpg": 37663439,
  "development.jpg": 37880001,
  "devops-retainer.jpg": 577585,
  "ecommerce-seo.jpg": 19856616,
  "ecommerce-store.jpg": 35560482,
  "electronics.jpg": 1448561,
  "espresso-machine.jpg": 29833130,
  "fashion.jpg": 298863,
  "fitbit-charge-6.jpg": 6846257,
  "folding-camping-chair.jpg": 13716425,
  "fractional-coo.jpg": 7433874,
  "galaxy-buds3-pro.jpg": 24029951,
  "galaxy-tab-s10-ultra.jpg": 106341,
  "galaxy-watch-8.jpg": 11895516,
  "garmin-forerunner-265.jpg": 11136242,
  "go-to-market.jpg": 38473091,
  "google-ads.jpg": 7662059,
  "headphones.jpg": 2919003,
  "hiking-backpack.jpg": 15409791,
  "home-kitchen.jpg": 35618208,
  "iac.jpg": 5489456,
  "influencer.jpg": 27086990,
  "ios-app.jpg": 226474,
  "ipad-pro-m4.jpg": 28608026,
  "jewelry.jpg": 29502924,
  "jbl-flip-7.jpg": 1706694,
  "jump-rope.jpg": 8691690,
  "landing-page.jpg": 7191162,
  "laptop.jpg": 129208,
  "leather-bomber-jacket.jpg": 10316827,
  "leather-crossbody-bag.jpg": 293229,
  "leather-watch.jpg": 2783873,
  "led-desk-lamp.jpg": 284951,
  "led-strip.jpg": 8108682,
  "linen-dress.jpg": 12108703,
  "local-seo.jpg": 5448160,
  "logo-design.jpg": 8546649,
  "macbook-air-m4.jpg": 4812932,
  "marketing.jpg": 6483592,
  "mobile-app.jpg": 6608248,
  "operations-audit.jpg": 9064799,
  "packaging-design.jpg": 8066785,
  "pixel-watch-3.jpg": 31541471,
  "resistance-bands.jpg": 14925384,
  "retargeting.jpg": 7605981,
  "robot-vacuum.jpg": 6856823,
  "running-shoes-cloud-6.jpg": 32082335,
  "scented-candle.jpg": 12349435,
  "seo-audit.jpg": 12969403,
  "seo-retainer.jpg": 577195,
  "seo.jpg": 6986455,
  "shoe.jpg": 292999,
  "silk-blouse.jpg": 35161370,
  "skinny-jeans.jpg": 2285500,
  "slim-fit-chinos.jpg": 9930085,
  "smart-air-fryer.jpg": 32928224,
  "smart-bulb.jpg": 11605252,
  "smart-fridge.jpg": 4933252,
  "smartwatch.jpg": 11947534,
  "sneakers.jpg": 17931134,
  "sneakers-urban-run.jpg": 2529148,
  "social-ads.jpg": 5361247,
  "social-growth.jpg": 7876379,
  "social-media.jpg": 16229745,
  "social-starter.jpg": 19399408,
  "sony-wh1000xm6.jpg": 14541034,
  "speaker.jpg": 9767551,
  "sports-outdoors.jpg": 7010129,
  "stand-mixer.jpg": 32450944,
  "strategy.jpg": 8970679,
  "tshirt.jpg": 8217431,
  "ux-audit.jpg": 196644,
  "visual-identity.jpg": 6474450,
  "water-bottle.jpg": 7879832,
  "web-design.jpg": 6373045,
  "web-perf.jpg": 14690386,
  "website-design.jpg": 18105,
  "wool-coat.jpg": 19768568,
  "yoga-mat.jpg": 36833317,
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
