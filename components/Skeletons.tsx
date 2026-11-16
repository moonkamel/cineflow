import { Skeleton } from "./ui/skeleton";

export function RowSkeleton() {
  return (
    <div className="space-y-2 py-3" aria-hidden>
      <div className="container">
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="flex gap-3 overflow-hidden px-4 md:px-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[2/3] w-[38vw] shrink-0 sm:w-[24vw] md:w-[18vw] lg:w-[14vw] xl:w-[12vw]" />
        ))}
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 18 }: { count?: number }) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:gap-3 lg:grid-cols-6" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="aspect-[2/3]" />
      ))}
    </div>
  );
}
