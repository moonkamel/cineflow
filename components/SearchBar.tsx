"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  value?: string;
  onChange?: (v: string) => void;
  autoFocus?: boolean;
  className?: string;
}

/**
 * Controlled (search page, live results) or uncontrolled (header: submits
 * to /search?q=). Debouncing lives in the consumer so typing stays instant.
 */
export function SearchBar({ value, onChange, autoFocus, className }: Props) {
  const router = useRouter();
  const [local, setLocal] = useState("");
  const controlled = value !== undefined;
  const q = controlled ? value : local;
  const set = (v: string) => (controlled ? onChange?.(v) : setLocal(v));

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        if (!controlled && q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
      }}
      className={cn("relative flex items-center", className)}
    >
      <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" aria-hidden />
      <input
        type="search"
        inputMode="search"
        enterKeyHint="search"
        value={q}
        onChange={(e) => set(e.target.value)}
        autoFocus={autoFocus}
        placeholder="Search movies & TV shows"
        aria-label="Search movies and TV shows"
        className="h-10 w-full rounded-md border border-border bg-black/50 pl-9 pr-9 text-sm outline-none ring-ring placeholder:text-muted-foreground focus:ring-2 [&::-webkit-search-cancel-button]:hidden"
      />
      {q && (
        <button type="button" onClick={() => set("")} aria-label="Clear search" className="absolute right-2 p-1 text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  );
}
