"use client";

import type React from "react";

import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { MessageBubble } from "./message-bubble";

type Hero = {
  alias: string;
  slug: string;
  avatarUrl?: string;
};

type ChatBotProps = {
  hero: Hero;
};

export default function ChatBot({ hero }: ChatBotProps) {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: `/api/chat/${hero.slug}`,
    }),
  });

  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  const isReady = status === "ready";
  const isThinking = !isReady;

  const formatted = useMemo(() => {
    return messages.map((m) => {
      const text = m.parts
        .map((p) => (p.type === "text" ? p.text : ""))
        .join("")
        .trim();
      const role = m.role === "user" ? "user" : "assistant";
      return { id: m.id, role, text };
    });
  }, [messages]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || !isReady) return;
    sendMessage({ text: trimmed });
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const trimmed = input.trim();
      if (trimmed && isReady) {
        sendMessage({ text: trimmed });
        setInput("");
      }
    }
  }

  return (
    <Card className="flex h-full min-h-[560px]  flex-col overflow-hidden p-0">
      <CardContent className="flex h-full flex-col p-0 min-h-[560px]  ">
        <div className="flex-1  max-h-[65vh] min-h-[560px] overflow-y-auto">
          {formatted.length === 0 ? (
            <div className="flex h-full items-center justify-center p-6 text-center text-muted-foreground">
              <div className="space-y-2">
                <p className="text-pretty">
                  Your conversation with {hero.alias} will appear here.
                </p>
                <p className="text-sm">Type a message below to get started.</p>
              </div>
            </div>
          ) : (
            <div
              ref={listRef}
              role="list"
              className="flex h-full flex-col gap-3 overflow-y-auto p-4"
            >
              {formatted.map((m) => (
                <MessageBubble
                  key={m.id}
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
              <div ref={endRef} />
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 p-3 bg-card z-50 border-t "
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
