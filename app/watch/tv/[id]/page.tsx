type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ s?: string; e?: string }>;
};

export default async function WatchTvPage({ params, searchParams }: Props) {
  const raw = (await params).id;
  const { s, e } = await searchParams;
  const id = parseIdParam(raw);
  if (!id) notFound();
  const tv = await loadTv(id);

  const season = Number(s) || 1;
  const episode = Number(e) || 1;

  return (
    <WatchView
      // ...tes props existantes
      videos={tv.videos}
      videoMeta={{ tmdbId: tv.id, type: "tv", season, episode }}
      // ...
    />
  );
}
