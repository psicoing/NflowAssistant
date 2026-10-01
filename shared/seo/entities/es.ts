import type { InternationalPage } from "../types";

type Draft = Omit<InternationalPage, "market" | "path" | "publishedAt" | "updatedAt">;

const source = (label: string, href: string) => ({ label, href });
const section = (heading: string, paragraphs: string[], bullets?: string[]) => ({ heading, paragraphs, ...(bullets ? { bullets } : {}) });
const guides = ["wellbeing", "anxiety", "sleep-stress", "work-stress", "grief", "loneliness", "self-esteem", "relationship-breakup", "boundaries", "teen-anxiety", "emotional-exhaustion", "family-conflicts"];

export const esPages: Draft[] = [
    {
      id: "home",
      title: "NUXA: información sobre apoyo emocional digital",
      description:
        "Un centro de información sobre NUXA, sus límites, su enfoque psicoeducativo, la evidencia disponible y las vías para personas y organizaciones.",
      h1: "Información clara sobre NUXA y el apoyo emocional digital",
      summary:
        "Este espacio institucional explica qué es NUXA, cómo funciona su herramienta conversacional con IA, qué sabemos —y qué no— sobre su evidencia, y dónde encontrar información para distintos públicos. No es la página comercial ni una vía de atención clínica.",
      sections: [
        section("Qué es NUXA", [
          "NUXA es una plataforma digital de apoyo emocional y psicoeducación desarrollada por EMPORDAJOBS SL, sociedad con sede en Portbou, Girona, España, según su aviso legal público. Su herramienta conversacional utiliza inteligencia artificial para facilitar reflexión guiada e información general.",
          "El sitio también reúne recursos educativos y contenidos sobre bienestar emocional. Esta descripción informa sobre la naturaleza del servicio; no acredita que NUXA sea un servicio sanitario ni que sus respuestas sean evaluación profesional.",
        ]),
        section("Cómo leer la información de este sitio", [
          "Las páginas sobre funcionamiento, ciencia y seguridad explican por separado el diseño declarado y sus límites. La guía de privacidad resume dónde consultar la política legal vigente en español; no la sustituye ni crea condiciones para otros países.",
          "Los materiales temáticos tratan preocupaciones cotidianas desde una perspectiva general. Son un punto de partida para informarse, no instrucciones clínicas personalizadas ni una promesa de resultados.",
        ]),
        section("Para quién se ofrece información", [
          "Personas y familias pueden consultar recursos para comprender experiencias emocionales y decidir qué tipo de apoyo buscar. La información para organizaciones y profesionales describe posibles usos informativos, sin afirmar resultados organizativos o clínicos demostrados.",
          "El idioma de este portal institucional no significa que toda la aplicación esté traducida. Algunas pantallas, avisos o flujos de la aplicación pueden seguir disponibles únicamente en español; comprueba el idioma de cada servicio antes de usarlo.",
        ]),
        section("Alcance y situaciones urgentes", [
          "NUXA no diagnostica, no ofrece tratamiento médico o psicológico, no sustituye a una consulta con profesionales cualificados y no es un servicio de crisis. No esperes una respuesta de la plataforma si existe peligro inmediato.",
          "En España, llama al 112 ante una emergencia inmediata. Si hay pensamientos suicidas, puedes llamar al 024, línea pública de atención a la conducta suicida; no sustituye los servicios de emergencia cuando hay peligro inminente.",
        ]),
      ],
      faqs: [
        {
          question: "¿NUXA es un servicio de atención psicológica?",
          answer:
            "NUXA es una herramienta digital de apoyo emocional y psicoeducación con IA, no una consulta psicológica ni un tratamiento. Si necesitas evaluación o atención clínica, contacta con un profesional sanitario.",
        },
        {
          question: "¿Dónde se explica quién está detrás de NUXA?",
          answer:
            "El aviso legal público identifica a EMPORDAJOBS SL como responsable de la plataforma y ofrece los datos corporativos publicados por la empresa.",
        },
      ],
      sources: [
        source("Aviso legal de NUXA", "/legal/aviso-legal"),
        source(
          "OMS: salud mental",
          "https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response",
        ),
        source("Ministerio de Sanidad: Línea 024", "https://www.sanidad.gob.es/linea024/home.htm"),
        source("Emergencias 112", "https://www.112.es/"),
      ],
      relatedIds: ["about-nuxa", "how-nuxa-works", "science", "safety", "privacy", "for-organizations", "for-professionals", "editorial-policy", ...guides],
      kind: "WebPage",
    },
    {
      id: "about-nuxa",
      title: "Quién es NUXA y quién desarrolla la plataforma",
      description:
        "Conoce NUXA como plataforma digital de apoyo emocional y psicoeducación, y la sociedad responsable indicada en su aviso legal público.",
      h1: "Quién es NUXA",
      summary:
        "NUXA es una plataforma digital de apoyo emocional y psicoeducación. Su aviso legal identifica a EMPORDAJOBS SL, con sede en Portbou (Girona), como la sociedad propietaria.",
      sections: [
        section("Una plataforma, no una consulta clínica", [
          "NUXA combina una herramienta conversacional basada en IA con recursos educativos de bienestar emocional. Su propósito es ofrecer un espacio para ordenar ideas, explorar emociones y consultar información general.",
          "La conversación automatizada no equivale a una relación profesional sanitaria. NUXA no diagnostica ni presta tratamiento psicológico o médico; una persona que busca atención debe acudir a un profesional cualificado.",
        ]),
        section("La entidad responsable", [
          "El aviso legal público atribuye la plataforma a EMPORDAJOBS SL y sitúa su domicilio social en Portbou, Girona, España. Ese documento es la referencia para la identidad jurídica y las condiciones publicadas del sitio.",
          "Esta página evita atribuir a la entidad acreditaciones sanitarias, resultados de investigación propios o avales externos que no constan como hechos verificables en la información institucional consultada.",
        ]),
        section("Qué puede encontrar aquí", [
          "Este centro distingue la descripción del producto de la información sobre evidencia, seguridad, privacidad y política editorial. También ofrece información específica para organizaciones y profesionales, sin presuponer que la herramienta esté integrada en servicios clínicos.",
          "Las guías temáticas explican recursos psicoeducativos y cuándo puede ser adecuado pedir ayuda humana. No deben interpretarse como evaluación de una situación individual.",
        ]),
        section("Transparencia sobre los límites", [
          "Los sistemas de IA pueden producir respuestas incorrectas, incompletas o inadecuadas. No conviene basar decisiones clínicas, laborales o de seguridad únicamente en una conversación con NUXA.",
          "La disponibilidad de páginas en español, inglés y francés no implica una traducción completa de la aplicación. Algunos textos y procesos internos pueden seguir en español.",
        ]),
      ],
      faqs: [
        {
          question: "¿Qué empresa está detrás de NUXA?",
          answer:
            "El aviso legal público identifica a EMPORDAJOBS SL, con domicilio social en Portbou, Girona, España, como propietaria de la plataforma.",
        },
        {
          question: "¿NUXA está dirigida por un equipo clínico?",
          answer:
            "La información institucional descrita aquí no afirma una supervisión clínica de cada conversación o contenido. NUXA no debe presentarse como atención clínica.",
        },
      ],
      sources: [
        source("Aviso legal de NUXA", "/legal/aviso-legal"),
        source(
          "OMS: salud mental",
          "https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response",
        ),
      ],
      relatedIds: ["home", "how-nuxa-works", "science", "safety", "privacy", "editorial-policy"],
      kind: "AboutPage",
    },
    {
      id: "how-nuxa-works",
      title: "Cómo funciona NUXA: conversación con IA y psicoeducación",
      description:
        "Qué ofrece una conversación con NUXA, cómo usarla como recurso de reflexión y por qué sus respuestas no son diagnóstico ni tratamiento.",
      h1: "Cómo funciona NUXA",
      summary:
        "NUXA permite conversar con una herramienta de IA orientada al apoyo emocional y consultar recursos psicoeducativos. La respuesta generada puede equivocarse y no sustituye una valoración profesional.",
      sections: [
        section("Una conversación guiada", [
          "La persona puede describir una preocupación con sus propias palabras y recibir una respuesta conversacional que ayude a ordenar lo que ha contado o a explorar posibles pasos generales. También existen recursos educativos sobre temas emocionales.",
          "Una respuesta generada depende del contexto proporcionado y del sistema de IA. No es una evaluación completa de la historia clínica, las circunstancias personales o el nivel de riesgo de quien escribe.",
        ]),
        section("Uso deliberado y con criterio", [
          "Puede ser útil formular una pregunta concreta, revisar si la respuesta tiene sentido y contrastar información sanitaria con fuentes oficiales. No compartas datos que no quieras introducir en un servicio digital.",
          "Si una sugerencia parece inadecuada, confusa o angustiante, no tienes que seguirla. Para una decisión médica, tratamiento, diagnóstico o situación de riesgo, acude a servicios humanos apropiados.",
        ]),
        section("Qué no hace el sistema", [
          "NUXA no diagnostica trastornos, no prescribe ni modifica medicación y no proporciona psicoterapia. La conversación no acredita que una técnica sea segura o eficaz para una persona concreta.",
          "Tampoco vigila de forma fiable las crisis ni reemplaza los servicios de urgencias. No utilices el chat como canal para pedir ayuda inmediata.",
        ]),
        section("Disponibilidad e idiomas", [
          "El producto ofrece soporte multilingüe según la información pública, pero la cobertura de idiomas puede variar entre conversación, interfaz, documentos y procesos de cuenta. La aplicación completa no está traducida en todos sus flujos.",
          "Las versiones institucionales de este centro están escritas para España, Estados Unidos, Reino Unido y Francia. Los teléfonos de emergencia y las vías de atención dependen del país.",
        ]),
      ],
      faqs: [
        {
          question: "¿Una respuesta de NUXA está revisada por un psicólogo?",
          answer:
            "No se afirma que un profesional revise cada respuesta individual. La salida es generada por IA y puede ser errónea; consulta con un profesional para recibir atención clínica.",
        },
        {
          question: "¿Puedo usar NUXA en una crisis?",
          answer:
            "No. NUXA no es un servicio de crisis ni garantiza detección o respuesta urgente. Contacta con emergencias o una línea de crisis de tu zona.",
        },
      ],
      sources: [
        source("OMS: salud mental", "https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response"),
        source("NIMH: cuidar la salud mental", "https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health"),
      ],
      relatedIds: ["home", "science", "safety", "privacy", "wellbeing", "anxiety"],
      kind: "WebPage",
    },
    {
      id: "science",
      title: "Ciencia y evidencia: qué se puede afirmar sobre NUXA",
      description:
        "Distinción entre conocimiento general sobre salud mental, principios psicoeducativos y evidencia clínica específica de un producto de IA.",
      h1: "Ciencia y evidencia: alcance de lo que afirmamos",
      summary:
        "Las fuentes de salud pública pueden respaldar información general sobre salud mental, pero no validan automáticamente una herramienta concreta. Aquí no se presenta evidencia clínica publicada específica de NUXA.",
      sections: [
        section("Evidencia general no equivale a validación del producto", [
          "Organismos como la OMS describen la salud mental como parte de la salud y ofrecen información general basada en evidencia. Esa orientación ayuda a contextualizar conceptos, pero no demuestra que una aplicación concreta sea eficaz o segura.",
          "No se presenta aquí ningún ensayo clínico publicado, evaluación independiente o validación clínica de NUXA. Por ello no afirmamos que NUXA diagnostique, trate o produzca beneficios clínicos.",
        ]),
        section("Qué significa psicoeducación", [
          "La psicoeducación comunica conceptos generales y recursos para comprender experiencias, considerar opciones y saber cuándo pedir ayuda. No determina qué diagnóstico tiene una persona ni qué tratamiento necesita.",
          "Una estrategia que se describe en material público de salud puede no ser adecuada para todas las personas. La situación clínica, condiciones físicas, entorno y preferencias deben valorarse con profesionales cuando se requiere atención.",
        ]),
        section("Cómo interpretar respuestas de IA", [
          "El lenguaje fluido no demuestra exactitud, calidad clínica ni adecuación individual. Una IA puede omitir contexto, confundir hechos o presentar con seguridad una respuesta incorrecta.",
          "Las respuestas de NUXA deben tratarse como información automatizada de carácter general, no como recomendación sanitaria personalizada. Contrasta afirmaciones médicas con fuentes oficiales y profesionales cualificados.",
        ]),
        section("Límites de las afirmaciones", [
          "Esta página distingue las fuentes externas sobre salud mental de cualquier evaluación del producto. No atribuye avales a OMS, NHS, NIMH u otras entidades por citarlas.",
          "Las afirmaciones institucionales deberían cambiar si aparecen estudios publicados, métodos verificables y resultados pertinentes; hasta entonces, no se ofrece una conclusión de eficacia clínica específica para NUXA.",
        ]),
      ],
      faqs: [
        {
          question: "¿NUXA tiene evidencia clínica publicada?",
          answer:
            "En esta información institucional no se presenta evidencia clínica publicada específica de NUXA. Las fuentes generales de salud mental citadas no constituyen una validación del producto.",
        },
        {
          question: "¿Una guía basada en evidencia valida las respuestas de la IA?",
          answer:
            "No. La evidencia general sobre un tema no demuestra que las respuestas de un producto automatizado sean exactas, seguras o eficaces para una persona.",
        },
      ],
      sources: [
        source("OMS: respuesta sobre salud mental", "https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response"),
        source("NIMH: cuidado de la salud mental", "https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health"),
      ],
      relatedIds: ["home", "how-nuxa-works", "safety", "editorial-policy", "wellbeing"],
      kind: "WebPage",
    },
    {
      id: "safety",
      title: "Seguridad y límites de uso de NUXA",
      description:
        "Límites prácticos de una herramienta de IA para apoyo emocional y orientación sobre qué hacer ante una emergencia en España.",
      h1: "Seguridad: usa NUXA con límites claros",
      summary:
        "NUXA no es una herramienta de emergencia ni atención clínica. Si existe un peligro inmediato o riesgo de autolesión, utiliza servicios humanos de urgencia; no esperes al chat.",
      sections: [
        section("No es diagnóstico ni tratamiento", [
          "Una conversación automatizada no puede confirmar una enfermedad, valorar todos los factores relevantes ni sustituir una relación asistencial. No uses una respuesta para decidir por tu cuenta iniciar, cambiar o dejar una medicación.",
          "El contenido general puede resultar incompleto o no encajar con tu situación. Para síntomas persistentes, preocupantes o que afecten a la vida diaria, consulta con un profesional sanitario.",
        ]),
        section("Riesgos propios de la IA", [
          "Las respuestas pueden ser incorrectas, desactualizadas, parciales o formuladas de manera convincente pese a ser erróneas. La herramienta puede no reconocer una urgencia ni entender matices importantes.",
          "Evita compartir información personal sensible que no sea necesaria. Para saber qué información describe el tratamiento de datos, consulta la política de privacidad legal publicada por NUXA.",
        ]),
        section("Qué hacer si necesitas ayuda urgente", [
          "Ante un peligro inmediato, una lesión o riesgo inminente para ti o para otra persona en España, llama al 112 o acude a urgencias. Si puedes, avisa a alguien de confianza y no permanezcas a solas cuando sea inseguro.",
          "El 024 ofrece atención telefónica a personas con pensamientos o riesgo suicida y a su entorno. Si el riesgo es inminente, llama al 112: la línea 024 no sustituye la respuesta de emergencias.",
        ]),
        section("Decisiones responsables", [
          "Usa NUXA, si lo haces, como complemento informativo: comprueba los consejos, detén la conversación si te hace sentir peor y busca apoyo humano cuando lo necesites.",
          "No hay que justificar una consulta profesional esperando a que el malestar se vuelva insoportable. En situaciones de violencia, problemas médicos o seguridad de menores, contacta con los servicios especializados apropiados.",
        ]),
      ],
      faqs: [
        {
          question: "¿Qué número llamo si hay una emergencia en España?",
          answer:
            "Llama al 112 ante peligro inmediato o una emergencia. No esperes una respuesta de NUXA.",
        },
        {
          question: "¿Qué es el 024?",
          answer:
            "El 024 es la línea pública española de atención a la conducta suicida. Para peligro inminente, llama al 112; el 024 no sustituye los servicios de emergencia.",
        },
      ],
      sources: [
        source("Emergencias 112", "https://www.112.es/"),
        source("Ministerio de Sanidad: Línea 024", "https://www.sanidad.gob.es/linea024/home.htm"),
        source("Aviso legal de NUXA", "/legal/aviso-legal"),
      ],
      relatedIds: ["home", "how-nuxa-works", "privacy", "anxiety", "teen-anxiety"],
      kind: "WebPage",
    },
    {
      id: "privacy",
      title: "Privacidad de NUXA: guía informativa y política legal",
      description:
        "Guía para encontrar y entender la política de privacidad publicada por NUXA; no añade condiciones legales ni promete garantías no verificadas.",
      h1: "Privacidad: consulta la política legal vigente",
      summary:
        "Esta página es una guía de navegación, no una política nueva ni asesoramiento legal. La política canónica publicada está en español; la aplicación y sus flujos no están traducidos íntegramente.",
      sections: [
        section("La política legal que debes consultar", [
          "NUXA publica su política de privacidad en español en /legal/privacidad. Ese documento es la fuente primaria para información declarada por la empresa sobre datos, finalidades, conservación, derechos y contacto.",
          "Esta página en otros idiomas solo explica dónde encontrar el documento: no traduce de forma oficial cada disposición, no modifica sus términos ni crea derechos, bases jurídicas o periodos de retención nuevos.",
        ]),
        section("Qué categorías describe la política publicada", [
          "La página legal española menciona, entre otras categorías, información de cuenta y perfil, datos de contacto y suscripción, conversaciones y consultas, y datos técnicos o de navegación. La información concreta y actualizada debe comprobarse en el texto legal original.",
          "No deduzcas de este resumen cómo se protege un dato concreto, quién puede acceder a él o durante cuánto tiempo se conserva. Lee la política completa antes de decidir qué compartir.",
        ]),
        section("Derechos y consultas", [
          "La política vigente explica cómo contactar con EMPORDAJOBS SL para cuestiones de protección de datos y cómo se describen los derechos aplicables. Si resides en España, el documento también señala a la Agencia Española de Protección de Datos como autoridad supervisora.",
          "Para ejercer un derecho o entender el tratamiento de tus datos, sigue los pasos y datos de contacto del documento legal. Esta guía no sustituye asesoramiento jurídico ni una respuesta de la empresa.",
        ]),
        section("Idiomas y transparencia", [
          "Las páginas institucionales se ofrecen en español, inglés y francés, pero esto no significa que toda la interfaz, avisos, consentimiento o procedimientos de NUXA estén traducidos por completo. La política legal de referencia enlazada aquí está en español.",
          "La normativa de privacidad depende del lugar y de los hechos concretos. Para la descripción legal vinculante y cualquier cambio, consulta siempre la versión oficial publicada por NUXA, no una traducción de resumen.",
        ]),
      ],
      faqs: [
        {
          question: "¿Esta página sustituye a la política de privacidad?",
          answer:
            "No. Es una guía informativa. La política legal publicada en español en /legal/privacidad es el documento que debes consultar para los términos vigentes.",
        },
        {
          question: "¿La política está traducida a todos los idiomas de la aplicación?",
          answer:
            "No se afirma una traducción completa. La política canónica enlazada está en español y algunos textos o flujos de la aplicación pueden no estar traducidos íntegramente.",
        },
      ],
      sources: [
        source("Política de privacidad de NUXA (documento legal)", "/legal/privacidad"),
        source("Agencia Española de Protección de Datos", "https://www.aepd.es/"),
        source("RGPD — texto oficial de la Unión Europea", "https://eur-lex.europa.eu/eli/reg/2016/679/oj"),
      ],
      relatedIds: ["home", "about-nuxa", "safety", "editorial-policy"],
      kind: "WebPage",
    },
    {
      id: "for-organizations",
      title: "NUXA para organizaciones: información sobre alcance y límites",
      description:
        "Información para organizaciones sobre NUXA como recurso digital complementario y las preguntas de privacidad, acceso y derivación que conviene revisar.",
      h1: "Información sobre NUXA para organizaciones",
      summary:
        "NUXA es una herramienta digital de apoyo emocional y psicoeducación, no un servicio de salud ocupacional, terapia ni respuesta a crisis. Las organizaciones deben valorar por separado su encaje y sus obligaciones.",
      sections: [
        section("Un recurso complementario, no un programa clínico", [
          "NUXA puede describirse como plataforma conversacional de IA y recursos generales de bienestar emocional. Su existencia no sustituye la responsabilidad de una organización de ofrecer canales de apoyo, atención sanitaria o prevención apropiados.",
          "No se presentan datos publicados aquí que demuestren reducción del absentismo, mejora de productividad o resultados clínicos atribuibles a NUXA. No debe comunicarse como intervención eficaz demostrada.",
        ]),
        section("Cuestiones que debe evaluar cada organización", [
          "Antes de considerar un uso organizativo, conviene aclarar quién contrata el servicio, qué grupos podrían acceder, qué información personal se trataría y qué alternativas humanas existen. El documento legal de privacidad de NUXA debe revisarse junto con los requisitos propios de la organización.",
          "El acceso voluntario, la separación entre apoyo y evaluación laboral, la accesibilidad y la información clara sobre límites son aspectos relevantes para diseñar un uso responsable; esta página no constituye una evaluación de cumplimiento.",
        ]),
        section("Salud psicológica en el trabajo", [
          "La OMS describe riesgos y medidas organizativas relacionados con la salud mental en el trabajo. Un recurso digital individual no corrige por sí mismo cargas excesivas, falta de autonomía, acoso, inseguridad u otros factores de la organización del trabajo.",
          "Las decisiones de prevención requieren considerar las condiciones reales de trabajo y consultar a las personas afectadas. NUXA no reemplaza los deberes legales, la prevención de riesgos ni los servicios de salud ocupacional.",
        ]),
        section("Privacidad, soporte y derivación", [
          "No supongas que una empresa recibe o no recibe conversaciones: confirma las condiciones aplicables en la documentación contractual y de privacidad antes de cualquier despliegue. Este centro no añade garantías de confidencialidad o seguridad.",
          "Una iniciativa debería explicar cómo obtener atención humana, cómo actuar en emergencias locales y a quién acudir ante una preocupación. NUXA no monitoriza crisis de manera fiable y no es canal de urgencias.",
        ]),
      ],
      faqs: [
        {
          question: "¿Puede NUXA reemplazar el programa de asistencia al empleado?",
          answer:
            "No se presenta como sustituto de servicios profesionales, salud ocupacional o atención de crisis. Una organización debe valorar qué apoyos humanos y obligaciones ya existen.",
        },
        {
          question: "¿NUXA demuestra reducir el estrés laboral?",
          answer:
            "No se presenta aquí evidencia publicada que demuestre ese resultado para NUXA. La OMS ofrece orientación general sobre salud mental laboral, que no valida este producto.",
        },
      ],
      sources: [
        source("OMS: salud mental en el trabajo", "https://www.who.int/news-room/fact-sheets/detail/mental-health-at-work"),
        source("OIT: salud mental en el trabajo", "https://www.ilo.org/resource/other/mental-health-work"),
        source("Política de privacidad de NUXA", "/legal/privacidad"),
      ],
      relatedIds: ["home", "science", "safety", "privacy", "for-professionals", "work-stress", "emotional-exhaustion"],
      kind: "WebPage",
    },
    {
      id: "for-professionals",
      title: "NUXA para profesionales: uso complementario y límites clínicos",
      description:
        "Información para profesionales sobre el alcance psicoeducativo de NUXA, sus límites como IA y aspectos a revisar antes de recomendar un recurso digital.",
      h1: "Información sobre NUXA para profesionales",
      summary:
        "NUXA no es un dispositivo de evaluación clínica ni una intervención validada en esta información. Profesionales y usuarios deben entender los límites de la IA y consultar las fuentes primarias.",
      sections: [
        section("Descripción funcional", [
          "NUXA ofrece conversación automatizada orientada al apoyo emocional y contenidos psicoeducativos. Puede describirse como recurso digital de información y reflexión, no como historial clínico, servicio terapéutico o canal de derivación sanitaria.",
          "No se presenta evidencia clínica publicada específica de NUXA ni validación del producto para diagnóstico, cribado, tratamiento o prevención. No atribuyas a la herramienta indicaciones clínicas que no estén demostradas.",
        ]),
        section("No delegar decisiones clínicas", [
          "La salida generada puede ser inexacta, incompleta o inadecuada para el contexto de una persona. No debe guiar por sí sola un diagnóstico, decisión terapéutica, valoración de riesgo o recomendación urgente.",
          "Si se habla de la herramienta con pacientes o usuarios, conviene expresar con claridad que la IA no equivale a juicio profesional y que se puede dejar de utilizar. La persona conserva el derecho a elegir fuentes de apoyo humano.",
        ]),
        section("Preguntas de implementación responsable", [
          "Antes de señalar un producto digital, es razonable revisar su público, accesibilidad, idiomas, tratamiento de datos, límites, incidentes y vías para pedir ayuda. La documentación contractual y legal del servicio, no este resumen, debe fundamentar la decisión.",
          "La atención a menores, personas en crisis o personas con necesidades complejas requiere especial cuidado y canales adecuados. Esta página no afirma que NUXA esté indicada o autorizada para dichos usos.",
        ]),
        section("Fuentes y transparencia", [
          "Las fuentes de salud pública citadas ayudan a entender salud mental y apoyo profesional en términos generales; no respaldan ni evalúan NUXA. La política editorial explica cómo distinguir fuentes de afirmaciones sobre el producto.",
          "Si se necesita atención o evaluación, deben utilizarse los recursos sanitarios locales. En España, las urgencias corresponden al 112; el chat de NUXA no supervisa ni atiende emergencias.",
        ]),
      ],
      faqs: [
        {
          question: "¿Está NUXA validada para uso clínico?",
          answer:
            "No se presenta aquí evidencia publicada de validación clínica específica de NUXA. Esta descripción no recomienda su uso como dispositivo de evaluación o tratamiento.",
        },
        {
          question: "¿Puede un profesional derivar a alguien a NUXA?",
          answer:
            "La decisión corresponde al profesional y a la persona, tras revisar las limitaciones, privacidad e idoneidad. NUXA no reemplaza seguimiento clínico ni servicios de crisis.",
        },
      ],
      sources: [
        source("OMS: salud mental", "https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response"),
        source("NIMH: cuidado de la salud mental", "https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health"),
        source("Aviso legal de NUXA", "/legal/aviso-legal"),
      ],
      relatedIds: ["home", "science", "safety", "privacy", "for-organizations", "wellbeing", "anxiety"],
      kind: "WebPage",
    },
    {
      id: "editorial-policy",
      title: "Política editorial de NUXA: fuentes, fechas y límites",
      description:
        "Cómo se atribuye el contenido institucional de NUXA, cómo se enlazan fuentes y qué no se afirma sobre revisión profesional.",
      h1: "Política editorial y de fuentes",
      summary:
        "El contenido institucional se atribuye a la organización. La IA puede asistir en la preparación de textos, pero no se afirma una revisión o aprobación profesional individual que no esté documentada.",
      sections: [
        section("Atribución institucional", [
          "Estas páginas son contenido institucional atribuido a NUXA y a la organización detrás del producto, EMPORDAJOBS SL, según su aviso legal público. La atribución no equivale a la autoría personal de un profesional sanitario.",
          "Las páginas muestran la fecha editorial disponible en sus metadatos. Las fechas no deben interpretarse como prueba de una auditoría clínica ni de un ciclo formal de revisión que no se haya declarado.",
        ]),
        section("Uso de inteligencia artificial", [
          "La IA puede asistir en la elaboración o adaptación lingüística de contenidos. No se afirma que un psicólogo, médico, editor externo o equipo clínico haya revisado y aprobado cada página o respuesta generada.",
          "La IA también puede cometer errores. Los lectores deben contrastar afirmaciones importantes con las fuentes enlazadas y consultar a profesionales para decisiones sobre su salud.",
        ]),
        section("Fuentes y alcance de las citas", [
          "Cuando resulta pertinente, se enlazan organismos públicos o fuentes institucionales, como la OMS, NIMH, AEPD o servicios sanitarios nacionales. Los enlaces respaldan información general del ámbito de la fuente, no una aprobación de NUXA.",
          "No se incluyen estadísticas, titulaciones, revisores o resultados de estudios propios cuando no constan fuentes verificables para afirmarlos. La página sobre ciencia declara expresamente que no presenta evidencia clínica publicada específica del producto.",
        ]),
        section("Correcciones y límites", [
          "El contenido es informativo y psicoeducativo, no diagnóstico, tratamiento ni consejo individual. Ante inconsistencias, prevalece la fuente oficial enlazada y la orientación de servicios profesionales competentes.",
          "La aplicación no está completamente traducida a todos los idiomas que aparecen en este centro. Una adaptación institucional no debe confundirse con la traducción integral o jurídicamente oficial de los textos internos del producto.",
        ]),
      ],
      faqs: [
        {
          question: "¿Un profesional sanitario aprueba todos los artículos?",
          answer:
            "No se afirma que exista aprobación profesional individual de cada página. La información se atribuye a la organización y puede haberse elaborado con asistencia de IA.",
        },
        {
          question: "¿Una fuente enlazada respalda a NUXA?",
          answer:
            "No. Los enlaces apuntan a fuentes generales o públicas. Citar a una organización no implica que haya revisado, avalado o validado el producto NUXA.",
        },
      ],
      sources: [
        source("OMS: información sobre salud mental", "https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response"),
        source("NIMH: recursos de salud mental", "https://www.nimh.nih.gov/health/topics"),
        source("Aviso legal de NUXA", "/legal/aviso-legal"),
      ],
      relatedIds: ["home", "about-nuxa", "science", "privacy", "how-nuxa-works"],
      kind: "WebPage",
    },
];
