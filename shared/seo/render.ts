import { getPageById, getRelatedPages, internationalPages, markets, SEO_SITE_URL } from "./index";
import type { InternationalPage, Market } from "./types";

const marketOrder: Market[] = ["es", "en-us", "en-gb", "fr"];

const copy: Record<Market, {
  home: string; navAbout: string; navHow: string; navGuide: string; navOrgs: string;
  skip: string; breadcrumb: string; languages: string; about: string; how: string;
  wellbeing: string; organizations: string; safety: string; privacy: string;
  science: string; editorial: string; professionals: string; legal: string;
  app: string; appDescription: string; crisis: string; limits: string; sources: string;
  related: string; questions: string; published: string; updated: string; browse: string;
}> = {
  es: {
    home: "NUXA", navAbout: "Sobre NUXA", navHow: "Cómo funciona", navGuide: "Guía de bienestar", navOrgs: "Organizaciones",
    skip: "Saltar al contenido", breadcrumb: "Inicio", languages: "Ver esta página en",
    about: "Sobre NUXA", how: "Cómo funciona", wellbeing: "Guía de bienestar", organizations: "Para organizaciones",
    safety: "Seguridad y límites", privacy: "Privacidad", science: "Ciencia y fuentes", editorial: "Política editorial",
    professionals: "Para profesionales", legal: "Aviso legal", app: "Probar NUXA", appDescription: "Una herramienta de orientación para reflexionar, no atención sanitaria.",
    crisis: "Si hay peligro inmediato o una urgencia médica, contacta con los servicios de emergencia de tu zona.",
    limits: "NUXA ofrece orientación psicoeducativa para ayudar a ordenar ideas. No es un servicio clínico: no diagnostica, no sustituye la atención profesional y no ofrece atención de urgencia.",
    sources: "Fuentes consultadas", related: "Sigue leyendo", questions: "Preguntas frecuentes", published: "Publicado", updated: "Actualizado", browse: "Explora NUXA",
  },
  "en-us": {
    home: "NUXA", navAbout: "About NUXA", navHow: "How it works", navGuide: "Well-being guide", navOrgs: "Organizations",
    skip: "Skip to content", breadcrumb: "Home", languages: "Read this page in",
    about: "About NUXA", how: "How it works", wellbeing: "Well-being guide", organizations: "For organizations",
    safety: "Safety and limits", privacy: "Privacy", science: "Science and sources", editorial: "Editorial policy",
    professionals: "For professionals", legal: "Legal notice", app: "Try NUXA", appDescription: "A reflective guidance tool, not healthcare.",
    crisis: "If there is immediate danger or a medical emergency, contact local emergency services.",
    limits: "NUXA offers psychoeducational guidance to help organize your thoughts. It is not a clinical service: it does not diagnose, replace professional care, or provide emergency support.",
    sources: "Sources", related: "Keep reading", questions: "Frequently asked questions", published: "Published", updated: "Updated", browse: "Explore NUXA",
  },
  "en-gb": {
    home: "NUXA", navAbout: "About NUXA", navHow: "How it works", navGuide: "Wellbeing guide", navOrgs: "Organisations",
    skip: "Skip to content", breadcrumb: "Home", languages: "Read this page in",
    about: "About NUXA", how: "How it works", wellbeing: "Wellbeing guide", organizations: "For organisations",
    safety: "Safety and limits", privacy: "Privacy", science: "Science and sources", editorial: "Editorial policy",
    professionals: "For professionals", legal: "Legal notice", app: "Try NUXA", appDescription: "A reflective guidance tool, not healthcare.",
    crisis: "If there is immediate danger or a medical emergency, contact local emergency services.",
    limits: "NUXA offers psychoeducational guidance to help organise your thoughts. It is not a clinical service: it does not diagnose, replace professional care, or provide emergency support.",
    sources: "Sources", related: "Keep reading", questions: "Frequently asked questions", published: "Published", updated: "Updated", browse: "Explore NUXA",
  },
  fr: {
    home: "NUXA", navAbout: "À propos de NUXA", navHow: "Comment ça marche", navGuide: "Guide du bien-être", navOrgs: "Organisations",
    skip: "Aller au contenu", breadcrumb: "Accueil", languages: "Lire cette page en",
    about: "À propos de NUXA", how: "Comment ça marche", wellbeing: "Guide du bien-être", organizations: "Pour les organisations",
    safety: "Sécurité et limites", privacy: "Confidentialité", science: "Science et sources", editorial: "Politique éditoriale",
    professionals: "Pour les professionnels", legal: "Mentions légales", app: "Essayer NUXA", appDescription: "Un outil d'accompagnement à la réflexion, pas un service de soins.",
    crisis: "En cas de danger immédiat ou d'urgence médicale, contactez les services d'urgence de votre région.",
    limits: "NUXA propose un accompagnement psychoéducatif pour clarifier ses idées. Ce n'est pas un service clinique : NUXA ne pose pas de diagnostic, ne remplace pas les soins professionnels et ne prend pas en charge les urgences.",
    sources: "Sources", related: "Pour aller plus loin", questions: "Questions fréquentes", published: "Publié le", updated: "Mis à jour le", browse: "Explorer NUXA",
  },
};

function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character] as string);
}

function safeHref(value: string): string {
  const href = String(value || "").trim();
  if (!/[\u0000-\u0020]/.test(href) && (/^https?:\/\/[^/]/i.test(href) || (href.startsWith("/") && !href.startsWith("//")))) return href;
  return "#";
}

function safeInternalPath(value: string): string {
  const path = String(value || "");
  return path.startsWith("/") && !path.startsWith("//") && !/[\\\u0000-\u001f]/.test(path) ? path : "/";
}

function pageLink(id: string, market: Market, fallback: string): string {
  return safeInternalPath(getPageById(id, market)?.path || fallback);
}

function sectionId(value: string, index: number): string {
  const slug = value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `section-${slug || "content"}-${index + 1}`;
}

function navLink(id: string, market: Market, label: string, fallback: string): string {
  return `<a href="${escapeHtml(pageLink(id, market, fallback))}">${escapeHtml(label)}</a>`;
}

function renderArticle(page: InternationalPage, labels: typeof copy[Market]): string {
  const sections = page.sections.map((section, index) => {
    const id = sectionId(section.heading, index);
    const paragraphs = section.paragraphs.map(text => `<p>${escapeHtml(text)}</p>`).join("");
    const bullets = section.bullets?.length
      ? `<ul>${section.bullets.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : "";
    return `<section class="nuxa-section" aria-labelledby="${id}"><h2 id="${id}">${escapeHtml(section.heading)}</h2>${paragraphs}${bullets}</section>`;
  }).join("");
  const faqs = page.faqs.length
    ? `<section class="nuxa-faqs" aria-labelledby="nuxa-faq-heading"><h2 id="nuxa-faq-heading">${escapeHtml(labels.questions)}</h2>${page.faqs.map((faq, index) => {
      const id = `faq-${index + 1}`;
      return `<details><summary id="${id}">${escapeHtml(faq.question)}</summary><p>${escapeHtml(faq.answer)}</p></details>`;
    }).join("")}</section>` : "";
  const sources = page.sources.length
    ? `<section class="nuxa-sources" aria-labelledby="nuxa-source-heading"><h2 id="nuxa-source-heading">${escapeHtml(labels.sources)}</h2><ul class="nuxa-source-list">${page.sources.map(source => `<li><a href="${escapeHtml(safeHref(source.href))}" rel="noopener noreferrer">${escapeHtml(source.label)}</a></li>`).join("")}</ul></section>` : "";
  const related = getRelatedPages(page);
  const relatedHtml = related.length
     ? `<nav class="nuxa-related" aria-labelledby="nuxa-related-heading"><h2 id="nuxa-related-heading">${escapeHtml(labels.related)}</h2><ul class="nuxa-related-list">${related.map(item => `<li><a href="${escapeHtml(safeInternalPath(item.path))}">${escapeHtml(item.h1)}</a></li>`).join("")}</ul></nav>` : "";
  return `<div class="nuxa-article-body">${sections}</div>
    <aside class="nuxa-boundary" aria-label="${escapeHtml(labels.safety)}"><strong>${escapeHtml(labels.safety)}.</strong> ${escapeHtml(labels.limits)} ${escapeHtml(labels.crisis)}</aside>
    ${faqs}${sources}${relatedHtml}`;
}

function renderHub(page: InternationalPage): string {
  const pages = internationalPages.filter(candidate => candidate.market === page.market && candidate.id !== page.id);
  const labels = copy[page.market];
  return `<section class="nuxa-hub" aria-labelledby="nuxa-hub-heading"><h2 id="nuxa-hub-heading">${escapeHtml(labels.browse)}</h2><ul class="nuxa-hub-list">${pages.map(item => `<li><a href="${escapeHtml(safeInternalPath(item.path))}"><strong>${escapeHtml(item.h1)}</strong><span>${escapeHtml(item.description)}</span></a></li>`).join("")}</ul></section>
  `;
}

export function renderInternationalPage(page: InternationalPage): string {
  const labels = copy[page.market];
  const homePage = getPageById("home", page.market);
  const homeHref = safeInternalPath(homePage?.path || `/${page.market}`);
  const languages = marketOrder.map(market => {
    const variant = getPageById(page.id, market);
    return variant
      ? `<a href="${escapeHtml(safeInternalPath(variant.path))}"${market === page.market ? ' aria-current="page"' : ""}>${escapeHtml(markets[market].label)}</a>`
      : `<span aria-disabled="true">${escapeHtml(markets[market].label)}</span>`;
  }).join("");
  const breadcrumbs = page.id === "home"
    ? `<span aria-current="page">${escapeHtml(page.h1)}</span>`
    : `<a href="${escapeHtml(homeHref)}">${escapeHtml(homePage?.h1 || labels.home)}</a><span class="nuxa-breadcrumb-sep" aria-hidden="true">/</span><span aria-current="page">${escapeHtml(page.h1)}</span>`;
  const dateMeta = `<div class="nuxa-byline"><span><strong>NUXA · EMPORDAJOBS SL</strong></span>${page.kind === "Article" ? `<span>${escapeHtml(labels.published)} <time datetime="${escapeHtml(page.publishedAt)}">${escapeHtml(page.publishedAt)}</time></span><span>${escapeHtml(labels.updated)} <time datetime="${escapeHtml(page.updatedAt)}">${escapeHtml(page.updatedAt)}</time></span>` : ""}</div>`;
  const content = `${page.id === "home" ? renderHub(page) : ""}${renderArticle(page, labels)}`;
  const footerLinks = [
    ["safety", labels.safety, "/es/safety"],
    ["privacy", labels.privacy, "/es/privacy"],
    ["science", labels.science, "/es/science"],
    ["editorial-policy", labels.editorial, "/es/editorial-policy"],
    ["about-nuxa", labels.about, "/es/about-nuxa"],
    ["for-organizations", labels.organizations, "/es/for-organizations"],
    ["for-professionals", labels.professionals, "/es/for-professionals"],
  ].map(([id, label, fallback]) => navLink(id, page.market, label, fallback)).join("");
  const rootLabel = page.market === "fr" ? "Site principal" : page.market === "es" ? "Web principal" : "Main site";
  const blogLabel = page.market === "fr" ? "Blog et ressources" : page.market === "es" ? "Blog y recursos" : "Blog and resources";
  return `<div class="nuxa-international" lang="${escapeHtml(markets[page.market].language)}">
    <a class="nuxa-skip" href="#nuxa-main">${escapeHtml(labels.skip)}</a>
    <header class="nuxa-header"><div class="nuxa-header-inner">
      <a class="nuxa-brand" href="${escapeHtml(homeHref)}" aria-label="NUXA — ${escapeHtml(labels.home)}"><span class="nuxa-brand-mark" aria-hidden="true">N</span><span>NUXA</span></a>
      <nav class="nuxa-nav" aria-label="${escapeHtml(page.market === "fr" ? "Navigation principale" : page.market === "es" ? "Navegación principal" : "Main navigation")}">
        ${navLink("about-nuxa", page.market, labels.navAbout, "/es/about-nuxa")}
        ${navLink("how-nuxa-works", page.market, labels.navHow, "/es/how-nuxa-works")}
        ${navLink("wellbeing", page.market, labels.navGuide, "/es/bienestar-emocional")}
        ${navLink("for-organizations", page.market, labels.navOrgs, "/es/for-organizations")}
      </nav>
    </div></header>
    <main id="nuxa-main" class="nuxa-page"><div class="nuxa-reading">
      <nav class="nuxa-breadcrumbs" aria-label="${escapeHtml(page.market === "fr" ? "Fil d’Ariane" : page.market === "es" ? "Ruta de navegación" : "Breadcrumb")}">${breadcrumbs}</nav>
      <p class="nuxa-kicker">${escapeHtml(markets[page.market].country)} · NUXA</p>
      <h1>${escapeHtml(page.h1)}</h1>
      <p class="nuxa-summary">${escapeHtml(page.summary)}</p>
      ${dateMeta}
      <nav class="nuxa-locale-switch" aria-label="${escapeHtml(labels.languages)}">${languages}</nav>
      ${content}
    </div></main>
    <footer class="nuxa-footer"><div class="nuxa-footer-inner">
      <div class="nuxa-footer-top">
        <div class="nuxa-footer-brand"><a class="nuxa-brand" href="${escapeHtml(homeHref)}"><span class="nuxa-brand-mark" aria-hidden="true">N</span><span>NUXA</span></a><p>${escapeHtml(labels.appDescription)}</p></div>
        <nav class="nuxa-footer-links" aria-label="${escapeHtml(page.market === "fr" ? "Liens institutionnels" : page.market === "es" ? "Enlaces institucionales" : "Institutional links")}">
          ${footerLinks}<a href="/blog">${escapeHtml(blogLabel)}</a><a href="${escapeHtml(SEO_SITE_URL)}/legal/aviso-legal">${escapeHtml(labels.legal)}</a>
        </nav>
      </div>
      <div class="nuxa-footer-bottom"><span>© ${new Date().getFullYear()} NUXA · EMPORDAJOBS SL</span><span><a href="/prueba-gratis">${escapeHtml(labels.app)}</a><a href="/">${escapeHtml(rootLabel)}</a></span></div>
    </div></footer>
  </div>`;
}