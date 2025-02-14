import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { v } from "convex/values";
import { action } from "./_generated/server.js";

// Define the search function
export const search = action({
  args: v.object({
    query: v.string(),
    fileId: v.optional(v.string()), // Search within a specific file if provided
  }),
  handler: async (ctx, args) => {
    try {
      console.log("Performing search for:", args.query);

      // Initialize the vector store with embeddings
      const vectorStore = new ConvexVectorStore(
        new GoogleGenerativeAIEmbeddings({
          apiKey: process.env.GOOGLE_API_KEY, // Use API key securely
          model: "text-embedding-004",
          taskType: "RETRIEVAL_DOCUMENT",
        }),
        { ctx }
      );

      // Perform similarity search
      const rawResults = await vectorStore.similaritySearch(args.query, 5);
      
      // Filter by fileId if provided
      const filteredResults = args.fileId
        ? rawResults.filter((result) => result.metadata?.fileId === args.fileId)
        : rawResults;

      if (filteredResults.length === 0) {
        return { message: "No search results found." };
      }

      // Ensure Convex-supported response format
      const formattedResults = filteredResults.map((result, index) => ({
        pageContent: result.pageContent,
        metadata: result.metadata,
        id: result.id || `generated-id-${index}`, // Ensure a valid ID is assigned
      }));

      return { message: "Search results found.", data: formattedResults };
    } catch (error) {
      console.error("Error during search:", error.message);
      return { message: "An error occurred during search.", error: error.message };
    }
  },
});
