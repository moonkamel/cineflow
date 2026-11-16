import type { Metadata } from "next";
import Link from "next/link";
import { COLLECTIONS } from "@/lib/collections";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "What to Watch: Best Movie & TV Show Lists",
  description: "Hand-picked lists of the best movies and TV shows by genre and year — find something great to watch tonight.",
  path: "/collections",
});

export default function CollectionsPage() {
  return (
    <div className="container pt-24 md:pt-28">
      <h1 className="text-3xl font-black md:text-5xl">What to Watch</h1>
      <p className="mt-3 max-w-2xl text-white/80">Curated, always-up-to-date lists to help you pick tonight&apos;s movie or your next binge.</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COLLECTIONS.map((c) => (
          <li key={c.slug}>
            <Link href={`/collection/${c.slug}`} className="block h-full rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">{c.type === "movie" ? "Movies" : "TV Shows"}</p>
              <h2 className="mt-1 text-lg font-bold">{c.title}</h2>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{c.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
