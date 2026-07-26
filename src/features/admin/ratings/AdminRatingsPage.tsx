import { useEffect, useState, useRef } from 'react';
import { Star, Upload, X, Trash2, Search, Image } from 'lucide-react';
import { useProductStore } from '../../../stores/productStore';
import { useReviewsStore } from '../../../stores/reviewsStore';
import { Button } from '../../../components/ui/Button/Button';
import { uploadToCloudinary } from '../../../utils';
import './AdminRatingsPage.css';

export function AdminRatingsPage() {
  const { products, fetchProducts } = useProductStore();
  const { reviews, fetchAllReviews, addCustomReview, deleteReview, isLoading } = useReviewsStore();
  const [search, setSearch] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts();
    fetchAllReviews();
  }, [fetchProducts, fetchAllReviews]);

  const publishedProducts = products.filter(p => p.status !== 'archived' && p.status !== 'draft');
  const filteredProducts = publishedProducts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const adminReviews = reviews.filter(r => !!r.reviewerName);

  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId === selectedProductId ? null : productId);
    setRating(0);
    setCustomerName('');
    setReviewText('');
    setImages([]);
    setSuccessMessage('');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await uploadToCloudinary(file);
      setImages(prev => [...prev, result.url]);
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!selectedProductId || rating === 0 || !customerName.trim()) return;

    setIsSubmitting(true);
    try {
      await addCustomReview(selectedProductId, rating, reviewText.trim(), images, customerName.trim());
      setRating(0);
      setCustomerName('');
      setReviewText('');
      setImages([]);
      setSuccessMessage('Custom review added successfully!');
      fetchAllReviews();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      console.error('Failed to add review:', err);
      alert(err.message || 'Failed to add review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Delete this custom review?')) return;
    try {
      await deleteReview(reviewId);
      fetchAllReviews();
    } catch (err) {
      console.error('Failed to delete review:', err);
    }
  };

  return (
    <div className="admin-ratings">
      <div className="flex justify-between items-center mb-2">
        <h1 className="heading-3xl">Ratings Management</h1>
      </div>

      <div className="admin-ratings-grid">
        <div className="ratings-panel">
          <div className="ratings-panel-header">
            <h2>Add Custom Rating</h2>
          </div>
          <div className="ratings-panel-body">
            <div className="ratings-product-search">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
            </div>

            <div className="ratings-product-list">
              {filteredProducts.length === 0 && (
                <div className="ratings-product-item" style={{ justifyContent: 'center', color: 'var(--color-text-tertiary)' }}>
                  No products found
                </div>
              )}
              {filteredProducts.map(product => {
                const productReviews = reviews.filter(r => r.productId === product.id && r.status === 'approved');
                const avgRating = productReviews.length > 0
                  ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
                  : 0;

                return (
                  <div
                    key={product.id}
                    className={`ratings-product-item ${selectedProductId === product.id ? 'active' : ''}`}
                    onClick={() => handleSelectProduct(product.id)}
                  >
                    <div className="ratings-product-item-left">
                      {product.images[0] ? (
                        <img src={product.images[0].url} alt="" className="ratings-product-item-image" />
                      ) : (
                        <div className="ratings-product-item-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Image size={16} style={{ color: 'var(--color-text-tertiary)' }} />
                        </div>
                      )}
                      <span className="ratings-product-item-name">{product.name}</span>
                    </div>
                    <div className="ratings-product-item-meta">
                      <div className="ratings-product-item-stars">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            size={12}
                            fill={star <= Math.round(avgRating) ? '#FACC15' : 'none'}
                            color={star <= Math.round(avgRating) ? '#FACC15' : '#4B5563'}
                          />
                        ))}
                      </div>
                      <span className="ratings-product-item-count">({product.reviewCount})</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedProductId && selectedProduct && (
              <div className="ratings-form">
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                  Adding rating for: <strong style={{ color: 'var(--color-text-primary)' }}>{selectedProduct.name}</strong>
                </div>

                <div>
                  <div className="ratings-form-label">Rating</div>
                  <div className="ratings-star-input">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        className="ratings-star-btn"
                        onClick={() => setRating(star)}
                      >
                        <Star
                          size={28}
                          fill={star <= rating ? '#FACC15' : 'none'}
                          color={star <= rating ? '#FACC15' : '#4B5563'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="ratings-form-row">
                  <label className="ratings-form-label">Customer Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                  />
                </div>

                <div className="ratings-form-row">
                  <label className="ratings-form-label">Review Text</label>
                  <textarea
                    placeholder="Write a review..."
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                  />
                </div>

                <div>
                  <div className="ratings-form-label">Photo (optional)</div>
                  <div className="ratings-image-upload">
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      className="ratings-image-upload-btn"
                      onClick={() => fileRef.current?.click()}
                      disabled={isUploading}
                    >
                      <Upload size={14} />
                      {isUploading ? 'Uploading...' : 'Add Photo'}
                    </button>
                    {images.map((url, i) => (
                      <div key={i} className="ratings-image-preview-wrapper">
                        <img src={url} alt="" className="ratings-image-preview" />
                        <button className="ratings-image-remove" onClick={() => removeImage(i)}>
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="ratings-form-actions">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectProduct(selectedProductId)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    isLoading={isSubmitting}
                    disabled={rating === 0 || !customerName.trim() || isUploading}
                    onClick={handleSubmit}
                  >
                    Submit Rating
                  </Button>
                </div>

                {successMessage && (
                  <div style={{
                    background: 'var(--color-success-muted)',
                    color: 'var(--color-success)',
                    padding: 'var(--space-3)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-sm)',
                    textAlign: 'center'
                  }}>
                    {successMessage}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="ratings-panel">
          <div className="ratings-panel-header">
            <h2>Custom Ratings ({adminReviews.length})</h2>
          </div>
          <div className="ratings-panel-body" style={{ padding: 0 }}>
            <div className="ratings-table-wrapper">
              <table className="ratings-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Customer</th>
                    <th>Rating</th>
                    <th>Review</th>
                    <th>Photo</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminReviews.length === 0 && (
                    <tr>
                      <td colSpan={6} className="ratings-table-empty">
                        {isLoading ? 'Loading...' : 'No custom ratings yet'}
                      </td>
                    </tr>
                  )}
                  {adminReviews.map(review => {
                    const reviewProduct = products.find(p => p.id === review.productId);
                    return (
                      <tr key={review.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            {reviewProduct?.images[0] ? (
                              <img src={reviewProduct.images[0].url} alt="" className="ratings-table-image" />
                            ) : (
                              <div className="ratings-table-image-placeholder">
                                <Image size={12} />
                              </div>
                            )}
                            <span className="text-sm" style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {review.productName || reviewProduct?.name || 'Unknown'}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="text-sm font-medium">{review.reviewerName}</span>
                        </td>
                        <td>
                          <div className="ratings-table-stars">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star
                                key={star}
                                size={13}
                                fill={star <= review.rating ? '#FACC15' : 'none'}
                                color={star <= review.rating ? '#FACC15' : '#4B5563'}
                              />
                            ))}
                          </div>
                        </td>
                        <td>
                          <p className="text-sm" style={{ maxWidth: '200px', whiteSpace: 'pre-wrap' }}>
                            {review.content || <span style={{ color: 'var(--color-text-tertiary)' }}>—</span>}
                          </p>
                        </td>
                        <td>
                          {review.images && review.images.length > 0 ? (
                            <a href={review.images[0]} target="_blank" rel="noopener noreferrer">
                              <img src={review.images[0]} alt="" className="ratings-table-image" />
                            </a>
                          ) : (
                            <div className="ratings-table-image-placeholder">—</div>
                          )}
                        </td>
                        <td>
                          <button
                            className="ratings-table-action-btn"
                            onClick={() => handleDeleteReview(review.id)}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
