import { Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GIFT_PRIZES_URL, giftPrizes } from "@/components/sections/gift-prizes-data";

interface GiftPrizesModalProps {
  children: React.ReactNode;
}

export default function GiftPrizesModal({ children }: GiftPrizesModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950">
        <DialogHeader className="text-center space-y-3">
          <DialogTitle className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            ¡Gana premios reales solo por formar parte!
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 dark:text-gray-300">
            Haz clic aquí o descubre el globo flotante con nuestros premios.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Premios por hitos de usuarios activos mensuales:
            </p>
            
            <Button 
              asChild
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <a 
                href={GIFT_PRIZES_URL}
                target="_blank" 
                rel="noopener noreferrer"
                data-testid="button-fecha-sorteos"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Fecha sorteos
              </a>
            </Button>
          </div>

          {/* Prize Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {giftPrizes.map((prize) => {
              const IconComponent = prize.icon;
              return (
                <div
                  key={prize.users}
                  className={`${prize.bgColor} rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-transform hover:scale-105 duration-300`}
                  data-testid={`card-prize-${prize.users}`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`${prize.iconColor} mt-1`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline space-x-2 mb-2">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {prize.users}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {prize.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {prize.prize}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Motivational Text */}
          <div className="text-center pt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">
              Sigue invitando, creciendo y soñando. Estamos más cerca de los premios gracias a ti.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
