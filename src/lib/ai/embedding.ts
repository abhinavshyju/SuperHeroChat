"use server";
import { google } from "@ai-sdk/google";
import { embed, embedMany } from "ai";

const embeddingModel = google.embedding("gemini-embedding-001");

console.log(
  "Google AI Key:",
  process.env.GOOGLE_GENERATIVE_AI_API_KEY ? "Loaded" : "Missing "
);
const generateChunks = (
  input: string,
  chunkSize = 200,
  overlap = 50
): string[] => {
  const words = input.split(/\s+/);
  const chunks: string[] = [];
  let start = 0;

  while (start < words.length) {
    const end = Math.min(start + chunkSize, words.length);
    chunks.push(words.slice(start, end).join(" "));
    start += chunkSize - overlap;
  }
  return chunks;
};

export const generateEmbeddings = async (
  value: string
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(value);
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll("\\n", " ");
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
};
