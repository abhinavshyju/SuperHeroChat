import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ChatBotContainer from "@/components/chat-bot-container";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import authOptions from "@/config/auth.config";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

export default async function HeroChatPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user.email;
  const q = query(collection(db, "users"), where("email", "==", email));
  const querySnapshot = await getDocs(q);
  const [user] = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  if (!user.id) {
    return notFound();
  }
  return (
    <main className="mx-auto px-4 py-8 md:h-[calc(100vh-65px)] overflow-y-hidden">
      <nav className="mb-4 flex">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:underline flex items-center gap-2"
        >
          <ArrowLeft size={14} /> <span>Back to heroes</span>
        </Link>
      </nav>
      <ChatBotContainer userId={user.id} />
    </main>
  );
}
