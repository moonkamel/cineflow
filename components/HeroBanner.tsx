import Image from "next/image";
import Link from "next/link";
import { Info, Play } from "lucide-react";
import { img } from "@/lib/tmdb";
import { pathFor, watchPath } from "@/lib/routes";
import { dateOf, mediaTypeOf, titleOf, type MediaSummary } from "@/lib/types";
import { truncate, yearOf } from "@/lib/utils";
import { buttonClass } from "./ui/button";
import { FadeIn } from "./motion";

/**
 * Hero = the LCP element on the home page. The backdrop is rendered with
 * `priority` + `fetchPriority="high"` so the browser preloads it from the
 * HTML <head>, and the box has a fixed aspect so there is no layout shift.
 */
export function HeroBanner({ item }: { item: MediaSummary }) {
  const title = titleOf(item);
  const type = mediaTypeOf(item);
  const backdrop = img(item.backdrop_path, "w1280");

  return (
    <section className="relative h-[70svh] min-h-[420px] w-full overflow-hidden md:h-[85vh]">
      {backdrop && (
        <Image
          src={backdrop}
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-top"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

      <div className="container relative flex h-full flex-col justify-end pb-16 md:pb-28">
        <FadeIn className="max-w-xl">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Trending {type === "tv" ? "Series" : "Movie"}
          </p>
          <h1 className="text-4xl font-black leading-none tracking-tight drop-shadow md:text-6xl">{title}</h1>
          <p className="mt-2 text-sm text-white/70">
            {yearOf(dateOf(item))} · ★ {item.vote_average.toFixed(1)}
          </p>
          <p className="mt-4 line-clamp-3 text-sm text-white/85 md:text-base">{truncate(item.overview, 220)}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={watchPath(type, item.id, title)} className={buttonClass("white", "lg")}>
              <Play className="fill-current" /> Play Trailer
            </Link>
            <Link href={pathFor(item)} className={buttonClass("secondary", "lg")}>
              <Info /> More Info
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
