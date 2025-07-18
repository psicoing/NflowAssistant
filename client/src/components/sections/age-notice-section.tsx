import { Calendar, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguageContext } from "@/components/LanguageProvider";

export default function AgeNoticeSection() {
  const { t } = useLanguageContext();
  return (
    <section className="py-12 px-4 bg-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-nflow-orange rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <Card className="bg-gray-800/95 border-2 border-nflow-orange/50 shadow-2xl backdrop-blur-sm overflow-hidden">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-nflow-orange/10 to-blue-500/10"></div>
          
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between gap-8 md:flex-row flex-col">
              {/* Left side - Icon and title */}
              <div className="flex items-center gap-6">
                <div className="p-3 bg-nflow-orange rounded-lg">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-nflow-orange via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                    {t('ageWarning.title')}
                  </h2>
                  <p className="text-gray-300 mt-2">
                    {t('ageWarning.subtitle')}
                  </p>
                </div>
              </div>

              {/* Right side - Age range display */}
              <div className="text-center bg-gray-700/80 border-2 border-nflow-orange/60 rounded-2xl p-6 min-w-fit">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-6 h-6 text-nflow-orange mr-2" />
                  <div className="text-4xl font-bold text-nflow-orange">
                    18 a 95
                  </div>
                </div>
                <div className="text-sm font-medium text-white">{t('ageWarning.years')}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}