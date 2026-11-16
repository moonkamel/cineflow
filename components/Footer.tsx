import Link from "next/link";
import { collectionsIn } from "@/lib/collections";
import { SITE_NAME } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border py-10 text-sm text-muted-foreground">
      <div className="container grid gap-8 md:grid-cols-3">
        <div>
          <p className="text-lg font-black text-primary">{SITE_NAME.toUpperCase()}</p>
          <p className="mt-2 max-w-xs">Find what to watch tonight: trailers, cast and US streaming availability.</p>
        </div>
        <div>
          <p className="mb-2 font-semibold text-foreground">What to watch</p>
          <ul className="space-y-1">
            {[...collectionsIn("seasonal"), ...collectionsIn("platform")].map((c) => (
              <li key={c.slug}>
                <Link href={`/collection/${c.slug}`} className="hover:text-foreground">
                  {c.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/free-movies" className="hover:text-foreground">
                Free Movies Online
              </Link>
            </li>
            <li>
              <Link href="/free-streaming-sites" className="hover:text-foreground">
                Best Free Streaming Sites
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-2">
          <p>
            This product uses the TMDB API but is not endorsed or certified by TMDB. Streaming availability data
            provided by JustWatch.
          </p>
          <p>© {new Date().getFullYear()} {SITE_NAME}</p>
        </div>
      </div>
    </footer>
  );
}
