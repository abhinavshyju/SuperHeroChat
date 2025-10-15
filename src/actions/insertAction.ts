import { generateEmbeddings } from "@/lib/ai/embedding";
import { ensureCollection, insertToQdrant } from "@/lib/qdrant";

export const insertSpidyData = async (
  data: string
): Promise<{ error?: string; success: boolean }> => {
  try {
    await ensureCollection("spidy");

    const embeddedData = await generateEmbeddings(data);
    for (const e of embeddedData) {
      const id = crypto.randomUUID();
      await insertToQdrant("spidy", id, e.embedding, { content: e.content });
    }
    console.log("insertion sucess");
    return { success: true };
  } catch (error) {
    console.log(error);
    return { error: `Unknown error :${error}`, success: false };
  }
};
