import { useStatistics, useWeeklyStats } from '../../hooks/useStatistics';
import { useRecordsStore } from '../../stores/recordsStore';
import { Card } from '../../components/common/Card';
import { InsightCard } from './components/InsightCard';
import { formatMinutes } from '../../utils/time';

export function InsightsPage() {
  const { stats, insights } = useStatistics();
  const weeklyStats = useWeeklyStats();
  const records = useRecordsStore((state) => state.records);

  const formatHour = (hour: number): string => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:00 ${period}`;
  };

  const hasEnoughData = records.length >= 3;

  return (
    <div className="page space-y-6">
      {/* Header */}
      <div>
        <h1 className="page-title">Insights</h1>
        <p className="page-subtitle">Personalized recommendations based on your focus patterns</p>
      </div>

      {!hasEnoughData ? (
        <Card>
          <div className="empty-state">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <p>Not enough data for insights yet</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-slate-400)', marginTop: '0.5rem' }}>
              Complete at least 3 focus sessions to unlock personalized insights
            </p>
          </div>
        </Card>
      ) : (
        <>
          {/* Weekly Summary */}
          <Card>
            <h2 className="card-title" style={{ marginBottom: '1rem' }}>This Week's Summary</h2>
            <div className="weekly-summary">
              <div>
                <p className="weekly-stat-value emerald">{formatMinutes(weeklyStats.totalFocusTime)}</p>
                <p className="weekly-stat-label">Focus time</p>
              </div>
              <div>
                <p className="weekly-stat-value indigo">{weeklyStats.completedCycles}</p>
                <p className="weekly-stat-label">Cycles</p>
              </div>
              <div>
                <p className="weekly-stat-value amber">
                  {weeklyStats.averageEnergy ? weeklyStats.averageEnergy.toFixed(1) : '-'}
                </p>
                <p className="weekly-stat-label">Avg. energy</p>
              </div>
            </div>
          </Card>

          {/* Insights Grid */}
          <div className="insights-grid">
            {/* Best Time of Day */}
            {insights.bestTimeOfDay && (
              <InsightCard
                title="Best Time of Day"
                icon={
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                }
              >
                <p className="insight-value">{formatHour(insights.bestTimeOfDay.hour)}</p>
                <p>
                  You tend to have the highest energy levels around{' '}
                  <strong>{formatHour(insights.bestTimeOfDay.hour)}</strong>.
                  Consider scheduling your most important work during this time.
                </p>
                <p className="insight-meta">
                  Average energy: {insights.bestTimeOfDay.averageEnergy.toFixed(1)}/5
                </p>
              </InsightCard>
            )}

            {/* Most Productive Template */}
            {insights.mostProductiveTemplate && (
              <InsightCard
                title="Most Productive Template"
                icon={
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                }
              >
                <p className="insight-value">{insights.mostProductiveTemplate.templateName}</p>
                <p>
                  You complete <strong>{Math.round(insights.mostProductiveTemplate.completionRate)}%</strong>{' '}
                  of sessions using this template. It seems to work well for your rhythm!
                </p>
              </InsightCard>
            )}

            {/* Streak Insight */}
            <InsightCard
              title="Consistency"
              icon={
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                  />
                </svg>
              }
            >
              {stats.currentStreak > 0 ? (
                <>
                  <p className="insight-value">{stats.currentStreak} day streak!</p>
                  <p>
                    {stats.currentStreak >= 7
                      ? "Amazing! You've been consistent for over a week. Keep up the great work!"
                      : stats.currentStreak >= 3
                      ? "You're building momentum. A few more days and you'll have a solid habit!"
                      : "Good start! Try to maintain your streak by completing at least one cycle daily."}
                  </p>
                </>
              ) : (
                <>
                  <p className="insight-value">No active streak</p>
                  <p>
                    Start a focus session today to begin building your streak!
                    Consistency is key to forming lasting habits.
                  </p>
                </>
              )}
            </InsightCard>

            {/* Recovery Insight */}
            <InsightCard
              title="Recovery Habits"
              icon={
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              }
            >
              <p className="insight-value">{Math.round(stats.recoveryCompliance)}% compliance</p>
              <p>
                {stats.recoveryCompliance >= 80
                  ? "Excellent! You're taking your recovery periods seriously, which helps maintain sustainable productivity."
                  : stats.recoveryCompliance >= 50
                  ? "You're completing about half your recovery periods. Consider taking the full break time to recharge."
                  : "You might be skipping recovery periods. Remember: rest is essential for sustained focus and preventing burnout."}
              </p>
            </InsightCard>
          </div>

          {/* Tips Section */}
          <Card>
            <h2 className="card-title" style={{ marginBottom: '1rem' }}>Focus Tips</h2>
            <ul className="tips-list">
              <li className="tip-item">
                <span className="tip-number">1</span>
                <p className="tip-text">
                  <strong>Use the ramp-up phase</strong>{' '}
                  to clear your desk, close unnecessary tabs, and mentally prepare for deep work.
                </p>
              </li>
              <li className="tip-item">
                <span className="tip-number">2</span>
                <p className="tip-text">
                  <strong>During peak focus</strong>,
                  put your phone in another room and use website blockers if needed.
                </p>
              </li>
              <li className="tip-item">
                <span className="tip-number">3</span>
                <p className="tip-text">
                  <strong>Don't skip recovery</strong>.
                  Step away from your workspace, stretch, or take a short walk.
                </p>
              </li>
            </ul>
          </Card>
        </>
      )}
    </div>
  );
}
