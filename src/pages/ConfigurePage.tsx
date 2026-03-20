import { useApp } from '@/context/AppContext';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { WidgetConfigDrawer } from '@/components/widgets/WidgetConfigDrawer';
import { DashboardWidget, LayoutItem } from '@/types/dashboard';
import { Plus, Trash2, Settings, Copy, LayoutTemplate, RotateCcw, GripVertical, BarChart3, Activity, PieChartIcon, Table2, Hash, TrendingUp } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';

const TYPE_LABELS: Record<string, string> = {
  kpi: 'KPI Card', bar: 'Bar Chart', line: 'Line Chart', area: 'Area Chart',
  scatter: 'Scatter Plot', pie: 'Pie Chart', table: 'Data Table',
};

const TYPE_ICONS: Record<string, any> = {
  kpi: Hash, bar: BarChart3, line: Activity, area: TrendingUp,
  scatter: Activity, pie: PieChartIcon, table: Table2,
};

const TYPE_COLORS: Record<string, string> = {
  kpi: 'from-primary to-indigo',
  bar: 'from-emerald to-cyan',
  line: 'from-violet to-primary',
  area: 'from-cyan to-emerald',
  scatter: 'from-amber to-rose',
  pie: 'from-rose to-violet',
  table: 'from-primary to-violet',
};

function defaultConfig(type: string): any {
  switch (type) {
    case 'kpi': return { title: 'Untitled KPI', field: 'total', aggregation: 'sum', format: 'currency', decimals: 0 };
    case 'bar': case 'line': case 'area': case 'scatter': return { title: 'Untitled Chart', xAxis: 'product', yAxis: 'total', color: '#3b82f6', showLabels: false };
    case 'pie': return { title: 'Untitled Pie', field: 'product', showLegend: true };
    case 'table': return { title: 'Untitled Table', columns: ['product', 'total', 'status'], sortField: 'total', sortDir: 'desc', pageSize: 5, headerColor: '#3b82f6', fontSize: 12 };
    default: return {};
  }
}


export default function ConfigurePage() {
  const { state, dispatch } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [editWidget, setEditWidget] = useState<DashboardWidget | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const dragIndexRef = useRef<number | null>(null);

  const handleSaveWidget = (widget: DashboardWidget, isNew: boolean = showAdd) => {
    if (isNew) {
      const layoutItem: LayoutItem = {
        i: widget.id,
        x: (state.layout.length * 4) % 12,
        y: Infinity,
        w: widget.type === 'kpi' ? 3 : widget.type === 'table' ? 6 : 4,
        h: widget.type === 'kpi' ? 2 : widget.type === 'table' ? 4 : 3,
        minW: 2, minH: 2,
      };
      dispatch({ type: 'ADD_WIDGET', payload: { widget, layoutItem } });
      setShowAdd(false);
      toast.success('Widget added');
    } else {
      dispatch({ type: 'UPDATE_WIDGET', payload: widget });
      setEditWidget(null);
      toast.success('Widget updated');
    }
  };

  const duplicateWidget = (w: DashboardWidget) => {
    const newId = crypto.randomUUID();
    const newWidget = { ...w, id: newId, config: { ...w.config, title: (w.config as any).title + ' (Copy)' } };
    const layoutItem: LayoutItem = {
      i: newId, x: 0, y: Infinity,
      w: w.type === 'kpi' ? 3 : w.type === 'table' ? 6 : 4,
      h: w.type === 'kpi' ? 2 : w.type === 'table' ? 4 : 3,
      minW: 2, minH: 2,
    };
    dispatch({ type: 'ADD_WIDGET', payload: { widget: newWidget, layoutItem } });
    toast.success('Widget duplicated');
  };


  const resetDashboard = () => {
    state.widgets.forEach(w => dispatch({ type: 'REMOVE_WIDGET', payload: w.id }));
    toast.success('Dashboard cleared');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-heading text-foreground">Configure Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Add, edit, and manage your dashboard widgets</p>
        </div>
        <div className="flex gap-2">
          {state.widgets.length > 0 && (
            <Button onClick={resetDashboard} variant="outline" className="rounded-xl gap-2 text-sm text-destructive hover:text-destructive">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </Button>
          )}
          <Button onClick={() => setShowAdd(true)} className="rounded-xl gap-2 shadow-lg glow-primary text-sm">
            <Plus className="w-4 h-4" /> Add Widget
          </Button>
        </div>
      </motion.div>
      
      {/* Widget Library */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground mb-3 flex items-center gap-2">
          <Plus className="w-3.5 h-3.5" /> Widget Library
        </h3>
        <p className="text-[10px] text-muted-foreground mb-3 -mt-2">Drag a widget type to the active list below to add it</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { type: 'kpi', label: 'KPI Card', icon: Hash, color: 'from-primary to-indigo' },
            { type: 'bar', label: 'Bar Chart', icon: BarChart3, color: 'from-emerald to-cyan' },
            { type: 'line', label: 'Line Chart', icon: Activity, color: 'from-violet to-primary' },
            { type: 'area', label: 'Area Chart', icon: TrendingUp, color: 'from-cyan to-emerald' },
            { type: 'scatter', label: 'Scatter Plot', icon: Activity, color: 'from-amber to-rose' },
            { type: 'pie', label: 'Pie Chart', icon: PieChartIcon, color: 'from-rose to-violet' },
            { type: 'table', label: 'Data Table', icon: Table2, color: 'from-primary to-violet' },
          ].map((item, i) => (
            <motion.div
              key={item.type}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('widgetType', item.type);
                e.dataTransfer.effectAllowed = 'copy';
              }}
              onClick={() => {
                const widget: DashboardWidget = { id: crypto.randomUUID(), type: item.type as any, config: defaultConfig(item.type) };
                handleSaveWidget(widget, true);
                toast.success(`New ${item.label} added`);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass-card-hover p-3 flex items-center gap-3 cursor-grab md:cursor-pointer active:cursor-grabbing group border-dashed border-2 hover:border-primary/50"
            >
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center shadow-sm`}>
                <item.icon className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-xs text-foreground">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>


      <div 
        className="mb-3 p-4 border border-dashed border-border/50 rounded-2xl min-h-[300px]"
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
        }}
        onDrop={(e) => {
          const type = e.dataTransfer.getData('widgetType') as any;
          if (type) {
            const widget: DashboardWidget = {
              id: crypto.randomUUID(),
              type,
              config: defaultConfig(type)
            };
            handleSaveWidget(widget, true);
            toast.success(`New ${TYPE_LABELS[type]} added`);
          }
        }}
      >
        <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground mb-3">
          Active Widgets ({state.widgets.length})
        </h3>

        {state.widgets.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-12 text-center border-dashed border-2 bg-transparent shadow-none" >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <LayoutTemplate className="w-7 h-7 text-primary" />
            </div>
            <p className="text-muted-foreground mb-1 font-medium">No widgets configured yet</p>
            <p className="text-xs text-muted-foreground/60 mb-4">Drag a widget from the library above or add manually.</p>
            <Button onClick={() => setShowAdd(true)} variant="outline" className="rounded-xl gap-2">
              <Plus className="w-4 h-4" /> Add Your First Widget
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {state.widgets.map((w, i) => {
              const IconComp = TYPE_ICONS[w.type] || Hash;
              const isDragging = draggedIndex === i;
              const isOver = overIndex === i && draggedIndex !== null && draggedIndex !== i;
              return (
                <div
                  key={w.id}
                  draggable
                  onDragStart={(e) => {
                    dragIndexRef.current = i;
                    setDraggedIndex(i);
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', String(i));
                  }}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    if (dragIndexRef.current !== null && dragIndexRef.current !== i) {
                      setOverIndex(i);
                    }
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    if (dragIndexRef.current !== null && dragIndexRef.current !== i) {
                      setOverIndex(i);
                    }
                  }}
                  onDragLeave={(e) => {
                    // Only clear if leaving to outside the list item
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                      setOverIndex(null);
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const from = dragIndexRef.current;
                    const to = overIndex ?? i;
                    if (from !== null && from !== to) {
                      e.stopPropagation();
                      dispatch({ type: 'REORDER_WIDGETS', payload: { startIndex: from, endIndex: to } });
                    }
                    dragIndexRef.current = null;
                    setDraggedIndex(null);
                    setOverIndex(null);
                  }}
                  onDragEnd={() => {
                    dragIndexRef.current = null;
                    setDraggedIndex(null);
                    setOverIndex(null);
                  }}
                  className={`glass-card p-3 flex items-center justify-between group flex-wrap gap-2 transition-all select-none cursor-grab active:cursor-grabbing
                    ${isDragging ? 'opacity-30 scale-95 ring-2 ring-dashed ring-muted-foreground/50' : 'opacity-100 scale-100'}
                    ${isOver ? 'ring-2 ring-primary bg-primary/5 translate-y-0.5' : ''}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground/70 cursor-grab active:cursor-grabbing flex-shrink-0" />
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${TYPE_COLORS[w.type] || 'from-secondary to-muted'} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      <IconComp className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div>
                      <span className="font-semibold text-sm text-foreground whitespace-nowrap">{(w.config as any).title || w.type}</span>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mt-0.5">{TYPE_LABELS[w.type] || w.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-secondary/80" onClick={() => duplicateWidget(w)}>
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-secondary/80" onClick={() => setEditWidget(w)}>
                      <Settings className="w-4 h-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive" onClick={() => dispatch({ type: 'REMOVE_WIDGET', payload: w.id })}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {(showAdd || editWidget) && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
              onClick={() => { setShowAdd(false); setEditWidget(null); }}
            />
            <WidgetConfigDrawer
              widget={editWidget || undefined}
              isNew={showAdd}
              onSave={handleSaveWidget}
              onClose={() => { setShowAdd(false); setEditWidget(null); }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
