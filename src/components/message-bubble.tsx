import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";

type MessageBubbleProps = {
  role: "user" | "assistant";
  name: string;
  text: string;
  avatarUrl?: string;
};

export function MessageBubble({
  role,
  name,
  text,
  avatarUrl,
}: MessageBubbleProps) {
  const isUser = role === "user";
  return (
    <div
      className={cn(
        "flex w-full items-end gap-3 z-0",
        isUser ? "justify-end" : "justify-start"
      )}
      role="listitem"
      aria-label={`${name} message`}
    >
      {!isUser && (
        <Avatar className="size-8">
          <AvatarImage
            src={avatarUrl || "/placeholder.svg"}
            alt={`${name} avatar`}
          />
          <AvatarFallback className="text-xs">
            {name?.[0] ?? "A"}
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-6 ",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        )}
      >
        <p className="whitespace-pre-wrap">{text}</p>
      </div>
      {isUser && (
        <Avatar className="size-8">
          <AvatarFallback className="text-xs">You</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
