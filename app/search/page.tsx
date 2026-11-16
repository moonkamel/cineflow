import type { Metadata } from "next";
import { SearchResults } from "./SearchResults";

// Internal search result pages are thin/duplicate content: keep them out of the index.
export const metadata: Metadata = {
  title: "Search Movies & TV Shows",
  robots: { index: false, follow: true },
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  return (
    <div className="container min-h-[70svh] pt-24 md:pt-28">
      <h1 className="sr-only">Search</h1>
      <SearchResults initialQuery={q} />
    </div>
  );
}
