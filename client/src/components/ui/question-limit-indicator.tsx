import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { MessageCircle, AlertTriangle, CheckCircle } from "lucide-react";

export default function QuestionLimitIndicator() {
  const { data: limitData, isLoading } = useQuery({
    queryKey: ["/api/question-limit"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading || !limitData) {
    return null;
  }

  const { limit, remaining, used, canAsk, resetDate } = limitData;
  const percentage = (used / limit) * 100;
  
  const getStatusColor = () => {
    if (remaining === 0) return "text-red-400";
    if (remaining <= 2) return "text-yellow-400";
    return "text-green-400";
  };

  const getProgressColor = () => {
    if (remaining === 0) return "bg-red-500";
    if (remaining <= 2) return "bg-yellow-500";
    return "bg-nflow-orange";
  };

  const formatResetDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-4 h-4 text-nflow-orange" />
          <span className="text-white font-medium text-sm">Preguntas este mes</span>
        </div>
        <div className="flex items-center space-x-2">
          {canAsk ? (
            <CheckCircle className="w-4 h-4 text-green-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-400" />
          )}
          <span className={`text-sm font-semibold ${getStatusColor()}`}>
            {remaining} de {limit}
          </span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-xs text-gray-400">
          <span>Usadas: {used}</span>
          <span>Se reinicia: {formatResetDate(resetDate)}</span>
        </div>
      </div>
      
      {!canAsk && (
        <div className="mt-3 p-2 bg-red-900/20 border border-red-700/50 rounded text-xs text-red-300">
          Has alcanzado tu límite mensual. Se reiniciará el {formatResetDate(resetDate)}.
        </div>
      )}
      
      {canAsk && remaining <= 2 && (
        <div className="mt-3 p-2 bg-yellow-900/20 border border-yellow-700/50 rounded text-xs text-yellow-300">
          Te quedan pocas preguntas este mes.
        </div>
      )}
    </div>
  );
}