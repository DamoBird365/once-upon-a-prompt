import { NextRequest, NextResponse } from "next/server";

const VOICE_API_URL = "https://copilot.microsoft.com/c/api/labs/mai-voice";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(VOICE_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `API returned ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate audio", details: String(error) },
      { status: 500 }
    );
  }
}
