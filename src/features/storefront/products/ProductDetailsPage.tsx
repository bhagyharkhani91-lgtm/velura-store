import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ChevronDown, ChevronUp, Minus, Plus, Truck, ShieldCheck } from 'lucide-react';
import { Container } from '../../../components/layout/Container/Container';
import { Button } from '../../../components/ui/Button/Button';
import { useCartStore } from '../../../stores/cartStore';
import { useProductStore } from '../../../stores/productStore';
import { formatPrice } from '../../../utils';
import type { Product, ProductVariant } from '../../../types/product';
import { ProductReviewsSection } from './ProductReviewsSection';
import { useReviewsStore } from '../../../stores/reviewsStore';
import './ProductDetailsPage.css';

export function ProductDetailsPage() {
  const { productSlug } = useParams<{ productSlug: string }>();
  const navigate = useNavigate();
  const { addItem, openCart } = useCartStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [activeImageId, setActiveImageId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  
  // Accordion state
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    description: true
  });

  const { getProductBySlug } = useProductStore();
  const { reviews, isLoading: isReviewsLoading } = useReviewsStore();

  const dynamicReviewCount = reviews.length;
  const dynamicRating = dynamicReviewCount > 0 
    ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / dynamicReviewCount).toFixed(1))
    : 0;

  useEffect(() => {
    // Find product by slug from the store
    const foundProduct = getProductBySlug(productSlug || '');
    
    if (foundProduct) {
      setProduct(foundProduct);
      
      // Select first variant if available
      if (foundProduct.variants && foundProduct.variants.length > 0) {
        setSelectedVariant(foundProduct.variants[0]);
      }
      
      // Select primary image
      const primaryImage = foundProduct.images.find(img => img.isPrimary) || foundProduct.images[0];
      if (primaryImage) {
        setActiveImageId(primaryImage.id);
      }
    } else {
      // Handle not found
      navigate('/products');
    }
  }, [productSlug, navigate]);

  if (!product) {
    return <div className="pdp-page flex items-center justify-center min-h-[50vh]">Loading...</div>;
  }

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: selectedVariant ? selectedVariant.price : product.price,
      quantity,
      image: product.images[0]?.url || '',
      maxQuantity: selectedVariant?.stockCount || product.stockCount || 10,
      variantId: selectedVariant?.id,
      variant: selectedVariant?.name,
      shippingCharge: product.shippingCharge || 0
    });
    openCart();
  };

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const activeImage = product.images.find(img => img.id === activeImageId);
  const displayPrice = selectedVariant ? selectedVariant.price : product.price;

  const displayRating = dynamicReviewCount > 0 ? dynamicRating : (isReviewsLoading ? product.rating : 0);
  const displayReviewCount = dynamicReviewCount > 0 ? dynamicReviewCount : (isReviewsLoading ? product.reviewCount : 0);

  return (
    <div className="pdp-page">
      <Container>
        <div className="pdp-grid">
          
          {/* Left Column: Image Gallery */}
          <div className="pdp-gallery">
            <div className="pdp-main-image-container">
              {activeImage && (
                <img 
                  src={activeImage.url} 
                  alt={activeImage.alt} 
                  className="pdp-main-image"
                />
              )}
            </div>
            
            {product.images.length > 1 && (
              <div className="pdp-thumbnails">
                {product.images.map(img => (
                  <button
                    key={img.id}
                    className={`pdp-thumbnail-btn ${activeImageId === img.id ? 'active' : ''}`}
                    onClick={() => setActiveImageId(img.id)}
                  >
                    <img src={img.url} alt={img.alt} className="pdp-thumbnail-image" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info */}
          <div className="pdp-info">
            
            <div>
              <h1 className="pdp-title">{product.name}</h1>
              <div className="pdp-meta">
                <div className="pdp-rating">
                  <Star size={16} fill="#FACC15" color="#FACC15" />
                  <span className="font-medium text-white">{displayRating}</span>
                </div>
                <span>({displayReviewCount} Reviews)</span>
                <span>•</span>
                <span className={product.inStock ? 'text-success' : 'text-error'}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            <div className="pdp-price-container">
              <span className="pdp-price">{formatPrice(displayPrice)}</span>
              {product.compareAtPrice && product.compareAtPrice > displayPrice && (
                <span className="pdp-compare-price">{formatPrice(product.compareAtPrice)}</span>
              )}
            </div>

            <p className="pdp-short-desc">{product.shortDescription}</p>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <h3 className="pdp-section-title">Select Option</h3>
                <div className="pdp-variants">
                  {product.variants.map(variant => (
                    <button
                      key={variant.id}
                      className={`pdp-variant-btn ${selectedVariant?.id === variant.id ? 'active' : ''}`}
                      onClick={() => setSelectedVariant(variant)}
                      disabled={!variant.inStock}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="pdp-quantity-row">
              <div className="pdp-quantity-control">
                <button 
                  className="pdp-qty-btn" 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <div className="pdp-qty-display">{quantity}</div>
                <button 
                  className="pdp-qty-btn" 
                  onClick={() => setQuantity(q => q + 1)}
                  disabled={quantity >= (selectedVariant?.stockCount || product.stockCount || 10)}
                >
                  <Plus size={16} />
                </button>
              </div>
              
              <Button 
                size="lg" 
                className="pdp-add-btn" 
                onClick={handleAddToCart}
                disabled={!product.inStock || (selectedVariant !== null && !selectedVariant.inStock)}
              >
                Add to Cart
              </Button>
            </div>

            <div className="flex items-center gap-6 mt-4 text-sm text-text-secondary">
              {(product.hasDiscreetShipping ?? true) && (
                <div className="flex items-center gap-2">
                  <Truck size={18} className="text-accent" />
                  <span>Discreet Shipping</span>
                </div>
              )}
              {(product.warrantyText ?? '1 Year Warranty') && (
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-accent" />
                  <span>{product.warrantyText ?? '1 Year Warranty'}</span>
                </div>
              )}
            </div>

            {/* Details Accordion */}
            <div className="pdp-accordion-group">
              
              <div className="pdp-accordion-item">
                <button 
                  className="pdp-accordion-header" 
                  onClick={() => toggleSection('description')}
                >
                  Description
                  {openSections['description'] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {openSections['description'] && (
                  <div className="pdp-accordion-content">
                    {product.description}
                  </div>
                )}
              </div>

              {product.materials && product.materials.length > 0 && (
                <div className="pdp-accordion-item">
                  <button 
                    className="pdp-accordion-header" 
                    onClick={() => toggleSection('materials')}
                  >
                    Materials
                    {openSections['materials'] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  {openSections['materials'] && (
                    <div className="pdp-accordion-content">
                      <ul className="pdp-accordion-list">
                        {product.materials.map((material, idx) => (
                          <li key={idx}>{material}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {product.features && product.features.length > 0 && (
                <div className="pdp-accordion-item">
                  <button 
                    className="pdp-accordion-header" 
                    onClick={() => toggleSection('features')}
                  >
                    Key Features
                    {openSections['features'] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  {openSections['features'] && (
                    <div className="pdp-accordion-content">
                      <div className="pdp-features-list">
                        {product.features.map((feature, idx) => (
                          <div key={idx} className="pdp-feature-item">
                            <span className="pdp-feature-bullet" />
                            <div>
                              <strong className="pdp-feature-label text-white">{feature.label}:</strong>{' '}
                              <span className="pdp-feature-desc">{feature.description}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {product.tags && product.tags.length > 0 && (
                <div className="pdp-accordion-item">
                  <button 
                    className="pdp-accordion-header" 
                    onClick={() => toggleSection('tags')}
                  >
                    Product Tags
                    {openSections['tags'] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  {openSections['tags'] && (
                    <div className="pdp-accordion-content">
                      <div className="pdp-tags-container">
                        {product.tags.map((tag, idx) => (
                          <span key={idx} className="pdp-tag-pill">{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
            </div>

          </div>
        </div>
        
        {/* Reviews Section */}
        <ProductReviewsSection productId={product.id} />
      </Container>
    </div>
  );
}
