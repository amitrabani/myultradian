import { useState, useEffect } from 'react';
import { useTimerStore } from '../../../stores/timerStore';
import { STAGE_CONTENT } from '../../../types/cycle';
import { Input } from '../../../components/common/Input';

interface DownshiftViewProps {
  isStageStart?: boolean;
}

export function DownshiftView({ isStageStart = false }: DownshiftViewProps) {
  const setStageNote = useTimerStore((state) => state.setStageNote);
  const stageNotes = useTimerStore((state) => state.stageNotes);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showQuestions, setShowQuestions] = useState(isStageStart);

  const stageContent = STAGE_CONTENT['downshift'];
  const questions = stageContent.questions || [];

  // Show questions briefly at stage start
  useEffect(() => {
    if (isStageStart) {
      setShowQuestions(true);
      const timer = setTimeout(() => {
        setShowQuestions(false);
      }, 30000); // Show for 30 seconds
      return () => clearTimeout(timer);
    }
  }, [isStageStart]);

  const handleAnswerChange = (index: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [index]: value }));
  };

  const handleAnswerBlur = () => {
    // Combine all answers into stage notes
    const combinedNotes = questions
      .map((q, i) => (answers[i] ? `${q}: ${answers[i]}` : null))
      .filter(Boolean)
      .join('\n');

    if (combinedNotes) {
      setStageNote('downshift', combinedNotes);
    }
  };

  return (
    <div className="stage-view downshift-view">
      {/* Prominent Warning */}
      {stageContent.warningLabel && (
        <div className="stage-warning-badge stage-warning-red">
          <StopIcon />
          <span>{stageContent.warningLabel}</span>
        </div>
      )}

      {/* Suggested Actions */}
      <div className="downshift-actions">
        <h4 className="downshift-actions-title">Wind down activities:</h4>
        <ul className="downshift-actions-list">
          {stageContent.suggestedActions.map((action, index) => (
            <li key={index} className="downshift-action-item">
              <CheckCircleIcon />
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Reflection Questions */}
      {showQuestions && questions.length > 0 && (
        <div className="downshift-questions">
          <h4 className="downshift-questions-title">Quick reflection:</h4>
          {questions.map((question, index) => (
            <div key={index} className="downshift-question">
              <Input
                label={question}
                placeholder="Optional..."
                value={answers[index] || ''}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                onBlur={handleAnswerBlur}
              />
            </div>
          ))}
        </div>
      )}

      {/* Toggle to show/hide questions */}
      {!showQuestions && questions.length > 0 && (
        <button
          className="downshift-show-questions"
          onClick={() => setShowQuestions(true)}
        >
          Show reflection questions
        </button>
      )}

      {/* Existing notes preview */}
      {stageNotes['downshift'] && (
        <div className="downshift-notes-preview">
          <span className="downshift-notes-label">Your notes:</span>
          <p className="downshift-notes-text">{stageNotes['downshift']}</p>
        </div>
      )}
    </div>
  );
}

function StopIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="6" />
      <path d="M10.5 5.5l-5 5M5.5 5.5l5 5" strokeLinecap="round" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="6" />
      <path d="M5.5 8l2 2 3-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
