import Link from "next/link";
import type { Collection } from "@/lib/collections";

export function CollectionCards({ items }: { items: Collection[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((c) => (
        <li key={c.slug}>
          <Link
            href={`/collection/${c.slug}`}
            className="block h-full rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">{c.type === "movie" ? "Movies" : "TV Shows"}</p>
            <h3 className="mt-1 text-lg font-bold">{c.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{c.description}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
