import { Suspense } from "react";
import { HeroBanner } from "@/components/HeroBanner";
import { MediaRow } from "@/components/MediaRow";
import { RowSkeleton } from "@/components/Skeletons";
import { AdSlot } from "@/components/ads/AdSlot";
import {
  EMPTY_PAGE,
  discover,
  getNowPlaying,
  getOnTheAir,
  getPopular,
  getTopRated,
  getTrending,
  safe,
  withType,
} from "@/lib/tmdb";
import type { MediaSummary, Paged } from "@/lib/types";

// ISR: the HTML is regenerated at most hourly, served stale-while-revalidate.
export const revalidate = 3600;

/** Each row is its own async server component → streamed independently. */
async function Row({ title, load, href }: { title: string; load: () => Promise<Paged<MediaSummary>>; href?: string }) {
  const data = await safe(load(), EMPTY_PAGE);
  return <MediaRow title={title} items={data.results} href={href} />;
}

export default async function HomePage() {
  const trending = await safe(getTrending("day"), EMPTY_PAGE);
  const hero = trending.results.find((r) => r.backdrop_path) ?? trending.results[0];

  return (
    <>
      {hero ? <HeroBanner item={hero} /> : <div className="h-24" />}

      <div className="relative z-10 -mt-12 space-y-6 md:-mt-24">
        <MediaRow title="Trending Today" items={trending.results.slice(1)} />

        <Suspense fallback={<RowSkeleton />}>
          <Row title="Trending This Week" load={() => getTrending("week")} />
        </Suspense>
        <Suspense fallback={<RowSkeleton />}>
          <Row title="Popular Movies" href="/movies" load={async () => withType("movie", await getPopular("movie"))} />
        </Suspense>

        {/* Native banner #1 — between rows, never above the fold */}
        <AdSlot responsive className="container py-2" />

        <Suspense fallback={<RowSkeleton />}>
          <Row title="Popular TV Shows" href="/tv-shows" load={async () => withType("tv", await getPopular("tv"))} />
        </Suspense>
        <Suspense fallback={<RowSkeleton />}>
          <Row title="Top Rated Movies" load={async () => withType("movie", await getTopRated("movie"))} />
        </Suspense>
        <Suspense fallback={<RowSkeleton />}>
          <Row title="New in Theaters" load={async () => withType("movie", await getNowPlaying())} />
        </Suspense>

        <AdSlot responsive className="container py-2" />

        <Suspense fallback={<RowSkeleton />}>
          <Row title="New Episodes This Week" load={async () => withType("tv", await getOnTheAir())} />
        </Suspense>
        <Suspense fallback={<RowSkeleton />}>
          <Row title="Top Rated TV Shows" load={async () => withType("tv", await getTopRated("tv"))} />
        </Suspense>
        <Suspense fallback={<RowSkeleton />}>
          <Row
            title="Sci-Fi Hits"
            href="/collection/best-sci-fi-fantasy-tv-shows"
            load={() => discover("movie", { with_genres: "878", "vote_count.gte": 500 })}
          />
        </Suspense>
      </div>
    </>
  );
}
