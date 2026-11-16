"use client";

import Image from "next/image";
import { AlertTriangle, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { PLAY_EVENT } from "./ads/events";

interface Props {
  /** Embed URL of a licensed source (official trailer by default). */
  embedUrl: string | null;
  /** Where to send users if the embed can't load. */
  externalUrl?: string;
  poster: string | null;
  title: string;
  /** Autoload on mount (watch page) vs. facade-until-click. */
  autoLoad?: boolean;
}

const LOAD_TIMEOUT_MS = 12_000;

export function VideoPlayer({ embedUrl, externalUrl, poster, title, autoLoad = false }: Props) {
  const [active, setActive] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">("idle");

  const start = () => {
    if (!embedUrl) return;
    setActive(true);
    setState("loading");
    // Lets the Popunder (and analytics) react to a deliberate play intent.
    window.dispatchEvent(new CustomEvent(PLAY_EVENT));
  };

  // On the watch page, wait until the browser is idle so the iframe loads
  // after the page's own content has painted.
  useEffect(() => {
    if (!autoLoad || !embedUrl) return;
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    const id = ric(() => {
      setActive(true);
      setState("loading");
    });
    return () => (window.cancelIdleCallback ?? window.clearTimeout)(id as number);
  }, [autoLoad, embedUrl]);

  useEffect(() => {
    if (state !== "loading") return;
    const t = window.setTimeout(() => setState((s) => (s === "loading" ? "error" : s)), LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(t);
  }, [state]);

  // Construction de l'URL : on sépare les params YouTube des params VidSrc
  let src = embedUrl;
  if (src) {
    const separator = src.includes("?") ? "&" : "?";
    const isYouTube = src.includes("youtube.com") || src.includes("youtu.be");
    const autoPlayParam = autoLoad ? 1 : 0; // CORRIGÉ : 1 si autoLoad, sinon 0
    
    if (isYouTube) {
      src = `${src}${separator}autoplay=${autoPlayParam}&rel=0&modestbranding=1`;
    } else {
      // Pour VidSrc, on ajoute uniquement l'autoplay
      src = `${src}${separator}autoplay=${autoPlayParam}`;
    }
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black shadow-2xl">
      {active && src && state !== "error" && (
        <iframe
          src={src}
          title={`${title} – video player`}
          className="absolute inset-0 h-full w-full"
          loading="lazy"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          // SUPPRIMÉ : sandbox (bloque VidSrc)
          onLoad={() => setState("ready")}
        />
      )}

      {/* Facade: visible until the iframe has loaded */}
      {state !== "ready" && state !== "error" && (
        <button
          type="button"
          onClick={start}
          disabled={!embedUrl || active}
          className="group absolute inset-0 flex items-center justify-center"
          aria-label={embedUrl ? `Play ${title}` : `No video available for ${title}`}
        >
          {poster && <Image src={poster} alt="" fill sizes="(max-width: 1024px) 100vw, 70vw" className="object-cover opacity-70" />}
          <span className="absolute inset-0 bg-black/30" />
          {embedUrl ? (
            <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/90 shadow-lg transition-transform group-hover:scale-110">
              {active ? (
                <span className="h-8 w-8 animate-spin rounded-full border-4 border-white/30 border-t-white" />
              ) : (
                <Play className="ml-1 h-9 w-9 fill-white text-white" />
              )}
            </span>
          ) : (
            <span className="relative rounded bg-black/70 px-4 py-2 text-sm">No trailer available yet</span>
          )}
        </button>
      )}

      {state === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/90 p-6 text-center">
          <AlertTriangle className="h-10 w-10 text-yellow-400" aria-hidden />
          <p className="font-semibold">The player couldn&apos;t load.</p>
          <p className="max-w-sm text-sm text-white/70">An ad blocker or a slow connection may be blocking the video.</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setState("idle");
                setActive(false);
              }}
              className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black"
            >
              Retry
            </button>
            {externalUrl && (
              <a href={externalUrl} target="_blank" rel="noopener" className="rounded-md bg-white/15 px-4 py-2 text-sm font-semibold">
                Open externally
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
