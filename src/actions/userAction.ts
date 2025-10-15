import { auth } from "@/lib/auth";
import { usersCollection } from "@/lib/collections/usersCollection";
import { User } from "@/types/user";

export const getUser = async (): Promise<{ data?: User; error?: string }> => {
  const session = await auth();
  if (!session) return { error: "Session not found" };

  const user = session.user;
  if (!user?.email) return { error: "User email not found" };

  try {
    const snapshot = await usersCollection
      .where("email", "==", user.email)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return { error: "User not found" };
    }

    const doc = snapshot.docs[0];
    return { data: { id: doc.id, ...doc.data() } as User };
  } catch (error) {
    console.error("Error getting user:", error);
    return { error: "Failed to fetch user" };
  }
};
