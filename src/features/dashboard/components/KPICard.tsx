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
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <div className="w-6 h-6">{icon}</div>
        </div>
        <div className="flex-1">
          <p className="text-sm text-base-content/60 font-medium">{title}</p>
          <p className="text-2xl font-bold text-base-content mt-1">{value}</p>
          {subtitle && <p className="text-xs text-base-content/50 mt-1">{subtitle}</p>}
        </div>
      </div>
    </Card>
  );
}
