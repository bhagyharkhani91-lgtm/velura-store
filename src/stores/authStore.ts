import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  phone?: string;
  dateOfBirth?: string;
  role: 'customer' | 'admin';
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ error: any }>;
}

export const useAuthStore = create<AuthStore>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  
  // For manually setting the user after login/signup
  login: (user) => set({ user, isAuthenticated: true }),
  
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false });
  },

  updateProfile: async (data) => {
    const { user } = get();
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('profiles')
      .update({
        name: data.name,
        phone: data.phone,
        date_of_birth: data.dateOfBirth,
        avatar_url: data.avatarUrl
      })
      .eq('id', user.id);

    if (error) return { error };

    set({ user: { ...user, ...data } });
    return { error: null };
  },

  initialize: async () => {
    // 1. Get current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      // Try to fetch profile to get role and name
      let { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      // Auto-heal: If profile doesn't exist (e.g. trigger didn't run), create it now since we have a session
      if (!profile) {
        const { data: newProfile } = await supabase.from('profiles').insert([
          { 
            id: session.user.id, 
            email: session.user.email, 
            name: session.user.user_metadata?.name || 'User', 
            role: 'customer' 
          }
        ]).select().single();
        profile = newProfile;
      }
        
      if (profile) {
        set({
          user: {
            id: session.user.id,
            email: session.user.email || '',
            name: profile.name || '',
            avatarUrl: profile.avatar_url || '',
            phone: profile.phone || '',
            dateOfBirth: profile.date_of_birth || '',
            role: profile.role || 'customer'
          },
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        set({ isAuthenticated: false, isLoading: false });
      }
    } else {
      set({ isAuthenticated: false, isLoading: false });
    }

    // 2. Listen for auth changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
         let { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
         // Auto-heal
         if (!profile) {
           const { data: newProfile } = await supabase.from('profiles').insert([
             { 
               id: session.user.id, 
               email: session.user.email, 
               name: session.user.user_metadata?.name || 'User', 
               role: 'customer' 
             }
           ]).select().single();
           profile = newProfile;
         }
          
         if (profile) {
           set({
             user: {
               id: session.user.id,
               email: session.user.email || '',
               name: profile.name || '',
               avatarUrl: profile.avatar_url || '',
               phone: profile.phone || '',
               dateOfBirth: profile.date_of_birth || '',
               role: profile.role || 'customer'
             },
             isAuthenticated: true,
           });
         }
      } else if (event === 'SIGNED_OUT') {
        set({ user: null, isAuthenticated: false });
      }
    });
  }
}));
