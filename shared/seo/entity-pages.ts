import { CONTENT_DATE, type InternationalPage, type Market } from "./types";
import { esPages } from "./entities/es";
import { enUsPages } from "./entities/en-us";
import { enGbPages } from "./entities/en-gb";
import { frPages } from "./entities/fr";

const pages: Record<Market, typeof esPages> = {
  es: esPages,
  "en-us": enUsPages,
  "en-gb": enGbPages,
  fr: frPages,
};

const marketPrefixes: Record<Market, string> = {
  es: "/es",
  "en-us": "/en-us",
  "en-gb": "/en-gb",
  fr: "/fr",
};

export const entityPages: InternationalPage[] = (
  Object.entries(pages) as [Market, (typeof esPages)][]
).flatMap(([market, drafts]) =>
  drafts.map((draft) => ({
    ...draft,
    market,
    path: draft.id === "home" ? `${marketPrefixes[market]}/` : `${marketPrefixes[market]}/${draft.id}`,
    publishedAt: CONTENT_DATE,
    updatedAt: "2026-10-05",
  })),
);
