"use client";

import type React from "react";
import { useEffect, useRef, useState, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { MessageBubble } from "./message-bubble";
import { getMessages, saveMessage, Message, updateChatTitle } from "@/lib/chat";
import { ScrollArea } from "./ui/scroll-area";

type Hero = {
  alias: string;
  slug: string;
  avatarUrl?: string;
};

type ChatBotProps = {
  hero: Hero;
  chatId: string;
  userId: string;
};

export default function ChatBot({ hero, chatId, userId }: ChatBotProps) {
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `/api/chat/${hero.slug}?chatId=${chatId}`,
      }),
    [hero.slug, chatId]
  );

  const { messages, sendMessage, status } = useChat({ transport });

  const [chats, setChats] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const isReady = status === "ready";
  const isThinking = !isReady;

  useEffect(() => {
    setChats([]);
    async function loadHistory() {
      try {
        const msgs = await getMessages(userId, chatId);
        setChats(msgs);
      } catch (err) {
        console.error("Failed to load chat history:", err);
        setChats([]);
      }
    }
    loadHistory();
  }, [userId, chatId]);

  const updateTitle = async () => {
    await updateChatTitle(userId, chatId);
  };
  useEffect(() => {
    if (!isReady || !messages.length) return;

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== "assistant") return;

    const text = lastMessage.parts
      .map((p) => (p.type === "text" ? p.text : ""))
      .join("")
      .trim();
    const msg: Message = { role: "assistant", text, timestamp: Date.now() };
    setChats((prev) => [...prev, msg]);
    saveMessage(userId, chatId, msg).catch(console.error);

    if (chats.length === 2) {
      updateTitle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, isReady]);

  async function handleSend(text: string) {
    if (!text.trim() || !isReady) return;

    const userMsg: Message = { role: "user", text, timestamp: Date.now() };
    setChats((prev) => [...prev, userMsg]);
    setInput("");

    try {
      await saveMessage(userId, chatId, userMsg);
    } catch (err) {
      console.error("Failed to save user message:", err);
    }

    sendMessage({ text: text.trim() });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    handleSend(input);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  }

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView(false);
  };
  useEffect(() => {
    scrollToBottom();
  }, [chats, isThinking, chatId]);
  return (
    <Card className="flex h-full flex-col overflow-hidden p-0">
      <CardContent className="flex h-full flex-col p-0">
        <ScrollArea className=" max-h-[calc(100vh-314px)]  ">
          <div className="flex-1" ref={scrollRef}>
            {chats.length === 0 ? (
              <div className="flex items-center justify-center p-6 text-center text-muted-foreground h-[calc(100vh-314px)]">
                <div className="space-y-2">
                  <p className="text-pretty">
                    Your conversation with {hero.alias} will appear here.
                  </p>
                  <p className="text-sm">
                    Type a message below to get started.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 p-4 min-h-[calc(100vh-300px)] justify-end">
                {chats.map((m, i) => (
                  <MessageBubble
                    key={i}
                    role={m.role as "user" | "assistant"}
                    name={m.role === "user" ? "You" : hero.alias}
                    text={m.text}
                    avatarUrl={m.role === "user" ? undefined : hero.avatarUrl}
                  />
                ))}

                {isThinking && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="size-2 animate-pulse rounded-full bg-foreground/40" />
                    <div className="size-2 animate-pulse rounded-full bg-foreground/40 [animation-delay:120ms]" />
                    <div className="size-2 animate-pulse rounded-full bg-foreground/40 [animation-delay:240ms]" />
                    <span className="sr-only">{hero.alias} is typing…</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 p-3 bg-card z-50 border-t"
          aria-label="Send a message"
        >
          <label htmlFor="chat-input" className="sr-only">
            Message input
          </label>
          <Input
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!isReady}
            placeholder={`Message ${hero.alias}…`}
            aria-disabled={!isReady}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={!isReady || input.trim().length === 0}
          >
            {isReady ? "Send" : "Thinking…"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
