import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Order, DashboardWidget, LayoutItem } from '@/types/dashboard';
import { generateSampleOrders } from '@/lib/sampleData';

interface AppState {
  orders: Order[];
  widgets: DashboardWidget[];
  layout: LayoutItem[];
  dateRange: { from: string | null; to: string | null };
  userProfile: { name: string; email: string; role: string; company: string };
}

type Action =
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER'; payload: Order }
  | { type: 'DELETE_ORDER'; payload: string }
  | { type: 'SET_WIDGETS'; payload: DashboardWidget[] }
  | { type: 'ADD_WIDGET'; payload: { widget: DashboardWidget; layoutItem: LayoutItem } }
  | { type: 'UPDATE_WIDGET'; payload: DashboardWidget }
  | { type: 'REMOVE_WIDGET'; payload: string }
  | { type: 'SET_LAYOUT'; payload: LayoutItem[] }
  | { type: 'SET_DATE_RANGE'; payload: { from: string | null; to: string | null } }
  | { type: 'UPDATE_PROFILE'; payload: { name: string; email: string; role: string; company: string } }
  | { type: 'REORDER_WIDGETS'; payload: { startIndex: number; endIndex: number } };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_ORDERS': return { ...state, orders: action.payload };
    case 'ADD_ORDER': return { ...state, orders: [...state.orders, action.payload] };
    case 'UPDATE_ORDER': return { ...state, orders: state.orders.map(o => o.id === action.payload.id ? action.payload : o) };
    case 'DELETE_ORDER': return { ...state, orders: state.orders.filter(o => o.id !== action.payload) };
    case 'SET_WIDGETS': return { ...state, widgets: action.payload };
    case 'ADD_WIDGET': return { ...state, widgets: [...state.widgets, action.payload.widget], layout: [...state.layout, action.payload.layoutItem] };
    case 'UPDATE_WIDGET': return { ...state, widgets: state.widgets.map(w => w.id === action.payload.id ? action.payload : w) };
    case 'REMOVE_WIDGET': return { ...state, widgets: state.widgets.filter(w => w.id !== action.payload), layout: state.layout.filter(l => l.i !== action.payload) };
    case 'SET_LAYOUT': return { ...state, layout: action.payload };
    case 'SET_DATE_RANGE': return { ...state, dateRange: action.payload };
    case 'UPDATE_PROFILE': return { ...state, userProfile: action.payload };
    case 'REORDER_WIDGETS': {
      const newWidgets = Array.from(state.widgets);
      const [removed] = newWidgets.splice(action.payload.startIndex, 1);
      newWidgets.splice(action.payload.endIndex, 0, removed);

      const newLayout = state.layout.map(l => {
        const newIndex = newWidgets.findIndex(w => w.id === l.i);
        // Assuming 'y' property in layout corresponds to the order/index
        // and 'x' might need to be reset or kept as is depending on desired layout behavior
        return { ...l, y: newIndex, x: 0 };
      });

      return { ...state, widgets: newWidgets, layout: newLayout };
    }
    default: return state;
  }
}

const AppContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | null>(null);

function loadState(): AppState {
  try {
    const orders = JSON.parse(localStorage.getItem('orders') || 'null');
    const widgets = JSON.parse(localStorage.getItem('widgets') || '[]');
    const layout = JSON.parse(localStorage.getItem('layout') || '[]');
    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{"name":"Admin User","email":"admin@insightcanvas.com","role":"Administrator","company":"QuantroInc."}');
    return {
      orders: orders || generateSampleOrders(),
      widgets,
      layout,
      dateRange: { from: null, to: null },
      userProfile,
    };
  } catch {
    return {
      orders: generateSampleOrders(),
      widgets: [],
      layout: [],
      dateRange: { from: null, to: null },
      userProfile: { name: 'Admin User', email: 'admin@insightcanvas.com', role: 'Administrator', company: 'QuantroInc.' }
    };
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(state.orders));
  }, [state.orders]);

  useEffect(() => {
    localStorage.setItem('widgets', JSON.stringify(state.widgets));
    localStorage.setItem('layout', JSON.stringify(state.layout));
  }, [state.widgets, state.layout]);

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(state.userProfile));
  }, [state.userProfile]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
