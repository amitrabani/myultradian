import { useState } from 'react';
import { RadixAlertDialog } from '../../../components/common/RadixAlertDialog';
import { EARLY_STOP_REASON_LABELS, type EarlyStopReason } from '../../../types/record';

interface EarlyStopModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: EarlyStopReason) => void;
  onCancel: () => void;
}

export function EarlyStopModal({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
}: EarlyStopModalProps) {
  const [selectedReason, setSelectedReason] = useState<EarlyStopReason | null>(null);

  const handleConfirm = () => {
    if (selectedReason) {
      onConfirm(selectedReason);
      setSelectedReason(null);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedReason(null);
      onCancel();
    }
    onOpenChange(newOpen);
  };

  const reasons: EarlyStopReason[] = ['fatigue', 'interruption', 'loss-of-focus', 'task-done', 'other'];

  return (
    <RadixAlertDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="End Session Early?"
      description="Why are you stopping? This helps track patterns."
      cancelLabel="Continue Working"
      actionLabel="End Session"
      onAction={handleConfirm}
      actionVariant="danger"
    >
      <div className="early-stop-reasons">
        {reasons.map((reason) => (
          <button
            key={reason}
            className={`early-stop-reason-btn ${selectedReason === reason ? 'selected' : ''}`}
            onClick={() => setSelectedReason(reason)}
            type="button"
          >
            <span className="early-stop-reason-icon">{getReasonIcon(reason)}</span>
            <span className="early-stop-reason-label">{EARLY_STOP_REASON_LABELS[reason]}</span>
          </button>
        ))}
      </div>
    </RadixAlertDialog>
  );
}

function getReasonIcon(reason: EarlyStopReason): string {
  switch (reason) {
    case 'fatigue':
      return '😴';
    case 'interruption':
      return '🔔';
    case 'loss-of-focus':
      return '💭';
    case 'task-done':
      return '✅';
    case 'other':
      return '📝';
    default:
      return '❓';
  }
}
