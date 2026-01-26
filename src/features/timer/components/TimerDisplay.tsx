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
    <div className="flex flex-col items-center p-6 relative">
      <div className="relative w-72 h-72">
        <svg viewBox="0 0 256 256" className="w-full h-full -rotate-90">
          {/* Track */}
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            className="stroke-base-200"
            strokeWidth="10"
          />
          {/* Progress */}
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            strokeWidth="10"
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              stroke: stageColor,
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center">
            <span
              className="text-6xl font-bold tabular-nums tracking-tight block leading-none"
              style={{ color: stageColor }}
              role="timer"
              aria-live="polite"
              aria-atomic="true"
            >
              {formattedTime}
            </span>
            <span className="text-sm text-base-content/60 font-medium mt-3 uppercase tracking-wider block">
              {STAGE_LABELS[currentStage]}
            </span>
          </div>
        </div>
      </div>

      {status === 'paused' && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-base-100 px-5 py-2 rounded-lg border border-base-300 shadow-md z-10">
          <span className="font-semibold uppercase tracking-wide text-warning text-sm">Paused</span>
        </div>
      )}
    </div>
  );
}
