import { GET as getUpdates } from "@/app/api/sarkari-updates/route";

export const dynamic = "force-dynamic";

export async function GET() {
  return getUpdates();
}
