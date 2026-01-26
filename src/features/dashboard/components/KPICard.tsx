import { Card } from '../../../components/common/Card';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: 'emerald' | 'indigo' | 'amber' | 'violet';
}

const colorClasses = {
  emerald: 'bg-success/10 text-success',
  indigo: 'bg-info/10 text-info',
  amber: 'bg-warning/10 text-warning',
  violet: 'bg-secondary/10 text-secondary',
};

export function KPICard({ title, value, subtitle, icon, color }: KPICardProps) {
  return (
    <Card>
      <div className="flex items-start gap-3">
        <div className={`p-2.5 rounded-lg ${colorClasses[color]}`}>
          <div className="w-5 h-5">{icon}</div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-base-content/60">{title}</p>
          <p className="text-xl font-semibold text-base-content mt-0.5">{value}</p>
          {subtitle && <p className="text-xs text-base-content/50 mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </Card>
  );
}
