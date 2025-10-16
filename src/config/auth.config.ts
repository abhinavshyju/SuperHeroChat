import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
} satisfies NextAuthOptions;

export default authOptions;
