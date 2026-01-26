import { useState } from 'react';
import { Button } from '../../../components/common/Button';
import { RadixAlertDialog } from '../../../components/common/RadixAlertDialog';
import { BulkCheckbox } from '../../../components/common/RadixCheckbox';
import { useRecordsStore } from '../../../stores/recordsStore';
import { exportRecordsToCSV, exportRecordsToJSON } from '../../../utils/export';
import type { FocusRecord } from '../../../types/record';

interface BulkActionsProps {
  selectedIds: Set<string>;
  filteredRecords: FocusRecord[];
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onSelectionChange: (ids: Set<string>) => void;
}

export function BulkActions({
  selectedIds,
  filteredRecords,
  onSelectAll,
  onDeselectAll,
  onSelectionChange,
}: BulkActionsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteRecords = useRecordsStore((state) => state.deleteRecords);

  const handleBulkDelete = () => {
    deleteRecords(Array.from(selectedIds));
    onSelectionChange(new Set());
    setShowDeleteConfirm(false);
  };

  const handleExportCSV = () => {
    const recordsToExport = selectedIds.size > 0
      ? filteredRecords.filter((r) => selectedIds.has(r.id))
      : filteredRecords;
    exportRecordsToCSV(recordsToExport);
  };

  const handleExportJSON = () => {
    const recordsToExport = selectedIds.size > 0
      ? filteredRecords.filter((r) => selectedIds.has(r.id))
      : filteredRecords;
    exportRecordsToJSON(recordsToExport);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 py-2">
      <div className="flex items-center gap-3">
        <BulkCheckbox
          selectedCount={selectedIds.size}
          totalCount={filteredRecords.length}
          onSelectAll={onSelectAll}
          onDeselectAll={onDeselectAll}
        />
        {selectedIds.size > 0 && (
          <span className="text-sm font-medium text-base-content/70">
            {selectedIds.size} selected
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {selectedIds.size > 0 && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <TrashIcon />
            Delete ({selectedIds.size})
          </Button>
        )}
        <Button
          variant="secondary"
          size="sm"
          onClick={handleExportCSV}
        >
          <DownloadIcon />
          Export CSV
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleExportJSON}
        >
          <DownloadIcon />
          JSON
        </Button>
      </div>

      {/* Bulk Delete Confirmation */}
      <RadixAlertDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Selected Records?"
        description={`Are you sure you want to delete ${selectedIds.size} record${selectedIds.size !== 1 ? 's' : ''}? This action cannot be undone.`}
        cancelLabel="Cancel"
        actionLabel={`Delete ${selectedIds.size} Record${selectedIds.size !== 1 ? 's' : ''}`}
        onAction={handleBulkDelete}
        actionVariant="danger"
      />
    </div>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginRight: '0.25rem' }}>
      <path d="M2 3.5h10M5 3.5V2a1 1 0 011-1h2a1 1 0 011 1v1.5M11 3.5v8a1 1 0 01-1 1H4a1 1 0 01-1-1v-8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginRight: '0.25rem' }}>
      <path d="M7 1v8M4 6l3 3 3-3M2 11h10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
