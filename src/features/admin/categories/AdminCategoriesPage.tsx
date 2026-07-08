import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button/Button';
import { Plus, Search, Edit, Trash2, ExternalLink, ChevronDown, ChevronRight, Package, X } from 'lucide-react';
import { useCategoryStore } from '../../../stores/categoryStore';
import { useProductStore } from '../../../stores/productStore';

import type { Category } from '../../../stores/categoryStore';
import { formatPrice } from '../../../utils';

import { AssignProductsModal } from './AssignProductsModal';

export function AdminCategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategoryStore();
  const { products, updateProduct, deleteProduct } = useProductStore();
  const [searchTerm, setSearchTerm] = useState('');

  // Ensure default categories exist (like Top Men and Top Women) if not present in browser storage
  React.useEffect(() => {
    const requiredSlugs = ['top-men', 'top-women'];
    requiredSlugs.forEach(slug => {
      if (!categories.some(c => c.slug === slug)) {
        if (slug === 'top-men') {
          addCategory({ name: 'Top Men', description: 'Our top premium collection for men.' });
        } else if (slug === 'top-women') {
          addCategory({ name: 'Top Women', description: 'Our top premium collection for women.' });
        }
      }
    });
  }, [categories, addCategory]);
  
  // Category Form Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  // Assign Products Modal
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assigningCategory, setAssigningCategory] = useState<Category | null>(null);
  
  // Expandable Rows
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (categoryId: string) => {
    const next = new Set(expandedCategories);
    if (next.has(categoryId)) {
      next.delete(categoryId);
    } else {
      next.add(categoryId);
    }
    setExpandedCategories(next);
  };

  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditCategory = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description });
    setIsModalOpen(true);
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategory(editingCategory.id, { name: formData.name, description: formData.description });
    } else {
      addCategory({ name: formData.name, description: formData.description });
    }
    setIsModalOpen(false);
  };

  const handleAssignProducts = (category: Category) => {
    setAssigningCategory(category);
    setIsAssignModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="heading-3xl">Categories Management</h1>
        <Button leftIcon={<Plus size={18} />} onClick={handleOpenAddCategory}>Add Category</Button>
      </div>

      <div className="bg-surface rounded-lg border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={18} />
            <input 
              type="text" 
              placeholder="Search categories..." 
              className="w-full bg-bg-secondary border border-border rounded-md pl-10 pr-4 py-2 text-primary focus:outline-none focus:border-accent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg-secondary text-secondary text-sm border-b border-border">
              <th className="p-4 w-10"></th>
              <th className="p-4 font-medium">Category Name</th>
              <th className="p-4 font-medium">Products</th>
              <th className="p-4 font-medium">Description</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map(category => {
              const isExpanded = expandedCategories.has(category.id);
              const categoryProducts = products.filter(p => p.categoryId === category.slug);

              return (
                <React.Fragment key={category.id}>
                  <tr className="border-b border-border hover:bg-bg-hover transition-colors">
                    <td className="p-4 text-center cursor-pointer" onClick={() => toggleExpand(category.id)}>
                      <button className="text-secondary hover:text-primary transition-colors">
                        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <button 
                          className="font-medium text-primary hover:text-accent text-left transition-colors" 
                          onClick={() => handleOpenEditCategory(category)}
                        >
                          {category.name}
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-secondary">
                        <Package size={16} />
                        <span>{categoryProducts.length} items</span>
                      </div>
                    </td>
                    <td className="p-4 text-secondary text-sm truncate max-w-xs">{category.description}</td>
                    <td className="p-4">
                      <div className="flex justify-end gap-3">
                        <a href={`/categories/${category.slug}`} target="_blank" rel="noreferrer" className="inline-flex text-secondary hover:text-primary transition-colors">
                          <ExternalLink size={18} />
                        </a>
                        <button onClick={() => handleOpenEditCategory(category)} className="text-secondary hover:text-accent transition-colors">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => deleteCategory(category.id)} className="text-secondary hover:text-error transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded Products View */}
                  {isExpanded && (
                    <tr className="border-b border-border bg-bg-secondary/30">
                      <td colSpan={5} className="p-6">
                        <div className="bg-bg-primary rounded-lg border border-border overflow-hidden">
                          <div className="flex justify-between items-center p-3 border-b border-border bg-surface">
                            <h4 className="font-medium text-primary text-sm flex items-center gap-2">
                              Products in {category.name}
                            </h4>
                            <Button size="sm" variant="outline" leftIcon={<Edit size={14} />} onClick={() => handleAssignProducts(category)}>
                              Assign Products
                            </Button>
                          </div>
                          
                          {categoryProducts.length === 0 ? (
                            <div className="p-6 text-center text-secondary text-sm">
                              No products assigned to this category.
                            </div>
                          ) : (
                            <table className="w-full text-sm">
                              <tbody>
                                {categoryProducts.map(product => (
                                  <tr key={product.id} className="border-b border-border last:border-0 hover:bg-bg-hover">
                                    <td className="p-3">
                                      <div className="flex items-center gap-3">
                                        {product.images && product.images[0] ? (
                                          <img src={product.images[0].url} alt={product.name} className="w-8 h-8 object-cover rounded" />
                                        ) : (
                                          <div className="w-8 h-8 bg-bg-secondary rounded flex-shrink-0" />
                                        )}
                                        <span className="font-medium text-primary">{product.name}</span>
                                      </div>
                                    </td>
                                    <td className="p-3 text-secondary">{formatPrice(product.price)}</td>
                                    <td className="p-3">
                                      <span className={product.stockCount > 0 ? "text-primary" : "text-error"}>{product.stockCount} in stock</span>
                                    </td>
                                    <td className="p-3">
                                      <div className="flex justify-end gap-3">
                                        <a 
                                          href={`/products/${product.slug}`} 
                                          target="_blank" 
                                          rel="noreferrer" 
                                          className="text-secondary hover:text-accent"
                                          title="View Product"
                                        >
                                          <ExternalLink size={16} />
                                        </a>
                                        <button
                                          onClick={() => {
                                            if (window.confirm(`Are you sure you want to remove "${product.name}" from the category "${category.name}"?`)) {
                                              updateProduct(product.id, { categoryId: '' });
                                            }
                                          }}
                                          className="text-secondary hover:text-warning transition-colors bg-transparent border-none p-0 cursor-pointer"
                                          title="Remove from Category"
                                        >
                                          <X size={16} />
                                        </button>
                                        <button
                                          onClick={() => {
                                            if (window.confirm(`Are you sure you want to permanently delete "${product.name}" from the catalog?`)) {
                                              deleteProduct(product.id);
                                            }
                                          }}
                                          className="text-secondary hover:text-error transition-colors bg-transparent border-none p-0 cursor-pointer"
                                          title="Delete Product"
                                        >
                                          <Trash2 size={16} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
            
            {filteredCategories.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-secondary">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Category Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black-80 flex items-center justify-center z-100 p-4">
          <div className="bg-surface border border-border rounded-xl w-full max-w-lg p-6">
            <h2 className="heading-2xl mb-6">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
            
            <form onSubmit={handleCategorySubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Category Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-bg-secondary border border-border rounded-md px-4 py-2 text-primary focus:outline-none focus:border-accent"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Description</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full bg-bg-secondary border border-border rounded-md px-4 py-2 text-primary focus:outline-none focus:border-accent resize-none"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border">
                <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit">Save Category</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Products Modal */}
      <AssignProductsModal 
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        category={assigningCategory}
      />
    </div>
  );
}
