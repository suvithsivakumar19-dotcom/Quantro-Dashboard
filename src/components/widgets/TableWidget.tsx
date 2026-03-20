import { useFilteredOrders, getNestedValue } from '@/hooks/useFilteredOrders';
import { TableConfig } from '@/types/dashboard';
import { useMemo, useState } from 'react';
import { TABLE_COLUMNS } from '@/types/dashboard';
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Search, X } from 'lucide-react';

export function TableWidget({ config }: { config: TableConfig }) {
  const orders = useFilteredOrders();
  const [page, setPage] = useState(0);
  const [sortField, setSortField] = useState(config.sortField);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>(config.sortDir);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return orders;
    const q = search.toLowerCase();
    return orders.filter(o =>
      JSON.stringify(o).toLowerCase().includes(q)
    );
  }, [orders, search]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sortField) {
      arr.sort((a, b) => {
        const va = getNestedValue(a, sortField);
        const vb = getNestedValue(b, sortField);
        const cmp = typeof va === 'number' ? va - (vb as number) : String(va).localeCompare(String(vb));
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return arr;
  }, [filtered, sortField, sortDir]);

  const pageSize = config.pageSize || 5;
  const totalPages = Math.ceil(sorted.length / pageSize);
  const pageData = sorted.slice(page * pageSize, (page + 1) * pageSize);
  const cols = config.columns.length ? config.columns : ['product', 'total', 'status'];

  const toggleSort = (f: string) => {
    if (sortField === f) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(f); setSortDir('asc'); }
  };

  const getLabel = (v: string) => TABLE_COLUMNS.find(c => c.value === v)?.label || v;

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ArrowUpDown className="w-2.5 h-2.5 opacity-30" />;
    return sortDir === 'asc' ? <ArrowUp className="w-2.5 h-2.5 text-primary" /> : <ArrowDown className="w-2.5 h-2.5 text-primary" />;
  };

  return (
    <div className="flex flex-col h-full text-xs" onMouseDown={e => e.stopPropagation()}>
      {/* Search */}
      <div className="relative mb-2">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0); }}
          placeholder="Filter rows..."
          className="w-full pl-7 pr-7 py-1.5 rounded-lg bg-secondary/50 border border-border/30 text-xs focus:outline-none focus:ring-1 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground/60"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2">
            <X className="w-3 h-3 text-muted-foreground" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-auto rounded-lg border border-border/30">
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: config.headerColor || 'hsl(221, 83%, 53%)', color: 'white' }}>
              {cols.map(col => (
                <th
                  key={col}
                  className="px-2 py-1.5 text-left font-semibold cursor-pointer select-none whitespace-nowrap"
                  style={{ fontSize: config.fontSize || 12 }}
                  onClick={() => toggleSort(col)}
                >
                  <span className="flex items-center gap-1">
                    {getLabel(col)}
                    <SortIcon field={col} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr><td colSpan={cols.length} className="px-2 py-4 text-center text-muted-foreground">No data found</td></tr>
            ) : pageData.map(order => (
              <tr key={order.id} className="border-b border-border/20 hover:bg-primary/[0.02] transition-colors">
                {cols.map(col => (
                  <td key={col} className="px-2 py-1.5 whitespace-nowrap" style={{ fontSize: config.fontSize || 12 }}>
                    {col === 'total' || col === 'unitPrice'
                      ? `$${Number(getNestedValue(order, col)).toLocaleString()}`
                      : col === 'createdAt'
                        ? new Date(getNestedValue(order, col)).toLocaleDateString()
                        : col === 'status'
                          ? <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-semibold ${
                              getNestedValue(order, col) === 'Completed' ? 'bg-emerald/10 text-emerald' :
                              getNestedValue(order, col) === 'Pending' ? 'bg-amber/10 text-amber' : 'bg-primary/10 text-primary'
                            }`}>{String(getNestedValue(order, col))}</span>
                          : String(getNestedValue(order, col) ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between pt-2">
        <span className="text-muted-foreground">{sorted.length} records</span>
        <div className="flex items-center gap-1">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="p-1 disabled:opacity-30 hover:bg-secondary rounded transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="tabular-nums font-medium px-1">{page + 1}/{totalPages || 1}</span>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="p-1 disabled:opacity-30 hover:bg-secondary rounded transition-colors">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
