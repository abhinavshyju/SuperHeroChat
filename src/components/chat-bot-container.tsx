"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ChatBot from "./chat-bot";
import { useSearchParams } from "next/navigation";
import { HEROES } from "./hero-list";
import { Button } from "./ui/button";
import { createChat, HeroChat, listChats } from "@/lib/chat";
import { ScrollArea } from "./ui/scroll-area";

interface ChatBotProp {
  userId: string;
}
export default function ChatBotContainer({ userId }: ChatBotProp) {
  const searchParms = useSearchParams();
  const value = searchParms.get("hero");
  const hero = HEROES.find((h) => h.slug === value);

  const [chats, setChats] = useState<
    { heroSlug: string; title: string; createdAt: number; id: string }[]
  >([]);
  const [chatId, setChatId] = useState<string>("");

  useEffect(() => {
    const fetchChats = async () => {
      if (!hero) {
        setChats([]);
        setChatId("");
        return;
      }
      const chatsResult = await listChats(userId, hero.slug);
      if (chatsResult.length === 0) {
        await createNewChat();
      }
      setChats(chatsResult);
      setChatId(chatsResult[0].id);
    };

    fetchChats();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hero, userId]);

  const createNewChat = async () => {
    if (!hero) return;
    const id = await createChat(userId, hero.slug, "My new chat");
    setChatId(id);
    const newChats = await listChats(userId, hero.slug);
    setChats(newChats);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4 md:h-[calc(100vh-180px)] h-full ">
      <div className="border-r hidden md:block w-full py-4 pr-4">
        <Button className="w-full" variant={"outline"} onClick={createNewChat}>
          New Chat
        </Button>
        <div className="flex justify-center mt-4 pt-4 border-t">
          {chats.length == 0 ? (
            <div className="">
              <h1>No chats found</h1>
            </div>
          ) : (
            <ScrollArea className=" max-h-[calc(100vh-314px)]  flex flex-col w-full">
              {chats.map((c, index) => (
                <Button
                  variant={"ghost"}
                  className={`w-full text-left  justify-start ${
                    chatId === c.id && "bg-secondary"
                  }`}
                  key={index}
                  onClick={() => setChatId(c.id)}
                >
                  {c.title}
                </Button>
              ))}
            </ScrollArea>
          )}
        </div>
      </div>
      <div className="flex justify-center">
        {!hero || !chatId ? (
          <div className=""></div>
        ) : (
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
            <section className="flex h-full flex-col  ">
              <ChatBot hero={hero} chatId={chatId} userId={userId} />
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
