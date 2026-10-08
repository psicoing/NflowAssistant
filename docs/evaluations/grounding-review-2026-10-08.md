# Comprobación interna del respaldo de las respuestas

## Qué se ha implementado

En turnos no urgentes, después de generar el borrador y resolver las citas:

1. Se construye un contexto de revisión a partir del mismo historial acotado,
   el mensaje actual, tres campos del perfil ya usados por el chat y los
   fragmentos científicos recuperados para ese turno.
2. Se separan autores: usuario, asistente, perfil declarado y fuentes científicas.
   Los mensajes del asistente no acreditan hechos de la persona.
3. Una segunda petición a la misma IA revisa el respaldo semántico: sujeto,
   negación, correcciones, tiempo, alcance, hipótesis y límites de la evidencia.
4. El revisor conserva el borrador o propone una versión corregida. Sus
   afirmaciones relevantes se vinculan a fragmentos concretos.
5. El servidor comprueba formato, identificadores existentes, citas literales,
   correspondencia con el texto final y tipos de fuente. Rechaza referencias
   inventadas, hechos personales basados solo en mensajes del asistente,
   URLs no suministradas e identificadores privados dentro de la respuesta.
6. Solo se devuelve texto al chat. Las referencias internas no se almacenan
   en la conversación ni se presentan como porcentajes o etiquetas al usuario.

Los estados sobre la persona son relato, hipótesis, posibilidad e información
insuficiente. Se distingue además información científica general: no equivale
a una causa individual demostrada ni a una verificación externa del relato.
La psicoeducación orientativa sin documento recuperado tiene una categoría
separada: no se rechaza solo por faltar bibliografía ni se declara verificada.
Esa categoría no autoriza hechos personales, diagnósticos, cifras, eficacia
demostrada o derechos legales.

## Seguridad y fallos

Las señales urgentes del contexto original o una respuesta clasificada como
crisis por el generador evitan la segunda petición. La ayuda humana no espera
a esta revisión. Se corrigió el detector para reconocer adjetivos en “dolor
fuerte/intenso/repentino/insoportable en el pecho”.

Si el informe de revisión es inválido, no se entrega el borrador. Se muestra
un aviso automático localizado, sin consumir una pregunta del cliente y sin
afirmar por ello que la IA esté desactivada. Las interrupciones de proveedor
y presupuesto mantienen el tratamiento existente.

No se recupera memoria entre chats, no se guardan razonamientos privados y
no se envían campos arbitrarios del perfil al revisor.

## Coste y latencia

La revisión normal añade una llamada al mismo router y contabilidad mensual,
con un máximo de 1.600 tokens de salida. No se modifica el modelo, proveedor,
presupuesto ni precios de los planes. El evaluador incorpora ambas llamadas
en su estimación conservadora y mantiene su techo de 3 USD por ejecución.

El texto revisable tiene un límite de 12.000 bytes; no se trunca silenciosamente.
Una salida mayor se trata como revisión no verificable. Todo el contexto de
revisión cuenta dentro del límite total de entrada existente.

No es gratis ni inmediata. En la muestra real del flujo completo, generar y
revisar tardó unos 26 segundos. Los dos ensayos directos del revisor tardaron
aproximadamente 12 y 10 segundos. No son garantías ni un benchmark de latencia.
Si el presupuesto no permite revisar, no se entrega el borrador sin revisión:
puede haber coste del proveedor por la generación inicial sin consumir una
pregunta del cliente.

## Pruebas

### Offline

- Validación de autores, IDs, fragmentos, texto final y estados.
- Referencias inexistentes, citas falsas, informes inválidos y enlaces inventados.
- Datos del perfil excluidos, etiquetas internas no expuestas y aviso localizado.
- Integración real con el manejador y un router simulado: salida corregida,
  bloqueo de borrador no revisado, pregunta no consumida y prioridad urgente.
- Política existente: tres modos y nueve idiomas, presupuesto y fallos.
- Evidencia existente: treinta escenarios por tres modos.
- TypeScript y comprobación del diff.

Los simuladores de las suites antiguas ahora aceptan explícitamente sus
respuestas ficticias en el límite de revisión. Eso comprueba transporte y
compatibilidad, **no respaldo semántico de respuestas reales**.

### Revisor real con borradores deliberadamente incorrectos

Informe: `.local/evaluations/grounding-2026-10-08T10-11-33-660Z.json`.
Se repitieron ambos casos después de la última ampliación de categorías:
`.local/evaluations/grounding-2026-10-08T10-36-53-045Z.json`.
Ambos volvieron a corregirse: la explicación francesa quedó como hipótesis
basada en la preparación relatada, no en pareja o trauma; el cansancio dejó
de presentarse como diagnóstico confirmado por la OMS.

1. **Conflicto de pareja y trauma infantil inventados — francés.** La persona
   había corregido que no tenía pareja y relataba falta de preparación. El
   revisor decidió corregir, eliminó la causalidad inventada y vinculó los
   datos usados a los mensajes U1 y U3. La propuesta de preparación se formuló
   como posibilidad, no resultado garantizado.
2. **Una fuente real usada para “demostrar” depresión — español.** El fragmento
   general de la OMS no justificaba un diagnóstico individual. El revisor
   decidió corregir y dejó de presentar el cansancio como prueba de depresión.
   La corrección conserva orientación profesional, pero el aviso condicional
   de riesgo podría requerir más proporcionalidad.

### Flujo completo real

Informe:
`.local/evaluations/conversation-certainty-grounding-after-2026-10-08T10-11-59-470Z.json`.

Se completó generación y revisión con una respuesta de IA sobre el relato de
humillación laboral, sin confirmar que el jefe quisiera destruir a la persona.
No se considera resuelta toda la precisión de estilo: la respuesta todavía usa
“el hecho claro” y añade interpretaciones y orientación que merecen evaluación
de proporcionalidad.

### Control positivo sin documentos recuperados

Informe: `.local/evaluations/grounding-2026-10-08T10-33-29-620Z.json`.
El revisor conservó la definición general de refuerzo positivo, la clasificó
como orientación general no documentada en ese turno y no inventó referencias.
La petición tardó unos cinco segundos. No se evalúa su eficacia como tratamiento.

Las estimaciones conservadoras del flujo completo, el control positivo y los
ensayos directos iniciales sumaban unos 2,94 USD. La repetición de los dos
ensayos directos tras cambiar las instrucciones tenía otro máximo de 1,17 USD.
Cada ejecución mantuvo su techo de 3 USD y el presupuesto mensual del chat.
Estas cifras **no son el gasto real facturado**.

## Límites importantes

- Encontrar un ID o cita no demuestra implicación semántica. Esa parte depende
  de otro pase del mismo modelo, que puede equivocarse.
- El revisor puede omitir una afirmación, aceptar una inferencia excesiva,
  rechazar una respuesta válida o introducir contenido durante la corrección.
- La corrección y su mapa de afirmaciones se producen en una misma petición:
  no hay un tercer pase independiente que certifique la versión corregida.
- El mapa se limita a ocho afirmaciones relevantes, no a cada palabra.
- Las fuentes son fragmentos/síntesis disponibles, no obras completas leídas
  en directo ni verificación externa de hechos personales.
- No hay probabilidades calibradas, evaluación clínica independiente,
  superioridad demostrada ni garantía de ausencia de alucinaciones.

## Comandos

```sh
npx tsx scripts/test-chat-grounding.ts
npx tsx scripts/test-chat-grounding-integration.ts

# Inventario sin IA de pago:
npx tsx scripts/evaluate-chat-grounding.ts

# Dos ensayos del revisor; requiere opt-in de gasto:
npx tsx scripts/evaluate-chat-grounding.ts --live

# Solo el control positivo, sin repetir los ensayos negativos:
npx tsx scripts/evaluate-chat-grounding.ts --general-only --live

# Una muestra del flujo completo con coste de ambas llamadas:
npx tsx scripts/evaluate-chat-conversation.ts --certainty --live --limit=1 --label=grounding-after
```
