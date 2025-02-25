import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// ✅ Define allowed origins explicitly
const allowedOrigins = ["http://localhost:3000", "https://xerex.100xbuild.com"];

function getCorsHeaders(origin: string | null) {
  if (origin && allowedOrigins.includes(origin)) {
    return {
      "Access-Control-Allow-Origin": origin, // ✅ Specific origin, not "*"
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Credentials": "true",
    };
  }

  return {
    "Access-Control-Allow-Origin": "https://xerex.100xbuild.com", // ✅ Fallback
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "true",
  };
}

// ✅ Handle OPTIONS request (CORS Preflight)
export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin");
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(origin) });
}

// ✅ Handle POST request (Add Members)
export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get("origin");

    const { members } = await req.json();
    if (!Array.isArray(members) || members.length === 0) {
      return NextResponse.json({ error: "Invalid members array" }, { status: 400, headers: getCorsHeaders(origin) });
    }

    await convex.mutation(api.member.addMembers, { members });

    return NextResponse.json({ message: "Members added successfully!" }, { status: 200, headers: getCorsHeaders(origin) });
  } catch (error) {
    console.error("Error adding members:", error);
    return NextResponse.json({ error: "Failed to add members" }, { status: 500, headers: getCorsHeaders("*") });
  }
}

// ✅ Handle GET request
export async function GET(req: NextRequest) {
  const origin = req.headers.get("origin");
  return NextResponse.json({ message: "Got It" }, { status: 200, headers: getCorsHeaders(origin) });
}
