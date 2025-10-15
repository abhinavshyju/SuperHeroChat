import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import NextAuth from "next-auth";
import authConfig from "@/config/auth.config";

function loadServiceAccount() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT || "";
  if (!raw) return {} as Record<string, unknown>;
  try {
    const json = Buffer.from(raw, "base64").toString("utf8");
    const parsed = JSON.parse(json);
    if (parsed.private_key && typeof parsed.private_key === "string") {
      parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
    }
    return parsed;
  } catch (_e) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed.private_key && typeof parsed.private_key === "string") {
        parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
      }
      return parsed;
    } catch (__e) {
      return {} as Record<string, unknown>;
    }
  }
}

const serviceAccount = loadServiceAccount();

const app =
  getApps().length === 0
    ? initializeApp({
        credential: cert(serviceAccount as any),
      })
    : getApp();

const firestore = getFirestore(app);

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: FirestoreAdapter({ firestore }),
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  ...authConfig,
});
