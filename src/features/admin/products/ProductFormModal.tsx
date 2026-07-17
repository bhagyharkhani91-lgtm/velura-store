import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button/Button';
import { Trash2, CloudUpload } from 'lucide-react';
import { useProductStore } from '../../../stores/productStore';
import { useCategoryStore } from '../../../stores/categoryStore';
import { validateImageUpload, uploadToCloudinary } from '../../../utils';
import type { Product } from '../../../types/product';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct?: Product | null;
  initialCategoryId?: string;
}

export function ProductFormModal({ isOpen, onClose, editingProduct, initialCategoryId }: ProductFormModalProps) {
  const { addProduct, updateProduct } = useProductStore();
  const { categories } = useCategoryStore();
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    compareAtPrice: '',
    isOnSale: false,
    categoryId: initialCategoryId || '',
    shortDescription: '',
    description: '',
    stockCount: '10',
    imageUrls: [] as string[],
    hasDiscreetShipping: true,
    warrantyText: '1 Year Warranty',
    shippingCharge: '0',
    deliveryTime: '',
    sizes: '',
    colors: ''
  });

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        price: editingProduct.price.toString(),
        compareAtPrice: editingProduct.compareAtPrice ? editingProduct.compareAtPrice.toString() : '',
        isOnSale: editingProduct.isOnSale ?? false,
        categoryId: editingProduct.categoryId,
        shortDescription: editingProduct.shortDescription,
        description: editingProduct.description || '',
        stockCount: editingProduct.stockCount.toString(),
        imageUrls: editingProduct.images ? editingProduct.images.map(img => img.url) : [],
        hasDiscreetShipping: editingProduct.hasDiscreetShipping ?? true,
        warrantyText: editingProduct.warrantyText ?? '1 Year Warranty',
        shippingCharge: editingProduct.shippingCharge ? editingProduct.shippingCharge.toString() : '0',
        deliveryTime: editingProduct.deliveryTime || '',
        sizes: editingProduct.sizes?.join(', ') || '',
        colors: editingProduct.colors?.join(', ') || ''
      });
    } else {
      setFormData({
        name: '',
        price: '',
        compareAtPrice: '',
        isOnSale: false,
        categoryId: initialCategoryId || '',
        shortDescription: '',
        description: '',
        stockCount: '10',
        imageUrls: [],
        hasDiscreetShipping: true,
        warrantyText: '1 Year Warranty',
        shippingCharge: '0',
        deliveryTime: '',
        sizes: '',
        colors: ''
      });
    }
  }, [editingProduct, initialCategoryId, isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    let hasError = false;
    
    files.forEach(file => {
      const { isValid, error } = validateImageUpload(file);
      
      if (!isValid) {
        alert(error);
        hasError = true;
        return;
      }
      
      uploadToCloudinary(file).then(result => {
        setFormData(prev => ({ 
          ...prev, 
          imageUrls: [...prev.imageUrls, result.url] 
        }));
      }).catch(err => {
        alert('Image upload failed: ' + err.message);
      });
    });
    
    if (hasError && e.target) {
      e.target.value = ''; // Reset input if there was an error
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formData.name,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined,
        isOnSale: formData.isOnSale,
        categoryId: formData.categoryId,
        shortDescription: formData.shortDescription,
        description: formData.description,
        stockCount: parseInt(formData.stockCount, 10),
        images: formData.imageUrls.map((url, idx) => ({
          id: editingProduct.images?.[idx]?.id || `img-${Date.now()}-${idx}`,
          url,
          alt: `${formData.name} ${idx + 1}`,
          isPrimary: idx === 0
        })),
        hasDiscreetShipping: formData.hasDiscreetShipping,
        warrantyText: formData.warrantyText,
        shippingCharge: parseFloat(formData.shippingCharge) || 0,
        deliveryTime: formData.deliveryTime,
        sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
        colors: formData.colors.split(',').map(c => c.trim()).filter(Boolean)
      });
    } else {
      addProduct({
        name: formData.name,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined,
        categoryId: formData.categoryId,
        shortDescription: formData.shortDescription,
        description: formData.description,
        images: formData.imageUrls.map((url, idx) => ({
          id: `img-${Date.now()}-${idx}`,
          url,
          alt: `${formData.name} ${idx + 1}`,
          isPrimary: idx === 0
        })),
        variants: [],
        features: [],
        materials: [],
        tags: [],
        rating: 5,
        reviewCount: 0,
        inStock: parseInt(formData.stockCount, 10) > 0,
        stockCount: parseInt(formData.stockCount, 10),
        isNew: true,
        isBestSeller: false,
        isFeatured: false,
        isOnSale: formData.isOnSale,
        seoTitle: formData.name,
        seoDescription: formData.shortDescription,
        status: 'published',
        publishedAt: new Date().toISOString(),
        hasDiscreetShipping: formData.hasDiscreetShipping,
        warrantyText: formData.warrantyText,
        shippingCharge: parseFloat(formData.shippingCharge) || 0,
        deliveryTime: formData.deliveryTime,
        sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
        colors: formData.colors.split(',').map(c => c.trim()).filter(Boolean)
      });
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black-80 flex items-center justify-center z-100 p-4">
      <div className="bg-surface border border-border rounded-xl w-full max-w-lg max-h-90vh flex flex-col overflow-hidden">
        <div className="p-6 border-b border-border flex-shrink-0">
          <h2 className="heading-2xl">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 min-h-0">
          <form id="product-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">Product Name</label>
            <input 
              type="text" 
              required
              className="w-full bg-bg-secondary border border-border rounded-md px-4 py-2 text-primary focus:outline-none focus:border-accent"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-secondary mb-1">High Price (₹)</label>
              <input 
                type="number" 
                step="0.01"
                placeholder="e.g. 150.00"
                className="w-full bg-bg-secondary border border-border rounded-md px-4 py-2 text-primary focus:outline-none focus:border-accent"
                value={formData.compareAtPrice}
                onChange={e => setFormData({...formData, compareAtPrice: e.target.value})}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-secondary mb-1">Selling Price (₹)</label>
              <input 
                type="number" 
                required
                step="0.01"
                className="w-full bg-bg-secondary border border-border rounded-md px-4 py-2 text-primary focus:outline-none focus:border-accent"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-secondary mb-1">Shipping Charge (₹)</label>
              <input 
                type="number" 
                required
                step="0.01"
                className="w-full bg-bg-secondary border border-border rounded-md px-4 py-2 text-primary focus:outline-none focus:border-accent"
                value={formData.shippingCharge}
                onChange={e => setFormData({...formData, shippingCharge: e.target.value})}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-secondary mb-1">Stock Count</label>
              <input 
                type="number" 
                required
                className="w-full bg-bg-secondary border border-border rounded-md px-4 py-2 text-primary focus:outline-none focus:border-accent"
                value={formData.stockCount}
                onChange={e => setFormData({...formData, stockCount: e.target.value})}
              />
            </div>
            <div className="flex-1 flex items-center gap-2 mt-6">
              <input 
                type="checkbox" 
                id="isOnSale"
                className="w-4 h-4 bg-bg-secondary border-border rounded text-accent focus:ring-accent"
                checked={formData.isOnSale}
                onChange={e => setFormData({...formData, isOnSale: e.target.checked})}
              />
              <label htmlFor="isOnSale" className="text-sm font-medium text-secondary cursor-pointer">Mark as On Sale</label>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1 flex items-center gap-2 mt-6">
              <input 
                type="checkbox" 
                id="discreetShipping"
                className="w-4 h-4 bg-bg-secondary border-border rounded text-accent focus:ring-accent"
                checked={formData.hasDiscreetShipping}
                onChange={e => setFormData({...formData, hasDiscreetShipping: e.target.checked})}
              />
              <label htmlFor="discreetShipping" className="text-sm font-medium text-secondary cursor-pointer">Discreet Shipping</label>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-secondary mb-1">Warranty Info</label>
              <input 
                type="text" 
                className="w-full bg-bg-secondary border border-border rounded-md px-4 py-2 text-primary focus:outline-none focus:border-accent"
                value={formData.warrantyText}
                placeholder="e.g. 1 Year Warranty (leave blank if none)"
                onChange={e => setFormData({...formData, warrantyText: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1">Delivery Time</label>
            <input 
              type="text" 
              className="w-full bg-bg-secondary border border-border rounded-md px-4 py-2 text-primary focus:outline-none focus:border-accent"
              value={formData.deliveryTime}
              placeholder="e.g. 2 day delivery, 3-5 days"
              onChange={e => setFormData({...formData, deliveryTime: e.target.value})}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-secondary mb-1">Available Sizes</label>
              <input 
                type="text" 
                className="w-full bg-bg-secondary border border-border rounded-md px-4 py-2 text-primary focus:outline-none focus:border-accent"
                value={formData.sizes}
                placeholder="e.g. S, M, L, XL"
                onChange={e => setFormData({...formData, sizes: e.target.value})}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-secondary mb-1">Available Colors</label>
              <input 
                type="text" 
                className="w-full bg-bg-secondary border border-border rounded-md px-4 py-2 text-primary focus:outline-none focus:border-accent"
                value={formData.colors}
                placeholder="e.g. Red, Blue, Black"
                onChange={e => setFormData({...formData, colors: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">Category</label>
            <select 
              required
              className="w-full bg-bg-secondary border border-border rounded-md px-4 py-2 text-primary focus:outline-none focus:border-accent"
              value={formData.categoryId}
              onChange={e => setFormData({...formData, categoryId: e.target.value})}
            >
              <option value="" disabled>Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">Short Description</label>
            <textarea 
              required
              rows={3}
              className="w-full bg-bg-secondary border border-border rounded-md px-4 py-2 text-primary focus:outline-none focus:border-accent resize-none"
              value={formData.shortDescription}
              onChange={e => setFormData({...formData, shortDescription: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">Long Description (Detailed)</label>
            <textarea 
              required
              rows={6}
              className="w-full bg-bg-secondary border border-border rounded-md px-4 py-2 text-primary focus:outline-none focus:border-accent resize-none"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Product Images</label>
            
            {formData.imageUrls.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mb-4">
                {formData.imageUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square border border-border rounded-lg overflow-hidden bg-bg-secondary group">
                    <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                    {index === 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-accent text-white text-[10px] text-center py-1">
                        Primary
                      </div>
                    )}
                    <button 
                      type="button" 
                      onClick={(e) => {
                        e.preventDefault();
                        setFormData(prev => ({
                          ...prev,
                          imageUrls: prev.imageUrls.filter((_, i) => i !== index)
                        }));
                      }}
                      className="absolute top-1 right-1 bg-error/90 text-white rounded-full p-1.5 shadow-md hover:bg-error transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <label 
              className="relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors min-h-[120px] cursor-pointer hover:bg-bg-hover"
              style={{ borderColor: '#60A5FA', backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
            >
              <div className="text-center">
                <CloudUpload size={28} className="mx-auto mb-2" style={{ color: '#3B82F6' }} />
                <p className="text-sm font-medium" style={{ color: '#9CA3AF' }}>
                  Drag & Drop images or <span style={{ color: '#3B82F6', textDecoration: 'underline' }}>Browse</span>
                </p>
                <p className="text-xs mt-1 text-secondary">You can select multiple files</p>
              </div>
              <input 
                type="file" 
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>
          </form>
        </div>
        
        <div className="p-6 border-t border-border bg-surface flex justify-end gap-3 flex-shrink-0 rounded-b-xl">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="product-form">Save Product</Button>
        </div>
      </div>
    </div>
  );
}
