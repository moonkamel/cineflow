"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  href?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Horizontal row with native CSS scroll-snap (GPU-friendly, works with touch,
 * trackpad and keyboard). Cards are passed as server-rendered children, so
 * this client component only ships the arrow logic.
 */
export function RowCarousel({ title, href, children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <section className={cn("group/row relative", className)} aria-label={title}>
      <div className="container mb-2 flex items-baseline justify-between">
        <h2 className="text-lg font-bold tracking-tight md:text-xl">{title}</h2>
        {href && (
          <Link href={href} className="text-sm text-muted-foreground hover:text-foreground">
            See all
          </Link>
        )}
      </div>
      <div className="relative">
        <button
          type="button"
          onClick={() => scroll(-1)}
          aria-label={`Scroll ${title} left`}
          className="absolute left-0 top-0 z-20 hidden h-full w-10 items-center justify-center bg-gradient-to-r from-background to-transparent opacity-0 transition-opacity group-hover/row:opacity-100 md:flex"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>
        <div
          ref={ref}
          className="no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth px-4 py-3 md:gap-3 md:px-8"
        >
          {children}
        </div>
        <button
          type="button"
          onClick={() => scroll(1)}
          aria-label={`Scroll ${title} right`}
          className="absolute right-0 top-0 z-20 hidden h-full w-10 items-center justify-center bg-gradient-to-l from-background to-transparent opacity-0 transition-opacity group-hover/row:opacity-100 md:flex"
        >
          <ChevronRight className="h-7 w-7" />
        </button>
      </div>
    </section>
  );
}

/** Wrapper that gives each child card its snap point and responsive width. */
export function RowItem({ children }: { children: React.ReactNode }) {
  return <div className="w-[38vw] shrink-0 snap-start sm:w-[24vw] md:w-[18vw] lg:w-[14vw] xl:w-[12vw]">{children}</div>;
}
