import { NextResponse } from "next/server";
import { getActiveSarkariSnapshot } from "@/lib/scraper/sarkariCrawler";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { snapshot, versions } = await getActiveSarkariSnapshot();
    return NextResponse.json({
      success: true,
      snapshot,
      versions,
    });
  } catch (error: any) {
    console.error("[/api/sarkari-updates] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to load live Sarkari Selection updates",
      },
      { status: 500 }
    );
  }
}
