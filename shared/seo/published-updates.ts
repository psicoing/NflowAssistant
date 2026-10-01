import { blogSeoEntries } from "./blog";
import { CONTENT_DATE } from "./types";

/** Canonical legacy documents whose public editorial content changed in this
 * release, shared by sitemap dates and the explicit IndexNow allowlist. */
export const updatedLegacySeoPages = [
  { path: "/", updatedAt: CONTENT_DATE },
  { path: "/blog", updatedAt: CONTENT_DATE },
  ...blogSeoEntries.map(post => ({ path: `/blog/${post.id}`, updatedAt: post.updatedIso })),
];