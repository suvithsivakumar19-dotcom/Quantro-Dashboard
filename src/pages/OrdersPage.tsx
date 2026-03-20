import { useApp } from '@/context/AppContext';
import { useState, useMemo } from 'react';
import { Order, PRODUCTS, COUNTRIES, USERS } from '@/types/dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, ShoppingCart, Search, Download, Filter, ChevronLeft, ChevronRight, X, ArrowUpDown, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const emptyOrder = (): Partial<Order> => ({
  customer: { firstName: '', lastName: '', email: '', phone: '', address: '', city: '', state: '', postalCode: '', country: 'US' },
  product: PRODUCTS[0],
  quantity: 1,
  unitPrice: 0,
  total: 0,
  status: 'Pending',
  createdBy: USERS[0],
});

const PAGE_SIZES = [5, 10, 15, 25];

export default function OrdersPage() {
  const { state, dispatch } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Order | null>(null);
  const [form, setForm] = useState<any>(emptyOrder());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [productFilter, setProductFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filtered & sorted orders
  const filteredOrders = useMemo(() => {
    let result = [...state.orders];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(o =>
        o.customer.firstName.toLowerCase().includes(q) ||
        o.customer.lastName.toLowerCase().includes(q) ||
        o.customer.email.toLowerCase().includes(q) ||
        o.product.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') result = result.filter(o => o.status === statusFilter);
    if (productFilter !== 'all') result = result.filter(o => o.product === productFilter);
    result.sort((a, b) => {
      let va: any, vb: any;
      if (sortField === 'name') { va = a.customer.firstName; vb = b.customer.firstName; }
      else if (sortField === 'total') { va = a.total; vb = b.total; }
      else if (sortField === 'quantity') { va = a.quantity; vb = b.quantity; }
      else { va = a.createdAt; vb = b.createdAt; }
      const cmp = typeof va === 'number' ? va - vb : String(va).localeCompare(String(vb));
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [state.orders, search, statusFilter, productFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const pageOrders = filteredOrders.slice(page * pageSize, (page + 1) * pageSize);

  const totalRevenue = state.orders.reduce((s, o) => s + o.total, 0);
  const completedCount = state.orders.filter(o => o.status === 'Completed').length;
  const pendingCount = state.orders.filter(o => o.status === 'Pending').length;

  const openCreate = () => { setEditing(null); setForm(emptyOrder()); setErrors({}); setModalOpen(true); };
  const openEdit = (o: Order) => { setEditing(o); setForm(JSON.parse(JSON.stringify(o))); setErrors({}); setModalOpen(true); };

  const updateCustomer = (key: string, value: string) => setForm((f: any) => ({ ...f, customer: { ...f.customer, [key]: value } }));
  const updateField = (key: string, value: any) => {
    setForm((f: any) => {
      const updated = { ...f, [key]: value };
      if (key === 'quantity' || key === 'unitPrice') {
        updated.total = (Number(updated.quantity) || 0) * (Number(updated.unitPrice) || 0);
      }
      return updated;
    });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.customer.firstName.trim()) e.firstName = 'Please fill the field';
    if (!form.customer.lastName.trim()) e.lastName = 'Please fill the field';
    if (!form.customer.email.trim()) e.email = 'Please fill the field';
    if (!form.customer.phone.trim()) e.phone = 'Please fill the field';
    if (!form.customer.address.trim()) e.address = 'Please fill the field';
    if (!form.customer.city.trim()) e.city = 'Please fill the field';
    if (!form.customer.state.trim()) e.state = 'Please fill the field';
    if (!form.customer.postalCode.trim()) e.postalCode = 'Please fill the field';
    if (!form.quantity || form.quantity < 1) e.quantity = 'Min quantity is 1';
    if (!form.unitPrice || form.unitPrice <= 0) e.unitPrice = 'Price must be > 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (editing) {
      dispatch({ type: 'UPDATE_ORDER', payload: { ...form, id: editing.id, createdAt: editing.createdAt } as Order });
      toast.success('Order updated successfully');
    } else {
      dispatch({ type: 'ADD_ORDER', payload: { ...form, id: crypto.randomUUID(), createdAt: new Date().toISOString() } as Order });
      toast.success('Order created successfully');
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_ORDER', payload: id });
    setDeleteConfirm(null);
    setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
    toast.success('Order deleted');
  };

  const handleBulkDelete = () => {
    selectedIds.forEach(id => dispatch({ type: 'DELETE_ORDER', payload: id }));
    toast.success(`${selectedIds.size} orders deleted`);
    setSelectedIds(new Set());
  };

  const exportCSV = () => {
    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Product', 'Quantity', 'Unit Price', 'Total', 'Status', 'Date'];
    const rows = filteredOrders.map(o => [
      o.customer.firstName, o.customer.lastName, o.customer.email, o.customer.phone,
      o.product, o.quantity, o.unitPrice, o.total, o.status, new Date(o.createdAt).toLocaleDateString()
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'orders.csv'; a.click();
    URL.revokeObjectURL(url);
    toast.success('Orders exported as CSV');
  };

  const toggleAll = () => {
    if (selectedIds.size === pageOrders.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(pageOrders.map(o => o.id)));
  };

  const toggleOne = (id: string) => {
    setSelectedIds(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const toggleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const FieldError = ({ field }: { field: string }) => errors[field] ? <p className="text-xs text-destructive mt-0.5">{errors[field]}</p> : null;

  const statusIcon = (s: string) => {
    if (s === 'Completed') return <CheckCircle2 className="w-3 h-3" />;
    if (s === 'Pending') return <Clock className="w-3 h-3" />;
    return <Loader2 className="w-3 h-3" />;
  };

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-heading text-foreground">Customer Orders</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            <span className="tabular-nums font-semibold text-foreground">{state.orders.length}</span> total orders
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportCSV} variant="outline" className="rounded-xl gap-2 text-sm">
            <Download className="w-3.5 h-3.5" /> Export
          </Button>
          <Button onClick={openCreate} className="rounded-xl gap-2 shadow-lg glow-primary text-sm">
            <Plus className="w-4 h-4" /> Create Order
          </Button>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total Orders', value: state.orders.length, color: 'text-primary' },
          { label: 'Revenue', value: `$${totalRevenue.toLocaleString()}`, color: 'text-emerald' },
          { label: 'Completed', value: completedCount, color: 'text-emerald' },
          { label: 'Pending', value: pendingCount, color: 'text-amber' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-4">
            <p className="text-xs text-muted-foreground font-medium mb-1">{stat.label}</p>
            <p className={`text-xl font-extrabold tabular-nums ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Filters bar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="glass-card p-3 mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, product..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            className="pl-9 h-9 rounded-xl text-sm"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
        <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(0); }}>
          <SelectTrigger className="w-[140px] h-9 rounded-xl text-sm">
            <Filter className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={productFilter} onValueChange={v => { setProductFilter(v); setPage(0); }}>
          <SelectTrigger className="w-[180px] h-9 rounded-xl text-sm">
            <SelectValue placeholder="Product" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
            {PRODUCTS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
        {selectedIds.size > 0 && (
          <Button onClick={handleBulkDelete} variant="destructive" size="sm" className="rounded-xl gap-1 text-xs">
            <Trash2 className="w-3 h-3" /> Delete {selectedIds.size}
          </Button>
        )}
      </motion.div>

      {/* Table */}
      {filteredOrders.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-12 text-center">
          <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground mb-1 font-medium">
            {state.orders.length === 0 ? 'No orders yet' : 'No orders match your filters'}
          </p>
          <p className="text-xs text-muted-foreground/60 mb-4">
            {state.orders.length === 0 ? 'Create your first order to get started.' : 'Try adjusting your search or filter criteria.'}
          </p>
          {state.orders.length === 0 && (
            <Button onClick={openCreate} variant="outline" className="rounded-xl gap-2"><Plus className="w-4 h-4" /> Create Order</Button>
          )}
        </motion.div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-foreground/[0.03] border-b border-border/50">
                  <th className="px-3 py-3 text-left w-10">
                    <input type="checkbox" checked={selectedIds.size === pageOrders.length && pageOrders.length > 0} onChange={toggleAll} className="rounded border-border" />
                  </th>
                  {[
                    { key: 'name', label: 'Customer' },
                    { key: 'product', label: 'Product' },
                    { key: 'quantity', label: 'Qty' },
                    { key: 'total', label: 'Total' },
                    { key: 'status', label: 'Status' },
                    { key: 'createdAt', label: 'Date' },
                  ].map(col => (
                    <th
                      key={col.key}
                      className="px-3 py-3 text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
                      onClick={() => toggleSort(col.key)}
                    >
                      <span className="flex items-center gap-1">
                        {col.label}
                        <ArrowUpDown className={`w-3 h-3 ${sortField === col.key ? 'text-primary' : 'opacity-30'}`} />
                      </span>
                    </th>
                  ))}
                  <th className="px-3 py-3 text-right font-semibold text-xs uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {pageOrders.map((o, i) => (
                    <motion.tr
                      key={o.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className={`border-b border-border/20 hover:bg-primary/[0.02] transition-colors ${selectedIds.has(o.id) ? 'bg-primary/[0.04]' : ''}`}
                    >
                      <td className="px-3 py-2.5">
                        <input type="checkbox" checked={selectedIds.has(o.id)} onChange={() => toggleOne(o.id)} className="rounded border-border" />
                      </td>
                      <td className="px-3 py-2.5">
                        <div>
                          <span className="font-medium text-foreground">{o.customer.firstName} {o.customer.lastName}</span>
                          <p className="text-xs text-muted-foreground">{o.customer.email}</p>
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-xs font-medium">{o.product}</span>
                      </td>
                      <td className="px-3 py-2.5 tabular-nums">{o.quantity}</td>
                      <td className="px-3 py-2.5 tabular-nums font-semibold">${o.total.toLocaleString()}</td>
                      <td className="px-3 py-2.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                          o.status === 'Completed' ? 'bg-emerald/10 text-emerald border border-emerald/20' :
                          o.status === 'Pending' ? 'bg-amber/10 text-amber border border-amber/20' :
                          'bg-primary/10 text-primary border border-primary/20'
                        }`}>
                          {statusIcon(o.status)}
                          {o.status}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td className="px-3 py-2.5 text-right">
                        <div className="flex justify-end gap-0.5">
                          <Button size="sm" variant="ghost" onClick={() => openEdit(o)} className="rounded-lg h-7 w-7 p-0 hover:bg-primary/10 hover:text-primary">
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setDeleteConfirm(o.id)} className="rounded-lg h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border/30">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, filteredOrders.length)} of {filteredOrders.length}</span>
              <Select value={String(pageSize)} onValueChange={v => { setPageSize(Number(v)); setPage(0); }}>
                <SelectTrigger className="w-[70px] h-7 rounded-lg text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PAGE_SIZES.map(s => <SelectItem key={s} value={String(s)}>{s}/page</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-1">
              <Button size="sm" variant="ghost" onClick={() => setPage(0)} disabled={page === 0} className="h-7 px-2 text-xs rounded-lg">First</Button>
              <Button size="sm" variant="ghost" onClick={() => setPage(p => p - 1)} disabled={page === 0} className="h-7 w-7 p-0 rounded-lg">
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>
              <span className="text-xs font-medium tabular-nums px-2">{page + 1} / {totalPages || 1}</span>
              <Button size="sm" variant="ghost" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1} className="h-7 w-7 p-0 rounded-lg">
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1} className="h-7 px-2 text-xs rounded-lg">Last</Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="rounded-2xl max-w-sm">
          <DialogHeader><DialogTitle className="text-lg">Delete Order?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This action cannot be undone. The order will be permanently removed.</p>
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="rounded-xl">Cancel</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm)} className="rounded-xl">Delete Order</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Order Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg">{editing ? 'Edit Order' : 'Create New Order'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <div>
              <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-[0.1em] mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">1</span>
                Customer Info
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">First Name *</Label><Input value={form.customer.firstName} onChange={e => updateCustomer('firstName', e.target.value)} className="rounded-xl" /><FieldError field="firstName" /></div>
                <div><Label className="text-xs">Last Name *</Label><Input value={form.customer.lastName} onChange={e => updateCustomer('lastName', e.target.value)} className="rounded-xl" /><FieldError field="lastName" /></div>
                <div><Label className="text-xs">Email *</Label><Input type="email" value={form.customer.email} onChange={e => updateCustomer('email', e.target.value)} className="rounded-xl" /><FieldError field="email" /></div>
                <div><Label className="text-xs">Phone *</Label><Input value={form.customer.phone} onChange={e => updateCustomer('phone', e.target.value)} className="rounded-xl" /><FieldError field="phone" /></div>
                <div className="col-span-2"><Label className="text-xs">Address *</Label><Input value={form.customer.address} onChange={e => updateCustomer('address', e.target.value)} className="rounded-xl" /><FieldError field="address" /></div>
                <div><Label className="text-xs">City *</Label><Input value={form.customer.city} onChange={e => updateCustomer('city', e.target.value)} className="rounded-xl" /><FieldError field="city" /></div>
                <div><Label className="text-xs">State *</Label><Input value={form.customer.state} onChange={e => updateCustomer('state', e.target.value)} className="rounded-xl" /><FieldError field="state" /></div>
                <div><Label className="text-xs">Postal Code *</Label><Input value={form.customer.postalCode} onChange={e => updateCustomer('postalCode', e.target.value)} className="rounded-xl" /><FieldError field="postalCode" /></div>
                <div>
                  <Label className="text-xs">Country</Label>
                  <Select value={form.customer.country} onValueChange={v => updateCustomer('country', v)}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>{COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-[0.1em] mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">2</span>
                Order Info
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Product</Label>
                  <Select value={form.product} onValueChange={v => updateField('product', v)}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>{PRODUCTS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label className="text-xs">Quantity *</Label><Input type="number" min={1} value={form.quantity} onChange={e => updateField('quantity', Number(e.target.value))} className="rounded-xl" /><FieldError field="quantity" /></div>
                <div><Label className="text-xs">Unit Price ($) *</Label><Input type="number" min={0} step={0.01} value={form.unitPrice} onChange={e => updateField('unitPrice', Number(e.target.value))} className="rounded-xl" /><FieldError field="unitPrice" /></div>
                <div>
                  <Label className="text-xs">Total (auto-calculated)</Label>
                  <div className="h-10 rounded-xl border border-border bg-secondary/30 flex items-center px-3 text-sm font-semibold tabular-nums text-emerald">
                    ${(form.total || 0).toLocaleString()}
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Status</Label>
                  <Select value={form.status} onValueChange={v => updateField('status', v)}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Created By</Label>
                  <Select value={form.createdBy} onValueChange={v => updateField('createdBy', v)}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>{USERS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-5 pt-4 border-t border-border/30">
            <Button variant="outline" onClick={() => setModalOpen(false)} className="rounded-xl px-6">Cancel</Button>
            <Button onClick={handleSave} className="rounded-xl px-6 shadow-lg glow-primary">{editing ? 'Update Order' : 'Create Order'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
