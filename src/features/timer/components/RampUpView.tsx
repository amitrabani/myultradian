import { useState } from 'react';
import { useTimerStore } from '../../../stores/timerStore';
import { STAGE_CONTENT } from '../../../types/cycle';
import { RadixCheckbox } from '../../../components/common/RadixCheckbox';
import { RadixTooltip } from '../../../components/common/RadixTooltip';

interface RampUpViewProps {
  onIntentionSet?: (intention: string) => void;
}

export function RampUpView({ onIntentionSet }: RampUpViewProps) {
  const sessionTags = useTimerStore((state) => state.sessionTags);
  const setStageNote = useTimerStore((state) => state.setStageNote);
  const [intention, setIntention] = useState(sessionTags?.intention || '');
  const [checkedActions, setCheckedActions] = useState<Set<number>>(new Set());

  const stageContent = STAGE_CONTENT['ramp-up'];

  const handleIntentionBlur = () => {
    if (intention.trim()) {
      setStageNote('ramp-up', intention.trim());
      onIntentionSet?.(intention.trim());
    }
  };

  const toggleAction = (index: number) => {
    setCheckedActions((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="stage-view ramp-up-view">
      {/* Warning Badge */}
      {stageContent.warningLabel && (
        <div className="stage-warning-badge stage-warning-amber">
          <WarningIcon />
          <span>{stageContent.warningLabel}</span>
        </div>
      )}

      {/* Intention Input */}
      <div className="intention-section">
        <label className="intention-label">
          <RadixTooltip content="A clear intention helps you stay focused. Keep it to one sentence.">
            <span>What's your intention for this session?</span>
          </RadixTooltip>
        </label>
        <textarea
          className="intention-input"
          placeholder="e.g., Finish the login page layout"
          value={intention}
          onChange={(e) => setIntention(e.target.value)}
          onBlur={handleIntentionBlur}
          maxLength={150}
          rows={2}
        />
        <span className="intention-hint">
          {intention.length}/150 characters
        </span>
      </div>

      {/* Suggested Actions Checklist */}
      <div className="suggested-actions">
        <h4 className="suggested-actions-title">Prepare for focus:</h4>
        <ul className="suggested-actions-list">
          {stageContent.suggestedActions.map((action, index) => (
            <li key={index} className="suggested-action-item">
              <RadixCheckbox
                checked={checkedActions.has(index)}
                onCheckedChange={() => toggleAction(index)}
                label={action}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Progress indicator */}
      <div className="ramp-up-progress">
        <span className="ramp-up-progress-text">
          {checkedActions.size} of {stageContent.suggestedActions.length} completed
        </span>
      </div>
    </div>
  );
}

function WarningIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 5v3M8 11h.01" strokeLinecap="round" />
      <path d="M7.13 2.49L1.84 12a1 1 0 00.87 1.5h10.58a1 1 0 00.87-1.5L8.87 2.49a1 1 0 00-1.74 0z" />
    </svg>
  );
}
