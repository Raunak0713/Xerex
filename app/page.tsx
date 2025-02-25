"use client"

import { NotificationFeed, Xerex } from "xerexjs"

export default function Home() {
  const xerex = new Xerex("123")
  const handleAddMembers = async () => {
    const users = ["Raunak","Swanand","Anish","Dhairya"]
    await xerex.addMembers(users)
    await xerex.sendNotification(users, "Heyy", "Button Text", "Button Url")
  }
  return (
    <div className='flex justify-end p-3 mr-24'>
      <NotificationFeed userID="123"/>
      <button onClick={() => handleAddMembers()}>Add Members</button>
    </div>
  );
}
