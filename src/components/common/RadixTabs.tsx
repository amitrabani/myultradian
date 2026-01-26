import * as Tabs from '@radix-ui/react-tabs';
import type { ReactNode } from 'react';

interface Tab {
  value: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

interface RadixTabsProps {
  tabs: Tab[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function RadixTabs({
  tabs,
  defaultValue,
  value,
  onValueChange,
  orientation = 'horizontal',
  className = '',
}: RadixTabsProps) {
  const defaultTab = defaultValue || tabs[0]?.value;

  return (
    <Tabs.Root
      className={`${className}`}
      defaultValue={defaultTab}
      value={value}
      onValueChange={onValueChange}
      orientation={orientation}
    >
      <Tabs.List className="tabs tabs-box bg-base-200" aria-label="Tabs">
        {tabs.map((tab) => (
          <Tabs.Trigger
            key={tab.value}
            className="tab data-[state=active]:tab-active data-[state=active]:bg-primary data-[state=active]:text-primary-content"
            value={tab.value}
            disabled={tab.disabled}
          >
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {tabs.map((tab) => (
        <Tabs.Content key={tab.value} className="mt-4" value={tab.value}>
          {tab.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}

// Export primitives for custom compositions
export const TabsRoot = Tabs.Root;
export const TabsList = Tabs.List;
export const TabsTrigger = Tabs.Trigger;
export const TabsContent = Tabs.Content;
