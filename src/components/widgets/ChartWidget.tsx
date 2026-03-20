import { useFilteredOrders, getNestedValue } from '@/hooks/useFilteredOrders';
import { ChartConfig } from '@/types/dashboard';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useMemo } from 'react';

interface ChartWidgetProps {
  config: ChartConfig;
  type: 'bar' | 'line' | 'area' | 'scatter';
}

const tooltipStyle = {
  borderRadius: 12,
  border: 'none',
  boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)',
  backdropFilter: 'blur(12px)',
  fontSize: 12,
  padding: '8px 12px',
};

const gridColor = 'hsl(220, 13%, 91%)';
const tickColor = 'hsl(220, 9%, 46%)';

export function ChartWidget({ config, type }: ChartWidgetProps) {
  const orders = useFilteredOrders();

  const data = useMemo(() => {
    const grouped: Record<string, number> = {};
    orders.forEach(o => {
      const key = String(getNestedValue(o, config.xAxis) || 'Unknown');
      const val = Number(getNestedValue(o, config.yAxis)) || 0;
      grouped[key] = (grouped[key] || 0) + val;
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [orders, config.xAxis, config.yAxis]);

  const color = config.color || '#3b82f6';
  const gradientId = `grad-${config.title}-${type}`;
  const commonMargin = { top: 10, right: 10, bottom: 5, left: 0 };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
        No data available
      </div>
    );
  }

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart data={data} margin={commonMargin}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: tickColor }} stroke={gridColor} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: tickColor }} stroke={gridColor} axisLine={false} tickLine={false} width={45} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'hsl(221, 83%, 53%, 0.04)' }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} label={config.showLabels ? { fontSize: 9, fill: tickColor } : false} maxBarSize={50}>
              {data.map((_, i) => <Cell key={i} fill={color} opacity={0.75 + (i % 3) * 0.08} />)}
            </Bar>
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={data} margin={commonMargin}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: tickColor }} stroke={gridColor} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: tickColor }} stroke={gridColor} axisLine={false} tickLine={false} width={45} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2.5}
              dot={{ fill: color, r: 4, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
              label={config.showLabels ? { fontSize: 9, fill: tickColor } : false}
            />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart data={data} margin={commonMargin}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.25} />
                <stop offset="100%" stopColor={color} stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: tickColor }} stroke={gridColor} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: tickColor }} stroke={gridColor} axisLine={false} tickLine={false} width={45} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fill={`url(#${gradientId})`}
              strokeWidth={2.5}
              dot={{ fill: color, r: 3, strokeWidth: 2, stroke: '#fff' }}
              label={config.showLabels ? { fontSize: 9, fill: tickColor } : false}
            />
          </AreaChart>
        );
      case 'scatter':
        return (
          <ScatterChart data={data} margin={commonMargin}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: tickColor }} stroke={gridColor} axisLine={false} tickLine={false} />
            <YAxis type="number" dataKey="value" tick={{ fontSize: 10, fill: tickColor }} stroke={gridColor} axisLine={false} tickLine={false} width={45} />
            <Tooltip contentStyle={tooltipStyle} />
            <Scatter data={data} fill={color} fillOpacity={0.7} />
          </ScatterChart>
        );
    }
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      {renderChart()}
    </ResponsiveContainer>
  );
}
