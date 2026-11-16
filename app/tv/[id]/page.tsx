import type { Metadata } from "next";
import Image from "next/image";
import { notFound, permanentRedirect } from "next/navigation";
import { CastList } from "@/components/CastList";
import { JsonLd } from "@/components/JsonLd";
import { MediaRow } from "@/components/MediaRow";
import { TitleHeader } from "@/components/TitleHeader";
import { WhereToWatch } from "@/components/WhereToWatch";
import { AdSlot } from "@/components/ads/AdSlot";
import { loadTv } from "@/lib/data";
import { img } from "@/lib/tmdb";
import { titlePath, watchPath } from "@/lib/routes";
import { breadcrumbJsonLd, tvJsonLd, tvMetadata } from "@/lib/seo";
import { formatRuntime, parseIdParam, yearOf } from "@/lib/utils";
import type { MediaSummary } from "@/lib/types";

export const revalidate = 86400;
export const dynamicParams = true;
export const generateStaticParams = async () => [];

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = parseIdParam((await params).id);
  if (!id) return {};
  return tvMetadata(await loadTv(id));
}

export default async function TvPage({ params }: Props) {
  const raw = (await params).id;
  const id = parseIdParam(raw);
  if (!id) notFound();
  const s = await loadTv(id);

  const canonical = titlePath("tv", s.id, s.name);
  if (`/tv/${raw}` !== canonical) permanentRedirect(canonical);

  const startYear = yearOf(s.first_air_date);
  const endYear = s.status === "Ended" ? yearOf(s.last_air_date) : null;
  const seasons = s.seasons.filter((x) => x.season_number > 0);
  const similar = (s.recommendations?.results.length ? s.recommendations.results : (s.similar?.results ?? []))
    .map((r) => ({ ...r, media_type: "tv" }) as MediaSummary);

  return (
    <article>
      <JsonLd data={tvJsonLd(s)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "TV Shows", path: "/tv-shows" },
          { name: s.name, path: canonical },
        ])}
      />

      <TitleHeader
        title={s.name}
        tagline={s.tagline}
        overview={s.overview}
        backdrop={s.backdrop_path}
        poster={s.poster_path}
        rating={s.vote_average}
        votes={s.vote_count}
        genres={s.genres}
        facts={[
          startYear && (endYear && endYear !== startYear ? `${startYear}–${endYear}` : startYear),
          `${s.number_of_seasons} Season${s.number_of_seasons === 1 ? "" : "s"}`,
          `${s.number_of_episodes} Episodes`,
          formatRuntime(s.episode_run_time[0]),
        ]}
        watchHref={watchPath("tv", s.id, s.name)}
        credits={[{ label: "Created by", names: s.created_by.map((c) => c.name) }]}
      />

      <div className="container mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-10">
          {seasons.length > 0 && (
            <section aria-labelledby="seasons-heading">
              <h2 id="seasons-heading" className="mb-4 text-xl font-bold">
                Seasons
              </h2>
              <ul className="no-scrollbar flex snap-x gap-3 overflow-x-auto pb-2">
                {seasons.map((x) => {
                  const p = img(x.poster_path, "w185");
                  return (
                    <li key={x.id} className="w-32 shrink-0 snap-start">
                      <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-card">
                        {p && <Image src={p} alt={`${s.name} ${x.name} poster`} fill sizes="128px" className="object-cover" />}
                      </div>
                      <p className="mt-2 text-sm font-medium">{x.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {x.episode_count} episodes{x.air_date ? ` · ${yearOf(x.air_date)}` : ""}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
          <CastList cast={s.credits?.cast ?? []} />
          <WhereToWatch region={s["watch/providers"]?.results.US} title={s.name} />
        </div>
        <aside className="space-y-6">
          <AdSlot format="300x250" />
        </aside>
      </div>

      <div className="mt-12">
        <MediaRow title={`Shows Like ${s.name}`} items={similar} />
      </div>
    </article>
  );
}
