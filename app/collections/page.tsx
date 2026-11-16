import type { Metadata } from "next";
import { CollectionCards } from "@/components/CollectionCards";
import { collectionsIn, SECTION_LABELS, type CollectionSection } from "@/lib/collections";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "What to Watch: Best Movie & TV Show Lists",
  description: "Hand-picked lists of the best movies and TV shows by genre, streaming service and season — plus free movies you can watch legally.",
  path: "/collections",
});

const ORDER: CollectionSection[] = ["seasonal", "free", "platform", "genre"];

export default function CollectionsPage() {
  return (
    <div className="container pt-24 md:pt-28">
      <h1 className="text-3xl font-black md:text-5xl">What to Watch</h1>
      <p className="mt-3 max-w-2xl text-white/80">Curated, always-up-to-date lists to help you pick tonight&apos;s movie or your next binge.</p>
      {ORDER.map((section) => (
        <section key={section} className="mt-10" aria-labelledby={`s-${section}`}>
          <h2 id={`s-${section}`} className="mb-4 text-xl font-bold">
            {SECTION_LABELS[section]}
          </h2>
          <CollectionCards items={collectionsIn(section)} />
        </section>
      ))}
    </div>
  );
}
