import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TASK_TYPE_LABELS, type TaskType } from '../../types/record';

interface TaskDistributionChartProps {
  data: Array<{ taskType: string; count: number; focusTime: number }>;
}

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b'];

export function TaskDistributionChart({ data }: TaskDistributionChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center text-slate-400">
        No data available
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: TASK_TYPE_LABELS[item.taskType as TaskType] || item.taskType,
    value: item.focusTime,
    count: item.count,
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.[0]) return null;
            const data = payload[0].payload;
            return (
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-3">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {data.name}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Focus time: <span className="font-medium">{Math.round(data.value)}m</span>
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Sessions: <span className="font-medium">{data.count}</span>
                </p>
              </div>
            );
          }}
        />
        <Legend
          formatter={(value) => (
            <span className="text-sm text-slate-600 dark:text-slate-400">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
