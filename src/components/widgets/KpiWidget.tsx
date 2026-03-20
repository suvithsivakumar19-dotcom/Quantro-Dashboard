import { useFilteredOrders, aggregate } from '@/hooks/useFilteredOrders';
import { KpiConfig } from '@/types/dashboard';
import { TrendingUp, DollarSign, Hash, ArrowUpRight } from 'lucide-react';

interface KpiWidgetProps {
  config: KpiConfig;
}

const ACCENT_COLORS = [
  { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20' },
  { bg: 'bg-emerald/10', text: 'text-emerald', border: 'border-emerald/20' },
  { bg: 'bg-violet/10', text: 'text-violet', border: 'border-violet/20' },
  { bg: 'bg-amber/10', text: 'text-amber', border: 'border-amber/20' },
  { bg: 'bg-rose/10', text: 'text-rose', border: 'border-rose/20' },
];

export function KpiWidget({ config }: KpiWidgetProps) {
  const orders = useFilteredOrders();
  const value = aggregate(orders, config.field, config.aggregation);
  
  const formatted = config.format === 'currency'
    ? `$${value.toFixed(config.decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
    : value.toFixed(config.decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const colorIdx = Math.abs(config.title.charCodeAt(0) || 0) % ACCENT_COLORS.length;
  const colors = ACCENT_COLORS[colorIdx];
  const Icon = config.format === 'currency' ? DollarSign : Hash;

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex items-center justify-between">
        <div className={`w-9 h-9 rounded-xl ${colors.bg} flex items-center justify-center border ${colors.border}`}>
          <Icon className={`w-4 h-4 ${colors.text}`} />
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald/10 border border-emerald/20">
          <ArrowUpRight className="w-3 h-3 text-emerald" />
          <span className="text-[10px] font-bold text-emerald">Live</span>
        </div>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-1 capitalize">{config.aggregation} of {config.field}</p>
        <p className="text-3xl font-extrabold tracking-heading tabular-nums text-foreground leading-none">{formatted}</p>
      </div>
    </div>
  );
}
