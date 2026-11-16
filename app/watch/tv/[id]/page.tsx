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

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = parseIdParam((await params).id);
  if (!id) return {};
  const s = await loadTv(id);
  return pageMetadata({
    title: `${s.name} Official Trailer – Stream All Episodes`,
    description: truncate(`Watch the official ${s.name} trailer and find where to stream every season in the US. ${s.overview}`, 158),
    path: watchPath("tv", s.id, s.name),
    image: img(s.backdrop_path, "w1280"),
    type: "video.tv_show",
  });
}

export default async function WatchTvPage({ params }: Props) {
  const raw = (await params).id;
  const id = parseIdParam(raw);
  if (!id) notFound();
  const s = await loadTv(id);
  const canonical = watchPath("tv", s.id, s.name);
  if (`/watch/tv/${raw}` !== canonical) permanentRedirect(canonical);

  const ld = tvJsonLd(s);
  const related = (s.recommendations?.results ?? s.similar?.results ?? []).map((r) => ({ ...r, media_type: "tv" }) as MediaSummary);

  return (
    <>
      {ld.trailer && <JsonLd data={{ "@context": "https://schema.org", ...ld.trailer }} />}
      <WatchView
        title={s.name}
        year={yearOf(s.first_air_date)}
        overview={s.overview}
        backdrop={s.backdrop_path}
        detailsHref={titlePath("tv", s.id, s.name)}
        videos={s.videos}
        providers={s["watch/providers"]?.results.US}
        related={related}
      />
    </>
  );
}
