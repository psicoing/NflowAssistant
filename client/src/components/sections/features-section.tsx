import { MessageCircle, Book, CheckCircle, Bot, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useLanguageContext } from "@/components/LanguageProvider";

export default function FeaturesSection() {
  const [, setLocation] = useLocation();
  const { t } = useLanguageContext();
  return (
    <section className="px-4 py-14 text-[#234844] sm:py-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Chat Assistant */}
          <div className="rounded-[1.5rem] border border-[#d6e3dc] bg-[#f3f6ef] p-6 shadow-[0_22px_60px_-44px_rgba(19,61,59,0.4)] sm:p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#174f50] text-[#d6e69a]">
                <MessageCircle className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold text-[#173e3d]">{t('features.chat.title')}</h3>
            </div>

            <p className="mb-6 leading-7 text-[#526b68]">{t('features.chat.description')}</p>

            {/* Chat Preview */}
            <div className="mb-6 rounded-2xl border border-[#dce7df] bg-[#f8f9f4] p-4">
              <div className="flex items-start space-x-3 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#174f50]">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="max-w-xs rounded-2xl rounded-tl-none bg-[#174f50] p-3 text-white">
                  <p className="text-sm">{t('features.chat.hello')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 justify-end">
                <div className="max-w-xs rounded-2xl rounded-tr-none bg-[#e3ebe3] p-3 text-[#34534f]">
                  <p className="text-sm">{t('features.chat.anxious')}</p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#9db5a8]">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-[#638b72]" />
                <span className="text-sm text-gray-600">{t('features.chat.feature1')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-[#638b72]" />
                <span className="text-sm text-gray-600">{t('features.chat.feature2')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-[#638b72]" />
                <span className="text-sm text-gray-600">{t('features.chat.feature3')}</span>
              </div>
            </div>
          </div>

          {/* Resources Library */}
          <div className="rounded-[1.5rem] border border-[#d6e3dc] bg-[#f3f6ef] p-6 shadow-[0_22px_60px_-44px_rgba(19,61,59,0.4)] sm:p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#dce8dc] text-[#47736a]">
                <Book className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold text-[#173e3d]">{t('features.resources.title')}</h3>
            </div>

            <p className="mb-6 leading-7 text-[#526b68]">{t('features.resources.description')}</p>

            {/* Resources Preview */}
            <div className="space-y-3 mb-6">
              <div className="rounded-xl border border-[#cbded6] bg-[#eaf1eb] p-4 text-[#234844]">
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
                <CheckCircle className="h-4 w-4 text-[#638b72]" />
                <span className="text-sm text-gray-600">{t('features.resources.feature1')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-[#638b72]" />
                <span className="text-sm text-gray-600">{t('features.resources.feature2')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-[#638b72]" />
                <span className="text-sm text-gray-600">{t('features.resources.feature3')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-[#638b72]" />
                <span className="text-sm text-gray-600">{t('features.resources.feature4')}</span>
              </div>
            </div>
            
            {/* Call to Action Button */}
            <div className="text-center mt-8">
              <Button 
                onClick={() => setLocation("/registro")}
                className="rounded-full bg-[#174f50] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#103f42] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4e8176] focus-visible:ring-offset-2 motion-reduce:transition-none"
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
