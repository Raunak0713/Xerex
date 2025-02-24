import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  try {
    const { members } = await req.json();

    if (!Array.isArray(members) || members.length === 0) {
      return NextResponse.json({ error: "Invalid members array" }, { status: 400 });
    }

    await convex.mutation(api.member.addMembers, { members });

    return NextResponse.json({ message: "Members added successfully!" }, { status: 200 });

  } catch (error) {
    console.error("Error adding members:", error); // ✅ Logs the error
    return NextResponse.json({ error: "Failed to add members" }, { status: 500 });
  }
}

export async function GET(){
  return NextResponse.json({ message : "Got It"}, { status : 200 });
}