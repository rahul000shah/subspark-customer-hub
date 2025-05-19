
import { supabase } from "@/lib/supabase";
import { Subscription, Customer, Platform } from "@/types";
import { toast } from "@/hooks/use-toast";

export async function getSubscriptions(): Promise<Subscription[]> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .order('expiry_date');
    
    if (error) throw error;
    
    return data.map(subscription => ({
      id: subscription.id,
      customerId: subscription.customer_id,
      platformId: subscription.platform_id,
      type: subscription.type as 'subscription' | 'giftcard',
      startDate: subscription.start_date,
      expiryDate: subscription.expiry_date,
      cost: subscription.cost,
      status: subscription.status as 'active' | 'expired' | 'cancelled',
      notes: subscription.notes || ''
    }));
  } catch (error: any) {
    toast({
      title: "Error fetching subscriptions",
      description: error.message,
      variant: "destructive"
    });
    return [];
  }
}

export async function getSubscriptionsWithDetails(): Promise<(Subscription & { customer: Customer, platform: Platform })[]> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        customers:customer_id (*),
        platforms:platform_id (*)
      `)
      .order('expiry_date');
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      customerId: item.customer_id,
      platformId: item.platform_id,
      type: item.type as 'subscription' | 'giftcard',
      startDate: item.start_date,
      expiryDate: item.expiry_date,
      cost: item.cost,
      status: item.status as 'active' | 'expired' | 'cancelled',
      notes: item.notes || '',
      customer: {
        id: item.customers.id,
        name: item.customers.name,
        email: item.customers.email,
        phone: item.customers.phone || '',
        address: item.customers.address || '',
        createdAt: item.customers.created_at
      },
      platform: {
        id: item.platforms.id,
        name: item.platforms.name,
        description: item.platforms.description || '',
        logoUrl: item.platforms.logo_url || ''
      }
    }));
  } catch (error: any) {
    toast({
      title: "Error fetching subscriptions",
      description: error.message,
      variant: "destructive"
    });
    return [];
  }
}

export async function addSubscription(subscription: Omit<Subscription, 'id'>): Promise<Subscription | null> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        customer_id: subscription.customerId,
        platform_id: subscription.platformId,
        type: subscription.type,
        start_date: subscription.startDate,
        expiry_date: subscription.expiryDate,
        cost: subscription.cost,
        status: subscription.status,
        notes: subscription.notes
      })
      .select()
      .single();
    
    if (error) throw error;
    
    toast({
      title: "Subscription added",
      description: `Subscription has been added successfully`
    });
    
    return {
      id: data.id,
      customerId: data.customer_id,
      platformId: data.platform_id,
      type: data.type as 'subscription' | 'giftcard',
      startDate: data.start_date,
      expiryDate: data.expiry_date,
      cost: data.cost,
      status: data.status as 'active' | 'expired' | 'cancelled',
      notes: data.notes || ''
    };
  } catch (error: any) {
    toast({
      title: "Error adding subscription",
      description: error.message,
      variant: "destructive"
    });
    return null;
  }
}

export async function updateSubscription(subscription: Subscription): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('subscriptions')
      .update({
        customer_id: subscription.customerId,
        platform_id: subscription.platformId,
        type: subscription.type,
        start_date: subscription.startDate,
        expiry_date: subscription.expiryDate,
        cost: subscription.cost,
        status: subscription.status,
        notes: subscription.notes
      })
      .eq('id', subscription.id);
    
    if (error) throw error;
    
    toast({
      title: "Subscription updated",
      description: `Subscription has been updated successfully`
    });
    
    return true;
  } catch (error: any) {
    toast({
      title: "Error updating subscription",
      description: error.message,
      variant: "destructive"
    });
    return false;
  }
}

export async function deleteSubscription(id: string): Promise<boolean> {
  try {
    console.log(`Attempting to delete subscription with id: ${id}`);
    
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting subscription:", error);
      throw error;
    }
    
    console.log("Subscription deleted successfully");
    
    toast({
      title: "Subscription deleted",
      description: `Subscription has been removed successfully`
    });
    
    return true;
  } catch (error: any) {
    console.error("Delete subscription error:", error);
    toast({
      title: "Error deleting subscription",
      description: error.message,
      variant: "destructive"
    });
    return false;
  }
}
