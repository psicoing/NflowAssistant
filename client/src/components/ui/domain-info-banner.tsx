import { Shield, CheckCircle, Globe, Lock } from "lucide-react";

export default function DomainInfoBanner() {
  return (
    <div className="bg-gradient-to-r from-nflow-orange/90 via-orange-600 to-amber-600 text-white py-4 px-4 text-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="relative max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-3 text-sm font-medium">
          <Globe className="w-4 h-4 text-orange-100" />
          <span>
            <strong>✅ NFLOW Oficial</strong> - Has accedido desde{" "}
            <span className="font-bold text-orange-100">nflow.es, nflow.biz, nflow.gal o nflow.store</span>
          </span>
          <Shield className="w-4 h-4 text-orange-100" />
        </div>
        
        <div className="mt-1 flex items-center justify-center gap-2 text-xs text-orange-100">
          <Lock className="w-3 h-3" />
          <span>Dominio oficial de la app: <strong>nflow-assistant-rmportbou.replit.app</strong> • Conexión 100% segura</span>
        </div>
      </div>
    </div>
  );
}