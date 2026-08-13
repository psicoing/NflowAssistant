import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

const SECTORES: Record<string, { absentismo: number; rotacion: number; label: string }> = {
  finanzas:     { absentismo: 0.048, rotacion: 0.12, label: "Finanzas y Banca" },
  sanidad:      { absentismo: 0.072, rotacion: 0.18, label: "Sanidad y Social" },
  tecnologia:   { absentismo: 0.041, rotacion: 0.22, label: "Tecnología" },
  educacion:    { absentismo: 0.063, rotacion: 0.14, label: "Educación" },
  industria:    { absentismo: 0.058, rotacion: 0.15, label: "Industria y Manufactura" },
  retail:       { absentismo: 0.055, rotacion: 0.28, label: "Retail y Distribución" },
  hosteleria:   { absentismo: 0.061, rotacion: 0.35, label: "Hostelería y Turismo" },
  construccion: { absentismo: 0.053, rotacion: 0.20, label: "Construcción" },
  logistica:    { absentismo: 0.059, rotacion: 0.24, label: "Logística y Transporte" },
  otros:        { absentismo: 0.055, rotacion: 0.18, label: "Otros sectores" },
};

function fmt(n: number) {
  return n.toLocaleString("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

export default function CalculadoraBurnout() {
  const [, navigate] = useLocation();
  const [empleados, setEmpleados] = useState(50);
  const [salario, setSalario] = useState(28000);
  const [sector, setSector] = useState("finanzas");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const calc = useMemo(() => {
    const s = SECTORES[sector];
    // Días laborables/año
    const diasLaborables = 220;
    const costeDiario = salario / diasLaborables;

    // Absentismo psicosocial (20% del absentismo total se debe a causas psicosociales — INSST)
    const diasAbsentismoTotal = empleados * s.absentismo * diasLaborables;
    const diasPsicosocial = diasAbsentismoTotal * 0.20;
    const costeAbsentismo = diasPsicosocial * costeDiario;

    // Presentismo: estimado en 1.8× el coste de absentismo (Gallup / WHO)
    const costePresentismo = costeAbsentismo * 1.8;

    // Rotación por burnout: 15% de la rotación total está relacionada con agotamiento laboral
    const empleadosQueRotan = empleados * s.rotacion * 0.15;
    const costeReemplazo = salario * 0.6; // 6 meses de salario es el coste medio de reemplazar
    const costeRotacion = empleadosQueRotan * costeReemplazo;

    const total = costeAbsentismo + costePresentismo + costeRotacion;

    // Ahorro potencial con NUXA: reducción del 35% (datos clínicos intervención)
    const ahorro = total * 0.35;

    return { costeAbsentismo, costePresentismo, costeRotacion, total, ahorro, diasPsicosocial };
  }, [empleados, salario, sector]);

  async function submitEmail() {
    if (!email.includes("@")) return;
    setSending(true);
    try {
      await fetch("/api/calculadora-burnout/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, empleados, salario, sector, totalCoste: calc.total }),
      });
    } catch {}
    setSending(false);
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Nav */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <button onClick={() => navigate("/")} className="text-blue-300 hover:text-white flex items-center gap-2 text-sm transition-colors">
          ← NUXA
        </button>
        <span className="text-white font-semibold text-sm">Calculadora de Burnout</span>
        <div className="w-16" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">

        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="text-6xl">💸</div>
          <h1 className="text-4xl font-bold">¿Cuánto le cuesta el burnout a tu empresa?</h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto leading-relaxed">
            Calcula el coste real del estrés, ansiedad y burnout en tu plantilla — incluyendo absentismo, presentismo y rotación de personal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* INPUTS */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-8">
            <h2 className="text-xl font-bold text-white">Datos de tu empresa</h2>

            {/* Empleados */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-gray-300 font-medium">Número de empleados</label>
                <span className="text-2xl font-bold text-blue-300">{empleados.toLocaleString("es-ES")}</span>
              </div>
              <input type="range" min={5} max={5000} step={5} value={empleados}
                onChange={e => setEmpleados(parseInt(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>5</span><span>1.000</span><span>5.000+</span>
              </div>
            </div>

            {/* Salario */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-gray-300 font-medium">Salario medio bruto anual</label>
                <span className="text-2xl font-bold text-blue-300">{fmt(salario).replace("€", "")}€</span>
              </div>
              <input type="range" min={16000} max={80000} step={1000} value={salario}
                onChange={e => setSalario(parseInt(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>16.000€</span><span>48.000€</span><span>80.000€</span>
              </div>
            </div>

            {/* Sector */}
            <div className="space-y-2">
              <label className="text-gray-300 font-medium">Sector</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(SECTORES).map(([key, val]) => (
                  <button key={key} onClick={() => setSector(key)}
                    className={`px-3 py-2.5 rounded-xl text-sm text-left transition-all ${
                      sector === key
                        ? "bg-blue-600 border border-blue-500 text-white font-semibold"
                        : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                    }`}>
                    {val.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-gray-500 leading-relaxed">
              Datos basados en: INSST (Instituto Nacional de Seguridad y Salud en el Trabajo), OMS, Gallup State of Global Workplace 2024.
            </div>
          </div>

          {/* RESULTS */}
          <div className="space-y-4">
            {/* Total */}
            <motion.div
              key={calc.total}
              initial={{ scale: 0.97 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-br from-red-600/20 to-red-800/20 border border-red-500/40 rounded-3xl p-8 text-center"
            >
              <p className="text-red-300 text-sm font-semibold uppercase tracking-wider mb-2">Coste total estimado / año</p>
              <p className="text-5xl font-black text-white">{fmt(calc.total)}</p>
              <p className="text-gray-400 text-sm mt-2">
                con {empleados.toLocaleString("es-ES")} empleados · {SECTORES[sector].label}
              </p>
            </motion.div>

            {/* Desglose */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
              <p className="text-gray-300 font-semibold text-sm uppercase tracking-wider">Desglose</p>
              {[
                { label: "Absentismo psicosocial", value: calc.costeAbsentismo, icon: "🛏️", desc: `~${Math.round(calc.diasPsicosocial)} días perdidos/año` },
                { label: "Presentismo", value: calc.costePresentismo, icon: "😶", desc: "Empleados presentes pero sin rendir" },
                { label: "Rotación por burnout", value: calc.costeRotacion, icon: "🚪", desc: "Selección, formación y onboarding" },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between gap-3">
                  <div className="flex items-start gap-2 min-w-0">
                    <span className="text-lg shrink-0">{item.icon}</span>
                    <div className="min-w-0">
                      <p className="text-gray-200 text-sm font-medium">{item.label}</p>
                      <p className="text-gray-500 text-xs">{item.desc}</p>
                    </div>
                  </div>
                  <p className="text-white font-bold text-sm shrink-0">{fmt(item.value)}</p>
                </div>
              ))}
            </div>

            {/* Ahorro con NUXA */}
            <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 border border-emerald-500/40 rounded-3xl p-6">
              <p className="text-emerald-300 text-sm font-semibold mb-1">💚 Ahorro potencial con NUXA</p>
              <p className="text-4xl font-black text-emerald-400">{fmt(calc.ahorro)}<span className="text-lg font-normal text-emerald-600">/año</span></p>
              <p className="text-gray-400 text-xs mt-2">Basado en una reducción media del 35% del impacto psicosocial documentada en intervenciones de apoyo emocional digital (Woebot, 2023; WHO, 2022).</p>
            </div>

            {/* Email capture */}
            {!sent ? (
              <div className="bg-blue-600/10 border border-blue-500/30 rounded-3xl p-6 space-y-3">
                <p className="text-white font-semibold">📩 Recibe el informe completo en PDF</p>
                <p className="text-gray-400 text-sm">Con metodología detallada y propuesta de implementación de NUXA para tu empresa.</p>
                <div className="flex gap-2">
                  <input type="email" placeholder="tu@empresa.com" value={email} onChange={e => setEmail(e.target.value)}
                    className="flex-1 bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-400" />
                  <button onClick={submitEmail} disabled={!email.includes("@") || sending}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all whitespace-nowrap">
                    {sending ? "…" : "Enviar"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-3xl p-6 text-center">
                <p className="text-emerald-300 font-semibold">✅ ¡Recibido!</p>
                <p className="text-gray-400 text-sm mt-1">Te enviaremos el informe en las próximas horas.</p>
              </div>
            )}

            <a href="/prueba-gratis"
              className="block bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-4 rounded-2xl text-center transition-all shadow-lg shadow-blue-500/20">
              Probar NUXA gratis y reducir este coste →
            </a>
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs max-w-2xl mx-auto">
          Esta calculadora proporciona estimaciones orientativas basadas en datos estadísticos sectoriales. Los resultados reales pueden variar según las características específicas de cada organización.
        </p>
      </div>
    </div>
  );
}
