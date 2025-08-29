import { Shield, CheckCircle, Globe, Lock } from "lucide-react";

export default function DomainInfoBanner() {
  return (
    <div className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white py-4 px-4 text-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-blue-700/20"></div>
      
      <div className="relative max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-3 text-sm font-medium">
          <Globe className="w-4 h-4 text-blue-100" />
          <span>
            <strong>✅ NFLOW Oficial</strong> - Nos puedes conocer por{" "}
            <span className="font-bold text-blue-100">nflow.es • nflow.biz • nflow.gal • nflow.store • nflow.style</span>
          </span>
          <Shield className="w-4 h-4 text-blue-100" />
        </div>
        
        <div className="mt-1 flex items-center justify-center gap-2 text-xs text-blue-100">
          <Lock className="w-3 h-3" />
          <span>Dominio oficial de la app: <strong>nflow.style</strong> • Conexión 100% segura</span>
        </div>
      </div>
    </div>
  );
}