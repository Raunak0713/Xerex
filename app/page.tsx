"use client";

import { NotificationFeed, Xerex } from "xerexjs";

export default function Home() {
  const xerex = new Xerex("123")

  const handleAddMembers = async () => {
    try {
      const users = ["yfmae","reli"];
      await xerex.addMembers(users);
      console.log("✅ Members added successfully");
      try {
        await xerex.sendNotification(users, "Frontend", "ButtonText", "ButtonUrl");
        console.log("🔔 Notification Sent Successfully")
      } catch (error) {
        console.error("❌ Error Sending Notification:", error)
      }
    } catch (error) {
      console.error("❌ Error adding members:", error);
    }
  };

  return (
    <div className="flex justify-end p-3 mr-24">
      <NotificationFeed userID="123" />
      <button onClick={handleAddMembers}>Add Members</button>
    </div>
  );
}
