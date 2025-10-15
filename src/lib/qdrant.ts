"use server";
import { QdrantClient } from "@qdrant/js-client-rest";
const { QDRANT_URL, QDRANT_API_KEY } = process.env;

if (!QDRANT_URL || !QDRANT_API_KEY) {
  throw new Error(" Missing Qdrant environment variables");
}

const qdrant = new QdrantClient({
  url: QDRANT_URL,
  apiKey: QDRANT_API_KEY,
});

export const ensureCollection = async (collectionName: string) => {
  try {
    const collections = await qdrant.getCollections();
    const exists = collections.collections.some(
      (c) => c.name === collectionName
    );

    if (!exists) {
      await qdrant.createCollection(collectionName, {
        vectors: { size: 3072, distance: "Cosine" },
      });
      console.log(` Collection created: ${collectionName}`);
    } else {
      console.log(`Collection already exists: ${collectionName}`);
    }
  } catch (err) {
    console.error("Error ensuring collection:", err);
  }
};

export const insertToQdrant = async (
  collectionName: string,
  id: string | number,
  vector: number[],
  payload: Record<string, unknown>
) => {
  const response = await qdrant.upsert(collectionName, {
    wait: true,
    points: [
      {
        id,
        vector,
        payload,
      },
    ],
  });
  return response;
};

export const searchQdrant = async (
  collectionName: string,
  vector: number[]
) => {
  return await qdrant.search(collectionName, {
    vector,
    limit: 3,
  });
};
