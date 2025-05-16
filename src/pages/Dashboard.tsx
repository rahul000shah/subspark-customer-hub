
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DashboardStats, Subscription, Platform, Customer } from '@/types';
import { toast } from '@/hooks/use-toast';

import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
import RecentSubscriptions from '@/components/dashboard/RecentSubscriptions';
import ExpiryChart from '@/components/dashboard/ExpiryChart';
import TopPlatforms from '@/components/dashboard/TopPlatforms';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    activeSubscriptions: 0,
    upcomingExpiries: 0,
    totalRevenue: 0,
  });
  const [recentSubscriptions, setRecentSubscriptions] = useState<(Subscription & { 
    platform: Platform;
    customer: Customer;
  })[]>([]);
  const [expiryData, setExpiryData] = useState<{ name: string; count: number; }[]>([]);
  const [platformData, setPlatformData] = useState<{ name: string; value: number; color: string; }[]>([]);

  // Mock data (in a real app this would come from Supabase)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real app, you'd fetch this data from Supabase
        // For now, we'll use mock data
        
        // Demo stats
        setStats({
          totalCustomers: 78,
          activeSubscriptions: 105,
          upcomingExpiries: 12,
          totalRevenue: 4680,
        });

        // Demo recent subscriptions
        setRecentSubscriptions([
          {
            id: '1',
            customerId: '1',
            platformId: '1',
            type: 'subscription',
            startDate: new Date(2024, 1, 15).toISOString(),
            expiryDate: new Date(2025, 1, 15).toISOString(),
            cost: 99,
            status: 'active',
            notes: 'Annual subscription',
            platform: { id: '1', name: 'Netflix', description: 'Streaming service' },
            customer: { id: '1', name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', createdAt: new Date().toISOString() }
          },
          {
            id: '2',
            customerId: '2',
            platformId: '2',
            type: 'subscription',
            startDate: new Date(2024, 3, 1).toISOString(),
            expiryDate: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            cost: 49,
            status: 'active',
            platform: { id: '2', name: 'Amazon Prime', description: 'Shopping and streaming' },
            customer: { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '987-654-3210', createdAt: new Date().toISOString() }
          },
          {
            id: '3',
            customerId: '3',
            platformId: '3',
            type: 'giftcard',
            startDate: new Date(2024, 2, 15).toISOString(),
            expiryDate: new Date(2024, 4, 15).toISOString(),
            cost: 29,
            status: 'expired',
            platform: { id: '3', name: 'Zee5', description: 'Indian streaming service' },
            customer: { id: '3', name: 'Sam Wilson', email: 'sam@example.com', phone: '555-123-4567', createdAt: new Date().toISOString() }
          },
          {
            id: '4',
            customerId: '4',
            platformId: '4',
            type: 'subscription',
            startDate: new Date(2024, 4, 1).toISOString(),
            expiryDate: new Date(2024, 6, 1).toISOString(),
            cost: 59,
            status: 'active',
            platform: { id: '4', name: 'Tinder', description: 'Dating app' },
            customer: { id: '4', name: 'Emily Jones', email: 'emily@example.com', phone: '555-987-6543', createdAt: new Date().toISOString() }
          },
          {
            id: '5',
            customerId: '5',
            platformId: '5',
            type: 'subscription',
            startDate: new Date(2024, 3, 15).toISOString(),
            expiryDate: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            cost: 39,
            status: 'active',
            platform: { id: '5', name: 'Sony Liv', description: 'Entertainment platform' },
            customer: { id: '5', name: 'Michael Brown', email: 'michael@example.com', phone: '555-456-7890', createdAt: new Date().toISOString() }
          }
        ]);

        // Demo expiry data
        setExpiryData([
          { name: 'This Week', count: 12 },
          { name: 'Next Week', count: 8 },
          { name: 'In 2 Weeks', count: 5 },
          { name: 'In 3 Weeks', count: 3 },
          { name: 'Next Month', count: 15 }
        ]);

        // Demo platform data
        setPlatformData([
          { name: 'Netflix', value: 35, color: '#e50914' },
          { name: 'Amazon Prime', value: 25, color: '#00a8e1' },
          { name: 'Zee5', value: 15, color: '#8c68cd' },
          { name: 'Tinder', value: 12, color: '#fd5068' },
          { name: 'Sony Liv', value: 8, color: '#72c2ff' },
          { name: 'Other', value: 5, color: '#6e6e6e' }
        ]);
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: 'Failed to load dashboard data',
          description: error.message || 'Please try again later',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your subscription business</p>
      </div>

      <DashboardMetrics stats={stats} isLoading={loading} />

      <div className="grid gap-6 lg:grid-cols-2">
        <ExpiryChart data={expiryData} isLoading={loading} />
        <TopPlatforms data={platformData} isLoading={loading} />
      </div>

      <RecentSubscriptions subscriptions={recentSubscriptions} isLoading={loading} />
    </div>
  );
};

export default Dashboard;
