"use client";

import { useEffect, useState } from "react";
import { VideoPlayer } from "@/components/VideoPlayer";
import { img } from "@/lib/tmdb";

interface Props {
  tvId: number;
  seasons: { season_number: number; name: string; episode_count: number }[];
  title: string;
  backdrop: string | null;
}

export function TVPlayer({ tvId, seasons, title, backdrop }: Props) {
  // On ignore la saison 0 (Spéciaux) et on prend la première saison dispo
  const validSeasons = seasons.filter((s) => s.season_number > 0);
  const [season, setSeason] = useState(validSeasons[0]?.season_number || 1);
  const [episode, setEpisode] = useState(1);
  const [episodes, setEpisodes] = useState<{ episode_number: number; name: string }[]>([]);
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(false);

  // Récupération des épisodes à chaque changement de saison
  useEffect(() => {
    async function fetchEpisodes() {
      setIsLoadingEpisodes(true);
      try {
        // On utilise l'API TMDB avec la clé fournie
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/${tvId}/season/${season}?api_key=3881817ccb1f522394c1a82f70ff38e8&language=en-US`
        );
        const data = await res.json();
        setEpisodes(data.episodes || []);
        setEpisode(1); // On repasse à l'épisode 1 quand on change de saison
      } catch (err) {
        console.error("Failed to load episodes", err);
      } finally {
        setIsLoadingEpisodes(false);
      }
    }
    fetchEpisodes();
  }, [tvId, season]);

  // Construction de l'URL VidSrc finale
  const embedUrl = `https://vidsrc.su/embed/tv/${tvId}/${season}/${episode}`;

  return (
    <div className="flex flex-col gap-6">
      {/* Le Lecteur Vidéo */}
      <VideoPlayer
        embedUrl={embedUrl}
        externalUrl={embedUrl}
        title={title}
        poster={backdrop ? img(backdrop, "w1280") : null}
        autoLoad={true}
      />

      {/* Le Menu de sélection */}
      <div className="flex flex-wrap items-center gap-4 rounded-lg bg-white/5 p-4 ring-1 ring-white/10">
        <div className="flex flex-col gap-1">
          <label htmlFor="season-select" className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Season
          </label>
          <select
            id="season-select"
            value={season}
            onChange={(e) => setSeason(Number(e.target.value))}
            className="rounded-md border-0 bg-neutral-800 py-2 pl-3 pr-10 text-white focus:ring-2 focus:ring-red-600 sm:text-sm"
          >
            {validSeasons.map((s) => (
              <option key={s.season_number} value={s.season_number}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="episode-select" className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Episode
          </label>
          <select
            id="episode-select"
            value={episode}
            disabled={isLoadingEpisodes}
            onChange={(e) => setEpisode(Number(e.target.value))}
            className="rounded-md border-0 bg-neutral-800 py-2 pl-3 pr-10 text-white focus:ring-2 focus:ring-red-600 sm:text-sm disabled:opacity-50 min-w-[200px]"
          >
            {isLoadingEpisodes ? (
              <option>Loading...</option>
            ) : (
              episodes.map((ep) => (
                <option key={ep.episode_number} value={ep.episode_number}>
                  E{ep.episode_number} - {ep.name}
                </option>
              ))
            )}
          </select>
        </div>
      </div>
    </div>
  );
}
