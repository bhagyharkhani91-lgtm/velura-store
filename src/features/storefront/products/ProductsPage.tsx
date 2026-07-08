import { useSearchParams } from 'react-router-dom';
import { Container } from '../../../components/layout/Container/Container';
import { ProductCard } from '../../../components/commerce/ProductCard/ProductCard';
import { useProductStore } from '../../../stores/productStore';
import { EmptyState } from '../../../components/ui/EmptyState/EmptyState';

export function ProductsPage() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const { products } = useProductStore();

  const displayProducts = searchQuery 
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : products;

  return (
    <Container style={{ paddingTop: '60px', paddingBottom: '100px', minHeight: '60vh' }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="heading-4xl text-white mb-2">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
          </h1>
          <p className="text-secondary text-sm">Showing {displayProducts.length} products</p>
        </div>
        
        {/* Placeholder for future filters */}
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
          description={searchQuery ? `We couldn't find anything matching "${searchQuery}".` : "We couldn't find any products in our store."}
        />
      )}
    </Container>
  );
}
