import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { config as loadDotenv } from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.join(__dirname, "..");

for (const file of [path.join(webRoot, ".env.local"), path.join(webRoot, ".env")]) {
  if (fs.existsSync(file)) {
    loadDotenv({ path: file, override: true });
  }
}

const required = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
];

const missing = required.filter((key) => !process.env[key]?.trim());

if (missing.length) {
  console.error("Missing Firebase ENV:");
  missing.forEach((v) => console.error(v));
  console.error("\nCreate web/.env.local — copy from web/.env.local.example");
  process.exit(1);
}

console.log("Firebase ENV OK");
