import { useState } from 'react';
import { useTimerStore } from '../../../stores/timerStore';
import { RadixDialog } from '../../../components/common/RadixDialog';
import { Button } from '../../../components/common/Button';

export function DistractionCapture() {
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState('');
  const logDistraction = useTimerStore((state) => state.logDistraction);

  const handleQuickLog = () => {
    logDistraction();
    // Brief visual feedback without opening modal
  };

  const handleLogWithNote = () => {
    logDistraction(note.trim() || undefined);
    setNote('');
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setNote('');
    }
  };

  return (
    <>
      {/* Floating button container */}
      <div className="distraction-capture-container">
        <button
          className="distraction-capture-btn"
          onClick={handleQuickLog}
          onContextMenu={(e) => {
            e.preventDefault();
            setIsOpen(true);
          }}
          title="Click to log distraction, right-click to add note"
        >
          <DistractionIcon />
          <span className="distraction-capture-label">Log Distraction</span>
        </button>
        <button
          className="distraction-capture-note-btn"
          onClick={() => setIsOpen(true)}
          title="Add distraction with note"
        >
          <PlusIcon />
        </button>
      </div>

      {/* Modal for adding note */}
      <RadixDialog
        open={isOpen}
        onOpenChange={handleOpenChange}
        title="Log Distraction"
        size="sm"
      >
        <div className="distraction-note-form">
          <p className="distraction-note-description">
            What pulled you away? (optional)
          </p>
          <textarea
            className="distraction-note-input"
            placeholder="e.g., Checked email, phone notification..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            maxLength={100}
            autoFocus
          />
          <div className="distraction-note-actions">
            <Button variant="secondary" size="sm" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleLogWithNote}>
              Log
            </Button>
          </div>
        </div>
      </RadixDialog>
    </>
  );
}

function DistractionIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="9" cy="9" r="7" />
      <path d="M9 6v3l2 2" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 3v8M3 7h8" strokeLinecap="round" />
    </svg>
  );
}
