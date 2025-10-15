import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { HEROES } from "@/components/hero-list";
import { ArrowLeft } from "lucide-react";
import ChatBot from "@/components/chat-bot";

type PageProps = {
  params: { slug: string };
};

export default async function HeroChatPage({ params }: PageProps) {
  const { slug } = await params;
  const hero = HEROES.find((h) => h.slug === slug);
  if (!hero) return notFound();

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <nav aria-label="Breadcrumb" className="mb-4">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:underline flex items-center gap-2"
        >
          <ArrowLeft size={14} /> {" Back to heroes"}
        </Link>
      </nav>

      <header className="mb-6 flex items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-lg ">
          <Image
            src={hero.image || "/placeholder.svg"}
            alt={`${hero.alias} avatar`}
            fill
            sizes="64px"
            className="object-cover"
            priority={false}
          />
        </div>
        <div>
          <h1 className="text-balance text-2xl font-semibold">
            Chat with {hero.alias}
          </h1>
          <p className="text-sm text-muted-foreground">{hero.name}</p>
        </div>
      </header>

      <section
        aria-label={`Conversation with ${hero.alias}`}
        className="flex min-h-[50vh] flex-col"
      >
        <ChatBot hero={hero} />
      </section>
    </main>
  );
}
