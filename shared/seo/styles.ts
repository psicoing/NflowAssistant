export const internationalSeoCss = `
.nuxa-international {
  --nuxa-ink: #193044;
  --nuxa-muted: #536a78;
  --nuxa-paper: #f7f6f1;
  --nuxa-surface: #fffefa;
  --nuxa-line: #d9e1dc;
  --nuxa-teal: #176e6b;
  --nuxa-teal-deep: #125553;
  --nuxa-coral: #d87968;
  --nuxa-soft-teal: #e7f1ed;
  color: var(--nuxa-ink);
  background: var(--nuxa-paper);
  min-height: 100vh;
  min-height: 100dvh;
  font-family: "Aptos", "Segoe UI", system-ui, sans-serif;
  font-size: 1rem;
  line-height: 1.72;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
.nuxa-international *,
.nuxa-international *::before,
.nuxa-international *::after { box-sizing: border-box; }
.nuxa-international a { color: var(--nuxa-teal-deep); text-decoration-thickness: .08em; text-underline-offset: .18em; }
.nuxa-international a:hover { color: #984e42; }
.nuxa-international a:focus-visible,
.nuxa-international summary:focus-visible { outline: 3px solid var(--nuxa-coral); outline-offset: 4px; border-radius: 3px; }
.nuxa-international .nuxa-skip {
  position: absolute; z-index: 2; top: .75rem; left: .75rem; transform: translateY(-180%);
  padding: .65rem 1rem; color: #fff; background: var(--nuxa-ink); border-radius: 4px;
}
.nuxa-international .nuxa-skip:focus { transform: translateY(0); }
.nuxa-international .nuxa-header {
  background: var(--nuxa-surface);
  border-bottom: 1px solid var(--nuxa-line);
}
.nuxa-international .nuxa-header-inner,
.nuxa-international .nuxa-footer-inner {
  width: min(100% - 2.5rem, 1160px); margin-inline: auto;
}
.nuxa-international .nuxa-header-inner {
  min-height: 76px; display: flex; align-items: center; justify-content: space-between; gap: 1.25rem;
}
.nuxa-international .nuxa-brand {
  display: inline-flex; align-items: center; gap: .6rem; color: var(--nuxa-ink); text-decoration: none;
  font-weight: 750; letter-spacing: .13em; font-size: 1.04rem;
}
.nuxa-international .nuxa-brand-mark {
  display: grid; place-items: center; width: 34px; height: 34px; border-radius: 11px 11px 11px 3px;
  color: white; background: var(--nuxa-teal); font: 700 .82rem/1 "Aptos", "Segoe UI", system-ui, sans-serif;
  letter-spacing: .04em;
}
.nuxa-international .nuxa-nav { display: flex; align-items: center; justify-content: flex-end; gap: clamp(.7rem, 2vw, 1.7rem); flex-wrap: wrap; }
.nuxa-international .nuxa-nav a { font-size: .88rem; font-weight: 620; text-decoration: none; color: #385364; }
.nuxa-international .nuxa-nav a:hover { color: var(--nuxa-teal); text-decoration: underline; }
.nuxa-international .nuxa-page { width: min(100% - 2.5rem, 1160px); margin-inline: auto; }
.nuxa-international .nuxa-reading { width: min(100%, 760px); margin-inline: auto; padding: clamp(2.5rem, 6vw, 5.3rem) 0 5rem; }
.nuxa-international .nuxa-breadcrumbs { display: flex; gap: .55rem; align-items: center; margin: 0 0 2.35rem; color: var(--nuxa-muted); font-size: .82rem; }
.nuxa-international .nuxa-breadcrumbs a { color: var(--nuxa-muted); text-decoration: none; }
.nuxa-international .nuxa-breadcrumbs a:hover { text-decoration: underline; }
.nuxa-international .nuxa-breadcrumb-sep { color: #a5b2ad; }
.nuxa-international .nuxa-kicker {
  margin: 0 0 .9rem; color: var(--nuxa-teal); font-size: .76rem; line-height: 1.4;
  font-weight: 750; letter-spacing: .13em; text-transform: uppercase;
}
.nuxa-international h1,
.nuxa-international h2,
.nuxa-international h3 { color: var(--nuxa-ink); text-wrap: balance; }
.nuxa-international h1 {
  max-width: 900px; margin: 0; font-family: Georgia, "Times New Roman", serif;
  font-weight: 500; font-size: clamp(2.35rem, 6vw, 4.5rem); line-height: 1.08; letter-spacing: -.045em;
}
.nuxa-international .nuxa-summary {
  margin: 1.55rem 0 0; color: #385364; font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(1.16rem, 2.6vw, 1.4rem); line-height: 1.58;
}
.nuxa-international .nuxa-byline { display: flex; flex-wrap: wrap; gap: .5rem 1.1rem; margin-top: 1.45rem; color: var(--nuxa-muted); font-size: .84rem; }
.nuxa-international .nuxa-byline strong { color: var(--nuxa-ink); }
.nuxa-international .nuxa-locale-switch {
  display: flex; flex-wrap: wrap; gap: .55rem; margin: 2rem 0 0; padding: 1rem 0 0;
  border-top: 1px solid var(--nuxa-line);
}
.nuxa-international .nuxa-locale-switch a {
  padding: .35rem .7rem; border: 1px solid #cbd8d2; border-radius: 999px; background: var(--nuxa-surface);
  font-size: .78rem; font-weight: 650; text-decoration: none;
}
.nuxa-international .nuxa-locale-switch a[aria-current="page"] { background: var(--nuxa-soft-teal); border-color: #aac9bd; color: var(--nuxa-teal-deep); }
.nuxa-international .nuxa-article-body { margin-top: 3.5rem; }
.nuxa-international .nuxa-section { margin: 0 0 2.55rem; }
.nuxa-international .nuxa-section h2,
.nuxa-international .nuxa-faqs h2,
.nuxa-international .nuxa-sources h2,
.nuxa-international .nuxa-related h2,
.nuxa-international .nuxa-hub h2 {
  margin: 0 0 1rem; font-family: Georgia, "Times New Roman", serif; font-weight: 500;
  font-size: clamp(1.55rem, 3.5vw, 2rem); line-height: 1.22; letter-spacing: -.025em;
}
.nuxa-international .nuxa-section h2::before {
  content: ""; display: inline-block; width: 8px; height: 8px; margin: 0 .65rem .2rem 0;
  border-radius: 50%; background: var(--nuxa-coral);
}
.nuxa-international .nuxa-section p { margin: .85rem 0; color: #344d5c; }
.nuxa-international .nuxa-section ul { padding-left: 1.3rem; margin: .8rem 0 1rem; }
.nuxa-international .nuxa-section li { padding-left: .2rem; margin: .45rem 0; color: #344d5c; }
.nuxa-international .nuxa-section li::marker { color: var(--nuxa-teal); }
.nuxa-international .nuxa-boundary {
  margin: 2.8rem 0; padding: 1.15rem 1.35rem; border-left: 3px solid var(--nuxa-coral);
  background: #f0eee6; color: #3f5663; font-size: .93rem;
}
.nuxa-international .nuxa-boundary strong { color: var(--nuxa-ink); }
.nuxa-international .nuxa-faqs { margin-top: 3.5rem; padding-top: 2rem; border-top: 1px solid var(--nuxa-line); }
.nuxa-international .nuxa-faqs details { border-bottom: 1px solid var(--nuxa-line); }
.nuxa-international .nuxa-faqs summary { padding: 1rem .15rem; color: var(--nuxa-ink); font-weight: 650; cursor: pointer; }
.nuxa-international .nuxa-faqs details p { margin: -.1rem 0 1.15rem; color: #405867; }
.nuxa-international .nuxa-sources { margin-top: 3rem; }
.nuxa-international .nuxa-source-list { margin: 0; padding-left: 1.25rem; }
.nuxa-international .nuxa-source-list li { padding: .25rem 0 .25rem .2rem; overflow-wrap: anywhere; }
.nuxa-international .nuxa-source-list li::marker { color: var(--nuxa-coral); }
.nuxa-international .nuxa-related { margin-top: 3.5rem; padding-top: 2rem; border-top: 1px solid var(--nuxa-line); }
.nuxa-international .nuxa-related-list,
.nuxa-international .nuxa-hub-list {
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .8rem; padding: 0; list-style: none;
}
.nuxa-international .nuxa-related-list li,
.nuxa-international .nuxa-hub-list li { min-width: 0; }
.nuxa-international .nuxa-related-list a,
.nuxa-international .nuxa-hub-list a {
  display: block; height: 100%; padding: 1rem 1.05rem; border: 1px solid var(--nuxa-line); border-radius: 5px;
  background: var(--nuxa-surface); color: var(--nuxa-ink); text-decoration: none;
}
.nuxa-international .nuxa-related-list a:hover,
.nuxa-international .nuxa-hub-list a:hover { border-color: #9ebfb2; background: var(--nuxa-soft-teal); }
.nuxa-international .nuxa-related-list strong,
.nuxa-international .nuxa-hub-list strong { display: block; margin-bottom: .3rem; font-size: .97rem; }
.nuxa-international .nuxa-hub-list span { display: block; color: var(--nuxa-muted); font-size: .88rem; line-height: 1.5; }
.nuxa-international .nuxa-hub-intro { max-width: 680px; color: #405867; }
.nuxa-international .nuxa-footer { border-top: 1px solid var(--nuxa-line); background: #edf1ec; }
.nuxa-international .nuxa-footer-inner { padding: 2.2rem 0 1.4rem; }
.nuxa-international .nuxa-footer-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 2rem; }
.nuxa-international .nuxa-footer-brand p { max-width: 335px; margin: .6rem 0; color: var(--nuxa-muted); font-size: .87rem; }
.nuxa-international .nuxa-footer-links { display: flex; flex-wrap: wrap; gap: .55rem 1.1rem; max-width: 600px; }
.nuxa-international .nuxa-footer-links a { color: #385364; font-size: .84rem; }
.nuxa-international .nuxa-footer-bottom {
  display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .7rem;
  margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #d5ded8; color: var(--nuxa-muted); font-size: .78rem;
}
.nuxa-international .nuxa-footer-bottom a { margin-left: .9rem; }
@media (max-width: 700px) {
  .nuxa-international .nuxa-header-inner { width: min(100% - 2rem, 1160px); align-items: flex-start; flex-direction: column; justify-content: center; gap: .45rem; padding: .85rem 0; }
  .nuxa-international .nuxa-nav { justify-content: flex-start; gap: .35rem 1rem; }
  .nuxa-international .nuxa-nav a { font-size: .82rem; }
  .nuxa-international .nuxa-page,
  .nuxa-international .nuxa-footer-inner { width: min(100% - 2rem, 1160px); }
  .nuxa-international .nuxa-reading { padding-top: 2rem; }
  .nuxa-international .nuxa-breadcrumbs { margin-bottom: 1.65rem; }
  .nuxa-international .nuxa-article-body { margin-top: 2.5rem; }
  .nuxa-international .nuxa-related-list,
  .nuxa-international .nuxa-hub-list { grid-template-columns: 1fr; }
  .nuxa-international .nuxa-footer-top { flex-direction: column; gap: 1.25rem; }
}
`;