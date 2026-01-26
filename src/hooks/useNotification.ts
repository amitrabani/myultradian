import { useCallback, useEffect, useState } from 'react';
import { useSettingsStore } from '../stores/settingsStore';

export type NotificationPermission = 'default' | 'granted' | 'denied';

export function useNotification() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const settings = useSettingsStore((state) => state.notifications);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission as NotificationPermission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.warn('Browser does not support notifications');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result as NotificationPermission);
      return result === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, []);

  const sendNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (!settings.browserNotifications || !settings.enabled) {
        return null;
      }

      if (permission !== 'granted') {
        return null;
      }

      try {
        const notification = new Notification(title, {
          icon: '/vite.svg',
          badge: '/vite.svg',
          ...options,
        });

        // Auto-close after 5 seconds
        setTimeout(() => notification.close(), 5000);

        return notification;
      } catch (error) {
        console.error('Error sending notification:', error);
        return null;
      }
    },
    [permission, settings.browserNotifications, settings.enabled]
  );

  return {
    permission,
    requestPermission,
    sendNotification,
    isSupported: 'Notification' in window,
    isEnabled: settings.browserNotifications && settings.enabled && permission === 'granted',
  };
}
