import { Phone } from "lucide-react";
import { Link } from "wouter";

export default function NuxaBrandEvolutionSection() {
  return (
    <section
      aria-label="Teléfonos de urgencias"
      className="relative bg-white dark:bg-slate-900 py-6 md:py-8"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
        <Link
          href="/recursos?helplines=true"
          className="inline-flex w-full sm:w-auto min-h-14 items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-5 sm:px-8 py-3 text-white shadow-md transition-colors hover:from-red-700 hover:to-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-4 dark:focus-visible:ring-offset-slate-900"
          data-testid="button-emergency-helplines"
        >
          <Phone aria-hidden="true" className="h-5 w-5 shrink-0" />
          <span className="flex flex-col items-start leading-tight">
            <span className="text-sm sm:text-base font-bold">TELÉFONOS DE URGENCIAS</span>
            <span className="text-xs opacity-90">Emergency Helplines</span>
          </span>
        </Link>
      </div>
    </section>
  );
}
