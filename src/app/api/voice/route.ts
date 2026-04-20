import { NextRequest, NextResponse } from "next/server";

const VOICE_API_URL = "https://copilot.microsoft.com/c/api/labs/mai-voice";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(VOICE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `API returned ${response.status}`, details: errorText },
        { status: response.status, headers: CORS_HEADERS }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { headers: CORS_HEADERS });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate audio", details: String(error) },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
