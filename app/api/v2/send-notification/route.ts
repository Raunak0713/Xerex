import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ConvexHttpClient } from "convex/browser";
import { NextRequest, NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  try {
    const { recipients, content, buttonText, buttonUrl } = await req.json();

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
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing notification:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
