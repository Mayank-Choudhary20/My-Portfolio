import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing url param", { status: 400 });
  }

  // Only allow http/https URLs
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return new NextResponse("Invalid url", { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        // Pretend to be a browser so sites don't block us
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
        Accept: "image/svg+xml,image/png,image/jpeg,image/*,*/*",
      },
      // 5 second timeout
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return new NextResponse("Failed to fetch icon", { status: response.status });
    }

    const contentType = response.headers.get("content-type") ?? "image/svg+xml";
    const buffer      = await response.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":  contentType,
        // Cache for 7 days — icons don't change
        "Cache-Control": "public, max-age=604800, stale-while-revalidate=86400",
        // Allow browser to show it
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return new NextResponse("Failed to proxy icon", { status: 500 });
  }
}