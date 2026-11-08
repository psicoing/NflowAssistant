import { Bike, Laptop, Smartphone } from "lucide-react";

export const GIFT_PRIZES_URL = "https://jobda.org/";

export const giftPrizes = [
  {
    users: "15.000",
    label: "usuarios activos",
    icon: Smartphone,
    prize: "Sorteamos 10 iPhones entre toda la comunidad.",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    cardBgColor: "bg-blue-50",
    iconColor: "text-blue-500",
    accent: "text-blue-700",
    borderColor: "border-blue-200",
  },
  {
    users: "30.000",
    label: "usuarios activos",
    icon: Smartphone,
    prize: "Sorteamos 20 iPhones entre toda la comunidad.",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    cardBgColor: "bg-green-50",
    iconColor: "text-green-500",
    accent: "text-green-700",
    borderColor: "border-green-200",
  },
  {
    users: "150.000",
    label: "usuarios activos",
    icon: Bike,
    prize: "Sorteamos 10 bicicletas eléctricas.",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    cardBgColor: "bg-orange-50",
    iconColor: "text-orange-500",
    accent: "text-orange-700",
    borderColor: "border-orange-200",
  },
  {
    users: "300.000",
    label: "usuarios activos",
    icon: Laptop,
    prize: "Sorteamos 20 portátiles última generación.",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/30",
    cardBgColor: "bg-cyan-50",
    iconColor: "text-cyan-600",
    accent: "text-cyan-800",
    borderColor: "border-cyan-200",
  },
];
