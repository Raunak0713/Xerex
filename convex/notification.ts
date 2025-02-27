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

    // Update each recipient's notifications array
    for (const userId of args.recipients) {
      const user = await ctx.db.get(userId);
      if (user) {
        const currentNotifications = user.notifications || [];
        await ctx.db.patch(userId, {
          notifications: [...currentNotifications, notificationId],
        });
      }
    }

    return notificationId;
  }
});
