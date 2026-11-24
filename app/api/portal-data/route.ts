import { NextResponse } from "next/server";
import { getPortalData } from "@/lib/crawler";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getPortalData();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error in /api/portal-data:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to retrieve portal snapshot data",
      },
      { status: 500 }
    );
  }
}
