import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

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
    <main className="mx-auto px-4 py-8">
      <nav aria-label="Breadcrumb" className="mb-4">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:underline flex items-center gap-2"
        >
          <ArrowLeft size={14} /> {" Back to heroes"}
        </Link>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr]">
        <div className=""></div>
        <div className="flex justify-center">
          <div className="max-w-4xl w-full flex flex-col">
            <div className="mb-6 flex items-center gap-4 ">
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
            </div>
            <section className="flex min-h-[50vh] flex-col w-full">
              <ChatBot hero={hero} />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
