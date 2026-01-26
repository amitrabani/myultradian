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
import { CHART_COLORS } from '../../utils/constants';

interface RecoveryImpactData {
  fullRecovery: { avgEnergy: number; completionRate: number };
  skippedRecovery: { avgEnergy: number; completionRate: number };
}

interface RecoveryImpactChartProps {
  data: RecoveryImpactData;
}

export function RecoveryImpactChart({ data }: RecoveryImpactChartProps) {
  const chartData = [
    {
      name: 'Full Recovery',
      energy: Number(data.fullRecovery.avgEnergy.toFixed(1)),
      completion: Number(data.fullRecovery.completionRate.toFixed(0)),
      type: 'full',
    },
    {
      name: 'Skipped Recovery',
      energy: Number(data.skippedRecovery.avgEnergy.toFixed(1)),
      completion: Number(data.skippedRecovery.completionRate.toFixed(0)),
      type: 'skipped',
    },
  ];

  const hasData = data.fullRecovery.avgEnergy > 0 || data.skippedRecovery.avgEnergy > 0;

  if (!hasData) {
    return (
      <div className="chart-empty-state">
        <p>Complete more consecutive cycles to see recovery impact data.</p>
      </div>
    );
  }

  return (
    <div className="recovery-impact-chart">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 30, left: 80, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748b' }} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} width={100} />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.[0]) return null;
              const item = payload[0].payload;
              return (
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-3">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {item.name}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Next cycle energy: <span className="font-medium">{item.energy}/5</span>
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Completion rate: <span className="font-medium">{item.completion}%</span>
                  </p>
                </div>
              );
            }}
          />
          <Bar dataKey="completion" name="Completion Rate %" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.type === 'full' ? CHART_COLORS.primary : CHART_COLORS.quaternary}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="recovery-impact-summary">
        {data.fullRecovery.completionRate > data.skippedRecovery.completionRate ? (
          <p className="recovery-impact-insight positive">
            Taking full recovery improves your next cycle by{' '}
            <strong>{Math.round(data.fullRecovery.completionRate - data.skippedRecovery.completionRate)}%</strong>
          </p>
        ) : data.skippedRecovery.avgEnergy > 0 ? (
          <p className="recovery-impact-insight neutral">
            Not enough data to determine recovery impact yet.
          </p>
        ) : null}
      </div>
    </div>
  );
}
