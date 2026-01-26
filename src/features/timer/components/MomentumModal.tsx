import { RadixDialog } from '../../../components/common/RadixDialog';
import { Button } from '../../../components/common/Button';
import { useTimerStore } from '../../../stores/timerStore';

interface MomentumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MomentumModal({ isOpen, onClose }: MomentumModalProps) {
  const acceptMomentumExtension = useTimerStore((state) => state.acceptMomentumExtension);
  const declineMomentumExtension = useTimerStore((state) => state.declineMomentumExtension);

  const handleAccept = () => {
    acceptMomentumExtension(10);
    onClose();
  };

  const handleDecline = () => {
    declineMomentumExtension();
    onClose();
  };

  return (
    <RadixDialog
      open={isOpen}
      onOpenChange={(open) => !open && handleDecline()}
      title=""
    >
      <div className="momentum-modal">
        <div className="momentum-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h2 className="momentum-title">You're in the zone!</h2>

        <p className="momentum-description">
          Great flow state detected. No pauses, high energy, peak completed smoothly.
        </p>

        <div className="momentum-offer">
          <span className="momentum-offer-label">Add 10 more minutes?</span>
          <span className="momentum-offer-note">Counts as an extension, not a new cycle</span>
        </div>

        <div className="momentum-actions">
          <Button
            variant="primary"
            size="lg"
            onClick={handleAccept}
            className="momentum-accept"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '1.25rem', height: '1.25rem' }}>
              <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Keep Going
          </Button>

          <Button
            variant="ghost"
            onClick={handleDecline}
          >
            Take my break
          </Button>
        </div>
      </div>
    </RadixDialog>
  );
}
