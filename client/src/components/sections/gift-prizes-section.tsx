import { Calendar, ChevronRight } from "lucide-react";
import { GIFT_PRIZES_URL, giftPrizes } from "@/components/sections/gift-prizes-data";

export default function GiftPrizesSection() {
  return (
    <section
      id="premios"
      aria-labelledby="gift-prizes-title"
      className="relative isolate overflow-hidden border-y border-white/10 bg-[#101b32] px-4 py-14 text-white sm:px-6 sm:py-16"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-400/[0.07] blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-orange-300/[0.06] blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-cyan-200/80">
            Crecemos en comunidad
          </p>
          <h2 id="gift-prizes-title" className="text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
            Gana premios reales solo por formar parte
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base">
            Premios previstos al alcanzar cada hito de usuarios activos mensuales.
          </p>
          <a
            href={GIFT_PRIZES_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="button-fecha-sorteos"
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-950/25 transition-colors hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 focus:ring-offset-[#101b32]"
          >
            <Calendar className="h-4 w-4" aria-hidden="true" />
            Fecha sorteos
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {giftPrizes.map((prize) => {
            const PrizeIcon = prize.icon;
            return (
              <article
                key={prize.users}
                data-testid={`card-prize-${prize.users}`}
                className={`group min-h-44 rounded-2xl border ${prize.borderColor} ${prize.cardBgColor} p-5 text-slate-900 shadow-[0_12px_30px_rgba(2,8,23,0.14)] transition-transform duration-200 hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none sm:p-6`}
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-0.5 flex h-11 w-11 flex-none items-center justify-center rounded-full bg-white/90 shadow-sm ${prize.iconColor}`}>
                    <PrizeIcon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-2xl font-black tracking-tight text-slate-900">{prize.users}</span>
                      <span className="text-xs font-medium leading-relaxed text-slate-600">{prize.label}</span>
                    </div>
                    <p className={`mt-3 text-sm font-semibold leading-relaxed ${prize.accent}`}>
                      {prize.prize}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
