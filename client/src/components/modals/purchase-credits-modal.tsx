import { useState } from "react";
import { Coins, Sparkles, Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PurchaseCreditsModalProps {
  children: React.ReactNode;
}

const packs = [
  {
    id: "pack15",
    questions: 15,
    price: "5€",
    priceValue: 5,
    icon: Coins,
    name: "Pack Básico",
    description: "Perfecto para probar el servicio",
    bgColor: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30",
    borderColor: "border-blue-200 dark:border-blue-700",
    iconColor: "text-blue-600 dark:text-blue-400",
    buttonColor: "bg-blue-600 hover:bg-blue-700"
  },
  {
    id: "pack35",
    questions: 35,
    price: "10€",
    priceValue: 10,
    icon: Sparkles,
    name: "Pack Premium",
    description: "Mejor relación calidad-precio",
    badge: "Más Popular",
    bgColor: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30",
    borderColor: "border-purple-300 dark:border-purple-600",
    iconColor: "text-purple-600 dark:text-purple-400",
    buttonColor: "bg-purple-600 hover:bg-purple-700"
  }
];

export default function PurchaseCreditsModal({ children }: PurchaseCreditsModalProps) {
  const { toast } = useToast();
  const [selectedPack, setSelectedPack] = useState<string | null>(null);

  const purchaseMutation = useMutation({
    mutationFn: async (packId: string) => {
      const response = await apiRequest("POST", "/api/purchase-credits", { pack: packId });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Error desconocido" }));
        throw new Error(errorData.message || `Error ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: (data: any) => {
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast({
          title: "Error",
          description: "No se recibió URL de pago",
          variant: "destructive",
        });
        setSelectedPack(null);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error al procesar compra",
        description: error.message || "No se pudo procesar la compra",
        variant: "destructive",
      });
      setSelectedPack(null);
    },
  });

  const handlePurchase = (packId: string) => {
    setSelectedPack(packId);
    purchaseMutation.mutate(packId);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
        <DialogHeader className="text-center space-y-3">
          <DialogTitle className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
            <Zap className="w-8 h-8 text-yellow-500" />
            Comprar Créditos Adicionales
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 dark:text-gray-300">
            Los créditos prepagados nunca caducan y se usan antes que tu cuota mensual
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          {/* Pack Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {packs.map((pack) => {
              const IconComponent = pack.icon;
              const isProcessing = selectedPack === pack.id && purchaseMutation.isPending;
              
              return (
                <div
                  key={pack.id}
                  className={`${pack.bgColor} rounded-2xl p-6 border-2 ${pack.borderColor} transition-all hover:shadow-lg duration-300 relative`}
                  data-testid={`card-pack-${pack.id}`}
                >
                  {pack.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                      {pack.badge}
                    </div>
                  )}
                  
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`${pack.iconColor} p-3 bg-white dark:bg-gray-800 rounded-full`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {pack.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {pack.description}
                      </p>
                    </div>
                    
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        {pack.questions}
                      </span>
                      <span className="text-lg text-gray-600 dark:text-gray-400">
                        preguntas
                      </span>
                    </div>
                    
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {pack.price}
                    </div>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      €{(pack.priceValue / pack.questions).toFixed(2)} por pregunta
                    </div>
                    
                    <Button
                      onClick={() => handlePurchase(pack.id)}
                      disabled={purchaseMutation.isPending}
                      className={`w-full ${pack.buttonColor} text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-xl transition-all duration-300`}
                      data-testid={`button-buy-${pack.id}`}
                    >
                      {isProcessing ? (
                        <>
                          <span className="inline-block animate-spin mr-2">⏳</span>
                          Procesando...
                        </>
                      ) : (
                        `Comprar ${pack.name}`
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Info Footer */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Los créditos prepagados <strong className="text-gray-900 dark:text-white">nunca caducan</strong></span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Se usan automáticamente <strong className="text-gray-900 dark:text-white">antes que tu cuota mensual</strong></span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Pago único mediante <strong className="text-gray-900 dark:text-white">Stripe (tarjeta segura)</strong></span>
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
