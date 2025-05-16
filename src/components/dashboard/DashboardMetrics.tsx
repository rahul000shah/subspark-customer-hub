
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, AlertTriangle, DollarSign } from "lucide-react";
import { DashboardStats } from "@/types";

interface DashboardMetricsProps {
  stats: DashboardStats;
  isLoading?: boolean;
}

const DashboardMetrics = ({ stats, isLoading = false }: DashboardMetricsProps) => {
  const metrics = [
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: <Users className="h-5 w-5 text-blue-500" />,
      description: "All registered customers",
    },
    {
      title: "Active Subscriptions",
      value: stats.activeSubscriptions,
      icon: <Calendar className="h-5 w-5 text-green-500" />,
      description: "Currently active subscriptions",
    },
    {
      title: "Upcoming Expiries",
      value: stats.upcomingExpiries,
      icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
      description: "Expiring in 7 days",
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: <DollarSign className="h-5 w-5 text-purple-500" />,
      description: "Total subscription revenue",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            {metric.icon}
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-7 w-1/2 animate-pulse rounded-md bg-muted"></div>
            ) : (
              <div className="text-2xl font-bold">{metric.value}</div>
            )}
            <p className="text-xs text-muted-foreground">{metric.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardMetrics;
