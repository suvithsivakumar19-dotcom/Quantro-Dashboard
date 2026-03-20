export interface Order {
  id: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  product: string;
  quantity: number;
  unitPrice: number;
  total: number;
  status: 'Pending' | 'In Progress' | 'Completed';
  createdBy: string;
  createdAt: string;
}

export type WidgetType = 'kpi' | 'bar' | 'line' | 'area' | 'scatter' | 'pie' | 'table';
export type AggregationType = 'sum' | 'avg' | 'count';
export type FormatType = 'number' | 'currency';

export interface KpiConfig {
  title: string;
  field: string;
  aggregation: AggregationType;
  format: FormatType;
  decimals: number;
}

export interface ChartConfig {
  title: string;
  xAxis: string;
  yAxis: string;
  color: string;
  showLabels: boolean;
}

export interface PieConfig {
  title: string;
  field: string;
  showLegend: boolean;
}

export interface TableConfig {
  title: string;
  columns: string[];
  sortField: string;
  sortDir: 'asc' | 'desc';
  pageSize: number;
  headerColor: string;
  fontSize: number;
}

export type WidgetConfig = KpiConfig | ChartConfig | PieConfig | TableConfig;

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  config: WidgetConfig;
}

export interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
}

export interface DashboardState {
  widgets: DashboardWidget[];
  layout: LayoutItem[];
}

export const PRODUCTS = [
  'Fiber Internet 300 Mbps', 'Fiber Internet 1 Gbps', 'Business Internet 500 Mbps',
  '5G Unlimited Mobile Plan', 'VoIP Corporate Package',
];
export const COUNTRIES = ['US', 'Canada', 'Australia', 'Singapore', 'Hong Kong', 'India'];
export const USERS = ['Admin'];

export const ORDER_FIELDS = [
  { value: 'total', label: 'Total' },
  { value: 'quantity', label: 'Quantity' },
  { value: 'unitPrice', label: 'Unit Price' },
];

export const GROUP_FIELDS = [
  { value: 'product', label: 'Product' },
  { value: 'status', label: 'Status' },
  { value: 'customer.country', label: 'Country' },
  { value: 'createdBy', label: 'Created By' },
];

export const TABLE_COLUMNS = [
  { value: 'customer.firstName', label: 'First Name' },
  { value: 'customer.lastName', label: 'Last Name' },
  { value: 'customer.email', label: 'Email' },
  { value: 'product', label: 'Product' },
  { value: 'quantity', label: 'Quantity' },
  { value: 'unitPrice', label: 'Unit Price' },
  { value: 'total', label: 'Total' },
  { value: 'status', label: 'Status' },
  { value: 'createdAt', label: 'Date' },
];
