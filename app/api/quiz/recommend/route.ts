import { NextRequest, NextResponse } from "next/server";
import { getQuizResults } from "@/lib/queries";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { tagIds } = body as { tagIds: string[] };

  if (!tagIds || !Array.isArray(tagIds) || tagIds.length === 0) {
    return NextResponse.json({ error: "tagIds required" }, { status: 400 });
  }

  const results = await getQuizResults(tagIds, 5);
  return NextResponse.json({ results });
}
