import { LayoutDashboard, ShoppingCart, Settings, Sparkles, TrendingUp, PieChart as PieChartIcon, Table2 } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const items = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Orders', url: '/orders', icon: ShoppingCart },
  { title: 'Configure', url: '/configure', icon: Settings },
];

export function AppSidebar() {
  const { state: sidebarState } = useSidebar();
  const collapsed = sidebarState === 'collapsed';
  const location = useLocation();
  const { state } = useApp();

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarContent className="pt-5 bg-sidebar">
        {/* Brand */}
        <div className={`px-4 mb-8 flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet flex items-center justify-center flex-shrink-0 shadow-lg glow-primary">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-extrabold text-sidebar-primary-foreground tracking-heading text-base">Quantro</h1>
              <p className="text-[10px] text-sidebar-foreground/60 uppercase tracking-widest">Analytics Studio</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.15em] text-sidebar-foreground/40 font-semibold mb-1">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <NavLink
                      to={item.url}
                      end
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                      className="transition-all duration-200 rounded-xl"
                    >
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Stats card */}
        {!collapsed && (
          <div className="mx-3 mt-auto mb-4 p-4 rounded-xl bg-sidebar-accent/60 border border-sidebar-border">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-sidebar-primary" />
              <span className="text-xs font-semibold text-sidebar-accent-foreground">Quick Stats</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-sidebar-foreground/60">Orders</span>
                <span className="font-semibold text-sidebar-accent-foreground tabular-nums">{state.orders.length}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-sidebar-foreground/60">Widgets</span>
                <span className="font-semibold text-sidebar-accent-foreground tabular-nums">{state.widgets.length}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-sidebar-foreground/60">Revenue</span>
                <span className="font-semibold text-emerald tabular-nums">
                  ${state.orders.reduce((s, o) => s + o.total, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
