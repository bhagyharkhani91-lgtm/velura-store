import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  role: 'customer' | 'admin';
  created_at: string;
}

interface UsersStore {
  users: AdminUser[];
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  addUser: (data: Omit<AdminUser, 'id' | 'created_at'>) => Promise<{ error: any }>;
  updateUser: (id: string, data: Partial<AdminUser>) => Promise<{ error: any }>;
  deleteUser: (id: string) => Promise<{ error: any }>;
}

export const useUsersStore = create<UsersStore>()((set, get) => ({
  users: [],
  isLoading: false,
  error: null,
  
  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      set({ 
        users: data as AdminUser[],
        isLoading: false 
      });
    } catch (err: any) {
      console.error('Error fetching users:', err);
      set({ 
        error: err.message || 'Failed to fetch users', 
        isLoading: false 
      });
    }
  },

  addUser: async (data) => {
    // Generate a new UUID since this is a manual insert without auth sign-up
    const newId = crypto.randomUUID();
    
    const { data: newUser, error } = await supabase
      .from('profiles')
      .insert([
        {
          id: newId,
          ...data
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding user:', error);
      return { error };
    }

    // Update local state
    const { users } = get();
    set({
      users: [newUser as AdminUser, ...users]
    });

    return { error: null };
  },

  updateUser: async (id, data) => {
    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', id);

    if (error) {
      console.error('Error updating user:', error);
      return { error };
    }

    // Update local state
    const { users } = get();
    set({
      users: users.map(u => u.id === id ? { ...u, ...data } : u)
    });

    return { error: null };
  },

  deleteUser: async (id) => {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting user:', error);
      return { error };
    }

    // Remove from local state
    const { users } = get();
    set({
      users: users.filter(u => u.id !== id)
    });

    return { error: null };
  }
}));
