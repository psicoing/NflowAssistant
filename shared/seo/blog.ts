import { CONTENT_DATE } from "./types";

const blogRelatedLinks: Record<number, { label: string; href: string }[]> = {
  1: [
    { label: "Guía de ansiedad en adolescentes", href: "/ansiedad-adolescentes" },
    { label: "Ansiedad: orientación general", href: "/ansiedad" },
    { label: "Seguridad y límites de NUXA", href: "/es/safety" },
  ],
  2: [
    { label: "Estrés laboral", href: "/estres-laboral" },
    { label: "Agotamiento emocional", href: "/es/agotamiento-emocional" },
    { label: "NUXA para organizaciones", href: "/es/for-organizations" },
  ],
  3: [
    { label: "Ciencia, fuentes y límites de la evidencia", href: "/es/science" },
    { label: "Información para profesionales", href: "/es/for-professionals" },
    { label: "Guía de bienestar emocional", href: "/bienestar-emocional" },
  ],
};

export type BlogSeoEntry = {
  id: number;
  title: string;
  excerpt: string;
  dateIso: string;
  updatedIso: string;
  fullContent: string;
  absoluteImageUrl: string;
  category: string;
  tags: string[];
  readTime: string;
};

export const blogSeoEntries: BlogSeoEntry[] = [
  {
    id: 1,
    title: "IA y salud mental adolescente: posibilidades y límites",
    excerpt: "Una guía informativa sobre herramientas digitales, sus límites y cómo buscar apoyo de personas adultas de confianza y profesionales. La IA no sustituye una evaluación ni la atención de salud mental profesional.",
    dateIso: "2025-08-23",
    updatedIso: CONTENT_DATE,
    fullContent: `
      <div class="prose prose-lg max-w-none">
        <h2 class="text-3xl font-bold mb-6 text-gray-900">Qué pueden y qué no pueden hacer las herramientas de IA</h2>
        <p class="text-lg text-gray-700 mb-6 leading-relaxed">Las herramientas conversacionales con IA pueden ofrecer información general o ayudar a ordenar preguntas, pero no constituyen una evaluación clínica y no deben usarse para diagnosticar ni sustituir a un profesional de salud mental. Su disponibilidad no equivale a atención de urgencia ni garantiza que una respuesta sea adecuada para cada persona.</p>

        <h3 class="text-2xl font-bold mb-4 text-gray-900">Si una persona joven está buscando apoyo</h3>
        <ul class="list-disc list-inside space-y-3 text-gray-700 mb-8">
          <li>Habla con una persona adulta de confianza y, cuando sea necesario, con un profesional sanitario.</li>
          <li>Comprueba la política de privacidad antes de compartir información sensible; no presupongas que una conversación es anónima o confidencial.</li>
          <li>Ante peligro inmediato o una crisis, contacta con los servicios de emergencia o de crisis disponibles en tu zona; un chatbot no es un servicio de emergencia.</li>
          <li>Usa información de salud de fuentes institucionales y actualizadas, y consulta a un profesional si tienes dudas sobre síntomas o tratamiento.</li>
        </ul>

        <h3 class="text-2xl font-bold mb-4 text-gray-900">Fuentes institucionales</h3>
        <p class="text-gray-700 mb-3">El artículo se publicó el 23 de agosto de 2025. Las páginas institucionales pueden actualizarse: comprueba en cada fuente su fecha de revisión y la información vigente.</p>
        <ul class="list-disc list-inside space-y-2 text-gray-700 mb-8">
          <li><a class="text-blue-700 underline" href="https://www.who.int/news-room/fact-sheets/detail/adolescent-mental-health" target="_blank" rel="noopener noreferrer">OMS — Salud mental del adolescente (ficha informativa; publicación y actualización indicadas en la fuente)</a></li>
          <li><a class="text-blue-700 underline" href="https://www.who.int/publications/i/item/9789240011854" target="_blank" rel="noopener noreferrer">OMS — Helping Adolescents Thrive: guía de intervenciones de promoción y prevención (2020)</a></li>
          <li><a class="text-blue-700 underline" href="https://www.nimh.nih.gov/health/topics/child-and-adolescent-mental-health" target="_blank" rel="noopener noreferrer">NIMH — Salud mental de niños y adolescentes</a></li>
          <li><a class="text-blue-700 underline" href="https://www.nhs.uk/mental-health/children-and-young-adults/mental-health-support/mental-health-services-for-young-people/" target="_blank" rel="noopener noreferrer">NHS — Servicios de salud mental para jóvenes</a></li>
        </ul>

        <p class="text-sm text-gray-600">Este texto es informativo y no ofrece consejo médico, diagnóstico ni tratamiento. NUXA no presenta este artículo como revisado clínicamente.</p>
      </div>
    `,
    absoluteImageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    category: "IA & Juventud",
    tags: ["IA", "Adolescentes", "Salud Mental", "Innovación"],
    readTime: "8 min",
  },
  {
    id: 2,
    title: "Chatbots y bienestar emocional en empresas: usos y límites",
    excerpt: "Una introducción práctica para organizaciones que evalúan herramientas conversacionales: posibles usos informativos, riesgos, privacidad y preguntas que conviene resolver antes de adoptarlas.",
    dateIso: "2025-08-22",
    updatedIso: CONTENT_DATE,
    fullContent: `
      <div class="prose prose-lg max-w-none">
        <h2 class="text-3xl font-bold mb-6 text-gray-900">Cómo evaluar un chatbot de bienestar en el trabajo</h2>
        <p class="text-lg text-gray-700 mb-6 leading-relaxed">Un chatbot puede ser un canal digital para consultar información general o conocer los recursos disponibles en una organización. Su utilidad depende del diseño, el contexto y las salvaguardas; por sí solo no demuestra una mejora del bienestar, una reducción del absentismo ni un resultado clínico.</p>

        <h3 class="text-2xl font-bold mb-4 text-gray-900">Cinco preguntas antes de adoptarlo</h3>
        <ol class="list-decimal list-inside space-y-4 text-gray-700 mb-8">
          <li><strong>¿Qué función cumple?</strong> Define si informa sobre recursos, facilita orientación general o realiza otra tarea. No lo presentes como psicoterapia ni diagnóstico sin verificar la cualificación de quienes prestan la atención y el marco aplicable.</li>
          <li><strong>¿A quién se derivan las consultas delicadas?</strong> Documenta un proceso claro para emergencias y para las situaciones que necesitan apoyo humano; una herramienta automatizada no sustituye esa respuesta.</li>
          <li><strong>¿Qué datos se recogen y quién puede verlos?</strong> Explica los datos tratados, su finalidad, conservación, acceso y límites de confidencialidad. No prometas anonimato o secreto sin evidencia verificable.</li>
          <li><strong>¿Es accesible e inclusivo?</strong> Considera idioma, accesibilidad, sesgos, alternativas para quienes no usan herramientas digitales y la participación de las personas afectadas.</li>
          <li><strong>¿Cómo se evaluará?</strong> Define indicadores, riesgos y revisión periódica antes del despliegue. No atribuyas mejoras o ahorros a la herramienta sin evaluación válida.</li>
        </ol>

        <p class="text-gray-700 mb-6">La OMS identifica factores del entorno y de la organización del trabajo como elementos relevantes para la salud mental laboral. Una herramienta digital no sustituye la prevención de riesgos psicosociales, las condiciones de trabajo adecuadas ni el acceso a apoyo profesional.</p>

        <h3 class="text-2xl font-bold mb-4 text-gray-900">Fuentes institucionales</h3>
        <p class="text-gray-700 mb-3">Publicado el 22 de agosto de 2025. Consulta las fechas de publicación o revisión que muestran las fuentes oficiales; su contenido puede cambiar.</p>
        <ul class="list-disc list-inside space-y-2 text-gray-700 mb-8">
          <li><a class="text-blue-700 underline" href="https://www.who.int/news-room/fact-sheets/detail/mental-health-at-work" target="_blank" rel="noopener noreferrer">OMS — Salud mental en el trabajo (ficha informativa; fecha en la fuente)</a></li>
          <li><a class="text-blue-700 underline" href="https://www.who.int/publications/i/item/9789240053052" target="_blank" rel="noopener noreferrer">OMS — Directrices sobre salud mental en el trabajo (2022)</a></li>
          <li><a class="text-blue-700 underline" href="https://www.nimh.nih.gov/health/topics/technology-and-the-future-of-mental-health-treatment" target="_blank" rel="noopener noreferrer">NIMH — Tecnología y el futuro del tratamiento de salud mental</a></li>
        </ul>

        <p class="text-sm text-gray-600">Artículo informativo de NUXA; no constituye asesoramiento legal, médico ni de prevención de riesgos laborales y no ha sido presentado como revisado por profesionales clínicos.</p>
      </div>
    `,
    absoluteImageUrl: "https://nuxa.life/icon-512.png",
    category: "Empresas & Bienestar",
    tags: ["Empresas", "Chatbots", "Bienestar Laboral", "Privacidad"],
    readTime: "6 min",
  },
  {
    id: 3,
    title: "IA y psicoterapia: una herramienta digital no sustituye al profesional",
    excerpt: "Qué conviene tener en cuenta al hablar de inteligencia artificial y atención psicológica: usos informativos posibles, límites, supervisión humana y preguntas sobre seguridad y privacidad.",
    dateIso: "2025-08-21",
    updatedIso: CONTENT_DATE,
    fullContent: `
      <div class="prose prose-lg max-w-none">
        <h2 class="text-3xl font-bold mb-6 text-gray-900">La IA no es psicoterapia ni sustituye a un profesional</h2>
        <p class="text-lg text-gray-700 mb-6 leading-relaxed">Un sistema de inteligencia artificial puede generar respuestas en lenguaje natural, pero eso no significa que comprenda una situación clínica, establezca un diagnóstico o preste psicoterapia. Este artículo no afirma que usar IA mejore los resultados de tratamiento o potencie la práctica profesional; cualquier afirmación de ese tipo requiere evaluación específica.</p>

        <h3 class="text-2xl font-bold mb-4 text-gray-900">Aspectos que requieren especial cuidado</h3>
        <ul class="list-disc list-inside space-y-3 text-gray-700 mb-8">
          <li><strong>Supervisión y límites:</strong> deja claro qué puede hacer la herramienta y cuándo debe intervenir una persona profesional. No dependas de ella para valorar o atender una crisis.</li>
          <li><strong>Privacidad:</strong> revisa qué información se procesa, con qué finalidad y quién accede a ella. Evita compartir datos identificativos o sensibles sin entender las condiciones aplicables.</li>
          <li><strong>Errores y sesgos:</strong> las respuestas generadas pueden ser incorrectas, incompletas o inadecuadas para una persona. Verifica la información sanitaria con profesionales y fuentes oficiales.</li>
          <li><strong>Elección informada:</strong> las personas deben saber cuándo interactúan con IA y disponer de vías humanas de apoyo cuando se necesiten.</li>
        </ul>

        <p class="text-gray-700 mb-6">La orientación de la OMS sobre IA para la salud destaca la importancia de la seguridad, la transparencia, la responsabilidad y la protección de los derechos de las personas. Estas consideraciones generales no certifican ni validan un producto concreto.</p>

        <h3 class="text-2xl font-bold mb-4 text-gray-900">Fuentes institucionales</h3>
        <p class="text-gray-700 mb-3">Publicado el 21 de agosto de 2025. Consulta las fechas de edición y revisión en las páginas enlazadas.</p>
        <ul class="list-disc list-inside space-y-2 text-gray-700 mb-8">
          <li><a class="text-blue-700 underline" href="https://www.who.int/publications/i/item/9789240029200" target="_blank" rel="noopener noreferrer">OMS — Ética y gobernanza de la inteligencia artificial para la salud (2021)</a></li>
          <li><a class="text-blue-700 underline" href="https://www.nimh.nih.gov/health/topics/technology-and-the-future-of-mental-health-treatment" target="_blank" rel="noopener noreferrer">NIMH — Tecnología y el futuro del tratamiento de salud mental</a></li>
          <li><a class="text-blue-700 underline" href="https://www.nhs.uk/mental-health/" target="_blank" rel="noopener noreferrer">NHS — Información sobre salud mental</a></li>
        </ul>

        <p class="text-sm text-gray-600">Este contenido es informativo, no una recomendación clínica ni una revisión profesional. No se debe usar IA como sustituto de diagnóstico, tratamiento o atención de emergencia.</p>
      </div>
    `,
    absoluteImageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    category: "Innovación en bienestar digital",
    tags: ["Terapia", "IA", "Psicólogos", "Innovación"],
    readTime: "7 min",
  },
];

// Real HTML links connect blog articles to their relevant guides in both the
// initial response and the visible article, without two competing copies.
for (const post of blogSeoEntries) {
  const related = `<nav aria-label="Lecturas relacionadas"><h2 class="text-2xl font-bold text-gray-900">Lecturas relacionadas</h2><ul>${blogRelatedLinks[post.id].map(link => `<li><a class="text-blue-700 underline" href="${link.href}">${link.label}</a></li>`).join("")}</ul></nav>`;
  post.fullContent = post.fullContent.replace(/<\/div>\s*$/, `${related}</div>`);
}