"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import type { Genre } from "@/lib/types";
import { cn } from "@/lib/utils";

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 40 }, (_, i) => CURRENT_YEAR - i);
const SORTS = [
  { v: "popularity.desc", l: "Most popular" },
  { v: "vote_average.desc", l: "Highest rated" },
  { v: "primary_release_date.desc", l: "Newest" },
];
const RATINGS = [0, 6, 7, 8];

/**
 * URL-driven filters. `useTransition` keeps the selects responsive while the
 * server renders the new grid (good INP), and the old grid dims meanwhile.
 */
export function DiscoverFilters({ genres, isTv }: { genres: Genre[]; isTv: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, start] = useTransition();

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    start(() => router.push(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false }));
  };

  const select = "h-10 rounded-md border border-border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring";
  const sorts = SORTS.map((s) => (isTv && s.v.startsWith("primary_release_date") ? { ...s, v: "first_air_date.desc" } : s));

  return (
    <div className={cn("flex flex-wrap gap-2 transition-opacity", pending && "opacity-60")} aria-busy={pending}>
      <select aria-label="Genre" className={select} value={params.get("genre") ?? ""} onChange={(e) => update("genre", e.target.value)}>
        <option value="">All genres</option>
        {genres.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </select>
      <select aria-label="Year" className={select} value={params.get("year") ?? ""} onChange={(e) => update("year", e.target.value)}>
        <option value="">Any year</option>
        {YEARS.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
      <select aria-label="Minimum rating" className={select} value={params.get("rating") ?? ""} onChange={(e) => update("rating", e.target.value)}>
        {RATINGS.map((r) => (
          <option key={r} value={r || ""}>
            {r ? `${r}+ stars` : "Any rating"}
          </option>
        ))}
      </select>
      <select aria-label="Sort by" className={select} value={params.get("sort") ?? "popularity.desc"} onChange={(e) => update("sort", e.target.value)}>
        {sorts.map((s) => (
          <option key={s.v} value={s.v}>
            {s.l}
          </option>
        ))}
      </select>
    </div>
  );
}
