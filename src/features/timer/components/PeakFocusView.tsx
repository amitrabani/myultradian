import { useEffect, useRef } from 'react';
import { useTimerStore } from '../../../stores/timerStore';
import { STAGE_CONTENT } from '../../../types/cycle';
import { DistractionCapture } from './DistractionCapture';

interface PeakFocusViewProps {
  elapsedMinutes: number;
  onCheckpoint?: () => void;
}

export function PeakFocusView({ elapsedMinutes, onCheckpoint }: PeakFocusViewProps) {
  const midPeakCheckpointReached = useTimerStore((state) => state.midPeakCheckpointReached);
  const setMidPeakCheckpoint = useTimerStore((state) => state.setMidPeakCheckpoint);
  const distractionCount = useTimerStore((state) => state.distractions.length);
  const hasCalledCheckpoint = useRef(false);

  const stageContent = STAGE_CONTENT['peak'];
  const checkpointMinutes = stageContent.checkpointMinutes || 30;

  // Check for mid-peak checkpoint
  useEffect(() => {
    if (
      !midPeakCheckpointReached &&
      !hasCalledCheckpoint.current &&
      elapsedMinutes >= checkpointMinutes
    ) {
      hasCalledCheckpoint.current = true;
      setMidPeakCheckpoint();
      onCheckpoint?.();
    }
  }, [elapsedMinutes, midPeakCheckpointReached, setMidPeakCheckpoint, checkpointMinutes, onCheckpoint]);

  return (
    <div className="stage-view peak-focus-view">
      {/* Minimal UI during peak focus */}
      <div className="peak-status">
        {/* Checkpoint indicator */}
        <div className="peak-checkpoint-indicator">
          <div
            className={`checkpoint-dot ${midPeakCheckpointReached ? 'reached' : ''}`}
            title={midPeakCheckpointReached ? 'Mid-peak checkpoint reached!' : `Checkpoint at ${checkpointMinutes}min`}
          />
          <span className="checkpoint-label">
            {midPeakCheckpointReached ? 'Checkpoint reached' : `${checkpointMinutes}min checkpoint`}
          </span>
        </div>

        {/* Distraction counter */}
        {distractionCount > 0 && (
          <div className="distraction-count">
            <span className="distraction-count-badge">{distractionCount}</span>
            <span className="distraction-count-label">
              distraction{distractionCount !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Floating distraction capture button */}
      <DistractionCapture />

      {/* Minimal message */}
      <p className="peak-focus-message">
        Stay focused. Minimize distractions.
      </p>
    </div>
  );
}
