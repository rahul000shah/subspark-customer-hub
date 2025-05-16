
import { createClient } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';
import { supabase as supabaseClient } from '@/integrations/supabase/client';

// Use the already configured supabase client from the integrations folder
export const supabase = supabaseClient;

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return { user: data.user, session: data.session };
  } catch (error: any) {
    toast({
      title: "Authentication error",
      description: error.message || "Failed to sign in",
      variant: "destructive"
    });
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  } catch (error: any) {
    toast({
      title: "Sign out error",
      description: error.message || "Failed to sign out",
      variant: "destructive"
    });
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      throw error;
    }
    return data?.user;
  } catch (error) {
    return null;
  }
};
