
// // 1 step for storing pdf files as metadata in the convex database we are using this code.

// import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
// import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
// import { v } from "convex/values";
// import { action } from "./_generated/server.js";

// // Define the ingest function
// export const ingest = action({
//   args: v.object({
//     splitText: v.array(v.string()), // Ensure split text is provided
//     fileId: v.string(),
//   }),
//   handler: async (ctx, args) => {
//     try {
//       console.log("Ingesting file:", args.fileId);

//       if (!args.splitText.length) {
//         throw new Error("No text provided for embedding.");
//       }

//       // Initialize the vector store with embeddings
//       const vectorStore = new ConvexVectorStore(
//         new GoogleGenerativeAIEmbeddings({
//           apiKey: 'AIzaSyDjUubSb3hrKglycxKZY69jJDIUTGCPGWg', // Use API key securely
//           model: "text-embedding-004",
//           taskType: "RETRIEVAL_DOCUMENT",
//         }),
//         { ctx }
//       );

//       // Add documents to the vector store
//       await vectorStore.addDocuments(
//         args.splitText.map((text) => ({
//           pageContent: text,
//           metadata: { fileId: args.fileId },
//         }))
//       );

//       return { message: "Ingestion successful" };
//     } catch (error) {
//       console.error("Error during ingestion:", error.message);
//       return { message: "An error occurred during ingestion.", error: error.message };
//     }
//   },
// });



// // // 2 step for ai giving the answer from the pdf.

// import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
// import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
// import { v } from "convex/values";
// import { action } from "./_generated/server.js";

// // Define the search function
// export const search = action({
//   args: v.object({
//     query: v.string(),
//     fileId: v.optional(v.string()), // Optional file-specific search
//   }),
//   handler: async (ctx, args) => {
//     try {
//       console.log("Performing search for:", args.query);

//       // Initialize the vector store
//       const vectorStore = new ConvexVectorStore(
//         new GoogleGenerativeAIEmbeddings({
//           apiKey: 'AIzaSyDjUubSb3hrKglycxKZY69jJDIUTGCPGWg',
//           model: "text-embedding-004",
//           taskType: "RETRIEVAL_DOCUMENT",
//         }),
//         { ctx }
//       );

//       // Perform similarity search
//       const rawResults = await vectorStore.similaritySearch(args.query, 5);

//       // Filter by fileId if provided
//       const filteredResults = args.fileId
//         ? rawResults.filter((result) => result.metadata?.fileId === args.fileId)
//         : rawResults;

//       if (!filteredResults.length) {
//         return { message: "No relevant content found.", data: [] };
//       }

//       // Format the results properly
//       const formattedResults = filteredResults.map((result, index) => ({
//         pageContent: result.pageContent,
//         metadata: result.metadata,
//         id: result.id || `generated-id-${index}`,
//       }));

//       return { message: "Search results found.", data: formattedResults };
//     } catch (error) {
//       console.error("Error during search:", error.message);
//       return { message: "An error occurred during search.", error: error.message };
//     }
//   },
// });




import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { v } from "convex/values";
import { action } from "./_generated/server.js";

// Define the ingest function
export const ingest = action({
  args: v.object({
    splitText: v.array(v.string()), // Ensure split text is provided
    fileId: v.string(),
  }),
  handler: async (ctx, args) => {
    try {
      console.log("Ingesting file:", args.fileId);

      if (!args.splitText.length) {
        throw new Error("No text provided for embedding.");
      }

      // Initialize the vector store with embeddings
      const vectorStore = new ConvexVectorStore(
        new GoogleGenerativeAIEmbeddings({
          apiKey: 'AIzaSyDjUubSb3hrKglycxKZY69jJDIUTGCPGWg', // Use API key securely
          model: "text-embedding-004",
          taskType: "RETRIEVAL_DOCUMENT",
        }),
        { ctx }
      );

      // Add documents to the vector store
      await vectorStore.addDocuments(
        args.splitText.map((text) => ({
          pageContent: text,
          metadata: { fileId: args.fileId },
        }))
      );

      return { message: "Ingestion successful" };
    } catch (error) {
      console.error("Error during ingestion:", error.message);
      return { message: "An error occurred during ingestion.", error: error.message };
    }
  },
});

// Define the search function
export const search = action({
  args: v.object({
    query: v.string(),
    fileId: v.optional(v.string()), // Optional file-specific search
  }),
  handler: async (ctx, args) => {
    try {
      console.log("Performing search for:", args.query);

      // Initialize the vector store
      const vectorStore = new ConvexVectorStore(
        new GoogleGenerativeAIEmbeddings({
          apiKey: 'AIzaSyDjUubSb3hrKglycxKZY69jJDIUTGCPGWg',
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

      if (!filteredResults.length) {
        return { message: "No relevant content found.", data: [] };
      }

      // Format the results properly
      const formattedResults = filteredResults.map((result, index) => ({
        pageContent: result.pageContent,
        metadata: result.metadata,
        id: result.id || `generated-id-${index}`,
      }));

      return { message: "Search results found.", data: formattedResults };
    } catch (error) {
      console.error("Error during search:", error.message);
      return { message: "An error occurred during search.", error: error.message };
    }
  },
});

