import { useState, useEffect, useCallback } from 'react';
import { STAGE_CONTENT } from '../../../types/cycle';
import type { RecoveryOutcome } from '../../../types/record';
import { Button } from '../../../components/common/Button';

interface RecoveryViewProps {
  onRecoveryOutcome: (outcome: RecoveryOutcome) => void;
  isFullScreen?: boolean;
}

export function RecoveryView({ onRecoveryOutcome, isFullScreen = false }: RecoveryViewProps) {
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
  const stageContent = STAGE_CONTENT['recovery'];
  const suggestions = stageContent.suggestedActions;

  // Rotate through suggestions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSuggestionIndex((prev) => (prev + 1) % suggestions.length);
    }, 8000); // Change every 8 seconds

    return () => clearInterval(interval);
  }, [suggestions.length]);

  const handleOutcome = useCallback((outcome: RecoveryOutcome) => {
    onRecoveryOutcome(outcome);
  }, [onRecoveryOutcome]);

  const containerClass = isFullScreen
    ? 'recovery-view recovery-view-fullscreen'
    : 'recovery-view';

  return (
    <div className={containerClass}>
      {/* Recovery mode indicator */}
      <div className="recovery-header">
        <RecoveryIcon />
        <h3 className="recovery-title">Recovery Time</h3>
      </div>

      {/* Rotating micro-suggestions */}
      <div className="recovery-suggestion">
        <div className="recovery-suggestion-content">
          <span className="recovery-suggestion-emoji">{getSuggestionEmoji(currentSuggestionIndex)}</span>
          <p className="recovery-suggestion-text">{suggestions[currentSuggestionIndex]}</p>
        </div>
        <div className="recovery-suggestion-dots">
          {suggestions.map((_, index) => (
            <span
              key={index}
              className={`recovery-dot ${index === currentSuggestionIndex ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>

      {/* All suggestions list (collapsed by default in fullscreen) */}
      {!isFullScreen && (
        <ul className="recovery-suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="recovery-suggestion-item">
              <span className="recovery-suggestion-bullet">{getSuggestionEmoji(index)}</span>
              <span>{suggestion}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Outcome buttons */}
      <div className="recovery-outcome-buttons">
        <Button
          variant="primary"
          size="md"
          onClick={() => handleOutcome('full')}
          className="recovery-btn-full"
        >
          <FullRecoveryIcon />
          Full Recovery
        </Button>
        <Button
          variant="secondary"
          size="md"
          onClick={() => handleOutcome('shortened')}
          className="recovery-btn-shortened"
        >
          <ShortenedIcon />
          Shortened
        </Button>
        <Button
          variant="ghost"
          size="md"
          onClick={() => handleOutcome('skipped')}
          className="recovery-btn-skip"
        >
          <SkipIcon />
          Skip
        </Button>
      </div>

      {/* Gentle reminder */}
      <p className="recovery-reminder">
        Taking breaks improves long-term productivity
      </p>
    </div>
  );
}

// Full-screen recovery overlay component
export function RecoveryOverlay({ onRecoveryOutcome }: { onRecoveryOutcome: (outcome: RecoveryOutcome) => void }) {
  return (
    <div className="recovery-overlay">
      <div className="recovery-overlay-content">
        <RecoveryView onRecoveryOutcome={onRecoveryOutcome} isFullScreen />
      </div>
    </div>
  );
}

function getSuggestionEmoji(index: number): string {
  const emojis = ['🚶', '💧', '👀', '🧘'];
  return emojis[index % emojis.length];
}

function RecoveryIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3a9 9 0 11-9 9" strokeLinecap="round" />
      <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FullRecoveryIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginRight: '0.5rem' }}>
      <circle cx="8" cy="8" r="6" />
      <path d="M5 8l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShortenedIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginRight: '0.5rem' }}>
      <circle cx="8" cy="8" r="6" />
      <path d="M6 8h4" strokeLinecap="round" />
    </svg>
  );
}

function SkipIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginRight: '0.5rem' }}>
      <path d="M5 4l6 4-6 4V4zM11 4v8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
