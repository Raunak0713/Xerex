import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// ✅ Define allowed origins explicitly
const allowedOrigins = ["http://localhost:3000", "https://xerex.100xbuild.com"];

function getCorsHeaders(origin: string | null) {
  return {
    "Access-Control-Allow-Origin": origin && allowedOrigins.includes(origin) ? origin : "*", // Allow specific origins
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
}

// ✅ Handle OPTIONS request (CORS Preflight)
export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin") || "*";
  return NextResponse.json(null, { status: 204, headers: getCorsHeaders(origin) });
}

// ✅ Handle POST request
export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get("origin") || "*";

    // Extract Bearer Token
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split("Bearer ")[1] || null;

    // Validate token
    if (!token || token !== process.env.AUTHORIZATION_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: getCorsHeaders(origin) });
    }

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
  const origin = req.headers.get("origin") || "*";

  // Extract Bearer Token
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.split("Bearer ")[1] || null;

  if (!token || token !== process.env.AUTHORIZATION_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: getCorsHeaders(origin) });
  }

  return NextResponse.json({ message: "Got It" }, { status: 200, headers: getCorsHeaders(origin) });
}
