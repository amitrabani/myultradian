import { RadixAlertDialog } from '../../../components/common/RadixAlertDialog';
import type { CycleStage } from '../../../types/cycle';
import { STAGE_LABELS } from '../../../types/cycle';

interface SkipStageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentStage: CycleStage | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function SkipStageModal({
  open,
  onOpenChange,
  currentStage,
  onConfirm,
  onCancel,
}: SkipStageModalProps) {
  const stageName = currentStage ? STAGE_LABELS[currentStage] : 'this stage';

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      onCancel();
    }
    onOpenChange(newOpen);
  };

  // Get stage-specific warning message
  const getWarningMessage = () => {
    switch (currentStage) {
      case 'ramp-up':
        return 'Skipping ramp-up may reduce your focus quality during peak.';
      case 'peak':
        return 'Ending peak early may leave cognitive threads unresolved.';
      case 'downshift':
        return 'Skipping downshift may increase cognitive residue and make the next cycle harder.';
      case 'recovery':
        return 'Skipping recovery can lead to accumulated fatigue over multiple cycles.';
      default:
        return 'Skipping stages may reduce the effectiveness of your focus cycle.';
    }
  };

  return (
    <RadixAlertDialog
      open={open}
      onOpenChange={handleOpenChange}
      title={`Skip ${stageName}?`}
      description={getWarningMessage()}
      cancelLabel="Stay Here"
      actionLabel={`Skip to Next Stage`}
      onAction={onConfirm}
      actionVariant="primary"
    >
      <div className="skip-stage-info">
        <div className="skip-stage-warning">
          <WarningIcon />
          <p className="skip-stage-warning-text">
            The ultradian rhythm works best when all stages are completed.
            Consider shortening future cycles if this happens often.
          </p>
        </div>
      </div>
    </RadixAlertDialog>
  );
}

function WarningIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="skip-stage-warning-icon"
    >
      <path d="M10 6v4M10 14h.01" strokeLinecap="round" />
      <path d="M8.91 2.91L1.68 15.5a1.25 1.25 0 001.09 1.88h14.46a1.25 1.25 0 001.09-1.88L11.09 2.91a1.25 1.25 0 00-2.18 0z" />
    </svg>
  );
}
