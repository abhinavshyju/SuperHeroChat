import { HeroList } from "@/components/hero-list";
import LoginButton from "@/components/login-button";
import { auth } from "@/lib/auth";
import { Activity } from "lucide-react";

export default async function Home() {
  const session = await auth();

  if (!session) {
    return (
      <section className="mx-auto max-w-3xl rounded-lg p-8 text-center flex-1 h-[calc(100vh-70px)] flex flex-col justify-center gap-2">
        <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm text-muted-foreground">
          <Activity size={16} />
          <span>Chat Assistant</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Your AI Guide Awaits
        </h1>

        <p className="mx-auto mt-3 max-w-prose text-muted-foreground">
          Sign in to start chatting with your favorite superheroes. Get instant
          answers, advice, or just some fun banter!
        </p>

        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <LoginButton />
          <a
            href="#how-it-works"
            className="text-sm font-medium text-foreground/80 underline-offset-4 hover:underline"
          >
            How it works
          </a>
        </div>
      </section>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
          Chat with Superheroes
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Pick a hero and jump into conversation. Ask for advice, learn their
          stories, or just have fun!
        </p>
      </header>

      <HeroList />
    </main>
  );
}
