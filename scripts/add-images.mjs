import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const file = resolve(root, "src/lib/seed-data.ts");
let content = readFileSync(file, "utf-8");

const img = (f) => `img("${f}")`;

// ---- SEED_PRODUCTOS ----

const productImgMap = [
  // Headphones & Audio
  ['"Samsung Galaxy Buds3 Pro"', img("headphones.jpg")],
  // Smartwatches
  ['"Garmin Forerunner 265"', img("smartwatch.jpg")],
  ['"Google Pixel Watch 3"', img("smartwatch.jpg")],
  // Laptops
  ['"iPad Pro M4 13\\""', img("laptop.jpg")],
  ['"Samsung Galaxy Tab S10 Ultra"', img("laptop.jpg")],
  ['"Asus ROG Ally X"', img("laptop.jpg")],
  // Men
  ['"Classic Oxford Shirt"', img("tshirt.jpg")],
  ['"Slim Fit Chinos"', img("fashion.jpg")],
  ['"Leather Bomber Jacket"', img("fashion.jpg")],
  ['"Cashmere Crew Neck Sweater"', img("fashion.jpg")],
  // Women
  ['"Linen Blend Dress"', img("fashion.jpg")],
  ['"High-Waist Skinny Jeans"', img("fashion.jpg")],
  ['"Wool Blend Coat"', img("fashion.jpg")],
  ['"Silk Blouse"', img("fashion.jpg")],
  // Accessories
  ['"Minimalist Leather Watch"', img("jewelry.jpg")],
  ['"Cashmere Scarf"', img("fashion.jpg")],
  // Home & Kitchen - Appliances
  ['"Smart Air Fryer 6L"', img("home-kitchen.jpg")],
  ['"Espresso Machine Pro"', img("home-kitchen.jpg")],
  ['"Robot Vacuum X3"', img("home-kitchen.jpg")],
  ['"Stand Mixer 5.5qt"', img("home-kitchen.jpg")],
  ['"Smart Fridge 28 cu ft"', img("home-kitchen.jpg")],
  // Home & Kitchen - Lighting
  ['"Smart Bulb 4-Pack"', img("home-kitchen.jpg")],
  ['"LED Desk Lamp"', img("home-kitchen.jpg")],
  ['"Wi-Fi LED Strip 5m"', img("home-kitchen.jpg")],
  ['"Scented Candle Trio"', img("home-kitchen.jpg")],
  // Sports - Fitness
  ['"Adjustable Dumbbells 52.5lb"', img("sports-outdoors.jpg")],
  ['"Yoga Mat Premium 6mm"', img("sports-outdoors.jpg")],
  ['"Resistance Bands Set"', img("sports-outdoors.jpg")],
  ['"Jump Rope Speed Pro"', img("sports-outdoors.jpg")],
  // Sports - Outdoor
  ['"Insulated Water Bottle 1L"', img("sports-outdoors.jpg")],
  ['"Hiking Backpack 45L"', img("backpack.jpg")],
  ['"Folding Camping Chair"', img("sports-outdoors.jpg")],
];

for (const [name, image] of productImgMap) {
  const search = `name: ${name}, desc: `;
  const idx = content.indexOf(search);
  if (idx === -1) { console.error(`NOT FOUND (product): ${name}`); continue; }
  const lineStart = content.lastIndexOf("\n", idx) + 1;
  const lineEnd = content.indexOf("\n", lineStart);
  const line = content.slice(lineStart, lineEnd);
  const updated = line.replace(`image: ""`, `image: ${image}`);
  if (updated === line) { console.error(`NO CHANGE (product): ${name}`); continue; }
  content = content.slice(0, lineStart) + updated + content.slice(lineEnd);
  console.log(`OK product: ${name}`);
}

// ---- SEED_SERVICIOS ----

const serviceImgMap = [
  // SEO
  ['"Monthly SEO Retainer"', img("seo.jpg")],
  ['"Local SEO Package"', img("seo.jpg")],
  ['"E-commerce SEO"', img("seo.jpg")],
  // Paid Ads
  ['"Google Ads Setup & Manage"', img("marketing.jpg")],
  ['"Social Media Ads"', img("social-media.jpg")],
  ['"Retargeting Campaign"', img("marketing.jpg")],
  ['"Ad Creative Production"', img("creative.jpg")],
  // Social Media
  ['"Starter Social Package"', img("social-media.jpg")],
  ['"Growth Social Package"', img("social-media.jpg")],
  ['"Content Creation Add-on"', img("creative.jpg")],
  ['"Influencer Campaign Mgmt"', img("social-media.jpg")],
  // Brand Identity
  ['"Logo Design"', img("branding.jpg")],
  ['"Full Brand Identity"', img("branding.jpg")],
  ['"Brand Strategy Workshop"', img("branding.jpg")],
  ['"Visual Identity Refresh"', img("branding.jpg")],
  ['"Packaging Design"', img("branding.jpg")],
  // Web & UI/UX
  ['"Landing Page Design"', img("web-design.jpg")],
  ['"Full Website Design"', img("web-design.jpg")],
  ['"UX Audit & Research"', img("design.jpg")],
  ['"Dashboard UI Design"', img("web-design.jpg")],
  ['"Design System Setup"', img("design.jpg")],
  // Web Development
  ['"Corporate Website"', img("web-design.jpg")],
  ['"E-commerce Store"', img("development.jpg")],
  ['"Custom Web App"', img("development.jpg")],
  ['"API Development"', img("development.jpg")],
  ['"Performance Optimization"', img("development.jpg")],
  // Mobile Apps
  ['"iOS App Development"', img("mobile-app.jpg")],
  ['"Android App Development"', img("mobile-app.jpg")],
  ['"Cross-Platform App (RN)"', img("mobile-app.jpg")],
  ['"App Maintenance"', img("mobile-app.jpg")],
  // Cloud & DevOps
  ['"Cloud Migration"', img("cloud.jpg")],
  ['"CI/CD Pipeline Setup"', img("cloud.jpg")],
  ['"Infrastructure as Code"', img("cloud.jpg")],
  ['"Managed DevOps Retainer"', img("cloud.jpg")],
  // Strategy
  ['"Business Strategy Session"', img("strategy.jpg")],
  ['"Go-to-Market Plan"', img("strategy.jpg")],
  ['"Operations Audit"', img("consulting.jpg")],
  ['"Fractional COO Service"', img("consulting.jpg")],
  // Analytics
  ['"Data Strategy Setup"', img("analytics.jpg")],
  ['"Analytics Audit"', img("analytics.jpg")],
  ['"Custom Dashboard Build"', img("analytics.jpg")],
  ['"A/B Testing Program"', img("analytics.jpg")],
];

for (const [name, image] of serviceImgMap) {
  const search = `name: ${name}, desc: `;
  const idx = content.indexOf(search);
  if (idx === -1) { console.error(`NOT FOUND (service): ${name}`); continue; }
  const lineStart = content.lastIndexOf("\n", idx) + 1;
  const lineEnd = content.indexOf("\n", lineStart);
  const line = content.slice(lineStart, lineEnd);
  const updated = line.replace(`image: ""`, `image: ${image}`);
  if (updated === line) { console.error(`NO CHANGE (service): ${name}`); continue; }
  content = content.slice(0, lineStart) + updated + content.slice(lineEnd);
  console.log(`OK service: ${name}`);
}

writeFileSync(file, content);
console.log("\nDone!");
