# NEUROPSI-AI: resultados de protección del historial

## Estado

Corrección implementada y comprobada en desarrollo. No se ha publicado.
No se han cambiado prompts, modelos, motor científico ni interfaz.
Las pruebas usan datos sintéticos, PostgreSQL temporal y respuestas simuladas:
no han enviado correos/SMS ni realizado consultas de IA de pago.

La propuesta inicial está en `NEUROPSI_HISTORY_SECURITY_PLAN.md`.

## Protección implementada

- Un control común protege las rutas reales de conversaciones y chat antes
  de ejecutar sus handlers. Comprueba sesión, existencia del usuario y
  pertenencia. Los administradores tampoco obtienen una excepción de acceso
  a historiales ajenos desde el chat.
- Identificadores inválidos se rechazan; conversaciones ajenas, inexistentes
  o sin propietario reciben la misma respuesta 404.
- El cliente no puede insertar turnos por `/api/messages`. Los contratos de
  creación/envío rechazan campos de propietario, historial, roles, fechas,
  procedencia o referencias; se conservan los campos necesarios del cliente.
- El perfil del cuerpo no se utiliza como respaldo. El servidor toma los
  campos disponibles del registro del usuario autenticado, que siguen siendo
  declaraciones personales, no hechos clínicamente verificados.
- Los nuevos mensajes guardan procedencia, autor autenticado y versión,
  establecidos exclusivamente por la operación interna de almacenamiento.
- La escritura comprueba el propietario dentro de una transacción que bloquea
  la fila de conversación. La consulta de mensajes vuelve a acotar por
  conversación y propietario mediante un join, ordenando por fecha e ID.
- La generación recibe solo filas con procedencia coherente, autor autorizado
  y versión admitida. La construcción existente de las referencias del revisor
  opera sobre ese contexto acotado; no se han cambiado sus instrucciones.
- Las filas antiguas conservan procedencia nula: siguen visibles para su
  propietario, pero quedan excluidas de contexto y fuentes de la IA.
  No se ha borrado, reasignado ni declarado fiable el historial anterior.
- La actualización de esquema añade tres columnas opcionales y no hace un
  backfill de confianza. El test ejecuta la actualización dos veces para
  comprobar su idempotencia y conservar la procedencia antigua desconocida.
- Registro, login normal y acceso por enlace regeneran el identificador de
  sesión al establecer identidad; no heredan privilegios de otra identidad.
- Si la conversación desaparece durante la generación, no se guarda una
  respuesta en ella ni se cobra una pregunta por la respuesta rechazada.

No se han añadido nuevas claves foráneas a las relaciones históricas de
conversaciones/mensajes: requerirían revisar huérfanos y compatibilidad de
datos existentes. La protección entregada no depende de suponerlas presentes;
aplica autorización SQL y escritura transaccional.

## Verificación ejecutada

### Seguridad de las rutas

`npx tsx scripts/test-chat-history-security.ts` — **PASS**.

77 peticiones HTTP de prueba, más aserciones de almacenamiento y revisión.
Se usan los handlers del bloque activo de `server/routes.ts` extraídos
literalmente al ejecutarse la prueba, no una copia simplificada. Se aíslan
las registraciones ajenas a chat y sus dependencias externas. Las sesiones
Express y el almacenamiento PostgreSQL son reales, pero exclusivos del test.

Casos comprobados:

- Sin sesión, usuario inexistente y cookie de sesión anterior invalidada.
- Acceso entre usuarios, conversaciones sin propietario e inexistentes.
- Administrador sin permiso especial sobre conversaciones ajenas.
- Cambio de identificadores y entradas malformadas; rutas en mayúsculas.
- Intentos de insertar usuario/asistente y falsificar historial o referencias.
- Perfil inventado del cliente que no llega al contexto como fuente.
- Mensajes antiguos conservados para lectura y excluidos del contexto.
- Una corrección auténtica permanece en las fuentes mientras una inserción
  sin procedencia y un historial falso no pueden reintroducir la hipótesis.
- Referencias inexistentes, citas falsas y autor de referencia incompatible.
- Referencia legítima a la corrección aceptada por el validador existente.
- ES/EN/FR y los modos classic/brief/bubbles sin cambiar contratos.
- Aviso automático sin consumir pregunta.
- Pertenencia comprobada en escritura, eliminación durante generación,
  fallo de almacenamiento sin fallback global y ausencia de efectos
  de escritura/cuota/IA en los intentos bloqueados antes del handler.
- `/api/chat` conserva su contrato actual sin persistir duplicados.
- Generación y fuentes del revisor construidas sobre el contexto autorizado.

### Regresiones sin proveedores externos

- `scripts/test-chat-continuity.ts` — **PASS**.
- `scripts/test-chat-grounding.ts` — **PASS**.
- `scripts/test-chat-grounding-integration.ts` — **PASS**.
- `scripts/test-scientific-engine.ts` — **PASS**.
- `npm run check` — **PASS**.
- `npm run build` — **PASS**.
- `git diff --check` — **PASS**.

El workflow de desarrollo se reinició una vez después de los cambios y llegó
a `application ready on port 5000`. La página pública renderiza en la captura.
El arranque también muestra un aviso de clave duplicada en `ensureAdminUser`,
ajeno al parche; no impide la disponibilidad y no se ha modificado esa función.

## Límites y decisión pendiente

- Autenticidad significa procedencia y pertenencia; no verifica externamente
  la veracidad de lo declarado por una persona.
- Estas pruebas no demuestran comprensión semántica infalible del modelo,
  ni equivalen a una evaluación clínica.
- La exclusión de mensajes antiguos puede reducir continuidad, tal como se
  explicó y autorizó antes de implementar. No se reconstruyen turnos ausentes.
- No se resuelve todavía la continuidad al superar los límites de contexto.
- No se añade memoria entre conversaciones.
- No protege frente a modificación maliciosa de la base por alguien con
  privilegios de administración de BD o ejecución de código del servidor.
- No se ha ejecutado un ensayo nuevo de respuestas con un modelo de pago.
- Publicación y verificación en producción quedan pendientes de revisión y
  autorización; no deben confundirse los tests con un despliegue realizado.
