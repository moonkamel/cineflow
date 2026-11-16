import type { Metadata } from "next";
import { BrowsePage, type BrowseSearchParams } from "@/components/BrowsePage";
import { pageMetadata } from "@/lib/seo";

type Props = { searchParams: Promise<BrowseSearchParams> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const filtered = Object.values(sp).some(Boolean);
  return pageMetadata({
    title: "Browse Movies – Popular, Top Rated & New Releases",
    description: "Browse thousands of movies by genre, year and rating. Watch trailers and find where to stream each movie in the US.",
    path: "/movies",
    noIndex: filtered, // filter permutations = near-duplicate pages
  });
}

export default async function MoviesPage({ searchParams }: Props) {
  return (
    <BrowsePage
      type="movie"
      heading="Movies"
      intro="Filter by genre, year and rating to find your next movie night pick."
      sp={await searchParams}
    />
  );
}
