import { useReflectionStore } from '../../../stores/reflectionStore';
import { Card, CardHeader, CardTitle } from '../../../components/common/Card';

export function WeeklySummary() {
  const recentReflections = useReflectionStore((state) => state.getRecentReflections(4));

  if (recentReflections.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Past Reflections</CardTitle>
      </CardHeader>
      <div className="weekly-summary-list">
        {recentReflections.map((reflection) => (
          <div key={reflection.id} className="weekly-summary-item">
            <div className="weekly-summary-header">
              <span className="weekly-summary-week">
                Week of {formatWeekStart(reflection.weekStart)}
              </span>
              <time className="weekly-summary-date">
                {formatDate(reflection.createdAt)}
              </time>
            </div>
            {reflection.whatHelped && (
              <div className="weekly-summary-section">
                <span className="weekly-summary-label positive">
                  <span className="icon">+</span> What helped
                </span>
                <p className="weekly-summary-content">{reflection.whatHelped}</p>
              </div>
            )}
            {reflection.whatHurt && (
              <div className="weekly-summary-section">
                <span className="weekly-summary-label negative">
                  <span className="icon">-</span> What hurt
                </span>
                <p className="weekly-summary-content">{reflection.whatHurt}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

function formatWeekStart(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
