import { cache } from "react";
import type { Collection } from "./collections";
import { discover, EMPTY_PAGE, resolveKeywordId, safe } from "./tmdb";
import type { MediaSummary } from "./types";

/** Fetch up to `pages` pages of a collection's Discover query (deduped, posters only). */
export const loadCollectionItems = cache(async (c: Collection, pages = 2): Promise<MediaSummary[]> => {
  const keywordId = c.keyword ? await safe(resolveKeywordId(c.keyword), null) : null;
  if (c.keyword && !keywordId) return [];
  const filters = { ...c.filters, ...(keywordId ? { with_keywords: String(keywordId) } : {}) };
  const results = await Promise.all(
    Array.from({ length: pages }, (_, i) => safe(discover(c.type, { ...filters, page: i + 1 }), EMPTY_PAGE)),
  );
  const seen = new Set<number>();
  return results
    .flatMap((r) => r.results)
    .filter((m) => m.poster_path && !seen.has(m.id) && (seen.add(m.id), true));
});
