import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Brain, ArrowRight, Eye, Users, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";

export default function ChatExamplesSection() {
  const { t } = useLanguage();
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-nflow-dark to-nflow-navy">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-gradient-to-br from-nflow-orange to-orange-600 rounded-2xl shadow-lg">
              <Eye className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('examples.assistant.title')}
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t('examples.assistant.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left side - Features */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {t('examples.features.language.title')}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {t('examples.features.language.description')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {t('examples.features.ages.title')}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {t('examples.features.ages.description')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {t('examples.features.professional.title')}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {t('examples.features.professional.description')}
                </p>
              </div>
            </div>
          </div>

          {/* Right side - CTA Card */}
          <div>
            <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-gray-700/50 overflow-hidden">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-nflow-orange to-orange-600 rounded-2xl mx-auto flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {t('examples.cta.title')}
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      {t('examples.cta.description')}
                    </p>
                  </div>

                  <div className="bg-gray-700/30 rounded-lg p-4 text-left">
                    <div className="text-sm text-gray-400 mb-2">{t('examples.cta.includes')}</div>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• {t('examples.cta.item1')}</li>
                      <li>• {t('examples.cta.item2')}</li>
                      <li>• {t('examples.cta.item3')}</li>
                      <li>• {t('examples.cta.item4')}</li>
                    </ul>
                  </div>

                  <Link href="/ejemplos-chat">
                    <Button 
                      className="w-full bg-nflow-orange hover:bg-nflow-orange-light text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 group"
                    >
                      {t('examples.cta.button')}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>

                  <p className="text-xs text-gray-500">
                    {t('examples.cta.note')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}