// components/WatchView.tsx
import { resolveVideo, type VideoMeta } from "@/lib/video";
import { VideoPlayer } from "@/components/VideoPlayer";
import { MediaRow } from "@/components/MediaRow";
import { WhereToWatch } from "@/components/WhereToWatch";
import { AdSlot } from "@/components/ads/AdSlot";
import Link from "next/link";
import type { MediaSummary, Video, WatchProviderRegion } from "@/lib/types";

type Props = {
  title: string;
  year?: string | null;
  overview?: string;
  backdrop?: string | null;
  detailsHref: string;
  videos?: { results: Video[] };
  videoMeta?: VideoMeta;          // 👈 ajout
  providers?: WatchProviderRegion;
  related?: MediaSummary[];
};

export function WatchView({
  title,
  year,
  overview,
  backdrop,
  detailsHref,
  videos,
  videoMeta,
  providers,
  related,
}: Props) {
  const video = resolveVideo(videos, videoMeta); // 👈 VidSrc activé si videoMeta est fourni

  return (
    <div className="container py-6">
      <div className="mx-auto max-w-6xl">
        <VideoPlayer
          embedUrl={video.embedUrl}
          externalUrl={video.externalUrl}
          title={title}
        />
      </div>

      <div className="mx-auto mt-8 grid max-w-6xl gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <h1 className="text-2xl font-bold">
            {title}
            {year && <span className="ml-2 text-neutral-400">({year})</span>}
          </h1>
          {overview && <p className="mt-3 text-neutral-300">{overview}</p>}
          <Link
            href={detailsHref}
            className="mt-4 inline-block text-sm text-red-500 hover:underline"
          >
            ← See full details
          </Link>
          <div className="mt-6">
            <AdSlot format="300x250" />
          </div>
        </div>
        <aside>
          <AdSlot format="300x250" />
        </aside>
      </div>

      {providers && (
        <div className="mx-auto mt-10 max-w-6xl">
          <WhereToWatch region={providers} title={title} />
        </div>
      )}

      {related && related.length > 0 && (
        <MediaRow title={`More like ${title}`} items={related} />
      )}
    </div>
  );
}
