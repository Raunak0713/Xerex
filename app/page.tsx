"use client"

// import PopoverExample from "./Example";
import { NotificationFeed } from 'xerexjs'

export default function Home() {
  return (
    <div className='flex justify-end p-3 mr-24'>
      <NotificationFeed userID=""/>
    </div>
  );
}
