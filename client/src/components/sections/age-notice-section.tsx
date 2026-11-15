import { Calendar, Users, UserCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguageContext } from "@/components/LanguageProvider";

export default function AgeNoticeSection() {
  const { t } = useLanguageContext();
  return (
    <section className="bg-[#123f43] px-4 py-12 sm:py-14">

      <div className="relative mx-auto max-w-5xl">
        <Card className="overflow-hidden rounded-[1.5rem] border border-[#6d9d8c]/45 bg-[#f3f6ef] text-[#234844]">

          <CardContent className="relative z-10 p-5 sm:p-7">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">

              {/* Left side – icon + text */}
              <div className="flex flex-1 items-center gap-4">
                <div className="flex-shrink-0 rounded-xl bg-[#174f50] p-3 text-[#d6e69a]">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold leading-tight tracking-[-0.03em] text-[#173e3d] sm:text-2xl md:text-3xl">
                    {t('ageWarning.title')}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#647b75] md:text-base">
                    {t('ageWarning.subtitle')}
                  </p>
                </div>
              </div>

              {/* Right side – two badges */}
              <div className="flex w-full flex-shrink-0 gap-3 sm:w-auto">
                {/* Adults */}
                <div className="min-w-0 flex-1 rounded-xl border border-[#cbded6] bg-[#eaf1eb] px-4 py-3 text-center sm:min-w-[110px] sm:px-5 sm:py-4">
                  <div className="flex items-center justify-center mb-1">
                    <Users className="mr-1.5 h-4 w-4 text-[#557d65]" />
                    <div className="text-2xl font-semibold text-[#234844] sm:text-3xl">
                      {t('ageWarning.adult')}
                    </div>
                  </div>
                  <div className="text-xs font-medium text-[#647b75]">{t('ageWarning.adultLabel')}</div>
                </div>

                {/* Minors with guardian */}
                <div className="min-w-0 flex-1 rounded-xl border border-[#cbded6] bg-[#eaf1eb] px-4 py-3 text-center sm:min-w-[110px] sm:px-5 sm:py-4">
                  <div className="flex items-center justify-center mb-1">
                    <UserCheck className="mr-1.5 h-4 w-4 text-[#557d65]" />
                    <div className="text-xl font-semibold text-[#234844] sm:text-2xl">
                      {t('ageWarning.minor')}
                    </div>
                  </div>
                  <div className="text-xs font-medium text-[#647b75]">{t('ageWarning.minorLabel')}</div>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
