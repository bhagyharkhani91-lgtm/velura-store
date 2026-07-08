import { useEffect, useState } from 'react';
import { Star, Trash2, Edit2, X, Check } from 'lucide-react';
import { useReviewsStore } from '../../../stores/reviewsStore';
import { Button } from '../../../components/ui/Button/Button';

export function AdminReviewsPage() {
  const { reviews, fetchAllReviews, deleteReview, updateReviewContent, isLoading } = useReviewsStore();
  const [editingReview, setEditingReview] = useState<{id: string, content: string, rating: number} | null>(null);

  useEffect(() => {
    fetchAllReviews();
  }, [fetchAllReviews]);

  const handleSaveEdit = async () => {
    if (!editingReview) return;
    try {
      await updateReviewContent(editingReview.id, editingReview.content, editingReview.rating);
      setEditingReview(null);
    } catch (error) {
      console.error("Failed to save review edit", error);
      alert("Failed to save review");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="heading-3xl">Customer Reviews</h1>
      </div>

      <div className="bg-surface rounded-lg border border-border overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-secondary">Loading reviews...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-secondary text-secondary text-sm border-b border-border">
                <th className="p-4 font-medium">Product / User</th>
                <th className="p-4 font-medium">Rating</th>
                <th className="p-4 font-medium">Review</th>
                <th className="p-4 font-medium">Photos</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(review => (
                <tr key={review.id} className="border-b border-border hover:bg-bg-hover transition-colors">
                  <td className="p-4 align-top">
                    <div className="font-medium text-primary">{(review as any).productName || 'Unknown Product'}</div>
                    <div className="text-xs text-secondary mt-1">{review.userEmail}</div>
                  </td>
                  <td className="p-4 align-top">
                    {editingReview?.id === review.id ? (
                      <div className="flex gap-1 items-center bg-bg-secondary p-1 rounded inline-flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setEditingReview({...editingReview, rating: star})}
                            className="focus:outline-none"
                          >
                            <Star 
                              size={14} 
                              fill={star <= editingReview.rating ? "#FACC15" : "none"} 
                              color={star <= editingReview.rating ? "#FACC15" : "#4B5563"} 
                            />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            size={12} 
                            fill={star <= review.rating ? "#FACC15" : "none"} 
                            color={star <= review.rating ? "#FACC15" : "#4B5563"} 
                          />
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="p-4 max-w-md align-top">
                    {editingReview?.id === review.id ? (
                      <div className="flex flex-col gap-2">
                        <textarea
                          className="w-full bg-bg-secondary border border-border rounded p-2 text-sm text-primary focus:outline-none focus:border-accent min-h-[80px]"
                          value={editingReview.content}
                          onChange={(e) => setEditingReview({...editingReview, content: e.target.value})}
                        />
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" size="sm" onClick={() => setEditingReview(null)}>Cancel</Button>
                          <Button size="sm" onClick={handleSaveEdit}>Save</Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm whitespace-pre-wrap">{review.content}</p>
                        <span className="text-xs text-secondary mt-1 block">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </td>
                  <td className="p-4 align-top">
                    {review.images && review.images.length > 0 ? (
                      <span className="text-xs bg-bg-secondary px-2 py-1 rounded text-primary">
                        {review.images.length} Image(s)
                      </span>
                    ) : (
                      <span className="text-xs text-secondary">-</span>
                    )}
                  </td>
                  <td className="p-4 align-top">
                    {editingReview?.id !== review.id && (
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setEditingReview({id: review.id, content: review.content, rating: review.rating})} 
                          className="text-secondary hover:text-primary transition-colors p-1"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <div className="w-px h-4 bg-border self-center mx-1"></div>
                        <button 
                          onClick={() => {
                            if (window.confirm("Are you sure you want to permanently delete this review?")) {
                              deleteReview(review.id);
                            }
                          }} 
                          className="text-secondary hover:text-error transition-colors p-1"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              
              {reviews.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-secondary">
                    No reviews found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
