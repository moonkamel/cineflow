import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** "The Dark Knight" -> "the-dark-knight" */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Parses "12345-the-dark-knight" (or "12345") into 12345. Returns null if invalid. */
export function parseIdParam(param: string): number | null {
  const id = Number.parseInt(param.split("-")[0] ?? "", 10);
  return Number.isFinite(id) && id > 0 ? id : null;
}

export function formatRuntime(minutes?: number | null): string | null {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}

export function yearOf(date?: string | null): string | null {
  return date ? date.slice(0, 4) : null;
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
}
