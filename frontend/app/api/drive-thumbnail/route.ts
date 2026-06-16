import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const fileId = req.nextUrl.searchParams.get("id");

  if (!fileId) {
    return new NextResponse("Missing id", { status: 400 });
  }

  const thumbnailUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`;

  try {
    const response = await fetch(thumbnailUrl, {
      headers: {
        // Mimic a real browser request so Google serves the thumbnail
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept":
          "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer":         "https://drive.google.com/",
      },
    });

    if (!response.ok) {
      return new NextResponse("Failed to fetch thumbnail", {
        status: response.status,
      });
    }

    const buffer      = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") ?? "image/jpeg";

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":  contentType,
        // Cache for 1 hour — thumbnail rarely changes
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return new NextResponse("Proxy error", { status: 500 });
  }
}