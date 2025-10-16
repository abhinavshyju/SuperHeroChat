import { signIn } from "@/lib/auth";

export const logIn = () => {
  signIn("google", {
    redirectTo: "/",
  });
};
