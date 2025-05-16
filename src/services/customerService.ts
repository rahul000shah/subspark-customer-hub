
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
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast({
      title: "Customer deleted",
      description: `${name} has been removed successfully`
    });
    
    return true;
  } catch (error: any) {
    toast({
      title: "Error deleting customer",
      description: error.message,
      variant: "destructive"
    });
    return false;
  }
}
