import { useState } from 'react';
import { RadixDialog } from '../../../components/common/RadixDialog';
import { Button } from '../../../components/common/Button';
import { useReflectionStore } from '../../../stores/reflectionStore';

interface WeeklyReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WeeklyReflectionModal({ isOpen, onClose }: WeeklyReflectionModalProps) {
  const [whatHelped, setWhatHelped] = useState('');
  const [whatHurt, setWhatHurt] = useState('');

  const addReflection = useReflectionStore((state) => state.addReflection);
  const setLastPromptDate = useReflectionStore((state) => state.setLastPromptDate);

  const handleSubmit = () => {
    if (whatHelped.trim() || whatHurt.trim()) {
      addReflection(whatHelped.trim(), whatHurt.trim());
      setWhatHelped('');
      setWhatHurt('');
      onClose();
    }
  };

  const handleSkip = () => {
    // Mark as prompted today so we don't show again
    setLastPromptDate(new Date().toISOString().split('T')[0]);
    onClose();
  };

  return (
    <RadixDialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title="Weekly Reflection"
    >
      <div className="weekly-reflection-modal">
        <p className="weekly-reflection-intro">
          Take a moment to reflect on your focus sessions this week. This helps identify patterns and improve your practice.
        </p>

        <div className="weekly-reflection-field">
          <label htmlFor="whatHelped">
            <span className="weekly-reflection-icon positive">+</span>
            What helped your focus this week?
          </label>
          <textarea
            id="whatHelped"
            value={whatHelped}
            onChange={(e) => setWhatHelped(e.target.value)}
            placeholder="Environment, timing, techniques, mindset..."
            rows={3}
          />
        </div>

        <div className="weekly-reflection-field">
          <label htmlFor="whatHurt">
            <span className="weekly-reflection-icon negative">-</span>
            What hurt your focus this week?
          </label>
          <textarea
            id="whatHurt"
            value={whatHurt}
            onChange={(e) => setWhatHurt(e.target.value)}
            placeholder="Distractions, fatigue, unclear goals..."
            rows={3}
          />
        </div>

        <div className="weekly-reflection-actions">
          <Button variant="ghost" onClick={handleSkip}>
            Skip for now
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!whatHelped.trim() && !whatHurt.trim()}
          >
            Save Reflection
          </Button>
        </div>
      </div>
    </RadixDialog>
  );
}
