import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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
    fileUrl: v.string()
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("pdfFiles", {
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
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId);
    return { fileUrl: url };
  },
});

// Query to get the file record based on the fileId
export const GetFileRecord = query({
  args: {
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    const fileRecord = await ctx.db.query("pdfFiles")
      .filter((q) => q.eq(q.field("fileId"), args.fileId))
      .first();
    if (!fileRecord) {
      throw new Error(`File with ID ${args.fileId} not found.`);
    }
    return fileRecord;
  },
});
