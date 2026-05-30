import { FIREBASE_PUBLIC_ENV } from "./public-env";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_MS } from "@/lib/auth/constants";

export { SESSION_COOKIE_NAME, SESSION_MAX_AGE_MS };

export const FIREBASE_PUBLIC_ENV_KEYS = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
] as const;

export type FirebasePublicEnvKey = (typeof FIREBASE_PUBLIC_ENV_KEYS)[number];

const PLACEHOLDER_VALUES = new Set([
  "",
  "undefined",
  "null",
  "your-api-key",
  "your_project_id",
  "your-app-id",
  "xxx",
  "changeme",
]);

/** Map canonical env keys to inlined public-env values */
const INLINED_VALUES: Record<FirebasePublicEnvKey, string> = {
  NEXT_PUBLIC_FIREBASE_API_KEY: FIREBASE_PUBLIC_ENV.apiKey,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: FIREBASE_PUBLIC_ENV.authDomain,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: FIREBASE_PUBLIC_ENV.projectId,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: FIREBASE_PUBLIC_ENV.storageBucket,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: FIREBASE_PUBLIC_ENV.messagingSenderId,
  NEXT_PUBLIC_FIREBASE_APP_ID: FIREBASE_PUBLIC_ENV.appId,
};

/** Alternate names users sometimes paste from Firebase snippets */
const ENV_ALIASES: Partial<Record<FirebasePublicEnvKey, string[]>> = {
  NEXT_PUBLIC_FIREBASE_API_KEY: ["FIREBASE_API_KEY"],
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ["FIREBASE_AUTH_DOMAIN"],
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: ["FIREBASE_PROJECT_ID"],
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ["FIREBASE_STORAGE_BUCKET"],
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ["FIREBASE_MESSAGING_SENDER_ID"],
  NEXT_PUBLIC_FIREBASE_APP_ID: ["FIREBASE_APP_ID"],
};

function readEnv(name: FirebasePublicEnvKey): string {
  const inlined = INLINED_VALUES[name]?.trim();
  if (inlined) return inlined;

  const fromProcess = (process.env[name] ?? "").trim();
  if (fromProcess) return fromProcess;

  for (const alias of ENV_ALIASES[name] ?? []) {
    const v = (process.env[alias] ?? "").trim();
    if (v) return v;
  }

  return "";
}

function isValidEnvValue(value: string): boolean {
  if (!value) return false;
  if (PLACEHOLDER_VALUES.has(value.toLowerCase())) return false;
  return true;
}

export function getFirebaseEnvStatus(): {
  ready: boolean;
  missing: FirebasePublicEnvKey[];
  values: Record<FirebasePublicEnvKey, string>;
} {
  const values = {} as Record<FirebasePublicEnvKey, string>;
  const missing: FirebasePublicEnvKey[] = [];

  for (const key of FIREBASE_PUBLIC_ENV_KEYS) {
    const value = readEnv(key);
    values[key] = value;
    if (!isValidEnvValue(value)) {
      missing.push(key);
    }
  }

  return { ready: missing.length === 0, missing, values };
}

export function isClientFirebaseConfigured(): boolean {
  return getFirebaseEnvStatus().ready;
}

export function getClientFirebaseConfig() {
  const status = getFirebaseEnvStatus();
  if (!status.ready) {
    throw new Error(
      `Firebase environment is incomplete. Missing: ${status.missing.join(", ")}. ` +
        `Add them to web/.env.local and restart: npm run dev`,
    );
  }

  return {
    apiKey: status.values.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: status.values.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: status.values.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: status.values.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: status.values.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: status.values.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
}

function optional(name: string): string | undefined {
  const value = (process.env[name] ?? "").trim();
  return value || undefined;
}

export function getAdminServiceAccount() {
  const clientEmail = optional("FIREBASE_CLIENT_EMAIL");
  const privateKey = optional("FIREBASE_PRIVATE_KEY")?.replace(/\\n/g, "\n");
  const projectId =
    optional("FIREBASE_PROJECT_ID") ?? optional("NEXT_PUBLIC_FIREBASE_PROJECT_ID");

  if (!clientEmail || !privateKey || !projectId) return null;

  return { projectId, clientEmail, privateKey };
}

/** Absolute path hint for error UI (client-safe string) */
export const ENV_FILE_HINT = "web/.env.local";
