import { Card } from '../../../components/common/Card';

interface InsightCardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function InsightCard({ title, children, icon }: InsightCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-3 mb-3">
        {icon && <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>}
        <h3 className="text-sm font-semibold text-base-content/60">{title}</h3>
      </div>
      <div className="text-sm text-base-content/80">{children}</div>
    </Card>
  );
}
