import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { TASK_TYPE_LABELS, type TaskType } from '../../types/record';
import { CHART_COLORS } from '../../utils/constants';

interface TaskEfficiencyData {
  taskType: string;
  avgPeakCompletion: number;
  avgEnergy: number;
  count: number;
}

interface TaskTypeEfficiencyChartProps {
  data: TaskEfficiencyData[];
}

const COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.tertiary,
  CHART_COLORS.quaternary,
  CHART_COLORS.muted,
];

export function TaskTypeEfficiencyChart({ data }: TaskTypeEfficiencyChartProps) {
  if (data.length === 0) {
    return (
      <div className="chart-empty-state">
        <p>Complete more sessions with different task types to see efficiency data.</p>
      </div>
    );
  }

  const chartData = data.map(d => ({
    ...d,
    taskType: TASK_TYPE_LABELS[d.taskType as TaskType] || d.taskType,
    avgPeakCompletion: Number(d.avgPeakCompletion.toFixed(0)),
    avgEnergy: Number(d.avgEnergy.toFixed(1)),
  }));

  return (
    <div className="task-efficiency-chart">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="taskType"
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={{ stroke: '#e2e8f0' }}
            interval={0}
            angle={-15}
            textAnchor="end"
            height={60}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={{ stroke: '#e2e8f0' }}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.[0]) return null;
              const item = payload[0].payload;
              return (
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-3">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {item.taskType}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Peak completion: <span className="font-medium">{item.avgPeakCompletion}%</span>
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Avg energy: <span className="font-medium">{item.avgEnergy}/5</span>
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-500">
                    Sessions: {item.count}
                  </p>
                </div>
              );
            }}
          />
          <Bar dataKey="avgPeakCompletion" name="Peak Completion %" radius={[4, 4, 0, 0]}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Best performer callout */}
      {chartData.length > 0 && (
        <div className="task-efficiency-summary">
          <p className="task-efficiency-insight">
            Best for focus: <strong>{chartData[0].taskType}</strong> ({chartData[0].avgPeakCompletion}% completion)
          </p>
        </div>
      )}
    </div>
  );
}
