import { Calendar, ChevronRight } from "lucide-react";
import { GIFT_PRIZES_URL, giftPrizes } from "@/components/sections/gift-prizes-data";

export default function GiftPrizesSection() {
  return (
    <section
      id="premios"
      aria-labelledby="gift-prizes-title"
       className="relative isolate overflow-hidden border-y border-[#315d5b] bg-[#123f43] px-4 py-14 text-[#f2f4e8] sm:px-6 sm:py-16"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-20 h-80 w-80 rounded-full border border-[#6d9d8c]/25" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-5 -top-1 h-56 w-56 rounded-full border border-[#6d9d8c]/20" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#b7d7c4]">
            Crecemos en comunidad
          </p>
          <h2 id="gift-prizes-title" className="text-2xl font-semibold leading-tight tracking-[-0.035em] text-[#f2f4e8] sm:text-3xl lg:text-4xl">
            Gana premios reales solo por formar parte
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#c3d8d1] sm:text-base">
            Premios previstos al alcanzar cada hito de usuarios activos mensuales.
          </p>
          <a
            href={GIFT_PRIZES_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="button-fecha-sorteos"
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#d6e69a] px-5 py-2.5 text-sm font-semibold text-[#173e3d] transition-colors hover:bg-[#e3edb8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eff5c7] focus-visible:ring-offset-2 focus-visible:ring-offset-[#123f43] motion-reduce:transition-none"
          >
            <Calendar className="h-4 w-4" aria-hidden="true" />
            Fecha sorteos
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <div className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {giftPrizes.map((prize) => {
            const PrizeIcon = prize.icon;
            return (
              <article
                key={prize.users}
                data-testid={`card-prize-${prize.users}`}
                className={`group min-h-44 rounded-[1.25rem] border ${prize.borderColor} ${prize.cardBgColor} p-5 text-[#234844] shadow-[0_16px_35px_-28px_rgba(13,57,58,0.55)] transition-colors duration-200 hover:brightness-[0.985] motion-reduce:transition-none sm:p-6`}
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-0.5 flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-white/70 ${prize.iconColor}`}>
                    <PrizeIcon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-2xl font-semibold tracking-tight text-[#234844]">{prize.users}</span>
                      <span className="text-xs font-medium leading-relaxed text-[#647b75]">{prize.label}</span>
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
