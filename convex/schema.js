import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userName: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()), // Optional image URL
    createdAt: v.optional(v.string()), // Optional creation timestamp
  }),

  pdfFiles: defineTable({
    fileId: v.string(), // Unique identifier for the file
    storageId: v.string(), // Storage ID where the file is stored
    fileName: v.string(), // The name of the file
    fileUrl: v.optional(v.string()), // Optional file URL
    createdBy: v.string(), // User who uploaded the file
    createdAt: v.optional(v.string()), // Optional timestamp for file upload
  }),

  documents: defineTable({
    embedding: v.array(v.number()), // Embedding for vector search
    text: v.string(), // Text content
    metadata: v.optional(v.object({
      author: v.optional(v.string()), // Author of the document (optional)
      fileId: v.optional(v.string()), // File ID (optional)
    })),
  }).vectorIndex("byEmbedding", {
    vectorField: "embedding", // Vector field for similarity search
    dimensions: 768, // Vector dimensions (e.g., 768 or 1536)
  }),
});
