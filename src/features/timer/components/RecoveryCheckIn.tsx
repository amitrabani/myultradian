import { useState } from 'react';
import { Button } from '../../../components/common/Button';
import { useTimerStore } from '../../../stores/timerStore';
import type { RecoveryActivity } from '../../../types/record';
import { RECOVERY_ACTIVITY_LABELS } from '../../../types/record';

interface RecoveryCheckInProps {
  onComplete: () => void;
  showSkip?: boolean;
}

const ACTIVITIES: RecoveryActivity[] = [
  'walked',
  'drank-water',
  'eyes-off-screen',
  'lay-down',
  'stayed-on-screen',
];

export function RecoveryCheckIn({ onComplete, showSkip = true }: RecoveryCheckInProps) {
  const [selectedActivities, setSelectedActivities] = useState<Set<RecoveryActivity>>(new Set());
  const setRecoveryActivities = useTimerStore((state) => state.setRecoveryActivities);

  const toggleActivity = (activity: RecoveryActivity) => {
    const newSet = new Set(selectedActivities);
    if (newSet.has(activity)) {
      newSet.delete(activity);
    } else {
      // If selecting "stayed-on-screen", clear positive activities
      if (activity === 'stayed-on-screen') {
        newSet.clear();
        newSet.add(activity);
      } else {
        // If selecting a positive activity, remove "stayed-on-screen"
        newSet.delete('stayed-on-screen');
        newSet.add(activity);
      }
    }
    setSelectedActivities(newSet);
  };

  const handleSave = () => {
    setRecoveryActivities(Array.from(selectedActivities));
    onComplete();
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="recovery-checkin">
      <div className="recovery-checkin-header">
        <h3 className="recovery-checkin-title">How did you recover?</h3>
        <p className="recovery-checkin-subtitle">
          Quick tap to track your break activities
        </p>
      </div>

      <div className="recovery-activities-grid">
        {ACTIVITIES.map((activity) => {
          const { label, emoji } = RECOVERY_ACTIVITY_LABELS[activity];
          const isSelected = selectedActivities.has(activity);
          const isNegative = activity === 'stayed-on-screen';

          return (
            <button
              key={activity}
              onClick={() => toggleActivity(activity)}
              className={`recovery-activity-btn ${isSelected ? 'selected' : ''} ${isNegative ? 'negative' : ''}`}
            >
              <span className="recovery-activity-emoji">{emoji}</span>
              <span className="recovery-activity-label">{label}</span>
            </button>
          );
        })}
      </div>

      <div className="recovery-checkin-actions">
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={selectedActivities.size === 0}
        >
          Save
        </Button>
        {showSkip && (
          <Button variant="ghost" onClick={handleSkip}>
            Skip
          </Button>
        )}
      </div>
    </div>
  );
}
