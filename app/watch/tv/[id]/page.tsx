import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { WatchView } from "@/components/WatchView";
import { loadTv } from "@/lib/data";
import { img } from "@/lib/tmdb";
import { titlePath, watchPath } from "@/lib/routes";
import { pageMetadata, tvJsonLd } from "@/lib/seo";
import type { MediaSummary } from "@/lib/types";
import { parseIdParam, truncate, yearOf } from "@/lib/utils";

export const revalidate = 86400;
export const generateStaticParams = async () => [];

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ s?: string; e?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = parseIdParam((await params).id);
  if (!id) return {};
  const tv = await loadTv(id);
  const year = yearOf(tv.first_air_date);
  return pageMetadata({
    title: `Watch ${tv.name}${year ? ` (${year})` : ""} Online Free – Full Episodes HD`,
    description: truncate(
      `Watch ${tv.name} online in HD. Stream full episodes now and see where to watch in the US. ${tv.overview}`,
      158,
    ),
    path: watchPath("tv", tv.id, tv.name),
    image: img(tv.backdrop_path, "w1280"),
    type: "video.tv_show",
  });
}

export default async function WatchTvPage({ params, searchParams }: Props) {
  const raw = (await params).id;
  const { s, e } = await searchParams;
  const id = parseIdParam(raw);
  if (!id) notFound();

  const tv = await loadTv(id);

  const canonical = watchPath("tv", tv.id, tv.name);
  if (`/watch/tv/${raw}` !== canonical) permanentRedirect(canonical);

  const season = Number(s) || 1;
  const episode = Number(e) || 1;

  const ld = tvJsonLd(tv);
  const related = (tv.recommendations?.results ?? tv.similar?.results ?? []).map(
    (r) => ({ ...r, media_type: "tv" }) as MediaSummary,
  );

  return (
    <>
      {ld?.trailer && (
        <JsonLd data={{ "@context": "https://schema.org", ...ld.trailer }} />
      )}
      <WatchView
        title={tv.name}
        year={yearOf(tv.first_air_date)}
        overview={tv.overview}
        backdrop={tv.backdrop_path}
        detailsHref={titlePath("tv", tv.id, tv.name)}
        videos={tv.videos}
        videoMeta={{ tmdbId: tv.id, type: "tv", season, episode }}
        providers={tv["watch/providers"]?.results.US}
        related={related}
      />
    </>
  );
}
