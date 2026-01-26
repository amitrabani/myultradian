import * as Progress from '@radix-ui/react-progress';

interface RadixProgressProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  valueFormatter?: (value: number, max: number) => string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'emerald' | 'amber' | 'indigo' | 'violet' | 'red' | 'slate';
  className?: string;
}

export function RadixProgress({
  value,
  max = 100,
  label,
  showValue = false,
  valueFormatter = (v, m) => `${Math.round((v / m) * 100)}%`,
  size = 'md',
  color = 'emerald',
  className = '',
}: RadixProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`radix-progress-wrapper ${className}`}>
      {(label || showValue) && (
        <div className="radix-progress-header">
          {label && <span className="radix-progress-label">{label}</span>}
          {showValue && (
            <span className="radix-progress-value">{valueFormatter(value, max)}</span>
          )}
        </div>
      )}
      <Progress.Root
        className={`radix-progress-root radix-progress-${size}`}
        value={percentage}
        max={100}
      >
        <Progress.Indicator
          className={`radix-progress-indicator radix-progress-${color}`}
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </Progress.Root>
    </div>
  );
}

// Stage progress with multiple segments
interface StageProgressProps {
  stages: Array<{
    label: string;
    progress: number; // 0-1
    color: string;
    isActive?: boolean;
    isCompleted?: boolean;
  }>;
}

export function StageProgress({ stages }: StageProgressProps) {
  return (
    <div className="stage-progress-bar">
      {stages.map((stage, index) => (
        <div key={index} className="stage-progress-segment">
          <div
            className="stage-progress-fill"
            style={{
              width: `${stage.progress * 100}%`,
              backgroundColor: stage.isCompleted ? stage.color : stage.isActive ? stage.color : undefined,
              opacity: stage.isActive ? 1 : stage.isCompleted ? 0.8 : 0.3,
            }}
          />
        </div>
      ))}
    </div>
  );
}

// Export primitives for custom compositions
export const ProgressRoot = Progress.Root;
export const ProgressIndicator = Progress.Indicator;
