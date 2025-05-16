
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSubscriptionsWithDetails } from '@/services/subscriptionService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
import ExpiryChart from '@/components/dashboard/ExpiryChart';
import TopPlatforms from '@/components/dashboard/TopPlatforms';
import RecentSubscriptions from '@/components/dashboard/RecentSubscriptions';
import { TimeFrame } from '@/types';
import { addDays, format } from 'date-fns';

const Dashboard = () => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('30days');

  const { data: subscriptions = [], isLoading } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: getSubscriptionsWithDetails
  });

  // Calculate dashboard stats
  const stats = {
    totalCustomers: [...new Set(subscriptions.map(sub => sub.customerId))].length,
    activeSubscriptions: subscriptions.filter(sub => sub.status === 'active').length,
    upcomingExpiries: subscriptions.filter(sub => {
      const expiry = new Date(sub.expiryDate);
      const now = new Date();
      const daysDiff = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 3600 * 24));
      return daysDiff >= 0 && daysDiff <= 30;
    }).length,
    totalRevenue: subscriptions.reduce((total, sub) => total + Number(sub.cost), 0)
  };

  // Get upcoming expiries for chart
  const upcomingExpiries = subscriptions
    .filter(sub => {
      const expiry = new Date(sub.expiryDate);
      const now = new Date();
      const daysDiff = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 3600 * 24));
      return daysDiff >= 0 && daysDiff <= 30;
    })
    .map(sub => ({
      date: sub.expiryDate,
      platform: sub.platform.name,
      customer: sub.customer.name,
      cost: Number(sub.cost)
    }));

  // Calculate top platforms by revenue and subscription count
  const platformStats = subscriptions.reduce((acc: Record<string, { name: string; count: number; revenue: number }>, sub) => {
    const { platform, cost } = sub;
    if (!acc[platform.id]) {
      acc[platform.id] = {
        name: platform.name,
        count: 0,
        revenue: 0
      };
    }
    acc[platform.id].count += 1;
    acc[platform.id].revenue += Number(cost);
    return acc;
  }, {});

  const topPlatforms = Object.values(platformStats)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Get recent subscriptions
  const recentSubscriptions = [...subscriptions]
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Monitor your subscription service performance</p>
      </div>
      
      <DashboardMetrics 
        stats={stats} 
        isLoading={isLoading}
        timeFrame={timeFrame}
        onTimeFrameChange={setTimeFrame}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ExpiryChart 
          data={upcomingExpiries} 
          isLoading={isLoading} 
        />
        <TopPlatforms 
          platforms={topPlatforms} 
          isLoading={isLoading} 
        />
      </div>
      
      <RecentSubscriptions 
        subscriptions={recentSubscriptions} 
        isLoading={isLoading} 
      />
    </div>
  );
};

export default Dashboard;
