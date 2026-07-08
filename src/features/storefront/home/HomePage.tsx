import { Container } from '../../../components/layout/Container/Container';
import { ProductCard } from '../../../components/commerce/ProductCard/ProductCard';
import { Hero } from '../../../components/commerce/Hero/Hero';
import { useProductStore } from '../../../stores/productStore';
import { Button } from '../../../components/ui/Button/Button';
import { Link } from 'react-router-dom';
import { GenderSplitTeaser } from '../../../components/commerce/GenderSplitTeaser/GenderSplitTeaser';
import './HomePage.css';

export function HomePage() {
  const { products } = useProductStore();

  // Filter men's products strictly by category assignment
  const allMenProducts = products.filter(p => p.categoryId === 'men-toys' || p.categoryId === 'top-men');

  // Filter women's products strictly by category assignment
  const allWomenProducts = products.filter(p => p.categoryId === 'women-toys' || p.categoryId === 'top-women');

  // Slice first 4 for display
  const displayMenProducts = allMenProducts.slice(0, 4);
  const displayWomenProducts = allWomenProducts.slice(0, 4);

  // Check if we have more products than displayed
  const hasMoreMen = allMenProducts.length > 4;
  const hasMoreWomen = allWomenProducts.length > 4;

  // Category Links
  const menLink = '/categories/men-toys';
  const womenLink = '/categories/women-toys';

  return (
    <div style={{ backgroundColor: 'var(--color-bg-primary)', minHeight: '100vh' }}>
      <Hero />

      <section className="mens-section">
        <Container>
          <div className="mens-section-heading-container">
            <h2 className="mens-section-heading heading-display">
              TOP MEN PRODUCTS
            </h2>
          </div>
          {displayMenProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
              {displayMenProducts.map(product => (
                <ProductCard key={`men-${product.id}`} product={product} />
              ))}
              
              {hasMoreMen ? (
                <div className="discover-more-card men">
                  <div className="discover-more-overlay" />
                  <div className="discover-more-content">
                    <div className="discover-more-icon-container">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                    <p className="discover-more-text">Discover our premium collection for him.</p>
                    <Link to={menLink} className="discover-more-link">
                      <Button variant="outline" className="discover-more-btn">SEE MORE</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center bg-bg-secondary/50 border border-border text-secondary rounded-lg p-6 text-center h-full">
                  <p className="text-sm font-medium">No more products</p>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center border border-border rounded-lg bg-bg-secondary/30">
              <p className="text-secondary text-lg">No more products</p>
            </div>
          )}
        </Container>
      </section>

      <GenderSplitTeaser />

      <section className="womens-section">
        <Container>
          <div className="womens-section-heading-container">
            <h2 className="womens-section-heading heading-display">
              TOP WOMEN PRODUCTS
            </h2>
          </div>
          {displayWomenProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
              {displayWomenProducts.map(product => (
                <ProductCard key={`women-${product.id}`} product={product} />
              ))}
              
              {hasMoreWomen ? (
                <div className="discover-more-card women">
                  <div className="discover-more-overlay" />
                  <div className="discover-more-content">
                    <div className="discover-more-icon-container">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                    <p className="discover-more-text">Discover our premium collection for her.</p>
                    <Link to={womenLink} className="discover-more-link">
                      <Button variant="outline" className="discover-more-btn">SEE MORE</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center bg-bg-secondary/50 border border-border text-secondary rounded-lg p-6 text-center h-full">
                  <p className="text-sm font-medium">No more products</p>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center border border-border rounded-lg bg-bg-secondary/30">
              <p className="text-secondary text-lg">No more products</p>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
