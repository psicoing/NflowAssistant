# NUXA: auditoría técnica y económica de recursos

## 1. Dictamen ejecutivo y alcance

**Diagnóstico técnico inicial; conciliación económica pendiente de facturación.**

El importe facilitado es coherente: **184,55 h × 0,16 USD/h = 29,528 USD**,
redondeado a **29,53 USD**. No demuestra, por sí solo, a qué proyecto se imputa.
No conocemos las fechas inicial y final de esa línea de consumo, ni si reúne
una o varias bases de datos.

Desde este proyecto no se dispone del desglose privado de Usage de toda la
cuenta ni de acceso al proyecto Radio Angrota. Por tanto:

- **No está demostrado que los 29,53 USD sean íntegramente de NUXA.**
- **Tampoco está demostrado que sean de Radio Angrota o de ambos.**
- Hay una causa técnica plausible en NUXA que puede impedir el reposo de su
  base mientras la instancia siga viva: dos consultas de limpieza cada minuto.
- Se ha identificado una base de producción gestionada asociada al proyecto,
  pero no sus horas facturadas. La existencia de otra conexión configurada
  no demuestra que haya otra base distinta o duplicada.
- No puede calcularse un total mensual real sin el periodo y las partidas de
  facturación. Las estimaciones de ahorro de este informe son condicionales.

Se han inspeccionado código/configuración, metadatos de publicación,
presencia de configuración sin revelar secretos, documentación oficial y dos
consultas SELECT sobre la réplica gestionada de producción, sin datos personales.
No se ha accedido al contenido de conversaciones, usuarios individuales ni pagos.
No se han cambiado código de aplicación, bases de datos, configuración, servicios,
límites, despliegues ni funcionamiento. No se han reiniciado workflows.

## 2. Evidencias e inventario

| Recurso | Evidencia disponible | Lo que falta confirmar |
| --- | --- | --- |
| Publicación de este proyecto | Servicio de despliegues: Autoscale, pública, build satisfactorio | Tamaño, máximo/mínimo de instancias, unidades y coste reales del periodo |
| Dominios de la publicación | Principal `nflow.style`; alias `nuxa.life`, `nflow.one`, `chatbotpsicologia.org`, `nflow-assistant-rmportbou.replit.app` | No se ha hecho un inventario de otras publicaciones de la cuenta |
| Base gestionada de producción del proyecto | Réplica accesible; `current_database=neondb`; 39 tablas públicas; 12.541.952 bytes de tamaño SQL en esa instantánea | Identificador de recurso facturado, horas, almacenamiento facturado y correspondencia con la conexión efectiva de la app |
| Datos agregados de esa réplica | 75 usuarios, 301 conversaciones y 1.049 mensajes | No es prueba de que toda la actividad del despliegue use esa misma base |
| Conexión prioritaria de aplicación | `server/db.ts` elige `NEON_DATABASE_URL` y solo si falta usa `DATABASE_URL`; ambas constan configuradas para producción | Si ambas apuntan a la misma base, a distintas bases Replit o a un servicio externo |
| Desarrollo | El mismo módulo de conexión no distingue por NODE_ENV | Si desarrollo y producción comparten destino al resolver los secretos |
| Radio Angrota | Solo referencia pública al proyecto en un enlace; no acceso al código, recursos ni factura | Todos sus recursos y consumo |
| App Storage | No se ha identificado un cliente de App Storage en las rutas inspeccionadas | Buckets de la cuenta y sus cargos; ausencia de SDK no prueba ausencia de buckets |
| Archivos del proyecto | Aproximadamente 758 MB en `attached_assets` y 111 MB en `dist` local | Tamaño efectivamente publicado, transferencias y si hay recursos externos adicionales |

**Precauciones de interpretación:**

- `NEON_DATABASE_URL` es el nombre de una variable: no prueba proveedor de
  facturación ni que su destino sea diferente de `DATABASE_URL`.
- Los dominios anteriores son alias de una publicación observada, no cinco
  servidores o cinco bases de datos. No se atribuye un cargo por alias.
- La base gestionada contiene datos reales agregados: no debe calificarse de
  vacía, abandonada o eliminable.
- `pg_stat_user_tables.n_live_tup` devolvía ceros en la réplica pese a existir
  filas, comprobadas con COUNT. Esos contadores no sirven aquí para deducir uso.
- El tamaño SQL (~11,96 MiB) no es el almacenamiento facturado: este puede incluir
  histórico, huella del servidor y el máximo mensual. No se usa para inventar
  una cifra de factura.
- Los hallazgos del código corresponden al workspace inspeccionado. Los
  metadatos confirman publicación y configuración declarada, no que cada línea
  local sea exactamente la revisión actualmente ejecutada en producción.

## 3. Procesos que pueden generar consumo innecesario

### A. Limpieza de verificación cada minuto — prioridad alta

`server/trial/routes.ts` registra un `setInterval` de 60.000 ms.
`TrialStore.cleanExpired`, en `server/trial/store.ts`, ejecuta dos DELETE:
flujos caducados y límites temporales caducados.

- Se ejecutan aunque no haya filas que borrar.
- Con una instancia viva continuamente: **2.880 consultas/día**,
  **86.400 consultas por 30 días**, sin contar trabajo útil.
- La frecuencia de un minuto es inferior a los cinco minutos de inactividad
  necesarios para el reposo según la documentación de Replit.
- Puede evitar el reposo del destino conectado durante toda la vida de la
  instancia. No se ha medido cuánto tiempo estuvo viva ni se atribuye a este
  proceso una cantidad de factura todavía.
- Autoscale puede parar instancias; `unref()` no convierte la tarea en gratuita,
  ni demuestra por sí solo cómo decide escalar la plataforma.
- Varias réplicas pueden repetir la limpieza. No implica multiplicar horas de
  una misma base por réplica, pero sí repetir SQL y dificultar el reposo.

**Propuesta, no aplicada:** agrupar y ejecutar limpieza de forma controlada
en ventanas menos frecuentes o bajo demanda, preservando comprobaciones de
caducidad en cada operación y la retención de datos sensibles. No aumentar
simplemente la frecuencia a diez minutos: podría seguir generando hasta cinco
minutos de actividad por cada ejecución. La ventana debe derivarse de requisitos
de privacidad y seguridad, no únicamente de coste.

### B. Mantenimiento de sesiones — prioridad media

`server/production-sessions.ts` utiliza `connect-pg-simple` con el mismo pool.
La versión instalada tiene limpieza predeterminada de sesiones de 15 minutos,
aleatorizada aproximadamente entre 7,5 y 22,5 minutos, tras activarse su temporizador.
Lee sesiones al recibir cookies y puede actualizar su caducidad.

Esto puede despertar la base sin una conversación nueva. Una tarea a intervalos
menores no explica necesariamente todo el consumo, y no se suma su supuesto
ahorro al de la limpieza anterior: ambas ventanas pueden solaparse.

**Propuesta:** coordinar mantenimiento y revisar las actualizaciones de sesiones.
Conservar persistencia entre instancias, caducidad, autenticación y protección
antifraude. No sustituir por memoria local ni borrar sesiones activas.

### C. Consultas periódicas desde el navegador — prioridad media/alta

| Origen | Frecuencia configurada | Efecto potencial |
| --- | --- | --- |
| Chat: `/api/question-limit` | 10 segundos | Lecturas de usuario/cuota, aunque no se envíe ningún mensaje |
| Indicador de preguntas, misma clave | 30 segundos | Revisar coalescencia de React Query; no sumar sin medir duplicación efectiva |
| Chat: `/api/chat/service-status` | 60 segundos | Consulta contabilidad persistente; no hace una consulta de prueba a la IA |
| Estadísticas públicas | 30 segundos | `getPublicStats()` hace tres consultas COUNT, sin caché observada |

En una página visible con estadísticas montadas durante una hora, la cadencia
teórica es hasta 120 refrescos y **360 consultas COUNT/hora**. Depende del montaje,
foco, pestañas, fallos y configuración de React Query; no es tráfico medido.
Las estadísticas pueden despertar la base aunque el visitante no use el chat.

**Propuestas:** caché de estadísticas públicas, agrupar sus agregados,
coalescer peticiones simultáneas y actualizar cuota con eventos relevantes
en lugar de consultar constantemente. Las autorizaciones, cuotas y pagos
deben seguir verificándose en servidor en la operación efectiva.

No cachear conversaciones de forma compartida entre usuarios. No dar por
autorizada una acción a partir de una cuota cacheada. Una caché que consulte
la misma BD en cada acceso tampoco permite reposo; hay que comprobar la ruta
completa, incluido middleware de sesiones y duración de las ventanas activas.

### D. Inicialización al arrancar instancias — prioridad media

`server/index.ts` ejecuta comprobaciones/escrituras de administración,
DDL y preparación de contactos/plantillas al arrancar. El registro de rutas
también prepara tablas. Son tareas de arranque, no un cron continuo.

Los arranques de varias instancias o los reinicios pueden repetir este trabajo
y aumentar tiempo de cómputo y latencia de arranque.

**Propuesta:** separar trabajos de inicialización del recorrido normal de cada
instancia, conforme al mecanismo de migración del destino realmente utilizado.
No hacerlo hasta confirmar si la base es gestionada o externa y cómo se
despliega. No se propone retirar comprobaciones necesarias sin sustitución.

### E. Conexiones y comprobaciones de disponibilidad

- Hay un pool central de aplicación; sesiones y módulos de chat reutilizan
  esa base/pool. Muchas tablas no equivalen a muchas bases facturables.
- El código no fija `max` ni `idleTimeoutMillis`; una instancia vacía del SDK
  instalado, sin conexión ni credenciales, declara máximo 10 conexiones e
  inactividad de 10 segundos. No se ha comprobado el máximo de instancias.
- No se encontró un `SELECT 1` periódico propio en el módulo de conexión.
  No hay evidencia para culpar a un supuesto keepalive TCP.
- Los handlers `/health`, `/healthz` y `/api/health` no consultan SQL directamente.
  El arranque y las peticiones con sesión son cuestiones distintas.
- Los temporizadores de carruseles y descubrimiento de la interfaz no son,
  por sí mismos, consultas periódicas a la base.

**Conclusión:** primero reducir despertares SQL inútiles. Cerrar conexiones
antes o limitar el pool puede proteger capacidad, pero no garantiza ahorrar
horas si siguen llegando consultas cada minuto.

## 4. Posibles duplicidades y oportunidades

1. **Dos destinos configurados:** candidato a revisar, no duplicidad demostrada.
   Comparar identidades de recurso entre configuración efectiva y panel de
   recursos sin exponer cadenas de conexión. No eliminar ni fusionar bases.
2. **Desarrollo apuntando a producción:** riesgo a comprobar. Si comparten destino,
   el workspace puede ejecutar limpieza/arranques contra la base de producción.
   El desarrollo gratuito de Replit no hace gratuito el uso de una base productiva.
3. **Una limpieza por réplica:** posible trabajo repetido; comprobar cantidad
   de instancias y actividad antes de diseñar coordinación.
4. **Estadísticas sin caché:** oportunidad clara sin alterar el chat psicológico.
5. **Archivos locales grandes:** revisar qué se sirve y descarga; los tamaños
   locales no son cargos de App Storage. No borrar archivos ni fuentes por
   deducir automáticamente que son duplicados.
6. **Índices y consultas:** revisar planes de consultas y estadísticas del primario
   antes de proponer índices. Las métricas disponibles de esta réplica no
   permiten un ranking fiable de consultas lentas. No se ejecutó EXPLAIN ANALYZE.

## 5. Economía: qué se conoce y qué no

### Conciliación de los 29,53 USD

184,55 horas equivalen a 7 días, 16 horas y 33 minutos de una base activa,
o a otra combinación acumulada si se suman recursos. No prueban un mes completo.
No son horas de conversación ni de uso de IA.

A 0,16 USD/h, una base activa todo un mes de 30 días costaría **115,20 USD**
solo en cómputo; en 31 días, **119,04 USD**. Son referencias matemáticas, no
predicciones de la factura de NUXA.

### Desglose mensual pendiente

| Concepto | Forma de cálculo | Estado en NUXA |
| --- | --- | --- |
| BD de producción: cómputo | Horas atribuidas × 0,16 USD | Horas por proyecto no disponibles |
| BD: almacenamiento | GiB facturados × tarifa aplicable | Volumen facturado no disponible |
| Autoscale | Base + unidades + solicitudes | Tipo confirmado; consumos no disponibles |
| Transferencia saliente | GiB con cargo × tarifa | Consumo y aplicación de franquicias no disponibles |
| App Storage | GiB, operaciones y transferencias aplicables | Buckets/consumo no confirmados |
| IA de chat gestionada | Uso real de modelos en Replit | Configuración declarada Replit; factura no consultada |
| OpenAI directo / voz | Consumo real del proveedor, si existe | No atribuir al chat ni inferir gasto por tener una clave |
| Twilio voz, SMS y correo | Números, minutos, SMS/correos y extras reales | Facturas no consultadas |
| Otros proveedores de correo | Planes y operaciones realmente utilizados | Imports/secretos no prueban contratación o cargos |
| Stripe/PayPal y dominios | Comisiones y renovaciones | Fuera de Production Database Compute; importes no disponibles |
| Plan Core y Agent | Coste compartido de cuenta/desarrollo | Separar del coste operativo exclusivo de NUXA |

Las tarifas publicadas desde el ciclo aplicable posterior al 1 de agosto de
2026 son: BD 0,16 USD/h y almacenamiento 0,35 USD/GiB-mes; Autoscale base
1 USD/mes, 0,60 USD por millón de unidades, 0,40 USD por millón de peticiones;
transferencia 0,05 USD/GiB; App Storage 0,015 USD/GiB-mes, más operaciones.
La factura, el periodo, las franquicias y los créditos deciden el importe neto.
No se han aplicado esos precios a volúmenes desconocidos para inventar un total.

El límite interno del chat de Replit de 20 USD y el de SMS de 5 USD son
presupuestos, **no consumo demostrado**. El código también contempla límite
independiente de OpenAI de 25 USD; no es una prueba de gasto activo.
No sumar otra vez el coste de IA si ya está incluido en las partidas de Replit.
Tampoco restar la totalidad de los créditos de Core a cada app: son compartidos.

## 6. Ahorro: escenarios, no promesas

Si los 29,528 USD corresponden íntegramente a NUXA:

| Reducción de horas realmente obtenida | Ahorro en ese mismo periodo |
| --- | --- |
| 25 % | 7,38 USD |
| 50 % | 14,76 USD |
| 75 % | 22,15 USD |

Solo serían ahorros **mensuales** si la cifra de partida corresponde a un mes.
Si NUXA representa una fracción `a` del cargo y se reducen sus horas una
fracción `r`, el ahorro de ese concepto sería `29,528 × a × r`.
Ni `a` ni `r` se han medido. **Ahorro mensual garantizado con los datos actuales:
no determinable.** Una reducción de consultas sin periodos de reposo puede
mejorar carga y latencia sin reducir este cargo por horas.

Orden sugerido, sin cambios autorizados todavía:

1. Atribuir cargos y confirmar destinos reales.
2. Medir despertares de limpieza, sesiones y polling.
3. Diseñar mantenimiento agrupado y caché de información pública.
4. Medir horas, errores y latencia antes/después en ventanas comparables.
5. Optimizar arranque/SQL si la medición justifica el coste y riesgo.

No recortar revisiones de IA, historial, seguridad, cuotas, pagos o persistencia
para cumplir una cifra de ahorro no demostrada.

## 7. Disponibilidad 24 horas y aceptación

Disponibilidad 24/7 no exige que la base esté consumiendo cómputo cada minuto.
La plataforma documenta suspensión tras inactividad y reactivación cuando hay
trabajo; puede haber latencia de reactivación que debe medirse. No se propone
apagar NUXA de noche, cambiarla a un job programado ni sacrificar servicio.

Una optimización futura solo será aceptable si conserva conversaciones,
usuarios, pagos, verificaciones y servicios de IA; mantiene sesiones
duraderas y límites antifraude; y no degrada de forma inaceptable latencia o
fiabilidad. Probar con tráfico sintético y comparar percentiles de latencia,
errores, horas de BD, SQL por ventana e instancias, sin registrar contenido
personal ni mantener un muestreo constante que impida el reposo.

No fijar un límite global de gasto bajo como sustituto de optimización:
la documentación advierte que alcanzar límites puede suspender servicios,
lo que entra en conflicto con la disponibilidad exigida.

## 8. Datos necesarios para cerrar el informe económico

De `https://replit.com/usage`, para **el mismo intervalo del cargo**:

1. Fechas de inicio/fin y moneda.
2. Filtro del recurso **Production Database Compute**, desglosado por proyecto:
   NUXA, Radio Angrota y cualquier otro que aparezca.
3. Por recurso/BD si el panel lo permite: identificador, horas y coste.
4. Desglose completo de NUXA: publicación, almacenamiento, transferencia e IA.
5. Créditos, franquicias e impuestos para conciliar bruto frente a importe pagado.

Una exportación CSV, si la interfaz la ofrece, o capturas legibles de esos filtros
es suficiente para empezar. No incluir contraseñas, claves API ni cadenas de
conexión. Para costes externos hacen falta las partidas de los proveedores,
sin datos de pago ni credenciales.

La documentación confirma filtros por fecha, recurso y proyecto. No hay
credencial administrativa de facturación configurada accesible en este proyecto;
no se ha intentado eludir permisos ni consultar APIs privadas de la cuenta.

Con esos datos se podrá responder con importes comprobados qué parte pertenece
a cada app, cuántas horas genera cada recurso y cuál es el ahorro mensual
razonable. Este informe no certifica ni impugna la corrección de la factura.

## 9. Actualización con el desglose de Usage aportado

El usuario ha aportado las partidas de Usage, pero no las fechas ni los
filtros de proyecto. Las siguientes cifras corresponden al alcance del panel
copiado, que aún no se puede atribuir exclusivamente a NUXA ni considerar
necesariamente un mes.

| Categoría | Importe mostrado (USD) |
|---|---:|
| Agent: trabajo en Projects; Conversations figura a cero | 110,07 |
| Replit AI Integrations | 0,86 |
| Herramientas | 0,47 |
| Hosting Autoscale: cómputo, días y solicitudes | 4,00 |
| Hosting Reserved VM | 8,82 |
| Transferencia a visitantes | 2,36 |
| Storage: principalmente cómputo de BD de producción | 29,53 |
| **Suma de categorías mostradas** | **156,11** |

La suma se realiza con importes visibles redondeados. Las líneas inferiores
a un céntimo pueden introducir diferencias pequeñas respecto del total exacto.
No es un cálculo de la cantidad pendiente de pago: faltan créditos,
inclusiones, cuota del plan e impuestos.

### Qué queda aclarado

- Agent representa aproximadamente el **70,5 %** de los 156,11 USD.
  Es una partida distinta de la inferencia del chatbot por Replit AI
  Integrations. No procede describir 111,40 USD como consumo del chat de NUXA.
- El uso de Replit AI Integrations mostrado es **0,86 USD**. Sin filtro de
  proyecto no sabemos cuánto corresponde a NUXA.
- Hosting, transferencia y Storage suman **44,71 USD**, sin Agent, herramientas
  ni inferencia. Sumando las integraciones de IA son **45,57 USD**. Incluyendo
  herramientas y excluyendo solo Agent, el total es **46,04 USD**.
  Son agrupaciones del alcance mostrado, no una estimación mensual de NUXA.
- Los 29,53 USD figuran bajo Storage, pero corresponden esencialmente al
  **tiempo de cómputo de BD**, no al volumen de conversaciones almacenadas.
  El almacenamiento lógico de BD figura en 0,02 GiB-mes, por debajo de un
  céntimo; recuperación y objetos también son mínimos en este desglose.
  No hay justificación económica para borrar datos a partir de estas cifras.
- Se facturan tanto **Autoscale** como **Reserved VM**. NUXA tiene una
  publicación Autoscale observada; no se ha identificado el proyecto al que
  pertenecen las 424,1 horas de Reserved VM. No atribuirlas a Radio Angrota
  ni considerarlas un duplicado sin comprobarlo.
- Los **103 días de Autoscale** no prueban que el intervalo dure 103 días:
  pueden acumular días facturados de varias publicaciones. Las fechas y el
  desglose por proyecto siguen siendo necesarios.
- Los **47,17 GiB** de transferencia son una partida comprobada del alcance
  mostrado, pero no demuestran por sí mismos tráfico humano, abuso ni qué
  proyecto o archivos lo originan.

### Prioridades económicas revisadas, sin implementar cambios

1. Si el objetivo es reducir el consumo total de la cuenta, el mayor componente
   observado es el trabajo con Agent. Separar ese presupuesto de desarrollo
   del presupuesto operativo y evitar comprobaciones repetidas sin necesidad.
   Un informe estático no permite predecir cuánto costará el desarrollo futuro.
2. Para reducir gasto operativo sin tocar la calidad del chat, investigar primero
   las horas de BD y los procesos periódicos ya identificados en este informe.
   El ahorro depende de reducir ventanas activas reales, no solo consultas.
3. Identificar qué publicación usa Reserved VM y si es necesaria, antes de
   plantear cambios de modalidad. No apagar ni convertir servicios durante
   esta auditoría; preservar la disponibilidad 24/7.
4. Identificar el origen de la transferencia antes de proponer compresión o
   caché de archivos. Su coste observado, 2,36 USD, es menor que el de BD.

Los escenarios de ahorro de BD anteriores permanecen condicionados a la
atribución por proyecto y al intervalo. El desglose nuevo no permite cerrar
el coste mensual de NUXA ni repartir costes con Radio Angrota.

**Datos mínimos pendientes:** fechas de inicio/fin y confirmación del filtro
de proyectos; después, partidas de Production Database Compute y Reserved VM
para NUXA y Radio Angrota por separado. No se necesitan credenciales.

## 10. Fuentes

- Código inspeccionado: `.replit`, `server/db.ts`, `server/index.ts`,
  `server/routes.ts`, `server/storage.ts`, `server/trial/routes.ts`,
  `server/trial/store.ts`, `server/production-sessions.ts`,
  `server/chat-service-status.ts`, `server/chat-cost-policy.ts`,
  `client/src/pages/chat.tsx`, indicador de cuota y estadísticas públicas.
- SDK instalado: valores predeterminados de `@neondatabase/serverless.Pool`
  comprobados sin abrir conexiones; mantenimiento de `connect-pg-simple`
  comprobado en su código instalado.
- Metadatos del servicio de publicación y configuración: lectura sin cambios.
- Consultas SELECT de metadatos y agregados de la réplica gestionada; no se
  consultaron textos de usuarios ni se atribuyeron sus métricas a otro destino.
- https://docs.replit.com/billing/about-usage-based-billing
- https://docs.replit.com/billing/aug-cloud-billing-updates
- https://docs.replit.com/billing/managing-spend
- https://docs.replit.com/features/data-and-storage/monitor-your-database
