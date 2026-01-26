import * as Select from '@radix-ui/react-select';
import { forwardRef, type ReactNode } from 'react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectGroup {
  label: string;
  options: SelectOption[];
}

interface RadixSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options?: SelectOption[];
  groups?: SelectGroup[];
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  id?: string;
}

export function RadixSelect({
  value,
  onValueChange,
  options,
  groups,
  placeholder = 'Select...',
  label,
  error,
  disabled,
  id,
}: RadixSelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="form-control w-full">
      {label && (
        <label htmlFor={selectId} className="label">
          <span className="label-text font-medium">{label}</span>
        </label>
      )}
      <Select.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <Select.Trigger
          id={selectId}
          className={`select select-bordered w-full flex items-center justify-between ${error ? 'select-error' : ''}`}
          aria-label={label}
        >
          <Select.Value placeholder={placeholder} />
          <Select.Icon className="ml-2">
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            className="z-50 bg-base-100 border border-base-300 rounded-box shadow-xl overflow-hidden"
            position="popper"
            sideOffset={4}
          >
            <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-base-100 cursor-default">
              <ChevronUpIcon />
            </Select.ScrollUpButton>
            <Select.Viewport className="p-1">
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </SelectItem>
              ))}
              {groups?.map((group) => (
                <Select.Group key={group.label}>
                  <Select.Label className="px-4 py-2 text-sm font-semibold text-base-content/60">{group.label}</Select.Label>
                  {group.options.map((option) => (
                    <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select.Group>
              ))}
            </Select.Viewport>
            <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-base-100 cursor-default">
              <ChevronDownIcon />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
}

interface SelectItemProps {
  children: ReactNode;
  value: string;
  disabled?: boolean;
}

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ children, value, disabled }, forwardedRef) => {
    return (
      <Select.Item
        className="relative flex items-center px-4 py-2 rounded-lg cursor-pointer select-none text-base-content data-[highlighted]:bg-primary data-[highlighted]:text-primary-content data-[disabled]:opacity-50 data-[disabled]:pointer-events-none outline-none"
        value={value}
        disabled={disabled}
        ref={forwardedRef}
      >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="absolute left-1 w-5 flex items-center justify-center">
          <CheckIcon />
        </Select.ItemIndicator>
      </Select.Item>
    );
  }
);

SelectItem.displayName = 'SelectItem';

function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronUpIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M9 7.5L6 4.5L3 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Export primitives for custom compositions
export const SelectRoot = Select.Root;
export const SelectTrigger = Select.Trigger;
export const SelectValue = Select.Value;
export const SelectIcon = Select.Icon;
export const SelectPortal = Select.Portal;
export const SelectContent = Select.Content;
export const SelectViewport = Select.Viewport;
export const SelectGroup = Select.Group;
export const SelectLabel = Select.Label;
export const SelectItemComponent = Select.Item;
export const SelectItemText = Select.ItemText;
export const SelectItemIndicator = Select.ItemIndicator;
