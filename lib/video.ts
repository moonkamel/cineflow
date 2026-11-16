// lib/video.ts
import { pickTrailer } from "./seo";
import type { Video } from "./types";

export interface ResolvedVideo {
  embedUrl: string | null;
  externalUrl?: string;
  label: string;
}

/**
 * Métadonnées nécessaires pour construire une URL VidSrc.
 */
export interface VideoMeta {
  tmdbId: string | number;
  type: "movie" | "tv";
  season?: number;
  episode?: number;
}

/**
 * Construit l'URL d'intégration VidSrc pour un film ou une série.
 *
 * Formats supportés par vidsrc.su :
 * - Film  : https://vidsrc.su/embed/movie/{tmdbId}
 * - Série : https://vidsrc.su/embed/tv/{tmdbId}/{season}/{episode}
 * - Série (sans épisode précis) : https://vidsrc.su/embed/tv/{tmdbId}
 */
function getVidSrcUrl(meta: VideoMeta): string {
  const { tmdbId, type, season, episode } = meta;

  if (type === "tv") {
    if (season != null && episode != null) {
      return `https://vidsrc.su/embed/tv/${tmdbId}/${season}/${episode}`;
    }
    return `https://vidsrc.su/embed/tv/${tmdbId}`;
  }

  return `https://vidsrc.su/embed/movie/${tmdbId}`;
}

/**
 * Résout la source vidéo à afficher pour un titre donné.
 *
 * - Si les métadonnées TMDB sont fournies → iframe VidSrc (streaming).
 * - Sinon → bande-annonce YouTube via les vidéos TMDB.
 */
export function resolveVideo(
  videos?: { results: Video[] },
  meta?: VideoMeta,
): ResolvedVideo {
  // 1. Priorité au streaming VidSrc
  if (meta && meta.tmdbId != null) {
    const embedUrl = getVidSrcUrl(meta);
    return {
      embedUrl,
      externalUrl: embedUrl,
      label: "Stream",
    };
  }

  // 2. Fallback : bande-annonce YouTube
  const trailer = pickTrailer(videos);
  if (!trailer) {
    return { embedUrl: null, label: "Trailer" };
  }

  return {
    embedUrl: `https://www.youtube-nocookie.com/embed/${trailer.key}`,
    externalUrl: `https://www.youtube.com/watch?v=${trailer.key}`,
    label: trailer.type,
  };
}
