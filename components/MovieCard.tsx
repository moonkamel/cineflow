import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { img } from "@/lib/tmdb";
import { pathFor } from "@/lib/routes";
import { dateOf, titleOf, type MediaSummary } from "@/lib/types";
import { cn, yearOf } from "@/lib/utils";

interface Props {
  item: MediaSummary;
  className?: string;
  /** Pass true for above-the-fold cards only. */
  priority?: boolean;
  sizes?: string;
}

/**
 * Poster card. Pure server component with CSS-only hover (no JS per card):
 * dozens of cards per page would otherwise each hydrate a motion component
 * and hurt INP on low-end phones.
 */
export function MovieCard({ item, className, priority, sizes = "(max-width: 640px) 40vw, (max-width: 1024px) 22vw, 15vw" }: Props) {
  const title = titleOf(item);
  const year = yearOf(dateOf(item));
  const poster = img(item.poster_path, "w342");

  return (
    <Link
      href={pathFor(item)}
      className={cn(
        "group relative block aspect-[2/3] overflow-hidden rounded-md bg-card outline-none",
        "transition-transform duration-300 ease-out hover:z-10 hover:scale-[1.04] focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      aria-label={`${title}${year ? ` (${year})` : ""}`}
    >
      {poster ? (
        <Image
          src={poster}
          alt={`${title} poster`}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div className="flex h-full items-center justify-center p-3 text-center text-sm text-muted-foreground">{title}</div>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
        <p className="line-clamp-2 text-sm font-semibold leading-tight">{title}</p>
        <p className="mt-1 flex items-center gap-2 text-xs text-white/70">
          {year && <span>{year}</span>}
          {item.vote_count > 0 && (
            <span className="inline-flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" aria-hidden />
              {item.vote_average.toFixed(1)}
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}
