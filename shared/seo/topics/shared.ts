import { CONTENT_DATE, type InternationalPage, type Market, type PageSection } from "../types";
import { marketSources, topicSources } from "./sources";

export type FAQ = InternationalPage["faqs"][number];
export type Guide = {
  id: string;
  paths: Record<Market, string>;
  titles: Record<Market, { title: string; description: string; h1: string }>;
  summaries: Record<Market, string>;
  sections: Record<Market, PageSection[]>;
  faqs: Record<Market, FAQ[]>;
  relatedIds: string[];
  sourceKey: string;
};

export function buildTopicPages(guide: Guide): InternationalPage[] {
  return (["es", "en-us", "en-gb", "fr"] as Market[]).map((market) => ({
    id: guide.id,
    market,
    path: guide.paths[market],
    ...guide.titles[market],
    summary: guide.summaries[market],
    sections: guide.sections[market],
    faqs: guide.faqs[market],
    sources: [topicSources[guide.sourceKey][market], ...marketSources[market]],
    relatedIds: guide.relatedIds,
    kind: "Article" as const,
    publishedAt: CONTENT_DATE,
    updatedAt: CONTENT_DATE,
  }));
}
