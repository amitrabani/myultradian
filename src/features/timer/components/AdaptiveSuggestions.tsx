import { useState } from 'react';
import { useCycleIntelligence, useEnergySuggestion } from '../../../hooks/useCycleIntelligence';
import { RadixTooltip } from '../../../components/common/RadixTooltip';
import { TASK_TYPE_LABELS } from '../../../types/record';

interface AdaptiveSuggestionsProps {
  energy: 1 | 2 | 3 | 4 | 5 | null;
  defaultPeakMinutes: number;
  onSuggestionApply?: (suggestedPeakMinutes: number) => void;
}

export function AdaptiveSuggestions({
  energy,
  defaultPeakMinutes,
  onSuggestionApply,
}: AdaptiveSuggestionsProps) {
  const [dismissed, setDismissed] = useState(false);
  const { patterns, showSuggestions, insights } = useCycleIntelligence();
  const { suggestion, suggestedPeakMinutes } = useEnergySuggestion(energy, defaultPeakMinutes);

  // Don't show if not enough data or dismissed
  if (!showSuggestions || dismissed) {
    return null;
  }

  // Don't show if no energy selected yet
  if (!energy || !suggestion) {
    return null;
  }

  const peakDifference = suggestedPeakMinutes - defaultPeakMinutes;
  const hasPeakSuggestion = Math.abs(peakDifference) >= 5;

  return (
    <div className="adaptive-suggestions">
      <div className="adaptive-suggestions-header">
        <div className="adaptive-suggestions-title">
          <LightbulbIcon />
          <span>Based on your patterns</span>
        </div>
        <button
          className="adaptive-suggestions-dismiss"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss suggestions"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="adaptive-suggestions-content">
        {/* Energy-based message */}
        <p className="adaptive-energy-message">{suggestion.message}</p>

        {/* Peak duration suggestion */}
        {hasPeakSuggestion && (
          <div className="adaptive-suggestion-item">
            <RadixTooltip content="This suggestion is based on your historical completion rates and current energy level">
              <span className="adaptive-suggestion-label">
                Suggested peak: <strong>{suggestedPeakMinutes} min</strong>
                {peakDifference !== 0 && (
                  <span className={`adaptive-suggestion-diff ${peakDifference > 0 ? 'positive' : 'negative'}`}>
                    ({peakDifference > 0 ? '+' : ''}{peakDifference})
                  </span>
                )}
              </span>
            </RadixTooltip>
            {onSuggestionApply && (
              <button
                className="adaptive-suggestion-apply"
                onClick={() => onSuggestionApply(suggestedPeakMinutes)}
              >
                Apply
              </button>
            )}
          </div>
        )}

        {/* Suggested task types */}
        {suggestion.suggestedTaskTypes.length > 0 && (
          <div className="adaptive-task-types">
            <span className="adaptive-task-types-label">Good for:</span>
            <div className="adaptive-task-types-list">
              {suggestion.suggestedTaskTypes.map((taskType) => (
                <span key={taskType} className="adaptive-task-type-badge">
                  {TASK_TYPE_LABELS[taskType]}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Pattern-based insights */}
        {insights.length > 0 && patterns && (
          <div className="adaptive-insights">
            <details className="adaptive-insights-details">
              <summary className="adaptive-insights-summary">
                View {insights.length} insight{insights.length !== 1 ? 's' : ''}
              </summary>
              <ul className="adaptive-insights-list">
                {insights.map((insight, index) => (
                  <li key={index} className="adaptive-insight-item">
                    {insight}
                  </li>
                ))}
              </ul>
            </details>
          </div>
        )}
      </div>

      <p className="adaptive-suggestions-disclaimer">
        These are suggestions only. Trust your judgment.
      </p>
    </div>
  );
}

function LightbulbIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 1v1M8 14v1M3.5 8h-1M13.5 8h1M4.75 4.75l-.75-.75M11.25 4.75l.75-.75" strokeLinecap="round" />
      <path d="M6 10.5h4M6.5 12h3" strokeLinecap="round" />
      <path d="M10 7.5a2 2 0 10-4 0c0 1.5 1 2.5 1 3.5h2c0-1 1-2 1-3.5z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 2l8 8M10 2l-8 8" strokeLinecap="round" />
    </svg>
  );
}
