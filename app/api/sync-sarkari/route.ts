import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import SarkariSnapshot from "@/models/SarkariSnapshot";
import { scrapeSarkariResultLive } from "@/lib/scraper/sarkariCrawler";

export const dynamic = "force-dynamic";

export async function runRollingSarkariSync() {
  const db = await connectToDatabase();
  if (!db) {
    throw new Error("MongoDB connection unavailable. Cannot persist SarkariResult snapshot.");
  }

  // 1. Live crawl sarkariresult.com
  const { hotUpdates, categories } = await scrapeSarkariResultLive();

  // 2. Guard: abort if core categories returned 0 items so previous active version stays intact
  if (
    categories.result.length === 0 ||
    categories.admitCard.length === 0 ||
    categories.latestJob.length === 0
  ) {
    throw new Error(
      `Aborted sync: core categories incomplete (Result: ${categories.result.length}, Admit Card: ${categories.admitCard.length}, Latest Job: ${categories.latestJob.length}). Previous active snapshot preserved.`
    );
  }

  // 3. Determine next version number
  const latest = await SarkariSnapshot.findOne().sort({ version: -1 }).select("version").lean();
  const nextVersion = latest && typeof latest.version === "number" ? latest.version + 1 : 1;

  // 4. Mark all previous snapshots inactive
  await SarkariSnapshot.updateMany({ isActive: true }, { $set: { isActive: false } });

  // 5. Save new active snapshot
  const created = await SarkariSnapshot.create({
    version: nextVersion,
    syncedAt: new Date(),
    isActive: true,
    hotUpdates,
    categories,
  });

  // 6. Strictly retain only the latest 3 versions in MongoDB
  const allVersions = await SarkariSnapshot.find().sort({ version: -1 }).select("_id version").lean();
  if (allVersions.length > 3) {
    const idsToDelete = allVersions.slice(3).map((doc) => doc._id);
    await SarkariSnapshot.deleteMany({ _id: { $in: idsToDelete } });
  }

  return created.toObject();
}

export async function POST() {
  try {
    const snapshot = await runRollingSarkariSync();
    return NextResponse.json({
      success: true,
      message: `Synced live SarkariResult data (v${snapshot.version}). Retained latest 3 versions in MongoDB.`,
      snapshot,
    });
  } catch (error: any) {
    console.error("[/api/sync-sarkari] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to sync live SarkariResult updates",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}
