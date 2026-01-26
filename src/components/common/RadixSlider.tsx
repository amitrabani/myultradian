import * as Slider from '@radix-ui/react-slider';

interface RadixSliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  valueFormatter?: (value: number) => string;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  id?: string;
}

export function RadixSlider({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  valueFormatter = (v) => String(v),
  disabled,
  orientation = 'horizontal',
  id,
}: RadixSliderProps) {
  const sliderId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="radix-slider-wrapper">
      {(label || showValue) && (
        <div className="radix-slider-header">
          {label && (
            <label htmlFor={sliderId} className="input-label">
              {label}
            </label>
          )}
          {showValue && (
            <span className="radix-slider-value">{valueFormatter(value[0])}</span>
          )}
        </div>
      )}
      <Slider.Root
        id={sliderId}
        className={`radix-slider-root radix-slider-${orientation}`}
        value={value}
        onValueChange={onValueChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        orientation={orientation}
      >
        <Slider.Track className="radix-slider-track">
          <Slider.Range className="radix-slider-range" />
        </Slider.Track>
        <Slider.Thumb className="radix-slider-thumb" aria-label={label} />
      </Slider.Root>
    </div>
  );
}

// Energy level slider with predefined settings
interface EnergySliderProps {
  value: 1 | 2 | 3 | 4 | 5;
  onValueChange: (value: 1 | 2 | 3 | 4 | 5) => void;
  label?: string;
  disabled?: boolean;
}

const ENERGY_LABELS: Record<number, string> = {
  1: 'Very Low',
  2: 'Low',
  3: 'Medium',
  4: 'High',
  5: 'Very High',
};

export function EnergySlider({
  value,
  onValueChange,
  label = 'Energy Level',
  disabled,
}: EnergySliderProps) {
  return (
    <RadixSlider
      value={[value]}
      onValueChange={(v) => onValueChange(v[0] as 1 | 2 | 3 | 4 | 5)}
      min={1}
      max={5}
      step={1}
      label={label}
      valueFormatter={(v) => ENERGY_LABELS[v] || String(v)}
      disabled={disabled}
    />
  );
}

// Export primitives for custom compositions
export const SliderRoot = Slider.Root;
export const SliderTrack = Slider.Track;
export const SliderRange = Slider.Range;
export const SliderThumb = Slider.Thumb;
