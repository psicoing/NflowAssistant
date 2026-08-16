import { MessageCircle, Book, CheckCircle, Bot, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useLanguageContext } from "@/components/LanguageProvider";

export default function FeaturesSection() {
  const [, setLocation] = useLocation();
  const { t } = useLanguageContext();
  return (
    <section className="py-20 px-4 bg-nflow-light text-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Chat Assistant */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{t('features.chat.title')}</h3>
            </div>

            <p className="text-gray-600 mb-6">{t('features.chat.description')}</p>

            {/* Chat Preview */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <div className="flex items-start space-x-3 mb-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-tl-none max-w-xs">
                  <p className="text-sm">{t('features.chat.hello')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 justify-end">
                <div className="bg-gray-300 text-gray-800 p-3 rounded-2xl rounded-tr-none max-w-xs">
                  <p className="text-sm">{t('features.chat.anxious')}</p>
                </div>
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">{t('features.chat.feature1')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">{t('features.chat.feature2')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">{t('features.chat.feature3')}</span>
              </div>
            </div>
          </div>

          {/* Resources Library */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-nflow-orange rounded-xl flex items-center justify-center">
                <Book className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{t('features.resources.title')}</h3>
            </div>

            <p className="text-gray-600 mb-6">{t('features.resources.description')}</p>

            {/* Resources Preview */}
            <div className="space-y-3 mb-6">
              <div className="bg-gradient-to-r from-nflow-orange to-nflow-orange-light p-4 rounded-xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold mb-1">NUXA - Recursos</h4>
                    <p className="text-sm opacity-90">{t('features.resources.library')}</p>
                  </div>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-nflow-orange" />
                <span className="text-sm text-gray-600">{t('features.resources.feature1')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-nflow-orange" />
                <span className="text-sm text-gray-600">{t('features.resources.feature2')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-nflow-orange" />
                <span className="text-sm text-gray-600">{t('features.resources.feature3')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-nflow-orange" />
                <span className="text-sm text-gray-600">{t('features.resources.feature4')}</span>
              </div>
            </div>
            
            {/* Call to Action Button */}
            <div className="text-center mt-8">
              <Button 
                onClick={() => setLocation("/registro")}
                className="bg-gradient-to-r from-nflow-orange to-orange-600 hover:from-orange-600 hover:to-red-500 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl animate-bounce hover:animate-none"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                {t('features.cta')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
