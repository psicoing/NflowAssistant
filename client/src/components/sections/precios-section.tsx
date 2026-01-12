import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Check, Shield, Star, Gem, Users, Building, FileSpreadsheet, Lock, UserCheck, Eye, Globe, Briefcase, FileText } from "lucide-react";
import PurchaseCreditsModal from "@/components/modals/purchase-credits-modal";
import { useState } from "react";
import nuxaReparacionesImg from "@assets/image_1768235389814.png";

export default function PreciosSection() {
  const [, setLocation] = useLocation();

  const institutionalPlans = [
    { users: 5000, pricePerUser: 2.99, total: 14950 },
    { users: 10000, pricePerUser: 2.99, total: 29900 },
    { users: 20000, pricePerUser: 2.99, total: 59800 },
    { users: 50000, pricePerUser: 2.99, total: 149500 },
  ];

  return (
    <section id="precios" className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        
        {/* NUXA Reparaciones Card */}
        <div className="mb-12">
          <div className="bg-gradient-to-br from-lime-50 via-white to-emerald-50 rounded-3xl shadow-xl border border-lime-200 overflow-hidden max-w-3xl mx-auto">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 bg-lime-100 text-lime-800 px-3 py-1 rounded-full text-sm font-medium mb-4 w-fit">
                  🔧 NUXA Reparaciones
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                  Que tu mente vuelva a estar como antes
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  A veces solo necesitas un espacio donde alguien te ayude a ajustar las piezas. Sin prisas, sin juicios.
                </p>
              </div>
              <div className="flex items-center justify-center p-6 md:p-8 bg-white/50">
                <img 
                  src={nuxaReparacionesImg} 
                  alt="NUXA Reparaciones - Coco Nuxa arreglando tu mente" 
                  className="max-w-full h-auto max-h-64 object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Particulares Section */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Planes Particulares
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Apoyo emocional 24/7 con NEURO-PSI, tu asistente de salud mental en más de 150 idiomas.
            </p>
          </div>

          {/* Personal Plans Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Plan Básico */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white text-center">
                <Shield className="w-10 h-10 mx-auto mb-3" />
                <h3 className="text-xl font-bold">Plan Básico</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold">€2.99</span>
                  <span className="text-sm opacity-80">/mes</span>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    10 preguntas al mes
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Recursos educativos
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Soporte por email
                  </li>
                </ul>
                <Button 
                  onClick={() => setLocation("/login")}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  data-testid="button-plan-basico"
                >
                  Empezar
                </Button>
              </div>
            </div>

            {/* Plan Individual - Destacado */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-orange-400 overflow-hidden relative transform md:-translate-y-2">
              <div className="absolute top-0 left-0 right-0 bg-orange-500 text-white text-center py-1 text-xs font-bold">
                MÁS POPULAR
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 pt-8 text-white text-center">
                <Star className="w-10 h-10 mx-auto mb-3" />
                <h3 className="text-xl font-bold">Plan Individual</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold">€5.99</span>
                  <span className="text-sm opacity-80">/mes</span>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Preguntas ilimitadas
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Soporte prioritario 24/7
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Planes personalizados
                  </li>
                </ul>
                <Button 
                  onClick={() => setLocation("/login")}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  data-testid="button-plan-individual"
                >
                  Empezar
                </Button>
              </div>
            </div>

            {/* Plan Premium Anual */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white text-center">
                <Gem className="w-10 h-10 mx-auto mb-3" />
                <h3 className="text-xl font-bold">Plan Premium</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold">€32</span>
                  <span className="text-sm opacity-80">/año</span>
                </div>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full mt-2 inline-block">~€2.67/mes</span>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Preguntas ilimitadas
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Máximo ahorro anual
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Contenido exclusivo
                  </li>
                </ul>
                <Button 
                  onClick={() => setLocation("/login")}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  data-testid="button-plan-premium"
                >
                  Empezar
                </Button>
              </div>
            </div>
          </div>

          {/* Packs de Créditos */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pago Por Uso - Sin Compromiso</h3>
              <p className="text-gray-600 text-sm">Compra créditos que <strong>nunca caducan</strong></p>
            </div>
            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="bg-white rounded-xl p-4 border border-indigo-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">Pack Básico</p>
                  <p className="text-sm text-gray-500">15 preguntas</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-indigo-600">€5</p>
                  <PurchaseCreditsModal>
                    <Button size="sm" variant="outline" className="mt-1 text-xs" data-testid="button-pack-basico">
                      Comprar
                    </Button>
                  </PurchaseCreditsModal>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border-2 border-purple-400 flex items-center justify-between relative">
                <div className="absolute -top-2 right-2 bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  MEJOR VALOR
                </div>
                <div>
                  <p className="font-bold text-gray-900">Pack Premium</p>
                  <p className="text-sm text-gray-500">35 preguntas</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600">€10</p>
                  <PurchaseCreditsModal>
                    <Button size="sm" className="mt-1 text-xs bg-purple-600 hover:bg-purple-700" data-testid="button-pack-premium">
                      Comprar
                    </Button>
                  </PurchaseCreditsModal>
                </div>
              </div>
            </div>
          </div>

          {/* Sin permanencia */}
          <div className="text-center mt-6">
            <span className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium">
              <Check className="w-4 h-4" />
              Sin permanencia · Anula cuando quieras
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-12"></div>

        {/* Planes Empresariales */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Planes Empresas
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Soluciones profesionales para organizaciones que priorizan el bienestar mental de sus equipos.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Plan Profesional */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white text-center">
                <Briefcase className="w-10 h-10 mx-auto mb-3" />
                <h3 className="text-xl font-bold">Plan Profesional</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold">€149.50</span>
                  <span className="text-sm opacity-80">/mes</span>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Hasta 50 clientes/pacientes
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Panel de administración
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Informes y analytics
                  </li>
                </ul>
                <Button 
                  onClick={() => setLocation("/partners")}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  data-testid="button-plan-profesional"
                >
                  Contactar
                </Button>
              </div>
            </div>

            {/* Plan Empresarial - Destacado */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-orange-400 overflow-hidden relative transform md:-translate-y-2">
              <div className="absolute top-0 left-0 right-0 bg-orange-500 text-white text-center py-1 text-xs font-bold">
                MÁS POPULAR
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 pt-8 text-white text-center">
                <Building className="w-10 h-10 mx-auto mb-3" />
                <h3 className="text-xl font-bold">Plan Empresarial</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold">€598</span>
                  <span className="text-sm opacity-80">/mes</span>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Hasta 200 empleados
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Soporte dedicado 24/7
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Cumplimiento ISO 45003
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Onboarding incluido
                  </li>
                </ul>
                <Button 
                  onClick={() => setLocation("/partners")}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  data-testid="button-plan-empresarial"
                >
                  Contactar
                </Button>
              </div>
            </div>

            {/* Plan Corporativo */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 text-white text-center">
                <Globe className="w-10 h-10 mx-auto mb-3" />
                <h3 className="text-xl font-bold">Plan Corporativo</h3>
                <div className="mt-2">
                  <span className="text-2xl font-bold">Personalizado</span>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Usuarios ilimitados
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Implementación personalizada
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Integración API completa
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Cumplimiento GDPR
                  </li>
                </ul>
                <Button 
                  onClick={() => setLocation("/partners")}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  data-testid="button-plan-corporativo"
                >
                  Contactar Ventas
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-12"></div>

        {/* Instituciones Section */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Building className="w-4 h-4" />
              EMPRESAS E INSTITUCIONES
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Planes Institucionales
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Solución escalable para organizaciones. Precio transparente sin costes ocultos.
            </p>
          </div>

          {/* Pricing Formula */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white text-center mb-10">
            <h3 className="text-2xl font-bold mb-4">Precio Simple y Transparente</h3>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="bg-white/20 rounded-xl px-6 py-4">
                <p className="text-4xl font-bold">€2.99</p>
                <p className="text-sm opacity-80">por usuario/mes</p>
              </div>
              <span className="text-3xl">×</span>
              <div className="bg-white/20 rounded-xl px-6 py-4">
                <p className="text-2xl font-bold">Nº usuarios</p>
                <p className="text-sm opacity-80">según necesidad</p>
              </div>
              <span className="text-3xl">=</span>
              <div className="bg-white/20 rounded-xl px-6 py-4">
                <p className="text-2xl font-bold">Total</p>
                <p className="text-sm opacity-80">sin sorpresas</p>
              </div>
            </div>
          </div>

          {/* Institutional Plans Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-10">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Usuarios</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Precio/usuario</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Total mensual</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-900"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {institutionalPlans.map((plan, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-bold text-gray-900">{plan.users.toLocaleString('es-ES')} usuarios</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="text-gray-700">€{plan.pricePerUser.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="text-xl font-bold text-blue-600">€{plan.total.toLocaleString('es-ES')}</span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <Button 
                          onClick={() => setLocation("/partners")}
                          variant="outline"
                          className="border-blue-600 text-blue-600 hover:bg-blue-50"
                          data-testid={`button-institutional-${plan.users}`}
                        >
                          Solicitar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 px-6 py-4 text-center border-t border-gray-200">
              <p className="text-sm text-gray-600">
                ¿Necesitas otro volumen? <button onClick={() => setLocation("/partners")} className="text-blue-600 font-medium hover:underline">Contacta con nosotros</button> para una cotización personalizada.
              </p>
            </div>
          </div>

          {/* CSV Import Feature */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-200 mb-10">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                <FileSpreadsheet className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Gestión Masiva con CSV</h3>
                <p className="text-gray-600">
                  Envíanos un archivo CSV con los datos de los usuarios. Generamos automáticamente un archivo de respuesta con <strong>códigos privados de acceso individuales</strong> para cada persona. Sin fricciones técnicas ni administrativas.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Guarantees */}
          <div className="grid md:grid-cols-4 gap-4 mb-10">
            <div className="bg-white rounded-xl p-5 border border-gray-200 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <UserCheck className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-1">Individual</h4>
              <p className="text-sm text-gray-600">Uso estrictamente personal</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 text-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-1">Intransferible</h4>
              <p className="text-sm text-gray-600">Acceso único por código</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                <Eye className="w-6 h-6 text-emerald-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-1">Privado</h4>
              <p className="text-sm text-gray-600">Confidencialidad total</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 text-center">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6 text-orange-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-1">Encriptado</h4>
              <p className="text-sm text-gray-600">Conversaciones cifradas</p>
            </div>
          </div>

          {/* ISO 45003 Badge */}
          <div className="bg-gray-900 rounded-2xl p-6 text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Globe className="w-6 h-6 text-emerald-400" />
              <span className="text-emerald-400 font-bold">ISO 45003</span>
            </div>
            <p className="text-gray-300 text-sm max-w-2xl mx-auto">
              Cumplimiento normativo para la gestión de la salud psicológica en el trabajo. Ideal para empresas comprometidas con el bienestar de sus equipos.
            </p>
            <Button 
              onClick={() => setLocation("/partners")}
              className="mt-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              data-testid="button-contact-institutional"
            >
              Contactar con Ventas
            </Button>
          </div>

          {/* Naturaleza Contractual */}
          <div className="bg-gradient-to-r from-slate-50 to-gray-100 rounded-2xl p-6 border border-slate-200">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Naturaleza contractual del servicio NUXA para empresas e instituciones</h4>
                <div className="text-sm text-gray-600 space-y-3">
                  <p>
                    El uso de la plataforma NUXA por parte de empresas e instituciones se articula exclusivamente bajo la modalidad de <strong>arrendamiento de servicios</strong>.
                  </p>
                  <p>
                    Las empresas e instituciones que acceden y utilizan NUXA adquieren la condición de arrendatarias del servicio, en régimen de alquiler, sin que exista en ningún caso cesión de propiedad, licencia perpetua ni transmisión de derechos sobre la plataforma, su tecnología o sus contenidos.
                  </p>
                  <p>
                    La contraprestación económica satisfecha por el uso de NUXA tiene naturaleza de renta por arrendamiento, por lo que la facturación se realizará conforme a dicho concepto y quedará sujeta al régimen fiscal aplicable a los rendimientos derivados de arrendamientos, incluyendo las obligaciones fiscales que correspondan según la normativa vigente.
                  </p>
                  <p className="text-gray-700 font-medium">
                    Este modelo garantiza una relación contractual clara, transparente y jurídicamente delimitada, en la que NUXA actúa como proveedor del servicio y la empresa o institución como arrendataria del mismo, en los términos propios de un alquiler de uso tecnológico.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
