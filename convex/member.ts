import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";

export const addMembers = mutation({
  args: {
    members: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    for (const mem of args.members) {
     
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
      .unique()

    return exist
  },
});

export const addMember = mutation({
  args : {
    userId : v.string(),
  },
  handler : async(ctx, args) => {
    await ctx.db.insert("members", {
      developerUserId : args.userId
    });
  }
})

export const getAllNotificationsOfMember = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const convexMember = await ctx.db
      .query("members")
      .filter((q) => q.eq(q.field("_id"), args.userId))
      .first();

    if (!convexMember) return [];

    return convexMember.notifications || [];
  }
});
