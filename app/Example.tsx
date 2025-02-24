"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bell, X } from "lucide-react";

interface PopoverExampleProps {
  align?: "start" | "center" | "end";
  userID: string;
}

const PopoverExample = ({ align = "center", userID }: PopoverExampleProps) => {
  const notifications = [
    { id: "1", content: "You have a new message!", buttonText: "View", buttonUrl: "/messages" },
    { id: "2", content: "Your order has been shipped.", buttonText: "Track Order", buttonUrl: "/orders" },
    { id: "3", content: "New comment on your post.", buttonText: "", buttonUrl: "" },
    { id: "4", content: "Reminder: Meeting at 3 PM.", buttonText: "Join", buttonUrl: "/meeting" },
    { id: "5", content: "Your subscription is about to expire.", buttonText: "Renew", buttonUrl: "/billing" },
    { id: "6", content: "New friend request from John.", buttonText: "Accept", buttonUrl: "/friends" },
    { id: "7", content: "Your profile was viewed 5 times today.", buttonText: "", buttonUrl: "" },
    { id: "8", content: "Security alert: Login from a new device.", buttonText: "Review", buttonUrl: "/security" },
    { id: "9", content: "Flash sale: 50% off on all items!", buttonText: "Shop Now", buttonUrl: "/deals" },
    { id: "10", content: "Event reminder: Conference starts tomorrow.", buttonText: "Details", buttonUrl: "/events" },
  ];

  return (
    <Popover>
      <PopoverTrigger className="p-2 rounded-full bg-blue-100 relative hover:bg-blue-200 transition">
        <Bell className="w-6 h-6 text-gray-700" />
        {notifications.length > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md">
            {notifications.length > 9 ? "9+" : notifications.length}
          </div>
        )}
      </PopoverTrigger>
      
      <PopoverContent align={align} className="w-[400px] bg-white shadow-xl rounded-2xl p-4 flex flex-col border border-gray-200">
        {/* Scrollable Notification List */}
        <div className="max-h-[330px] overflow-y-auto flex flex-col gap-3 scrollbar-w-[1px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {notifications.map((item) => (
            <div
              key={item.id}
              className="bg-gray-50 hover:bg-gray-100 shadow-md rounded-xl p-4 transition duration-300 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <p className="text-md text-gray-800 flex-1">{item.content}</p>
                <X size={18} className="text-gray-400 hover:text-red-500 cursor-pointer transition" />
              </div>
              {item.buttonText && (
                <button className="mt-1 text-gray-800 bg-blue-200 hover:bg-blue-300 px-3 py-1 rounded-md transition w-fit shadow">
                  {item.buttonText}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Styled Banner */}
        <div className="mt-3 py-2 text-sm text-gray-700 text-center border-t border-gray-200 bg-gradient-to-r from-blue-50/10 to-blue-100 rounded-b-2xl">
          Made with{" "}
          <a
            href="https://github.com/your-xerexjs-repo"
            className="underline font-semibold  transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            XerexJS {userID}
          </a>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PopoverExample;
