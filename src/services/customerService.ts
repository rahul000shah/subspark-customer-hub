
import { supabase } from "@/lib/supabase";
import { Customer } from "@/types";
import { toast } from "@/hooks/use-toast";

export async function getCustomers(): Promise<Customer[]> {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    return data.map(customer => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      address: customer.address || '',
      createdAt: customer.created_at
    }));
  } catch (error: any) {
    toast({
      title: "Error fetching customers",
      description: error.message,
      variant: "destructive"
    });
    return [];
  }
}

export async function addCustomer(customer: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer | null> {
  try {
    const { data, error } = await supabase
      .from('customers')
      .insert({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address
      })
      .select()
      .single();
    
    if (error) throw error;
    
    toast({
      title: "Customer added",
      description: `${customer.name} has been added successfully`
    });
    
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      address: data.address || '',
      createdAt: data.created_at
    };
  } catch (error: any) {
    toast({
      title: "Error adding customer",
      description: error.message,
      variant: "destructive"
    });
    return null;
  }
}

export async function updateCustomer(customer: Customer): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('customers')
      .update({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address
      })
      .eq('id', customer.id);
    
    if (error) throw error;
    
    toast({
      title: "Customer updated",
      description: `${customer.name} has been updated successfully`
    });
    
    return true;
  } catch (error: any) {
    toast({
      title: "Error updating customer",
      description: error.message,
      variant: "destructive"
    });
    return false;
  }
}

export async function deleteCustomer(id: string, name: string): Promise<boolean> {
  try {
    console.log(`Starting customer deletion process for ID: ${id}, name: ${name}`);
    
    // First, check if the customer exists
    const { data: customerData, error: checkError } = await supabase
      .from('customers')
      .select('id')
      .eq('id', id)
      .single();
    
    if (checkError) {
      console.error("Error checking customer existence:", checkError);
      throw new Error(`Customer not found: ${checkError.message}`);
    }
    
    if (!customerData) {
      throw new Error("Customer doesn't exist or was already deleted");
    }
    
    // First, delete related subscriptions
    console.log(`Deleting subscriptions related to customer ID: ${id}`);
    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .delete()
      .eq('customer_id', id);
    
    if (subscriptionError) {
      console.error("Error deleting related subscriptions:", subscriptionError);
      throw new Error(`Failed to delete related subscriptions: ${subscriptionError.message}`);
    }
    
    // Then delete the customer
    console.log(`Deleting customer with ID: ${id}`);
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting customer:", error);
      throw new Error(`Customer deletion failed: ${error.message}`);
    }
    
    console.log(`Customer ${id} (${name}) deleted successfully`);
    
    toast({
      title: "Customer deleted",
      description: `${name} has been removed successfully`
    });
    
    return true;
  } catch (error: any) {
    console.error("Delete customer error:", error);
    toast({
      title: "Error deleting customer",
      description: error.message,
      variant: "destructive"
    });
    return false;
  }
}
