# NUXA — Auditoría previa de la fase 2

Fecha: 5 de octubre de 2026. Entorno: repositorio y servidor de desarrollo,
no comprobación de indexación ni de recomendaciones en producción.

## Ya implementado: conservar

- 84 documentos editoriales: nueve páginas institucionales y doce guías por
  mercado. España, EEUU, Reino Unido y Francia; equivalencias recíprocas y
  x-default español. No cambiar las URLs existentes.
- Las ocho páginas de confianza solicitadas existen en los cuatro mercados.
  Los nombres sin prefijo redirigen a las páginas españolas, sin duplicarlas.
- HTML principal persistente, enlaces, H1 y metadatos sin ejecutar JavaScript.
  Muestra previa comprobada: `/en-us/anxiety`.
- Organization centralizada; WebSite, WebPage/AboutPage, Article,
  BlogPosting y BreadcrumbList. Fuentes y atribución institucional, no clínica.
- Sitemap dinámico, robots, llms, noindex de zonas funcionales y privadas.
  Googlebot/Bingbot/OAI-SearchBot no necesitan una política de entrenamiento.
- Acceso gratuito anunciado con límites en `/prueba-gratis`: cinco consultas,
  sujeto a condiciones/disponibilidad. No convertirlo en servicio gratuito
  ilimitado ni modificar el formulario.
- Adaptador de eventos con consentimiento; acceso autorizado a analítica
  confirmado. Esto no acredita que el tracker esté habilitado en producción.

## Carencias que se implementarán incrementalmente

1. Una definición institucional compartida, visible y consistente con schema,
   incluyendo idiomas, disponibilidad declarada y límites del acceso gratuito.
   La disponibilidad 24/7 es la oferta declarada, no una garantía de SLA.
2. Preguntas concretas dentro de guías existentes, sin crear una URL por pregunta.
3. Cuatro guías de descubrimiento por mercado: recursos gratuitos, hablar/recibir
   orientación online, recursos a cualquier hora y herramientas para el estrés.
   Reforzar el hub existente `/bienestar-emocional`, no duplicarlo.
4. FAQPage solo para preguntas y respuestas realmente visibles. No prometer
   resultados enriquecidos de Google por añadir este schema.
5. Registro de fuentes de entrada identificables y banco de 50 consultas con
   equivalentes naturales en los cuatro mercados. No confundir tráfico con citas.

## Exclusiones

Sin cambios de registro, login, chat, pagos, PWA ni APIs. Sin publicación,
envío IndexNow, conexión de cuentas externas o backlinks automáticos.
No crear press/research/media-kit vacíos: no hay documentación nueva que
justifique presentarlos como cobertura mediática o investigación propia.
La información institucional existente ya puede enlazarse y citarse.

No atribuir credenciales a autores inexistentes ni añadir revisores clínicos.
El contacto institucional procede del aviso legal, no de datos personales de
pruebas. El seguimiento no guardará texto de consultas ni URL de referrer.
