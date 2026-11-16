import Image from "next/image";
import { img } from "@/lib/tmdb";
import type { CastMember } from "@/lib/types";

export function CastList({ cast }: { cast: CastMember[] }) {
  if (!cast.length) return null;
  return (
    <section aria-labelledby="cast-heading">
      <h2 id="cast-heading" className="mb-4 text-xl font-bold">
        Cast
      </h2>
      <ul className="no-scrollbar flex snap-x gap-4 overflow-x-auto pb-2">
        {cast.slice(0, 15).map((p) => {
          const src = img(p.profile_path, "w185");
          return (
            <li key={`${p.id}-${p.character}`} className="w-24 shrink-0 snap-start text-center">
              <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full bg-white/10">
                {src ? (
                  <Image src={src} alt={p.name} fill sizes="80px" className="object-cover" />
                ) : (
                  <span className="flex h-full items-center justify-center text-lg font-bold text-white/50">
                    {p.name.charAt(0)}
                  </span>
                )}
              </div>
              <p className="mt-2 line-clamp-1 text-sm font-medium">{p.name}</p>
              <p className="line-clamp-1 text-xs text-muted-foreground">{p.character}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
