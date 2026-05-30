import fs from "fs";
import path from "path";
import { config as loadDotenv } from "dotenv";
import { loadEnvConfig } from "@next/env";
import type { NextConfig } from "next";

const webRoot = __dirname;

function loadEnvFiles() {
  const candidates = [
    path.join(webRoot, ".env.local"),
    path.join(webRoot, ".env"),
    path.join(webRoot, "..", ".env.local"),
    path.join(webRoot, "..", ".env"),
  ];

  for (const file of candidates) {
    if (fs.existsSync(file)) {
      loadDotenv({ path: file, override: true });
    }
  }

  loadEnvConfig(path.resolve(webRoot, ".."));
  loadEnvConfig(webRoot);
}

loadEnvFiles();

const FIREBASE_PUBLIC_KEYS = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
] as const;

const firebasePublicEnv = Object.fromEntries(
  FIREBASE_PUBLIC_KEYS.map((key) => [key, process.env[key] ?? ""]),
);

const hasFirebase = FIREBASE_PUBLIC_KEYS.every((key) => Boolean(process.env[key]?.trim()));

if (process.env.NODE_ENV !== "production") {
  if (hasFirebase) {
    console.log("[firebase] ✓ Environment variables loaded");
  } else {
    console.warn(
      "[firebase] ⚠ Keys missing — create web/.env.local (run: npm run setup:env) then restart dev server",
    );
  }
}

const nextConfig: NextConfig = {
  turbopack: {
    root: webRoot,
  },
  env: firebasePublicEnv,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.cdninstagram.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "scontent.cdninstagram.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.fbcdn.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
