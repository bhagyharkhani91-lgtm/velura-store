import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface SettingsState {
  promoMessages: string[];
  contactTitle: string;
  contactDescription: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  contactHours: string;
  returnPolicy: string;
  isLoading: boolean;
  fetchSettings: () => Promise<void>;
  setPromoMessages: (messages: string[]) => Promise<void>;
  setReturnPolicy: (policy: string) => Promise<void>;
  setContactInfo: (info: {
    contactTitle: string;
    contactDescription: string;
    contactEmail: string;
    contactPhone: string;
    contactAddress: string;
    contactHours: string;
  }) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>()((set) => ({
  promoMessages: [
    '50% DISCOUNT ON ALL PRODUCTS',
    'CASH ON DELIVERY AVAILABLE',
    '100% DISCREET PACKAGING'
  ],
  contactTitle: 'CONTACT OUR CONCIERGE',
  contactDescription: 'Have a question about our premium collections or require discreet guidance? Our dedicated wellness consultants are available to assist you.',
  contactEmail: 'support@velura.com',
  contactPhone: '+91 9914869069',
  contactAddress: 'Velura Luxury HQ, Suite 500, Mumbai, India',
  contactHours: 'Mon - Sat: 10:00 AM - 8:00 PM (IST)',
  returnPolicy: 'At Velura, we strive to ensure your complete satisfaction. If you are not entirely satisfied with your purchase, we offer a hassle-free return and exchange process. You may return unworn, unwashed, and undamaged items within 30 days of delivery for a full refund or exchange. Please ensure that all original tags are attached and the items are returned in their original packaging. For health and hygiene reasons, certain intimate items are non-returnable. Please contact our concierge team at support@velura.com to initiate a return request.',
  isLoading: false,

  fetchSettings: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).single();
      
      if (error && error.code !== 'PGRST116') {
        // PGRST116 is no rows returned, which is fine if table is empty
        throw error;
      }
      
      if (data) {
        set({
          promoMessages: data.promo_messages || [],
          contactTitle: data.contact_title || '',
          contactDescription: data.contact_description || '',
          contactEmail: data.contact_email || '',
          contactPhone: data.contact_phone || '',
          contactAddress: data.contact_address || '',
          contactHours: data.contact_hours || '',
          returnPolicy: data.return_policy || ''
        });
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  setPromoMessages: async (messages) => {
    try {
      const { error } = await supabase.from('site_settings').update({ promo_messages: messages }).eq('id', 1);
      if (error) throw error;
      set({ promoMessages: messages });
    } catch (err) {
      console.error('Error updating promo messages:', err);
    }
  },

  setReturnPolicy: async (policy) => {
    try {
      const { error } = await supabase.from('site_settings').update({ return_policy: policy }).eq('id', 1);
      if (error) throw error;
      set({ returnPolicy: policy });
    } catch (err) {
      console.error('Error updating return policy:', err);
    }
  },

  setContactInfo: async (info) => {
    try {
      const { error } = await supabase.from('site_settings').update({
        contact_title: info.contactTitle,
        contact_description: info.contactDescription,
        contact_email: info.contactEmail,
        contact_phone: info.contactPhone,
        contact_address: info.contactAddress,
        contact_hours: info.contactHours
      }).eq('id', 1);
      if (error) throw error;
      set(info);
    } catch (err) {
      console.error('Error updating contact info:', err);
    }
  }
}));
