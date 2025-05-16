
import { useState } from "react";
import { Card } from "@/components/ui/card";
import DashboardMetrics from "@/components/dashboard/DashboardMetrics";
import ExpiryChart from "@/components/dashboard/ExpiryChart";
import RecentSubscriptions from "@/components/dashboard/RecentSubscriptions";
import TopPlatforms from "@/components/dashboard/TopPlatforms";
import { TimeFrame } from "@/types";
import { useSubscriptionStats } from "@/hooks/useSubscriptionStats";
import { useQuery } from "@tanstack/react-query";
import { getSubscriptionsWithDetails } from "@/services/subscriptionService";

const Dashboard = () => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("30days");
  const { stats, isLoading: statsLoading } = useSubscriptionStats(timeFrame);
  
  const { data: subscriptionsWithDetails = [], isLoading: subscriptionsLoading } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: getSubscriptionsWithDetails
  });

  // Get top 10 recent subscriptions
  const recentSubscriptions = [...subscriptionsWithDetails]
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, 10);

  // Calculate subscription data for platforms
  const platformData = subscriptionsWithDetails.reduce((acc, sub) => {
    const platform = sub.platform.name;
    if (!acc[platform]) {
      acc[platform] = {
        name: platform,
        count: 0,
        revenue: 0
      };
    }
    acc[platform].count += 1;
    acc[platform].revenue += parseFloat(sub.cost.toString());
    return acc;
  }, {} as Record<string, { name: string; count: number; revenue: number }>);

  const topPlatforms = Object.values(platformData)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Calculate expiry data for chart
  const now = new Date();
  const oneMonthLater = new Date();
  oneMonthLater.setMonth(now.getMonth() + 1);
  
  const expiryData = subscriptionsWithDetails
    .filter(sub => {
      const expiryDate = new Date(sub.expiryDate);
      return sub.status === 'active' && expiryDate >= now && expiryDate <= oneMonthLater;
    })
    .map(sub => ({
      date: sub.expiryDate,
      platform: sub.platform.name,
      customer: sub.customer.name,
      cost: parseFloat(sub.cost.toString())
    }));

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <DashboardMetrics 
        stats={stats} 
        isLoading={statsLoading} 
        timeFrame={timeFrame}
        onTimeFrameChange={setTimeFrame}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <ExpiryChart data={expiryData} isLoading={subscriptionsLoading} />
        </Card>
        <Card className="p-6">
          <TopPlatforms platforms={topPlatforms} isLoading={subscriptionsLoading} />
        </Card>
      </div>

      <RecentSubscriptions 
        subscriptions={recentSubscriptions}
        isLoading={subscriptionsLoading}
      />
    </div>
  );
};

export default Dashboard;
