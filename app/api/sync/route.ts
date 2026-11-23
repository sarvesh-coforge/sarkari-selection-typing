import { NextResponse } from "next/server";
import { executeSync } from "@/lib/crawler";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const result = await executeSync();
    return NextResponse.json({
      success: true,
      message: `Version v${result.version} successfully published and retained within 3-version limit.`,
      version: result.version,
      status: result.status,
      itemCount: result.itemCount,
      fetchedAt: result.fetchedAt,
      snapshot: result.snapshot,
    });
  } catch (error: any) {
    console.error("Error in /api/sync:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to sync and crawl portal data",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}
