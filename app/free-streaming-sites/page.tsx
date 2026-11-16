import type { Metadata } from "next";
import Link from "next/link";
import { Faq, type FaqItem } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/ads/AdSlot";
import { absoluteUrl } from "@/lib/site";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

/*
 * Targets (US / month, OpenSEO Nov 2026):
 *  "free streaming sites" 49.5k KD41 · "free movie streaming sites" 22.2k KD26
 *  "fmovies alternative" 9.9k KD0 · "123movies alternative" 8.1k KD0 · "is 123movies legal" 170
 * People searching these want free movies; this page sends them to legal,
 * licensed services instead of unlicensed mirror sites.
 */

export const metadata: Metadata = pageMetadata({
  title: "Best Free Streaming Sites (2026): Legal 123movies & Fmovies Alternatives",
  description:
    "The best free movie streaming sites that are 100% legal in the US — Tubi, Pluto TV, The Roku Channel, Plex and more. Safe alternatives to 123movies and Fmovies.",
  path: "/free-streaming-sites",
});

interface Service {
  name: string;
  url: string;
  cost: string;
  bestFor: string;
  text: string;
}

const SERVICES: Service[] = [
  {
    name: "Tubi",
    url: "https://tubitv.com",
    cost: "Free with ads · no account needed",
    bestFor: "The biggest free movie library",
    text: "Tubi has one of the largest catalogs of any free service in the US, with a deep bench of horror, action, documentaries and cult classics. You can start watching without signing up.",
  },
  {
    name: "Pluto TV",
    url: "https://pluto.tv",
    cost: "Free with ads · no account needed",
    bestFor: "Live channels + on-demand movies",
    text: "Pluto TV combines hundreds of live, cable-style channels with an on-demand movie library. Great if you like channel surfing instead of picking a title.",
  },
  {
    name: "The Roku Channel",
    url: "https://therokuchannel.roku.com",
    cost: "Free with ads · works without a Roku device",
    bestFor: "Recent movies and originals",
    text: "Despite the name, The Roku Channel works in any web browser and on phones. It rotates in surprisingly recent movies alongside its own originals.",
  },
  {
    name: "Plex",
    url: "https://www.plex.tv",
    cost: "Free with ads",
    bestFor: "Mixing free movies with your own library",
    text: "Plex offers a free ad-supported movie and TV catalog, plus live channels, in the same app you can use for your personal media collection.",
  },
  {
    name: "Kanopy",
    url: "https://www.kanopy.com",
    cost: "Free with a participating library card · no ads",
    bestFor: "Indie, classic and award-winning films",
    text: "Kanopy partners with public libraries and universities. If your library participates, you get ad-free access to critically acclaimed films, documentaries and Criterion titles.",
  },
  {
    name: "Hoopla",
    url: "https://www.hoopladigital.com",
    cost: "Free with a participating library card · no ads",
    bestFor: "Borrowing movies like library books",
    text: "Hoopla lets library members borrow a set number of movies, shows, e-books and albums each month at no cost.",
  },
  {
    name: "YouTube (Free with ads)",
    url: "https://www.youtube.com/feed/storefront",
    cost: "Free with ads",
    bestFor: "Quick access on any device",
    text: "YouTube has an official section of full-length movies that studios have licensed to stream free with ads — look for the “Free with ads” label on the Movies & TV page.",
  },
];

const FAQ: FaqItem[] = [
  {
    q: "Is 123movies legal?",
    a: "No. Sites like 123movies stream copies of movies they don't have the rights to, which is copyright infringement in the US. Their copycat domains are frequently shut down and are known for aggressive pop-ups and malicious redirects.",
  },
  {
    q: "What happened to Fmovies?",
    a: "Fmovies, one of the largest unlicensed streaming sites, was taken down in 2024 following an anti-piracy investigation. Sites using the name today are unrelated clones.",
  },
  {
    q: "What is the best free alternative to 123movies and Fmovies?",
    a: "Tubi is the closest legal alternative for sheer catalog size: thousands of free movies with no account required. Pluto TV and The Roku Channel are also excellent, and Kanopy is the best ad-free option if you have a library card.",
  },
  {
    q: "Are free streaming sites safe?",
    a: "Legal services like Tubi, Pluto TV, The Roku Channel, Plex, Kanopy and Hoopla are safe: they're licensed, published by established companies and available in official app stores. Unlicensed mirror sites are the ones associated with malware and scam ads.",
  },
  {
    q: "Can I watch new releases for free legally?",
    a: "Usually not right away — brand-new releases go to theaters, rental and paid subscriptions first. Movies tend to arrive on free services months or years later. Each movie page on our site shows its current US availability, including any free options.",
  },
];

export default function FreeStreamingSitesPage() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Best free legal streaming sites in the US",
    itemListElement: SERVICES.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.name, url: s.url })),
  };

  return (
    <article className="container max-w-4xl pt-24 md:pt-28">
      <JsonLd data={itemList} />
      <JsonLd
        data={{
          ...breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Free Movies", path: "/free-movies" },
            { name: "Free Streaming Sites", path: "/free-streaming-sites" },
          ]),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Best Free Streaming Sites: Legal 123movies & Fmovies Alternatives",
          url: absoluteUrl("/free-streaming-sites"),
          dateModified: new Date().toISOString().slice(0, 10),
        }}
      />

      <h1 className="text-3xl font-black tracking-tight md:text-5xl">Best Free Streaming Sites (Legal Alternatives to 123movies & Fmovies)</h1>
      <p className="mt-4 leading-relaxed text-white/80">
        You don&apos;t need sketchy mirror sites to watch movies for free. These services are completely legal in the US,
        work on phones, TVs and browsers, and between them carry thousands of full-length movies and shows. Most are
        supported by ads; two are free through your public library.
      </p>
      <p className="mt-3 leading-relaxed text-white/80">
        Want to skip straight to the movies? Browse our{" "}
        <Link href="/free-movies" className="underline">
          free movies
        </Link>{" "}
        page — every title there is free and legal to stream right now.
      </p>

      <ol className="mt-10 space-y-6">
        {SERVICES.map((s, i) => (
          <li key={s.name} className="rounded-lg border border-border bg-card/60 p-5">
            <h2 className="text-xl font-bold">
              {i + 1}. {s.name}
            </h2>
            <p className="mt-1 text-sm text-primary">{s.bestFor}</p>
            <p className="mt-3 leading-relaxed text-white/85">{s.text}</p>
            <p className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
              <span>{s.cost}</span>
              <a href={s.url} target="_blank" rel="noopener nofollow" className="font-semibold text-foreground underline">
                Visit {s.name}
              </a>
            </p>
          </li>
        ))}
      </ol>

      <AdSlot responsive className="my-10" />

      <h2 className="text-2xl font-bold">Why not 123movies, Fmovies or similar sites?</h2>
      <p className="mt-3 leading-relaxed text-white/80">
        Unlicensed streaming sites don&apos;t pay for the movies they host, so they make money from aggressive ad networks
        instead: fake “play” buttons, forced redirects and downloads. Their domains change constantly as they get taken
        down. The legal services above cost the same — nothing — without those risks, and in HD.
      </p>

      <div className="mt-10">
        <Faq items={FAQ} />
      </div>
    </article>
  );
}
