import Image from "next/image";
import { img } from "@/lib/tmdb";
import type { WatchProvider, WatchProviderRegion } from "@/lib/types";

const GROUPS: { key: keyof Omit<WatchProviderRegion, "link">; label: string }[] = [
  { key: "flatrate", label: "Stream" },
  { key: "free", label: "Free" },
  { key: "ads", label: "Free with ads" },
  { key: "rent", label: "Rent" },
  { key: "buy", label: "Buy" },
];

/**
 * Legal US availability from TMDB's watch-provider data (powered by JustWatch).
 * TMDB's terms require the JustWatch attribution shown below.
 */
export function WhereToWatch({ region, title }: { region?: WatchProviderRegion; title: string }) {
  return (
    <section aria-labelledby="wtw-heading" className="rounded-lg border border-border bg-card/60 p-4 md:p-6">
      <h2 id="wtw-heading" className="text-xl font-bold">
        Where to watch {title}
      </h2>
      {!region || GROUPS.every((g) => !region[g.key]?.length) ? (
        <p className="mt-3 text-sm text-muted-foreground">
          {title} isn&apos;t currently available on a US streaming service. Check back soon — availability changes
          often.
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          {GROUPS.map(({ key, label }) => {
            const list = region[key] as WatchProvider[] | undefined;
            if (!list?.length) return null;
            return (
              <div key={key}>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</h3>
                <ul className="flex flex-wrap gap-2">
                  {list.map((p) => (
                    <li key={p.provider_id}>
                      <a
                        href={region.link}
                        target="_blank"
                        rel="noopener nofollow"
                        className="flex items-center gap-2 rounded-md bg-white/5 py-1 pl-1 pr-3 text-sm hover:bg-white/10"
                      >
                        <Image
                          src={img(p.logo_path, "w92")!}
                          alt=""
                          width={32}
                          height={32}
                          className="rounded"
                        />
                        {p.provider_name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
      <p className="mt-4 text-xs text-muted-foreground">Streaming availability data provided by JustWatch.</p>
    </section>
  );
}
