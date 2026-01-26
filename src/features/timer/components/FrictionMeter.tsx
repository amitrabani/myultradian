import type { FrictionLevel } from '../../../types/record';
import { FRICTION_LEVEL_LABELS } from '../../../types/record';

interface FrictionMeterProps {
  level: FrictionLevel;
  pauseCount: number;
  distractionCount: number;
  skippedStages: number;
  endedEarly: boolean;
  showDetails?: boolean;
}

export function FrictionMeter({
  level,
  pauseCount,
  distractionCount,
  skippedStages,
  endedEarly,
  showDetails = true,
}: FrictionMeterProps) {
  const { label, color, description } = FRICTION_LEVEL_LABELS[level];

  const getColorClass = () => {
    switch (color) {
      case 'emerald': return 'friction-emerald';
      case 'amber': return 'friction-amber';
      case 'red': return 'friction-red';
      default: return 'friction-emerald';
    }
  };

  const getIcon = () => {
    switch (level) {
      case 'low':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'medium':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'high':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="12" y1="9" x2="12" y2="13" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
    }
  };

  return (
    <div className={`friction-meter ${getColorClass()}`}>
      <div className="friction-header">
        <div className="friction-icon">{getIcon()}</div>
        <div className="friction-info">
          <span className="friction-label">{label} Friction</span>
          <span className="friction-description">{description}</span>
        </div>
      </div>

      {showDetails && (
        <div className="friction-details">
          <FrictionDetail
            icon="pause"
            label="Pauses"
            value={pauseCount}
            threshold={1}
          />
          <FrictionDetail
            icon="distraction"
            label="Distractions"
            value={distractionCount}
            threshold={2}
          />
          <FrictionDetail
            icon="skip"
            label="Skips"
            value={skippedStages}
            threshold={1}
          />
          {endedEarly && (
            <div className="friction-detail friction-negative">
              <span className="friction-detail-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="friction-detail-label">Ended early</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FrictionDetail({
  icon,
  label,
  value,
  threshold,
}: {
  icon: string;
  label: string;
  value: number;
  threshold: number;
}) {
  const isOverThreshold = value >= threshold;

  const getIcon = () => {
    switch (icon) {
      case 'pause':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="6" y="4" width="4" height="16" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="14" y="4" width="4" height="16" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'distraction':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'skip':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5 4 15 12 5 20 5 4" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="19" y1="5" x2="19" y2="19" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`friction-detail ${isOverThreshold ? 'friction-warning' : ''}`}>
      <span className="friction-detail-icon">{getIcon()}</span>
      <span className="friction-detail-label">{label}</span>
      <span className="friction-detail-value">{value}</span>
    </div>
  );
}

// Compact version for showing in records or dashboard
export function FrictionBadge({ level }: { level: FrictionLevel }) {
  const { label, color } = FRICTION_LEVEL_LABELS[level];

  return (
    <span className={`friction-badge friction-badge-${color}`}>
      {level === 'low' && ''}
      {level === 'medium' && ''}
      {level === 'high' && ''}
      {label}
    </span>
  );
}
