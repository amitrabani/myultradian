import { useTimerStore } from '../../../stores/timerStore';
import { STAGE_ORDER, STAGE_LABELS, STAGE_COLORS, STAGE_DESCRIPTIONS } from '../../../types/cycle';

export function StageIndicator() {
  const currentStage = useTimerStore((state) => state.currentStage);
  const currentStageIndex = useTimerStore((state) => state.currentStageIndex);
  const status = useTimerStore((state) => state.status);

  if (status === 'idle') {
    return null;
  }

  return (
    <div className="w-full max-w-md px-4">
      {/* Stage progress bar */}
      <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-base-300">
        {STAGE_ORDER.map((stage, index) => {
          const isActive = stage === currentStage;
          const isCompleted = index < currentStageIndex;
          const stageColor = STAGE_COLORS[stage];

          return (
            <div key={stage} className="flex-1 relative overflow-hidden">
              <div
                className="absolute inset-0 transition-all duration-500"
                style={{
                  width: isCompleted || isActive ? '100%' : '0%',
                  backgroundColor: isCompleted || isActive ? stageColor : 'transparent',
                  opacity: isCompleted ? 1 : isActive ? 0.7 : 0,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Stage labels */}
      <div className="flex justify-between mt-2 text-xs text-base-content/60">
        {STAGE_ORDER.map((stage) => {
          const isActive = stage === currentStage;

          return (
            <span
              key={stage}
              className={`transition-all ${isActive ? 'font-semibold text-base-content' : ''}`}
            >
              {STAGE_LABELS[stage].split(' ')[0]}
            </span>
          );
        })}
      </div>

      {/* Current stage description */}
      {currentStage && (
        <div
          className="mt-4 p-4 rounded-2xl text-center text-sm"
          style={{ backgroundColor: `${STAGE_COLORS[currentStage]}15` }}
        >
          <p className="text-base-content/80">{STAGE_DESCRIPTIONS[currentStage]}</p>
        </div>
      )}
    </div>
  );
}
