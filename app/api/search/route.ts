import { NextResponse, type NextRequest } from "next/server";
import { searchMulti, TmdbError } from "@/lib/tmdb";
import type { MediaSummary } from "@/lib/types";

/**
 * Server proxy for live search: keeps the TMDB key off the client and lets
 * Vercel's edge cache absorb popular queries (s-maxage + SWR).
 */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim().slice(0, 100) ?? "";
  const page = Math.min(Number(req.nextUrl.searchParams.get("page") ?? 1) || 1, 20);
  if (q.length < 2) return NextResponse.json({ results: [], page: 1, total_pages: 0 });

  try {
    const data = await searchMulti(q, page);
    const results = data.results.filter(
      (r): r is MediaSummary => (r.media_type === "movie" || r.media_type === "tv") && !!r.poster_path,
    );
    return NextResponse.json(
      { results, page: data.page, total_pages: data.total_pages },
      { headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=86400" } },
    );
  } catch (err) {
    const status = err instanceof TmdbError ? err.status : 500;
    return NextResponse.json({ error: "Search is temporarily unavailable" }, { status: status >= 500 ? 502 : status });
  }
}
