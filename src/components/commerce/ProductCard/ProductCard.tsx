import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { type Product } from '../../../types/product';
import { formatPrice } from '../../../utils';
import { useCartStore } from '../../../stores/cartStore';
import { useUIStore } from '../../../stores/uiStore';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, openCart } = useCartStore();
  const { addToast } = useUIStore();
  
  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];

  // Calculate discount percentage if there is a compare price
  const discountPercent = product.compareAtPrice && product.compareAtPrice > product.price 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const isOutOfStock = product.stockCount === 0 || !product.inStock;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;
    addItem({
      productId: product.id,
      variantId: product.variants[0]?.id,
      name: product.name,
      price: product.price,
      image: primaryImage?.url || '',
      quantity: 1,
      maxQuantity: product.stockCount,
      variant: product.variants[0]?.name,
      shippingCharge: product.shippingCharge || 0,
    });
    addToast({
      type: 'success',
      title: 'Added to cart',
      message: `${product.name} has been added to your cart.`
    });
    openCart();
  };

  return (
    <Link to={`/products/${product.slug}`} className="product-card">
      <div className="product-card-image-wrapper">
        {primaryImage ? (
          <img 
            src={primaryImage.url} 
            alt={primaryImage.alt || product.name} 
            className="product-card-image"
            loading="lazy"
          />
        ) : (
          <div className="product-card-image bg-bg-secondary flex items-center justify-center text-secondary">
            No Image
          </div>
        )}
        {product.isOnSale && (
          <div className="product-card-badge-offer">ON OFFER</div>
        )}
        {isOutOfStock && (
          <div className="product-card-badge-oos">Out of Stock</div>
        )}
      </div>

      <div className="product-card-content">
        <div className="product-card-rating">
          {discountPercent > 0 && (
            <span className="product-card-discount">{discountPercent}% Off</span>
          )}
          <div className="product-card-stars">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} 
                fill={i < Math.round(product.rating) ? "#FFD700" : "none"} 
                color={i < Math.round(product.rating) ? "#FFD700" : "#4B5563"} 
              />
            ))}
            <span className="text-xs text-secondary ml-1">
              {product.reviewCount > 0 ? `(${product.reviewCount})` : '(0)'}
            </span>
          </div>
        </div>
        
        <h3 className="product-card-title truncate">{product.name}</h3>
        
        {product.shortDescription && (
          <p className="product-card-short-desc">{product.shortDescription}</p>
        )}
        
        <div className="product-card-price-container">
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="product-card-price-original">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
          <span className="product-card-price">{formatPrice(product.price)}</span>
        </div>
        
        <button 
          className="product-card-add-btn" 
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? 'Out of Stock' : 'Add To Cart'}
        </button>
        <div className="product-card-trust-badges">
          <span className="product-card-trust-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
              <rect x="1" y="4" width="22" height="16" rx="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            Secure Checkout
          </span>
          <span className="product-card-trust-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Discreet Shipping
          </span>
          {product.deliveryTime && (
            <span className="product-card-trust-badge text-accent font-medium">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {product.deliveryTime}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
