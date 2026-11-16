/**
 * Request-scoped memoization: generateMetadata() and the page component both
 * need the same details object — React `cache` guarantees a single call per
 * request, on top of Next's cross-request Data Cache.
 */
import { cache } from "react";
import { notFound } from "next/navigation";
import { getMovie, getTv, TmdbError } from "./tmdb";

async function or404<T>(p: Promise<T>): Promise<T> {
  try {
    return await p;
  } catch (err) {
    if (err instanceof TmdbError && err.status === 404) notFound();
    throw err;
  }
}

export const loadMovie = cache((id: number) => or404(getMovie(id)));
export const loadTv = cache((id: number) => or404(getTv(id)));
