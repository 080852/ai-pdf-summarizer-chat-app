import { TaskType } from "@google/generative-ai";
import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { v } from "convex/values";
import { action } from "./_generated/server.js";

export const ingest = action({
  args: {
    splitText:v.any(),
    fileId:v.string()
  },
  handler: async (ctx,args) => {
    await ConvexVectorStore.fromTexts(
      args.splitText,//array
      args.fieldId,//string
      new GoogleGenerativeAIEmbeddings({
        apiKey:'AIzaSyA1lSarKc0e6b7EriZ-k_ypu9Np7j5VbVw',
        model: "text-embedding-004", // 768 dimensions
    taskType: TaskType.RETRIEVAL_DOCUMENT,
    title: "Document title",
  }),
      { ctx }
      
    );
    return "completed......"
  },
});

