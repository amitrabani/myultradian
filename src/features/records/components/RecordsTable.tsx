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
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sort.direction === 'asc' ? (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--color-emerald-600)' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--color-emerald-600)' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  if (records.length === 0) {
    return (
      <div className="empty-state">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <p>No records found. Complete a focus session to see it here.</p>
      </div>
    );
  }

  return (
    <div className="records-table">
      <table>
        <thead>
          <tr>
            <th className="checkbox-column">
              {/* Checkbox header handled by BulkActions */}
            </th>
            <th>
              <button onClick={() => handleSort('createdAt')}>
                Date
                <SortIcon field="createdAt" />
              </button>
            </th>
            <th>
              <button onClick={() => handleSort('topic')}>
                Topic
                <SortIcon field="topic" />
              </button>
            </th>
            <th>
              <button onClick={() => handleSort('taskType')}>
                Type
                <SortIcon field="taskType" />
              </button>
            </th>
            <th>
              <button onClick={() => handleSort('totalDuration')}>
                Duration
                <SortIcon field="totalDuration" />
              </button>
            </th>
            <th>Status</th>
            <th>
              <button onClick={() => handleSort('energyLevel')}>
                Energy
                <SortIcon field="energyLevel" />
              </button>
            </th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id} className={selectedIds.has(record.id) ? 'selected' : ''}>
              <td className="checkbox-column">
                <RadixCheckbox
                  checked={selectedIds.has(record.id)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(record.id, checked === true)
                  }
                  aria-label={`Select record ${record.tags.topic}`}
                />
              </td>
              <td className="record-date">
                {formatDateTimeDisplay(record.createdAt)}
              </td>
              <td>
                <div className="record-topic">{record.tags.topic}</div>
                {record.tags.goal && (
                  <div className="record-goal">{record.tags.goal}</div>
                )}
              </td>
              <td>
                <span className="badge badge-slate">
                  {TASK_TYPE_LABELS[record.tags.taskType]}
                </span>
              </td>
              <td className="record-duration">
                {formatMinutes(calculateRecordDuration(record))}
              </td>
              <td>
                {record.completed ? (
                  <span className="badge badge-emerald">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Complete
                  </span>
                ) : (
                  <span className="badge badge-amber">Ended Early</span>
                )}
              </td>
              <td style={{ fontSize: '1.125rem' }}>
                {record.selfReport?.energyLevel ? (
                  <>
                    {record.selfReport.energyLevel === 1 && '😩'}
                    {record.selfReport.energyLevel === 2 && '😔'}
                    {record.selfReport.energyLevel === 3 && '😐'}
                    {record.selfReport.energyLevel === 4 && '🙂'}
                    {record.selfReport.energyLevel === 5 && '😊'}
                  </>
                ) : (
                  <span style={{ color: 'var(--color-slate-400)' }}>-</span>
                )}
              </td>
              <td>
                <div className="record-actions">
                  <button
                    onClick={() => handleDuplicate(record.id)}
                    className="record-action-btn"
                    aria-label="Duplicate as new session"
                    title="Start new session with these tags"
                  >
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    className="record-action-btn"
                    aria-label="Edit record"
                  >
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    className="record-action-btn delete"
                    aria-label="Delete record"
                  >
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
