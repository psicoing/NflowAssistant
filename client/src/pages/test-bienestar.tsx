import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

// PHQ-9 + GAD-7 questions
const PHQ9 = [
  "Poco interés o placer en hacer las cosas",
  "Sentirte decaído/a, deprimido/a o sin esperanzas",
  "Problemas para dormir o dormir demasiado",
  "Sentirte cansado/a o con poca energía",
  "Falta de apetito o comer en exceso",
  "Sentirte mal contigo mismo/a o sentirte un fracaso",
  "Dificultad para concentrarte en cosas",
  "Moverte o hablar más lento que de costumbre, o lo contrario",
  "Pensamientos de que estarías mejor muerto/a o de hacerte daño",
];

const GAD7 = [
  "Sentirte nervioso/a, ansioso/a o al límite",
  "No poder dejar de preocuparte o no poder controlar la preocupación",
  "Preocuparte demasiado por diferentes cosas",
  "Dificultad para relajarte",
  "Estar tan intranquilo/a que es difícil mantenerse quieto/a",
  "Molestarte o irritarte con facilidad",
  "Sentir miedo, como si algo terrible pudiera pasar",
];

const OPTIONS = [
  { label: "Nunca", value: 0 },
  { label: "Varios días", value: 1 },
  { label: "Más de la mitad de los días", value: 2 },
  { label: "Casi cada día", value: 3 },
];

const allQuestions = [
  ...PHQ9.map((q, i) => ({ id: i, text: q, group: "PHQ-9", groupLabel: "Estado de ánimo" })),
  ...GAD7.map((q, i) => ({ id: i + 9, text: q, group: "GAD-7", groupLabel: "Ansiedad" })),
];

function getPhq9Level(score: number) {
  if (score <= 4) return { level: "Mínimo", color: "emerald", emoji: "🟢", desc: "Tu estado de ánimo está bien. Sigue cuidándote." };
  if (score <= 9) return { level: "Leve", color: "yellow", emoji: "🟡", desc: "Síntomas leves. Prestar atención y practicar autocuidado puede ayudar." };
  if (score <= 14) return { level: "Moderado", color: "orange", emoji: "🟠", desc: "Síntomas moderados. Hablar con un profesional sería beneficioso." };
  if (score <= 19) return { level: "Moderado-severo", color: "red", emoji: "🔴", desc: "Síntomas significativos. Se recomienda apoyo profesional pronto." };
  return { level: "Severo", color: "red", emoji: "🔴", desc: "Síntomas severos. El apoyo profesional es importante ahora." };
}

function getGad7Level(score: number) {
  if (score <= 4) return { level: "Mínimo", color: "emerald", emoji: "🟢", desc: "Niveles de ansiedad normales. Bien." };
  if (score <= 9) return { level: "Leve", color: "yellow", emoji: "🟡", desc: "Ansiedad leve. Las técnicas de relajación pueden ayudar." };
  if (score <= 14) return { level: "Moderado", color: "orange", emoji: "🟠", desc: "Ansiedad moderada. Considera hablar con un profesional." };
  return { level: "Severo", color: "red", emoji: "🔴", desc: "Ansiedad severa. El apoyo profesional es recomendable." };
}

export default function TestBienestar() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState<"intro" | "test" | "email" | "result">("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(16).fill(-1));
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const q = allQuestions[current];
  const answered = answers[current] !== -1;
  const progress = ((current) / 16) * 100;

  const phq9Score = answers.slice(0, 9).filter(v => v >= 0).reduce((a, b) => a + b, 0);
  const gad7Score = answers.slice(9, 16).filter(v => v >= 0).reduce((a, b) => a + b, 0);
  const phq9 = getPhq9Level(phq9Score);
  const gad7 = getGad7Level(gad7Score);

  function selectAnswer(val: number) {
    const next = [...answers];
    next[current] = val;
    setAnswers(next);
    setTimeout(() => {
      if (current < 15) {
        setCurrent(c => c + 1);
      } else {
        setStep("email");
      }
    }, 300);
  }

  async function submitEmail(skip = false) {
    setSubmitting(true);
    try {
      await fetch("/api/test-bienestar/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: skip ? null : email, phq9Score, gad7Score }),
      });
    } catch {}
    setSubmitting(false);
    setSubmitted(true);
    setStep("result");
  }

  const colorMap: Record<string, string> = {
    emerald: "text-emerald-400",
    yellow: "text-yellow-400",
    orange: "text-orange-400",
    red: "text-red-400",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      {/* Nav */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <button onClick={() => navigate("/")} className="text-blue-300 hover:text-white flex items-center gap-2 text-sm transition-colors">
          ← NUXA
        </button>
        <span className="text-white font-semibold text-sm">Test de Bienestar</span>
        <div className="w-16" />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* INTRO */}
        {step === "intro" && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-8">
            <div className="text-7xl">🧠</div>
            <div>
              <h1 className="text-4xl font-bold mb-4">Test de Bienestar Emocional</h1>
              <p className="text-blue-200 text-lg leading-relaxed max-w-lg mx-auto">
                16 preguntas basadas en escalas clínicas validadas (PHQ-9 y GAD-7) para conocer tu estado emocional actual. Anónimo, gratuito y en 5 minutos.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
              {[["16", "preguntas"], ["5 min", "duración"], ["100%", "gratuito"]].map(([val, lab]) => (
                <div key={lab} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-2xl font-bold text-blue-300">{val}</p>
                  <p className="text-gray-400 text-xs mt-1">{lab}</p>
                </div>
              ))}
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-gray-400 max-w-md mx-auto">
              ⚠️ Este test no es un diagnóstico médico. Si sientes malestar intenso, consulta a un profesional de salud mental.
            </div>
            <button
              onClick={() => setStep("test")}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold px-10 py-4 rounded-2xl text-lg transition-all shadow-lg shadow-blue-500/20"
            >
              Empezar el test →
            </button>
          </motion.div>
        )}

        {/* TEST */}
        {step === "test" && (
          <div className="space-y-8">
            {/* Progress */}
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>{q.groupLabel}</span>
                <span>{current + 1} / 16</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                  <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider mb-4">{q.groupLabel}</p>
                  <p className="text-xl font-medium leading-relaxed mb-2">
                    Durante las <strong>últimas 2 semanas</strong>, ¿con qué frecuencia te ha molestado…?
                  </p>
                  <p className="text-2xl font-bold text-white mt-4">"{q.text}"</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => selectAnswer(opt.value)}
                      className={`p-4 rounded-2xl border text-left transition-all duration-200 ${
                        answers[current] === opt.value
                          ? "bg-blue-600 border-blue-500 shadow-lg shadow-blue-500/20"
                          : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          answers[current] === opt.value ? "bg-white text-blue-600" : "bg-white/10 text-gray-300"
                        }`}>{opt.value}</div>
                        <span className="text-sm font-medium">{opt.label}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {current > 0 && (
                  <button onClick={() => setCurrent(c => c - 1)} className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                    ← Pregunta anterior
                  </button>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* EMAIL CAPTURE */}
        {step === "email" && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-8">
            <div className="text-6xl">📊</div>
            <div>
              <h2 className="text-3xl font-bold mb-3">¡Test completado!</h2>
              <p className="text-blue-200 text-lg">Tu informe personalizado está listo.</p>
              <p className="text-gray-400 mt-2">Introduce tu email para recibirlo también en tu bandeja de entrada.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4">
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-base placeholder-gray-500 focus:outline-none focus:border-blue-400"
              />
              <button
                onClick={() => submitEmail(false)}
                disabled={!email.includes("@") || submitting}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:opacity-40 text-white font-bold py-3.5 rounded-xl transition-all"
              >
                {submitting ? "Enviando…" : "Ver mi informe y recibirlo por email →"}
              </button>
              <button onClick={() => submitEmail(true)} className="text-gray-500 hover:text-gray-300 text-sm transition-colors w-full">
                Ver resultados sin guardar mi email
              </button>
            </div>
          </motion.div>
        )}

        {/* RESULT */}
        {step === "result" && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold">Tu informe de bienestar</h2>
              <p className="text-gray-400 mt-2">Basado en escalas PHQ-9 y GAD-7 — validadas clínicamente</p>
            </div>

            {/* PHQ-9 */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Estado de ánimo · PHQ-9</p>
                  <p className={`text-2xl font-bold mt-1 ${colorMap[phq9.color]}`}>{phq9.emoji} {phq9.level}</p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold">{phq9Score}</p>
                  <p className="text-gray-500 text-xs">/ 27 puntos</p>
                </div>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                <div className={`h-full rounded-full bg-gradient-to-r ${
                  phq9.color === "emerald" ? "from-emerald-500 to-emerald-400" :
                  phq9.color === "yellow" ? "from-yellow-500 to-yellow-400" :
                  phq9.color === "orange" ? "from-orange-500 to-orange-400" :
                  "from-red-500 to-red-400"
                }`} style={{ width: `${(phq9Score / 27) * 100}%` }} />
              </div>
              <p className="text-gray-300 text-sm">{phq9.desc}</p>
            </div>

            {/* GAD-7 */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Ansiedad · GAD-7</p>
                  <p className={`text-2xl font-bold mt-1 ${colorMap[gad7.color]}`}>{gad7.emoji} {gad7.level}</p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold">{gad7Score}</p>
                  <p className="text-gray-500 text-xs">/ 21 puntos</p>
                </div>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                <div className={`h-full rounded-full bg-gradient-to-r ${
                  gad7.color === "emerald" ? "from-emerald-500 to-emerald-400" :
                  gad7.color === "yellow" ? "from-yellow-500 to-yellow-400" :
                  gad7.color === "orange" ? "from-orange-500 to-orange-400" :
                  "from-red-500 to-red-400"
                }`} style={{ width: `${(gad7Score / 21) * 100}%` }} />
              </div>
              <p className="text-gray-300 text-sm">{gad7.desc}</p>
            </div>

            {/* Recommendations */}
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-3xl p-6 space-y-3">
              <p className="text-blue-300 font-semibold">💡 Recomendaciones personalizadas</p>
              {phq9Score >= 5 || gad7Score >= 5 ? (
                <ul className="space-y-2 text-gray-300 text-sm">
                  {phq9Score >= 5 && <li>→ Practica actividad física regular — reduce síntomas depresivos hasta un 30%</li>}
                  {gad7Score >= 5 && <li>→ Técnicas de respiración diafragmática: 5 min por la mañana ayudan a controlar la ansiedad</li>}
                  {(phq9Score >= 10 || gad7Score >= 10) && <li>→ Considera hablar con un profesional de salud mental — NUXA te conecta en minutos</li>}
                  <li>→ Establece una rutina de sueño regular: dormir 7-8h mejora el estado de ánimo significativamente</li>
                </ul>
              ) : (
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>→ Mantén tus hábitos actuales — están funcionando bien</li>
                  <li>→ Practica momentos de gratitud diaria para reforzar el bienestar</li>
                  <li>→ Comparte este test con alguien cercano para animarle a cuidarse</li>
                </ul>
              )}
            </div>

            {/* NUXA CTA */}
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-3xl p-6 text-center space-y-4">
              <p className="text-lg font-semibold">¿Quieres seguimiento profesional?</p>
              <p className="text-gray-400 text-sm">NUXA te da acceso a apoyo emocional profesional, disponible 24/7, desde tu móvil.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="/prueba-gratis" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold px-8 py-3 rounded-xl transition-all text-sm">
                  Probar NUXA gratis →
                </a>
                <button onClick={() => { setStep("intro"); setCurrent(0); setAnswers(Array(16).fill(-1)); setEmail(""); setSubmitted(false); }}
                  className="border border-white/20 hover:bg-white/5 text-gray-300 px-8 py-3 rounded-xl transition-all text-sm">
                  Repetir el test
                </button>
              </div>
            </div>

            <p className="text-center text-gray-600 text-xs">
              Este test no constituye un diagnóstico clínico. Consulta siempre a un profesional de salud mental para una evaluación completa.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
