import type { MetadataRoute } from "next";
import { COLLECTIONS } from "@/lib/collections";
import { absoluteUrl } from "@/lib/site";
import { titlePath } from "@/lib/routes";
import { getPopular, getTopRated, getTrending, safe, EMPTY_PAGE } from "@/lib/tmdb";
import { mediaTypeOf, titleOf, type MediaSummary, type MediaType } from "@/lib/types";

// Rebuilt once a day (ISR). Served at /sitemap.xml.
export const revalidate = 86400;

/** Pages of each TMDB list to include (20 titles/page). Raise as the site's crawl budget grows. */
const PAGES = 10;

async function collect(): Promise<MediaSummary[]> {
  const pages = Array.from({ length: PAGES }, (_, i) => i + 1);
  const typed = (type: MediaType, p: Promise<{ results: MediaSummary[] }>) =>
    safe(p, EMPTY_PAGE).then((r) => r.results.map((m) => ({ ...m, media_type: type }) as MediaSummary));

  const batches = await Promise.all([
    ...[1, 2, 3].map((p) => safe(getTrending("week", p), EMPTY_PAGE).then((r) => r.results)),
    ...pages.flatMap((p) => [
      typed("movie", getPopular("movie", p)),
      typed("tv", getPopular("tv", p)),
      typed("movie", getTopRated("movie", p)),
      typed("tv", getTopRated("tv", p)),
    ]),
  ]);

  const seen = new Set<string>();
  return batches.flat().filter((m) => {
    const k = `${mediaTypeOf(m)}-${m.id}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "hourly", priority: 1 },
    { url: absoluteUrl("/movies"), lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: absoluteUrl("/tv-shows"), lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: absoluteUrl("/collections"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/free-movies"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/free-streaming-sites"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  const collections: MetadataRoute.Sitemap = COLLECTIONS.map((c) => ({
    url: absoluteUrl(`/collection/${c.slug}`),
    lastModified: now,
    changeFrequency: c.section === "genre" ? "weekly" : "daily",
    priority: c.section === "seasonal" || c.section === "free" ? 0.9 : 0.8,
  }));

  const titles: MetadataRoute.Sitemap = (await collect()).map((m) => {
    const type = mediaTypeOf(m);
    // Popular/high-vote titles get a higher priority; recent ones change more often.
    const priority = m.popularity > 100 ? 0.9 : m.vote_count > 1000 ? 0.7 : 0.6;
    return {
      url: absoluteUrl(titlePath(type, m.id, titleOf(m))),
      lastModified: now,
      changeFrequency: m.popularity > 100 ? "daily" : "weekly",
      priority,
    };
  });

  return [...staticPages, ...collections, ...titles];
}
