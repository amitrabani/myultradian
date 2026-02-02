import { useStatistics } from '../../hooks/useStatistics';
import { Card, CardHeader, CardTitle } from '../../components/common/Card';
import { RadixTabs } from '../../components/common/RadixTabs';
import { KPICard } from './components/KPICard';
import { FocusTimeChart } from '../../components/charts/FocusTimeChart';
import { CyclesBarChart } from '../../components/charts/CyclesBarChart';
import { TaskDistributionChart } from '../../components/charts/TaskDistributionChart';
import { FocusHeatmap } from '../../components/charts/FocusHeatmap';
import { RecoveryImpactChart } from '../../components/charts/RecoveryImpactChart';
import { TaskTypeEfficiencyChart } from '../../components/charts/TaskTypeEfficiencyChart';
import { formatMinutes } from '../../utils/time';
import { InsightsPage } from '../insights/InsightsPage';
import { RecordsPage } from '../records/RecordsPage';

export function DashboardPage() {
  const { stats, chartData, insights } = useStatistics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-base-content">Dashboard</h1>
          <p className="text-sm text-base-content/60 mt-0.5">Your focus statistics at a glance</p>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Focus Time"
          value={formatMinutes(stats.totalFocusTime)}
          subtitle="All time"
          color="emerald"
          icon={
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <KPICard
          title="Effective Focus"
          value={formatMinutes(stats.effectiveFocusTime)}
          subtitle="Peak time"
          color="indigo"
          icon={
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          }
        />
        <KPICard
          title="Focused Days"
          value={stats.focusedDaysTotal}
          subtitle="Total days"
          color="amber"
          icon={
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          }
        />
        <KPICard
          title="Consistency"
          value={`${Math.round(stats.consistencyScore)}%`}
          subtitle="Last 14 days"
          color="violet"
          icon={
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          }
        />
      </div>

      {/* Secondary Stats Row */}
      <div className="stats stats-vertical sm:stats-horizontal w-full bg-base-100 border border-base-300">
        <div className="stat">
          <div className="stat-title">Cycles</div>
          <div className="stat-value text-lg text-primary">{stats.completedCycles}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Day Streak</div>
          <div className="stat-value text-lg text-secondary">{stats.currentStreak}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Recovery</div>
          <div className="stat-value text-lg text-accent">{Math.round(stats.recoveryCompliance)}%</div>
        </div>
        <div className="stat">
          <div className="stat-title">Avg Energy</div>
          <div className="stat-value text-lg">{stats.averageEnergy > 0 ? stats.averageEnergy.toFixed(1) : '-'}</div>
        </div>
      </div>

      {/* Insights Row */}
      {stats.completedCycles > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Best Recovery Activity */}
          {insights.bestRecoveryActivity && (
            <Card>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🏆</span>
                <div>
                  <span className="text-xs text-base-content/60 font-medium">Best Recovery</span>
                  <p className="font-semibold text-base-content">{insights.bestRecoveryActivity.activity}</p>
                  <span className="text-xs text-base-content/50">
                    {Math.round(insights.bestRecoveryActivity.nextCompletionRate)}% completion rate after
                  </span>
                </div>
              </div>
            </Card>
          )}

          {/* Friction Distribution */}
          <Card>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📊</span>
              <div className="flex-1">
                <span className="text-xs text-base-content/60 font-medium">Session Flow</span>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <progress className="progress progress-success w-full" value={insights.frictionDistribution.low} max="100"></progress>
                    <span className="text-xs whitespace-nowrap">Smooth {insights.frictionDistribution.low}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <progress className="progress progress-warning w-full" value={insights.frictionDistribution.medium} max="100"></progress>
                    <span className="text-xs whitespace-nowrap">Moderate {insights.frictionDistribution.medium}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <progress className="progress progress-error w-full" value={insights.frictionDistribution.high} max="100"></progress>
                    <span className="text-xs whitespace-nowrap">Challenging {insights.frictionDistribution.high}%</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Momentum Stats */}
          {insights.momentumStats.triggered > 0 && (
            <Card>
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <span className="text-xs text-base-content/60 font-medium">Momentum Mode</span>
                  <p className="font-semibold text-base-content">{insights.momentumStats.accepted}/{insights.momentumStats.triggered} accepted</p>
                  <span className="text-xs text-base-content/50">
                    {Math.round(insights.momentumStats.acceptRate)}% accept rate
                  </span>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Charts with Tabs */}
      <RadixTabs
        tabs={[
          {
            value: 'overview',
            label: 'Overview',
            content: (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Daily Focus Time</CardTitle>
                  </CardHeader>
                  <FocusTimeChart data={chartData.dailyFocusTime} />
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Completed Cycles Per Day</CardTitle>
                  </CardHeader>
                  <CyclesBarChart data={chartData.dailyFocusTime} />
                </Card>
              </div>
            ),
          },
          {
            value: 'insights',
            label: 'Insights',
            content: (
              <div className="mt-4">
                <InsightsPage />
              </div>
            ),
          },
          {
            value: 'records',
            label: 'Records',
            content: (
              <div className="mt-4">
                <RecordsPage />
              </div>
            ),
          },
          {
            value: 'patterns',
            label: 'Patterns',
            content: (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Focus Heatmap</CardTitle>
                  </CardHeader>
                  <FocusHeatmap data={chartData.heatmapData} />
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Recovery Impact</CardTitle>
                  </CardHeader>
                  <RecoveryImpactChart data={chartData.recoveryImpact} />
                </Card>
              </div>
            ),
          },
          {
            value: 'tasks',
            label: 'Tasks',
            content: (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Task Type Distribution</CardTitle>
                  </CardHeader>
                  <TaskDistributionChart data={chartData.taskTypeDistribution} />
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Task Type Efficiency</CardTitle>
                  </CardHeader>
                  <TaskTypeEfficiencyChart data={chartData.taskTypeEfficiency} />
                </Card>
              </div>
            ),
          },
        ]}
      />

      {/* Empty state */}
      {stats.completedCycles === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p className="mt-4 text-base-content/60">Complete your first focus cycle to see statistics here.</p>
        </div>
      )}
    </div>
  );
}
