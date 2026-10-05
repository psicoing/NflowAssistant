# Seguimiento de descubrimiento y referencias de IA

## Dos medidas distintas

1. **Entradas identificables**: evento `public_discovery_entry` en una llegada
   a una URL pública incluida expresamente. Dimensiones propias: `engine`
   (Google, Bing, ChatGPT, Perplexity, Copilot, Gemini, Claude, otro externo o
   desconocido) y `market` (idioma/mercado de la página, NO país de residencia).
2. **Menciones y citas observadas**: banco interno de 50 intenciones y 200
   formulaciones en `docs/nuxa-consultas-ia.csv`. Evaluación manual periódica,
   no un mecanismo para solicitar recomendaciones favorables.

Una entrada no demuestra que una IA haya citado o recomendado NUXA. El
referrer puede faltar, cambiar o ser falsificado. `unknown` no significa
«sin tráfico de IA», y no equivale necesariamente a tráfico directo.

## Funcionamiento y límites del evento

- Se reutiliza el adaptador existente y el proveedor de analítica autorizado.
  No se añade ningún tracker, clave, ID de sitio ni API.
- Solo con `cookie-consent.analytics === true`; se comprueba también cuando
  la persona guarda sus preferencias después de llegar.
- Una entrada por carga de documento, no una por cada navegación interna.
  Sin cookie o identificador adicional. No es un conteo de personas únicas.
- No se envía desde cuentas, sesiones, pagos, chat, administración o APIs.
  Se excluyen entradas con query string o fragmento, incluso UTMs, por
  prudencia frente a tokens. Esto reduce cobertura y no mide campañas UTM.
- Las dos propiedades propias no contienen URL de referrer, consulta,
  nombre, correo, contenido del chat ni datos clínicos. Los metadatos
  técnicos y pageviews del tracker preexistente se gestionan en el proveedor:
  revisar allí configuración, consentimiento y política de conservación.
- Se requiere habilitar analítica en la configuración de Publishing y volver
  a publicar. El acceso autorizado no prueba que ya haya datos.
- No hay cifras inventadas ni una base de datos paralela. Si el tracker no
  está presente, no se recopila el evento. Se esperan su carga inicial y
  las interacciones posteriores sin bloquear la aplicación.

Tras recopilar datos, filtrar `public_discovery_entry` por engine y market
en analítica. Revisar weekly con una línea base fechada, en paralelo con los
informes de Search Console/Bing a los que se tenga acceso. No confundir
el idioma de destino con el país que ofrecen los informes del proveedor.

## Protocolo para el banco de consultas

Las formulaciones son un banco editorial de preguntas naturales, no consultas
extraídas de usuarios ni datos de volumen de búsquedas.

1. Seleccionar una muestra fija por mercado; mantener el texto exacto.
2. Anotar fecha, motor, versión cuando sea visible, idioma y país/configuración.
3. Utilizar una sesión nueva cuando sea posible, sin introducir «NUXA» ni
   pedir que se recomiende una marca. No enviar historias personales reales.
4. Guardar una captura o referencia interna al resultado y distinguir:
   ausencia, mención, cita con URL y recomendación contextual.
5. Comprobar la URL citada: nombre mencionado no es una cita verificable.
   No atribuir a NUXA enlaces a otro dominio.
6. Repetir con periodicidad estable. Las respuestas dependen de contexto,
   personalización y momento; no implican una garantía futura.

El fichero `docs/nuxa-observaciones-ia.csv` es una plantilla interna vacía.
No se han ejecutado consultas a motores externos ni inventado resultados.
Para registrar una observación real:

```sh
npx tsx scripts/record-ai-observation.ts \
  --query=16 --market=es-ES --engine=chatgpt \
  --mentioned=yes --citation=https://nuxa.life/es/recursos-gratuitos-bienestar \
  --evidence='Referencia interna a una captura real' \
  --recommended=no
```

Los argumentos del ejemplo ilustran el formato, NO una observación obtenida.
El comando exige evidencia referenciada, no envía consultas a ninguna IA,
valida motor/mercado/consulta y añade una fila al CSV interno. `--citation=no`
registra ausencia de cita. No incluir datos personales ni secretos en evidence.
El modo `--dry-run` valida y muestra la fila sin escribirla.

## Autoridad externa

Las páginas sobre identidad, funcionamiento, fuentes, seguridad y política
editorial proporcionan información institucional enlazable. No se crean
press/research/media-kit sin documentación real ni se contacta con terceros.
Las menciones editoriales auténticas requieren trabajo y autorización externos.
