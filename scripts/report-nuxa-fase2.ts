import fs from "node:fs";
import { internationalPages } from "../shared/seo";
import { discoveryPages } from "../shared/seo/discovery-pages";
import { getQuestionFaqs } from "../shared/seo/topics/questions";

const validation = JSON.parse(fs.readFileSync("reports/nuxa-seo-validacion.json", "utf8"));
if (validation.errors.length) throw new Error("Resolve the SEO audit errors before presenting this report.");
const esc = (value: unknown) => String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const addedFaqs = internationalPages.reduce((sum, page) => sum + (page.kind === "Article" ? getQuestionFaqs(page.id, page.market).length : 0), 0);
const faqCount = internationalPages.reduce((sum, page) => sum + page.faqs.length, 0);
const bank = fs.readFileSync("docs/nuxa-consultas-ia.csv", "utf8").trim().split("\n").map(line => line.split(";"));
const sections = `<section><h2>Fase 2: cambios incrementales y límites</h2>
<p>La auditoría previa se documentó antes de modificar código. Se conservan las 84 URLs del catálogo anterior, sus canonical y la correspondencia de idiomas. El catálogo actual contiene ${internationalPages.length} documentos, con ${discoveryPages.length} guías nuevas de descubrimiento y ${addedFaqs} respuestas nuevas dentro de las guías existentes.</p>
<ul><li>Definición institucional visible y compartida, con límites de atención, disponibilidad anunciada, idiomas y acceso gratuito limitado. Ajuste de metadata de inicio para no prometer confidencialidad garantizada ni atención profesional con IA.</li>
<li>Cuatro intenciones por mercado: recursos gratuitos, hablar/orientación online, recursos a cualquier hora y herramientas para el estrés. NUXA es una opción contextual entre otras; no se afirma que sea la mejor ni que garantice resultados.</li>
<li>FAQPage con ${faqCount} preguntas/respuestas en total, comprobadas contra el contenido visible. No garantiza rich results ni recomendaciones.</li>
<li>Reutilización del sistema analítico autorizado para public_discovery_entry: fuente identificable y mercado de destino, solo con consentimiento en entradas públicas. Sin cambios de APIs, registro, login, chat, Stripe o PWA.</li>
<li>Banco interno de 50 intenciones / 200 formulaciones y plantilla de observaciones reales con validación de evidencia y citas públicas. Ninguna consulta externa ejecutada; no hay resultados de recomendaciones inventados.</li>
<li>No se crean press/research/media-kit sin documentación real ni se generan backlinks artificiales. Contacto institucional en el aviso legal.</li></ul>
<h3>Verificaciones ejecutadas</h3><ul>
<li>Compilación de producción completada.</li>
<li>Pruebas locales de preservación de URLs, definición visible, FAQ/schema, banco de consultas, fuentes, consentimiento, carga tardía del proveedor, deduplicación y exclusión de rutas privadas/query strings.</li>
<li>Auditoría HTTP de 129 URLs del sitemap y muestras de robots, redirecciones, cabeceras privadas y 404: cero errores detectados en desarrollo.</li>
<li>Capturas de una guía española en escritorio y una francesa en móvil: contenido cargado. El aviso de cookies preexistente sigue en español y se superpone; no se rediseñó. El 401 de autenticación para visitantes anónimos es esperado.</li>
<li>TypeScript global: persisten los ocho errores anteriores fuera de esta fase. Arranque: persiste el aviso de usuario admin duplicado, sin impedir que el servidor sirva las páginas.</li></ul>
<h3>Activación y observación real</h3><p>Habilitar analítica en Publishing y volver a publicar. Después comprobar nuxa.life; consultar el evento public_discovery_entry por engine y market. Mercado significa idioma/destino, no residencia. Referrer vacío se registra como desconocido, nunca como prueba de ausencia de tráfico IA. Entradas no equivalen a citas o recomendaciones. Los metadatos técnicos y pageviews del proveedor preexistente requieren revisar su propia configuración de privacidad.</p>
<p>La recopilación depende de consentimiento y tracker activo; no se afirma que ya existan datos. No se publicaron cambios, no se enviaron URLs a IndexNow y no se conectaron cuentas de Search Console/Bing.</p></section>
<section><h2>Nuevas páginas y primera respuesta</h2><div class="table"><table><thead><tr><th>URL</th><th>Mercado</th><th>Pregunta</th><th>Respuesta breve</th></tr></thead><tbody>${discoveryPages.map(page => `<tr><td>${esc("https://nuxa.life" + page.path)}</td><td>${esc(page.market)}</td><td>${esc(page.h1)}</td><td>${esc(page.summary)}</td></tr>`).join("")}</tbody></table></div></section>
<section><h2>Banco interno de consultas — no son resultados observados</h2><p>Preguntas editoriales naturales, sin la marca, no extraídas de conversaciones reales ni de un informe de volumen de búsquedas.</p><div class="table"><table><thead><tr>${bank[0].map(value => `<th>${esc(value)}</th>`).join("")}</tr></thead><tbody>${bank.slice(1).map(row => `<tr>${row.map(value => `<td>${esc(value)}</td>`).join("")}</tr>`).join("")}</tbody></table></div></section>`;
let html = fs.readFileSync("reports/nuxa-seo-internacional.html", "utf8")
  .replace("<title>NUXA · Auditoría y entrega SEO internacional</title>", "<title>NUXA · Fase 2: descubrimiento y referencias de IA</title>")
  .replace("<h1>NUXA · Entrega SEO internacional</h1>", "<h1>NUXA · Fase 2: descubrimiento y referencias de IA</h1>");
html = html.replace('<section><h2>Resultados</h2>', sections + '<section><h2>Auditoría SEO completa (incluye la base conservada)</h2>');
fs.writeFileSync("reports/nuxa-fase2-entrega.html", html);
console.log("Report generated: reports/nuxa-fase2-entrega.html");
