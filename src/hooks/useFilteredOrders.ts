import { useMemo } from 'react';
import { useApp } from '@/context/AppContext';

export function useFilteredOrders() {
  const { state } = useApp();
  return useMemo(() => {
    const { orders, dateRange } = state;
    if (!dateRange.from && !dateRange.to) return orders;
    return orders.filter(o => {
      const d = new Date(o.createdAt);
      if (dateRange.from && d < new Date(dateRange.from)) return false;
      if (dateRange.to && d > new Date(dateRange.to + 'T23:59:59')) return false;
      return true;
    });
  }, [state.orders, state.dateRange]);
}

export function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((o, k) => o?.[k], obj);
}

export function aggregate(orders: any[], field: string, type: 'sum' | 'avg' | 'count'): number {
  if (type === 'count') return orders.length;
  const vals = orders.map(o => Number(getNestedValue(o, field)) || 0);
  const sum = vals.reduce((a, b) => a + b, 0);
  return type === 'avg' ? (vals.length ? sum / vals.length : 0) : sum;
}
