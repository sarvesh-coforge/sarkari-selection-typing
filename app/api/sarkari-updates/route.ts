import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import SarkariSnapshot from "@/models/SarkariSnapshot";
import { runRollingSarkariSync } from "@/app/api/sync-sarkari/route";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        {
          success: false,
          error: "MongoDB connection unavailable.",
        },
        { status: 503 }
      );
    }

    let snapshot: any = await SarkariSnapshot.findOne({ isActive: true }).sort({ version: -1 }).lean();

    // If database is empty, perform initial live crawl
    if (!snapshot) {
      snapshot = await runRollingSarkariSync();
    }

    const versions = await SarkariSnapshot.find()
      .sort({ version: -1 })
      .limit(3)
      .select("version syncedAt isActive")
      .lean();

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
        error: error?.message || "Failed to load active SarkariResult snapshot from MongoDB",
      },
      { status: 500 }
    );
  }
}
