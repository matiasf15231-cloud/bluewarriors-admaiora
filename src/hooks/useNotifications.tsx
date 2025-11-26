import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import logo from '@/assets/bluewarriors-logo.png';

type NotificationPermission = 'default' | 'granted' | 'denied';

export const useNotifications = () => {
  const { toast } = useToast();
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: 'Navegador no compatible',
        description: 'Este navegador no soporta notificaciones de escritorio.',
        variant: 'destructive',
      });
      return;
    }

    const currentPermission = await Notification.requestPermission();
    setPermission(currentPermission);

    if (currentPermission === 'granted') {
      toast({
        title: '¡Notificaciones activadas!',
        description: 'Ahora recibirás recordatorios importantes.',
      });
      // Send a welcome notification
      sendNotification('¡Bienvenido a las notificaciones!', {
        body: 'Has activado las notificaciones para BlueWarriors.',
      });
    } else if (currentPermission === 'denied') {
      toast({
        title: 'Permiso denegado',
        description: 'Has bloqueado las notificaciones. Puedes cambiarlas en la configuración de tu navegador.',
        variant: 'destructive',
      });
    }
  };

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (Notification.permission !== 'granted') {
      console.warn('Notification permission not granted.');
      return;
    }

    new Notification(title, {
      ...options,
      icon: logo, // Use the team logo as the icon
      badge: logo,
    });
  };

  return { permission, requestNotificationPermission, sendNotification };
};