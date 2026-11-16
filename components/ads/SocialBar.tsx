"use client";

/**
 * Adsterra Social Bar.
 *
 * - Loaded with `lazyOnload` semantics (after the page is idle) instead of a
 *   blocking <head> tag: the ad still shows, but never delays LCP/INP.
 * - Client-side frequency cap (default 2 impressions / visitor / day) on top
 *   of the cap you set in the Adsterra dashboard (Frequency → 2/24h).
 * - Position (bottom-right desktop / bottom mobile) is chosen in the
 *   Adsterra dashboard when you create the Social Bar unit.
 */
import { useEffect } from "react";

const SRC = process.env.NEXT_PUBLIC_ADSTERRA_SOCIAL_BAR_SRC;
const CAP = Number(process.env.NEXT_PUBLIC_ADSTERRA_SOCIAL_BAR_DAILY_CAP ?? 2);
const KEY = "cf_sb_imp";

function underCap(): boolean {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "{}") as { d?: string; n?: number };
    const n = raw.d === today ? (raw.n ?? 0) : 0;
    if (n >= CAP) return false;
    localStorage.setItem(KEY, JSON.stringify({ d: today, n: n + 1 }));
    return true;
  } catch {
    return true; // storage blocked: rely on the server-side cap
  }
}

export function SocialBar() {
  useEffect(() => {
    if (!SRC || !underCap()) return;
    const load = () => {
      const s = document.createElement("script");
      s.src = SRC;
      s.async = true;
      s.dataset.cfAd = "social-bar";
      document.body.appendChild(s);
    };
    // Defer until the main thread is idle (keeps INP / TBT clean).
    if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(load, { timeout: 4000 });
    else setTimeout(load, 3000);
  }, []);
  return null;
}
