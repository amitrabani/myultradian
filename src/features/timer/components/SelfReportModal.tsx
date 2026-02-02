import { useState } from 'react';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { Input, Textarea } from '../../../components/common/Input';
import { FrictionMeter } from './FrictionMeter';
import { RadixSlider } from '../../../components/common/RadixSlider';
import type { SelfReport, FrictionLevel } from '../../../types/record';

interface FrictionData {
  level: FrictionLevel;
  pauseCount: number;
  distractionCount: number;
  skippedStages: number;
  endedEarly: boolean;
}

interface SelfReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (report: SelfReport) => void;
  completed: boolean;
  frictionData?: FrictionData;
}

export function SelfReportModal({ isOpen, onClose, onSubmit, completed, frictionData }: SelfReportModalProps) {
  const [energyLevel, setEnergyLevel] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [effort, setEffort] = useState(5);
  const [distractionCount, setDistractionCount] = useState(0);
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    onSubmit({
      energyLevel,
      effort,
      distractionCount,
      notes: notes.trim() || undefined,
    });
  };

  const handleSkip = () => {
    onClose();
  };

  const energyLabels = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];
  const energyEmojis = ['😩', '😔', '😐', '🙂', '😊'];

  const effortValueFormatter = (val: number) => {
    if (val <= 2) return `${val} (Light)`;
    if (val <= 4) return `${val} (Moderate)`;
    if (val <= 7) return `${val} (Substantial)`;
    if (val <= 9) return `${val} (Deep Focus)`;
    return `${val} (Peak Effort)`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={completed ? 'Session Complete!' : 'Session Ended'}
      size="md"
    >
      <div className="space-y-6">
        {completed && (
          <div className="text-center">
            <div className="completion-icon">
              <svg
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p style={{ color: 'var(--color-slate-600)' }}>
              Great job completing your focus cycle!
            </p>
          </div>
        )}

        {/* Friction Meter */}
        {frictionData && (
          <FrictionMeter
            level={frictionData.level}
            pauseCount={frictionData.pauseCount}
            distractionCount={frictionData.distractionCount}
            skippedStages={frictionData.skippedStages}
            endedEarly={frictionData.endedEarly}
          />
        )}

        <div>
          <label className="input-label" style={{ marginBottom: '0.75rem' }}>
            How was your energy level during this session?
          </label>
          <div className="energy-selector">
            {([1, 2, 3, 4, 5] as const).map((level) => (
              <button
                key={level}
                onClick={() => setEnergyLevel(level)}
                className={`energy-btn ${energyLevel === level ? 'selected' : ''}`}
              >
                <span className="energy-btn-emoji">
                  {energyEmojis[level - 1]}
                </span>
                <span className="energy-btn-label">
                  {energyLabels[level - 1]}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <RadixSlider
            label="How much effort did you put into this session?"
            value={[effort]}
            onValueChange={(v) => setEffort(v[0])}
            min={1}
            max={10}
            step={1}
            valueFormatter={effortValueFormatter}
          />
          <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--color-slate-500)' }}>
            1 = Very light, 10 = Maximum intensity
          </p>
        </div>

        <div>
          <Input
            label="Number of distractions"
            type="number"
            min={0}
            max={99}
            value={distractionCount}
            onChange={(e) => setDistractionCount(Math.max(0, parseInt(e.target.value) || 0))}
          />
          <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--color-slate-500)' }}>
            How many times were you interrupted or distracted?
          </p>
        </div>

        <Textarea
          label="Notes (optional)"
          placeholder="Any thoughts about this session..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />

        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={handleSkip}>
            Skip
          </Button>
          <Button className="flex-1" onClick={handleSubmit}>
            Save Report
          </Button>
        </div>
      </div>
    </Modal>
  );
}
