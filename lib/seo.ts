/**
 * SEO helpers: metadata builders + Schema.org JSON-LD.
 *
 * We use Next's native Metadata API instead of `next-seo`: in the App Router
 * it renders the same <title>/<meta>/OG/Twitter tags server-side, supports
 * streaming, and costs 0 KB of client JS. (`next-seo` targets the Pages Router.)
 */
import type { Metadata } from "next";
import { img } from "./tmdb";
import type { MovieDetails, TvDetails, Video } from "./types";
import { absoluteUrl, SITE_NAME } from "./site";
import { titlePath } from "./routes";
import { truncate, yearOf } from "./utils";

export function pickTrailer(videos?: { results: Video[] }): Video | undefined {
  const yt = (videos?.results ?? []).filter((v) => v.site === "YouTube");
  return (
    yt.find((v) => v.type === "Trailer" && v.official) ??
    yt.find((v) => v.type === "Trailer") ??
    yt.find((v) => v.type === "Teaser") ??
    yt[0]
  );
}

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: "website" | "video.movie" | "video.tv_show";
  noIndex?: boolean;
}

export function pageMetadata({ title, description, path, image, type = "website", noIndex }: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const images = image ? [{ url: image, width: 1280, height: 720, alt: title }] : undefined;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      // Next's typed OG only accepts website/article/etc.; "video.*" is emitted via `other`.
      type: "website",
      images,
    },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : undefined },
    other: type !== "website" ? { "og:type": type } : undefined,
  };
}

/* ---------------- Title pages (high-intent US keywords) ---------------- */

export function movieMetadata(m: MovieDetails): Metadata {
  const year = yearOf(m.release_date);
  const t = `${m.title}${year ? ` (${year})` : ""}`;
  return pageMetadata({
    // "Watch X (2024) – Trailer, Cast & Where to Stream" matches "watch X", "X trailer", "where to stream X"
    title: `Watch ${t} – Trailer, Cast & Where to Stream`,
    description: truncate(
      `Where to watch ${t} online in the US: streaming, rent or buy options, official trailer and full cast. ${m.overview}`,
      158,
    ),
    path: titlePath("movie", m.id, m.title),
    image: img(m.backdrop_path, "w1280") ?? img(m.poster_path, "w780"),
    type: "video.movie",
  });
}

export function tvMetadata(s: TvDetails): Metadata {
  const year = yearOf(s.first_air_date);
  return pageMetadata({
    title: `Stream ${s.name}${year ? ` (${year})` : ""} – All ${s.number_of_seasons} Seasons & Where to Watch`,
    description: truncate(
      `Where to stream ${s.name} full episodes in the US: every season, official trailer and cast. ${s.overview}`,
      158,
    ),
    path: titlePath("tv", s.id, s.name),
    image: img(s.backdrop_path, "w1280") ?? img(s.poster_path, "w780"),
    type: "video.tv_show",
  });
}

/* ---------------------------- JSON-LD ---------------------------------- */

function videoObject(v: Video, name: string, description: string, fallbackThumb: string | null) {
  return {
    "@type": "VideoObject",
    name: `${name} – ${v.name}`,
    description: description || `${v.type} for ${name}`,
    thumbnailUrl: [`https://i.ytimg.com/vi/${v.key}/hqdefault.jpg`, fallbackThumb].filter(Boolean),
    uploadDate: v.published_at,
    embedUrl: `https://www.youtube-nocookie.com/embed/${v.key}`,
    contentUrl: `https://www.youtube.com/watch?v=${v.key}`,
  };
}

function rating(vote_average: number, vote_count: number) {
  if (!vote_count) return undefined;
  return {
    "@type": "AggregateRating",
    ratingValue: Number(vote_average.toFixed(1)),
    bestRating: 10,
    worstRating: 0,
    ratingCount: vote_count,
  };
}

const person = (name: string) => ({ "@type": "Person", name });

export function movieJsonLd(m: MovieDetails) {
  const trailer = pickTrailer(m.videos);
  const directors = m.credits?.crew.filter((c) => c.job === "Director") ?? [];
  return {
    "@context": "https://schema.org",
    "@type": "Movie",
    "@id": absoluteUrl(titlePath("movie", m.id, m.title)),
    url: absoluteUrl(titlePath("movie", m.id, m.title)),
    name: m.title,
    description: m.overview,
    image: img(m.poster_path, "w780"),
    datePublished: m.release_date || undefined,
    duration: m.runtime ? `PT${m.runtime}M` : undefined,
    genre: m.genres.map((g) => g.name),
    director: directors.map((d) => person(d.name)),
    actor: (m.credits?.cast ?? []).slice(0, 10).map((a) => person(a.name)),
    aggregateRating: rating(m.vote_average, m.vote_count),
    sameAs: m.imdb_id ? `https://www.imdb.com/title/${m.imdb_id}/` : undefined,
    trailer: trailer ? videoObject(trailer, m.title, m.overview, img(m.backdrop_path, "w780")) : undefined,
  };
}

export function tvJsonLd(s: TvDetails) {
  const trailer = pickTrailer(s.videos);
  return {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    "@id": absoluteUrl(titlePath("tv", s.id, s.name)),
    url: absoluteUrl(titlePath("tv", s.id, s.name)),
    name: s.name,
    description: s.overview,
    image: img(s.poster_path, "w780"),
    startDate: s.first_air_date || undefined,
    endDate: s.status === "Ended" ? s.last_air_date : undefined,
    numberOfSeasons: s.number_of_seasons,
    numberOfEpisodes: s.number_of_episodes,
    genre: s.genres.map((g) => g.name),
    creator: s.created_by.map((c) => person(c.name)),
    actor: (s.credits?.cast ?? []).slice(0, 10).map((a) => person(a.name)),
    aggregateRating: rating(s.vote_average, s.vote_count),
    containsSeason: s.seasons
      .filter((x) => x.season_number > 0)
      .map((x) => ({
        "@type": "TVSeason",
        seasonNumber: x.season_number,
        numberOfEpisodes: x.episode_count,
        name: x.name,
        startDate: x.air_date || undefined,
      })),
    trailer: trailer ? videoObject(trailer, s.name, s.overview, img(s.backdrop_path, "w780")) : undefined,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}
