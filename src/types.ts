
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  customerId: string;
  platformId: string;
  type: 'subscription' | 'giftcard';
  startDate: string;
  expiryDate: string;
  cost: number;
  status: 'active' | 'expired' | 'cancelled';
  notes?: string;
}

export interface Platform {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'staff';
  createdAt: string;
}

export type TimeFrame = '7days' | '30days' | '90days' | 'all';

export interface DashboardStats {
  totalCustomers: number;
  activeSubscriptions: number;
  upcomingExpiries: number;
  totalRevenue: number;
}
