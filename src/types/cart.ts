// ============================================
// Cart Types
// ============================================

export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  maxQuantity: number;
  variant?: string;
  shippingCharge?: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
}
