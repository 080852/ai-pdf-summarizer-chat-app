import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Define the AddNotes mutation
export const AddNotes = mutation({
    args: {
        fileId: v.string(),
        notes: v.any(),
        createdBy: v.string()
    },
    handler: async (ctx, args) => {
        // Insert the note into the database
        const noteId = await ctx.db.insert("notes", {
            fileId: args.fileId,
            notes: args.notes,
            createdBy: args.createdBy,
            createdAt: new Date(),
        });
        return noteId;
    }
});
