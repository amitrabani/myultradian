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
        <p className="text-base-content/70">
          Are you sure you want to delete this record?
        </p>
        <div className="bg-base-200 rounded-lg p-3">
          <p className="font-medium text-base-content">
            {record.tags.topic}
          </p>
          <p className="text-sm text-base-content/60 mt-1">
            {new Date(record.createdAt).toLocaleString()}
          </p>
        </div>
        <p className="text-sm text-base-content/50">
          This action cannot be undone.
        </p>
        <div className="flex gap-3 pt-2">
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
