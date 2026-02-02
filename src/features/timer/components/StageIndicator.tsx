import { useRef, useEffect } from 'react';
import { Target, Lightbulb } from 'lucide-react';
import { useTimerStore } from '../../../stores/timerStore';
import { STAGE_ORDER, STAGE_LABELS, STAGE_COLORS, STAGE_DESCRIPTIONS } from '../../../types/cycle';

export function StageIndicator() {
  const currentStage = useTimerStore((state) => state.currentStage);
  const currentStageIndex = useTimerStore((state) => state.currentStageIndex);
  const status = useTimerStore((state) => state.status);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && currentStage) {
      const activeElement = scrollRef.current.querySelector(`[data-stage="${currentStage}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [currentStage]);

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

      {/* Stage Carousel */}
      <div className="mt-6 relative">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 pb-4 px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {STAGE_ORDER.map((stage) => {
            const isActive = stage === currentStage;
            const description = STAGE_DESCRIPTIONS[stage];
            const [title, ...rest] = description.split('\n\n');

            return (
              <div
                key={stage}
                data-stage={stage}
                className={`snap-center shrink-0 w-full p-5 rounded-2xl border transition-all duration-300 ${isActive
                  ? 'bg-base-200 border-base-content/10 shadow-lg scale-[1.02]'
                  : 'bg-base-200/40 border-transparent opacity-40 scale-95 blur-[1px]'
                  }`}
                style={{
                  backgroundColor: isActive ? `${STAGE_COLORS[stage]}15` : undefined,
                  borderColor: isActive ? `${STAGE_COLORS[stage]}30` : undefined
                }}
              >
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2" style={{ color: STAGE_COLORS[stage] }}>
                  {title.replace(/\*\*/g, '')}
                </h3>
                <div className="space-y-3 text-sm leading-relaxed text-base-content/80">
                  {rest.join('\n\n').split('\n').map((line, i) => {
                    const isAction = line.startsWith('Action:');
                    const isGoal = line.startsWith('Goal:');

                    return (
                      <div key={i} className="flex gap-3 items-start">
                        {isAction && <Target className="w-4 h-4 mt-0.5 shrink-0 opacity-70" />}
                        {isGoal && <Lightbulb className="w-4 h-4 mt-0.5 shrink-0 opacity-70" />}
                        {!isAction && !isGoal && <div className="w-4" />}
                        <p>{line.replace(/^(Action|Goal):\s*/, '')}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-1.5 mt-1">
          {STAGE_ORDER.map((stage) => (
            <div
              key={stage}
              className={`h-1 rounded-full transition-all duration-300 ${stage === currentStage ? 'w-6 bg-base-content/40' : 'w-1.5 bg-base-content/10'
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
