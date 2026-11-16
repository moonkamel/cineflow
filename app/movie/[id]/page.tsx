import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { Faq } from "@/components/Faq";
import { titleFaq } from "@/lib/faq";
import { CastList } from "@/components/CastList";
import { JsonLd } from "@/components/JsonLd";
import { MediaRow } from "@/components/MediaRow";
import { TitleHeader } from "@/components/TitleHeader";
import { WhereToWatch } from "@/components/WhereToWatch";
import { VideoPlayer } from "@/components/VideoPlayer";
import { AdSlot } from "@/components/ads/AdSlot";
import { loadMovie } from "@/lib/data";
import { img } from "@/lib/tmdb";
import { titlePath } from "@/lib/routes";
import { breadcrumbJsonLd, movieJsonLd, movieMetadata } from "@/lib/seo";
import { resolveVideo } from "@/lib/video";
import { formatRuntime, parseIdParam, yearOf } from "@/lib/utils";
import type { MediaSummary } from "@/lib/types";

export const revalidate = 86400;
export const dynamicParams = true;
export const generateStaticParams = async () => [];

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = parseIdParam((await params).id);
  if (!id) return {};
  return movieMetadata(await loadMovie(id));
}

export default async function MoviePage({ params }: Props) {
  const raw = (await params).id;
  const id = parseIdParam(raw);
  if (!id) notFound();
  const m = await loadMovie(id);

  const canonical = titlePath("movie", m.id, m.title);
  if (`/movie/${raw}` !== canonical) permanentRedirect(canonical);

  const crew = m.credits?.crew ?? [];
  const pick = (job: string) => [...new Set(crew.filter((c) => c.job === job).map((c) => c.name))].slice(0, 3);
  const similar = (m.recommendations?.results.length ? m.recommendations.results : (m.similar?.results ?? []))
    .map((r) => ({ ...r, media_type: "movie" }) as MediaSummary);

  const video = resolveVideo(m.videos, { tmdbId: m.id, type: "movie" });

  return (
    <article>
      <JsonLd data={movieJsonLd(m)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Movies", path: "/movies" },
          { name: m.title, path: canonical },
        ])}
      />

      <TitleHeader
        title={m.title}
        tagline={m.tagline}
        overview={m.overview}
        backdrop={m.backdrop_path}
        poster={m.poster_path}
        rating={m.vote_average}
        votes={m.vote_count}
        genres={m.genres}
        facts={[yearOf(m.release_date), formatRuntime(m.runtime), m.status !== "Released" ? m.status : null]}
        watchHref="#player" // 👈 Pointe vers l'ancre du lecteur
        credits={[
          { label: "Director", names: pick("Director") },
          { label: "Writers", names: [...pick("Screenplay"), ...pick("Writer")].slice(0, 3) },
        ]}
      />

      {/* 👇 LECTEUR INTÉGRÉ ET CENTRÉ 👇 */}
      <div id="player" className="container mt-8">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-xl bg-black shadow-2xl">
          <VideoPlayer
            embedUrl={video.embedUrl}
            externalUrl={video.externalUrl}
            title={m.title}
            poster={m.backdrop_path ? img(m.backdrop_path, "w1280") : null}
            autoLoad={true}
          />
        </div>
      </div>

      <div className="container mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-10">
          <CastList cast={m.credits?.cast ?? []} />
          <WhereToWatch region={m["watch/providers"]?.results.US} title={m.title} />
          <Faq items={titleFaq(m.title, "movie", m["watch/providers"]?.results.US)} />
        </div>
        <aside className="space-y-6">
          <AdSlot format="300x250" />
        </aside>
      </div>

      <div className="mt-12">
        <MediaRow title={`Movies Like ${m.title}`} items={similar} />
      </div>
    </article>
  );
}
