/**
 * Editorial collections — the "what to watch" SEO landing pages.
 *
 * Each entry gets its own indexable URL (/collection/{slug}) with a unique,
 * human-written intro. Unique copy is what makes these pages rank: a bare
 * grid of posters is thin content in Google's eyes. New entries are picked
 * up automatically by the sitemap, the collections index and the footer.
 *
 * Target keywords (US monthly volume / difficulty, OpenSEO, Nov 2026) are
 * noted next to each entry to keep the editorial intent explicit.
 */
import type { DiscoverFilters } from "./tmdb";
import type { MediaType } from "./types";

/** TMDB watch-provider ids, US region. */
export const PROVIDERS = {
  netflix: 8,
  primeVideo: 9,
  hulu: 15,
  tubi: 73,
  rokuChannel: 207,
  plutoTv: 300,
} as const;

/** Free + free-with-ads availability (Tubi, Pluto TV, Roku Channel, Plex, …). */
const FREE = "free|ads";

export type CollectionSection = "seasonal" | "free" | "platform" | "genre";

export const SECTION_LABELS: Record<CollectionSection, string> = {
  seasonal: "Holiday Picks",
  free: "Free Movies (Legal)",
  platform: "Best on Each Streaming Service",
  genre: "Best by Genre",
};

export interface Collection {
  slug: string;
  section: CollectionSection;
  type: MediaType;
  title: string; // H1 + <title>
  description: string; // meta description
  intro: string[]; // paragraphs, rendered server-side
  filters: DiscoverFilters;
  /** TMDB keyword name resolved to an id at request time (e.g. "christmas"). */
  keyword?: string;
}

export const COLLECTIONS: Collection[] = [
  /* ----------------------------- Seasonal ------------------------------ */
  {
    // "thanksgiving movies" 135k / KD 0
    slug: "thanksgiving-movies",
    section: "seasonal",
    type: "movie",
    title: "Best Thanksgiving Movies to Watch This Year",
    description:
      "The best Thanksgiving movies for the whole family — classic comedies and feel-good favorites, with trailers and where to stream each one in the US.",
    intro: [
      "Thanksgiving has its own small but beloved movie canon: road-trip disasters, chaotic family dinners and heartfelt reunions that pair perfectly with leftovers.",
      "Here are the most popular Thanksgiving movies right now. Every title links to its trailer and the US services where you can stream, rent or watch it for free with ads.",
    ],
    keyword: "thanksgiving",
    filters: { sort_by: "popularity.desc", "vote_count.gte": 20 },
  },
  {
    // "best christmas movies" 110k / KD 19
    slug: "best-christmas-movies",
    section: "seasonal",
    type: "movie",
    title: "Best Christmas Movies of All Time",
    description:
      "The best Christmas movies ever made, ranked by viewers — family classics, rom-coms and holiday comedies, with trailers and US streaming info.",
    intro: [
      "From timeless black-and-white classics to modern holiday rom-coms, these are the Christmas movies audiences rate highest — not just the ones that air on repeat.",
      "We rank by audience score with a minimum number of votes, so every pick here is a crowd-tested favorite. Tap a poster to see where it's streaming this season.",
    ],
    keyword: "christmas",
    filters: { sort_by: "vote_average.desc", "vote_count.gte": 500 },
  },
  {
    // "christmas movies on netflix" 49.5k / KD 12
    slug: "christmas-movies-on-netflix",
    section: "seasonal",
    type: "movie",
    title: "Christmas Movies on Netflix Right Now",
    description:
      "Every Christmas movie you can stream on Netflix in the US right now, sorted by popularity — Netflix originals and holiday classics.",
    intro: [
      "Netflix's holiday lineup changes every year as licensed titles come and go. This page is built from live US availability data, so it only lists Christmas movies you can actually press play on today.",
      "Expect a mix of Netflix original holiday rom-coms and family movies alongside licensed favorites.",
    ],
    keyword: "christmas",
    filters: { with_watch_providers: String(PROVIDERS.netflix), with_watch_monetization_types: "flatrate", sort_by: "popularity.desc" },
  },
  {
    // "free christmas movies" 8.1k / KD 0
    slug: "free-christmas-movies",
    section: "seasonal",
    type: "movie",
    title: "Free Christmas Movies to Watch Online (Legally)",
    description:
      "Watch Christmas movies for free and legally in the US — holiday films available on free ad-supported services like Tubi, Pluto TV and The Roku Channel.",
    intro: [
      "You don't need a subscription to get into the holiday spirit. Every movie on this list is currently available to stream for free in the US on a legal, ad-supported service.",
      "Availability is updated daily from streaming data, and each title shows exactly which free service carries it.",
    ],
    keyword: "christmas",
    filters: { with_watch_monetization_types: FREE, sort_by: "popularity.desc" },
  },

  /* ------------------------------- Free -------------------------------- */
  {
    // "tubi movies" 301k / KD 29, "free movies on tubi" 8.1k / KD 26
    slug: "best-free-movies-on-tubi",
    section: "free",
    type: "movie",
    title: "Best Free Movies on Tubi Right Now",
    description:
      "The best movies streaming free on Tubi in the US, ranked by viewers. No subscription needed — just trailers and a direct path to watch.",
    intro: [
      "Tubi is one of the largest free, ad-supported streaming services in the US, with thousands of movies and no account required.",
      "Its catalog is huge, which makes finding the good stuff hard. This list surfaces Tubi's best-rated movies so you can skip the scrolling.",
    ],
    filters: { with_watch_providers: String(PROVIDERS.tubi), sort_by: "vote_average.desc", "vote_count.gte": 300 },
  },
  {
    // "free horror movies" 8.1k / KD 0
    slug: "free-horror-movies",
    section: "free",
    type: "movie",
    title: "Free Horror Movies to Watch Online (Legally)",
    description:
      "Stream horror movies for free and legally in the US — slashers, supernatural scares and cult classics on free ad-supported services.",
    intro: [
      "Free streaming services are a goldmine for horror fans: cult classics, '80s slashers and modern indie scares, all without a subscription.",
      "Every film below is currently free to watch legally in the US. Tap a poster to see which service carries it.",
    ],
    filters: { with_genres: "27", with_watch_monetization_types: FREE, sort_by: "popularity.desc", "vote_count.gte": 50 },
  },
  {
    slug: "free-comedy-movies",
    section: "free",
    type: "movie",
    title: "Free Comedy Movies to Watch Online (Legally)",
    description: "Funny movies you can stream free and legally in the US right now, on ad-supported services like Tubi, Pluto TV and The Roku Channel.",
    intro: [
      "Need a laugh without paying for another subscription? These comedies are all free to stream legally in the US, ranked by what people are watching right now.",
    ],
    filters: { with_genres: "35", with_watch_monetization_types: FREE, sort_by: "popularity.desc", "vote_count.gte": 50 },
  },
  {
    slug: "free-action-movies",
    section: "free",
    type: "movie",
    title: "Free Action Movies to Watch Online (Legally)",
    description: "The best action movies streaming free and legally in the US — no subscription, just ad-supported services.",
    intro: [
      "Car chases, heists and shoot-outs, all free. These action movies are currently available on legal, ad-supported US services.",
    ],
    filters: { with_genres: "28", with_watch_monetization_types: FREE, sort_by: "popularity.desc", "vote_count.gte": 50 },
  },
  {
    slug: "free-sci-fi-movies",
    section: "free",
    type: "movie",
    title: "Free Sci-Fi Movies to Watch Online (Legally)",
    description: "Science fiction movies you can stream free and legally in the US, from cult classics to recent hits.",
    intro: [
      "Space operas, time loops and dystopias — this list collects sci-fi movies that are free to stream legally in the US today.",
    ],
    filters: { with_genres: "878", with_watch_monetization_types: FREE, sort_by: "popularity.desc", "vote_count.gte": 50 },
  },
  {
    slug: "free-family-movies",
    section: "free",
    type: "movie",
    title: "Free Family Movies to Watch Online (Legally)",
    description: "Kid-friendly and family movies that are free to stream legally in the US — perfect for movie night without a subscription.",
    intro: [
      "Family movie night doesn't have to cost anything. These kid-friendly movies are all streaming free and legally in the US.",
    ],
    filters: { with_genres: "10751", with_watch_monetization_types: FREE, sort_by: "popularity.desc", "vote_count.gte": 50 },
  },
  {
    // "free anime streaming" 12.1k / KD 4
    slug: "free-anime-movies",
    section: "free",
    type: "movie",
    title: "Free Anime Movies to Stream Legally",
    description: "Anime movies you can watch for free and legally in the US, on official ad-supported streaming services.",
    intro: [
      "Plenty of anime films are available for free through official, ad-supported services — no sketchy mirror sites required.",
      "This list covers Japanese animated features currently free to stream in the US, ranked by popularity.",
    ],
    filters: { with_genres: "16", with_original_language: "ja", with_watch_monetization_types: FREE, sort_by: "popularity.desc" },
  },

  /* ----------------------------- Platform ------------------------------ */
  {
    // "best movies on netflix" 165k / KD 46
    slug: "best-movies-on-netflix",
    section: "platform",
    type: "movie",
    title: "Best Movies on Netflix Right Now",
    description: "The highest-rated movies streaming on Netflix in the US right now, updated daily from live availability data.",
    intro: [
      "Netflix's catalog changes every week, so most 'best of' lists go stale fast. This one is generated from live US availability and ranked by audience score.",
      "Only movies with a substantial number of ratings make the cut, so you get proven picks instead of algorithm filler.",
    ],
    filters: { with_watch_providers: String(PROVIDERS.netflix), with_watch_monetization_types: "flatrate", sort_by: "vote_average.desc", "vote_count.gte": 1000 },
  },
  {
    // "best movies on hulu" 33.1k / KD 1
    slug: "best-movies-on-hulu",
    section: "platform",
    type: "movie",
    title: "Best Movies on Hulu Right Now",
    description: "The best movies streaming on Hulu in the US right now, ranked by audience score and updated daily.",
    intro: [
      "Hulu quietly carries one of the strongest movie libraries of any US streamer, from recent theatrical releases to award winners.",
      "This list is built from live availability, ranked by audience rating, so everything here is streaming on Hulu today.",
    ],
    filters: { with_watch_providers: String(PROVIDERS.hulu), with_watch_monetization_types: "flatrate", sort_by: "vote_average.desc", "vote_count.gte": 1000 },
  },
  {
    // "best movies on prime video" 4.4k / KD 8
    slug: "best-movies-on-prime-video",
    section: "platform",
    type: "movie",
    title: "Best Movies on Prime Video Right Now",
    description: "The best movies included with Amazon Prime Video in the US right now, ranked by audience score.",
    intro: [
      "Prime Video mixes included titles with rentals, which makes browsing confusing. This list only shows movies included with a Prime membership in the US today.",
    ],
    filters: { with_watch_providers: String(PROVIDERS.primeVideo), with_watch_monetization_types: "flatrate", sort_by: "vote_average.desc", "vote_count.gte": 1000 },
  },

  /* ------------------------------- Genre ------------------------------- */
  {
    // "best horror movies" 90.5k / KD 13
    slug: "best-horror-movies",
    section: "genre",
    type: "movie",
    title: "Best Horror Movies of All Time",
    description: "The best horror movies ever made, ranked by thousands of viewer ratings — with trailers and where to stream each one in the US.",
    intro: [
      "From slow-burn psychological terror to iconic slashers, these are the horror films audiences rate highest across decades.",
      "A high vote threshold keeps the list honest: only widely seen, well-loved scares make it in.",
    ],
    filters: { with_genres: "27", sort_by: "vote_average.desc", "vote_count.gte": 2000 },
  },
  {
    // "best movies 2025" 40.5k / KD 16
    slug: "best-movies-of-2025",
    section: "genre",
    type: "movie",
    title: "Best Movies of 2025",
    description: "The best movies of 2025 across every genre, ranked by audience score — with trailers and US streaming availability.",
    intro: [
      "Catch up on the year's standouts: the 2025 releases audiences rated highest, from blockbusters to indie breakouts.",
    ],
    filters: { year: 2025, sort_by: "vote_average.desc", "vote_count.gte": 300 },
  },
  {
    slug: "best-sci-fi-movies-2025",
    section: "genre",
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
    section: "genre",
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
    section: "genre",
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
    section: "genre",
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
    section: "genre",
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
    section: "genre",
    type: "tv",
    title: "Best Sci-Fi & Fantasy TV Shows",
    description:
      "The greatest science fiction and fantasy TV series ever made, ranked by fans, with trailers and US streaming availability.",
    intro: ["Epic worlds, time travel, dragons and dystopias: the sci-fi and fantasy series fans rate highest, all in one place."],
    filters: { with_genres: "10765", sort_by: "vote_average.desc", "vote_count.gte": 1000 },
  },
];

export const getCollection = (slug: string) => COLLECTIONS.find((c) => c.slug === slug);
export const collectionsIn = (section: CollectionSection) => COLLECTIONS.filter((c) => c.section === section);
