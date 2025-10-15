import authConfig from "@/config/auth.config";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import NextAuth from "next-auth";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: FirestoreAdapter(),
  session: { strategy: "jwt" },
  ...authConfig,
});
