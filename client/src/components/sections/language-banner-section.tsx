import { Badge } from "@/components/ui/badge";
import { Globe } from "lucide-react";

export default function LanguageBannerSection() {
  return (
    <section className="pt-20 pb-4 bg-gradient-to-r from-blue-900/30 via-blue-800/20 to-blue-900/30 border-b border-blue-700/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <Badge 
            variant="secondary" 
            className="bg-blue-900/50 hover:bg-blue-800/60 text-blue-100 border border-blue-600/30 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-all duration-300"
          >
            <Globe className="h-4 w-4 mr-2" />
            Speaking 150+ languages • 支持150多种语言
          </Badge>
        </div>
      </div>
    </section>
  );
}