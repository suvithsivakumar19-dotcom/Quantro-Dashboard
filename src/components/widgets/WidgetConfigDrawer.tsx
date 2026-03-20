import { DashboardWidget, WidgetType, KpiConfig, ChartConfig, PieConfig, TableConfig, ORDER_FIELDS, GROUP_FIELDS, TABLE_COLUMNS } from '@/types/dashboard';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { X, BarChart3, Hash, PieChart as PieIcon, Table2, Activity, TrendingUp, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface WidgetConfigDrawerProps {
  widget?: DashboardWidget;
  onSave: (widget: DashboardWidget) => void;
  onClose: () => void;
  isNew?: boolean;
}

const WIDGET_TYPES: { value: WidgetType; label: string; icon: any; color: string }[] = [
  { value: 'kpi', label: 'KPI Card', icon: Hash, color: 'from-primary to-indigo' },
  { value: 'bar', label: 'Bar Chart', icon: BarChart3, color: 'from-emerald to-cyan' },
  { value: 'line', label: 'Line Chart', icon: Activity, color: 'from-violet to-primary' },
  { value: 'area', label: 'Area Chart', icon: TrendingUp, color: 'from-cyan to-emerald' },
  { value: 'scatter', label: 'Scatter Plot', icon: Zap, color: 'from-amber to-rose' },
  { value: 'pie', label: 'Pie Chart', icon: PieIcon, color: 'from-rose to-violet' },
  { value: 'table', label: 'Data Table', icon: Table2, color: 'from-primary to-violet' },
];

function defaultConfig(type: WidgetType): any {
  switch (type) {
    case 'kpi': return { title: 'KPI Overview', field: 'total', aggregation: 'sum', format: 'currency', decimals: 0 } as KpiConfig;
    case 'bar': return { title: 'Revenue by Product', xAxis: 'product', yAxis: 'total', color: '#3b82f6', showLabels: false } as ChartConfig;
    case 'line': return { title: 'Revenue Trend', xAxis: 'product', yAxis: 'total', color: '#8b5cf6', showLabels: false } as ChartConfig;
    case 'area': return { title: 'Sales Area Chart', xAxis: 'product', yAxis: 'total', color: '#06b6d4', showLabels: false } as ChartConfig;
    case 'scatter': return { title: 'Scatter Analysis', xAxis: 'product', yAxis: 'total', color: '#f59e0b', showLabels: false } as ChartConfig;
    case 'pie': return { title: 'Product Distribution', field: 'product', showLegend: true } as PieConfig;
    case 'table': return { title: 'Orders Table', columns: ['product', 'total', 'status'], sortField: 'total', sortDir: 'desc', pageSize: 5, headerColor: '#3b82f6', fontSize: 12 } as TableConfig;
  }
}

export function WidgetConfigDrawer({ widget, onSave, onClose, isNew }: WidgetConfigDrawerProps) {
  const [type, setType] = useState<WidgetType>(widget?.type || 'kpi');
  const [config, setConfig] = useState<any>(widget?.config || defaultConfig('kpi'));

  const handleTypeChange = (t: WidgetType) => {
    setType(t);
    setConfig(defaultConfig(t));
  };

  const handleSave = () => {
    onSave({ id: widget?.id || crypto.randomUUID(), type, config });
  };

  const update = (key: string, value: any) => setConfig((c: any) => ({ ...c, [key]: value }));

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed right-0 top-0 h-full w-[420px] bg-card/95 backdrop-blur-2xl border-l border-border/50 z-50 flex flex-col shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-border/30">
        <div>
          <h2 className="font-bold text-foreground text-lg">{isNew ? 'Add Widget' : 'Edit Widget'}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Configure your widget settings</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-secondary rounded-xl transition-colors"><X className="w-4 h-4" /></button>
      </div>

      <div className="flex-1 overflow-auto p-5 space-y-5">
        {/* Type selector (only on new) */}
        {isNew && (
          <div>
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Widget Type</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {WIDGET_TYPES.map(t => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.value}
                    onClick={() => handleTypeChange(t.value)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all text-left ${
                      type === t.value
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border/50 hover:border-border hover:bg-secondary/50'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${t.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-3.5 h-3.5 text-primary-foreground" />
                    </div>
                    <span className={`text-xs font-semibold ${type === t.value ? 'text-primary' : 'text-foreground'}`}>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Title */}
        <div>
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Title</Label>
          <Input value={config.title || ''} onChange={e => update('title', e.target.value)} className="mt-1.5 rounded-xl" placeholder="Enter widget title..." />
        </div>

        {/* KPI Fields */}
        {type === 'kpi' && (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Metric Field</Label>
              <Select value={config.field} onValueChange={v => update('field', v)}>
                <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>{ORDER_FIELDS.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Aggregation</Label>
                <Select value={config.aggregation} onValueChange={v => update('aggregation', v)}>
                  <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sum">Sum</SelectItem>
                    <SelectItem value="avg">Average</SelectItem>
                    <SelectItem value="count">Count</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Format</Label>
                <Select value={config.format} onValueChange={v => update('format', v)}>
                  <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="currency">Currency ($)</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Decimal Places</Label>
              <Input type="number" min={0} max={4} value={config.decimals} onChange={e => update('decimals', Number(e.target.value))} className="mt-1.5 rounded-xl" />
            </div>
          </div>
        )}

        {/* Chart Fields */}
        {(type === 'bar' || type === 'line' || type === 'area' || type === 'scatter') && (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">X-Axis (Group By)</Label>
              <Select value={config.xAxis} onValueChange={v => update('xAxis', v)}>
                <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>{GROUP_FIELDS.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Y-Axis (Value)</Label>
              <Select value={config.yAxis} onValueChange={v => update('yAxis', v)}>
                <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>{ORDER_FIELDS.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Chart Color</Label>
              <div className="flex gap-2 mt-1.5">
                <Input type="color" value={config.color} onChange={e => update('color', e.target.value)} className="h-10 w-14 p-1 rounded-xl" />
                <Input value={config.color} onChange={e => update('color', e.target.value)} className="flex-1 rounded-xl font-mono text-xs" placeholder="#3b82f6" />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
              <Label className="text-sm font-medium">Show Data Labels</Label>
              <Switch checked={config.showLabels} onCheckedChange={v => update('showLabels', v)} />
            </div>
          </div>
        )}

        {/* Pie Fields */}
        {type === 'pie' && (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Data Field</Label>
              <Select value={config.field} onValueChange={v => update('field', v)}>
                <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>{GROUP_FIELDS.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
              <Label className="text-sm font-medium">Show Legend</Label>
              <Switch checked={config.showLegend} onCheckedChange={v => update('showLegend', v)} />
            </div>
          </div>
        )}

        {/* Table Fields */}
        {type === 'table' && (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Visible Columns</Label>
              <div className="space-y-1 mt-2 p-3 rounded-xl bg-secondary/30 border border-border/30 max-h-48 overflow-auto">
                {TABLE_COLUMNS.map(col => (
                  <label key={col.value} className="flex items-center gap-2.5 text-sm py-1 px-1 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors">
                    <Checkbox
                      checked={config.columns?.includes(col.value)}
                      onCheckedChange={checked => {
                        const cols = checked
                          ? [...(config.columns || []), col.value]
                          : (config.columns || []).filter((c: string) => c !== col.value);
                        update('columns', cols);
                      }}
                    />
                    <span className="text-foreground">{col.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Page Size</Label>
                <Select value={String(config.pageSize)} onValueChange={v => update('pageSize', Number(v))}>
                  <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 rows</SelectItem>
                    <SelectItem value="10">10 rows</SelectItem>
                    <SelectItem value="15">15 rows</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Font Size</Label>
                <Input type="number" min={10} max={18} value={config.fontSize} onChange={e => update('fontSize', Number(e.target.value))} className="mt-1.5 rounded-xl" />
              </div>
            </div>
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Header Color</Label>
              <div className="flex gap-2 mt-1.5">
                <Input type="color" value={config.headerColor} onChange={e => update('headerColor', e.target.value)} className="h-10 w-14 p-1 rounded-xl" />
                <Input value={config.headerColor} onChange={e => update('headerColor', e.target.value)} className="flex-1 rounded-xl font-mono text-xs" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-5 border-t border-border/30 flex gap-2">
        <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl h-11">Cancel</Button>
        <Button onClick={handleSave} className="flex-1 rounded-xl h-11 shadow-lg glow-primary font-semibold">{isNew ? 'Add Widget' : 'Save Changes'}</Button>
      </div>
    </motion.div>
  );
}
