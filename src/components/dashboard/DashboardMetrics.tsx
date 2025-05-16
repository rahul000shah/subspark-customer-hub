
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, AlertTriangle, DollarSign } from "lucide-react";
import { DashboardStats, TimeFrame } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dispatch, SetStateAction } from "react";

interface DashboardMetricsProps {
  stats: DashboardStats;
  isLoading?: boolean;
  timeFrame: TimeFrame;
  onTimeFrameChange: Dispatch<SetStateAction<TimeFrame>>;
}

const DashboardMetrics = ({ 
  stats, 
  isLoading = false, 
  timeFrame, 
  onTimeFrameChange 
}: DashboardMetricsProps) => {
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
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select value={timeFrame} onValueChange={(value) => onTimeFrameChange(value as TimeFrame)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
    </div>
  );
};

export default DashboardMetrics;
