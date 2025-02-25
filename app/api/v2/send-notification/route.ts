import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { recipients, content, buttonText, buttonUrl } = await req.json();

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: "Invalid recipients array" }, { status: 400 });
    }

    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "Content is required and must be a string" }, { status: 400 });
    }

    const notificationData: any = {
      recipients,
      content,
    };

    if (buttonText) notificationData.buttonText = buttonText;
    if (buttonUrl) notificationData.buttonUrl = buttonUrl;

    console.log("Received Notification Data:", notificationData);

    return NextResponse.json({ message: "Notification sent successfully", data: notificationData }, { status: 200 });
  } catch (error) {
    console.error("Error processing notification:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
