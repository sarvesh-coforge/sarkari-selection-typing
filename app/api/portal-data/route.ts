import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import PortalSnapshot from "@/models/PortalSnapshot";
import { executeSync } from "@/lib/crawler";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();

    // 1. Fetch current published snapshot
    let current: any = await PortalSnapshot.findOne({ status: "published" }).sort({ versionNumber: -1 });

    const tenMinutesMs = 10 * 60 * 1000;
    const isStale = current && current.fetchedAt
      ? Date.now() - new Date(current.fetchedAt).getTime() > tenMinutesMs
      : false;

    // 2. If no data exists or if older than 10 minutes, automatically trigger sync
    if (!current || isStale) {
      console.log(`[portal-data] Triggering auto-sync (reason: ${!current ? "no_data" : "stale_data"})...`);
      const syncResult = await executeSync();
      current = syncResult.snapshot;
    }

    // 3. Fetch list of up to 3 retained versions (summary metadata)
    const retainedVersions = await PortalSnapshot.find()
      .sort({ versionNumber: -1 })
      .limit(3)
      .select("versionNumber status fetchedAt items createdAt");

    const versionSummaries = retainedVersions.map((v) => ({
      versionNumber: v.versionNumber,
      status: v.status,
      fetchedAt: v.fetchedAt,
      itemCount: v.items ? v.items.length : 0,
    }));

    return NextResponse.json({
      success: true,
      current,
      versions: versionSummaries,
      autoSynced: !current || isStale,
    });
  } catch (error: any) {
    console.error("Error in /api/portal-data:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to retrieve portal data",
      },
      { status: 500 }
    );
  }
}
