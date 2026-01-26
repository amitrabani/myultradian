import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import type { FocusRecord } from '../../../types/record';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  record: FocusRecord | null;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  record,
}: DeleteConfirmModalProps) {
  if (!record) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Record" size="sm">
      <div className="space-y-4">
        <p style={{ color: 'var(--color-slate-600)' }}>
          Are you sure you want to delete this record?
        </p>
        <div className="template-info">
          <p style={{ fontWeight: 500, color: 'var(--color-slate-900)' }}>
            {record.tags.topic}
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-slate-500)' }}>
            {new Date(record.createdAt).toLocaleString()}
          </p>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-slate-500)' }}>
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" className="flex-1" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
