import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Function to validate the token
function isValidToken(token: string | null): boolean {
  return token === process.env.AUTHORIZATION_SECRET;
}

// CORS Headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Allow all origins (update for security)
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle OPTIONS (Preflight Request)
export async function OPTIONS() {
  return NextResponse.json(null, { status: 204, headers: corsHeaders });
}

// Handle POST Request
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split("Bearer ")[1] || null;

    if (!isValidToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

    const { members } = await req.json();
    if (!Array.isArray(members) || members.length === 0) {
      return NextResponse.json({ error: "Invalid members array" }, { status: 400, headers: corsHeaders });
    }

    await convex.mutation(api.member.addMembers, { members });

    return NextResponse.json({ message: "Members added successfully!" }, { status: 200, headers: corsHeaders });

  } catch (error) {
    console.error("Error adding members:", error);
    return NextResponse.json({ error: "Failed to add members" }, { status: 500, headers: corsHeaders });
  }
}

// Handle GET Request
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.split("Bearer ")[1] || null;

  if (!isValidToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
  }

  return NextResponse.json({ message: "Got It" }, { status: 200, headers: corsHeaders });
}
