import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  SidebarProvider,
  SidebarTrigger,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';
import { 
  BarChart3, 
  Package, 
  AlertTriangle, 
  Users, 
  TrendingUp, 
  Settings, 
  LogOut,
  User
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useInventory } from '@/contexts/InventoryContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NotificationPanel } from '@/components/NotificationPanel';

const navigation = [
  { name: 'Analytics', href: '/dashboard', icon: BarChart3 },
  { name: 'Components', href: '/components', icon: Package },
  { name: 'Risk Alerts', href: '/alerts', icon: AlertTriangle },
  { name: 'Suppliers', href: '/suppliers', icon: Users },
  { name: 'Forecasting', href: '/forecasting', icon: TrendingUp },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const AppSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { riskAlerts } = useInventory();
  const { state } = useSidebar();
  const location = useLocation();

  const isCollapsed = state === "collapsed";
  const unreadAlerts = riskAlerts.filter(alert => !alert.resolved).length;

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname === path;
  };

  const getNavClasses = (path: string) => {
    const base = "flex items-center gap-3 transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg";
    return isActive(path) 
      ? `${base} bg-sidebar-primary text-sidebar-primary-foreground shadow-sm font-medium`
      : `${base} text-sidebar-foreground`;
  };

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"}>
      <SidebarContent className="bg-sidebar border-r border-sidebar-border">
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-sidebar-primary-foreground" />
              </div>
              <div>
                <h2 className="font-semibold text-sidebar-foreground">AI Inventory</h2>
                <p className="text-xs text-sidebar-foreground/60">Management System</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-sidebar-primary-foreground" />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <SidebarGroup className="flex-1 px-3 py-4">
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.href} 
                      className={getNavClasses(item.href)}
                      title={isCollapsed ? item.name : undefined}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="flex-1">{item.name}</span>
                      )}
                      {!isCollapsed && item.name === 'Risk Alerts' && unreadAlerts > 0 && (
                        <Badge variant="destructive" className="ml-auto text-xs">
                          {unreadAlerts}
                        </Badge>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Section */}
        <div className="p-3 border-t border-sidebar-border">
          {!isCollapsed ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent">
                <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center">
                  <User className="w-4 h-4 text-sidebar-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-accent-foreground truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-sidebar-accent-foreground/60">
                    {user?.role}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="w-full justify-start gap-2 text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center">
                <User className="w-4 h-4 text-sidebar-primary-foreground" />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="w-8 h-8 p-0 text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

const DashboardHeader: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-foreground hover:text-primary" />
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            Welcome back, {user?.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <NotificationPanel />
      </div>
    </header>
  );
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};