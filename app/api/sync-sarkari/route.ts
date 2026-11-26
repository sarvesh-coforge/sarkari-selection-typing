import { NextResponse } from "next/server";
import { runRollingSarkariSync } from "@/lib/scraper/sarkariCrawler";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const snapshot = await runRollingSarkariSync();
    return NextResponse.json({
      success: true,
      message: `Synced live Sarkari Selection updates (v${snapshot.version}). Retained latest 3 versions in MongoDB.`,
      snapshot,
    });
  } catch (error: any) {
    console.error("[/api/sync-sarkari] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to sync live Sarkari Selection updates",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}
