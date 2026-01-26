import { useMemo } from 'react';

interface HeatmapData {
  dayOfWeek: number;
  hour: number;
  count: number;
  completionRate: number;
}

interface FocusHeatmapProps {
  data: HeatmapData[];
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOUR_LABELS = ['12a', '3a', '6a', '9a', '12p', '3p', '6p', '9p'];

export function FocusHeatmap({ data }: FocusHeatmapProps) {
  // Find max count for color scaling
  const maxCount = useMemo(() => {
    return Math.max(1, ...data.map(d => d.count));
  }, [data]);

  // Group data by day and hour for quick lookup
  const dataMap = useMemo(() => {
    const map = new Map<string, HeatmapData>();
    data.forEach(d => {
      map.set(`${d.dayOfWeek}-${d.hour}`, d);
    });
    return map;
  }, [data]);

  const getColor = (count: number, completionRate: number) => {
    if (count === 0) return 'var(--color-slate-100)';

    const intensity = count / maxCount;
    // Blend between slate and the completion rate color
    if (completionRate >= 80) {
      return `rgba(16, 185, 129, ${0.2 + intensity * 0.6})`; // emerald
    } else if (completionRate >= 50) {
      return `rgba(245, 158, 11, ${0.2 + intensity * 0.6})`; // amber
    } else if (completionRate > 0) {
      return `rgba(239, 68, 68, ${0.2 + intensity * 0.6})`; // red
    }
    return `rgba(100, 116, 139, ${0.1 + intensity * 0.3})`; // slate
  };

  return (
    <div className="focus-heatmap">
      {/* Hour labels (top) */}
      <div className="heatmap-row heatmap-header">
        <div className="heatmap-day-label" />
        {HOUR_LABELS.map((label, i) => (
          <div key={i} className="heatmap-hour-label" style={{ gridColumn: `span 3` }}>
            {label}
          </div>
        ))}
      </div>

      {/* Data rows */}
      {DAY_LABELS.map((day, dayIndex) => (
        <div key={day} className="heatmap-row">
          <div className="heatmap-day-label">{day}</div>
          {Array.from({ length: 24 }, (_, hour) => {
            const cellData = dataMap.get(`${dayIndex}-${hour}`);
            const count = cellData?.count || 0;
            const completionRate = cellData?.completionRate || 0;

            return (
              <div
                key={hour}
                className="heatmap-cell"
                style={{ backgroundColor: getColor(count, completionRate) }}
                title={count > 0
                  ? `${day} ${hour}:00 - ${count} session${count !== 1 ? 's' : ''}, ${Math.round(completionRate)}% completed`
                  : `${day} ${hour}:00 - No sessions`
                }
              />
            );
          })}
        </div>
      ))}

      {/* Legend */}
      <div className="heatmap-legend">
        <span className="heatmap-legend-label">Less</span>
        <div className="heatmap-legend-scale">
          <div className="heatmap-legend-box" style={{ backgroundColor: 'var(--color-slate-100)' }} />
          <div className="heatmap-legend-box" style={{ backgroundColor: 'rgba(16, 185, 129, 0.3)' }} />
          <div className="heatmap-legend-box" style={{ backgroundColor: 'rgba(16, 185, 129, 0.5)' }} />
          <div className="heatmap-legend-box" style={{ backgroundColor: 'rgba(16, 185, 129, 0.7)' }} />
          <div className="heatmap-legend-box" style={{ backgroundColor: 'rgba(16, 185, 129, 0.9)' }} />
        </div>
        <span className="heatmap-legend-label">More</span>
      </div>
    </div>
  );
}
