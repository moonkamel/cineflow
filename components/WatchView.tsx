import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { img } from "@/lib/tmdb";
import { pathFor } from "@/lib/routes";
import { resolveVideo } from "@/lib/video";
import { titleOf, type MediaSummary, type Video, type WatchProviderRegion } from "@/lib/types";
import { yearOf } from "@/lib/utils";
import { VideoPlayer } from "./VideoPlayer";
import { WhereToWatch } from "./WhereToWatch";
import { AdSlot } from "./ads/AdSlot";

interface Props {
  title: string;
  year?: string | null;
  overview: string;
  backdrop: string | null;
  detailsHref: string;
  videos?: { results: Video[] };
  providers?: WatchProviderRegion;
  related: MediaSummary[];
}

/**
 * Watch page layout.
 *  - Player first, full width on mobile, ~70% on desktop. NO ads above it.
 *  - Ads only below the player and in the recommendations sidebar.
 */
export function WatchView({ title, year, overview, backdrop, detailsHref, videos, providers, related }: Props) {
  const video = resolveVideo(videos);

  return (
    <div className="container pt-20 md:pt-24">
      <Link href={detailsHref} className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to {title}
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-6">
          <VideoPlayer
            embedUrl={video.embedUrl}
            externalUrl={video.externalUrl}
            poster={img(backdrop, "w1280")}
            title={title}
          />
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">
              {title} {year && <span className="font-normal text-muted-foreground">({year})</span>} – Official {video.label}
            </h1>
            <p className="mt-3 max-w-3xl text-white/80">{overview}</p>
          </div>

          {/* Below-the-player placement: visible, but never blocks the video */}
          <AdSlot responsive />

          <WhereToWatch region={providers} title={title} />
        </div>

        <aside className="space-y-4" aria-label="Recommended">
          <h2 className="text-lg font-bold">Up Next</h2>
          <ul className="space-y-3">
            {related.slice(0, 4).map((r) => (
              <RelatedItem key={r.id} item={r} />
            ))}
          </ul>
          <AdSlot format="300x250" />
          <ul className="space-y-3">
            {related.slice(4, 12).map((r) => (
              <RelatedItem key={r.id} item={r} />
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}

function RelatedItem({ item }: { item: MediaSummary }) {
  const t = titleOf(item);
  const src = img(item.backdrop_path, "w342") ?? img(item.poster_path, "w342");
  return (
    <li>
      <Link href={pathFor(item)} className="group flex gap-3 rounded-md p-1 hover:bg-white/5">
        <div className="relative aspect-video w-36 shrink-0 overflow-hidden rounded bg-card">
          {src && <Image src={src} alt="" fill sizes="144px" className="object-cover transition-transform group-hover:scale-105" />}
        </div>
        <div className="min-w-0">
          <p className="line-clamp-2 text-sm font-semibold">{t}</p>
          <p className="text-xs text-muted-foreground">
            {yearOf("title" in item ? item.release_date : item.first_air_date)} · ★ {item.vote_average.toFixed(1)}
          </p>
        </div>
      </Link>
    </li>
  );
}
