import { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { Button } from '../../../components/ui/Button/Button';
import { useProductStore } from '../../../stores/productStore';
import type { Category } from '../../../stores/categoryStore';

interface AssignProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
}

export function AssignProductsModal({ isOpen, onClose, category }: AssignProductsModalProps) {
  const { products, updateProduct } = useProductStore();
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen && category) {
      const initialSelected = new Set(
        products.filter(p => p.categoryIds.includes(category.slug)).map(p => p.id)
      );
      setSelectedProductIds(initialSelected);
      setSearchTerm('');
    }
  }, [isOpen, category, products]);

  if (!isOpen || !category) return null;

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleProduct = (productId: string) => {
    const next = new Set(selectedProductIds);
    if (next.has(productId)) {
      next.delete(productId);
    } else {
      next.add(productId);
    }
    setSelectedProductIds(next);
  };

  const handleSave = () => {
    products.forEach(product => {
      const isSelected = selectedProductIds.has(product.id);
      const isCurrentlyInCategory = product.categoryIds.includes(category.slug);

      if (isSelected && !isCurrentlyInCategory) {
        const newCategoryIds = [...product.categoryIds, category.slug];
        updateProduct(product.id, { categoryIds: newCategoryIds });
      } else if (!isSelected && isCurrentlyInCategory) {
        const newCategoryIds = product.categoryIds.filter(s => s !== category.slug);
        updateProduct(product.id, { categoryIds: newCategoryIds });
      }
    });

    onClose();
  };

  const otherCategories = (productCategories: string[], currentSlug: string) => {
    return productCategories.filter(s => s !== currentSlug);
  };

  return (
    <div className="fixed inset-0 bg-black-80 flex items-center justify-center z-100 p-4">
      <div className="bg-surface border border-border rounded-xl w-full max-w-2xl max-h-90vh flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border">
          <div>
            <h2 className="heading-2xl">Assign Products</h2>
            <p className="text-secondary text-sm mt-1">Select products to include in <strong>{category.name}</strong></p>
          </div>
          <button onClick={onClose} className="text-secondary hover:text-primary transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={18} />
            <input
              type="text"
              placeholder="Search products by name..."
              className="w-full bg-bg-secondary border border-border rounded-md pl-10 pr-4 py-2 text-primary focus:outline-none focus:border-accent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Product List */}
        <div className="flex-1 overflow-y-auto p-2">
          {filteredProducts.length === 0 ? (
            <div className="text-center p-8 text-secondary">No products found.</div>
          ) : (
            <div className="flex flex-col">
              {filteredProducts.map(product => {
                const isSelected = selectedProductIds.has(product.id);
                const otherCatSlugs = otherCategories(product.categoryIds, category.slug);
                return (
                  <label
                    key={product.id}
                    className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors hover:bg-bg-hover ${isSelected ? 'bg-bg-hover' : ''}`}
                  >
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-accent"
                      checked={isSelected}
                      onChange={() => toggleProduct(product.id)}
                    />
                    {product.images && product.images[0] ? (
                      <img src={product.images[0].url} alt={product.name} className="w-10 h-10 object-cover rounded" />
                    ) : (
                      <div className="w-10 h-10 bg-bg-secondary rounded flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-primary">{product.name}</div>
                      <div className="text-xs text-secondary">{product.stockCount} in stock</div>
                    </div>
                    {otherCatSlugs.length > 0 && (
                      <div className="text-xs text-secondary bg-bg-secondary px-2 py-1 rounded">
                        Also in: {otherCatSlugs.join(', ')}
                      </div>
                    )}
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex justify-end gap-3 bg-surface rounded-b-xl">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Assignments ({selectedProductIds.size})</Button>
        </div>

      </div>
    </div>
  );
}
