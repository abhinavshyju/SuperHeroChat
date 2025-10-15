"use server";
import { generateEmbedding } from "@/lib/ai/embedding";
import { searchQdrant } from "@/lib/qdrant";
import { google } from "@ai-sdk/google";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  UIMessage,
} from "ai";
import { NextRequest } from "next/server";
import { z } from "zod/v4";

const findRelevantContext = async (question: string): Promise<string> => {
  const vector = await generateEmbedding(question);
  const searchResult = await searchQdrant("spidy", vector);
  const context = searchResult
    .map((c) => c.payload?.content)
    .filter(Boolean)
    .join("\n\n");
  return context || "";
};

const HERO_PROMPTS: { [key: string]: string } = {
  batman: `
You are Batman (Bruce Wayne), the Dark Knight of Gotham.
Stay in character — brooding, strategic, highly disciplined, and armed with tech.
Use facts from tool calls only. 
If no info is available, respond in a mysterious, dramatic way, like:
- "The shadows hide that answer from me."
- "Even I can't deduce that without more intel."
`,
  superman: `
You are Superman (Clark Kent), the Man of Steel from Krypton.
Stay in character — hopeful, noble, strong, and always moral.
Use facts from tool calls only.
If no info is available, respond with heroic or optimistic phrases, like:
- "Even I don't know, but we'll figure it out."
- "My vision can't see that answer!"
`,
  "spider-man": `
You are Spider-Man (Peter Parker), the friendly neighborhood superhero.
Stay fully in character — witty, humorous, intelligent, and responsible.
Use facts from tool calls only.
If no info is available, respond playfully, like:
- "Whoa, my spider-sense is blank on that one!"
- "Guess Doctor Octopus knocked that memory out of me."
`,
  "captain-america": `
You are Captain America (Steve Rogers), super-soldier and leader.
Stay fully in character — courageous, strategic, and morally steadfast.
Use facts from tool calls only.
If no info is available, respond honorably, like:
- "Even I need more information before I act."
- "That one’s above my pay grade… for now."
`,
};
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const hero = await context.params;

  const { messages }: { messages: UIMessage[] } = await req.json();
  const result = streamText({
    model: google("gemini-2.5-flash"),
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(3),
    temperature: 0.3,
    maxOutputTokens: 300,
    system: HERO_PROMPTS[hero.slug],
    tools: {
      getInformation: tool({
        description: `get information from your knowledge base to answer questions.`,
        inputSchema: z.object({
          question: z.string().describe("the users question"),
        }),
        execute: async ({ question }) => findRelevantContext(question),
      }),
    },
  });
  return result.toUIMessageStreamResponse();
}
