# Correcciones de estadísticas y registro: solo desarrollo

## Autorización y límites

El propietario autorizó las correcciones y pruebas «sin tocar producción».
No se ha republicado, modificado secretos ni reiniciado el servidor principal:
su conexión de aplicación utiliza la base publicada y su arranque contiene
otras operaciones con escrituras. Tampoco se han enviado correos, SMS, cobros,
peticiones a Stripe ni consultas al chat de IA.

Se contrastó la identidad de la base gestionada de desarrollo con la de la
aplicación antes de cualquier fixture. Son distintas. Las pruebas usan
esquemas temporales exclusivos de desarrollo, eliminados al finalizar.
Solo se creó la nueva tabla declarada de observabilidad en desarrollo.
No hay DDL nuevo de arranque, migración de producción ni hook de despliegue.

## Correcciones

### Estadísticas administrativas

- Lectura agregada en una transacción de solo lectura, sin cargar contraseñas
  ni contenido de mensajes.
- Total de cuentas separado de clientes, administradores y otras cuentas.
- Estados de prueba, pago pendiente, suscripción vigente según base y estado
  activo caducado por separado. Los administradores no son clientes.
- Verificación de prueba indica ambas marcas del flujo actual; no pretende
  reconstruir verificaciones de cuentas históricas.
- Periodos móviles de 7, 15 y 30 días: altas, cuentas con último acceso,
  accesos administrativos, cuentas que escribieron y mensajes propios.
- Historia mensual de cuentas de cliente conservadas; no es una auditoría
  inmutable de cuentas que podrían haberse eliminado.
- Los accesos por último timestamp no miden todas las sesiones restauradas
  ni constituyen una tabla histórica de cada inicio de sesión.
- No se calcula ingreso real multiplicando cuentas activas por un precio.
  El resumen y el indicador de ingresos reportados muestran «No conciliados».
- Actualización manual, hora de lectura y conservación señalizada del último
  dato si falla refrescar. Un fallo o una versión antigua no se convierten en
  cifras cero.

### Semántica de eventos nuevos

- `admin_login_succeeded`: acceso administrativo, separado de clientes.
- `login_succeeded`: se conserva para accesos no administrativos.
- `commercial_request_succeeded` / `commercial_request_failed`: solicitudes
  comerciales, no nuevas cuentas.
- `account_registration_succeeded`: nueva cuenta de prueba confirmada por
  el servidor, no solo un envío de formulario.
- `trial_activation_succeeded`: activación del flujo, distinta de crear
  una cuenta; no atribuye altas a reactivaciones de cuentas ya existentes.

No se reescriben eventos históricos. Los eventos del navegador siguen
dependiendo del consentimiento y de la disponibilidad del tracker.

### Registro y sesión

La ruta normal conserva creación con contraseña cifrada, pago pendiente,
ausencia de preguntas gratuitas no verificadas y procesamiento opcional de
referidos. Usa un manejador inyectable para probarlo sin arrancar la app real.

- Comprueba persistencia de sesión antes de responder éxito.
- Si la cuenta ya se insertó pero falla la sesión, no borra la cuenta:
  comunica `ACCOUNT_CREATED_SESSION_FAILED` y recomienda iniciar sesión.
  Se destruye la sesión incompleta.
- Distingue duplicado de fallo temporal de almacenamiento.
- Rechaza una fecha de nacimiento individual inválida con validación.
- No devuelve errores de base de datos ni registra datos personales del
  intento en los nuevos mensajes de diagnóstico.

El flujo gratuito devuelve si realmente creó la cuenta. Repetir una
confirmación completada no cuenta una nueva alta. También se corrigió la
respuesta de repetición que aún restaba del antiguo límite de cinco:
ahora informa del límite vigente de dos sin reiniciar consumo histórico.

### Observabilidad operativa

`nuxa_registration_events` conserva referencia aleatoria, fecha, etapa fija,
resultado, estado HTTP, código permitido, marca de cuenta creada y clase de
rol. No guarda cuerpo de petición, correo, teléfono, IP, sesión, usuario,
contraseña, OTP ni contenido clínico.

Se registra el resultado final de las peticiones que llegan al middleware,
independientemente del consentimiento de analítica. Se evita duplicar eventos
por `finish` y `close`. Un corte se marca como interrumpido.

- La tabla no es fuente autoritativa del número de cuentas: lo es `users`.
- Sus cifras cuentan operaciones, no personas ni intentos únicos completos.
- La marca de cuenta creada refleja lo observado al cerrar la respuesta;
  un corte anterior a una escritura posterior no demuestra que esa escritura
  no ocurriera.
- No incluye rechazos previos del proxy o del analizador JSON.
- Si falla su almacenamiento, no bloquea el registro: emite un diagnóstico
  estructurado limitado a los mismos campos seguros.
- Retención de 30 días. Se depura a lo sumo una vez al día por proceso,
  al registrar actividad, sin temporizador periódico que mantenga la base
  despierta. La tabla tiene índice temporal.
- Ausencia de tabla o de cobertura se muestra expresamente; no prueba cero
  fallos históricos. No recupera los intentos anteriores a esta implantación.

## Verificación

Comprobaciones realizadas:

1. `npm run check`: correcto.
2. `scripts/test-custom-analytics.ts`: consentimiento, tracker ausente,
   fallos síncronos/asíncronos y ausencia de llamadas de red.
3. `scripts/test-user-registration-metrics.ts`: manejadores reales de registro
   y prueba en desarrollo aislado, persistencia y sesión, contraseña cifrada,
   duplicado, fecha inválida, fallos simulados de base/sesión/correo/SMS,
   abandono, caducidad, códigos incorrectos, confirmación repetida con dos
   preguntas y una sola alta, incrementos de estadísticas, separación de
   roles, historial y métricas sin trazas históricas.
4. `scripts/test-trial-verification.ts`: regresión de verificación y seguridad,
   sesiones PostgreSQL entre instancias y reinicio, 14 reservas concurrentes,
   cupo SMS y entrega incierta. Se corrigió su antiguo destino de fixtures:
   ahora exige desarrollo distinto de la aplicación y nunca crea esquemas
   temporales sobre la base publicada.

Los proveedores de correo/SMS son implementaciones simuladas. Las pruebas
de sesiones usan la implementación de modo producción, pero sobre tablas
temporales de desarrollo, no sobre usuarios o sesiones de producción.

Para navegador se utiliza un servidor aislado en 5011 con el frontend real,
las rutas revisadas, base temporal y proveedores simulados. No carga
`server/index.ts`, no ejecuta procesos comerciales y rechaza todas las API
desconocidas. El fixture se detiene y elimina después de verificar.

La prueba de navegador confirmó alta con correo y SMS simulados, sesión
persistida, dos cuentas totales separadas en un cliente y un administrador,
una prueba verificada, altas 1/1/1 y actualización de solo lectura. Confirmó
legibilidad en escritorio y a 390 px, ausencia de ingresos inventados y
conservación de datos con aviso ante un HTTP 503 simulado.

Su veredicto global fue parcial: el fixture no expuso `/api/question-limit`,
por lo que el saldo de dos preguntas se comprobó en los tests del servidor,
no mediante ese endpoint en navegador. El capturador local de analítica no
conservó eventos tras navegar entre documentos; no se confirmó la emisión
de los nuevos nombres en esa pasada. Esto no se presenta como una prueba
de entrega a Advanced Analytics. No hubo una segunda pasada de navegador.

## Resultado y siguiente decisión

Las pruebas de desarrollo demuestran la persistencia y sus contadores para
los casos cubiertos. No demuestran que todos los proveedores, dispositivos o
intentos de producción actuales funcionen de extremo a extremo.

La auditoría histórica sigue sin identificar una causa demostrada de la
ausencia de altas reales. No debe presentarse como una incidencia de
producción resuelta. La nueva separación de métricas y observabilidad permite
investigar con mejor evidencia cuando se autorice su puesta en producción.

Antes de publicar: revisar la comparación de esquema para que sea aditiva,
autorizar expresamente el paso a producción y, si se desea una prueba con
entrega real, autorizar su destinatario y consumo por separado.
