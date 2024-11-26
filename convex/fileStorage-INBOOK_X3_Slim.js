import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Mutation to generate the upload URL
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// Mutation to add a file entry to the database
export const AddFileEntryToDb = mutation({
  args: {
    fileId: v.string(),
    storageId: v.string(),
    fileName: v.string(),
    createdBy: v.string(),
    fileUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.insert("pdfFiles", {
      fileId: args.fileId,
      fileName: args.fileName,
      storageId: args.storageId,
      fileUrl: args.fileUrl,
      createdBy: args.createdBy,
    });
    return "Inserted";
  },
});

// Mutation to get the file URL from storage based on the storageId
export const getFileUrl = mutation({
  args: {
    storageId: v.string(),
  },
  handler: async (ctx, agrs) => {
    // Fixed the typo here: "agr" to "args"
    const url = await ctx.storage.getUrl(agrs.storageId);
    return { fileUrl: url }; // Ensure the URL is returned in an object format
  },
});
