/**
 * Auto-generated title FAQ from US watch-provider data. Questions mirror the
 * exact phrasing people search ("is wicked on netflix", "where to watch dune",
 * "is X free to watch").
 */
import type { FaqItem } from "@/components/Faq";
import type { WatchProvider, WatchProviderRegion } from "./types";

/** Provider names in TMDB's display order, minus "X Amazon Channel" add-on duplicates, capped for readability. */
const names = (list?: WatchProvider[]) =>
  [
    ...new Set(
      [...(list ?? [])]
        .sort((a, b) => a.display_priority - b.display_priority)
        .map((p) => p.provider_name)
        .filter((n) => !/ (Amazon|Apple TV|Roku Premium) Channel$/i.test(n)),
    ),
  ].slice(0, 4);

function joinNames(n: string[]): string {
  if (n.length <= 1) return n[0] ?? "";
  return `${n.slice(0, -1).join(", ")} and ${n[n.length - 1]}`;
}

export function titleFaq(title: string, kind: "movie" | "show", region?: WatchProviderRegion, seasons?: number): FaqItem[] {
  const stream = names(region?.flatrate);
  const free = [...new Set([...names(region?.free), ...names(region?.ads)])];
  const rent = names(region?.rent);
  const buy = names(region?.buy);
  const onNetflix = stream.some((n) => n.toLowerCase() === "netflix");
  const items: FaqItem[] = [];

  items.push({
    q: `Where can I watch ${title}?`,
    a: stream.length
      ? `${title} is streaming in the US on ${joinNames(stream)}.${free.length ? ` It's also free with ads on ${joinNames(free)}.` : ""}`
      : free.length
        ? `${title} is available to watch free with ads in the US on ${joinNames(free)}.`
        : rent.length || buy.length
          ? `${title} isn't included with a US subscription right now, but you can rent or buy it digitally${rent.length ? ` on ${joinNames(rent.slice(0, 4))}` : ""}.`
          : `${title} isn't available on a US streaming service right now. Availability changes often — check back soon.`,
  });

  items.push({
    q: `Is ${title} on Netflix?`,
    a: onNetflix
      ? `Yes — ${title} is currently streaming on Netflix in the US.`
      : `No, ${title} is not on Netflix in the US right now.${stream.length ? ` You can stream it on ${joinNames(stream)} instead.` : ""}`,
  });

  items.push({
    q: `Can I watch ${title} for free?`,
    a: free.length
      ? `Yes. ${title} is free to watch legally in the US on ${joinNames(free)}, which are ad-supported and don't require a subscription.`
      : `Not at the moment. ${title} isn't on a free, legal US service right now.${stream.length ? ` Some subscription services such as ${joinNames(stream.slice(0, 2))} offer free trials.` : ""} Browse our free movies page for titles you can watch at no cost.`,
  });

  if (rent.length || buy.length) {
    items.push({
      q: `Can I rent or buy ${title}?`,
      a: [
        rent.length ? `You can rent ${title} on ${joinNames(rent.slice(0, 5))}.` : "",
        buy.length ? `You can buy it digitally on ${joinNames(buy.slice(0, 5))}.` : "",
      ]
        .filter(Boolean)
        .join(" "),
    });
  }

  if (kind === "show" && seasons) {
    items.push({
      q: `How many seasons of ${title} are there?`,
      a: `${title} has ${seasons} season${seasons === 1 ? "" : "s"} so far.`,
    });
  }
  return items;
}
