import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "fs";
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

const dir = resolve(root, "seed-images");
const files = readdirSync(dir).filter(f => f.endsWith(".jpg"));

let ok = 0, err = 0;
for (const file of files) {
  const buffer = readFileSync(resolve(dir, file));
  const path = `seed/${file}`;
  const { error } = await supabase.storage.from("catalog-images").upload(path, buffer, {
    contentType: "image/jpeg",
    upsert: true,
  });
  if (error) {
    console.error(`FAIL ${file}: ${error.message}`);
    err++;
  } else {
    console.log(`OK ${file}`);
    ok++;
  }
}
console.log(`\nDone: ${ok} ok, ${err} err`);
