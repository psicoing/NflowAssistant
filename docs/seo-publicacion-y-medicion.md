# NUXA: publicación y medición SEO internacional

## Qué cambia y qué se conserva

Se conserva la landing `/` y las rutas públicas anteriores. Los centros
`/es/`, `/en-us/`, `/en-gb/` y `/fr/` son información pública adaptada por mercado;
no significan que el proceso completo de registro, pago o chat esté localizado.
No hay redirecciones automáticas por IP o idioma del navegador.

La fase 1 aportó 84 documentos: 36 institucionales y 48 guías temáticas.
La fase 2 los conserva y añade 16 guías de descubrimiento: el catálogo actual
contiene 100 documentos. Véanse `nuxa-fase2-auditoria.md` y
`nuxa-fase2-medicion.md` para la auditoría incremental y el seguimiento.
Diez guías españolas reutilizan sus URLs existentes; no son URLs nuevas.
Las nuevas páginas usan el mismo texto en el HTML inicial y en el navegador.
Los artículos revisados del blog mantienen sus URLs y fechas originales, con
fecha de modificación visible y fuentes compartidas con el servidor.

No se presentan resultados clínicos propios, revisión profesional individual,
acreditaciones ni valoraciones sin soporte documental. Las fuentes externas
no son un aval de NUXA. Hay límites claros y ayuda urgente adaptada al país.
Las guías de privacidad no reemplazan los documentos legales existentes.

## Verificación reproducible

```sh
npm run build
npm run check
npx tsx scripts/audit-international-seo.ts --base=https://DOMINIO-DEV
npx tsx scripts/submit-indexnow.ts /blog/1 /en-us/anxiety
```

El último comando solo muestra la solicitud prevista. `npm run check` presenta
ocho errores preexistentes fuera del cambio SEO: Google Translate y tipos de
usuario en rutas de registro. No se modificaron esos procesos para corregirlos.
El informe generado enumera las pruebas efectivamente ejecutadas; no equivale
a una validación clínica, jurídica o de un pago real.

El proxy `.replit.dev` añade cabeceras noindex por su política de desarrollo.
Esto no debe corregirse en la app ni interpretarse como un bloqueo de
`nuxa.life`. Se verificó esa diferencia entre proxy y servidor de origen.
Las cabeceras propias de áreas privadas deben comprobarse en el origen y
repetirse en producción. No invocar `/stripe-return` sin una sesión válida:
incluso HEAD puede ejecutar la lógica GET del retorno de pagos.

## Después de publicar

1. Comprobar respuestas 200 y HTML inicial en `https://nuxa.life/` y los cuatro
   mercados; redirección 301 de aliases; 404 de rutas localizadas inexistentes.
2. Descargar `/robots.txt`, `/sitemap.xml` y `/llms.txt`. El sitemap servido por
   el servidor combina las URLs conservadas con el catálogo y fechas reales.
   Verificar ausencia de login, registro, chat, áreas privadas y APIs.
3. Repetir `scripts/audit-international-seo.ts --base=https://nuxa.life`.
4. Enviar el sitemap en Google Search Console y Bing Webmaster Tools, con acceso
   autorizado a esas propiedades. El HTML conserva la verificación de Google
   existente; su presencia no demuestra que la cuenta tenga acceso.
5. Comprobar que CDN/firewall/rate limiting externo permite búsquedas de
   Googlebot, Bingbot y OAI-SearchBot. Las pruebas en desarrollo no comprueban
   reglas del dominio publicado.
6. Solo entonces notificar las URLs realmente modificadas a IndexNow:

```sh
npx tsx scripts/submit-indexnow.ts --submit
# O una selección de URLs publicadas y modificadas:
npx tsx scripts/submit-indexnow.ts --submit /blog/1 /en-us/anxiety
```

El script comprueba clave pública de propiedad, HTTP 200, canonical e
indexabilidad antes de enviar. No envía al iniciar el servidor. No envía APIs,
cuentas, URLs de pago ni rutas que no estén en la lista pública. Una respuesta
200/202 solo confirma aceptación de la solicitud, no indexación.

## Cuadro de medición

Registrar una línea base al publicar y revisar semanalmente, separando España,
Estados Unidos, Reino Unido y Francia:

| Indicador | Fuente | Interpretación y límite |
| --- | --- | --- |
| URLs indexadas y motivos de exclusión | Search Console / Bing | La publicación no garantiza indexación |
| Impresiones y clics orgánicos | Search Console / Bing, por país y URL | Separar marca NUXA de consultas de problemas emocionales |
| Consultas, posición media y CTR | Search Console / Bing | Interpretar junto a volumen y tipo de consulta; no prometer posiciones |
| Entradas y altas procedentes de búsqueda | Analítica con consentimiento | Vincular landing, fuente y evento sin texto de conversaciones ni datos sensibles |
| Citaciones o referencias desde motores IA | Informes disponibles y referencias de tráfico | Ausencia de informe no equivale a ausencia de uso; no fingir una integración |

La app ya emite eventos `registration_succeeded` y `checkout_started` mediante
el adaptador de analítica, condicionados al consentimiento. El adaptador requiere
un proveedor activo: la existencia del código no demuestra recopilación de
datos ni atribución orgánica. No se añadieron rastreadores ni se modificó el
registro. La fase 2 reutiliza este adaptador para `public_discovery_entry`;
no añade una base de datos ni mide por sí sola altas atribuibles a una cita
de IA. Para medir altas orgánicas, confirmar primero proveedor, acceso a
informes, consentimiento y atribución de fuente/landing. Evitar incluir
contenido del chat, datos clínicos o identificadores personales en eventos.

Para visibilidad IA, mantener un conjunto estable de consultas de evaluación
por mercado y fecha. Guardar respuesta, URL citada y motor observado; no tratar
una prueba puntual como una garantía de futuras respuestas.

## Pendiente de revisión humana o de acceso externo

- Propiedad y envío de sitemap en Search Console/Bing.
- Confirmación de reglas externas del dominio tras publicar.
- Revisión legal de privacidad, condiciones y edad/menores.
- Verificación de afirmaciones y acreditaciones en el resto de las páginas
  comerciales; el aviso legal aún menciona un dominio antiguo.
- Cualquier revisión profesional o publicación científica futura debe tener
  documentación, fecha y autorización antes de atribuirla a una persona.
- No se han enviado solicitudes IndexNow ni modificado DNS/CDN.