import * as AlertDialog from '@radix-ui/react-alert-dialog';
import type { ReactNode } from 'react';

interface RadixAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: ReactNode;
  cancelLabel?: string;
  actionLabel: string;
  onAction: () => void;
  actionVariant?: 'primary' | 'danger';
}

export function RadixAlertDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  cancelLabel = 'Cancel',
  actionLabel,
  onAction,
  actionVariant = 'primary',
}: RadixAlertDialogProps) {
  const actionClass = actionVariant === 'danger' ? 'btn btn-danger btn-md' : 'btn btn-primary btn-md';

  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="modal-overlay radix-alert-overlay" />
        <AlertDialog.Content className="modal-content radix-alert-content modal-sm">
          <div className="modal-body">
            <AlertDialog.Title className="radix-alert-title">
              {title}
            </AlertDialog.Title>
            {description && (
              <AlertDialog.Description className="radix-alert-description">
                {description}
              </AlertDialog.Description>
            )}
            {children}
            <div className="radix-alert-actions">
              <AlertDialog.Cancel asChild>
                <button className="btn btn-secondary btn-md">{cancelLabel}</button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button className={actionClass} onClick={onAction}>
                  {actionLabel}
                </button>
              </AlertDialog.Action>
            </div>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

// Preset for delete confirmation
interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName?: string;
  onConfirm: () => void;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  itemName = 'this item',
  onConfirm,
}: DeleteConfirmDialogProps) {
  return (
    <RadixAlertDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Confirmation"
      description={`Are you sure you want to delete ${itemName}? This action cannot be undone.`}
      cancelLabel="Cancel"
      actionLabel="Delete"
      onAction={onConfirm}
      actionVariant="danger"
    />
  );
}

// Export primitives for custom compositions
export const AlertDialogRoot = AlertDialog.Root;
export const AlertDialogTrigger = AlertDialog.Trigger;
export const AlertDialogPortal = AlertDialog.Portal;
export const AlertDialogOverlay = AlertDialog.Overlay;
export const AlertDialogContent = AlertDialog.Content;
export const AlertDialogTitle = AlertDialog.Title;
export const AlertDialogDescription = AlertDialog.Description;
export const AlertDialogCancel = AlertDialog.Cancel;
export const AlertDialogAction = AlertDialog.Action;
