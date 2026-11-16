import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { Faq } from "@/components/Faq";
import { titleFaq } from "@/lib/faq";
import { CastList } from "@/components/CastList";
import { JsonLd } from "@/components/JsonLd";
import { MediaRow } from "@/components/MediaRow";
import { TitleHeader } from "@/components/TitleHeader";
import { WhereToWatch } from "@/components/WhereToWatch";
import { TVPlayer } from "@/components/TVPlayer"; // 👈 Nouvel import
import { AdSlot } from "@/components/ads/AdSlot";
import { loadTv } from "@/lib/data";
import { img } from "@/lib/tmdb";
import { titlePath } from "@/lib/routes";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { parseIdParam, yearOf, truncate } from "@/lib/utils";
import type { MediaSummary } from "@/lib/types";

export const revalidate = 86400;
export const dynamicParams = true;
export const generateStaticParams = async () => [];

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = parseIdParam((await params).id);
  if (!id) return {};
  const tv = await loadTv(id);
  const year = yearOf(tv.first_air_date);
  return pageMetadata({
    title: `${tv.name}${year ? ` (${year})` : ""} Official Trailer – Watch Now`,
    description: truncate(`Watch the official ${tv.name} trailer in HD and see where to stream the full series in the US. ${tv.overview}`, 158),
    path: titlePath("tv", tv.id, tv.name),
    image: img(tv.backdrop_path, "w1280"),
    type: "video.tv_show",
  });
}

export default async function TvPage({ params }: Props) {
  const raw = (await params).id;
  const id = parseIdParam(raw);
  if (!id) notFound();
  const tv = await loadTv(id);

  const canonical = titlePath("tv", tv.id, tv.name);
  if (`/tv/${raw}` !== canonical) permanentRedirect(canonical);

  const similar = (tv.recommendations?.results.length ? tv.recommendations.results : (tv.similar?.results ?? []))
    .map((r) => ({ ...r, media_type: "tv" }) as MediaSummary);

  return (
    <article>
      <JsonLd data={breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "TV Shows", path: "/tv" },
        { name: tv.name, path: canonical },
      ])} />

      <TitleHeader
        title={tv.name}
        tagline={tv.tagline}
        overview={tv.overview}
        backdrop={tv.backdrop_path}
        poster={tv.poster_path}
        rating={tv.vote_average}
        votes={tv.vote_count}
        genres={tv.genres}
        facts={[yearOf(tv.first_air_date), `${tv.number_of_seasons} Seasons`]}
        watchHref="#player"
        credits={[]}
      />

      {/* 👇 INTÉGRATION DU NOUVEAU COMPOSANT TVPLAYER 👇 */}
      <div id="player" className="container mt-8">
        <div className="mx-auto max-w-5xl">
          <TVPlayer
            tvId={tv.id}
            seasons={tv.seasons || []}
            title={tv.name}
            backdrop={tv.backdrop_path}
          />
        </div>
      </div>

      <div className="container mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-10">
          <CastList cast={tv.credits?.cast ?? []} />
          <WhereToWatch region={tv["watch/providers"]?.results.US} title={tv.name} />
          <Faq items={titleFaq(tv.name, "show", tv["watch/providers"]?.results.US)} />
        </div>
        <aside className="space-y-6">
          <AdSlot format="300x250" />
        </aside>
      </div>

      <div className="mt-12">
        <MediaRow title={`Shows Like ${tv.name}`} items={similar} />
      </div>
    </article>
  );
}
