import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
  persistent?: boolean;
}

interface NotificationSystemProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export function NotificationSystem({ notifications, onDismiss }: NotificationSystemProps) {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBackgroundColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 border-green-500/30';
      case 'error':
        return 'bg-red-500/20 border-red-500/30';
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-500/30';
      case 'info':
      default:
        return 'bg-blue-500/20 border-blue-500/30';
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onDismiss={onDismiss}
          getIcon={getIcon}
          getBackgroundColor={getBackgroundColor}
        />
      ))}
    </div>
  );
}

interface NotificationItemProps {
  notification: Notification;
  onDismiss: (id: string) => void;
  getIcon: (type: Notification['type']) => JSX.Element;
  getBackgroundColor: (type: Notification['type']) => string;
}

function NotificationItem({ notification, onDismiss, getIcon, getBackgroundColor }: NotificationItemProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    if (!notification.persistent && notification.duration !== 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onDismiss(notification.id), 300);
      }, notification.duration || 5000);
      
      return () => clearTimeout(timer);
    }
  }, [notification.id, notification.duration, notification.persistent, onDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(notification.id), 300);
  };

  return (
    <div
      className={`
        ${getBackgroundColor(notification.type)}
        border backdrop-blur-sm rounded-xl p-4 shadow-xl
        transform transition-all duration-300 ease-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className="flex items-start space-x-3">
        {getIcon(notification.type)}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white">
            {notification.title}
          </h4>
          <p className="text-sm text-gray-300 mt-1">
            {notification.message}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="h-auto p-1 text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// Hook for managing notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { ...notification, id }]);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Connection status notifications
  useEffect(() => {
    const handleOnline = () => {
      addNotification({
        type: 'success',
        title: 'Conexión restablecida',
        message: 'Tu chat está funcionando normalmente',
        duration: 3000
      });
    };

    const handleOffline = () => {
      addNotification({
        type: 'warning',
        title: 'Sin conexión a internet',
        message: 'Algunos mensajes pueden no enviarse',
        persistent: true
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    notifications,
    addNotification,
    dismissNotification,
    clearAll
  };
}