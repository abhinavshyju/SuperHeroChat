import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import NextAuth from "next-auth";
import authConfig from "@/config/auth.config";

const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT!);

const app = !getApps().length
  ? initializeApp({
      credential: cert(serviceAccount),
    })
  : getApp();

const firestore = getFirestore(app);

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: FirestoreAdapter(firestore),
  session: { strategy: "jwt" },
  ...authConfig,
});
