import { Card } from '../../../components/common/Card';

interface InsightCardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function InsightCard({ title, children, icon }: InsightCardProps) {
  return (
    <Card>
      <div className="insight-card">
        {icon && <div className="insight-icon">{icon}</div>}
        <h3 className="insight-title">{title}</h3>
      </div>
      <div className="insight-text">{children}</div>
    </Card>
  );
}
