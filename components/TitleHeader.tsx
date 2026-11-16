import Image from "next/image";
import Link from "next/link";
import { Play, Star } from "lucide-react";
import { img } from "@/lib/tmdb";
import type { Genre } from "@/lib/types";
import { buttonClass } from "./ui/button";

interface Props {
  title: string;
  tagline?: string;
  overview: string;
  backdrop: string | null;
  poster: string | null;
  facts: (string | null | undefined)[];
  rating: number;
  votes: number;
  genres: Genre[];
  watchHref: string;
  credits?: { label: string; names: string[] }[];
}

/** Shared header for movie & TV detail pages. Fully server-rendered (SEO). */
export function TitleHeader({ title, tagline, overview, backdrop, poster, facts, rating, votes, genres, watchHref, credits = [] }: Props) {
  const bg = img(backdrop, "w1280");
  const p = img(poster, "w500");
  return (
    <section className="relative">
      <div className="absolute inset-0 h-[60vh] overflow-hidden md:h-[75vh]">
        {bg && <Image src={bg} alt="" fill priority fetchPriority="high" sizes="100vw" className="object-cover object-top opacity-60" />}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/10" />
      </div>

      <div className="container relative grid gap-6 pt-32 md:grid-cols-[260px_1fr] md:gap-10 md:pt-48">
        {p && (
          <div className="relative mx-auto hidden aspect-[2/3] w-[260px] overflow-hidden rounded-lg shadow-2xl md:block">
            <Image src={p} alt={`${title} poster`} fill sizes="260px" className="object-cover" />
          </div>
        )}
        <div className="max-w-3xl">
          <h1 className="text-3xl font-black tracking-tight md:text-5xl">{title}</h1>
          {tagline && <p className="mt-2 italic text-white/70">{tagline}</p>}

          <ul className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/80">
            {votes > 0 && (
              <li className="inline-flex items-center gap-1 font-semibold text-white">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden />
                {rating.toFixed(1)}
                <span className="font-normal text-white/60">({votes.toLocaleString("en-US")})</span>
              </li>
            )}
            {facts.filter(Boolean).map((f) => (
              <li key={f} className="before:mr-3 before:content-['•'] first:before:hidden">
                {f}
              </li>
            ))}
          </ul>

          <ul className="mt-3 flex flex-wrap gap-2">
            {genres.map((g) => (
              <li key={g.id} className="rounded-full border border-white/20 px-3 py-0.5 text-xs">
                {g.name}
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <Link href={watchHref} className={buttonClass("default", "lg", "w-full sm:w-auto")}>
              <Play className="fill-current" /> Play Trailer
            </Link>
          </div>

          <h2 className="sr-only">Overview</h2>
          <p className="mt-6 leading-relaxed text-white/90">{overview || "No overview available yet."}</p>

          {credits.filter((c) => c.names.length).length > 0 && (
            <dl className="mt-6 grid gap-2 text-sm sm:grid-cols-2">
              {credits
                .filter((c) => c.names.length)
                .map((c) => (
                  <div key={c.label}>
                    <dt className="text-muted-foreground">{c.label}</dt>
                    <dd className="font-medium">{c.names.join(", ")}</dd>
                  </div>
                ))}
            </dl>
          )}
        </div>
      </div>
    </section>
  );
}
