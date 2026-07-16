import { createClient } from "@supabase/supabase-js";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = "https://hreqqnwsivtzewpjcwcs.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZXFxbndzaXZ0emV3cGpjd2NzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjA3NDMzOSwiZXhwIjoyMDk3NjUwMzM5fQ.nBEmRZNGZWwaQ32cGwTtoAKbV0E46ETYR42Rx12gQwY";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const CATEGORY_COVERS = {
  "main-courses": { url: "https://demo.tableqr.co/wp-content/uploads/2025/12/main-course-5.webp", name: "main-course-5.webp" },
  "breakfast": { url: "https://demo.tableqr.co/wp-content/uploads/2025/12/categorize-design-v1.webp", name: "categorize-design-v1.webp" },
  "pizza": { url: "https://demo.tableqr.co/wp-content/uploads/2025/12/categorize-design-v1-1.webp", name: "categorize-design-v1-1.webp" },
  "desserts": { url: "https://demo.tableqr.co/wp-content/uploads/2025/12/categorize-design-v1-2.webp", name: "categorize-design-v1-2.webp" },
  "beverages": { url: "https://demo.tableqr.co/wp-content/uploads/2025/12/categorize-design-v1-3.webp", name: "categorize-design-v1-3.webp" },
};

const ITEM_IMAGES = [
  "https://demo.tableqr.co/wp-content/uploads/2025/11/a-close-up-of-a-burger-with-beef-patty-with-vegeta-2024-11-26-10-45-47-utc-1.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/chicken-burger-with-bacon-on-wooden-board-front-v-2025-01-10-04-01-23-utc-1.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/burger-and-ingredients-2025-01-09-07-47-39-utc-1.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/delicious-food-for-islamic-new-year-2025-07-07-19-46-21-utc-1.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/delicious-juicy-classic-beef-burger-and-crispy-vil-2025-02-02-20-16-09-utc.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/homemade-hamburger-served-with-french-fries-2025-03-25-21-21-20-utc.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/mansaf-jordanian-national-dish-2025-03-08-00-34-30-utc-1.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/Safi-with-muhammar-Rice.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/Quil-Majboos-Rice.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/Sea-bream-fish.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/breaded-torpedo-shrimps-2024-10-18-09-19-13-utc.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/japanese-lunch-composition-2025-04-04-08-27-01-utc.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/fried-shrimps-tempura-with-sweet-chili-sauce-2025-02-21-02-23-26-utc.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/nuggets-chicken-nuggets-with-ketchup-on-wooden-ta-2025-02-18-07-07-19-utc.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/roasted-potatoes-with-parmesan-and-herbs-served-wi-2025-04-12-05-19-52-utc.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/sausages-2025-01-10-19-08-43-utc.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/tomato-soup-with-tortellini-2025-03-07-16-01-07-utc.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/healthy-vegan-lentil-cream-soup-2025-07-14-18-30-33-utc-1.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/concept-of-tasty-food-with-pumpkin-soup-on-gray-te-2025-03-25-16-43-55-utc-1.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/creamy-soup-with-seafood-and-lemon-on-a-white-back-2025-01-09-01-59-36-utc-1.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/tom-yum-soup-with-shrimps-lime-chili-pepper-and-2025-02-15-14-32-31-utc-1.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/chinese-corn-and-chicken-soup-healthy-food-style-2025-03-09-08-55-21-utc-1.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/vegetable-salad-with-cheese-mozzarella-tomatoes-2025-02-09-22-46-39-utc.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/salad-with-mango-shrimp-and-avocado-on-white-plat-2024-10-20-00-38-43-utc.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/top-view-mayyonaise-salad-with-different-vegetable-2025-02-10-11-35-39-utc-1.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/salad-with-beet-curd-feta-ricotta-and-pine-nuts-2024-10-18-05-45-05-utc-1.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/salad-salmon-with-avocado-grapefruit-and-pomegran-2025-02-19-02-51-02-utc-1.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/roamn-sauce.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/boiled-sliced-egg-food-photo-2025-04-01-11-44-51-utc-1.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/boiled-sliced-egg-food-photo-2025-03-26-13-42-36-utc-1.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/tuna-sandwich-with-mayo-and-vegetables-on-gray-sto-2025-06-05-20-59-29-utc.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/tasty-sandwich-served-with-lemonade-in-the-kitchen-2025-03-24-04-00-08-utc.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/fried-egg-fresh-salad-and-avocado-guacamole-sandw-2025-02-21-00-06-43-utc-1.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/a-wooden-cutting-board-topped-with-three-pastries-2025-02-11-19-43-21-utc-1.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/croissant-sandwich-with-mushrooms-and-lettuce-on-a-2025-02-03-04-54-35-utc-1.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/tasty-croissant-with-salad-and-salmon-on-white-pla-2025-02-22-01-44-17-utc.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/vegetarian-pizza-with-aubergines-and-zucchini-2025-03-18-17-47-49-utc-1.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/flat-lay-with-italian-pizza-and-various-ingredient-2024-11-18-02-13-11-utc-1-1.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/fresh-italian-pizza-with-mushrooms-ham-tomatoes-2024-10-11-07-42-15-utc-1.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/pizza-margherita-homemade-2024-09-23-13-51-43-utc.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/fresh-delicious-italian-pizza-2024-12-13-07-54-55-utc-1.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/pizzaa.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/lebonan-pizza.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/pepproni-pizza.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/spenich-pizza.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/vegetables-pizza.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/ZATIR-PIZZA.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/chicken-grill-pizza-1.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/shrimp-pizza-1-1.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/beef-pizza-1.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/green-pizza-1.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/eggplant-pizza-1.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/Panna-cotta.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/Tiramisu-1.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/Tortino-di-Mele-con-Gelato.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/Affogato-al-Caffe.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/Coppa-di-Fragole-e-Gelato.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/Gelati-Misti.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/turkish-dessert-kunefe-served-with-ice-cream-on-wo-2025-02-25-19-14-58-utc.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/dalgona-coffee-drink-with-coffee-foam-and-milk-2025-01-09-03-03-18-utc.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/ice-cream-and-berry-fruits-with-chocolate-sauce-an-2024-12-13-05-40-08-utc-1.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/vertical-closeup-of-a-new-york-roll-with-pistachio-2025-02-02-14-08-36-utc.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/oatmeal-cookies-sprinkled-with-cereal-grains-2025-01-07-23-27-26-utc.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/glazed-chocolate-and-pink-donuts-on-marble-backgro-2025-02-10-05-35-43-utc.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/karak-tea.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/morocan-tea.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/special-black-tea.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/black-tea.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/mint-tea-500x500-1.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/coffee-latte-art-2025-03-25-16-22-03-utc.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/matcha-latte-with-latte-art-a-cup-of-japanese-gre-2024-12-02-03-17-00-utc.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/cup-of-coffee-2025-02-14-13-35-22-utc.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/white-coffee-cup-on-a-white-plate-surrounded-by-co-2025-02-11-23-58-35-utc.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/cup-of-espresso-with-coconut-cookies-on-a-plate-2025-03-12-20-36-13-utc.webp",
  "https://demo.tableqr.co/wp-content/uploads/2025/11/cappuccino-white-coffee-cup-with-heart-shape-art-2024-12-10-01-18-55-utc.webp",
];

const UNIQUE_URLS = [...new Set([
  ...Object.values(CATEGORY_COVERS).map(c => c.url),
  ...ITEM_IMAGES,
])];

function getFilename(url) {
  const u = new URL(url);
  const parts = u.pathname.split("/");
  return parts[parts.length - 1];
}

async function downloadImage(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`);
  const buffer = await res.arrayBuffer();
  return Buffer.from(buffer);
}

async function uploadImage(buffer, filename) {
  const path = `seed/${filename}`;
  const { error } = await supabase.storage
    .from("catalog-images")
    .upload(path, buffer, {
      contentType: `image/${filename.endsWith(".png") ? "png" : "webp"}`,
      upsert: true,
    });
  if (error) throw error;
  const { data: { publicUrl } } = supabase.storage
    .from("catalog-images")
    .getPublicUrl(path);
  return publicUrl;
}

async function main() {
  console.log(`Downloading and uploading ${UNIQUE_URLS.length} unique images...`);

  const urlMap = {};
  let success = 0;
  let failed = 0;

  for (const url of UNIQUE_URLS) {
    const filename = getFilename(url);
    process.stdout.write(`  [${success + failed + 1}/${UNIQUE_URLS.length}] ${filename}... `);
    try {
      const buffer = await downloadImage(url);
      const publicUrl = await uploadImage(buffer, filename);
      urlMap[url] = publicUrl;
      success++;
      console.log("OK");
    } catch (err) {
      failed++;
      console.log(`FAIL: ${err.message}`);
    }
  }

  console.log(`\nDone: ${success} uploaded, ${failed} failed`);

  const outputPath = join(__dirname, "..", "src", "lib", "seed-image-map.json");
  writeFileSync(outputPath, JSON.stringify(urlMap, null, 2));
  console.log(`Map saved to ${outputPath}`);
}

main().catch(console.error);
