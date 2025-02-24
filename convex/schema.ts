import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
    profileImg: v.string(),
    projects: v.optional(v.array(v.id("projects"))), 
  }),

  projects: defineTable({
    ownerId: v.id("users"), 
    name: v.string(),
    apiKey: v.string(),
    members : v.optional(v.array(v.id("members")))
  }),

  members: defineTable({
    developerUserId: v.string(), 
    notifications: v.optional(v.array(v.id("notifications"))), 
  }),

  notifications: defineTable({
    content: v.string(),
    buttonText: v.string(),
    buttonUrl: v.string(),
    recipients: v.array(v.id("members")),
  }),
});
