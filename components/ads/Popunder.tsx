"use client";

/**
 * Adsterra Popunder — armed only after an explicit "Play" intent.
 *
 * Browsers only allow a popunder inside a user gesture, so the Adsterra
 * script attaches itself to the *next* click. We therefore inject it after
 * the first Play click: the user's following interaction (e.g. a player
 * control) opens the popunder, and navigation before that stays ad-free.
 *
 * Note: "on page close" popunders are not possible — browsers block any
 * window opened from beforeunload/pagehide. Exit-intent is better served by
 * the Social Bar, which is already present.
 */
import { useEffect } from "react";
import { PLAY_EVENT } from "./events";

const SRC = process.env.NEXT_PUBLIC_ADSTERRA_POPUNDER_SRC;

export function Popunder() {
  useEffect(() => {
    if (!SRC) return;
    const arm = () => {
      if (document.querySelector('script[data-cf-ad="popunder"]')) return;
      const s = document.createElement("script");
      s.src = SRC;
      s.async = true;
      s.dataset.cfAd = "popunder";
      document.body.appendChild(s);
    };
    window.addEventListener(PLAY_EVENT, arm, { once: true });
    return () => window.removeEventListener(PLAY_EVENT, arm);
  }, []);
  return null;
}
