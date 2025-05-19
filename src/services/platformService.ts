
import { supabase } from "@/lib/supabase";
import { Platform } from "@/types";
import { toast } from "@/hooks/use-toast";

export async function getPlatforms(): Promise<Platform[]> {
  try {
    const { data, error } = await supabase
      .from('platforms')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    return data.map(platform => ({
      id: platform.id,
      name: platform.name,
      description: platform.description || '',
      logoUrl: platform.logo_url || ''
    }));
  } catch (error: any) {
    toast({
      title: "Error fetching platforms",
      description: error.message,
      variant: "destructive"
    });
    return [];
  }
}

export async function addPlatform(platform: Omit<Platform, 'id'>): Promise<Platform | null> {
  try {
    const { data, error } = await supabase
      .from('platforms')
      .insert({
        name: platform.name,
        description: platform.description,
        logo_url: platform.logoUrl
      })
      .select()
      .single();
    
    if (error) throw error;
    
    toast({
      title: "Platform added",
      description: `${platform.name} has been added successfully`
    });
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      logoUrl: data.logo_url || ''
    };
  } catch (error: any) {
    toast({
      title: "Error adding platform",
      description: error.message,
      variant: "destructive"
    });
    return null;
  }
}

export async function updatePlatform(platform: Platform): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('platforms')
      .update({
        name: platform.name,
        description: platform.description,
        logo_url: platform.logoUrl
      })
      .eq('id', platform.id);
    
    if (error) throw error;
    
    toast({
      title: "Platform updated",
      description: `${platform.name} has been updated successfully`
    });
    
    return true;
  } catch (error: any) {
    toast({
      title: "Error updating platform",
      description: error.message,
      variant: "destructive"
    });
    return false;
  }
}

export async function deletePlatform(id: string, name: string): Promise<boolean> {
  try {
    console.log(`Starting platform deletion process for ID: ${id}, name: ${name}`);
    
    // First, check if the platform exists
    const { data: platformData, error: checkError } = await supabase
      .from('platforms')
      .select('id')
      .eq('id', id)
      .single();
    
    if (checkError) {
      console.error("Error checking platform existence:", checkError);
      throw new Error(`Platform not found: ${checkError.message}`);
    }
    
    if (!platformData) {
      throw new Error("Platform doesn't exist or was already deleted");
    }
    
    // First, delete related subscriptions
    console.log(`Deleting subscriptions related to platform ID: ${id}`);
    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .delete()
      .eq('platform_id', id);
    
    if (subscriptionError) {
      console.error("Error deleting related subscriptions:", subscriptionError);
      throw new Error(`Failed to delete related subscriptions: ${subscriptionError.message}`);
    }
    
    // Then delete the platform
    console.log(`Deleting platform with ID: ${id}`);
    const { error } = await supabase
      .from('platforms')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting platform:", error);
      throw new Error(`Platform deletion failed: ${error.message}`);
    }
    
    console.log(`Platform ${id} (${name}) deleted successfully`);
    
    toast({
      title: "Platform deleted",
      description: `${name} has been removed successfully`
    });
    
    return true;
  } catch (error: any) {
    console.error("Delete platform error:", error);
    toast({
      title: "Error deleting platform",
      description: error.message,
      variant: "destructive"
    });
    return false;
  }
}
