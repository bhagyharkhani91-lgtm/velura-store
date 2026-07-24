import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Container } from '../../../components/layout/Container/Container';
import { ProductCard } from '../../../components/commerce/ProductCard/ProductCard';
import { useProductStore } from '../../../stores/productStore';
import { useCategoryStore } from '../../../stores/categoryStore';
import { EmptyState } from '../../../components/ui/EmptyState/EmptyState';

export function CategoryPage() {
  const { categoryId } = useParams();
  const { products, isLoading, fetchProducts } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchProducts().finally(() => {
      setInitialFetchDone(true);
    });
  }, [fetchCategories, fetchProducts]);

  const category = categories.find(c => c.slug === categoryId);
  const categoryName = category ? category.name : categoryId?.replace('-', ' ');

  const displayProducts = products.filter(p => p.categoryIds.includes(categoryId || ''));

  if (!initialFetchDone && products.length === 0) {
    return (
      <Container style={{ paddingTop: '60px', paddingBottom: '100px', minHeight: '60vh' }}>
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-secondary mb-4" />
          <p className="text-secondary text-sm">Loading products...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container style={{ paddingTop: '60px', paddingBottom: '100px', minHeight: '60vh' }}>
      {isLoading && (
        <div className="flex items-center justify-center py-2">
          <Loader2 size={14} className="animate-spin text-secondary mr-2" />
          <span className="text-secondary text-xs">Refreshing...</span>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="heading-4xl capitalize text-white mb-2">{categoryName}</h1>
          <p className="text-secondary text-sm">Showing {displayProducts.length} products</p>
        </div>

        <div className="flex gap-4">
          <select className="bg-bg-secondary text-text-primary border border-border rounded-md px-4 py-2 text-sm">
            <option>Sort by: Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>
      </div>

      {displayProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {displayProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No products found"
          description={`We couldn't find any products in the ${categoryName} category.`}
        />
      )}
    </Container>
  );
}
