// Minimal TMDB v3 response types — only the fields this app reads.

export type MediaType = "movie" | "tv";

export interface Paged<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

interface MediaBase {
  id: number;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  popularity: number;
}

export interface MovieSummary extends MediaBase {
  media_type?: "movie";
  title: string;
  release_date?: string;
}

export interface TvSummary extends MediaBase {
  media_type?: "tv";
  name: string;
  first_air_date?: string;
}

export interface PersonSummary {
  media_type: "person";
  id: number;
  name: string;
  profile_path: string | null;
}

export type MediaSummary = MovieSummary | TvSummary;
export type MultiResult = MediaSummary | PersonSummary;

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string; // "YouTube" | "Vimeo"
  type: string; // "Trailer" | "Teaser" | ...
  official: boolean;
  published_at: string;
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority: number;
}

export interface WatchProviderRegion {
  link: string; // TMDB / JustWatch deep link for the region
  flatrate?: WatchProvider[];
  free?: WatchProvider[];
  ads?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
}

interface DetailsExtras {
  genres: Genre[];
  tagline?: string;
  status: string;
  credits?: { cast: CastMember[]; crew: CrewMember[] };
  videos?: { results: Video[] };
  similar?: Paged<MediaSummary>;
  recommendations?: Paged<MediaSummary>;
  "watch/providers"?: { results: Record<string, WatchProviderRegion> };
}

export interface MovieDetails extends MovieSummary, DetailsExtras {
  runtime: number | null;
  imdb_id?: string | null;
}

export interface Season {
  id: number;
  season_number: number;
  name: string;
  episode_count: number;
  air_date: string | null;
  poster_path: string | null;
}

export interface TvDetails extends TvSummary, DetailsExtras {
  episode_run_time: number[];
  number_of_seasons: number;
  number_of_episodes: number;
  seasons: Season[];
  created_by: { id: number; name: string }[];
  last_air_date?: string;
}

export const titleOf = (m: MediaSummary | MovieDetails | TvDetails) => ("title" in m ? m.title : m.name);
export const dateOf = (m: MediaSummary | MovieDetails | TvDetails) =>
  "title" in m ? m.release_date : m.first_air_date;
export const mediaTypeOf = (m: MediaSummary): MediaType => m.media_type ?? ("title" in m ? "movie" : "tv");
