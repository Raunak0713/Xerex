import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const createNotification = mutation({
  args: {
    content: v.string(),
    buttonText: v.string(),
    buttonUrl: v.string(),
    recipients: v.array(v.id("members")),
  },
  handler: async (ctx, args) => {
    const notificationId = await ctx.db.insert("notifications", {
      content: args.content,
      buttonText: args.buttonText,
      buttonUrl: args.buttonUrl,
      recipients: args.recipients,
    });

    for (const memberId of args.recipients) {
      const member = await ctx.db.get(memberId);
      const prevNotifications = member?.notifications || [];
      const updatedNotifications = [...prevNotifications, notificationId];
    
      await ctx.db.patch(memberId, {
        notifications: updatedNotifications,
      });
    }

    return notificationId;
  }
});
