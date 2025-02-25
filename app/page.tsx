"use client"

import { NotificationFeed, Xerex } from "xerexjs"

export default function Home() {
  const xerex = new Xerex("123")
  const handleAddMembers = async () => {
    await xerex.addMembers(["1","2","3","4"])
  }
  return (
    <div className='flex justify-end p-3 mr-24'>
      <NotificationFeed userID="123"/>
      <button onClick={() => handleAddMembers()}>Add Members</button>
    </div>
  );
}
