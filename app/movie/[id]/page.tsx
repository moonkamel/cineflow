import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { CastList } from "@/components/CastList";
import { JsonLd } from "@/components/JsonLd";
import { MediaRow } from "@/components/MediaRow";
import { TitleHeader } from "@/components/TitleHeader";
import { WhereToWatch } from "@/components/WhereToWatch";
import { AdSlot } from "@/components/ads/AdSlot";
import { loadMovie } from "@/lib/data";
import { titlePath, watchPath } from "@/lib/routes";
import { breadcrumbJsonLd, movieJsonLd, movieMetadata } from "@/lib/seo";
import { formatRuntime, parseIdParam, yearOf } from "@/lib/utils";
import type { MediaSummary } from "@/lib/types";

// Title pages are generated on first request, then cached (ISR, 24h).
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

  // One canonical URL per title: /movie/123 or /movie/123-old-slug → 308
  const canonical = titlePath("movie", m.id, m.title);
  if (`/movie/${raw}` !== canonical) permanentRedirect(canonical);

  const crew = m.credits?.crew ?? [];
  const pick = (job: string) => [...new Set(crew.filter((c) => c.job === job).map((c) => c.name))].slice(0, 3);
  const similar = (m.recommendations?.results.length ? m.recommendations.results : (m.similar?.results ?? []))
    .map((r) => ({ ...r, media_type: "movie" }) as MediaSummary);

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
        watchHref={watchPath("movie", m.id, m.title)}
        credits={[
          { label: "Director", names: pick("Director") },
          { label: "Writers", names: [...pick("Screenplay"), ...pick("Writer")].slice(0, 3) },
        ]}
      />

      <div className="container mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-10">
          <CastList cast={m.credits?.cast ?? []} />
          <WhereToWatch region={m["watch/providers"]?.results.US} title={m.title} />
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
