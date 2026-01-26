import * as Tooltip from '@radix-ui/react-tooltip';
import type { ReactNode } from 'react';

interface RadixTooltipProps {
  children: ReactNode;
  content: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  delayDuration?: number;
  sideOffset?: number;
}

export function RadixTooltip({
  children,
  content,
  side = 'top',
  align = 'center',
  delayDuration = 300,
  sideOffset = 5,
}: RadixTooltipProps) {
  return (
    <Tooltip.Root delayDuration={delayDuration}>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          className="radix-tooltip-content"
          side={side}
          align={align}
          sideOffset={sideOffset}
        >
          {content}
          <Tooltip.Arrow className="radix-tooltip-arrow" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

// Tooltip provider to wrap the app
export function TooltipProvider({ children }: { children: ReactNode }) {
  return <Tooltip.Provider>{children}</Tooltip.Provider>;
}

// Export primitives for custom compositions
export const TooltipRoot = Tooltip.Root;
export const TooltipTrigger = Tooltip.Trigger;
export const TooltipPortal = Tooltip.Portal;
export const TooltipContent = Tooltip.Content;
export const TooltipArrow = Tooltip.Arrow;
export const TooltipProviderComponent = Tooltip.Provider;
