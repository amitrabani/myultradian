import { useState } from 'react';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { Card } from '../../../components/common/Card';
import { EnergySlider } from '../../../components/common/RadixSlider';
import { DEFAULT_TEMPLATES, type CycleTemplate } from '../../../types/cycle';
import { TASK_TYPE_LABELS, type TaskType, type SessionTags } from '../../../types/record';
import { formatMinutes } from '../../../utils/time';

interface SessionSetupProps {
  onStart: (template: CycleTemplate, tags: SessionTags) => void;
}

export function SessionSetup({ onStart }: SessionSetupProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState(DEFAULT_TEMPLATES[0].id);
  const [topic, setTopic] = useState('');
  const [taskType, setTaskType] = useState<TaskType>('deep-work');
  const [goal, setGoal] = useState('');
  const [intention, setIntention] = useState('');
  const [preSessionEnergy, setPreSessionEnergy] = useState<1 | 2 | 3 | 4 | 5>(3);

  const selectedTemplate = DEFAULT_TEMPLATES.find((t) => t.id === selectedTemplateId)!;

  const totalDuration =
    selectedTemplate.durations['ramp-up'] +
    selectedTemplate.durations['peak'] +
    selectedTemplate.durations['downshift'] +
    selectedTemplate.durations['recovery'];

  const handleStart = () => {
    if (!topic.trim()) {
      return;
    }

    onStart(selectedTemplate, {
      topic: topic.trim(),
      taskType,
      goal: goal.trim() || undefined,
      intention: intention.trim() || undefined,
      preSessionEnergy,
    });
  };

  const templateOptions = DEFAULT_TEMPLATES.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  const taskTypeOptions = Object.entries(TASK_TYPE_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <div className="w-full max-w-lg mx-auto">
      <Card>
        <h2 className="text-2xl font-bold text-base-content mb-6">Start a Focus Session</h2>

        <div className="space-y-4">
          {/* Template selection */}
          <Select
            label="Cycle Template"
            options={templateOptions}
            value={selectedTemplateId}
            onChange={(e) => setSelectedTemplateId(e.target.value)}
          />

          {/* Template info */}
          <div className="bg-base-200 rounded-lg p-4 space-y-3">
            <p className="text-sm text-base-content/70">
              {selectedTemplate.description}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="badge badge-primary badge-lg">
                Ramp-up: {formatMinutes(selectedTemplate.durations['ramp-up'])}
              </span>
              <span className="badge badge-secondary badge-lg">
                Peak: {formatMinutes(selectedTemplate.durations['peak'])}
              </span>
              <span className="badge badge-accent badge-lg">
                Downshift: {formatMinutes(selectedTemplate.durations['downshift'])}
              </span>
              <span className="badge badge-info badge-lg">
                Recovery: {formatMinutes(selectedTemplate.durations['recovery'])}
              </span>
            </div>
            <p className="text-sm font-semibold text-base-content">
              Total: {formatMinutes(totalDuration)}
            </p>
          </div>

          {/* Topic input */}
          <Input
            label="What are you working on?"
            placeholder="e.g., Project report, Code review"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
          />

          {/* Task type selection */}
          <Select
            label="Task Type"
            options={taskTypeOptions}
            value={taskType}
            onChange={(e) => setTaskType(e.target.value as TaskType)}
          />

          {/* Optional goal */}
          <Input
            label="Session Goal (optional)"
            placeholder="e.g., Complete first draft"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />

          {/* Intention */}
          <Input
            label="Session Intention (optional)"
            placeholder="e.g., Stay focused on one task"
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
          />

          {/* Pre-session Energy Level */}
          <EnergySlider
            value={preSessionEnergy}
            onValueChange={setPreSessionEnergy}
            label="Current Energy Level"
          />
        </div>

        <Button
          className="w-full mt-6"
          size="lg"
          onClick={handleStart}
          disabled={!topic.trim()}
        >
          <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }}>
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clipRule="evenodd"
            />
          </svg>
          Start Session
        </Button>
      </Card>
    </div>
  );
}
