"use client";

/**
 * Adsterra display/native banner slot.
 *
 * - Each banner runs inside its own sandboxed `srcdoc` iframe: Adsterra's
 *   snippet relies on a global `atOptions`, so two banners on the same page
 *   would otherwise overwrite each other. Isolation also keeps ad JS off our
 *   main thread and stops it from touching our DOM.
 * - The slot reserves its exact size before loading → no CLS.
 * - Loaded only when scrolled near the viewport.
 * - `responsive` swaps 728x90 (≥768px) for 300x250 on mobile.
 */
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Format = "300x250" | "728x90";

const KEYS: Record<Format, string | undefined> = {
  "300x250": process.env.NEXT_PUBLIC_ADSTERRA_BANNER_300X250_KEY,
  "728x90": process.env.NEXT_PUBLIC_ADSTERRA_BANNER_728X90_KEY,
};

/**
 * Adsterra serves banners from per-account domains. Copy the part of the
 * second <script src> before the key, e.g. "https://example-domain.org/22".
 * Unset → Adsterra's legacy CDN pattern.
 */
const BANNER_BASE = process.env.NEXT_PUBLIC_ADSTERRA_BANNER_BASE?.replace(/\/$/, "");
const bannerSrc = (key: string) =>
  BANNER_BASE
    ? `${BANNER_BASE}/${encodeURIComponent(key)}`
    : `https://www.highperformanceformat.com/${encodeURIComponent(key)}/invoke.js`;

const SIZE: Record<Format, [number, number]> = { "300x250": [300, 250], "728x90": [728, 90] };

function bannerDoc(key: string, w: number, h: number) {
  return `<!doctype html><html><head><meta name="referrer" content="no-referrer-when-downgrade"><style>html,body{margin:0;padding:0;background:transparent;overflow:hidden}</style></head><body>
<script>atOptions={key:${JSON.stringify(key)},format:"iframe",height:${h},width:${w},params:{}};</script>
<script src="${bannerSrc(key)}"></script>
</body></html>`;
}

interface Props {
  format?: Format;
  /** Use 728x90 on desktop and 300x250 on mobile. */
  responsive?: boolean;
  className?: string;
}

export function AdSlot({ format = "300x250", responsive = false, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [fmt, setFmt] = useState<Format>(format);

  useEffect(() => {
    if (responsive) setFmt(window.matchMedia("(min-width: 768px)").matches ? "728x90" : "300x250");
  }, [responsive]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const key = KEYS[fmt];
  if (!key) return null; // format not configured → render nothing
  const [w, h] = SIZE[fmt];

  return (
    <div className={cn("flex w-full flex-col items-center", className)}>
      <span className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">Advertisement</span>
      <div
        ref={ref}
        style={{ width: w, height: h, maxWidth: "100%" }}
        className="overflow-hidden rounded bg-white/[0.03]"
      >
        {visible && (
          <iframe
            title="Advertisement"
            width={w}
            height={h}
            srcDoc={bannerDoc(key, w, h)}
            sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin"
            loading="lazy"
            className="border-0"
          />
        )}
      </div>
    </div>
  );
}
