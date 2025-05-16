
import { useQuery } from '@tanstack/react-query';
import { getSubscriptionsWithDetails } from '@/services/subscriptionService';
import { DashboardStats } from '@/types';

export function useSubscriptionStats(timeFrame: string = 'all'): { stats: DashboardStats, isLoading: boolean } {
  const { data: subscriptions = [], isLoading } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: getSubscriptionsWithDetails
  });

  if (isLoading) {
    return {
      stats: {
        totalCustomers: 0,
        activeSubscriptions: 0,
        upcomingExpiries: 0,
        totalRevenue: 0
      },
      isLoading
    };
  }

  // Filter subscriptions based on timeFrame
  const filteredSubscriptions = subscriptions.filter(sub => {
    if (timeFrame === 'all') return true;
    
    const date = new Date();
    const subDate = new Date(sub.startDate);
    
    if (timeFrame === '7days') {
      date.setDate(date.getDate() - 7);
      return subDate >= date;
    }
    
    if (timeFrame === '30days') {
      date.setDate(date.getDate() - 30);
      return subDate >= date;
    }
    
    if (timeFrame === '90days') {
      date.setDate(date.getDate() - 90);
      return subDate >= date;
    }
    
    return true;
  });

  // Get unique customers
  const uniqueCustomers = new Set(filteredSubscriptions.map(sub => sub.customerId));
  
  // Count active subscriptions
  const activeSubscriptions = filteredSubscriptions.filter(
    sub => sub.status === 'active'
  ).length;
  
  // Count upcoming expiries (within next 7 days)
  const now = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const upcomingExpiries = filteredSubscriptions.filter(sub => {
    const expiryDate = new Date(sub.expiryDate);
    return sub.status === 'active' && expiryDate > now && expiryDate <= nextWeek;
  }).length;
  
  // Calculate total revenue
  const totalRevenue = filteredSubscriptions.reduce((total, sub) => {
    return total + parseFloat(sub.cost.toString());
  }, 0);

  return {
    stats: {
      totalCustomers: uniqueCustomers.size,
      activeSubscriptions,
      upcomingExpiries,
      totalRevenue
    },
    isLoading
  };
}
