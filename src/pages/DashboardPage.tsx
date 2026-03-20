import { useApp } from '@/context/AppContext';
import { useCallback, useState } from 'react';
import 'react-grid-layout/css/styles.css';
import { WidgetWrapper } from '@/components/widgets/WidgetWrapper';
import { KpiWidget } from '@/components/widgets/KpiWidget';
import { ChartWidget } from '@/components/widgets/ChartWidget';
import { PieWidget } from '@/components/widgets/PieWidget';
import { TableWidget } from '@/components/widgets/TableWidget';
import { WidgetConfigDrawer } from '@/components/widgets/WidgetConfigDrawer';
import { DashboardWidget, LayoutItem, KpiConfig, ChartConfig, PieConfig, TableConfig } from '@/types/dashboard';
import { Plus, LayoutDashboard, Sparkles, ArrowRight, BarChart3, PieChart as PieChartIcon, Table2, Hash, TrendingUp, Activity, Zap, DollarSign, ShoppingCart, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import heroBg from '@/assets/hero-bg.jpg';

export default function DashboardPage() {
  const { state, dispatch } = useApp();
  const [editWidget, setEditWidget] = useState<DashboardWidget | null>(null);
  const navigate = useNavigate();

  const handleLayoutChange = useCallback((layout: any[]) => {
    const mapped: LayoutItem[] = layout.map(l => ({ i: l.i, x: l.x, y: l.y, w: l.w, h: l.h }));
    dispatch({ type: 'SET_LAYOUT', payload: mapped });
  }, [dispatch]);

  const handleDeleteWidget = (id: string) => {
    dispatch({ type: 'REMOVE_WIDGET', payload: id });
  };

  const handleSaveWidget = (widget: DashboardWidget) => {
    dispatch({ type: 'UPDATE_WIDGET', payload: widget });
    setEditWidget(null);
  };

  const renderWidget = (w: DashboardWidget) => {
    switch (w.type) {
      case 'kpi': return <KpiWidget config={w.config as KpiConfig} />;
      case 'bar': case 'line': case 'area': case 'scatter': return <ChartWidget config={w.config as ChartConfig} type={w.type} />;
      case 'pie': return <PieWidget config={w.config as PieConfig} />;
      case 'table': return <TableWidget config={w.config as TableConfig} />;
    }
  };

  // Quick stats for the dashboard header
  const totalRevenue = state.orders.reduce((s, o) => s + o.total, 0);
  const completedOrders = state.orders.filter(o => o.status === 'Completed').length;

  if (state.widgets.length === 0) {
    return (
      <div className="flex flex-col">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="relative rounded-3xl overflow-hidden mb-6"
          style={{ minHeight: 300 }}
        >
          <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/75 to-foreground/30" />
          <div className="relative z-10 p-8 md:p-12 flex flex-col justify-center h-full">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/20 text-primary-foreground text-xs font-bold mb-5 backdrop-blur-sm border border-primary/30">
                <Sparkles className="w-3.5 h-3.5" /> Welcome to Quantro
              </span>
              <h1 className="text-3xl md:text-4xl font-black tracking-heading text-primary-foreground mb-3 max-w-xl leading-[1.1]">
                Build Your Custom<br />Analytics Dashboard
              </h1>
              <p className="text-primary-foreground/60 max-w-md text-sm leading-relaxed mb-7">
              </p>
              <div className="flex gap-3 flex-wrap">
                <Button
                  onClick={() => navigate('/configure')}
                  size="lg"
                  className="rounded-xl gap-2 bg-primary hover:bg-primary/90 shadow-xl glow-primary text-sm font-bold px-7 h-12"
                >
                  <Plus className="w-4 h-4" /> Go to Configuration
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Preview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
        >
          {[
            { icon: ShoppingCart, label: 'Orders', value: state.orders.length, color: 'text-primary' },
            { icon: DollarSign, label: 'Revenue', value: `$${totalRevenue.toLocaleString()}`, color: 'text-emerald' },
            { icon: TrendingUp, label: 'Completed', value: completedOrders, color: 'text-emerald' },
            { icon: Users, label: 'Customers', value: new Set(state.orders.map(o => o.customer.email)).size, color: 'text-violet' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.05 }}
              className="glass-card p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
              </div>
              <p className={`text-xl font-extrabold tabular-nums ${stat.color}`}>{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h2 className="text-2xl font-extrabold tracking-heading text-foreground">Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            <span className="tabular-nums font-semibold text-foreground">{state.widgets.length}</span> widgets ·{' '}
            <span className="tabular-nums font-semibold text-foreground">{state.orders.length}</span> orders ·{' '}
            <span className="tabular-nums font-semibold text-emerald">${totalRevenue.toLocaleString()}</span> revenue
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/configure')} variant="outline" className="rounded-xl gap-2 text-sm">
            <LayoutDashboard className="w-3.5 h-3.5" /> Configure
          </Button>
          <Button onClick={() => navigate('/configure')} className="rounded-xl gap-2 shadow-lg glow-primary text-sm">
            <Plus className="w-4 h-4" /> Add Widget
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {[...state.widgets]
          .sort((a, b) => {
            const lA = state.layout.find(l => l.i === a.id);
            const lB = state.layout.find(l => l.i === b.id);
            if (!lA || !lB) return 0;
            if (lA.y !== lB.y) return lA.y - lB.y;
            return lA.x - lB.x;
          })
          .map(w => {
            const getMinHeight = (type: string) => {
              if (type === 'kpi') return 'min-h-[160px]';
              if (type === 'table') return 'min-h-[400px]';
              return 'min-h-[350px]';
            };

            const WIDGET_TITLES: Record<string, string> = {
              kpi: 'KPI Overview',
              bar: 'Revenue by Product',
              line: 'Revenue Trend',
              area: 'Sales Area Chart',
              scatter: 'Scatter Analysis',
              pie: 'Product Distribution',
              table: 'Orders Table',
            };

            const rawTitle = (w.config as any).title || '';
            const displayTitle = rawTitle.startsWith('Untitled') || !rawTitle
              ? (WIDGET_TITLES[w.type] || w.type)
              : rawTitle;

            return (
              <div key={w.id} className={`w-full ${getMinHeight(w.type)}`}>
                <WidgetWrapper
                  title={displayTitle}
                  onEdit={() => setEditWidget(w)}
                  onDelete={() => handleDeleteWidget(w.id)}
                >
                  {renderWidget(w)}
                </WidgetWrapper>
              </div>
            );
          })}
      </div>

      <AnimatePresence>
        {editWidget && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
              onClick={() => { setEditWidget(null); }}
            />
            <WidgetConfigDrawer
              widget={editWidget || undefined}
              isNew={false}
              onSave={handleSaveWidget}
              onClose={() => { setEditWidget(null); }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
