/**
 * Editorial collections — the "what to watch" SEO landing pages.
 *
 * Each entry gets its own static, indexable URL (/collection/{slug}) with a
 * unique, human-written intro. Unique copy is what makes these pages rank:
 * a bare grid of posters is thin content in Google's eyes. Add new entries
 * here; they are picked up by the sitemap and generateStaticParams.
 */
import type { DiscoverFilters } from "./tmdb";
import type { MediaType } from "./types";

export interface Collection {
  slug: string;
  type: MediaType;
  title: string; // H1 + <title>
  description: string; // meta description
  intro: string[]; // paragraphs, rendered server-side
  filters: DiscoverFilters;
}

export const COLLECTIONS: Collection[] = [
  {
    slug: "best-sci-fi-movies-2025",
    type: "movie",
    title: "Best Sci-Fi Movies of 2025",
    description:
      "The best science fiction movies of 2025, ranked by audience score — trailers, cast and where to stream each one in the US.",
    intro: [
      "2025 was a big year for science fiction on screen, from crowd-pleasing blockbusters to slow-burn original stories about AI, space and the near future.",
      "This list ranks the year's sci-fi releases by audience rating (minimum vote threshold applied so one-hit wonders don't skew it). Tap any poster for the trailer, full cast, and the US services where it's streaming, renting or free with ads.",
    ],
    filters: { with_genres: "878", year: 2025, sort_by: "vote_average.desc", "vote_count.gte": 150 },
  },
  {
    slug: "best-horror-movies-2026",
    type: "movie",
    title: "Best Horror Movies of 2026 (So Far)",
    description:
      "Looking for a scary movie tonight? The highest-rated horror films of 2026 with trailers and US streaming availability.",
    intro: [
      "Whether you're after supernatural dread, slashers or elevated psychological horror, these are the 2026 horror releases audiences rated highest.",
      "The list updates automatically as new reviews come in, so it's worth bookmarking for your next movie night.",
    ],
    filters: { with_genres: "27", year: 2026, sort_by: "vote_average.desc", "vote_count.gte": 50 },
  },
  {
    slug: "best-comedy-movies-of-all-time",
    type: "movie",
    title: "Best Comedy Movies of All Time",
    description:
      "The funniest, highest-rated comedy movies ever made — classic and modern picks with trailers and where to watch in the US.",
    intro: [
      "Great comedies age better than almost any genre. This all-time list mixes '80s and '90s classics with modern favorites, ranked by thousands of audience ratings.",
      "Need a feel-good pick for family night or something sharper for adults? Every title links to its trailer and streaming options.",
    ],
    filters: { with_genres: "35", sort_by: "vote_average.desc", "vote_count.gte": 3000 },
  },
  {
    slug: "best-animated-family-movies",
    type: "movie",
    title: "Best Animated Family Movies",
    description:
      "Top-rated animated movies the whole family will love — from Pixar-style adventures to anime classics, with US streaming info.",
    intro: [
      "Animated movies that genuinely work for kids and adults alike. Ranked by audience score with a high vote floor so only well-loved picks make the cut.",
    ],
    filters: { with_genres: "16,10751", sort_by: "vote_average.desc", "vote_count.gte": 2000 },
  },
  {
    slug: "best-crime-tv-shows",
    type: "tv",
    title: "Best Crime TV Shows to Binge",
    description:
      "The best crime and detective TV series to binge-watch, ranked by viewers — with trailers and where to stream every season.",
    intro: [
      "From prestige mob dramas to twisty detective procedurals, these crime series have the ratings to back up the hype.",
      "Each show page lists the number of seasons, the creators and the US services carrying it, so you can start episode one tonight.",
    ],
    filters: { with_genres: "80", sort_by: "vote_average.desc", "vote_count.gte": 1000 },
  },
  {
    slug: "best-sci-fi-fantasy-tv-shows",
    type: "tv",
    title: "Best Sci-Fi & Fantasy TV Shows",
    description:
      "The greatest science fiction and fantasy TV series ever made, ranked by fans, with trailers and US streaming availability.",
    intro: [
      "Epic worlds, time travel, dragons and dystopias: the sci-fi and fantasy series fans rate highest, all in one place.",
    ],
    filters: { with_genres: "10765", sort_by: "vote_average.desc", "vote_count.gte": 1000 },
  },
];

export const getCollection = (slug: string) => COLLECTIONS.find((c) => c.slug === slug);
