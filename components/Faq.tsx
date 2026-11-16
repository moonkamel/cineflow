import { JsonLd } from "./JsonLd";

export interface FaqItem {
  q: string;
  a: string;
}

/**
 * Visible Q&A + FAQPage JSON-LD. Since 2023 Google only shows FAQ rich
 * results for a few authoritative sites, but the visible questions still
 * match long-tail queries ("is X on netflix") word for word, which is the
 * main point here. The markup also helps other engines and AI answers.
 */
export function Faq({ items, heading = "Frequently asked questions" }: { items: FaqItem[]; heading?: string }) {
  if (!items.length) return null;
  return (
    <section aria-labelledby="faq-heading">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
        }}
      />
      <h2 id="faq-heading" className="mb-4 text-xl font-bold">
        {heading}
      </h2>
      <dl className="divide-y divide-border rounded-lg border border-border bg-card/60">
        {items.map((i) => (
          <div key={i.q} className="p-4 md:p-5">
            <dt className="font-semibold">{i.q}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-white/80">{i.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
