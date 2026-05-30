import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_MS } from "@/lib/auth/constants";
import { getAdminServiceAccount } from "@/lib/firebase/env";

export { SESSION_COOKIE_NAME, SESSION_MAX_AGE_MS };

export function sessionCookieOptions(maxAgeMs = SESSION_MAX_AGE_MS) {
  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: Math.floor(maxAgeMs / 1000),
  };
}

/** Verify Firebase ID token via Admin SDK or Identity Toolkit REST */
export async function verifyFirebaseIdToken(idToken: string): Promise<boolean> {
  const account = getAdminServiceAccount();

  if (account) {
    const { getAdminAuth } = await import("@/lib/firebase/admin");
    try {
      await getAdminAuth().verifyIdToken(idToken);
      return true;
    } catch {
      return false;
    }
  }

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) return false;

  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    },
  );

  if (!res.ok) return false;
  const data = (await res.json()) as { users?: unknown[] };
  return Array.isArray(data.users) && data.users.length > 0;
}

/** Create long-lived session cookie when Admin SDK is available */
export async function createSessionCookie(idToken: string): Promise<string> {
  const account = getAdminServiceAccount();
  if (account) {
    const { getAdminAuth } = await import("@/lib/firebase/admin");
    return getAdminAuth().createSessionCookie(idToken, { expiresIn: SESSION_MAX_AGE_MS });
  }
  return idToken;
}

export async function verifySessionCookie(cookie: string): Promise<boolean> {
  const account = getAdminServiceAccount();

  if (account) {
    const { getAdminAuth } = await import("@/lib/firebase/admin");
    try {
      await getAdminAuth().verifySessionCookie(cookie, true);
      return true;
    } catch {
      return verifyFirebaseIdToken(cookie);
    }
  }

  return verifyFirebaseIdToken(cookie);
}
