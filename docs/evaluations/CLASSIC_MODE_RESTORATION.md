# Restitución de la profundidad del modo clásico

## Decisión aprobada

El clásico debe ofrecer explicación desarrollada, orientación práctica y
lecturas verificadas pertinentes, no solo un Q&A más largo. No se restablece
la antigua plantilla obligatoria de diez apartados.

## Ruta activa y corrección

`buildChatPrompt` utiliza `compactChatPresentation`; las plantillas antiguas
con diez apartados permanecen en el archivo, pero no constituyen el contrato
activo enviado al proveedor. No se reactivan ni se hace una limpieza amplia
de código legado dentro de esta corrección.

Se elimina la indicación compartida de tono «breve» y se conserva calidez,
prudencia y la profundidad del modo elegido. Se mantiene toda la lógica
previa de aclarar cuando falta un dato, respetar rechazos y priorizar seguridad.

El clásico orienta a:

- Responder y explicar con subtítulos útiles.
- Desarrollar un ejercicio o paso con objetivo e instrucciones cuando procede
  y se solicita, sin limitarse a ofrecerlo de nuevo.
- Proponer lecturas recuperadas y verificadas cuando aportan valor; no
  inventar libros, enlaces, materiales internos o cuotas bibliográficas.
- Respetar escucha, brevedad solicitada y continuidad; no forzar todos los
  apartados ni una pregunta al final.
- No convertir una preocupación alimentaria en dietas, control de peso,
  recuento de calorías o ejercicio compensatorio.

Generador y revisor comparten `chatModeStyle`. Una corrección de respaldo
debe conservar la estructura y contenido útil del borrador, no resumirlo
automáticamente. Los contratos breve y burbujas conservan sus textos de
presentación. No cambian modelos, llamadas por turno, límites de salida,
presupuesto mensual, motor científico, interfaz ni almacenamiento.
Las instrucciones desarrolladas añaden tokens de entrada; conservar límites
de salida y presupuesto no implica prometer el mismo coste exacto por turno.

## Verificación y límites

`scripts/test-chat-classic-mode.ts` comprueba la ruta real con proveedor
simulado: siete contrastes en tres modos, ES/EN/FR, escucha, rechazo previo,
conducta alimentaria, urgencias, contrato común con el revisor y preservación
de subtítulos/pasos al aceptar o corregir una salida. Comprueba también que
no se introducen reglas del clásico en el contrato de los otros modos.

Los contrastes no copian el relato personal aportado por el usuario.
Se añaden a las regresiones de política, conversación, evidencia y revisión.

No se generan respuestas reales de pago ni se publica esta corrección.
La simulación verifica integración, no demuestra calidad de los ejercicios,
seguridad clínica ni que el modelo haya recuperado su estilo. Esa valoración
necesita leer respuestas reales con autorización previa de consumo.

El límite existente del revisor sigue siendo 1600 tokens, compartidos entre
informe y eventual reescritura; no se promete longitud ilimitada y no se
incrementa este techo ni el coste máximo de salida sin una decisión aparte.
