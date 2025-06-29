/**
 * Utilidades para la gestión inteligente de prompts
 * 
 * Este módulo implementa funciones para mejorar la calidad de las respuestas del asistente
 * mediante la selección dinámica de ejemplos relevantes según el contexto de la consulta.
 */

export type ExampleCategory = 
  | 'ansiedad_adolescente' 
  | 'comportamiento_padres' 
  | 'caso_profesional' 
  | 'autoestima_adolescente'
  | 'salud_mental_laboral'
  | 'riesgo_psicosocial'
  | 'apoyo_cancer_adultos'
  | 'apoyo_cancer_ninos'
  | 'general';

export interface Example {
  category: ExampleCategory;
  keywords: string[];
  userPrompt: string;
  response: string;
}

export const examples: Example[] = [
  {
    category: 'ansiedad_adolescente',
    keywords: ['examen', 'exámenes', 'bloqueo', 'ansiedad', 'nervios', 'estudiar', 'suspender', 'instituto', 'colegio', 'presentación', 'exponer'],
    userPrompt: "No puedo con los exámenes, me bloqueo y me pongo a temblar. Creo que voy a suspender todo.",
    response: "Es totalmente comprensible sentir esa presión y ese miedo ante los exámenes. Muchos estudiantes experimentan bloqueos similares y es una respuesta natural de nuestro cuerpo ante situaciones que percibimos como amenazantes.\n\nLa ansiedad ante exámenes está relacionada con nuestro sistema de 'lucha o huida', que activa respuestas físicas como el temblor o la sensación de bloqueo mental. Es como si nuestro cerebro estuviera tan centrado en la 'amenaza' que olvida que realmente sí sabemos las cosas.\n\n**Estrategias que puedes probar:**\n\n1. **Técnicas de respiración:** Antes del examen, prueba la respiración 4-7-8: inhala 4 segundos, mantén 7, exhala 8. Esto calma el sistema nervioso.\n\n2. **Preparación gradual:** Estudia en bloques de 25-30 minutos con descansos. Esto evita la sobrecarga y mejora la retención.\n\n3. **Simulacros de examen:** Practica en condiciones similares al examen real para que tu cerebro se acostumbre.\n\n4. **Diálogo interno positivo:** Cambia 'voy a suspender' por 'he estudiado y haré mi mejor esfuerzo'.\n\nRecuerda que un examen no define tu valor como persona. Es solo una evaluación de conocimientos en un momento específico. ¿Has notado si hay algún patrón específico en cuanto a materias o tipos de examen donde sientes más ansiedad?"
  },
  {
    category: 'comportamiento_padres',
    keywords: ['hija', 'hijo', 'aislarse', 'habitación', 'adolescente', 'enfado', 'rebelde', 'comunicación', 'no habla', 'no me habla', 'encerrado', 'encerrada'],
    userPrompt: "Mi hija de 15 años ha empezado a aislarse completamente. Antes era sociable y ahora apenas sale de su habitación. No sé cómo acercarme a ella sin que se enfade más.",
    response: "Entiendo su preocupación y frustración. Ver un cambio tan notable en el comportamiento de su hija puede ser desconcertante y doloroso, especialmente cuando los intentos de acercamiento parecen empeorar la situación.\n\nEn la adolescencia media (14-16 años), es normal cierto grado de distanciamiento como parte del proceso de construcción de identidad. Sin embargo, un aislamiento repentino y marcado puede indicar que está procesando dificultades emocionales que no sabe cómo expresar.\n\n**Estrategias de acercamiento respetuoso:**\n\n1. **Respete sus espacios:** Toque la puerta antes de entrar y pídale permiso. Esto muestra respeto por su privacidad en desarrollo.\n\n2. **Comunicación indirecta:** Deje notas cariñosas bajo la puerta, prepare su comida favorita sin condiciones, o comparta actividades paralelas (estar en la misma habitación sin presionar para hablar).\n\n3. **Timing adecuado:** Busque momentos neutros como viajes en coche o actividades rutinarias para conversaciones ligeras.\n\n4. **Escucha activa:** Cuando hable, evite dar consejos inmediatos. Primero valide sus emociones: 'Entiendo que esto debe ser difícil para ti'.\n\n5. **Mantenga rutinas familiares:** Cenas juntos, actividades familiares opcionales pero consistentes.\n\n**Señales de alarma a vigilar:** Si el aislamiento se acompaña de cambios en el sueño, alimentación, rendimiento académico drástico, o menciones de autolesión, considere apoyo profesional.\n\n¿Ha notado si hay algún evento específico que coincida con el inicio de este cambio? A veces identificar el desencadenante puede ayudar a abordar el problema de raíz."
  },
  {
    category: 'caso_profesional',
    keywords: ['orientador', 'instituto', 'alumno', 'disruptivo', 'TDAH', 'TDA', 'profesora', 'docente', 'conducta', 'comportamiento', 'diagnóstico', 'evaluación', 'derivación'],
    userPrompt: "Trabajo como orientador en un instituto y tenemos un alumno de 16 años con comportamientos disruptivos recurrentes. Alterna entre participación brillante y confrontación directa con profesores. Sospecho que podría haber un TDAH no diagnosticado.",
    response: "Su observación sobre la inconsistencia conductual es clínicamente relevante y alineada con la presentación heterogénea que caracteriza al TDAH en adolescentes, especialmente cuando ha pasado desapercibido durante años.\n\nEl patrón que describe (alternancia entre brillantez y disrupción) es consistente con las fluctuaciones atencionales y de autorregulación emocional propias del trastorno por déficit de atención, especialmente en adolescentes con alto potencial cognitivo que han desarrollado estrategias compensatorias.\n\n**Protocolo de evaluación sugerido:**\n\n1. **Recogida de datos sistemática:**\n   - Registros de observación conductual en diferentes contextos\n   - Cuestionarios para profesores (ADHD Rating Scale-IV)\n   - Entrevista con la familia sobre desarrollo evolutivo\n   - Revisión del expediente académico histórico\n\n2. **Análisis de patrones específicos:**\n   - ¿La disrupción aumenta en tareas monótonas vs. estimulantes?\n   - ¿Hay diferencias según la estructura de la clase?\n   - ¿La confrontación surge tras frustraciones académicas específicas?\n\n3. **Intervención educativa inmediata:**\n   - Implementar descansos estructurados\n   - Asignar responsabilidades que canalicen su energía\n   - Comunicación previa con profesores sobre estrategias específicas\n\n4. **Derivación especializada:** Coordinar con neuropsicólogo o psiquiatra infantil para evaluación diagnóstica formal.\n\n**Consideración importante:** En adolescentes, el TDAH no diagnosticado puede manifestarse como problemas de conducta secundarios debido a la frustración crónica y baja autoestima académica.\n\n¿Ha observado si hay materias o momentos del día donde la disrupción es más frecuente? Esta información puede ser clave para el proceso diagnóstico."
  },
  {
    category: 'autoestima_adolescente',
    keywords: ['odio', 'no valgo', 'mejor que yo', 'nadie me quiere', 'feo', 'fea', 'gordo', 'gorda', 'fracaso', 'inútil', 'tonto', 'tonta', 'autoestima', 'comparación'],
    userPrompt: "Me odio, no valgo para nada. Todos mis amigos son mejores que yo en todo y nadie me quiere realmente.",
    response: "Puedo sentir lo doloroso que es para ti experimentar estos pensamientos tan negativos sobre ti mismo. Es realmente difícil cargar con esos sentimientos, y quiero que sepas que te escucho y que tu sufrimiento es válido.\n\nLo que estás experimentando es muy común durante la adolescencia, cuando nuestra identidad está en formación y tendemos a compararnos constantemente con los demás. El cerebro adolescente está especialmente sensible a la comparación social, pero esto no hace que tus sentimientos sean menos reales o importantes.\n\n**Vamos a trabajar en cambiar esa narrativa interna:**\n\n1. **Reconoce el sesgo de comparación:** Tendemos a comparar nuestro 'interior' (con todas nuestras inseguridades) con el 'exterior' de otros (que solo muestra lo mejor).\n\n2. **Identifica tus fortalezas únicas:** Haz una lista de 3 cosas que haces bien, por pequeñas que sean. Puede ser escuchar a otros, ser creativo, ser leal...\n\n3. **Desafía pensamientos absolutos:** Cuando pienses 'no valgo para nada', pregúntate: '¿Es esto 100% cierto? ¿Hay alguna evidencia que contradiga este pensamiento?'\n\n4. **Construye autocompasión:** Trata de hablarte como le hablarías a tu mejor amigo que está pasando por lo mismo.\n\n**Tu valor como persona no depende de ser 'mejor' que otros.** Cada persona tiene su propio camino, ritmo y circunstancias únicas.\n\nEs importante que sepas que estos pensamientos pueden mejorar significativamente con apoyo adecuado. ¿Has considerado hablar con algún adulto de confianza sobre cómo te sientes? A veces, tener perspectiva externa puede ayudar mucho.\n\n¿Hay algún momento específico del día o situación donde estos pensamientos son más intensos?"
  },
  {
    category: 'salud_mental_laboral',
    keywords: ['estresado trabajo', 'agotado curro', 'burnout', 'ansiedad trabajo', 'no duermo trabajo', 'presión laboral', 'horario trabajo', 'jefe estres', 'trabajo mental'],
    userPrompt: "En mi trabajo me siento muy estresado, mi jefe me hace la vida imposible y no puedo dormir",
    response: "Lo que describes podría estar vinculado a un **riesgo psicosocial** en tu entorno laboral. Según la norma ISO 45003, esto se considera un factor importante a gestionar para proteger tu salud mental.\n\n**🔍 Análisis de la situación:**\nTus síntomas (estrés, insomnio, conflictos con autoridad) pueden indicar:\n• Carga de trabajo inadecuada\n• Falta de apoyo social en el trabajo\n• Acoso, hostigamiento o trato injusto\n• Inseguridad laboral o ambiente tóxico\n\n**📋 Guía práctica en 5 pasos:**\n\n1. **Evalúa tus síntomas**: ¿Te afecta emocional, física o cognitivamente?\n2. **Identifica situaciones concretas** que generan el malestar\n3. **Registra patrones** en un diario breve (fechas, situaciones, reacciones)\n4. **Conoce tus derechos laborales** - tienes derecho a un ambiente seguro\n5. **Si el daño persiste**, considera consulta psicológica o mediación laboral\n\n¿Te gustaría que profundicemos en alguno de estos pasos o necesitas orientación sobre cómo documentar estas situaciones?"
  },
  {
    category: 'riesgo_psicosocial',
    keywords: ['mobbing', 'acoso laboral', 'hostigamiento', 'trato injusto', 'discriminación trabajo', 'ambiente tóxico', 'presión excesiva', 'maltrato laboral', 'exclusión trabajo'],
    userPrompt: "Creo que me hacen mobbing en el trabajo, me excluyen de todo y me asignan tareas imposibles",
    response: "**⚠️ Situación de Riesgo Psicosocial Detectada**\n\nLo que describes presenta características de **acoso laboral (mobbing)**, que según la ISO 45003 es un riesgo psicosocial grave que debe ser abordado.\n\n**🔹 Indicadores que mencionas:**\n• Exclusión sistemática (aislamiento social)\n• Asignación de tareas imposibles (sobrecarga/infrautilización)\n• Patrón repetitivo de comportamientos hostiles\n\n**📋 Plan de Acción Inmediato:**\n\n1. **Documentación rigurosa**:\n   - Fechas, horas, testigos de cada incidente\n   - Emails, mensajes, instrucciones escritas\n   - Impacto en tu salud y rendimiento\n\n2. **Comunicación formal**:\n   - Reporta a Recursos Humanos por escrito\n   - Solicita mediación o investigación interna\n   - Conserva copias de toda comunicación\n\n3. **Protección legal**:\n   - Conoce el protocolo anti-acoso de tu empresa\n   - Considera asesoría legal laboral\n   - Derecho a ambiente libre de acoso\n\n4. **Cuidado personal**:\n   - Busca apoyo psicológico especializado\n   - Mantén redes de apoyo externas\n   - Técnicas de manejo del estrés\n\n**¿Necesitas ayuda específica para documentar la situación o información sobre tus derechos laborales?**"
  },
  {
    category: 'apoyo_cancer_adultos',
    keywords: ['cáncer', 'cancer', 'tumor', 'oncología', 'quimioterapia', 'radioterapia', 'diagnóstico', 'metástasis', 'tratamiento', 'biopsia', 'remisión', 'miedo', 'muerte'],
    userPrompt: "Me han diagnosticado cáncer y tengo mucho miedo. No sé cómo afrontar esto, siento que se me viene el mundo encima.",
    response: "Lo que estás viviendo es extraordinariamente duro, y es completamente normal sentir miedo, confusión y que todo se tambalee. Un diagnóstico de cáncer cambia todo en un instante, y aún así estás aquí, buscándote un momento de apoyo. Eso ya es valiente.\n\nNo voy a decirte que todo irá bien, porque no lo sé, y sería injusto minimizar lo que estás sintiendo. Lo que sí puedo decirte es que estás en derecho de sentir todo lo que sientes: miedo, rabia, tristeza, incertidumbre. Son emociones válidas ante una situación que nadie debería tener que enfrentar.\n\n**Estrategias para hoy, para este momento:**\n\n• **Respira conmigo:** Cuando el miedo sea muy intenso, centra tu atención en respirar despacio. Inhala contando hasta 4, mantén hasta 4, exhala hasta 6. Es una forma de decirle a tu cuerpo que, ahora mismo, estás a salvo.\n\n• **Un día a la vez:** No tienes que cargar con todo el futuro hoy. Solo tienes que llegar al final de este día, y después al siguiente.\n\n• **Busca tu refugio interno:** ¿Hay algún lugar, real o imaginario, donde te sientes en paz? Puede ser un recuerdo, una canción, una imagen. Guárdalo como un lugar al que volver cuando necesites calma.\n\n• **Conecta con lo que importa:** Si hay personas que amas, permítete sentir esa conexión. Si hay pequeñas cosas que aún te dan placer, date permiso para disfrutarlas.\n\n**Tu dignidad permanece intacta.** El cáncer puede atacar tu cuerpo, pero no puede quitarte quién eres en esencia.\n\n¿Quieres que hablemos de alguna técnica específica para manejar la ansiedad, o hay algo en particular que te está costando más procesar ahora mismo?"
  },
  {
    category: 'apoyo_cancer_ninos',
    keywords: ['cáncer niño', 'cancer niña', 'tumor infantil', 'leucemia', 'hijo cáncer', 'hija cáncer', 'hospital', 'tratamiento niños', 'niño enfermo', 'niña enferma'],
    userPrompt: "Mi hijo de 8 años tiene cáncer y no sé cómo explicárselo. Él pregunta por qué está siempre cansado y por qué viene tanto al hospital.",
    response: "Hola, soy Lumo, un perrito muy especial que acompaña a familias valientes como la tuya. He escuchado que tu pequeño guerrero está luchando contra un dragón muy travieso que se llama cáncer, y que tanto él como tú necesitáis un poco de magia para hacer este camino menos pesado.\n\nPrimero, quiero decirte algo importante: tu hijo tiene un escudo invisible muy poderoso, y ese escudo eres tú. Tu amor, tu presencia, tu fortaleza son su mayor protección.\n\n**Para hablar con tu pequeño:**\n\n• **Usa su lenguaje:** 'Hay unas células traviesas en tu cuerpo que se han vuelto un poco locas, como si fueran soldaditos que se olvidaron de las reglas. Los médicos son como superhéroes que conocen trucos especiales para ayudar a que esos soldaditos vuelvan a portarse bien.'\n\n• **Valida su cansancio:** 'Es normal que te sientas cansado, pequeño valiente. Tu cuerpo está trabajando muy duro por dentro, como cuando corres mucho y necesitas descansar.'\n\n• **El hospital como lugar seguro:** 'El hospital es como una base secreta donde los superhéroes médicos tienen todas sus herramientas mágicas para ayudarte. Es normal venir aquí seguido porque quieren asegurarse de que todo vaya bien.'\n\n• **Permítele expresarse:** Algunos días querrá jugar a ser médico, otros días querrá llorar. Todo está bien.\n\n**Actividades que pueden ayudar:**\n- Crear una 'capa de superhéroe' para los días de tratamiento\n- Un diario de aventuras donde dibuje cómo se siente\n- Contar cuentos donde él sea el héroe de su propia historia\n\n¿Te gustaría que creemos juntos algún juego especial para los días más difíciles? Los niños tienen una magia especial para encontrar luz incluso en los momentos más oscuros."
  },
  {
    category: 'general',
    keywords: ['ayuda', 'consejo', 'problema', 'dificultad', 'situación', 'mejorar', 'superar', 'aprender', 'entender', 'manejar'],
    userPrompt: "Estoy atravesando un momento difícil y no sé cómo manejar la situación. ¿Me puedes dar algún consejo?",
    response: "Gracias por compartir que estás pasando por un momento difícil. Reconocer que necesitamos apoyo ya es un gran primer paso y muestra tu fortaleza interior.\n\nSin conocer los detalles específicos de tu situación, puedo ofrecerte algunas estrategias generales que suelen ser útiles cuando enfrentamos dificultades:\n\n**1. Autocuidado básico:** Asegúrate de mantener rutinas de sueño, alimentación y actividad física, ya que nuestro bienestar emocional está directamente conectado con nuestro bienestar físico.\n\n**2. Expresión emocional:** Encuentra formas saludables de procesar tus emociones: escribir en un diario, hablar con alguien de confianza, arte, música, o ejercicio.\n\n**3. Mindfulness y respiración:** Técnicas simples como la respiración consciente pueden ayudarte a mantenerte centrado en el presente y reducir la ansiedad.\n\n**4. Red de apoyo:** No tengas miedo de buscar ayuda en familiares, amigos, o profesionales. Todos necesitamos apoyo en diferentes momentos de la vida.\n\n**5. Perspectiva temporal:** Recuerda que las situaciones difíciles son temporales, aunque en el momento no lo parezcan.\n\n**6. Pequeños pasos:** En lugar de intentar resolver todo de una vez, identifica una pequeña acción que puedas tomar hoy para mejorar tu situación.\n\nSi te sientes cómodo compartiendo más detalles sobre lo que estás atravesando, puedo ofrecerte consejos más específicos y personalizados para tu situación particular.\n\n¿Hay algún aspecto específico de tu situación actual donde sientes que necesitas más apoyo o claridad?"
  }
];

/**
 * Función que selecciona ejemplos relevantes basados en el mensaje del usuario
 * @param userMessage Mensaje del usuario
 * @param maxExamples Número máximo de ejemplos a devolver
 * @returns Ejemplos relevantes formateados para el prompt
 */
export function selectRelevantExamples(userMessage: string, maxExamples: number = 2): string {
  try {
    // Validación de entrada
    if (!userMessage || typeof userMessage !== 'string') {
      console.log("Mensaje inválido en selectRelevantExamples, usando ejemplo por defecto");
      return getDefaultExample();
    }
    
    // Ajustar maxExamples si es inválido
    if (typeof maxExamples !== 'number' || maxExamples < 1) {
      maxExamples = 2;
    }
    
    const normalizedMessage = userMessage.toLowerCase();
    
    // Calcular puntuaciones de relevancia para cada categoría
    const relevanceScores: {category: ExampleCategory, score: number}[] = [];
    
    // Calculamos la relevancia de cada categoría según las palabras clave
    for (const example of examples) {
      try {
        if (!Array.isArray(example.keywords)) continue;
        
        const keywordMatches = example.keywords.filter(keyword => {
          try {
            return typeof keyword === 'string' && normalizedMessage.includes(keyword.toLowerCase());
          } catch (e) {
            return false;
          }
        }).length;
        
        // Si ya tenemos una puntuación para esta categoría, actualizamos si es mayor
        const existingCategoryIndex = relevanceScores.findIndex(
          score => score.category === example.category
        );
        
        if (existingCategoryIndex === -1) {
          // Si la categoría no existe en nuestras puntuaciones, la añadimos
          relevanceScores.push({
            category: example.category,
            score: keywordMatches
          });
        } else if (keywordMatches > relevanceScores[existingCategoryIndex].score) {
          // Si ya existe, actualizamos la puntuación si es mayor
          relevanceScores[existingCategoryIndex].score = keywordMatches;
        }
      } catch (error) {
        console.error("Error al procesar ejemplo:", error);
        continue;
      }
    }
    
    // Ordenar las categorías por relevancia (mayor a menor)
    relevanceScores.sort((a, b) => b.score - a.score);
    
    // Seleccionar los ejemplos más relevantes, uno por categoría
    const selectedExamples: Example[] = [];
    for (const relevance of relevanceScores) {
      if (selectedExamples.length >= maxExamples) break;
      if (relevance.score > 0) {
        try {
          // Encontrar el mejor ejemplo de esta categoría
          const categoryExamples = examples.filter(e => e.category === relevance.category);
          if (categoryExamples.length > 0) {
            selectedExamples.push(categoryExamples[0]); // Tomamos el primer ejemplo de esta categoría
          }
        } catch (error) {
          console.error("Error al seleccionar ejemplo de categoría:", error);
          continue;
        }
      }
    }
    
    // Si no tenemos suficientes ejemplos relevantes, añadimos el ejemplo general
    if (selectedExamples.length === 0) {
      return getDefaultExample();
    }
    
    // Formatear los ejemplos seleccionados para el prompt
    try {
      const formattedExamples = selectedExamples.map(example => {
        try {
          return `==== ${getCategoryTitle(example.category)} ====
Usuario: "${example.userPrompt}"

NFLOW: "${example.response}"
`;
        } catch (e) {
          console.error("Error al formatear ejemplo específico:", e);
          return "";
        }
      }).filter(text => text.length > 0).join('\n');
      
      // Si no pudimos formatear ningún ejemplo, devolver el ejemplo por defecto
      if (!formattedExamples) {
        return getDefaultExample();
      }
      
      return formattedExamples;
    } catch (error) {
      console.error("Error al formatear ejemplos:", error);
      return getDefaultExample();
    }
  } catch (error) {
    console.error("Error general en selectRelevantExamples:", error);
    return getDefaultExample();
  }
}

/**
 * Devuelve un ejemplo general para casos sin coincidencias específicas
 */
function getDefaultExample(): string {
  try {
    const generalExample = examples.find(e => e.category === 'general');
    
    // Verificar que el ejemplo general existe y tiene las propiedades necesarias
    if (!generalExample || 
        !generalExample.userPrompt || 
        !generalExample.response) {
      // Si no hay ejemplo general válido, devolver un ejemplo hardcodeado
      return `==== CONSULTA GENERAL ====
Usuario: "Estoy atravesando un momento difícil y no sé cómo manejar la situación. ¿Me puedes dar algún consejo?"

NFLOW: "Gracias por compartir que estás pasando por un momento difícil. Reconocer que necesitamos apoyo ya es un gran primer paso y muestra tu fortaleza interior. Puedo ofrecerte algunas estrategias generales: 1) Mantén rutinas básicas de autocuidado, 2) Encuentra formas de expresar tus emociones de manera saludable, 3) Recuerda que las situaciones difíciles son temporales. Estoy aquí para escucharte si quieres compartir más detalles."
`;
    }
    
    // Devolver el ejemplo general encontrado
    return `==== CONSULTA GENERAL ====
Usuario: "${generalExample.userPrompt}"

NFLOW: "${generalExample.response}"
`;
  } catch (error) {
    console.error("Error en getDefaultExample:", error);
    // Devolver un ejemplo de respaldo en caso de error
    return `==== CONSULTA GENERAL ====
Usuario: "Necesito ayuda con mi bienestar emocional"

NFLOW: "Comprendo que estás buscando apoyo para tu bienestar emocional. Es importante reconocer que cuidar nuestra salud mental es tan fundamental como cuidar nuestra salud física. Te sugiero empezar con técnicas de mindfulness, establecer rutinas saludables y buscar conexiones sociales positivas. Recuerda que pedir ayuda es un signo de fortaleza, no de debilidad."
`;
  }
}

/**
 * Convierte una categoría de ejemplo en un título legible
 */
function getCategoryTitle(category: ExampleCategory): string {
  try {
    if (!category || typeof category !== 'string') {
      return 'EJEMPLO RELEVANTE';
    }
    
    switch (category) {
      case 'ansiedad_adolescente':
        return 'ADOLESCENTE CON ANSIEDAD ACADÉMICA';
      case 'comportamiento_padres':
        return 'PADRE PREOCUPADO POR COMPORTAMIENTO';
      case 'caso_profesional':
        return 'PROFESIONAL EDUCATIVO CON CASO COMPLEJO';
      case 'autoestima_adolescente':
        return 'ADOLESCENTE CON PROBLEMAS DE AUTOESTIMA';
      case 'salud_mental_laboral':
        return 'BIENESTAR LABORAL';
      case 'riesgo_psicosocial':
        return 'RIESGO PSICOSOCIAL';
      case 'apoyo_cancer_adultos':
        return 'APOYO EMOCIONAL ONCOLÓGICO - ADULTOS';
      case 'apoyo_cancer_ninos':
        return 'APOYO EMOCIONAL ONCOLÓGICO - NIÑOS';
      case 'general':
        return 'CONSULTA GENERAL';
      default:
        return 'EJEMPLO RELEVANTE';
    }
  } catch (error) {
    console.error("Error en getCategoryTitle:", error);
    return 'EJEMPLO RELEVANTE';
  }
}