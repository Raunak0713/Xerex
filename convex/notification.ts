import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createNotification = mutation({
  args : {
    content : v.string(),
    buttonText : v.string(),
    buttonUrl : v.string(),
    recipients : v.array(v.id("members"))
  },
  handler : async(ctx, args) => {
    
  }
})