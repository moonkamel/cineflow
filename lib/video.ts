/**
 * Video source resolution — the single place that decides what the player embeds.
 *
 * Default: the title's official trailer (YouTube privacy-enhanced mode).
 * To plug in full-length playback, add a provider here that returns an embed
 * URL for content you hold distribution rights to (your own Mux / Cloudflare
 * Stream / Bunny Stream library, or a licensed AVOD partner's embed).
 */
import { pickTrailer } from "./seo";
import type { Video } from "./types";

export interface ResolvedVideo {
  embedUrl: string | null;
  externalUrl?: string;
  label: string;
}

export function resolveVideo(videos?: { results: Video[] }): ResolvedVideo {
  const t = pickTrailer(videos);
  if (!t) return { embedUrl: null, label: "Trailer" };
  return {
    embedUrl: `https://www.youtube-nocookie.com/embed/${t.key}`,
    externalUrl: `https://www.youtube.com/watch?v=${t.key}`,
    label: t.type,
  };
}
