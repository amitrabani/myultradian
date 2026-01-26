import { useState, useEffect } from 'react';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { EnergySlider } from '../../../components/common/RadixSlider';
import { DEFAULT_TEMPLATES, type CycleTemplate } from '../../../types/cycle';
import { TASK_TYPE_LABELS, type TaskType, type SessionTags } from '../../../types/record';
import { formatMinutes } from '../../../utils/time';
import { useSessionSetupStore } from '../../../stores/sessionSetupStore';
import { useEnergySuggestion } from '../../../hooks/useCycleIntelligence';

interface SessionSetupProps {
  onStart: (template: CycleTemplate, tags: SessionTags) => void;
}

export function SessionSetup({ onStart }: SessionSetupProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState(DEFAULT_TEMPLATES[0].id);
  const [topic, setTopic] = useState('');
  const [taskType, setTaskType] = useState<TaskType>('deep-work');
  const [goal, setGoal] = useState('');
  const [preSessionEnergy, setPreSessionEnergy] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const prefillTags = useSessionSetupStore((state) => state.prefillTags);
  const clearPrefillTags = useSessionSetupStore((state) => state.clearPrefillTags);

  // Pre-fill form from duplicated record
  useEffect(() => {
    if (prefillTags) {
      setTopic(prefillTags.topic);
      setTaskType(prefillTags.taskType);
      if (prefillTags.goal) setGoal(prefillTags.goal);
      if (prefillTags.preSessionEnergy) setPreSessionEnergy(prefillTags.preSessionEnergy);
      // Show advanced options if there's extra data to show
      if (prefillTags.goal || prefillTags.preSessionEnergy) {
        setShowAdvanced(true);
      }
      // Clear after applying so it doesn't persist
      clearPrefillTags();
    }
  }, [prefillTags, clearPrefillTags]);

  const selectedTemplate = DEFAULT_TEMPLATES.find((t) => t.id === selectedTemplateId)!;

  // Get energy-based suggestion for peak duration
  const { suggestion, suggestedPeakMinutes } = useEnergySuggestion(
    preSessionEnergy,
    selectedTemplate.durations['peak']
  );

  // Find the best matching template for the suggested peak duration
  const suggestedTemplate = DEFAULT_TEMPLATES.reduce((best, template) => {
    const bestDiff = Math.abs(best.durations['peak'] - suggestedPeakMinutes);
    const currentDiff = Math.abs(template.durations['peak'] - suggestedPeakMinutes);
    return currentDiff < bestDiff ? template : best;
  }, DEFAULT_TEMPLATES[0]);

  // Show suggestion if the suggested template is different from selected
  const showSuggestion = suggestedTemplate.id !== selectedTemplateId &&
    Math.abs(suggestedTemplate.durations['peak'] - selectedTemplate.durations['peak']) >= 10;

  const totalDuration =
    selectedTemplate.durations['ramp-up'] +
    selectedTemplate.durations['peak'] +
    selectedTemplate.durations['downshift'] +
    selectedTemplate.durations['recovery'];

  const handleStart = () => {
    if (!topic.trim()) return;

    onStart(selectedTemplate, {
      topic: topic.trim(),
      taskType,
      goal: goal.trim() || undefined,
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
    <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-base-content mb-2">
          Start a Focus Session
        </h1>
        <p className="text-base-content/60">
          Work in sync with your natural 90-minute rhythm
        </p>
      </div>

      {/* Main Card */}
      <div className="card bg-base-100 border border-base-300 shadow-sm p-6 w-full">
        <div className="flex flex-col gap-5">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">What will you work on?</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Q3 Report, Refactoring API..."
              className="input input-bordered input-lg w-full"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            />
          </div>

          <button
            className="btn btn-primary btn-lg w-full"
            onClick={handleStart}
            disabled={!topic.trim()}
          >
            Start Session
          </button>
        </div>
      </div>

      {/* Advanced Settings Toggle */}
      <div className="mt-6 w-full">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="btn btn-ghost btn-sm gap-2 mx-auto flex text-base-content/60"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          {showAdvanced ? 'Hide Options' : 'More Options'}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {/* Advanced Settings Panel */}
        {showAdvanced && (
          <div className="mt-4 card bg-base-100 border border-base-300 p-5">
            <div className="space-y-5">
              <Select
                label="Cycle Template"
                options={templateOptions}
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Task Type"
                  options={taskTypeOptions}
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value as TaskType)}
                />

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Duration</span>
                  </label>
                  <div className="px-1 py-2 text-base-content/70 text-sm">
                    {formatMinutes(totalDuration)} ({formatMinutes(selectedTemplate.durations['peak'])} focus)
                  </div>
                </div>
              </div>

              <div className="divider my-0"></div>

              <Input
                label="Session Goal (optional)"
                placeholder="Specific outcome to achieve"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
              <EnergySlider
                value={preSessionEnergy}
                onValueChange={setPreSessionEnergy}
                label="Current Energy Level"
              />

              {/* Energy-based suggestion */}
              {showSuggestion && suggestion && (
                <div className="alert alert-info">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm">{suggestion.message}</p>
                    <p className="text-xs mt-1 opacity-80">
                      Suggested: <strong>{suggestedTemplate.name}</strong> ({formatMinutes(suggestedTemplate.durations['peak'])} focus)
                    </p>
                  </div>
                  <button
                    className="btn btn-sm btn-ghost"
                    onClick={() => setSelectedTemplateId(suggestedTemplate.id)}
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="mt-8 w-full space-y-3 text-sm text-base-content/50">
        <div className="flex gap-2">
          <span className="shrink-0">•</span>
          <p><span className="font-medium text-base-content/70">Maximum 3 cycles:</span> For optimal deep learning, aim for 1–3 sessions of 90 minutes per day.</p>
        </div>
        <div className="flex gap-2">
          <span className="shrink-0">•</span>
          <p><span className="font-medium text-base-content/70">Respect the trough:</span> When concentration fails (fidgetiness, drowsiness), stop immediately to allow your brain to process information.</p>
        </div>
      </div>
    </div>
  );
}
