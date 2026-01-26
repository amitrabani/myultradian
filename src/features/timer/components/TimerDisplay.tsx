import { useTimer } from '../../../hooks/useTimer';
import { useTimerStore } from '../../../stores/timerStore';
import { STAGE_COLORS, STAGE_LABELS } from '../../../types/cycle';

export function TimerDisplay() {
  const { formattedTime, progress } = useTimer();
  const currentStage = useTimerStore((state) => state.currentStage);
  const status = useTimerStore((state) => state.status);

  if (!currentStage || status === 'idle') {
    return null;
  }

  const stageColor = STAGE_COLORS[currentStage];
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center p-6">
      <div className="relative w-72 h-72 drop-shadow-lg">
        <svg viewBox="0 0 256 256" className="w-full h-full -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            className="stroke-base-300"
            strokeWidth="10"
          />
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            strokeWidth="10"
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
            style={{
              stroke: stageColor,
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
              filter: `drop-shadow(0 0 8px ${stageColor})`,
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-radial from-base-100/90 to-base-100/40 rounded-full">
          <span
            className="text-5xl font-bold tabular-nums tracking-tight"
            style={{ color: stageColor }}
            role="timer"
            aria-live="polite"
            aria-atomic="true"
          >
            {formattedTime}
          </span>
          <span className="text-sm text-base-content/60 font-medium mt-2">
            {STAGE_LABELS[currentStage]}
          </span>
        </div>
      </div>

      {status === 'paused' && (
        <div className="badge badge-warning badge-lg mt-4 gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Paused
        </div>
      )}
    </div>
  );
}
