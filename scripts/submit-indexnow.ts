import { internationalPages, SEO_SITE_URL, getInternationalPage } from "../shared/seo";
import { INDEXNOW_KEY } from "../shared/seo/indexnow";
import { updatedLegacySeoPages } from "../shared/seo/published-updates";

// Invoke explicitly AFTER publishing. Default is dry-run; no URL is submitted
// merely because the server starts or the application is built.
const args = process.argv.slice(2);
const submit = args.includes("--submit");
const requested = args.filter(arg => !arg.startsWith("--"));
const publicPaths = new Set([
  ...internationalPages.map(page => page.path),
  ...updatedLegacySeoPages.map(page => page.path),
]);
const paths = requested.length ? requested : [...publicPaths];
for (const pathname of paths) {
  if (!publicPaths.has(pathname)) throw new Error(`Not a published public canonical URL: ${pathname}`);
}
const urlList = paths.map(pathname => SEO_SITE_URL + pathname);
const payload = {
  host: new URL(SEO_SITE_URL).hostname,
  key: INDEXNOW_KEY,
  keyLocation: `${SEO_SITE_URL}/${INDEXNOW_KEY}.txt`,
  urlList,
};
if (!submit) {
  console.log(JSON.stringify({ mode: "dry-run", ...payload }, null, 2));
  console.log("After publishing: npx tsx scripts/submit-indexnow.ts --submit");
} else {
  const keyResponse = await fetch(payload.keyLocation, { signal: AbortSignal.timeout(15000) });
  if (!keyResponse.ok || (await keyResponse.text()).trim() !== INDEXNOW_KEY) {
    throw new Error("Production ownership-verification key is not published. Publish before submitting.");
  }
  // Detect stale deployments, wrong hosts, redirects or private pages first.
  for (const url of urlList) {
    const response = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(20000) });
    const html = await response.text();
    if (response.status !== 200 || !html.includes(`rel="canonical" href="${url}"`) ||
        response.headers.get("x-robots-tag")?.includes("noindex")) {
      throw new Error(`URL is not live/canonical/indexable: ${url} (${response.status})`);
    }
    const pathname = new URL(url).pathname;
    if (getInternationalPage(pathname) && !html.includes("nuxa-international")) {
      throw new Error(`New content is not published: ${url}`);
    }
  }
  const result = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(20000),
  });
  if (![200, 202].includes(result.status)) {
    throw new Error(`IndexNow rejected submission (${result.status}): ${await result.text()}`);
  }
  console.log(`IndexNow accepted ${urlList.length} public URLs (${result.status}). Acceptance is not a guarantee of indexing.`);
}