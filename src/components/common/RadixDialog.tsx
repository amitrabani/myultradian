import * as Dialog from '@radix-ui/react-dialog';
import type { ReactNode } from 'react';

interface RadixDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function RadixDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = 'md',
}: RadixDialogProps) {
  const sizeClass = `modal-${size}`;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="modal-overlay radix-dialog-overlay" />
        <Dialog.Content className={`modal-content radix-dialog-content ${sizeClass}`}>
          {title && (
            <div className="modal-header">
              <Dialog.Title className="modal-title">{title}</Dialog.Title>
              <Dialog.Close asChild>
                <button className="modal-close" aria-label="Close">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </Dialog.Close>
            </div>
          )}
          {description && (
            <Dialog.Description className="modal-description">
              {description}
            </Dialog.Description>
          )}
          <div className="modal-body">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Export primitives for custom compositions
export const DialogRoot = Dialog.Root;
export const DialogTrigger = Dialog.Trigger;
export const DialogPortal = Dialog.Portal;
export const DialogOverlay = Dialog.Overlay;
export const DialogContent = Dialog.Content;
export const DialogTitle = Dialog.Title;
export const DialogDescription = Dialog.Description;
export const DialogClose = Dialog.Close;
