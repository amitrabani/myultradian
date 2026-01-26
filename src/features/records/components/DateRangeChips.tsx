import { cn } from '../../../utils/cn';

export type DateRangePreset = 'all' | 'today' | 'week' | 'month' | 'custom';

interface DateRangeChipsProps {
    activePreset: DateRangePreset;
    onSelect: (preset: DateRangePreset) => void;
    className?: string;
}

export function DateRangeChips({ activePreset, onSelect, className }: DateRangeChipsProps) {
    const presets: { id: DateRangePreset; label: string }[] = [
        { id: 'all', label: 'All Time' },
        { id: 'today', label: 'Today' },
        { id: 'week', label: 'Last 7 Days' },
        { id: 'month', label: 'This Month' },
    ];

    return (
        <div className={cn("flex flex-wrap gap-2", className)}>
            {presets.map((preset) => (
                <button
                    key={preset.id}
                    onClick={() => onSelect(preset.id)}
                    className={cn(
                        "btn btn-sm",
                        activePreset === preset.id
                            ? "btn-primary"
                            : "btn-ghost"
                    )}
                >
                    {preset.label}
                </button>
            ))}
        </div>
    );
}
