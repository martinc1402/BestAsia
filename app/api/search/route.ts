import { NextRequest, NextResponse } from "next/server";
import { searchVenues } from "@/lib/queries";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  if (q.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  const results = await searchVenues(q, 8);
  return NextResponse.json({ results });
}
