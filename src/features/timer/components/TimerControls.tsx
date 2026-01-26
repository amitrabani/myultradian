import { useTimerStore } from '../../../stores/timerStore';
import { Button } from '../../../components/common/Button';

interface TimerControlsProps {
  onEnd: () => void;
}

export function TimerControls({ onEnd }: TimerControlsProps) {
  const status = useTimerStore((state) => state.status);
  const pauseSession = useTimerStore((state) => state.pauseSession);
  const resumeSession = useTimerStore((state) => state.resumeSession);
  const skipStage = useTimerStore((state) => state.skipStage);

  if (status === 'idle' || status === 'completed') {
    return null;
  }

  const isPaused = status === 'paused';

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
      {/* Pause/Resume button */}
      <Button
        variant="primary"
        size="lg"
        onClick={isPaused ? resumeSession : pauseSession}
        aria-label={isPaused ? 'Resume timer' : 'Pause timer'}
        className="gap-2"
      >
        {isPaused ? (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
            Resume
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Pause
          </>
        )}
      </Button>

      {/* Skip stage button */}
      <Button
        variant="secondary"
        size="lg"
        onClick={skipStage}
        aria-label="Skip to next stage"
        className="gap-2"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
        </svg>
        Skip
      </Button>

      {/* End session button */}
      <Button
        variant="danger"
        size="lg"
        onClick={onEnd}
        aria-label="End session"
        className="gap-2"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
            clipRule="evenodd"
          />
        </svg>
        End
      </Button>
    </div>
  );
}
