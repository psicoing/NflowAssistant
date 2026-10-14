# NEUROPSI-AI: procedencia y pertenencia del historial

## Estado y alcance

Solución técnica propuesta tras inspección del código activo. No implementada,
no desplegada y sin pruebas de explotación contra datos reales.
No se han consultado conversaciones personales ni credenciales.

Cambios previstos exclusivamente en autorización, contratos HTTP,
almacenamiento/procedencia y pruebas. Sin cambios del motor científico,
prompts, modelos, interfaz, voz, pagos ni proveedores.

## 1. Comprobación del sistema actual

- `server/index.ts` registra `registerRoutes` de `server/routes.ts`.
- `server/db.ts` usa PostgreSQL con Drizzle y el pool de Neon; la elección de
  conexión prioriza la configuración de Neon. No se han leído valores secretos.
- `conversations` guarda `id`, `userId` opcional, título y fecha. El esquema
  mostrado no declara una clave foránea para `userId`.
- `messages` guarda `conversationId`, contenido, `isUser`, `responseKind` y fecha.
  No guarda autor autenticado ni procedencia; el esquema mostrado no declara
  una clave foránea para la conversación. Esto describe el código, no una
  inspección del catálogo de restricciones de una base desplegada.
- La autenticación normal comprueba la contraseña mediante bcrypt y establece
  `req.session.userId`. También hay acceso por enlace y prueba gratuita.
- `productionSessionOptions` establece cookies HTTP-only, SameSite=Lax y
  Secure en producción, con secreto obligatorio y sesiones PostgreSQL.
  En desarrollo usa el almacén de memoria configurado. No debe confundirse
  la configuración inicial de `index.ts` con las opciones finales sobrescritas.
- El login normal y el acceso por enlace examinados asignan `userId` sin
  regenerar expresamente la sesión; el flujo de prueba sí la regenera cuando
  cambia de usuario. Revisar esta inconsistencia en la futura corrección.
- La interfaz activa crea conversaciones con título y envía el mensaje
  actual, perfil, idioma y modo. No necesita subir el historial.

### Rutas y brechas

| Ruta | Comportamiento observado | Corrección propuesta |
| --- | --- | --- |
| GET `/api/conversations` | Sesión, acceso y lista filtrada por usuario | Conservar filtro y eliminar cualquier fallback global en la capa de chat |
| POST `/api/conversations` | Asigna propietario desde sesión | Mantener; validar título y rechazar intento de asignar propietario |
| GET `/api/conversations/:id` | Consulta por ID sin autenticación ni comprobación de propietario en el handler | Autenticar y consultar por ID + usuario |
| GET `/api/conversations/:id/messages` | Sesión/acceso, lectura por ID sin propietario | Lectura obligatoriamente acotada al propietario |
| POST `/api/conversations/:id/messages` | Sesión/cuota, inserción y lectura por ID sin propietario | Autorizar antes de reservar cuota, insertar, leer o llamar a IA |
| POST `/api/messages` | Esquema acepta `isUser`; handler sin sesión ni propietario | Desactivar escritura pública genérica |
| POST `/api/chat` | Sesión/cuota; usa historial por ID sin propietario y no persiste el intercambio | Validar propietario y procedencia, conservando inicialmente su contrato de respuesta |

No se ha demostrado una explotación ni se han accedido datos de terceros.
La falta de control se ha confirmado mediante lectura de las rutas reales.

## 2. Invariantes de la solución

1. La identidad procede de la sesión validada por el servidor, nunca del cuerpo,
   cabeceras inventadas, perfil local ni parámetros `userId`.
2. El chat actual exige un usuario autenticado, también en la prueba gratuita.
   No se introduce acceso anónimo ni se asignan conversaciones sin propietario
   al primer solicitante. Las conversaciones propias siguen accesibles desde
   nuevas sesiones legítimas del mismo usuario.
3. Toda operación requiere una conversación cuyo `userId` sea el usuario
   autenticado. Ser administrador no implica acceso a historiales ajenos
   desde estas rutas de chat.
4. Un mensaje auténtico significa que se recibió por un canal autorizado,
   con autor y conversación controlados. No significa que su contenido sea
   verdadero, clínicamente verificado o una instrucción de sistema.
5. Ningún cliente puede crear turnos de asistente, asignar referencias internas,
   alterar fechas/autoría ni aportar un historial que sustituya al almacenado.
6. La generación y el revisor reciben el mismo historial autorizado y elegible,
   sujeto a los límites actuales. La revisión no vuelve a cargar un historial
   distinto o menos protegido.
7. Una petición denegada no escribe mensajes, reserva cuota ni llama a IA.

## 3. Autorización y almacenamiento

### Control común

Crear un control reutilizable de identidad y conversación y operaciones
específicas del chat que exijan `userId`; no depender solo de comprobaciones
copiadas en cada handler. Consultar por `id` y `userId` conjuntamente.

- Sin sesión válida o con usuario inexistente: 401.
- ID inválido: 400; validar entero positivo seguro, sin `parseInt` permisivo.
- Conversación ajena, inexistente o sin propietario: misma respuesta 404,
  sin revelar existencia, título, propietario ni fragmentos.
- Mantener las reglas actuales de suscripción y cuota, separadas de pertenencia.
- Inserciones autorizadas dentro de una transacción o mediante inserción
  condicionada a propietario. No mantener una transacción abierta durante
  llamadas externas: volver a comprobar pertenencia al guardar el resultado.
- Orden estable por fecha e ID para reconstruir el diálogo.

### Procedencia nueva

Proponer metadatos internos de procedencia por mensaje: origen (`user`,
`assistant` o `legacy_unverified`), autor autenticado cuando corresponda,
versión de procedencia y fecha establecida por el servidor.
Son nombres conceptuales; el esquema definitivo se revisará al implementar.

Los nuevos mensajes del usuario solo se crean en el flujo autorizado.
Los de asistente solo se guardan desde el resultado interno del servidor,
con `responseKind` establecido por el servidor. No exponer esos campos
en contratos públicos de inserción o modificación.

Antes de una migración, comprobar restricciones y posibles huérfanos mediante
consultas acotadas, sin mostrar contenido personal. Proponer claves foráneas
y comprobaciones coherentes para filas nuevas; no borrar ni reasignar datos.
Una clave foránea no sustituye al control de propietario.

### Historial anterior: límite que debe revisarse

Los mensajes existentes no permiten distinguir una inserción legítima de una
inserción por la ruta vulnerable. Añadir una etiqueta a todas las filas antiguas
y llamarlas verificadas sería una falsa garantía.

Propuesta conservadora:

- Conservar todos los mensajes y conversaciones para su lectura autorizada.
- Tratar las filas anteriores sin procedencia como `legacy_unverified`.
- No utilizarlas como contexto ni como fuentes del revisor hasta que exista
  evidencia independiente suficiente para validar su procedencia.
- Si esa evidencia no existe, comenzar el contexto fiable con los nuevos
  mensajes autorizados; no convertir automáticamente una confirmación vaga
  del usuario en verificación de todo el historial.
- No hacer un backfill de confianza basándose únicamente en `isUser`,
  propietario actual, apariencia del texto o fecha.

**Consecuencia:** el usuario podrá seguir leyendo sus mensajes antiguos,
pero NUXA no podrá basar nuevas respuestas en ellos por defecto. Esta pérdida
de continuidad debe revisarse antes de aplicar la corrección. No se ha aplicado.

## 4. Contratos HTTP y referencias del revisor

- Mantener los campos necesarios de la interfaz: contenido, idioma y modo.
- Rechazar expresamente campos de historial, turnos, roles, referencias,
  propietario, autor, fecha y procedencia en todas las entradas de chat.
  No eliminar silenciosamente los intentos de falsificación.
- Desactivar POST `/api/messages` para escritura genérica: 401 sin sesión y
  una respuesta de ruta retirada para una sesión válida. No se encontró un
  consumidor en la interfaz activa inspeccionada; comprobar compatibilidad
  antes de retirar el endpoint.
- `/api/chat` debe usar el mismo cargador autorizado. No cambiar en esta fase
  su semántica de persistencia ni duplicar turnos al adaptarlo.
- El `userProfile` del cuerpo no acredita hechos. Recuperar del usuario
  autenticado los campos de perfil ya guardados; no usar el perfil local
  como fuente verificable `P0`. Siguen siendo declaraciones del usuario,
  no comprobaciones externas. Si falta un campo persistido, omitirlo.
- Generar `U` y `A` solo a partir de turnos elegibles del servidor y del
  mensaje actual validado. Conservar el origen científico actual de `S`.
  No modificar las instrucciones del revisor ni el motor científico.
- Las referencias del cliente (`U999`, supuestas citas, etc.) no se registran
  como fuentes. Texto literal dentro del mensaje sigue siendo contenido del
  usuario, no una fuente interna ni una orden privilegiada.
- La comprobación existente debe rechazar referencias ausentes, citas falsas
  y referencias de asistente presentadas como relato personal del usuario.

Las correcciones auténticas conservan su orden y las hipótesis descartadas no
pueden reintroducirse insertando turnos históricos o referencias falsificados.
Esto no garantiza por sí solo que el modelo interprete bien todas las negaciones,
ni resuelve las correcciones que quedan fuera del contexto por su longitud.
La continuidad larga es la siguiente fase, no una garantía de este parche.

## 5. Casos de prueba propuestos

Fixtures sintéticas: usuarios A y B, conversaciones propias, una conversación
sin propietario, mensajes legítimos nuevos y mensajes legacy no verificables.
IA, correo, cuotas y otros efectos externos simulados. Sin producción, SMS,
correos reales ni consultas de IA de pago.

| Caso | Resultado exigido |
| --- | --- |
| Petición sin sesión a cada ruta protegida | 401; cero lecturas de contenido, escrituras, reservas y llamadas IA |
| Sesión caducada o usuario eliminado | Rechazo sin efectos |
| A consulta lista, conversación o mensajes de B | Lista solo A; accesos directos 404 |
| A envía a ID de B mediante ruta principal o `/api/chat` | 404; ningún turno insertado ni usado por IA |
| Cambio de ID en URL, cuerpo o intento de propietario | Se usa únicamente identidad de sesión; rechazar campos prohibidos |
| IDs negativos, cero, decimales, sufijos, desbordamiento, arrays | 400; sin `parseInt` parcial ni coerción permisiva |
| ID inexistente y ajeno | Respuestas indistinguibles sin metadatos |
| Conversación sin propietario | No se adopta ni se utiliza |
| A legítimo desde otra sesión de A | Acceso propio permitido |
| Administrador usando el chat de un usuario ajeno | Sin excepción de propietario |
| Inserción con `isUser:false` por `/api/messages` | Bloqueada; no se crea un falso turno de asistente |
| Inserción con `isUser:true` y una supuesta fecha pasada | Bloqueada; no se fabrica un hecho histórico |
| `history`, `messages`, `role`, `sources`, `references` en el cuerpo | 400; no llegan a generación ni revisión |
| Perfil local inventado con datos personales de B | No se convierte en P0; se usa perfil persistido de A |
| Turnos legacy o de otra conversación presentes en fixtures | Excluidos del contexto y mapa de fuentes |
| Corrección auténtica seguida de historial falso que la contradice | Rechazar petición falsa; mantener corrección en el contexto elegible |
| Referencia inexistente U999, cita no literal o autor incompatible | Validador existente rechaza la revisión |
| Referencia válida de otro usuario o mensaje legacy | No aparece en el mapa; no puede validar una afirmación |
| Texto del mensaje contiene una falsa referencia o instrucciones de rol | Se conserva como texto de usuario, no como fuente/rol privilegiado |
| Escritura concurrente o conversación eliminada durante generación | No guardar respuesta huérfana o en contexto ajeno; fallo controlado |
| Fallo de BD o autorización | Fallar cerrado; sin fallback de lectura global |
| Envío legítimo en ES/EN/FR y modos actuales | Contrato de respuesta intacto; autoría y procedencia del servidor |
| Aviso automático y pregunta entregada | Preservar reglas existentes de cuota y responseKind |
| Generación y revisión | Capturar ambas entradas simuladas y verificar mismo contexto autorizado |

Las pruebas de significado usarán borradores y revisiones sintéticos
controlados. Esto prueba la frontera y el validador, no el comportamiento
semántico de un modelo real. No anunciar una garantía clínica.

## 6. Ejecución y criterios de aprobación

1. Revisar esta propuesta, especialmente el tratamiento del historial antiguo.
2. Implementar en desarrollo autorización y validación, procedencia y contratos.
3. Probar primero unidades, después las rutas Express realmente registradas
   con sesiones sintéticas y almacenamiento aislado. Evitar un harness que
   pruebe una copia simplificada de los handlers.
4. Comprobar también SQL acotado y restricciones en una base de pruebas
   aislada; no modificar registros reales para crear fixtures.
5. Ejecutar regresiones de contexto, certeza, grounding y motor científico.
   No cambiar sus prompts ni comportamiento para hacer pasar estos tests.
6. Entregar resultados, fallos, diff y consecuencias antes de cualquier
   publicación. No publicar automáticamente aunque todo pase.

Aceptar solo si todos los accesos cruzados y las vías de falsificación quedan
bloqueados antes de sus efectos; las fuentes provienen del conjunto autorizado;
y los recorridos legítimos conservan sus contratos. La autenticidad queda
acotada al servidor y BD confiables: no protege frente a un administrador de BD
malicioso ni convierte lo declarado por un usuario en un hecho demostrado.
