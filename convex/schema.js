import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userName: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()), // Mark imageUrl as optional to handle cases where no image is provided
    createdAt: v.optional(v.string()), // Adding a timestamp field for user creation if required
  }),
  
  pdfFiles: defineTable({
    fileId: v.string(), // Unique identifier for the file
    storageId: v.string(), // Storage ID where the file is stored
    fileName: v.string(), // The name of the file
    fileUrl: v.optional(v.string()), // Make fileUrl optional to avoid schema mismatch
    createdBy: v.string(), // User who uploaded the file
    createdAt: v.optional(v.string()), // Optional timestamp for file upload
  }),

  documents: defineTable({
    embedding: v.array(v.number()),
    text: v.string(),
    metadata: v.any(),
  }).vectorIndex("byEmbedding", {
    vectorField: "embedding",
    dimensions: 1536,
  }),
});
