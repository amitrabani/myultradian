import { useEffect, useRef, useCallback, useState } from 'react';
import { useTimerStore } from '../stores/timerStore';
import { TIMER_UPDATE_INTERVAL } from '../utils/constants';

interface TimerDisplay {
  remainingMs: number;
  elapsedMs: number;
  progress: number;
  formattedTime: string;
}

/**
 * Hook that provides drift-corrected timer updates
 * Uses timestamps instead of accumulating intervals to prevent drift
 */
export function useTimer(): TimerDisplay {
  const status = useTimerStore((state) => state.status);
  const getElapsedStageMs = useTimerStore((state) => state.getElapsedStageMs);
  const getRemainingStageMs = useTimerStore((state) => state.getRemainingStageMs);
  const getProgress = useTimerStore((state) => state.getProgress);

  const [display, setDisplay] = useState<TimerDisplay>({
    remainingMs: 0,
    elapsedMs: 0,
    progress: 0,
    formattedTime: '00:00',
  });

  const rafRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const formatTime = useCallback((ms: number): string => {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const updateDisplay = useCallback(() => {
    const now = performance.now();

    // Throttle updates to prevent excessive re-renders
    if (now - lastUpdateRef.current < TIMER_UPDATE_INTERVAL) {
      return;
    }
    lastUpdateRef.current = now;

    const remainingMs = getRemainingStageMs();
    const elapsedMs = getElapsedStageMs();
    const progress = getProgress();

    setDisplay({
      remainingMs,
      elapsedMs,
      progress,
      formattedTime: formatTime(remainingMs),
    });
  }, [getRemainingStageMs, getElapsedStageMs, getProgress, formatTime]);

  // Main timer loop using requestAnimationFrame for smooth updates
  useEffect(() => {
    if (status !== 'running') {
      // Still update display once when paused/idle to show correct state
      updateDisplay();
      return;
    }

    const tick = () => {
      updateDisplay();
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [status, updateDisplay]);

  // Handle visibility change for drift correction
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Force immediate update when tab becomes visible
        updateDisplay();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [updateDisplay]);

  return display;
}

/**
 * Hook for detecting stage completion
 */
export function useStageCompletion(onStageComplete: () => void) {
  const status = useTimerStore((state) => state.status);
  const getRemainingStageMs = useTimerStore((state) => state.getRemainingStageMs);

  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (status !== 'running') {
      hasTriggeredRef.current = false;
      return;
    }

    const checkCompletion = () => {
      const remaining = getRemainingStageMs();

      if (remaining <= 0 && !hasTriggeredRef.current) {
        hasTriggeredRef.current = true;
        onStageComplete();
      }
    };

    const interval = setInterval(checkCompletion, 100);
    return () => clearInterval(interval);
  }, [status, getRemainingStageMs, onStageComplete]);
}
