import { NextRequest, NextResponse } from "next/server";
import { getOrScrapePostDetail } from "@/lib/crawler";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const title = searchParams.get("title") || undefined;
    const url = searchParams.get("url") || undefined;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Missing required 'slug' parameter" },
        { status: 400 }
      );
    }

    const detail = await getOrScrapePostDetail(slug, title, url);

    return NextResponse.json({
      success: true,
      detail,
    });
  } catch (error: any) {
    console.error("Error in /api/post-detail:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to fetch post notification details",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, title, url } = body;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Missing required 'slug' in body" },
        { status: 400 }
      );
    }

    const detail = await getOrScrapePostDetail(slug, title, url);

    return NextResponse.json({
      success: true,
      detail,
    });
  } catch (error: any) {
    console.error("Error in /api/post-detail POST:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to fetch post notification details",
      },
      { status: 500 }
    );
  }
}
