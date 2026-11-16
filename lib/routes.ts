import type { MediaSummary, MediaType } from "./types";
import { mediaTypeOf, titleOf } from "./types";
import { slugify } from "./utils";

/** Canonical title URL: /movie/12345-the-dark-knight */
export const titlePath = (type: MediaType, id: number, title: string) => `/${type}/${id}-${slugify(title)}`;
export const watchPath = (type: MediaType, id: number, title: string) => `/watch/${type}/${id}-${slugify(title)}`;
export const pathFor = (m: MediaSummary) => titlePath(mediaTypeOf(m), m.id, titleOf(m));
