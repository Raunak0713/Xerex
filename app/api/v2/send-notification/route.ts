import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ConvexHttpClient } from "convex/browser";
import { NextRequest, NextResponse } from "next/server";

interface NotificationPayload {
  recipients: string[];
  content: string;
  buttonText?: string;
  buttonUrl?: string;
}
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const allowedOrigins = ["http://localhost:3000", "https://xerex.100xbuild.com"];

function getCorsHeaders(origin: string | null) {
  return {
    "Access-Control-Allow-Origin": origin && allowedOrigins.includes(origin) ? origin : "https://xerex.100xbuild.com",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "true",
  };
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin");
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(origin) });
}

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get("origin");
    const { recipients, content, buttonText, buttonUrl }: NotificationPayload = await req.json();

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: "Invalid recipients array" }, { status: 400, headers: getCorsHeaders(origin) });
    }

    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "Content is required and must be a string" }, { status: 400, headers: getCorsHeaders(origin) });
    }

    const notificationData: NotificationPayload = { recipients, content };

    if (buttonText) notificationData.buttonText = buttonText;
    if (buttonUrl) notificationData.buttonUrl = buttonUrl;

    const ourIds = [];

    for (const rec of recipients) {
      let user = await convex.query(api.member.existingMember, { checkId: rec });
      if (!user) {
        const newUserId = await convex.mutation(api.member.addMember, { userId: rec });
        user = await convex.query(api.member.existingMember, { checkId: rec });
      }
      if (user) {
        ourIds.push(user.developerUserId);
      }
    }

    console.log(ourIds)

    return NextResponse.json({ message: "Notification sent successfully", data: notificationData }, { status: 200, headers: getCorsHeaders(origin) });
  } catch (error) {
    console.error("Error processing notification:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500, headers: getCorsHeaders(null) });
  }
}

export async function GET(req: NextRequest) {
  const origin = req.headers.get("origin");
  return NextResponse.json({ message: "Send Notification" }, { status: 200, headers: getCorsHeaders(origin) });
}
