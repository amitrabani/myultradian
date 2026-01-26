import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CHART_COLORS } from '../../utils/constants';

interface FocusTimeChartProps {
  data: Array<{ date: string; focusTime: number; cycles: number }>;
}

export function FocusTimeChart({ data }: FocusTimeChartProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const formatTooltipDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          tick={{ fontSize: 12, fill: '#64748b' }}
          axisLine={{ stroke: '#e2e8f0' }}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#64748b' }}
          axisLine={{ stroke: '#e2e8f0' }}
          tickFormatter={(value) => `${value}m`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.[0]) return null;
            const data = payload[0].payload;
            return (
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-3">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {formatTooltipDate(data.date)}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Focus time: <span className="font-medium">{data.focusTime}m</span>
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Cycles: <span className="font-medium">{data.cycles}</span>
                </p>
              </div>
            );
          }}
        />
        <Line
          type="monotone"
          dataKey="focusTime"
          stroke={CHART_COLORS.primary}
          strokeWidth={2}
          dot={{ fill: CHART_COLORS.primary, strokeWidth: 0, r: 4 }}
          activeDot={{ r: 6, fill: CHART_COLORS.primary }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
