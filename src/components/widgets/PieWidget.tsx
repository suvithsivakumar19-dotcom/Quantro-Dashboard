import { useFilteredOrders, getNestedValue } from '@/hooks/useFilteredOrders';
import { PieConfig } from '@/types/dashboard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useMemo } from 'react';

const COLORS = [
  'hsl(221, 83%, 53%)',
  'hsl(160, 84%, 39%)',
  'hsl(346, 84%, 61%)',
  'hsl(38, 92%, 50%)',
  'hsl(262, 83%, 58%)',
  'hsl(192, 91%, 36%)',
  'hsl(239, 84%, 67%)',
];

const tooltipStyle = {
  borderRadius: 12,
  border: 'none',
  boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)',
  fontSize: 12,
  padding: '8px 12px',
};

export function PieWidget({ config }: { config: PieConfig }) {
  const orders = useFilteredOrders();

  const data = useMemo(() => {
    const grouped: Record<string, number> = {};
    orders.forEach(o => {
      const key = String(getNestedValue(o, config.field) || 'Unknown');
      grouped[key] = (grouped[key] || 0) + 1;
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [orders, config.field]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius="35%"
          outerRadius="70%"
          paddingAngle={4}
          dataKey="value"
          stroke="none"
          animationBegin={0}
          animationDuration={800}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        {config.showLegend && (
          <Legend
            wrapperStyle={{ fontSize: 11 }}
            iconType="circle"
            iconSize={8}
          />
        )}
      </PieChart>
    </ResponsiveContainer>
  );
}
