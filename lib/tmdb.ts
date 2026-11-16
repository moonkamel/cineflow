/**
 * TMDB v3 client — SERVER ONLY (never import from a "use client" file:
 * the API key would leak into the browser bundle).
 *
 * Auth strategy
 * -------------
 *  - Prototype: `TMDB_API_KEY` sent as `?api_key=` (v3 method).
 *  - Production: set `TMDB_READ_TOKEN` (v4 read token) and every request
 *    switches to `Authorization: Bearer <token>` with zero code changes.
 *
 * Caching
 * -------
 * Every call goes through Next's Data Cache with a per-endpoint `revalidate`
 * window (ISR / stale-while-revalidate): the first visitor after expiry gets
 * the cached copy instantly while Next refreshes it in the background.
 */
import type {
  Genre,
  MediaSummary,
  MediaType,
  MovieDetails,
  MovieSummary,
  MultiResult,
  Paged,
  TvDetails,
  TvSummary,
} from "./types";

const API_BASE = "https://api.themoviedb.org/3";
export const IMG_BASE = "https://image.tmdb.org/t/p";

/** Revalidation windows (seconds). */
export const TTL = {
  trending: 60 * 60, // 1h
  lists: 60 * 60 * 6, // 6h
  details: 60 * 60 * 24, // 24h
  search: 60 * 10, // 10min
  genres: 60 * 60 * 24 * 7, // 7d
} as const;

export class TmdbError extends Error {
  constructor(
    public status: number,
    public path: string,
    message?: string,
  ) {
    super(message ?? `TMDB ${status} on ${path}`);
    this.name = "TmdbError";
  }
}

type Params = Record<string, string | number | boolean | undefined>;

function buildRequest(path: string, params: Params = {}): { url: string; headers: HeadersInit } {
  const url = new URL(API_BASE + path);
  const headers: Record<string, string> = { Accept: "application/json" };
  const bearer = process.env.TMDB_READ_TOKEN;
  const apiKey = process.env.TMDB_API_KEY;

  if (bearer) headers.Authorization = `Bearer ${bearer}`;
  else if (apiKey) url.searchParams.set("api_key", apiKey);
  else throw new TmdbError(500, path, "Missing TMDB_API_KEY or TMDB_READ_TOKEN");

  // US market defaults
  url.searchParams.set("language", "en-US");
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  return { url: url.toString(), headers };
}

export async function tmdb<T>(
  path: string,
  params: Params = {},
  { revalidate = TTL.lists, retries = 1 }: { revalidate?: number; retries?: number } = {},
): Promise<T> {
  const { url, headers } = buildRequest(path, params);

  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url, {
        headers,
        next: { revalidate, tags: ["tmdb", `tmdb:${path}`] },
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) return (await res.json()) as T;
      // Retry on rate limiting / transient upstream errors only.
      if ((res.status === 429 || res.status >= 500) && attempt < retries) {
        await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
        continue;
      }
      throw new TmdbError(res.status, path);
    } catch (err) {
      if (err instanceof TmdbError) throw err;
      if (attempt < retries) continue;
      throw new TmdbError(503, path, (err as Error).message);
    }
  }
}

/** For non-critical sections (rows, "similar"): never crash the page. */
export async function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch (err) {
    console.error("[tmdb]", (err as Error).message);
    return fallback;
  }
}

const emptyPage = <T,>(): Paged<T> => ({ page: 1, results: [], total_pages: 0, total_results: 0 });
export const EMPTY_PAGE = emptyPage<never>();

/* ------------------------------------------------------------------ */
/* Images                                                             */
/* ------------------------------------------------------------------ */

export type ImageSize = "w92" | "w185" | "w342" | "w500" | "w780" | "w1280" | "original";
export const img = (path: string | null | undefined, size: ImageSize = "w500") =>
  path ? `${IMG_BASE}/${size}${path}` : null;

/* ------------------------------------------------------------------ */
/* Endpoints                                                          */
/* ------------------------------------------------------------------ */

export const getTrending = (window: "day" | "week" = "day", page = 1) =>
  tmdb<Paged<MediaSummary | { media_type: "person" }>>(`/trending/all/${window}`, { page }, { revalidate: TTL.trending }).then(
    (p) => ({ ...p, results: p.results.filter((r): r is MediaSummary => r.media_type !== "person") }),
  );

export const getPopular = (type: MediaType, page = 1) =>
  tmdb<Paged<MediaSummary>>(`/${type}/popular`, { page, region: "US" });

export const getTopRated = (type: MediaType, page = 1) =>
  tmdb<Paged<MediaSummary>>(`/${type}/top_rated`, { page, region: "US" });

export const getNowPlaying = (page = 1) =>
  tmdb<Paged<MovieSummary>>(`/movie/now_playing`, { page, region: "US" }, { revalidate: TTL.trending });

export const getOnTheAir = (page = 1) =>
  tmdb<Paged<TvSummary>>(`/tv/on_the_air`, { page }, { revalidate: TTL.trending });

const APPEND = "credits,videos,similar,recommendations,watch/providers";

export const getMovie = (id: number) =>
  tmdb<MovieDetails>(`/movie/${id}`, { append_to_response: APPEND }, { revalidate: TTL.details });

export const getTv = (id: number) =>
  tmdb<TvDetails>(`/tv/${id}`, { append_to_response: APPEND }, { revalidate: TTL.details });

export const searchMulti = (query: string, page = 1) =>
  tmdb<Paged<MultiResult>>(`/search/multi`, { query, page, include_adult: false }, { revalidate: TTL.search });

export interface DiscoverFilters {
  with_genres?: string; // "878" or "878,12"
  sort_by?: string; // "popularity.desc" | "vote_average.desc" | ...
  "vote_average.gte"?: number;
  "vote_count.gte"?: number;
  year?: number; // movie: primary_release_year, tv: first_air_date_year
  with_original_language?: string;
  page?: number;
}

export function discover(type: MediaType, f: DiscoverFilters = {}) {
  const { year, ...rest } = f;
  const params: Params = {
    include_adult: false,
    watch_region: "US",
    sort_by: "popularity.desc",
    ...rest,
    ...(year ? (type === "movie" ? { primary_release_year: year } : { first_air_date_year: year }) : {}),
  };
  return tmdb<Paged<MediaSummary>>(`/discover/${type}`, params).then((p) => ({
    ...p,
    results: p.results.map((r) => ({ ...r, media_type: type }) as MediaSummary),
  }));
}

export const getGenres = (type: MediaType) =>
  tmdb<{ genres: Genre[] }>(`/genre/${type}/list`, {}, { revalidate: TTL.genres }).then((r) => r.genres);

/** Tag results that come from type-specific endpoints so cards link correctly. */
export const withType = <T extends MediaSummary>(type: MediaType, page: Paged<T>): Paged<MediaSummary> => ({
  ...page,
  results: page.results.map((r) => ({ ...r, media_type: type }) as MediaSummary),
});
