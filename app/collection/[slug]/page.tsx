import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { MediaGrid } from "@/components/MediaGrid";
import { AdSlot } from "@/components/ads/AdSlot";
import { COLLECTIONS, getCollection } from "@/lib/collections";
import { absoluteUrl } from "@/lib/site";
import { pathFor } from "@/lib/routes";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { loadCollectionItems } from "@/lib/collection-data";
import { titleOf } from "@/lib/types";

export const revalidate = 86400;
export const dynamicParams = false;
export const generateStaticParams = () => COLLECTIONS.map((c) => ({ slug: c.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getCollection((await params).slug);
  if (!c) return {};
  return pageMetadata({ title: c.title, description: c.description, path: `/collection/${c.slug}` });
}

export default async function CollectionPage({ params }: Props) {
  const c = getCollection((await params).slug);
  if (!c) notFound();

  const items = await loadCollectionItems(c);

  // ItemList → eligible for Google's carousel rich result
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: c.title,
    itemListElement: items.slice(0, 20).map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(pathFor(m)),
      name: titleOf(m),
    })),
  };

  return (
    <div className="container pt-24 md:pt-28">
      <JsonLd data={itemList} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Collections", path: "/collections" }, { name: c.title, path: `/collection/${c.slug}` }])} />

      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link href="/collections" className="hover:text-foreground">
          Collections
        </Link>{" "}
        / <span className="text-foreground">{c.title}</span>
      </nav>
      <header className="mt-4 max-w-3xl">
        <h1 className="text-3xl font-black tracking-tight md:text-5xl">{c.title}</h1>
        {c.intro.map((p) => (
          <p key={p.slice(0, 20)} className="mt-4 leading-relaxed text-white/80">
            {p}
          </p>
        ))}
      </header>

      {c.section === "free" || c.slug.startsWith("free-") ? (
        <p className="mt-4 text-sm text-muted-foreground">
          All titles are available free on legal, ad-supported US services.{" "}
          <Link href="/free-streaming-sites" className="underline hover:text-foreground">
            See the best free streaming sites
          </Link>
          .
        </p>
      ) : null}

      <div className="mt-8">
        {items.length ? <MediaGrid items={items.slice(0, 18)} /> : <p className="text-muted-foreground">This list is updating — check back shortly.</p>}
      </div>
      {items.length > 18 && (
        <>
          <AdSlot responsive className="my-8" />
          <MediaGrid items={items.slice(18)} priorityCount={0} />
        </>
      )}
    </div>
  );
}
