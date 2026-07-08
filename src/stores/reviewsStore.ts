import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  content: string;
  images: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  userEmail?: string; // Used for admin panel
}

interface ReviewsState {
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
  fetchProductReviews: (productId: string) => Promise<void>;
  fetchAllReviews: () => Promise<void>; // For admin
  addReview: (productId: string, userId: string, rating: number, content: string, images: string[]) => Promise<void>;
  updateReviewStatus: (id: string, status: 'approved' | 'rejected') => Promise<void>;
  updateReviewContent: (id: string, content: string, rating: number) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
}

export const useReviewsStore = create<ReviewsState>()((set) => ({
  reviews: [],
  isLoading: false,
  error: null,

  fetchProductReviews: async (productId) => {
    set({ isLoading: true, error: null });
    try {
      // Fetch only approved reviews for this product
      // Notice: Since public users can't see the emails, we'll fetch basic profile data if we had a join.
      // But we will just show "Customer" on the frontend for privacy, unless we want to join with profiles.
      // We will do a join to get the user's name if possible.
      const { data, error } = await supabase
        .from('product_reviews')
        .select(`
          *,
          profiles:user_id ( name, email )
        `)
        .eq('product_id', productId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedReviews: Review[] = (data || []).map((d: any) => ({
        id: d.id,
        productId: d.product_id,
        userId: d.user_id,
        rating: d.rating,
        content: d.content,
        images: d.images || [],
        status: d.status,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
        userEmail: d.profiles?.name || d.profiles?.email || 'Customer'
      }));

      set({ reviews: formattedReviews, isLoading: false });
    } catch (err: any) {
      console.error("Error fetching product reviews:", err);
      set({ error: err.message, isLoading: false });
    }
  },

  fetchAllReviews: async () => {
    set({ isLoading: true, error: null });
    try {
      // For Admin: fetch all reviews regardless of status
      const { data, error } = await supabase
        .from('product_reviews')
        .select(`
          *,
          products ( name ),
          profiles:user_id ( email )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedReviews: Review[] = (data || []).map((d: any) => ({
        id: d.id,
        productId: d.product_id,
        userId: d.user_id,
        rating: d.rating,
        content: d.content,
        images: d.images || [],
        status: d.status,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
        userEmail: d.profiles?.email || 'Unknown',
        productName: d.products?.name || 'Unknown Product'
      })) as any; // Allow productName dynamically

      set({ reviews: formattedReviews, isLoading: false });
    } catch (err: any) {
      console.error("Error fetching all reviews:", err);
      set({ error: err.message, isLoading: false });
    }
  },

  addReview: async (productId, userId, rating, content, images) => {
    try {
      const dbReview = {
        product_id: productId,
        user_id: userId,
        rating,
        content,
        images,
        status: 'approved'
      };

      const { error } = await supabase.from('product_reviews').insert([dbReview]);
      if (error) throw error;
      
    } catch (err) {
      console.error("Error adding review:", err);
      throw err;
    }
  },

  updateReviewStatus: async (id, status) => {
    try {
      const { error } = await supabase
        .from('product_reviews')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state if the review exists
      set(state => ({
        reviews: state.reviews.map(r => r.id === id ? { ...r, status } : r)
      }));
    } catch (err) {
      console.error("Error updating review status:", err);
      throw err;
    }
  },

  updateReviewContent: async (id, content, rating) => {
    try {
      const { error } = await supabase
        .from('product_reviews')
        .update({ content, rating, updated_at: new Date().toISOString() })
        .eq('id', id);
        
      if (error) throw error;
      
      set(state => ({
        reviews: state.reviews.map(r => r.id === id ? { ...r, content, rating } : r)
      }));
    } catch (err) {
      console.error("Error updating review content:", err);
      throw err;
    }
  },

  deleteReview: async (id) => {
    try {
      const { error } = await supabase.from('product_reviews').delete().eq('id', id);
      if (error) throw error;
      
      set(state => ({
        reviews: state.reviews.filter(r => r.id !== id)
      }));
    } catch (err) {
      console.error("Error deleting review:", err);
      throw err;
    }
  }
}));
