import type { CycleStage } from '../types/cycle';
import { STAGE_LABELS } from '../types/cycle';

/**
 * Send a browser notification for stage change
 */
export function notifyStageChange(stage: CycleStage): Notification | null {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return null;
  }

  const messages: Record<CycleStage, string> = {
    'ramp-up': 'Time to ease into focus mode',
    'peak': 'Deep focus zone - minimize distractions',
    'downshift': 'Begin winding down your work',
    'recovery': 'Take a break and recharge',
  };

  try {
    return new Notification(`Stage: ${STAGE_LABELS[stage]}`, {
      body: messages[stage],
      icon: '/vite.svg',
      tag: 'ultradian-stage',
    });
  } catch (error) {
    console.error('Notification error:', error);
    return null;
  }
}

/**
 * Send a browser notification for cycle completion
 */
export function notifyCycleComplete(): Notification | null {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return null;
  }

  try {
    return new Notification('Cycle Complete!', {
      body: 'Great work! Take time to reflect on your session.',
      icon: '/vite.svg',
      tag: 'ultradian-complete',
    });
  } catch (error) {
    console.error('Notification error:', error);
    return null;
  }
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }

  return await Notification.requestPermission();
}
