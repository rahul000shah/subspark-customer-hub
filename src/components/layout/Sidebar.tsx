
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, Database, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  toggle: () => void;
}

const Sidebar = ({ collapsed, toggle }: SidebarProps) => {
  const location = useLocation();
  const pathname = location.pathname;
  
  const routes = [
    {
      title: 'Dashboard',
      href: '/',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: 'Customers',
      href: '/customers',
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: 'Subscriptions',
      href: '/subscriptions',
      icon: <Database className="h-5 w-5" />,
    },
    {
      title: 'Platforms',
      href: '/platforms',
      icon: <Calendar className="h-5 w-5" />,
    },
  ];

  return (
    <aside 
      className={cn(
        "relative z-20 flex h-full flex-col border-r border-border bg-background transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <div className={cn("flex items-center", collapsed ? "justify-center w-full" : "")}>
          {!collapsed && (
            <h1 className="text-xl font-bold text-primary">SubscribeHub</h1>
          )}
          {collapsed && (
            <h1 className="text-xl font-bold text-primary">SH</h1>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggle} 
          className={cn(!collapsed && "absolute -right-4 top-5 z-30", "hidden lg:flex")}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex flex-col space-y-1 p-2 flex-1">
        {routes.map((route) => (
          <Link
            key={route.href}
            to={route.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 transition-all",
              pathname === route.href || 
              (route.href !== '/' && pathname.startsWith(route.href))
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted text-foreground"
            )}
          >
            {route.icon}
            {!collapsed && <span className="font-medium">{route.title}</span>}
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
