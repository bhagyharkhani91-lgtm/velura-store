import { Outlet } from 'react-router-dom';
import { Navbar } from '../Navbar/Navbar';
import { Footer } from '../Footer/Footer';
import { useCartStore } from '../../../stores/cartStore';
import { Drawer } from '../../ui/Drawer/Drawer';
import { Button } from '../../ui/Button/Button';
import { formatPrice } from '../../../utils';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { ScrollToTop } from '../ScrollToTop/ScrollToTop';
import { MobileMenu } from '../MobileMenu/MobileMenu';
import './PageLayout.css';

export function PageLayout() {
  const { isOpen, closeCart, items, getSubtotal, updateQuantity, removeItem, clearCart } = useCartStore();

  return (
    <div className="page-wrapper">
      <ScrollToTop />
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />

      {/* Global Mobile Menu */}
      <MobileMenu />

      {/* Global Cart Drawer */}
      <Drawer
        isOpen={isOpen}
        onClose={closeCart}
        title="Your Cart"
        side="right"
        size="md"
        footer={
          <div className="cart-footer">
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <span>{formatPrice(getSubtotal())}</span>
            </div>
            <p className="cart-taxes">Taxes and shipping calculated at checkout</p>
            <Button 
              fullWidth 
              size="lg" 
              onClick={() => {
                closeCart();
                window.location.href = '/checkout';
              }}
            >
              Checkout
            </Button>
          </div>
        }
      >
        {items.length === 0 ? (
          <div className="cart-empty">
            <p>Your cart is empty.</p>
            <Button variant="outline" onClick={closeCart} className="mt-4">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="cart-items" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
              <button 
                onClick={clearCart}
                style={{ fontSize: 'var(--text-sm)', color: 'var(--color-error)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Trash2 size={14} /> Clear Cart
              </button>
            </div>
            {items.map((item) => (
              <div key={`${item.productId}-${item.variantId}`} className="cart-item" style={{ display: 'flex', gap: 'var(--space-4)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)' }}>
                <img src={item.image} alt={item.name} style={{ width: '80px', height: '100px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4 style={{ fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-sm)' }}>{item.name}</h4>
                    <span style={{ fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-sm)' }}>{formatPrice(item.price)}</span>
                  </div>
                  
                  {item.variant && <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)' }}>{item.variant}</span>}
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                        style={{ padding: 'var(--space-1) var(--space-2)', cursor: 'pointer' }}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ padding: '0 var(--space-2)', fontSize: 'var(--text-sm)' }}>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                        style={{ padding: 'var(--space-1) var(--space-2)', cursor: 'pointer' }}
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.productId, item.variantId)}
                      style={{ color: 'var(--color-text-tertiary)', cursor: 'pointer' }}
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Drawer>
    </div>
  );
}
