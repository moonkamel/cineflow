import type { Metadata } from "next";
import Link from "next/link";
import { CollectionCards } from "@/components/CollectionCards";
import { JsonLd } from "@/components/JsonLd";
import { MediaGrid } from "@/components/MediaGrid";
import { AdSlot } from "@/components/ads/AdSlot";
import { COLLECTIONS } from "@/lib/collections";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { discover, EMPTY_PAGE, safe } from "@/lib/tmdb";

// Targets: "free movies" 550k, "free movies online" 165k, "free movie streaming sites" 22k (US / month)
export const revalidate = 21600;

export const metadata: Metadata = pageMetadata({
  title: "Free Movies Online: Watch Full Movies Free & Legally in the US",
  description:
    "Hundreds of full movies you can watch free and legally in the US right now — streaming on Tubi, Pluto TV, The Roku Channel and more. Updated daily.",
  path: "/free-movies",
});

export default async function FreeMoviesPage() {
  const [p1, p2] = await Promise.all(
    [1, 2].map((page) =>
      safe(discover("movie", { with_watch_monetization_types: "free|ads", sort_by: "popularity.desc", "vote_count.gte": 100, page }), EMPTY_PAGE),
    ),
  );
  const items = [...p1.results, ...p2.results].filter((m) => m.poster_path);
  const freeLists = COLLECTIONS.filter((c) => c.section === "free" || c.slug.startsWith("free-"));

  return (
    <div className="container pt-24 md:pt-28">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Free Movies", path: "/free-movies" }])} />
      <header className="max-w-3xl">
        <h1 className="text-3xl font-black tracking-tight md:text-5xl">Free Movies Online</h1>
        <p className="mt-4 leading-relaxed text-white/80">
          Every movie on this page is available to watch for free, in full and legally, in the United States. They stream on
          ad-supported services such as Tubi, Pluto TV, The Roku Channel and Plex — no subscription, no credit card, and no
          pop-up-riddled mirror sites.
        </p>
        <p className="mt-3 leading-relaxed text-white/80">
          Availability comes from live streaming data and refreshes daily. Open any title to see which free service carries it.
          Looking for the services themselves? Read our guide to the{" "}
          <Link href="/free-streaming-sites" className="underline">
            best free streaming sites
          </Link>
          .
        </p>
      </header>

      <section className="mt-10" aria-labelledby="free-lists">
        <h2 id="free-lists" className="mb-4 text-xl font-bold">
          Free movies by genre
        </h2>
        <CollectionCards items={freeLists} />
      </section>

      <section className="mt-12" aria-labelledby="free-now">
        <h2 id="free-now" className="mb-4 text-xl font-bold">
          Popular free movies right now
        </h2>
        {items.length ? <MediaGrid items={items.slice(0, 18)} priorityCount={0} /> : <p className="text-muted-foreground">This list is updating — check back shortly.</p>}
        {items.length > 18 && (
          <>
            <AdSlot responsive className="my-8" />
            <MediaGrid items={items.slice(18)} priorityCount={0} />
          </>
        )}
      </section>
    </div>
  );
}
