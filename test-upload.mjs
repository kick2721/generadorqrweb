import fs from "fs";
import http from "https";

const filePath = process.argv[2];
if (!filePath) { console.log("Usage: node test-upload.mjs <filepath>"); process.exit(1); }

const file = fs.readFileSync(filePath);
const fname = filePath.split(/[/\\]/).pop();
const boundary = "----" + Date.now();

const parts = [
  `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${fname}"\r\nContent-Type: application/octet-stream\r\n\r\n`,
  file,
  `\r\n--${boundary}--\r\n`,
];

const body = Buffer.concat(parts.map((p) => (typeof p === "string" ? Buffer.from(p) : p)));

const opts = {
  hostname: "qrwing.vercel.app",
  path: "/api/upload",
  method: "POST",
  headers: {
    "Content-Type": "multipart/form-data; boundary=" + boundary,
    "Content-Length": body.length,
  },
};

const req = http.request(opts, (res) => {
  let data = "";
  res.on("data", (c) => (data += c));
  res.on("end", () => {
    console.log(res.statusCode, data);
    if (res.statusCode === 200) {
      const parsed = JSON.parse(data);
      console.log("✅ Upload OK! URL:", parsed.url);
    } else {
      console.log("❌ Upload failed");
    }
  });
});
req.write(body);
req.end();
