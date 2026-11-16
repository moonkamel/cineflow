import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { WatchView } from "@/components/WatchView";
import { loadMovie } from "@/lib/data";
import { img } from "@/lib/tmdb";
import { titlePath, watchPath } from "@/lib/routes";
import { pageMetadata, movieJsonLd } from "@/lib/seo";
import type { MediaSummary } from "@/lib/types";
import { parseIdParam, truncate, yearOf } from "@/lib/utils";

export const revalidate = 86400;
export const generateStaticParams = async () => [];

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = parseIdParam((await params).id);
  if (!id) return {};
  const m = await loadMovie(id);
  const year = yearOf(m.release_date);
  return pageMetadata({
    title: `Watch ${m.title}${year ? ` (${year})` : ""} Online Free – Full Movie HD`,
    description: truncate(
      `Watch ${m.title} online in HD. Stream the full movie now and see where to watch in the US. ${m.overview}`,
      158,
    ),
    path: watchPath("movie", m.id, m.title),
    image: img(m.backdrop_path, "w1280"),
    type: "video.movie",
  });
}

export default async function WatchMoviePage({ params }: Props) {
  const raw = (await params).id;
  const id = parseIdParam(raw);
  if (!id) notFound();
  const m = await loadMovie(id);
  const canonical = watchPath("movie", m.id, m.title);
  if (`/watch/movie/${raw}` !== canonical) permanentRedirect(canonical);

  const ld = movieJsonLd(m);
  const related = (m.recommendations?.results ?? m.similar?.results ?? []).map(
    (r) => ({ ...r, media_type: "movie" }) as MediaSummary,
  );

  return (
    <>
      {ld.trailer && (
        <JsonLd data={{ "@context": "https://schema.org", ...ld.trailer }} />
      )}
      <WatchView
        title={m.title}
        year={yearOf(m.release_date)}
        overview={m.overview}
        backdrop={m.backdrop_path}
        detailsHref={titlePath("movie", m.id, m.title)}
        videos={m.videos}
        videoMeta={{ tmdbId: m.id, type: "movie" }}
        providers={m["watch/providers"]?.results.US}
        related={related}
      />
    </>
  );
}
