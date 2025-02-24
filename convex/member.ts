import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";

export const addMembers = mutation({
  args: {
    members: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    for (const mem of args.members) {
      // @ts-expect-error
      const memberAlreadyExist = await ctx.runQuery(api.member.existingMember, { checkId: mem });

      if (!memberAlreadyExist) {
        await ctx.db.insert("members", {
          developerUserId: mem,
        });
      }
    }
  },
});

export const existingMember = query({
  args: {
    checkId: v.string(),
  },
  handler: async (ctx, args) => {
    const exist = await ctx.db
      .query("members")
      .filter((q) => q.eq(q.field("developerUserId"), args.checkId))
      .first(); // Fetch first match

    return exist !== null; 
  },
});
