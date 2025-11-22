import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Copy, Check } from "lucide-react";
import { useState } from "react";

export default function DownloadCSV() {
  const [copied, setCopied] = useState(false);

  const csvContent = `Title,URL handle,Description,Vendor,Product category,Type,Tags,Published on online store,Status,SKU,Barcode,Option1 name,Option1 value,Option2 name,Option2 value,Option3 name,Option3 value,Price,Compare-at price,Cost per item,Charge tax,Tax code,Unit price total measure,Unit price total measure unit,Unit price base measure,Unit price base measure unit,Inventory tracker,Inventory quantity,Continue selling when out of stock,Weight value (grams),Weight unit for display,Requires shipping,Fulfillment service,Image source,Image position,Image alt text,Gift card,SEO title,SEO description,Google Shopping / Product category,Google Shopping / Gender,Google Shopping / Age group,Google Shopping / MPN,Google Shopping / Condition,Google Shopping / Custom product,Google Shopping / Custom label 0,Google Shopping / Custom label 1,Google Shopping / Custom label 2,Google Shopping / Custom label 3,Google Shopping / Custom label 4,Variant image,Variant weight unit,Variant tax code,Cost per item currency,Included in bundle / BIS
Pack Básico - 15 Preguntas,pack-basico-15-preguntas,Compra 15 preguntas prepagadas para usar cuando quieras con NUXA - Tu Psicólogo IA. Créditos que nunca expiran. Sin compromiso de suscripción. Apoyo en salud mental disponible en 150+ idiomas.,NUXA,Health > Mental Health,Créditos Prepagados,salud mental AI psicologia creditos prepagados,TRUE,active,NUXA-PACK-BASIC-15,,,Standard,15 Preguntas,,,,,5.00,,,TRUE,,,,,,,,allow,0,g,FALSE,manual,https://nuxa.life/images/pack-basico.jpg,1,Pack Básico NUXA - 15 Preguntas de Salud Mental,FALSE,Pack Básico NUXA - 15 Preguntas con IA,Compra 15 preguntas prepagadas para usar con NUXA. Tu psicólogo de IA disponible 24/7 en más de 150 idiomas. Créditos sin fecha de caducidad.,Health > Mental Health,Unisex,Adult,NUXA-PACK-15,new,FALSE,Créditos,Prepagado,Salud Mental,No Suscripción,,,,,,EUR,FALSE
Pack Premium - 35 Preguntas,pack-premium-35-preguntas,Compra 35 preguntas prepagadas para usar cuando quieras con NUXA - Tu Psicólogo IA. Mejor valor. Créditos que nunca expiran. Sin compromiso de suscripción. Apoyo en salud mental disponible en 150+ idiomas.,NUXA,Health > Mental Health,Créditos Prepagados,salud mental AI psicologia creditos prepagados popular,TRUE,active,NUXA-PACK-PREMIUM-35,,,Standard,35 Preguntas,,,,,10.00,,,TRUE,,,,,,,,allow,0,g,FALSE,manual,https://nuxa.life/images/pack-premium.jpg,1,Pack Premium NUXA - 35 Preguntas de Salud Mental,FALSE,Pack Premium NUXA - 35 Preguntas con IA (Más Popular),Compra 35 preguntas prepagadas con NUXA. El pack con mejor relación calidad-precio. Tu psicólogo de IA disponible 24/7 en más de 150 idiomas. Créditos sin fecha de caducidad.,Health > Mental Health,Unisex,Adult,NUXA-PACK-35,new,FALSE,Créditos,Prepagado,Salud Mental,Mejor Valor,,,,,,EUR,FALSE
Plan Básico Mensual,plan-basico-mensual,Suscripción mensual al Plan Básico de NUXA - Tu Psicólogo IA. 50 preguntas/mes. Apoyo continuo en salud mental con IA. Acceso a chat 24/7. Disponible en 150+ idiomas. Cancela cuando quieras.,NUXA,Health > Mental Health,Suscripción Mensual,salud mental AI psicologia suscripcion mensual,TRUE,active,NUXA-SUB-BASIC-MONTH,,,Billing,Mensual,,,,,2.99,,,TRUE,,,,,,,,allow,0,g,FALSE,manual,https://nuxa.life/images/plan-basico.jpg,1,Plan Básico NUXA - Suscripción Mensual,FALSE,Plan Básico NUXA - Suscripción Mensual €2.99,Suscripción mensual a NUXA. 50 preguntas al mes. Tu psicólogo de IA disponible 24/7 en más de 150 idiomas. Cancela cuando quieras sin compromiso.,Health > Mental Health,Unisex,Adult,NUXA-SUB-BASIC,new,FALSE,Suscripción,Mensual,Salud Mental,Plan Personal,,,,,,EUR,FALSE
Plan Individual Mensual,plan-individual-mensual,Suscripción mensual al Plan Individual de NUXA - Tu Psicólogo IA. 200 preguntas/mes. Apoyo continuo en salud mental con IA. Acceso a chat 24/7. Disponible en 150+ idiomas. Ideal para uso regular. Cancela cuando quieras.,NUXA,Health > Mental Health,Suscripción Mensual,salud mental AI psicologia suscripcion mensual individual,TRUE,active,NUXA-SUB-INDIV-MONTH,,,Billing,Mensual,,,,,5.99,,,TRUE,,,,,,,,allow,0,g,FALSE,manual,https://nuxa.life/images/plan-individual.jpg,1,Plan Individual NUXA - Suscripción Mensual,FALSE,Plan Individual NUXA - Suscripción Mensual €5.99,Suscripción mensual a NUXA. 200 preguntas al mes. Tu psicólogo de IA disponible 24/7 en más de 150 idiomas. Ideal para uso regular.,Health > Mental Health,Unisex,Adult,NUXA-SUB-INDIV,new,FALSE,Suscripción,Mensual,Salud Mental,Plan Personal,,,,,,EUR,FALSE
Plan Premium Anual,plan-premium-anual,Suscripción anual al Plan Premium de NUXA - Tu Psicólogo IA. 500 preguntas/mes (6000/año). El mejor valor. Apoyo continuo en salud mental con IA. Acceso a chat 24/7. Disponible en 150+ idiomas. Ahorra con el plan anual.,NUXA,Health > Mental Health,Suscripción Anual,salud mental AI psicologia suscripcion anual premium,TRUE,active,NUXA-SUB-PREMIUM-YEAR,,,Billing,Anual (12 meses),,,,,32.00,38.88,,TRUE,,,,,,,,allow,0,g,FALSE,manual,https://nuxa.life/images/plan-premium.jpg,1,Plan Premium NUXA - Suscripción Anual,FALSE,Plan Premium NUXA - Suscripción Anual €32/año,Suscripción anual a NUXA. 500 preguntas al mes. El plan con mejor relación calidad-precio. Tu psicólogo de IA disponible 24/7 en más de 150 idiomas.,Health > Mental Health,Unisex,Adult,NUXA-SUB-PREMIUM,new,FALSE,Suscripción,Anual,Salud Mental,Mejor Valor,,,,,,EUR,FALSE
Plan Profesional Empresarial,plan-profesional-empresarial,Solución empresarial para equipos pequeños. Plan Profesional de NUXA. 3-10 empleados. Apoyo integral en salud mental laboral con IA. Dashboard de gestión. Cumple ISO 45003. Informes y métricas. Ideal para startups y PYMEs.,NUXA,Health > Mental Health,Suscripción Empresarial,salud mental AI psicologia empresa ISO45003 profesional,TRUE,active,NUXA-BUS-PROF-MONTH,,,Plan,Profesional (3-10 empleados),,,,,149.50,,,TRUE,,,,,,,,allow,0,g,FALSE,manual,https://nuxa.life/images/plan-profesional.jpg,1,Plan Profesional NUXA - Empresas 3-10 Empleados,FALSE,Plan Profesional NUXA Empresarial - €149.50/mes,Solución empresarial NUXA para equipos de 3-10 empleados. Apoyo en salud mental laboral con IA según ISO 45003. Dashboard de gestión y métricas.,Health > Mental Health,Unisex,Adult,NUXA-BUS-PROF,new,FALSE,Empresarial,Profesional,Salud Laboral,ISO 45003,,,,,,EUR,FALSE
Plan Empresarial,plan-empresarial-completo,Solución empresarial para medianas empresas. Plan Empresarial de NUXA. 11-50 empleados. Apoyo integral en salud mental laboral con IA. Dashboard avanzado. Cumple ISO 45003. Informes detallados. Soporte prioritario.,NUXA,Health > Mental Health,Suscripción Empresarial,salud mental AI psicologia empresa ISO45003 empresarial,TRUE,active,NUXA-BUS-CORP-MONTH,,,Plan,Empresarial (11-50 empleados),,,,,598.00,,,TRUE,,,,,,,,allow,0,g,FALSE,manual,https://nuxa.life/images/plan-empresarial.jpg,1,Plan Empresarial NUXA - Medianas Empresas 11-50 Empleados,FALSE,Plan Empresarial NUXA - €598/mes,Solución empresarial NUXA para equipos de 11-50 empleados. Apoyo completo en salud mental laboral con IA según ISO 45003. Dashboard avanzado y soporte prioritario.,Health > Mental Health,Unisex,Adult,NUXA-BUS-CORP,new,FALSE,Empresarial,Corporativo,Salud Laboral,ISO 45003,,,,,,EUR,FALSE
Plan Corporativo Personalizado,plan-corporativo-personalizado,Solución empresarial personalizada para grandes organizaciones. Plan Corporativo de NUXA. +50 empleados. Apoyo integral en salud mental laboral con IA. Implementación personalizada. Cumple ISO 45003. Integración con sistemas HR. Soporte dedicado.,NUXA,Health > Mental Health,Suscripción Empresarial,salud mental AI psicologia empresa ISO45003 corporativo personalizado,FALSE,active,NUXA-BUS-CUSTOM,,,Plan,Corporativo (+50 empleados),,,,,0.00,,,TRUE,,,,,,,,allow,0,g,FALSE,manual,https://nuxa.life/images/plan-corporativo.jpg,1,Plan Corporativo NUXA - Grandes Empresas +50 Empleados,FALSE,Plan Corporativo NUXA Personalizado - Contacta para Presupuesto,Solución corporativa NUXA para grandes organizaciones (+50 empleados). Implementación personalizada según ISO 45003. Integración con sistemas HR y soporte dedicado.,Health > Mental Health,Unisex,Adult,NUXA-BUS-CUSTOM,new,FALSE,Empresarial,Corporativo,Salud Laboral,Personalizado,,,,,,EUR,FALSE`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(csvContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'nuxa_shopify_products.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-slate-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">
              CSV de Productos NUXA para Shopify
            </CardTitle>
            <CardDescription className="text-lg">
              8 productos digitales listos para importar en tu tienda Shopify
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Botones de acción */}
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={handleDownload}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                data-testid="button-download-csv"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar CSV
              </Button>
              <Button
                onClick={handleCopy}
                variant="outline"
                className="border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                data-testid="button-copy-csv"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    ¡Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar Todo
                  </>
                )}
              </Button>
            </div>

            {/* Productos incluidos */}
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-3 text-emerald-900 dark:text-emerald-100">
                Productos Incluidos:
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>✓ Pack Básico - 15 Preguntas (€5)</li>
                <li>✓ Pack Premium - 35 Preguntas (€10)</li>
                <li>✓ Plan Básico Mensual (€2.99/mes)</li>
                <li>✓ Plan Individual Mensual (€5.99/mes)</li>
                <li>✓ Plan Premium Anual (€32/año)</li>
                <li>✓ Plan Profesional Empresarial (€149.50/mes)</li>
                <li>✓ Plan Empresarial (€598/mes)</li>
                <li>✓ Plan Corporativo Personalizado (precio personalizado)</li>
              </ul>
            </div>

            {/* Textarea con el contenido */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Contenido del CSV (también puedes seleccionar y copiar manualmente):
              </label>
              <textarea
                value={csvContent}
                readOnly
                className="w-full h-96 p-4 font-mono text-xs border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                data-testid="textarea-csv-content"
              />
            </div>

            {/* Instrucciones */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-3 text-blue-900 dark:text-blue-100">
                Cómo importar en Shopify:
              </h3>
              <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
                <li>Descarga o copia el contenido del CSV</li>
                <li>Ve a tu panel de Shopify → Productos</li>
                <li>Haz clic en "Importar"</li>
                <li>Sube el archivo CSV o pega el contenido</li>
                <li>Revisa que los campos se mapeen correctamente</li>
                <li>Confirma la importación</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
