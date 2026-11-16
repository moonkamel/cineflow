import Link from "next/link";
import { Suspense } from "react";
import { discover, EMPTY_PAGE, getGenres, safe } from "@/lib/tmdb";
import type { MediaType } from "@/lib/types";
import { DiscoverFilters } from "./DiscoverFilters";
import { MediaGrid } from "./MediaGrid";
import { AdSlot } from "./ads/AdSlot";

export type BrowseSearchParams = { genre?: string; year?: string; rating?: string; sort?: string; page?: string };

const ALLOWED_SORTS = new Set(["popularity.desc", "vote_average.desc", "primary_release_date.desc", "first_air_date.desc"]);

export async function BrowsePage({ type, heading, intro, sp }: { type: MediaType; heading: string; intro: string; sp: BrowseSearchParams }) {
  const page = Math.min(Math.max(Number(sp.page) || 1, 1), 500);
  const rating = Number(sp.rating) || undefined;
  const sort = sp.sort && ALLOWED_SORTS.has(sp.sort) ? sp.sort : "popularity.desc";

  const [genres, data] = await Promise.all([
    safe(getGenres(type), []),
    safe(
      discover(type, {
        with_genres: sp.genre && /^\d+$/.test(sp.genre) ? sp.genre : undefined,
        year: Number(sp.year) || undefined,
        "vote_average.gte": rating,
        // Avoid obscure titles with 3 votes topping "highest rated"
        "vote_count.gte": sort === "vote_average.desc" || rating ? 200 : undefined,
        sort_by: sort,
        page,
      }),
      EMPTY_PAGE,
    ),
  ]);

  const base = type === "movie" ? "/movies" : "/tv-shows";
  const qs = (p: number) => {
    const n = new URLSearchParams(Object.entries(sp).filter(([k, v]) => v && k !== "page") as [string, string][]);
    if (p > 1) n.set("page", String(p));
    return `${base}${n.size ? `?${n}` : ""}`;
  };

  return (
    <div className="container pt-24 md:pt-28">
      <h1 className="text-3xl font-black md:text-5xl">{heading}</h1>
      <p className="mt-3 max-w-2xl text-white/80">{intro}</p>
      <div className="mt-6">
        <Suspense>
          <DiscoverFilters genres={genres} isTv={type === "tv"} />
        </Suspense>
      </div>
      <div className="mt-6">
        {data.results.length ? <MediaGrid items={data.results} /> : <p className="text-muted-foreground">No titles match these filters.</p>}
      </div>
      <AdSlot responsive className="my-8" />
      <nav aria-label="Pagination" className="flex justify-center gap-3">
        {page > 1 && (
          <Link href={qs(page - 1)} className="rounded-md border border-border px-4 py-2 text-sm hover:bg-accent">
            ← Previous
          </Link>
        )}
        {page < Math.min(data.total_pages, 500) && (
          <Link href={qs(page + 1)} className="rounded-md border border-border px-4 py-2 text-sm hover:bg-accent">
            Next →
          </Link>
        )}
      </nav>
    </div>
  );
}
