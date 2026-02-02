import { useState, useEffect } from 'react';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { Input, Textarea } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { useRecordsStore } from '../../../stores/recordsStore';
import { TASK_TYPE_LABELS, type TaskType, type FocusRecord } from '../../../types/record';
import { DEFAULT_TEMPLATES } from '../../../types/cycle';

interface RecordFormProps {
  isOpen: boolean;
  onClose: () => void;
  record?: FocusRecord | null;
}

export function RecordForm({ isOpen, onClose, record }: RecordFormProps) {
  const addRecord = useRecordsStore((state) => state.addRecord);
  const updateRecord = useRecordsStore((state) => state.updateRecord);

  const [topic, setTopic] = useState('');
  const [taskType, setTaskType] = useState<TaskType>('deep-work');
  const [goal, setGoal] = useState('');
  const [templateId, setTemplateId] = useState(DEFAULT_TEMPLATES[0].id);
  const [energyLevel, setEnergyLevel] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [distractionCount, setDistractionCount] = useState(0);
  const [notes, setNotes] = useState('');
  const [completed, setCompleted] = useState(true);
  const [durationRampUp, setDurationRampUp] = useState(0);
  const [durationPeak, setDurationPeak] = useState(0);
  const [durationDownshift, setDurationDownshift] = useState(0);
  const [durationRecovery, setDurationRecovery] = useState(0);

  // Reset form when record changes
  useEffect(() => {
    if (record) {
      setTopic(record.tags.topic);
      setTaskType(record.tags.taskType);
      setGoal(record.tags.goal || '');
      setTemplateId(record.templateId);
      setEnergyLevel(record.selfReport?.energyLevel ?? null);
      setDistractionCount(record.selfReport?.distractionCount ?? 0);
      setNotes(record.selfReport?.notes || '');
      setCompleted(record.completed);
      setDurationRampUp(record.actualDurations['ramp-up'] ?? 0);
      setDurationPeak(record.actualDurations['peak'] ?? 0);
      setDurationDownshift(record.actualDurations['downshift'] ?? 0);
      setDurationRecovery(record.actualDurations['recovery'] ?? 0);
    } else {
      const defaultTemplate = DEFAULT_TEMPLATES[0];
      setTopic('');
      setTaskType('deep-work');
      setGoal('');
      setTemplateId(defaultTemplate.id);
      setEnergyLevel(null);
      setDistractionCount(0);
      setNotes('');
      setCompleted(true);
      setDurationRampUp(defaultTemplate.durations['ramp-up']);
      setDurationPeak(defaultTemplate.durations['peak']);
      setDurationDownshift(defaultTemplate.durations['downshift']);
      setDurationRecovery(defaultTemplate.durations['recovery']);
    }
  }, [record]);

  const handleSubmit = () => {
    if (!topic.trim()) return;

    const template = DEFAULT_TEMPLATES.find((t) => t.id === templateId)!;

    const actualDurations = {
      'ramp-up': durationRampUp,
      'peak': durationPeak,
      'downshift': durationDownshift,
      'recovery': durationRecovery,
    };

    if (record) {
      updateRecord(record.id, {
        tags: {
          topic: topic.trim(),
          taskType,
          goal: goal.trim() || undefined,
          // Preserve existing intention and preSessionEnergy
          intention: record.tags.intention,
          preSessionEnergy: record.tags.preSessionEnergy,
        },
        templateId,
        templateName: template.name,
        completed,
        actualDurations,
        selfReport: energyLevel
          ? {
              energyLevel,
              distractionCount,
              notes: notes.trim() || undefined,
            }
          : undefined,
      });
    } else {
      const now = new Date().toISOString();
      addRecord({
        createdAt: now,
        completedAt: completed ? now : undefined,
        templateId,
        templateName: template.name,
        plannedDurations: template.durations,
        actualDurations,
        completed,
        endedEarly: !completed,
        tags: {
          topic: topic.trim(),
          taskType,
          goal: goal.trim() || undefined,
        },
        selfReport: energyLevel
          ? {
              energyLevel,
              distractionCount,
              notes: notes.trim() || undefined,
            }
          : undefined,
      });
    }

    onClose();
  };

  const taskTypeOptions = Object.entries(TASK_TYPE_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  const templateOptions = DEFAULT_TEMPLATES.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  const isEditing = !!record;
  const energyEmojis = ['😩', '😔', '😐', '🙂', '😊'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Record' : 'Add Manual Record'}
      size="md"
    >
      <div className="space-y-4">
        <Input
          label="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="What did you work on?"
          required
        />

        <Select
          label="Task Type"
          options={taskTypeOptions}
          value={taskType}
          onChange={(e) => setTaskType(e.target.value as TaskType)}
        />

        <Input
          label="Goal (optional)"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="What was your goal?"
        />

        <Select
          label="Template"
          options={templateOptions}
          value={templateId}
          onChange={(e) => setTemplateId(e.target.value)}
        />

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Stage Durations (minutes)</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Ramp-up"
              type="number"
              min={0}
              value={durationRampUp}
              onChange={(e) => setDurationRampUp(Math.max(0, parseInt(e.target.value) || 0))}
            />
            <Input
              label="Peak Focus"
              type="number"
              min={0}
              value={durationPeak}
              onChange={(e) => setDurationPeak(Math.max(0, parseInt(e.target.value) || 0))}
            />
            <Input
              label="Downshift"
              type="number"
              min={0}
              value={durationDownshift}
              onChange={(e) => setDurationDownshift(Math.max(0, parseInt(e.target.value) || 0))}
            />
            <Input
              label="Recovery"
              type="number"
              min={0}
              value={durationRecovery}
              onChange={(e) => setDurationRecovery(Math.max(0, parseInt(e.target.value) || 0))}
            />
          </div>
          <label className="label">
            <span className="label-text-alt text-base-content/50">
              Total: {durationRampUp + durationPeak + durationDownshift + durationRecovery} min
            </span>
          </label>
        </div>

        <label className="label cursor-pointer justify-start gap-3">
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
          />
          <span className="label-text">Completed full cycle</span>
        </label>

        <div className="divider my-2"></div>

        <p className="text-sm text-base-content/60">
          Self-report (optional)
        </p>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Energy Level</span>
          </label>
          <div className="flex gap-2">
            {([1, 2, 3, 4, 5] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setEnergyLevel(energyLevel === level ? null : level)}
                className={`btn btn-sm flex-1 ${energyLevel === level ? 'btn-primary' : 'btn-ghost'}`}
              >
                <span className="text-lg">{energyEmojis[level - 1]}</span>
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Distraction Count"
          type="number"
          min={0}
          max={99}
          value={distractionCount}
          onChange={(e) => setDistractionCount(Math.max(0, parseInt(e.target.value) || 0))}
        />

        <Textarea
          label="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any notes about this session..."
          rows={2}
        />

        <div className="flex gap-3 pt-4">
          <Button variant="ghost" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleSubmit} disabled={!topic.trim()}>
            {isEditing ? 'Save Changes' : 'Add Record'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
