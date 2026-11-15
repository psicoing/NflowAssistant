import { AlertTriangle, CreditCard } from "lucide-react";

export default function PaidAppNotice() {
  return (
    <section className="border-y border-[#d7c8ae] bg-[#f1ede5] py-8 dark:border-[#614a3b] dark:bg-[#102f33]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[1.5rem] border border-[#d7c8ae] border-l-4 border-l-[#a87043] bg-[#f8f6f0] p-6 dark:border-[#614a3b] dark:border-l-[#c19262] dark:bg-[#173e3d] sm:p-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <AlertTriangle className="h-7 w-7 text-[#9a6639]" />
            <h2 className="text-center text-xl font-semibold tracking-[-0.025em] text-[#3d4841] dark:text-[#f2f4e8] sm:text-2xl">
              NUXA es una Aplicación de Pago
            </h2>
            <CreditCard className="h-7 w-7 text-[#9a6639]" />
          </div>
          
          <div className="text-center space-y-3">
            <p className="text-base font-medium leading-7 text-[#3d4841] dark:text-[#e2e9df] sm:text-lg">
              <strong>No hay chat gratuito.</strong> Para acceder al asistente de IA necesitas comprar una suscripción.
            </p>
            
            <p className="text-sm leading-6 text-[#59665d] dark:text-[#c3d8d1] sm:text-base">
              Los recursos informativos están disponibles gratuitamente en la barra de navegación. 
              <br />
              <strong>El chat con IA requiere suscripción activa - sin excepciones.</strong>
            </p>
            
            <div className="flex justify-center pt-4">
              <a 
                href="#precios" 
                className="inline-flex min-h-11 items-center rounded-full bg-[#174f50] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#103f42] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4e8176] focus-visible:ring-offset-2 motion-reduce:transition-none"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Ver Planes de Pago
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}