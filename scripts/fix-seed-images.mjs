import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const seedPath = resolve(root, "src", "lib", "seed-data.ts");

let seed = readFileSync(seedPath, "utf-8");

// Map: description text → new image filename
// Extracted from the apply-images.mjs oldToNew by taking the description from old string
// and the new image filename from the new string
const REPLACE_DESC_TO_IMG = {
  // ===== ELECTRONICS: Headphones =====
  "Industry-leading ANC, 30h battery, LDAC Hi-Res Audio": "sony-wh1000xm6.jpg",
  "Active Noise Cancellation, Adaptive Audio, USB-C MagSafe": "airpods-pro-3.jpg",
  "World-class noise cancellation, Immersive Audio, 24h": "bose-qc-ultra.jpg",
  "2-way speakers, Adaptive ANC, Galaxy AI features": "galaxy-buds3-pro.jpg",

  // ===== ELECTRONICS: Smartwatches =====
  "ECG, Blood Oxygen, Crash Detection, LTPO3 display": "apple-watch-s11.jpg",
  "Wear OS, BioActive sensor, Antioxidant Index, sleep coach": "galaxy-watch-8.jpg",
  "AMOLED display, training metrics, GPS, 13-day battery": "garmin-forerunner-265.jpg",
  "Built-in GPS, heart rate, stress management, 7-day battery": "fitbit-charge-6.jpg",
  "Fitbit integration, Pixel AI, Google Assistant": "pixel-watch-3.jpg",

  // ===== ELECTRONICS: Laptops & Tablets =====
  'Apple M4 chip, 15.3" Liquid Retina, 18h battery, 16GB RAM': "macbook-air-m4.jpg",
  'Ultra XDR display, M4 chip, Apple Pencil Pro support': "ipad-pro-m4.jpg",
  '14.6" Dynamic AMOLED, S Pen, 10h battery': "galaxy-tab-s10-ultra.jpg",
  "Intel Core Ultra 9, 32GB RAM, OLED 4K touch, 16h": "dell-xps-16.jpg",
  'AMD Ryzen Z1 Extreme, 7" 120Hz, 24GB RAM, 1TB SSD': "asus-rog-ally-x.jpg",

  // ===== FASHION: Men =====
  "Premium cotton, slim fit, button-down collar": "classic-oxford-shirt.jpg",
  "Stretch cotton twill, tapered leg, 5 pockets": "slim-fit-chinos.jpg",
  "Genuine lambskin leather, zip front, ribbed cuffs": "leather-bomber-jacket.jpg",
  "100% Mongolian cashmere, 12gg knit, ribbed hem": "cashmere-sweater.jpg",

  // ===== FASHION: Women =====
  "Relaxed fit, V-neck, side pockets, knee length": "linen-dress.jpg",
  "Stretch denim, 5 pockets, ankle length": "skinny-jeans.jpg",
  "Double-breasted, notch lapel, mid-calf length": "wool-coat.jpg",
  "100% mulberry silk, hidden button placket": "silk-blouse.jpg",

  // ===== FASHION: Accessories =====
  "Polarized UV400 lenses, gold frame, scratch-resistant": "aviator-sunglasses.jpg",
  "Pure cashmere, fringed ends, 180x70cm": "cashmere-scarf.jpg",

  // ===== HOME: Appliances =====
  "Digital touch, 12 presets, Wi-Fi enabled, dishwasher-safe": "smart-air-fryer.jpg",
  "15-bar pump, PID temp control, dual boiler, steam wand": "espresso-machine.jpg",
  "LiDAR navigation, 5000Pa suction, self-empty base, 2h runtime": "robot-vacuum.jpg",
  "Die-cast metal, 12 speeds, tilt-head, 550W motor": "stand-mixer.jpg",
  "French door, AI temperature, water/ice dispenser, Wi-Fi": "smart-fridge.jpg",

  // ===== HOME: Lighting =====
  "16M colors, white tunable, voice control, no hub needed": "smart-bulb.jpg",
  "Adjustable color temp 3000-6500K, wireless charging base": "led-desk-lamp.jpg",
  "RGBIC, music sync, app + voice control, cuttable": "led-strip.jpg",
  "Soy wax, 200h burn time, vanilla/lavender/sandalwood": "scented-candle.jpg",

  // ===== SPORTS: Fitness =====
  "Space-saving, 5-52.5 lb range, quick-change dial": "adjustable-dumbbells.jpg",
  "Non-slip TPE, alignment lines, carrying strap": "yoga-mat.jpg",
  "5 bands 10-50lb, door anchor, ankle straps, carry bag": "resistance-bands.jpg",
  "Ball-bearing system, adjustable cable, foam handles": "jump-rope.jpg",

  // ===== SPORTS: Outdoor =====
  "Double-wall vacuum, 24h cold/12h hot, leak-proof": "water-bottle.jpg",
  "Ultralight mesh, Helion foam sole, reflective details": "running-shoes-cloud-6.jpg",
  "Waterproof ripstop, ergonomic frame, rain cover included": "hiking-backpack.jpg",
  "Padded armrests, cup holder, 330lb capacity, carry bag": "folding-camping-chair.jpg",

  // ===== MARKETING: SEO =====
  "Full technical audit, competitor analysis, keyword roadmap": "seo-audit.jpg",
  "Ongoing optimization, content strategy, link building, reporting": "seo-retainer.jpg",
  "Google Business Profile, local citations, review management": "local-seo.jpg",
  "Product page optimization, structured data, category strategy": "ecommerce-seo.jpg",

  // ===== MARKETING: Paid Ads =====
  "Search, Shopping, Display campaigns — 20% of ad spend": "google-ads.jpg",
  "Meta, TikTok, LinkedIn ads — creative + targeting + optimization": "social-ads.jpg",
  "Multi-channel retargeting, dynamic ads, conversion tracking": "retargeting.jpg",
  "Video + static ads, A/B testing, platform-optimized formats": "ad-creative.jpg",

  // ===== MARKETING: Social Media =====
  "6 posts/week, 2 platforms, monthly report, community mgmt": "social-starter.jpg",
  "Daily posts, 4 platforms, influencer outreach, Stories + Reels": "social-growth.jpg",
  "Professional photography, video editing, graphic design": "content-creation.jpg",
  "Sourcing, negotiation, briefing, performance tracking": "influencer.jpg",

  // ===== DESIGN: Brand Identity =====
  "3 concepts, vector files, color variations, brand guidelines": "logo-design.jpg",
  "Logo, palette, typography, patterns, templates, full guideline PDF": "brand-identity.jpg",
  "2-day facilitated workshop, positioning, messaging, audience": "brand-strategy.jpg",
  "Update existing brand, new assets, brand book revision": "visual-identity.jpg",
  "3D mockups, die-cut templates, print-ready files, 3 variants": "packaging-design.jpg",

  // ===== DESIGN: Web & UI/UX =====
  "Mobile-first, conversion-optimized, Figma source files": "landing-page.jpg",
  "Up to 10 pages, design system, responsive, Figma + prototypes": "website-design.jpg",
  "Heuristic eval, usability testing, user interviews, report": "ux-audit.jpg",
  "Complex data visualization, interactive prototypes, dark mode": "dashboard-ui.jpg",
  "Component library, tokens, docs, Storybook integration": "design-system.jpg",

  // ===== DEVELOPMENT: Web =====
  "CMS-based, SEO-optimized, responsive, 5 pages": "corporate-website.jpg",
  "Shopify/Next.js, product mgmt, payments, shipping, 50 products": "ecommerce-store.jpg",
  "Full-stack React/Node, auth, database, API, 3 months": "custom-webapp.jpg",
  "REST/GraphQL, documentation, testing, deployment": "api-development.jpg",
  "CWV audit, lazy loading, caching, CDN setup, 50%+ improvement": "web-perf.jpg",

  // ===== DEVELOPMENT: Mobile =====
  "Native SwiftUI, App Store submission, 3 months": "ios-app.jpg",
  "Kotlin/Jetpack Compose, Play Store, 3 months": "android-app.jpg",
  "React Native, iOS + Android, shared codebase, 2 months": "cross-platform-app.jpg",
  "Bug fixes, OS updates, performance monitoring, monthly": "app-maintenance.jpg",

  // ===== DEVELOPMENT: Cloud & DevOps =====
  "AWS/Azure/GCP assessment, migration plan, execution": "cloud-migration.jpg",
  "GitHub Actions, automated testing, staging/prod deployment": "cicd-pipeline.jpg",
  "Terraform/Pulumi, monitoring, auto-scaling, disaster recovery": "iac.jpg",
  "24/7 monitoring, incident response, monthly optimization": "devops-retainer.jpg",

  // ===== CONSULTING: Strategy =====
  "4-hour workshop, growth roadmap, KPI framework": "business-strategy.jpg",
  "Market analysis, channel strategy, launch timeline, budget": "go-to-market.jpg",
  "Process mapping, bottlenecks, automation opportunities, report": "operations-audit.jpg",
  "Monthly strategic oversight, team management, OKR tracking": "fractional-coo.jpg",

  // ===== CONSULTING: Analytics =====
  "Infrastructure, tools, tracking plan, dashboard setup": "data-strategy.jpg",
  "GA4/Plausible audit, data quality, actionable recommendations": "analytics-audit.jpg",
  "Live KPIs, automated reports, team access, 5 data sources": "custom-dashboard.jpg",
  "Hypothesis creation, experiment design, statistical analysis": "ab-testing.jpg",
};

const lines = seed.split("\n");
let replaceCount = 0;
let notFound = [];

for (const [desc, newImg] of Object.entries(REPLACE_DESC_TO_IMG)) {
  // Escape desc for regex (but keep quotes)
  const escDesc = desc.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`desc:\\s*"${escDesc}"`);
  let found = false;

  for (let i = 0; i < lines.length; i++) {
    if (regex.test(lines[i])) {
      // Replace img("old.jpg") with img("new.jpg") on this line
      lines[i] = lines[i].replace(/img\("[^"]+\.jpg"\)/, `img("${newImg}")`);
      replaceCount++;
      found = true;
      break;
    }
  }

  if (!found) {
    notFound.push(desc.substring(0, 60));
  }
}

seed = lines.join("\n");
writeFileSync(seedPath, seed, "utf-8");

console.log(`Replaced ${replaceCount} images`);
if (notFound.length) {
  console.log(`NOT FOUND (${notFound.length}):`);
  notFound.forEach(d => console.log(`  - ${d}...`));
} else {
  console.log("All descriptions matched successfully!");
}
