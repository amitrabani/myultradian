import { useRecordsStore } from '../../../stores/recordsStore';
import { Select } from '../../../components/common/Select';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { TASK_TYPE_LABELS, type TaskType } from '../../../types/record';
import { formatDateISO } from '../../../utils/time';

export function RecordFilters() {
  const filters = useRecordsStore((state) => state.filters);
  const setFilters = useRecordsStore((state) => state.setFilters);
  const clearFilters = useRecordsStore((state) => state.clearFilters);
  const getUniqueTopics = useRecordsStore((state) => state.getUniqueTopics);

  const topics = getUniqueTopics();

  const taskTypeOptions = [
    { value: '', label: 'All Types' },
    ...Object.entries(TASK_TYPE_LABELS).map(([value, label]) => ({ value, label })),
  ];

  const topicOptions = [
    { value: '', label: 'All Topics' },
    ...topics.map((topic) => ({ value: topic, label: topic })),
  ];

  const today = formatDateISO(new Date());
  const weekAgo = formatDateISO(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

  const handleDateRangeChange = (start: string, end: string) => {
    if (start && end) {
      setFilters({ ...filters, dateRange: { start, end } });
    } else {
      const { dateRange, ...rest } = filters;
      setFilters(rest);
    }
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

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="filters">
      <div className="filter-row">
        {/* Date range */}
        <div className="filter-date-range">
          <Input
            type="date"
            value={filters.dateRange?.start || ''}
            onChange={(e) =>
              handleDateRangeChange(e.target.value, filters.dateRange?.end || today)
            }
            className="w-40"
          />
          <span>to</span>
          <Input
            type="date"
            value={filters.dateRange?.end || ''}
            onChange={(e) =>
              handleDateRangeChange(filters.dateRange?.start || weekAgo, e.target.value)
            }
            className="w-40"
          />
        </div>

        {/* Task type filter */}
        <Select
          options={taskTypeOptions}
          value={filters.taskTypes?.[0] || ''}
          onChange={(e) => handleTaskTypeChange(e.target.value)}
          className="w-40"
        />

        {/* Topic filter */}
        {topics.length > 0 && (
          <Select
            options={topicOptions}
            value={filters.topics?.[0] || ''}
            onChange={(e) => handleTopicChange(e.target.value)}
            className="w-40"
          />
        )}

        {/* Completed only checkbox */}
        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={filters.completedOnly || false}
            onChange={(e) => handleCompletedOnlyChange(e.target.checked)}
          />
          <span>Completed only</span>
        </label>
      </div>

      {/* Clear filters */}
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear filters
        </Button>
      )}
    </div>
  );
}
