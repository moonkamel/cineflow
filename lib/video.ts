// lib/video.ts
import { pickTrailer } from "./seo";
import type { Video } from "./types";

export interface ResolvedVideo {
  embedUrl: string | null;
  externalUrl?: string;
  label: string;
}

/**
 * Construit l'URL d'intégration VidSrc.
 * @param tmdbId L'ID TMDB du film ou de la série.
 * @param type "movie" ou "tv".
 * @param season (Optionnel) Saison pour une série.
 * @param episode (Optionnel) Épisode pour une série.
 */
function getVidSrcUrl(
  tmdbId: string | number,
  type: "movie" | "tv",
  season?: number,
  episode?: number
): string {
  const base = `https://vidsrc.su/embed/${type}/${tmdbId}`;
  if (type === "tv" && season && episode) {
    return `${base}/${season}/${episode}`;
  }
  return base;
}

export function resolveVideo(
  videos?: { results: Video[] },
  // Ajout de paramètres optionnels pour VidSrc
  meta?: {
    tmdbId: string | number;
    type: "movie" | "tv";
    season?: number;
    episode?: number;
  }
): ResolvedVideo {
  // 1. Priorité à VidSrc si les métadonnées sont fournies
  if (meta?.tmdbId) {
    const vidSrcUrl = getVidSrcUrl(meta.tmdbId, meta.type, meta.season, meta.episode);
    return {
      embedUrl: vidSrcUrl,
      label: "Stream", // ou "Watch Now"
    };
  }

  // 2. Fallback sur la bande-annonce YouTube (comportement actuel)
  const t = pickTrailer(videos);
  if (!t) return { embedUrl: null, label: "Trailer" };
  return {
    embedUrl: `https://www.youtube-nocookie.com/embed/${t.key}`,
    externalUrl: `https://www.youtube.com/watch?v=${t.key}`,
    label: t.type,
  };
}
