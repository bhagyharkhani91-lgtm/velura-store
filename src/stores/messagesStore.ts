import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read';
  createdAt: string;
}

interface MessagesState {
  messages: ContactMessage[];
  isLoading: boolean;
  error: string | null;
  fetchMessages: () => Promise<void>;
  sendMessage: (name: string, email: string, subject: string, message: string) => Promise<void>;
  updateMessageStatus: (id: string, status: 'unread' | 'read') => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
}

export const useMessagesStore = create<MessagesState>()((set) => ({
  messages: [],
  isLoading: false,
  error: null,

  fetchMessages: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedMessages: ContactMessage[] = (data || []).map((d: any) => ({
        id: d.id,
        name: d.name,
        email: d.email,
        subject: d.subject || '',
        message: d.message,
        status: d.status,
        createdAt: d.created_at,
      }));

      set({ messages: formattedMessages, isLoading: false });
    } catch (err: any) {
      console.error("Error fetching messages:", err);
      set({ error: err.message, isLoading: false });
    }
  },

  sendMessage: async (name, email, subject, message) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([{ name, email, subject, message }]);
        
      if (error) throw error;
      
    } catch (err) {
      console.error("Error sending message:", err);
      throw err;
    }
  },

  updateMessageStatus: async (id, status) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', id);
        
      if (error) throw error;
      
      set(state => ({
        messages: state.messages.map(m => m.id === id ? { ...m, status } : m)
      }));
    } catch (err) {
      console.error("Error updating message status:", err);
      throw err;
    }
  },

  deleteMessage: async (id) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      set(state => ({
        messages: state.messages.filter(m => m.id !== id)
      }));
    } catch (err) {
      console.error("Error deleting message:", err);
      throw err;
    }
  }
}));
