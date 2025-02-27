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

    // Validation
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: "Invalid recipients array" }, { status: 400, headers: getCorsHeaders(origin) });
    }
    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "Content is required and must be a string" }, { status: 400, headers: getCorsHeaders(origin) });
    }

    const ourIds: Id<"members">[] = [];

    for (const rec of recipients) {
      let user = await convex.query(api.member.existingMember, { checkId: rec });

      if (!user) {
        await convex.mutation(api.member.addMember, { userId: rec });
        user = await convex.query(api.member.existingMember, { checkId: rec });
      }

      if (user && user._id) {
        ourIds.push(user._id);
      }
    }
      
    const notificationId = await convex.mutation(api.notification.createNotification, {
      content,
      buttonText: buttonText || "",
      buttonUrl: buttonUrl || "",
      recipients: ourIds, 
    });

    return NextResponse.json(
      { message: "Notification created successfully", notificationId },
      { status: 200, headers: getCorsHeaders(origin) }
    );
  } catch (error) {
    console.error("Error processing notification:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500, headers: getCorsHeaders(null) });
  }
}

export async function GET(req: NextRequest) {
  const origin = req.headers.get("origin");
  return NextResponse.json({ message: "Send Notification" }, { status: 200, headers: getCorsHeaders(origin) });
}
