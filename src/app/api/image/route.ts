import { NextRequest, NextResponse } from "next/server";

const IMAGE_API_URL =
  "https://copilot.microsoft.com/c/api/labs/mai-image-expression";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const payload = {
      prompt: body.prompt,
      model: body.model || "image-02",
      width: body.width || 512,
      height: body.height || 512,
      image_format: body.image_format || "jpeg",
    };

    const response = await fetch(IMAGE_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `API returned ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Check for safety failure in a 200 response
    if (data.errorCode === "safety-failure") {
      return NextResponse.json(
        { error: "safety-failure", details: "Your prompt was flagged by the content safety filter." },
        { status: 422 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate image", details: String(error) },
      { status: 500 }
    );
  }
}
