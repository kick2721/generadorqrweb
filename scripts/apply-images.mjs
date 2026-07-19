import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// ===== ALL NEW PEXELS IMAGE IDs =====
const NEW_IDS = {
  // ---- ELECTRONICS ----
  "sony-wh1000xm6.jpg": 14541034,
  "airpods-pro-3.jpg": 3825517,
  "bose-qc-ultra.jpg": 17664053,
  "galaxy-buds3-pro.jpg": 24029951,
  "apple-watch-s11.jpg": 5081421,
  "galaxy-watch-8.jpg": 11895516,
  "garmin-forerunner-265.jpg": 11136242,
  "fitbit-charge-6.jpg": 6846257,
  "pixel-watch-3.jpg": 31541471,
  "macbook-air-m4.jpg": 4812932,
  "ipad-pro-m4.jpg": 28608026,
  "galaxy-tab-s10-ultra.jpg": 106341,
  "dell-xps-16.jpg": 3197390,
  "asus-rog-ally-x.jpg": 14005916,

  // ---- FASHION ----
  "classic-oxford-shirt.jpg": 708440,
  "slim-fit-chinos.jpg": 9930085,
  "leather-bomber-jacket.jpg": 10316827,
  "cashmere-sweater.jpg": 868113,
  "linen-dress.jpg": 12108703,
  "skinny-jeans.jpg": 2285500,
  "wool-coat.jpg": 19768568,
  "silk-blouse.jpg": 35161370,
  "aviator-sunglasses.jpg": 32677214,
  "cashmere-scarf.jpg": 7594722,

  // ---- HOME & KITCHEN ----
  "smart-air-fryer.jpg": 32928224,
  "espresso-machine.jpg": 29833130,
  "robot-vacuum.jpg": 6856823,
  "stand-mixer.jpg": 32450944,
  "smart-fridge.jpg": 4933252,
  "smart-bulb.jpg": 11605252,
  "led-desk-lamp.jpg": 284951,
  "led-strip.jpg": 8108682,
  "scented-candle.jpg": 12349435,

  // ---- SPORTS ----
  "adjustable-dumbbells.jpg": 3838389,
  "yoga-mat.jpg": 36833317,
  "resistance-bands.jpg": 14925384,
  "jump-rope.jpg": 8691690,
  "water-bottle.jpg": 7879832,
  "folding-camping-chair.jpg": 13716425,
  "hiking-backpack.jpg": 15409791,

  // ---- MARKETING ----
  "seo-audit.jpg": 12969403,
  "seo-retainer.jpg": 577195,
  "local-seo.jpg": 5448160,
  "ecommerce-seo.jpg": 19856616,
  "google-ads.jpg": 7662059,
  "social-ads.jpg": 5361247,
  "retargeting.jpg": 7605981,
  "ad-creative.jpg": 11553189,
  "social-starter.jpg": 19399408,
  "social-growth.jpg": 7876379,
  "content-creation.jpg": 7911532,
  "influencer.jpg": 27086990,

  // ---- DESIGN ----
  "logo-design.jpg": 8546649,
  "brand-identity.jpg": 7598021,
  "brand-strategy.jpg": 5439481,
  "visual-identity.jpg": 6474450,
  "packaging-design.jpg": 8066785,
  "landing-page.jpg": 7191162,
  "website-design.jpg": 18105,
  "ux-audit.jpg": 196644,
  "dashboard-ui.jpg": 577210,
  "design-system.jpg": 27141314,

  // ---- DEVELOPMENT ----
  "corporate-website.jpg": 39559,
  "ecommerce-store.jpg": 35560482,
  "custom-webapp.jpg": 3888149,
  "api-development.jpg": 1972464,
  "web-perf.jpg": 14690386,
  "ios-app.jpg": 226474,
  "android-app.jpg": 8296105,
  "cross-platform-app.jpg": 9784247,
  "app-maintenance.jpg": 33453386,
  "cloud-migration.jpg": 5480781,
  "cicd-pipeline.jpg": 18784617,
  "iac.jpg": 5489456,
  "devops-retainer.jpg": 577585,

  // ---- CONSULTING ----
  "business-strategy.jpg": 7693692,
  "go-to-market.jpg": 38473091,
  "operations-audit.jpg": 9064799,
  "fractional-coo.jpg": 7433874,
  "data-strategy.jpg": 97080,
  "analytics-audit.jpg": 7054415,
  "custom-dashboard.jpg": 34069,
  "ab-testing.jpg": 265087,
};

// ===== UPDATE download-seeds.js =====
let download = readFileSync(resolve(root, "scripts", "download-seeds.js"), "utf-8");

// Replace the FILES object - find it and rebuild it
const filesStart = download.indexOf("const FILES = {");
const filesEnd = download.indexOf("};", filesStart) + 2;

// Build new FILES object: keep existing + add new ones
const existingFiles = [
  // Products - category images
  ["electronics.jpg", 1448561],
  ["headphones.jpg", 2919003],
  ["speaker.jpg", 9767551],
  ["smartwatch.jpg", 11947534],
  ["laptop.jpg", 129208],
  ["fashion.jpg", 298863],
  ["tshirt.jpg", 8217431],
  ["shoe.jpg", 292999],
  ["sneakers.jpg", 17931134],
  ["bag.jpg", 16690455],
  ["jewelry.jpg", 29502924],
  ["backpack.jpg", 13693103],
  ["home-kitchen.jpg", 35618208],
  ["sports-outdoors.jpg", 7010129],
  // Services - category images
  ["marketing.jpg", 6483592],
  ["seo.jpg", 106341],
  ["social-media.jpg", 16229745],
  ["creative.jpg", 30397433],
  ["design.jpg", 37663439],
  ["branding.jpg", 7598007],
  ["web-design.jpg", 6373045],
  ["development.jpg", 37880001],
  ["mobile-app.jpg", 6608248],
  ["cloud.jpg", 4508751],
  ["consulting.jpg", 36729965],
  ["strategy.jpg", 8970679],
  ["analytics.jpg", 572056],
];

// Combine existing + new, sort alphabetically
const allFiles = [...existingFiles, ...Object.entries(NEW_IDS)];
allFiles.sort((a, b) => a[0].localeCompare(b[0]));

const newFilesObj = "const FILES = {\n" +
  allFiles.map(([k, v]) => `  "${k}": ${v},`).join("\n") +
  "\n};";

download = download.substring(0, filesStart) + newFilesObj + download.substring(filesEnd);
writeFileSync(resolve(root, "scripts", "download-seeds.js"), download, "utf-8");
console.log("Updated download-seeds.js");

// ===== UPDATE seed-data.ts =====
let seed = readFileSync(resolve(root, "src", "lib", "seed-data.ts"), "utf-8");

// Helper: add new image entries to seed-data
// The B variable defines the base URL - find the img() function and add new images after existing ones

// Simple replacement: each item is on one line, image: img("old.jpg") → image: img("new.jpg")
const oldToNew = {
  // Electronics
  'image: img("headphones.jpg"), desc: "Industry-leading ANC, 30h battery, LDAC Hi-Res Audio", price: "349.00"': 'image: img("sony-wh1000xm6.jpg"), desc: "Industry-leading ANC, 30h battery, LDAC Hi-Res Audio", price: "349.00"',
  'image: img("headphones.jpg"), desc: "Active Noise Cancellation, Adaptive Audio, USB-C MagSafe", price: "249.00"': 'image: img("airpods-pro-3.jpg"), desc: "Active Noise Cancellation, Adaptive Audio, USB-C MagSafe", price: "249.00"',
  'image: img("headphones.jpg"), tag: "Premium"': 'image: img("bose-qc-ultra.jpg"), tag: "Premium"',
  'image: img("headphones.jpg"), desc: "2-way speakers, Adaptive ANC, Galaxy AI features"': 'image: img("galaxy-buds3-pro.jpg"), desc: "2-way speakers, Adaptive ANC, Galaxy AI features"',
  'image: img("smartwatch.jpg"), tag: "Best Seller"': 'image: img("apple-watch-s11.jpg"), tag: "Best Seller"',
  'image: img("smartwatch.jpg"), desc: "Wear OS, BioActive sensor, Antioxidant Index, sleep coach"': 'image: img("galaxy-watch-8.jpg"), desc: "Wear OS, BioActive sensor, Antioxidant Index, sleep coach"',
  'image: img("smartwatch.jpg"), desc: "AMOLED display, training metrics, GPS, 13-day battery"': 'image: img("garmin-forerunner-265.jpg"), desc: "AMOLED display, training metrics, GPS, 13-day battery"',
  'image: img("smartwatch.jpg"), desc: "Built-in GPS, heart rate, stress management, 7-day battery"': 'image: img("fitbit-charge-6.jpg"), desc: "Built-in GPS, heart rate, stress management, 7-day battery"',
  'image: img("smartwatch.jpg"), desc: "Fitbit integration, Pixel AI, Google Assistant"': 'image: img("pixel-watch-3.jpg"), desc: "Fitbit integration, Pixel AI, Google Assistant"',
  'image: img("laptop.jpg"), tag: "New"': 'image: img("macbook-air-m4.jpg"), tag: "New"',
  'image: img("laptop.jpg"), desc: "Ultra XDR display, M4 chip, Apple Pencil Pro support"': 'image: img("ipad-pro-m4.jpg"), desc: "Ultra XDR display, M4 chip, Apple Pencil Pro support"',
  'image: img("laptop.jpg"), desc: "14.6" Dynamic AMOLED, S Pen, 10h battery"': 'image: img("galaxy-tab-s10-ultra.jpg"), desc: "14.6" Dynamic AMOLED, S Pen, 10h battery"',
  'image: img("laptop.jpg"), desc: "Intel Core Ultra 9, 32GB RAM, OLED 4K touch, 16h"': 'image: img("dell-xps-16.jpg"), desc: "Intel Core Ultra 9, 32GB RAM, OLED 4K touch, 16h"',
  'image: img("laptop.jpg"), desc: "AMD Ryzen Z1 Extreme, 7" 120Hz, 24GB RAM, 1TB SSD"': 'image: img("asus-rog-ally-x.jpg"), desc: "AMD Ryzen Z1 Extreme, 7" 120Hz, 24GB RAM, 1TB SSD"',

  // Fashion: Men
  'image: img("tshirt.jpg"), desc: "Premium cotton, slim fit, button-down collar"': 'image: img("classic-oxford-shirt.jpg"), desc: "Premium cotton, slim fit, button-down collar"',
  'image: img("fashion.jpg"), desc: "Stretch cotton twill, tapered leg, 5 pockets"': 'image: img("slim-fit-chinos.jpg"), desc: "Stretch cotton twill, tapered leg, 5 pockets"',
  'image: img("fashion.jpg"), desc: "Genuine lambskin leather, zip front, ribbed cuffs"': 'image: img("leather-bomber-jacket.jpg"), desc: "Genuine lambskin leather, zip front, ribbed cuffs"',
  'image: img("fashion.jpg"), desc: "100% Mongolian cashmere, 12gg knit, ribbed hem"': 'image: img("cashmere-sweater.jpg"), desc: "100% Mongolian cashmere, 12gg knit, ribbed hem"',

  // Fashion: Women
  'image: img("fashion.jpg"), desc: "Relaxed fit, V-neck, side pockets, knee length"': 'image: img("linen-dress.jpg"), desc: "Relaxed fit, V-neck, side pockets, knee length"',
  'image: img("fashion.jpg"), desc: "Stretch denim, 5 pockets, ankle length"': 'image: img("skinny-jeans.jpg"), desc: "Stretch denim, 5 pockets, ankle length"',
  'image: img("fashion.jpg"), tag: "Winter"': 'image: img("wool-coat.jpg"), tag: "Winter"',
  'image: img("fashion.jpg"), desc: "100% mulberry silk, hidden button placket"': 'image: img("silk-blouse.jpg"), desc: "100% mulberry silk, hidden button placket"',

  // Fashion: Accessories
  'image: img("fashion.jpg"), desc: "Polarized UV400 lenses, gold frame, scratch-resistant"': 'image: img("aviator-sunglasses.jpg"), desc: "Polarized UV400 lenses, gold frame, scratch-resistant"',
  'image: img("fashion.jpg"), desc: "Pure cashmere, fringed ends, 180x70cm"': 'image: img("cashmere-scarf.jpg"), desc: "Pure cashmere, fringed ends, 180x70cm"',

  // Home & Kitchen: Appliances
  'image: img("home-kitchen.jpg"), tag: "Best Seller"': 'image: img("smart-air-fryer.jpg"), tag: "Best Seller"',
  'image: img("home-kitchen.jpg"), desc: "15-bar pump, PID temp control, dual boiler, steam wand"': 'image: img("espresso-machine.jpg"), desc: "15-bar pump, PID temp control, dual boiler, steam wand"',
  'image: img("home-kitchen.jpg"), tag: "New"': 'image: img("robot-vacuum.jpg"), tag: "New"',
  'image: img("home-kitchen.jpg"), desc: "Die-cast metal, 12 speeds, tilt-head, 550W motor"': 'image: img("stand-mixer.jpg"), desc: "Die-cast metal, 12 speeds, tilt-head, 550W motor"',
  'image: img("home-kitchen.jpg"), desc: "French door, AI temperature, water/ice dispenser, Wi-Fi"': 'image: img("smart-fridge.jpg"), desc: "French door, AI temperature, water/ice dispenser, Wi-Fi"',

  // Home & Kitchen: Lighting
  'image: img("home-kitchen.jpg"), tag: "Sale"': 'image: img("smart-bulb.jpg"), tag: "Sale"',
  'image: img("home-kitchen.jpg"), desc: "Adjustable color temp 3000-6500K, wireless charging base"': 'image: img("led-desk-lamp.jpg"), desc: "Adjustable color temp 3000-6500K, wireless charging base"',
  'image: img("home-kitchen.jpg"), desc: "RGBIC, music sync, app + voice control, cuttable"': 'image: img("led-strip.jpg"), desc: "RGBIC, music sync, app + voice control, cuttable"',
  'image: img("home-kitchen.jpg"), desc: "Soy wax, 200h burn time, vanilla/lavender/sandalwood"': 'image: img("scented-candle.jpg"), desc: "Soy wax, 200h burn time, vanilla/lavender/sandalwood"',

  // Sports: Fitness
  'image: img("sports-outdoors.jpg"), desc: "Space-saving, 5-52.5 lb range, quick-change dial"': 'image: img("adjustable-dumbbells.jpg"), desc: "Space-saving, 5-52.5 lb range, quick-change dial"',
  'image: img("sports-outdoors.jpg"), desc: "Non-slip TPE, alignment lines, carrying strap"': 'image: img("yoga-mat.jpg"), desc: "Non-slip TPE, alignment lines, carrying strap"',
  'image: img("sports-outdoors.jpg"), desc: "5 bands 10-50lb, door anchor, ankle straps, carry bag"': 'image: img("resistance-bands.jpg"), desc: "5 bands 10-50lb, door anchor, ankle straps, carry bag"',
  'image: img("sports-outdoors.jpg"), desc: "Ball-bearing system, adjustable cable, foam handles"': 'image: img("jump-rope.jpg"), desc: "Ball-bearing system, adjustable cable, foam handles"',

  // Sports: Outdoor
  'image: img("sports-outdoors.jpg"), desc: "Double-wall vacuum, 24h cold/12h hot, leak-proof"': 'image: img("water-bottle.jpg"), desc: "Double-wall vacuum, 24h cold/12h hot, leak-proof"',
  'image: img("sports-outdoors.jpg"), desc: "Padded armrests, cup holder, 330lb capacity, carry bag"': 'image: img("folding-camping-chair.jpg"), desc: "Padded armrests, cup holder, 330lb capacity, carry bag"',
  'image: img("backpack.jpg"), desc: "Waterproof ripstop, ergonomic frame, rain cover included"': 'image: img("hiking-backpack.jpg"), desc: "Waterproof ripstop, ergonomic frame, rain cover included"',

  // MARKETING: SEO
  'image: img("seo.jpg"), tag: "Popular"': 'image: img("seo-audit.jpg"), tag: "Popular"',
  'image: img("seo.jpg"), tag: "Best Seller"': 'image: img("seo-retainer.jpg"), tag: "Best Seller"',
  'image: img("seo.jpg"), desc: "Google Business Profile, local citations, review management"': 'image: img("local-seo.jpg"), desc: "Google Business Profile, local citations, review management"',
  'image: img("seo.jpg"), desc: "Product page optimization, structured data, category strategy"': 'image: img("ecommerce-seo.jpg"), desc: "Product page optimization, structured data, category strategy"',

  // MARKETING: Paid Ads
  'image: img("marketing.jpg"), tag: "Popular"': 'image: img("google-ads.jpg"), tag: "Popular"',
  'image: img("social-media.jpg"), desc: "Meta, TikTok, LinkedIn ads — creative + targeting + optimization"': 'image: img("social-ads.jpg"), desc: "Meta, TikTok, LinkedIn ads — creative + targeting + optimization"',
  'image: img("marketing.jpg"), desc: "Multi-channel retargeting, dynamic ads, conversion tracking"': 'image: img("retargeting.jpg"), desc: "Multi-channel retargeting, dynamic ads, conversion tracking"',
  'image: img("creative.jpg"), desc: "Video + static ads, A/B testing, platform-optimized formats"': 'image: img("ad-creative.jpg"), desc: "Video + static ads, A/B testing, platform-optimized formats"',

  // MARKETING: Social Media
  'image: img("social-media.jpg"), desc: "6 posts/week, 2 platforms, monthly report, community mgmt"': 'image: img("social-starter.jpg"), desc: "6 posts/week, 2 platforms, monthly report, community mgmt"',
  'image: img("social-media.jpg"), desc: "Daily posts, 4 platforms, influencer outreach, Stories + Reels"': 'image: img("social-growth.jpg"), desc: "Daily posts, 4 platforms, influencer outreach, Stories + Reels"',
  'image: img("creative.jpg"), desc: "Professional photography, video editing, graphic design"': 'image: img("content-creation.jpg"), desc: "Professional photography, video editing, graphic design"',
  'image: img("social-media.jpg"), desc: "Sourcing, negotiation, briefing, performance tracking"': 'image: img("influencer.jpg"), desc: "Sourcing, negotiation, briefing, performance tracking"',

  // DESIGN: Brand Identity
  'image: img("branding.jpg"), tag: "Popular"': 'image: img("logo-design.jpg"), tag: "Popular"',
  'image: img("branding.jpg"), tag: "Best Seller"': 'image: img("brand-identity.jpg"), tag: "Best Seller"',
  'image: img("branding.jpg"), desc: "2-day facilitated workshop, positioning, messaging, audience"': 'image: img("brand-strategy.jpg"), desc: "2-day facilitated workshop, positioning, messaging, audience"',
  'image: img("branding.jpg"), desc: "Update existing brand, new assets, brand book revision"': 'image: img("visual-identity.jpg"), desc: "Update existing brand, new assets, brand book revision"',
  'image: img("branding.jpg"), desc: "3D mockups, die-cut templates, print-ready files, 3 variants"': 'image: img("packaging-design.jpg"), desc: "3D mockups, die-cut templates, print-ready files, 3 variants"',

  // DESIGN: Web & UI
  'image: img("web-design.jpg"), tag: "Popular"': 'image: img("landing-page.jpg"), tag: "Popular"',
  'image: img("web-design.jpg"), desc: "Up to 10 pages, design system, responsive, Figma + prototypes"': 'image: img("website-design.jpg"), desc: "Up to 10 pages, design system, responsive, Figma + prototypes"',
  'image: img("design.jpg"), desc: "Heuristic eval, usability testing, user interviews, report"': 'image: img("ux-audit.jpg"), desc: "Heuristic eval, usability testing, user interviews, report"',
  'image: img("web-design.jpg"), desc: "Complex data visualization, interactive prototypes, dark mode"': 'image: img("dashboard-ui.jpg"), desc: "Complex data visualization, interactive prototypes, dark mode"',
  'image: img("design.jpg"), desc: "Component library, tokens, docs, Storybook integration"': 'image: img("design-system.jpg"), desc: "Component library, tokens, docs, Storybook integration"',

  // DEVELOPMENT: Web
  'image: img("web-design.jpg"), desc: "CMS-based, SEO-optimized, responsive, 5 pages"': 'image: img("corporate-website.jpg"), desc: "CMS-based, SEO-optimized, responsive, 5 pages"',
  'image: img("development.jpg"), desc: "Shopify/Next.js, product mgmt, payments, shipping, 50 products"': 'image: img("ecommerce-store.jpg"), desc: "Shopify/Next.js, product mgmt, payments, shipping, 50 products"',
  'image: img("development.jpg"), desc: "Full-stack React/Node, auth, database, API, 3 months"': 'image: img("custom-webapp.jpg"), desc: "Full-stack React/Node, auth, database, API, 3 months"',
  'image: img("development.jpg"), desc: "REST/GraphQL, documentation, testing, deployment"': 'image: img("api-development.jpg"), desc: "REST/GraphQL, documentation, testing, deployment"',
  'image: img("development.jpg"), desc: "CWV audit, lazy loading, caching, CDN setup, 50%+ improvement"': 'image: img("web-perf.jpg"), desc: "CWV audit, lazy loading, caching, CDN setup, 50%+ improvement"',

  // DEVELOPMENT: Mobile
  'image: img("mobile-app.jpg"), desc: "Native SwiftUI, App Store submission, 3 months"': 'image: img("ios-app.jpg"), desc: "Native SwiftUI, App Store submission, 3 months"',
  'image: img("mobile-app.jpg"), desc: "Kotlin/Jetpack Compose, Play Store, 3 months"': 'image: img("android-app.jpg"), desc: "Kotlin/Jetpack Compose, Play Store, 3 months"',
  'image: img("mobile-app.jpg"), tag: "Popular"': 'image: img("cross-platform-app.jpg"), tag: "Popular"',
  'image: img("mobile-app.jpg"), desc: "Bug fixes, OS updates, performance monitoring, monthly"': 'image: img("app-maintenance.jpg"), desc: "Bug fixes, OS updates, performance monitoring, monthly"',

  // DEVELOPMENT: Cloud & DevOps
  'image: img("cloud.jpg"), desc: "AWS/Azure/GCP assessment, migration plan, execution"': 'image: img("cloud-migration.jpg"), desc: "AWS/Azure/GCP assessment, migration plan, execution"',
  'image: img("cloud.jpg"), desc: "GitHub Actions, automated testing, staging/prod deployment"': 'image: img("cicd-pipeline.jpg"), desc: "GitHub Actions, automated testing, staging/prod deployment"',
  'image: img("cloud.jpg"), desc: "Terraform/Pulumi, monitoring, auto-scaling, disaster recovery"': 'image: img("iac.jpg"), desc: "Terraform/Pulumi, monitoring, auto-scaling, disaster recovery"',
  'image: img("cloud.jpg"), desc: "24/7 monitoring, incident response, monthly optimization"': 'image: img("devops-retainer.jpg"), desc: "24/7 monitoring, incident response, monthly optimization"',

  // CONSULTING: Strategy
  'image: img("strategy.jpg"), desc: "4-hour workshop, growth roadmap, KPI framework"': 'image: img("business-strategy.jpg"), desc: "4-hour workshop, growth roadmap, KPI framework"',
  'image: img("strategy.jpg"), tag: "Popular"': 'image: img("go-to-market.jpg"), tag: "Popular"',
  'image: img("consulting.jpg"), desc: "Process mapping, bottlenecks, automation opportunities, report"': 'image: img("operations-audit.jpg"), desc: "Process mapping, bottlenecks, automation opportunities, report"',
  'image: img("consulting.jpg"), desc: "Monthly strategic oversight, team management, OKR tracking"': 'image: img("fractional-coo.jpg"), desc: "Monthly strategic oversight, team management, OKR tracking"',

  // CONSULTING: Analytics
  'image: img("analytics.jpg"), desc: "Infrastructure, tools, tracking plan, dashboard setup"': 'image: img("data-strategy.jpg"), desc: "Infrastructure, tools, tracking plan, dashboard setup"',
  'image: img("analytics.jpg"), desc: "GA4/Plausible audit, data quality, actionable recommendations"': 'image: img("analytics-audit.jpg"), desc: "GA4/Plausible audit, data quality, actionable recommendations"',
  'image: img("analytics.jpg"), desc: "Live KPIs, automated reports, team access, 5 data sources"': 'image: img("custom-dashboard.jpg"), desc: "Live KPIs, automated reports, team access, 5 data sources"',
  'image: img("analytics.jpg"), desc: "Hypothesis creation, experiment design, statistical analysis"': 'image: img("ab-testing.jpg"), desc: "Hypothesis creation, experiment design, statistical analysis"',
};

// First, restore original seed-data.ts (undo partial changes from previous run)
// git checkout HEAD -- src/lib/seed-data.ts
import { execSync } from "child_process";
execSync("git checkout HEAD -- src/lib/seed-data.ts", { cwd: root });
seed = readFileSync(resolve(root, "src", "lib", "seed-data.ts"), "utf-8");

for (const [oldStr, newStr] of Object.entries(oldToNew)) {
  if (!seed.includes(oldStr)) {
    console.error("NOT FOUND:", oldStr.substring(0, 100));
    continue;
  }
  seed = seed.replace(oldStr, newStr);
}

writeFileSync(resolve(root, "src", "lib", "seed-data.ts"), seed, "utf-8");
console.log("Updated seed-data.ts");
console.log("Done! All image references updated.");
