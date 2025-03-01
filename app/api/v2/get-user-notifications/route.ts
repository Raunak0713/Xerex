import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ConvexHttpClient } from "convex/browser";
import { NextRequest, NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const allowedOrigins = ["http://localhost:3000", "https://xerex.100xbuild.com"];

function getCorsHeaders(origin: string | null) {
  // Check if the origin is in our allowed list
  const validOrigin = origin && allowedOrigins.includes(origin) 
    ? origin 
    : "https://xerex.100xbuild.com";
    
  return {
    "Access-Control-Allow-Origin": validOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin");
  return new NextResponse(null, { 
    status: 204, 
    headers: getCorsHeaders(origin) 
  });
}

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get("origin");
    
    // Log the origin for debugging
    console.log("Request origin:", origin);
    
    const { userID } = await req.json(); // Read JSON body

    // Validation
    if (!userID || typeof userID !== "string") {
      return NextResponse.json(
        { error: "Invalid User ID" }, 
        { status: 400, headers: getCorsHeaders(origin) }
      );
    }

    // Fetch notifications
    let notifications: Id<"notifications">[] = [];
    const userNotifications = await convex.query(api.member.getAllNotificationsOfMember, { userId: userID });

    if (userNotifications) {
      notifications = userNotifications;
    }

    // Set up the response with proper headers
    return NextResponse.json(
      { message: "Fetched User Notifications successfully", notifications },
      { status: 200, headers: getCorsHeaders(origin) }
    );
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to process request" }, 
      { status: 500, headers: getCorsHeaders(null) }
    );
  }
}