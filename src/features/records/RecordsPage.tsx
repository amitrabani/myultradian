import { useState } from 'react';
import { useRecordsStore } from '../../stores/recordsStore';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { RecordsTable, RecordFilters, RecordForm, DeleteConfirmModal, BulkActions } from './components';
import type { FocusRecord, SessionTags } from '../../types/record';

export function RecordsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FocusRecord | null>(null);
  const [deletingRecord, setDeletingRecord] = useState<FocusRecord | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  const deleteRecord = useRecordsStore((state) => state.deleteRecord);
  const records = useRecordsStore((state) => state.records);
  const getFilteredRecords = useRecordsStore((state) => state.getFilteredRecords);
  const filteredRecords = getFilteredRecords();

  const handleEdit = (record: FocusRecord) => {
    setEditingRecord(record);
    setShowForm(true);
  };

  const handleDelete = (record: FocusRecord) => {
    setDeletingRecord(record);
  };

  const handleConfirmDelete = () => {
    if (deletingRecord) {
      deleteRecord(deletingRecord.id);
      setDeletingRecord(null);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingRecord(null);
  };

  const handleSelectAll = () => {
    setSelectedIds(new Set(filteredRecords.map((r) => r.id)));
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleDuplicate = (tags: SessionTags) => {
    // Show a notification or navigate to timer
    // TODO: In the future, integrate with navigation to pre-fill SessionSetup
    alert(`Session tags copied! Topic: "${tags.topic}", Type: "${tags.taskType}". You can now start a new session with these settings.`);
  };

  return (
    <div className="page space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="page-title">Focus Records</h1>
          <p className="page-subtitle">{records.length} total sessions</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Record
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <RecordFilters />
      </Card>

      {/* Bulk Actions */}
      <BulkActions
        selectedIds={selectedIds}
        filteredRecords={filteredRecords}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        onSelectionChange={setSelectedIds}
      />

      {/* Table */}
      <Card padding="none">
        <RecordsTable
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
      </Card>

      {/* Add/Edit Form Modal */}
      <RecordForm
        isOpen={showForm}
        onClose={handleCloseForm}
        record={editingRecord}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingRecord}
        onClose={() => setDeletingRecord(null)}
        onConfirm={handleConfirmDelete}
        record={deletingRecord}
      />
    </div>
  );
}
