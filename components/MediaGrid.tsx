import type { MediaSummary } from "@/lib/types";
import { MovieCard } from "./MovieCard";

export function MediaGrid({ items, priorityCount = 6 }: { items: MediaSummary[]; priorityCount?: number }) {
  return (
    <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:gap-3 lg:grid-cols-6">
      {items.map((m, i) => (
        <li key={`${m.media_type}-${m.id}`}>
          <MovieCard item={m} priority={i < priorityCount} sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 16vw" />
        </li>
      ))}
    </ul>
  );
}
