import { useState } from 'react';
import { useRecordsStore } from '../../../stores/recordsStore';
import { Select } from '../../../components/common/Select';
import { Button } from '../../../components/common/Button';
import { TASK_TYPE_LABELS, type TaskType } from '../../../types/record';
import { formatDateISO } from '../../../utils/time';
import { DateRangeChips, type DateRangePreset } from './DateRangeChips';

export function RecordFilters() {
  const filters = useRecordsStore((state) => state.filters);
  const setFilters = useRecordsStore((state) => state.setFilters);
  const clearFilters = useRecordsStore((state) => state.clearFilters);
  const getUniqueTopics = useRecordsStore((state) => state.getUniqueTopics);

  const [activePreset, setActivePreset] = useState<DateRangePreset>('all');

  const topics = getUniqueTopics();

  const taskTypeOptions = [
    { value: '', label: 'All Types' },
    ...Object.entries(TASK_TYPE_LABELS).map(([value, label]) => ({ value, label })),
  ];

  const topicOptions = [
    { value: '', label: 'All Topics' },
    ...topics.map((topic) => ({ value: topic, label: topic })),
  ];

  const handlePresetSelect = (preset: DateRangePreset) => {
    setActivePreset(preset);
    const today = new Date();
    const todayStr = formatDateISO(today);

    let start = '';
    let end = todayStr;

    if (preset === 'today') {
      start = todayStr;
    } else if (preset === 'week') {
      const date = new Date();
      date.setDate(date.getDate() - 7);
      start = formatDateISO(date);
    } else if (preset === 'month') {
      const date = new Date();
      date.setDate(1);
      start = formatDateISO(date);
    } else {
      // All time
      const { dateRange, ...rest } = filters;
      setFilters(rest);
      return;
    }

    setFilters({ ...filters, dateRange: { start, end } });
  };

  const handleTaskTypeChange = (taskType: string) => {
    if (taskType) {
      setFilters({ ...filters, taskTypes: [taskType as TaskType] });
    } else {
      const { taskTypes, ...rest } = filters;
      setFilters(rest);
    }
  };

  const handleTopicChange = (topic: string) => {
    if (topic) {
      setFilters({ ...filters, topics: [topic] });
    } else {
      const { topics, ...rest } = filters;
      setFilters(rest);
    }
  };

  const handleCompletedOnlyChange = (checked: boolean) => {
    if (checked) {
      setFilters({ ...filters, completedOnly: true });
    } else {
      const { completedOnly, ...rest } = filters;
      setFilters(rest);
    }
  };

  const handleClear = () => {
    clearFilters();
    setActivePreset('all');
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="space-y-4">
      {/* Date Chips Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <DateRangeChips activePreset={activePreset} onSelect={handlePresetSelect} />

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleClear} className="text-error hover:bg-error/10">
            Clear filters
          </Button>
        )}
      </div>

      <div className="divider my-0"></div>

      {/* Attributes Row */}
      <div className="flex flex-wrap gap-4 items-end">
        {/* Task type filter */}
        <div className="w-40">
          <Select
            label="Type"
            options={taskTypeOptions}
            value={filters.taskTypes?.[0] || ''}
            onChange={(e) => handleTaskTypeChange(e.target.value)}
          />
        </div>

        {/* Topic filter */}
        {topics.length > 0 && (
          <div className="w-48">
            <Select
              label="Topic"
              options={topicOptions}
              value={filters.topics?.[0] || ''}
              onChange={(e) => handleTopicChange(e.target.value)}
            />
          </div>
        )}

        {/* Completed only checkbox */}
        <div className="form-control">
          <label className="label cursor-pointer gap-3">
            <input
              type="checkbox"
              className="checkbox checkbox-primary checkbox-sm"
              checked={filters.completedOnly || false}
              onChange={(e) => handleCompletedOnlyChange(e.target.checked)}
            />
            <span className="label-text font-medium">Completed Only</span>
          </label>
        </div>
      </div>
    </div>
  );
}
