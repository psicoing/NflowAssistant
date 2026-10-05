import React from "react";

function safeUrl(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[character]!));

// Used before DOMPurify by the existing classic/bubble formatters.
export function linkifyCitations(html: string): string {
  // Raw anchors were not allowed by the previous formatter. Keep that boundary:
  // only this converter creates anchors; DOMPurify still sanitizes the result.
  return html.replace(/<\/?a\b[^>]*>/gi, "").replace(/\[([^\]\n]+)\]\((https:\/\/[^\s)]+)\)/g, (original, label: string, url: string) => {
    const href = safeUrl(url);
    return href
      ? `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer" class="underline underline-offset-2 break-words">${escapeHtml(label)}</a>`
      : original;
  });
}

// The brief mode remains plain text, except for actual clickable source links.
export function CitationText({ content }: { content: string }) {
  const expression = /\[([^\]\n]+)\]\((https:\/\/[^\s)]+)\)/g;
  const nodes: React.ReactNode[] = [];
  let position = 0;
  for (const match of Array.from(content.matchAll(expression))) {
    const index = match.index!;
    nodes.push(content.slice(position, index));
    const href = safeUrl(match[2]);
    nodes.push(href
      ? <a key={index} href={href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 break-words">{match[1]}</a>
      : match[0]);
    position = index + match[0].length;
  }
  nodes.push(content.slice(position));
  return <>{nodes}</>;
}
