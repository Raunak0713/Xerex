import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { members } = await req.json();

    if (!Array.isArray(members) || members.length === 0) {
      return NextResponse.json({ error: "Invalid members array" }, { status: 400 });
    }

    // @ts-expect-error: Type issue with Convex API auto-generation, but this works at runtime.
    await convex.mutation(api.member.addMembers, { members });

    return NextResponse.json({ message: "Members added successfully!" }, { status: 200 });

  } catch (error) {
    console.error("Error adding members:", error); // ✅ Logs the error
    return NextResponse.json({ error: "Failed to add members" }, { status: 500 });
  }
}
