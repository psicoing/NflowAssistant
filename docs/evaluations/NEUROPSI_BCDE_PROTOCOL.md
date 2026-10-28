# NEUROPSI: criterios de aceptación y evaluación

## Alcance

Cerrar las comprobaciones técnicas de procedencia (B), mejorar conservadoramente
el contexto de una misma conversación (C), preparar una comparación reservada
(D) y orientar la especialización por errores medidos (E). No se autoriza con
este documento publicar, ampliar memoria entre conversaciones, consultar datos
personales ni realizar llamadas de IA de pago.

## B: condiciones para aceptar la corrección en desarrollo

- Usuario sin sesión o inexistente no accede al chat privado.
- Cambiar un identificador no permite leer, usar, escribir ni borrar
  conversaciones ajenas. El administrador no recibe una excepción en estas rutas.
- Historial, autores, procedencia, perfil y referencias del cuerpo del cliente
  no se convierten en fuentes autorizadas.
- Contexto y referencias proceden de mensajes autorizados por el servidor.
- Mensajes antiguos no acreditados permanecen legibles para su propietario,
  pero no se convierten retrospectivamente en fuentes fiables.
- Las correcciones auténticas pueden respaldar respuestas; citas e IDs
  inventados no pasan el validador.
- Los recorridos legítimos mantienen sus contratos, idiomas, modos y cuota.
- Fallos de almacenamiento o pérdida de pertenencia no entregan borradores
  como respuestas guardadas ni cobran preguntas indebidamente.

La suite HTTP aislada comprueba estas propiedades con PostgreSQL temporal
y proveedores simulados. No es una auditoría externa ni una verificación
de la publicación. Seguridad de procedencia no equivale a verdad clínica.

## C: primera entrega acotada

La memoria de trabajo inicial es **extractiva**, no un resumen inferido:

1. Mantener un tramo reciente de diálogo completo.
2. Solo si permite conservar más intervenciones de la persona, recuperar
   intervenciones anteriores completas, en orden y sin saltar una intervención
   del usuario para alcanzar otra más antigua.
3. No guardar hechos nuevos, etiquetar automáticamente diagnósticos o deducir
   que una propuesta del asistente fue aceptada, realizada o útil.
4. Conservar el máximo existente de 8.192 bytes de texto histórico.
5. No cortar un mensaje: una negación al final puede cambiar su significado.
6. Si una corrección extensa no cabe, no atravesarla para recuperar afirmaciones
   anteriores. Informar al modelo y al revisor de las lagunas.
7. Generación y revisión reciben los mismos textos seleccionados.
8. La valoración urgente sigue teniendo acceso al historial autorizado original.
9. No hay persistencia nueva, memoria entre conversaciones, ni llamada adicional.

Esto mejora la disponibilidad de mensajes anteriores frente a respuestas largas
del asistente; **no garantiza recordar todo** ni sustituye un estado semántico
de objetivos/hipótesis/resultados con actualización y evaluación propias.

## D: diseño previo a la comparación

Los casos de `scripts/fixtures/neuropsi-reserved-cases.json` son sintéticos,
separados de los fixtures usados para desarrollar la selección de contexto.
No se ejecutarán contra una IA ni se usarán sus respuestas para ajustar esta
entrega. Al prepararlos se registra un hash del conjunto y del código evaluado.
Están en el repositorio, no son secretos ni una garantía de independencia
respecto del entrenamiento del proveedor.

Al abrir el conjunto para ajustar el producto, esos casos pasan a desarrollo
y debe reservarse otro conjunto antes de hacer una nueva comparación confirmatoria.

### Comparación futura

- Mismo modelo y proveedor efectivos, idioma, modo y escenario en ambos brazos.
- Control: política común de identidad/seguridad y presentación, sin estrategia,
  recuperación científica o revisión de NEUROPSI.
- NEUROPSI: manejador real, incluyendo recuperación y revisión.
- La comparación del producto incluye su política de contexto. No aísla la
  contribución de memoria, recuperación o revisor por separado.
- Casos urgentes conservan la valoración y prioridad de ayuda de ambos brazos.
- No sustituir una respuesta fallida por reintentos ocultos.
- Repeticiones y tamaño de muestra se fijan después de un piloto de desarrollo;
  este pequeño banco reservado no basta para demostrar eficacia o superioridad.
- Dos revisores humanos competentes, al menos uno con experiencia clínica
  pertinente; respuestas A/B ciegas, orden contrabalanceado y desacuerdos registrados.
- Los revisores puntúan 0 (fallo), 1 (parcial), 2 (cumple) o no evaluable:
  atribución, correcciones, continuidad, distinción propuesta/intento/resultado,
  adaptación, proporcionalidad y utilidad. Cada valoración necesita explicación.
- Un fallo grave de seguridad se analiza aparte: no se compensa promediándolo
  con empatía o estilo.
- Registrar falsas aceptaciones/rechazos del revisor, coste y latencia de todas
  las llamadas. Un HTTP exitoso no es una respuesta correcta.
- Analizar por escenario, con incertidumbre y resultados negativos; no tratar
  turnos o repeticiones de un caso como personas independientes.

`scripts/prepare-neuropsi-comparison.ts` prepara únicamente el inventario,
huellas de versión y una plantilla de revisión sin respuestas ni puntuaciones.
No llama al modelo, no solicita credenciales ni habilita ejecución de pago.
No se afirma haber ejecutado la comparación.

## E: especialización posterior

Ampliar o revisar fuentes solo después de clasificar los errores: recuperación
irrelevante, cobertura insuficiente, mala aplicación individual, fuente
desactualizada o revisión incorrecta. Comprobar población y límites, no añadir
bibliografía por volumen. Medir de nuevo con casos de desarrollo y reservar
casos nuevos para una conclusión confirmatoria.

## Publicación

El cierre de B en desarrollo y las regresiones de C no prueban que el despliegue
contenga esta versión. No publicar durante esta entrega. La comprobación
autenticada de producción requiere una decisión y un recorrido separados.
