import type { MediaSummary } from "@/lib/types";
import { MovieCard } from "./MovieCard";
import { RowCarousel, RowItem } from "./RowCarousel";

/** Server component: fetch-free row renderer. */
export function MediaRow({ title, items, href }: { title: string; items: MediaSummary[]; href?: string }) {
  if (!items.length) return null;
  return (
    <RowCarousel title={title} href={href}>
      {items.map((m) => (
        <RowItem key={`${m.media_type}-${m.id}`}>
          <MovieCard item={m} />
        </RowItem>
      ))}
    </RowCarousel>
  );
}
