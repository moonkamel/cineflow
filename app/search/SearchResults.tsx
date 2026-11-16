"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MovieCard } from "@/components/MovieCard";
import { SearchBar } from "@/components/SearchBar";
import { GridSkeleton } from "@/components/Skeletons";
import { useDebounce } from "@/lib/hooks/useDebounce";
import type { MediaSummary } from "@/lib/types";

interface SearchResponse {
  results: MediaSummary[];
  total_pages: number;
}

async function fetchSearch(q: string, signal: AbortSignal): Promise<SearchResponse> {
  const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal });
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

export function SearchResults({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [q, setQ] = useState(initialQuery);
  const debounced = useDebounce(q.trim(), 300);

  // Keep the URL shareable without adding history entries on every keystroke.
  useEffect(() => {
    const url = debounced ? `/search?q=${encodeURIComponent(debounced)}` : "/search";
    router.replace(url, { scroll: false });
  }, [debounced, router]);

  const { data, isFetching, isError } = useQuery({
    queryKey: ["search", debounced],
    queryFn: ({ signal }) => fetchSearch(debounced, signal), // aborts stale requests
    enabled: debounced.length >= 2,
    placeholderData: keepPreviousData, // no flash of empty grid while typing
  });

  const results = debounced.length >= 2 ? (data?.results ?? []) : [];

  return (
    <div>
      <SearchBar value={q} onChange={setQ} autoFocus className="mx-auto max-w-2xl" />

      <div className="mt-8" aria-live="polite" aria-busy={isFetching}>
        {debounced.length < 2 ? (
          <p className="text-center text-muted-foreground">Start typing to search thousands of movies and TV shows.</p>
        ) : isError ? (
          <p className="text-center text-muted-foreground">Search is temporarily unavailable. Please try again.</p>
        ) : !data ? (
          <GridSkeleton />
        ) : results.length === 0 ? (
          <p className="text-center text-muted-foreground">No results for &ldquo;{debounced}&rdquo;.</p>
        ) : (
          <ul className={`grid grid-cols-3 gap-2 transition-opacity sm:grid-cols-4 md:gap-3 lg:grid-cols-6 ${isFetching ? "opacity-60" : ""}`}>
            {results.map((m, i) => (
              <motion.li
                key={`${m.media_type}-${m.id}`}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(i * 0.02, 0.3) }}
              >
                <MovieCard item={m} sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 16vw" />
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
