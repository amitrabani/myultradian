import { useEffect, useCallback } from 'react';
import { KEYBOARD_SHORTCUTS } from '../utils/constants';

interface ShortcutHandlers {
  onPauseResume?: () => void;
  onEndSession?: () => void;
  onSkipStage?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers, enabled = true) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Ignore if user is typing in an input
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      switch (event.key) {
        case KEYBOARD_SHORTCUTS.PAUSE_RESUME:
          event.preventDefault();
          handlers.onPauseResume?.();
          break;
        case KEYBOARD_SHORTCUTS.END_SESSION:
          event.preventDefault();
          handlers.onEndSession?.();
          break;
        case KEYBOARD_SHORTCUTS.SKIP_STAGE:
          // Only if Ctrl/Cmd is pressed
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            handlers.onSkipStage?.();
          }
          break;
      }
    },
    [enabled, handlers]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
