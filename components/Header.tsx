import Link from "next/link";
import { Search } from "lucide-react";
import { SITE_NAME } from "@/lib/site";
import { SearchBar } from "./SearchBar";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/tv-shows", label: "TV Shows" },
  { href: "/collections", label: "Collections" },
];

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-black/90 to-transparent">
      <div className="container flex h-16 items-center gap-6">
        <Link href="/" className="text-2xl font-black tracking-tighter text-primary" aria-label={`${SITE_NAME} home`}>
          {SITE_NAME.toUpperCase()}
        </Link>
        <nav aria-label="Main" className="hidden gap-5 text-sm md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-white/80 transition-colors hover:text-white">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <SearchBar className="hidden w-64 md:flex" />
          <Link href="/search" aria-label="Search" className="p-2 md:hidden">
            <Search className="h-5 w-5" />
          </Link>
        </div>
      </div>
      {/* Mobile nav */}
      <nav aria-label="Mobile" className="no-scrollbar container flex gap-4 overflow-x-auto pb-2 text-sm md:hidden">
        {NAV.slice(1).map((n) => (
          <Link key={n.href} href={n.href} className="shrink-0 rounded-full border border-white/30 px-3 py-1 text-white/90">
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
