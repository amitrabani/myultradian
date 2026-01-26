import * as Checkbox from '@radix-ui/react-checkbox';
import type { ReactNode } from 'react';

interface RadixCheckboxProps {
  checked: boolean | 'indeterminate';
  onCheckedChange: (checked: boolean | 'indeterminate') => void;
  label?: ReactNode;
  disabled?: boolean;
  id?: string;
  name?: string;
}

export function RadixCheckbox({
  checked,
  onCheckedChange,
  label,
  disabled,
  id,
  name,
}: RadixCheckboxProps) {
  const checkboxId = id || name || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="radix-checkbox-wrapper">
      <Checkbox.Root
        className="radix-checkbox-root"
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        id={checkboxId}
        name={name}
      >
        <Checkbox.Indicator className="radix-checkbox-indicator">
          {checked === 'indeterminate' ? <MinusIcon /> : <CheckIcon />}
        </Checkbox.Indicator>
      </Checkbox.Root>
      {label && (
        <label className="radix-checkbox-label" htmlFor={checkboxId}>
          {label}
        </label>
      )}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M2 6L5 9L10 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M2 6H10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Bulk selection checkbox with count display
interface BulkCheckboxProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  disabled?: boolean;
}

export function BulkCheckbox({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  disabled,
}: BulkCheckboxProps) {
  const allSelected = selectedCount === totalCount && totalCount > 0;
  const someSelected = selectedCount > 0 && selectedCount < totalCount;
  const checked = allSelected ? true : someSelected ? 'indeterminate' : false;

  const handleChange = (newChecked: boolean | 'indeterminate') => {
    if (newChecked === true) {
      onSelectAll();
    } else {
      onDeselectAll();
    }
  };

  return (
    <RadixCheckbox
      checked={checked}
      onCheckedChange={handleChange}
      disabled={disabled || totalCount === 0}
      label={selectedCount > 0 ? `${selectedCount} selected` : undefined}
    />
  );
}

// Export primitives for custom compositions
export const CheckboxRoot = Checkbox.Root;
export const CheckboxIndicator = Checkbox.Indicator;
