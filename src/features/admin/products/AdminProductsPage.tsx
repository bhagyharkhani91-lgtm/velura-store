import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../../../components/ui/Button/Button';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useProductStore } from '../../../stores/productStore';
import { formatPrice } from '../../../utils';
import type { Product } from '../../../types/product';
import { ProductFormModal } from './ProductFormModal';

export function AdminProductsPage() {
  const { products, deleteProduct } = useProductStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get('filter') || '';
  
  // State for Add/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(p => {
    if (filter === 'low-stock' && p.stockCount > 10) {
      return false;
    }
    return p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           p.slug.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="heading-3xl">Products Management</h1>
        <Button leftIcon={<Plus size={18} />} onClick={handleOpenAdd}>Add Product</Button>
      </div>

      <div className="bg-surface rounded-lg border border-border overflow-hidden">
        {filter === 'low-stock' && (
          <div className="bg-error-muted/20 border-b border-border px-4 py-3 flex justify-between items-center text-sm text-error font-medium">
            <span>Showing only products with low stock (10 or fewer items remaining).</span>
            <button 
              onClick={() => setSearchParams({})} 
              className="text-accent hover:underline text-xs bg-transparent border-0 cursor-pointer font-semibold"
            >
              Show All Products
            </button>
          </div>
        )}
        <div className="p-4 border-b border-border flex justify-between items-center">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full bg-bg-secondary border border-border rounded-md pl-10 pr-4 py-2 text-primary focus:outline-none focus:border-accent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg-secondary text-secondary text-sm border-b border-border">
              <th className="p-4 font-medium">Product</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Stock</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id} className="border-b border-border hover:bg-bg-hover transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {product.images && product.images[0] ? (
                      <img src={product.images[0].url} alt={product.name} className="w-10 h-10 object-cover rounded flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-10 bg-bg-secondary rounded flex-shrink-0" />
                    )}
                    <div>
                      <button 
                        onClick={() => handleOpenEdit(product)} 
                        className="font-medium text-primary hover:text-accent text-left transition-colors"
                      >
                        {product.name}
                      </button>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-secondary capitalize">{product.categoryIds.join(', ')}</td>
                <td className="p-4">
                  <div>
                    <span className="font-medium">{formatPrice(product.price)}</span>
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <span className="text-secondary text-sm ml-2" style={{ textDecoration: 'line-through' }}>{formatPrice(product.compareAtPrice)}</span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <span className={product.stockCount > 0 ? "text-primary" : "text-error"}>{product.stockCount}</span>
                </td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded ${product.status === 'published' ? 'bg-success-muted text-success' : 'bg-bg-secondary text-secondary'}`}>
                    {product.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => handleOpenEdit(product)} className="text-secondary hover:text-accent transition-colors">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => deleteProduct(product.id)} className="text-secondary hover:text-error transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-secondary">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ProductFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingProduct={editingProduct}
      />
    </div>
  );
}
