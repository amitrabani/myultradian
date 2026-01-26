import { useRecordsStore } from '../../../stores/recordsStore';
import type { FocusRecord, SortField, SessionTags } from '../../../types/record';
import { TASK_TYPE_LABELS } from '../../../types/record';
import { formatDateTimeDisplay, formatMinutes } from '../../../utils/time';
import { calculateRecordDuration } from '../../../utils/statistics';
import { RadixCheckbox } from '../../../components/common/RadixCheckbox';

interface RecordsTableProps {
  onEdit: (record: FocusRecord) => void;
  onDelete: (record: FocusRecord) => void;
  onDuplicate: (tags: SessionTags) => void;
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
}

export function RecordsTable({
  onEdit,
  onDelete,
  onDuplicate,
  selectedIds,
  onSelectionChange,
}: RecordsTableProps) {
  const getFilteredRecords = useRecordsStore((state) => state.getFilteredRecords);
  const duplicateRecord = useRecordsStore((state) => state.duplicateRecord);
  const sort = useRecordsStore((state) => state.sort);
  const setSort = useRecordsStore((state) => state.setSort);

  const records = getFilteredRecords();

  const handleCheckboxChange = (recordId: string, checked: boolean) => {
    const newSelection = new Set(selectedIds);
    if (checked) {
      newSelection.add(recordId);
    } else {
      newSelection.delete(recordId);
    }
    onSelectionChange(newSelection);
  };

  const handleDuplicate = (recordId: string) => {
    const tags = duplicateRecord(recordId);
    if (tags) {
      onDuplicate(tags);
    }
  };

  const handleSort = (field: SortField) => {
    const newDirection = sort.field === field && sort.direction === 'desc' ? 'asc' : 'desc';
    setSort({ field, direction: newDirection });
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sort.field !== field) {
      return (
        <svg className="w-4 h-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sort.direction === 'asc' ? (
      <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <svg className="w-12 h-12 text-base-content/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <p className="text-base-content/50">No records found. Complete a focus session to see it here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th className="w-12">
              {/* Checkbox header handled by BulkActions */}
            </th>
            <th>
              <button className="btn btn-ghost btn-xs gap-1" onClick={() => handleSort('createdAt')}>
                Date
                <span className="w-4 h-4"><SortIcon field="createdAt" /></span>
              </button>
            </th>
            <th>
              <button className="btn btn-ghost btn-xs gap-1" onClick={() => handleSort('topic')}>
                Topic
                <span className="w-4 h-4"><SortIcon field="topic" /></span>
              </button>
            </th>
            <th>
              <button className="btn btn-ghost btn-xs gap-1" onClick={() => handleSort('taskType')}>
                Type
                <span className="w-4 h-4"><SortIcon field="taskType" /></span>
              </button>
            </th>
            <th>
              <button className="btn btn-ghost btn-xs gap-1" onClick={() => handleSort('totalDuration')}>
                Duration
                <span className="w-4 h-4"><SortIcon field="totalDuration" /></span>
              </button>
            </th>
            <th>Status</th>
            <th>
              <button className="btn btn-ghost btn-xs gap-1" onClick={() => handleSort('energyLevel')}>
                Energy
                <span className="w-4 h-4"><SortIcon field="energyLevel" /></span>
              </button>
            </th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id} className={selectedIds.has(record.id) ? 'bg-primary/10' : ''}>
              <td>
                <RadixCheckbox
                  checked={selectedIds.has(record.id)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(record.id, checked === true)
                  }
                  aria-label={`Select record ${record.tags.topic}`}
                />
              </td>
              <td className="text-sm text-base-content/70 whitespace-nowrap">
                {formatDateTimeDisplay(record.createdAt)}
              </td>
              <td>
                <div className="font-medium">{record.tags.topic}</div>
                {record.tags.goal && (
                  <div className="text-xs text-base-content/50 mt-0.5">{record.tags.goal}</div>
                )}
              </td>
              <td>
                <span className="badge badge-ghost badge-sm">
                  {TASK_TYPE_LABELS[record.tags.taskType]}
                </span>
              </td>
              <td className="font-mono text-sm">
                {formatMinutes(calculateRecordDuration(record))}
              </td>
              <td>
                {record.completed ? (
                  <span className="badge badge-success badge-sm gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Complete
                  </span>
                ) : (
                  <span className="badge badge-warning badge-sm">Ended Early</span>
                )}
              </td>
              <td className="text-lg text-center">
                {record.selfReport?.energyLevel ? (
                  <>
                    {record.selfReport.energyLevel === 1 && '😩'}
                    {record.selfReport.energyLevel === 2 && '😔'}
                    {record.selfReport.energyLevel === 3 && '😐'}
                    {record.selfReport.energyLevel === 4 && '🙂'}
                    {record.selfReport.energyLevel === 5 && '😊'}
                  </>
                ) : (
                  <span className="text-base-content/30">-</span>
                )}
              </td>
              <td>
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => handleDuplicate(record.id)}
                    className="btn btn-ghost btn-xs btn-square"
                    aria-label="Duplicate as new session"
                    title="Start new session with these tags"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onEdit(record)}
                    className="btn btn-ghost btn-xs btn-square"
                    aria-label="Edit record"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(record)}
                    className="btn btn-ghost btn-xs btn-square text-error hover:bg-error/10"
                    aria-label="Delete record"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
