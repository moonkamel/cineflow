import type { Metadata } from "next";
import { BrowsePage, type BrowseSearchParams } from "@/components/BrowsePage";
import { pageMetadata } from "@/lib/seo";

type Props = { searchParams: Promise<BrowseSearchParams> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  return pageMetadata({
    title: "Browse TV Shows – Popular Series to Binge",
    description: "Browse the most popular and highest-rated TV series by genre and year, with trailers and US streaming availability.",
    path: "/tv-shows",
    noIndex: Object.values(sp).some(Boolean),
  });
}

export default async function TvShowsPage({ searchParams }: Props) {
  return (
    <BrowsePage
      type="tv"
      heading="TV Shows"
      intro="From prestige dramas to comfort sitcoms — filter by genre, year and rating."
      sp={await searchParams}
    />
  );
}
