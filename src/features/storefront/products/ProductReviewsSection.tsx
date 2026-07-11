import { useState, useEffect } from 'react';
import { Star, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '../../../components/ui/Button/Button';
import { useReviewsStore } from '../../../stores/reviewsStore';
import { useAuthStore } from '../../../stores/authStore';
import { useUIStore } from '../../../stores/uiStore';
import { validateImageUpload } from '../../../utils';

interface ProductReviewsSectionProps {
  productId: string;
}

export function ProductReviewsSection({ productId }: ProductReviewsSectionProps) {
  const { user } = useAuthStore();
  const { reviews, fetchProductReviews, addReview, isLoading } = useReviewsStore();
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    fetchProductReviews(productId);
  }, [productId, fetchProductReviews]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    let hasError = false;
    
    // Limit to 3 images max
    const newFiles = files.slice(0, 3 - imageUrls.length);
    
    newFiles.forEach(file => {
      const { isValid, error } = validateImageUpload(file);
      
      if (!isValid) {
        alert(error);
        hasError = true;
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrls(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
    
    if (hasError && e.target) {
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const { addToast } = useUIStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      await addReview(productId, user.id, rating, content, imageUrls);
      await fetchProductReviews(productId);
      setSubmitSuccess(true);
      setShowReviewForm(false);
      setContent('');
      setImageUrls([]);
      setRating(5);
    } catch (error: any) {
      console.error("Failed to submit review:", error);
      addToast({
        title: 'Review Submission Failed',
        message: error?.message || 'Please make sure you have run the supabase_reviews.sql script in your Supabase SQL editor!',
        type: 'error',
        duration: 8000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-16 border-t border-border pt-12 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="heading-2xl">Customer Reviews</h2>
          <p className="text-secondary mt-1">Real experiences from our community</p>
        </div>
        
        {!showReviewForm && !submitSuccess && (
          <Button 
            onClick={() => setShowReviewForm(true)}
            disabled={!user}
            title={!user ? "Please login to leave a review" : ""}
          >
            Write a Review
          </Button>
        )}
      </div>

      {!user && !showReviewForm && (
        <div className="bg-bg-secondary p-4 rounded-lg mb-8 text-center text-sm text-secondary">
          Please <a href="/login" className="text-primary underline">login</a> to leave a review.
        </div>
      )}

      {submitSuccess && (
        <div className="bg-success-muted/20 border border-success-muted text-success p-4 rounded-lg mb-8">
          Thank you for your review!
        </div>
      )}

      {showReviewForm && user && (
        <form onSubmit={handleSubmit} className="bg-bg-secondary p-6 rounded-lg mb-10 border border-border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="heading-xl">Write a Review</h3>
            <button type="button" onClick={() => setShowReviewForm(false)} className="text-secondary hover:text-white">
              <X size={20} />
            </button>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-secondary mb-2">Overall Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-colors"
                >
                  <Star 
                    size={24} 
                    fill={star <= rating ? "#FACC15" : "none"} 
                    color={star <= rating ? "#FACC15" : "#4B5563"} 
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-secondary mb-2">Your Review</label>
            <textarea 
              required
              rows={4}
              placeholder="Tell us what you liked or didn't like about this product..."
              className="w-full bg-surface border border-border rounded-md px-4 py-3 text-primary focus:outline-none focus:border-accent resize-none"
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-secondary mb-2">Attach Photos (Max 3)</label>
            
            {imageUrls.length > 0 && (
              <div className="flex gap-4 mb-3">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative w-20 h-20 rounded-md overflow-hidden border border-border group">
                    <img src={url} alt="Review upload" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {imageUrls.length < 3 && (
              <label className="w-max inline-flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-md cursor-pointer hover:bg-bg-hover transition-colors text-sm font-medium mt-1">
                <ImageIcon size={18} />
                <span>Add Photo</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  className="sr-only" 
                  onChange={handleImageUpload}
                  disabled={imageUrls.length >= 3}
                />
              </label>
            )}
          </div>

          <div className="flex justify-end items-center gap-4 pt-6 mt-4 border-t border-border">
            <Button variant="outline" type="button" onClick={() => setShowReviewForm(false)}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>Submit Review</Button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="text-secondary py-8 text-center">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-secondary py-12 text-center border border-dashed border-border rounded-lg">
          <p>No reviews yet. Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map(review => (
            <div key={review.id} className="bg-bg-secondary p-6 rounded-lg border border-border">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star}
                      size={14} 
                      fill={star <= review.rating ? "#FACC15" : "none"} 
                      color={star <= review.rating ? "#FACC15" : "#4B5563"} 
                    />
                  ))}
                </div>
                <span className="text-xs text-secondary">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <p className="text-sm text-primary mb-4 whitespace-pre-wrap">{review.content}</p>
              
              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {review.images.map((url, idx) => (
                    <div key={idx} className="w-16 h-16 rounded overflow-hidden border border-border">
                      <img src={url} alt="Review" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
              
              <div className="text-xs text-secondary font-medium mt-auto">
                By {review.userEmail}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
